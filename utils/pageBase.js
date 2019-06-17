import login from "./login.js"
import {
  extend
} from "./base.js"

/**
 * 事件管理器
 * @overview 注册事件，删除事件，触发事件
 * @constructor
 * @author [luoluo]
 * @version 2.0.0
 */
class EventManagement {
  constructor(that) {
    if (that) {
      this.that = that
    } else {
      const pages = getCurrentPages()
      const page = pages[pages.length - 1]
      this.that = page
    }
    this.eventPool = {}
  }
  /**
   * 注册事件
   * @param {string} name 事件名
   * @param {function} name 回调函数
   */
  registerEvent(name, fn) {
    if (!eventPool[name]) {
      this.eventPool[name] = fn
    } else {
      console.error('事件注册失败,' + name + '事件已被注册!')
    }
  }
  /**
   * 执行事件
   * @param {string} name 事件名
   * @param {any} param 参数
   */
  implementEvent(name, param) {
    if (eventPool[name]) {
      this.eventPool[name].call(this.that, param)
    } else {
      console.error('事件未注册！')
    }
  }
}


/**
 * 注册页面对象原型
 * @overview 注册页面对象原型
 * @constructor
 * @author [luoluo]
 * @version 2.0.0
 */

// 定义的data数据结构
const defaultData = {
  // 页面数据
  pageData: {

  },
  // 请求数据
  ajaxData: {

  },
  // 用户数据
  userData: {

  },
  // 系统数据
  sysData: {
    isNeedLogin: false, // 是否需要登录
    pageCode: 0, //页面状态码定义 0未初始化，1初始化，2权限验证未通过，3请求数据中，4请求数据失败，5页面渲染中，6页面渲染失败，7页面正常进入，8页面隐藏
    pageTimes: 0, //页面进入的次数
    pageRefreshLevel: 0,// 页面刷新级别 0不刷新，1全部刷新，2刷新ajax,3页面局部刷新；
  }
}


class PageBase {
  // 数据缓存
  data = {}
  constructor(options) {
    this.data = extend({}, defaultData)
    if (options && typeof options === 'object') {
      if (options.isNeedLogin) {
        this.data.sysData.isNeedLogin = true
      }
      delete options.isNeedLogin
      this.data.sysData.pageCode = 0
      this.init(options)
    }
  }
  // 加载的时候执行
  onLoad(param) {
    this.authentication.then(res => {
      this.ajaxLoad(param).then(result => {
        this.data.sysData.pageCode = 7
        this.onReady()
      })
    })
  }
  // 就绪
  onReady() { }
  // 首次显示
  onShow() {
    this.data.sysData.pageTimes++
    if (this.data.sysData.pageTimes > 1) {
      this.pageRefresh()
    }
  }
  // 隐藏
  onHide() {
    this.data.sysData.pageCode = 8
  }
  // 卸载
  onUnload(par) { }
  // 下拉
  onPullDownRefresh() { }
  // 到达页面底部
  onReachBottom() { }
  // 分享
  onShareAppMessage() { }
  // 下面是自定义加入的方法
  // 初始化方法,这个方法初始化页面，在注册page之前执行
  init(options) {
    if (options.data && typeof options.data === 'object') {
      this.data = extend(this.data, options.data)
    }
    delete options.data
    // 允许挂载任何数据
    for (let key in options) {
      this[key] = options[key]
    }
    // 注册事件
    this.registerEvent = this.eventManagement.registerEvent.bind(this.eventManagement)
    this.data.sysData.pageCode = 1

  }
  // 权限验证
  authentication() {
    return new Promise((resolve, reject) => {
      if (this.data.sysData.isNeedLogin) {
        login.then(res => {
          resolve(res)
        }).catch(err => {
          this.data.sysData.pageCode = 2
        })
      } else {
        resolve()
      }
    })
  }
  // 请求数据，处理数据，页面渲染
  ajaxLoad(param) {
    return new Promise((resolve, reject) => {
      this.data.sysData.pageCode = 3
      resolve()
    }).catch(err => {
      this.data.sysData.pageCode = 4
    })
  }
  // 页面刷新控制器
  pageRefresh(isRefresh) {
    const pages = getCurrentPages()
    const page = pages[pages.length - 1]
    // 强制刷新,最高级别，并且是刷新整个页面
    if (isRefresh) {
      this.onLoad(page.options)
      return
    }
    // 在页面要求登录而未登录的时候刷新，在页面未成功加载的时候刷新整个页面，较高级别
    if (this.data.sysData.pageCode < 7) {
      this.onLoad(page.options)
      return
    }
    if (this.data.sysData.pageRefreshLevel===1){
      this.onLoad(page.options)
    } else if (this.data.sysData.pageRefreshLevel === 2){
      this.ajaxLoad(page.options)
    }
  }
  // 事件方法
  event(e) {
    if (e.currentTarget.dataset.id) {
      this.eventManagement.implementEvent.apply(this.eventManagement, e.currentTarget.dataset.id, e.currentTarget.dataset)
    } else {
      console.error('未绑定事件ID！')
    }
  }
  // 事件管理器，包含注册事件,执行事件，这个需要在注册页面之前执行
  eventManagement = new EventManagement(this)
}