import {key, ajaxConfig} from "./config";
import login from "./login.js"
import {extend} from "./base.js"
import {store} from "./store.js"

/**
 * ajax请求二次封装
 * @author [luoluo]
 * @version 2.0.0
 */

/**
 * 通用请求方法
 * @overview 全局new一个即可
 * @constructor
 * @param {string} urlHead 请求头部配置
 * @param {string} tokenKey token配置
 */
class Ajax {
  /**
   * 用于缓存请求ID
   */
  temp = {};
  /**
   * 全局配置请求头部
   */
  urlHead = undefined;
  /**
   * 全局配置token
   */
  tokenKey = undefined;
  /**
   * 请求默认配置
   */
  config = {
    id: undefined,
    hasLoading: false,
    confirmText: undefined,
    header: {
      'content-type': "application/x-www-form-urlencoded"
    },
    url: "",
    cache: false,
    urlAuto: true,
    type: "POST",
    data: {},
    dataType: "json"
  };

  /**
   * 通用请求方法
   * 初始化的时候初始化全局请求固定的参数，如请求头部、tokenKey
   * @param {string} urlHead 请求头部配置
   * @param {string} tokenKey token配置
   */
  constructor(urlHead, tokenKey) {
    this.urlHead = urlHead;
    this.tokenKey = tokenKey;
  }

  /**
   * 确认弹窗
   * @param {string} confirmText 确认提示文字
   * @param {function} callback 回调函数
   */
  confirm(confirmText, callback) {
    if (confirmText) {
      wx.showModal({
        title: "确认",
        content: confirmText,
        success: () => {
          callback && callback();
        }
      });
    } else {
      callback && callback();
    }
  }

  /**
   * 判断请求是否锁定
   * @param {string} id 请求唯一ID
   * @param {function} callback 回调函数
   */
  lock(id, callback) {
    if (id) {
      if (!this.temp[id]) {
        callback && callback();
      }
    } else {
      callback && callback();
    }
  }

  /**
   * 发送请求方法
   * @param {object} options 配置
   * @param {string} id 需要锁定ajax请求时，请加入此参数
   * @param {boolean} hasLoading 是否开启loading
   * @param {string} confirmText 确认弹窗提示信息
   * @param {string} type 请求方式
   * @param {object} data 参数
   * @param {boolean} cache 是否缓存结果
   * @param {boolean} urlAuto 是否自动处理请求地址，可以用来处理特殊请求
   */
  request(options) {
    const config = extend(true, {}, this.config, options);
    config.url = config.urlAuto ? this.urlHead + config.url : config.url;
    delete config.urlAuto;
    const token = wx.getStorageSync(this.tokenKey);
    if (token) {
      config.header['Authorization'] = "Bearer " + token;
    }
    return new Promise((resolve, reject) => {
      this.confirm(config.confirmText, () => {
        let key = config.url + (typeof config.data === 'object' ? config.data.string() : '')
        if (config.cache && store.has(key)) {
          resolve(store.get(key));
          return
        }
        if (config.id) {
          if (this.temp[config.id]) {
            reject({
              msg: "加载中，请稍后"
            });
            return
          } else {
            this.temp[config.id] = true
          }
        }
        if (config.hasLoading) {
          wx.showLoading({
            title: ajaxConfig.loadingText,
            mask: true
          });
        }
        wx.request({
          url: config.url,
          method: config.type,
          header: config.header,
          data: config.data,
          dataType: config.dataType,
          complete: (XHR) => {
            delete this.temp[config.id];
            if (config.hasLoading) {
              wx.hideLoading()
            }
            if (XHR.statusCode === 200) {
              // 成功处理逻辑，可以按照项目实际需求进行修改
              if (XHR.data && XHR.data.code === 0) {
                config.success && config.success(XHR.data);
                resolve(XHR.data);
                if (config.cache) {
                  store.set(key, XHR.data)
                }
              } else {
                // 在未登录的时候调起登录方法
                if (XHR.data.code === 10000) {
                  wx.removeStorageSync(this.tokenKey)
                  login().then(() => {
                    this.request(options).then(res => {
                      resolve(res)
                    })
                  })
                } else {
                  config.fail && config.fail(XHR.data);
                  reject(XHR.data);
                }
              }
            } else {
              wx.showToast({
                title: "网络错误，请稍后再试",
                icon: "none",
                duration: 2000
              })
              reject(XHR.data);
            }
            config.complete && config.complete(XHR.data);
          }
        });
      });
    });
  }
}

