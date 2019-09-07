import { wordLib } from './constants';
import { imgURLHead, ajaxConfig, key} from './config';
import { extend } from './base.js'

/**
 * 工具箱
 * @overview 常用工具方法
 * @author [luoluo]
 * @version 2.0.0
 */

export default {
  /**
   * 图片地址补全
   * @param {string} url 图片地址
   */
  imgUrlCmplement: function(url) {
    return imgURLHead + url
  },
  /**
   * 时间戳转化为指定格式，例yyyy-MM-dd hh:mm:ss ww
   * @param {number} timestamp 时间戳
   * @param {string} format 输出格式
   */
  timeFormat: function(timestamp, format) {
    if (isNaN(timestamp)) {
      return timestamp;
    }
    if (timestamp < 4100000000) {
      timestamp = timestamp * 1000;
    }
    const time = new Date(timestamp);
    
    const week = wordLib.week;
    const y = time.getFullYear();
    const M = time.getMonth() + 1;
    const d = time.getDate();
    const h = time.getHours();
    const m = time.getMinutes();
    const s = time.getSeconds();
    format = format.replace(/[y]{4}/, y);
    format = format.replace(/[M]{2}/, M > 9 ? M : "0" + M);
    format = format.replace(/[d]{2}/, d > 9 ? d : "0" + d);
    format = format.replace(/[h]{2}/, h > 9 ? h : "0" + h);
    format = format.replace(/[m]{2}/, m > 9 ? m : "0" + m);
    format = format.replace(/[s]{2}/, s > 9 ? s : "0" + s);
    format = format.replace(/[w]{2}/, week[time.getDay()]);
    return format;
  },

  /**
   * 时间戳转化为指定格式，例yyyy-mm-dd hh:nn:ss ww
   * @param {number} timestamp 时间戳
   * @param {string} format 输出格式
   */
  parseTime:function(time, cFormat) {
    if (arguments.length === 0) {
      return null
    }
    if (!time) return null
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if (('' + time).length === 10) time = parseInt(time) * 1000
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    return time_str
  },

  /**
   * 日期转化为指定格式
   * @param {string} date 日期
   * @param {string} format 输出格式
   */
  dateFormat: function(date, format) {
    let time;
    try {
      time = new Date(date);
    } catch (e) {
      return date;
    }
    return this.timeFormat(time.getTime(), format);
  },
  /**
   * 时间转化为今天、昨天及具体时间
   * @param {number} timeStamp 时间戳
   * @param {string} format 输出格式
   */
  timeAgoFormat: function(timeStamp, format) {
    if (isNaN(timeStamp)) {
      return timeStamp
    }
    if (timeStamp < 4100000000) {
      timeStamp = timeStamp * 1000
    }
    let nowTime = new Date()
    //雷点，需要考虑时区问题，
    const timeZoneOffset = new Date().getTimezoneOffset()
    const UTCtimeStamp = timeStamp - timeZoneOffset * 60 * 1000
    const nowTimeStamp = nowTime.getTime() - timeZoneOffset * 60 * 1000
    const diff = Math.floor(nowTimeStamp / 86400000) - Math.floor(UTCtimeStamp / 86400000)
    if (diff == 0) {
      return this.timeFormat(timeStamp, format.replace(/mm-dd/i, '今日'))
    } else if (diff == 1) {
      return this.timeFormat(timeStamp, format.replace(/mm-dd/i, '昨日'))
    } else if (diff == -1) {
      return this.timeFormat(timeStamp, format.replace(/mm-dd/i, '明日'))
    } else {
      return this.timeFormat(timeStamp, format)
    }
  },
  /**
   * 价格数据处理，可以取整，取两位小数，或者只取小数
   * @param {number} price 价格
   * @param {string} format 输出格式
   */
  priceFormat: function(price, format) {
    if (isNaN(price)) {
      return price;
    }
    if (format === "int") {
      return Math.floor(price);
    } else if (format === "float") {
      return price.toFixed(2).split(".")[1];
    } else {
      return price.toFixed(2);
    }
  },
  /**
   * 返回两位数，返回格式可能为数字或字符
   * @param {string} num 输入数字
   */
  doubleDigit: function(num) {
    num = parseInt(num);
    return num > 9 ? num : "0" + num;
  },
  /**
   * 只取一个图片地址
   * @param {number} urlString 输入地址
   */
  onlyOneImg: function(urlString) {
    return urlString.split(",")[0];
  },
  /**
   * 返回随机字符串
   * @param {number} length 长度
   */
  randomChars: function(length) {
    let str = ""
    const maxRandom = wordLib.charAndNum.length
    for (var i = 0; i < length; i++) {
      str += wordLib.charAndNum[Math.floor(Math.random() * maxRandom)];
    }
    return str
  },
  /**
   * 时间转化为指定天时分秒
   * @param {number} time 时间单位为秒
   * @param {string} format 输出格式
   */
  timeIntervalChange: function(time, format) {
    if (isNaN(time)) {
      return time;
    }
    time = parseInt(time);
    format = format.replace(/[d]{2}/i, Math.floor(time / 86400));
    format = format.replace(/[h]{2}/i, this.doubleDigit(Math.floor((time % 86400) / 3600)));
    format = format.replace(/[m]{2}/i, this.doubleDigit(Math.floor((time % 3600) / 60)));
    format = format.replace(/[s]{2}/i, this.doubleDigit(Math.floor(time % 60)));
    return format;
  },
  /**
   * 时间差转化，格式为几分钟之前，几个小时之前，具体时间
   * @param {number} time 时间
   */
  timeAgo: function(time) {
    //如果不是数字，则原样返回
    if (isNaN(time)) {
      return time;
    }
    const difference = new Date().getTime() - time;
    if (difference < 60 * 60 * 1000) {
      return Math.floor(difference / (1000 * 60)) + "分钟以前";
    } else if (difference < 24 * 60 * 60 * 1000) {
      return Math.floor(difference / (1000 * 60 * 60)) + "小时以前";
    } else if (difference < 10*24 * 60 * 60 * 1000){
      return Math.floor(difference / (1000 * 60 * 60*24)) + "天以前";
    } else {
      return this.dateFormat(Math.floor(time), "yyyy-MM-dd");
    }
  },
  /**
   * 获取url参数,前面的正则存在bug，本次修复了这个bug
   * @param {string} url url地址
   * @param {string} name 参数名称
   */
  getUrlParam: function(url, name) {
    const reg = new RegExp("(^|[&|?])" + name + "=([^&#]*)(&|$)");
    const r = url.match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  },
  /**
   * 转换数据进制
   * @param {number} num 输入十进制数字
   * @param {number} log 输出进制
   */
  changeLog(num, log) {
    let int = []

    function getInt() {
      const now = num % log;
      int.unshift(now);
      num = Math.floor(num / log);
      if (num > 0) {
        getInt();
      }
    }
    getInt();
    int = int.map(function(item) {
      return wordLib.charAndNum[item];
    });
    return int.join("");
  },
  /**
   * 获取纯净的数据模型
   * @param {number} data 输入数据
   */
  getPureModel(data) {
    return JSON.parse(JSON.stringify(data));
  },
  /**
   * 验证码计时器
   * @param {object} options 配置项
   * @param {object} that 页面this
   */
  verificationCodeTime: function(pageData, options) {
    const setting = extend({
      time: 60,
      text: "获取验证码"
    }, options)
    const stopKey = setInterval(function() {
      setting.text = setting.time + "秒"
      pageData.setData({
        "pageData.verificationCodetext": setting.text
      })
      setting.time--
        if (setting.time < 0) {
          pageData.setData({
            "pageData.verificationCodetext": '获取验证码'
          })
          clearInterval(stopTime)
        }
    }, 1000)
  },
  /**
   * 转换内存大小
   * @param {number} num 输入B单位值
   */
  changeSize(num) {
    num = num - 0
    if (num > 1073741824) {
      return (num / 1073741824).toFixed(2) + "GB"
    } else if (num > 1048576) {
      return (num / 1048576).toFixed(2) + "MB"
    } else if (num > 1024) {
      return (num / 1024).toFixed(2) + "KB"
    } else {
      return num + "B"
    }
  },
  /**
   * 将字符串分割为指定宽度的数组
   * @param {string} str 输入数据
   * @param {number} width 宽度
   */
  splitString(data, width) {
    data = data + ""
    const res = []
    for (var i = 0; i < data.length; i += width) {
      res.push(data.slice(i, i + width))
    }
    return res
  },
  /**
   * canvas中获取文字的换行位置，需要先设置好文字的格式再调用此方法
   * @param {string} str 输入数据
   * @param {number} width 宽度
   */
  getBreakPoint(ctx, text, width, maxLine) {
    if (!text || typeof text !== 'string') {
      return [];
    }
    const textArr = text.split("")
    let result = []
    for (var i = 0, j = 0; i < textArr.length; i++) {
      if (result[j] === undefined) {
        result[j] = ''
      }
      if (ctx.measureText(result[j] + textArr[i]).width > width) {
        j++
      }
      result[j] = result[j] ? result[j] + textArr[i] : textArr[i]
    }
    if (maxLine && result.length > maxLine) {
      result = result.slice(0, maxLine)
      result[maxLine - 1] = result[maxLine - 1].slice(0, result[maxLine - 1].length - 2) + "…"
    }
    return result
  },
  /**
   * 处理特殊字符，防止意外发生
   * @param {string} str 输入字符
   */
  filterText: function(str) {
    str = str.Replace("\u0008", "\\u0008");
    str = str.Replace("\u0009", "\\u0009");
    str = str.Replace("\u000A", "\\u000A");
    str = str.Replace("\u000B", "\\u000B");
    str = str.Replace("\u000C", "\\u000C");
    str = str.Replace("\u000D", "\\u000D");
    str = str.Replace("\u0022", "\\u0022");
    str = str.Replace("\u0027", "\\u0027");
    str = str.Replace("\u005C", "\\u005C");
    str = str.Replace("\u00A0", "\\u00A0");
    str = str.Replace("\u2028", "\\u2028");
    str = str.Replace("\u2029", "\\u2029");
    str = str.Replace("\uFEFF", "\\uFEFF");
    return str
  },
  //根据父元素宽高设置图片宽高
  getImageSize: function(width, height, maxWidth, maxHeight, mode = "scale") {
    switch (mode) {
      case "scale":
      default:
        const ratio = width / height
        const maxRatio = maxWidth / maxHeight
        if (ratio > maxRatio) {
          return {
            width: maxWidth,
            height: height * maxWidth / width
          }
        } else {
          return {
            width: width * maxHeight / height,
            height: maxHeight
          }
        }
    }
  },
  /**
   * 上传图片方法
   * @param {object} options 配置参数
   */
  uploadImg: function(options) {
    var setting = extend({
      hasLoading: true, // 是否有loading
      url: ajaxConfig.urlHead + ajaxConfig.imgUpload,
      count: 1, //图片数量
      name: "imagefile", //后台接收的key，
      path: [], //图片路径,
      result: [],
      success: function() {},
      fail: function() {}
    }, options)
    wx.chooseImage({
      count: setting.count,
      sizeType: ["compressed"],
      success: function(res) {
        setting.path = res.tempFilePaths
        if (setting.hasLoading) {
          wx.showLoading({
            title: "上传中",
            mask: true
          })
        }
        uploadImg()
      },
      fail: function(res) {
        setting.fail(res);
      }
    })

    function uploadImg() {
      const state = setting.path.map(function(item) {
        return new Promise((resolve, reject) => {
          wx.uploadFile({
            url: setting.url,
            filePath: item,
            name: setting.name,
            header: {
              Authorization: 'Bearer ' + wx.getStorageSync(key.tokenKey)
            },
            success: function(res) {
              try {
                res.data = JSON.parse(res.data)
              } catch (e) {}
              resolve(res.data.data.path)
            },
            fail: function(res) {
              reject(res.data)
            }
          })
        })
      })
      Promise.all(state).then((res) => {
        wx.hideLoading()
        setting.success(res)
      }).catch((res) => {
        wx.hideLoading()
        setting.fail(res)
      })
    }
  }
}