const ajaxMain = new Ajax(ajaxConfig.urlHead, key.tokenKey);
/**
 * 发送请求方法
 * @overview 传入配置信息。支持success、fail回调，同时也会返回一个Promise,所以支持then、catch写法。
 * @param {string} id 需要锁定ajax请求时，请加入此参数
 * @param {boolean} hasLoading 是否开启loading
 * @param {string} confirmText 确认弹窗提示信息
 * @param {string} type 请求方式
 * @param {object} data 参数
 * @param {boolean} urlAuto 是否自动处理请求地址，可以用来处理特殊请求
 */
export const ajax = (options, page) => {
  return ajaxMain.request(options, page);
};


/**
 * 列表请求方法，使用new函数生成实例，通过内部封装的方法修改参数，发送请求。
 * @param {object} options 配置参数
 * @param {object} page 页面this对象
 */
export class ListAjax {
  constructor(options, page) {
    this.listState = 0;
    this.pageTotal = 1;
    this.listData=[]
    if (page) {
      this.page = page
    } else {
      let pages = getCurrentPages()
      this.page = pages[pages.length - 1]
    }
    this.config = extend(true, {
      name: "listData",
      hasLoading: false,
      url: "",
      urlAuto: true,
      data: {},
      dataType: "json",
      type: "POST",
      isFeedback: true,
      // result: function(res) {
      //   return res
      // }, //添加返回数据处理方法，同步方法
      //once: function(){},//仅处理一次
      success: function () {
      },
      fail: function () {
      },
      complete: function () {
      },
      listState: 0,
      current: 0,
      size: 10
    }, options);
  }

  send(current) {
    if (this.listState !== 0) {
      return;
    }
    this.listState = 1;
    this.listStateChange(1);
    if (current && current <= this.pageTotal) {
      this.config.current = current;
    } else {
      this.config.current++;
    }
    ajax({
      hasLoading: this.config.hasLoading,
      url: this.config.url,
      urlAuto: this.config.urlAuto,
      data: extend(this.config.data, {
        current: this.config.current,
        size: this.config.size
      }),
      dataType: this.config.dataType,
      type: this.config.type,
      complete: res => {
        if (this.config.once) {
          this.config.once(res);
          delete this.config.once;
        }
        if (this.config.complete) {
          this.config.complete(res);
        }
      }
    }).then(res => {
      this.pageTotal = res.data.pages;
      if (this.pageTotal === 0) {
        this.listState = 2;
      } else if (this.pageTotal === this.config.current) {
        this.listState = 3;
      } else {
        this.listState = 0;
      }
      this.listStateChange(this.listState);
      if (res.data.records.length > 0) {
        if (this.config.result) {
          res.data.records = this.config.result(res.data.records);
        }
        if (this.config.current === 1 || !this.page.data.ajaxData[this.config.name]) {
          this.page.dataSync.ajaxData[this.config.name] = res.data.records
        } else {
          this.page.dataSync.ajaxData[this.config.name] = this.page.data.ajaxData[this.config.name].concat(res.data.records)
        }
      } else {
        if (this.config.current === 1 || !this.page.data.ajaxData[this.config.name]) {
          this.page.dataSync.ajaxData[this.config.name] = []
        }
      }
      if (this.config.success) {
        this.config.success(res.data)
      }
    }).catch(err => {
      this.listState = 0;
      this.listStateChange(this.listState);
      if (this.config.fail) {
        this.config.fail(err);
      }
    })
  }

  listStateChange(number) {
    if (!this.page.dataSync.ajaxData.listState) {
      this.page.dataSync.ajaxData.listState = {}
    }
    this.page.dataSync.ajaxData.listState[this.config.name] = number
  }

  /**
   * 新增或改变参数
   * @param {object} data 参数
   */
  changeData(data) {
    this.config.data = extend(true, this.config.data, data);
  }

  /**
   * 删除参数
   * @param {string} name 参数名
   */
  delData(name) {
    delete this.config.data[name];
  }

  /**
   * 改变请求url地址
   * @param {string} url 新的请求地址
   */
  changeURL(url) {
    this.config.url = url;
  }

  /**
   * 重置列表,列表状态
   */
  refreshPage() {
    this.listState = 0;
    this.config.current = 0;
    this.send();
  }

}
