import login from "./login.js"
import { extend } from "./base.js"
import { DataSync, UpdateData } from './datasync.js'

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
    if (!this.eventPool[name]) {
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
  implementEvent(name, ...param) {

    if (this.eventPool[name]) {
      this.eventPool[name].apply(this.that, param)
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
  // css样式数据
  cssData: {

  },
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
    pageCode: 0, //页面状态码定义 0未初始化，1初始化，2权限验证未通过，3请求数据中，4请求数据失败，5页面渲染中，6页面渲染失败，7页面绑定事件失败，8页面正常进入，9页面隐藏
    pageTimes: 0, //页面进入的次数
    pageRefreshLevel: 0,// 页面刷新级别 0不刷新，1全部刷新，2刷新ajax,3自定义刷新；
    ajaxLoading: 0, //ajaxLoading计数器
  }
}

function PageBase(options) {
  this._options = options
  if (options && options.data && typeof options.data === 'object') {
    this.data = extend(true, {}, defaultData, options.data)
  } else {
    var b = extend
    this.data = extend(true, {}, defaultData)
  }
  if (options && options.isNeedLogin) {
    this.data.sysData.isNeedLogin = true
  }
  if (options && options.pageRefreshLevel) {
    this.data.sysData.pageRefreshLevel = options.pageRefreshLevel
  }
  options && options.init && options.init()
  this.data.sysData.pageCode = 1
}
PageBase.prototype.onLoad = function (param) {
  this.updateData = new UpdateData(this)
  this.dataSync = new DataSync(extend(true, {}, this.data), '', (path, value) => {
    this.updateData.setData(path, value)
  })
  this.eventManagement = new EventManagement(this)
  this.registerEvent = this.eventManagement.registerEvent.bind(this.eventManagement)
  this.input = (e) => {
    if (e.type == "input") {
      this.dataSync.pageData[e.currentTarget.dataset.name] = e.detail.value
    }
  }
  this.authentication().then(res => {
    this.dataSync.userData = res
    this.ajaxLoad(param).then(result => {
      this.bindEvent(result).then((res) => {
        this.dataSync.sysData.pageCode = 8
        this._options && this._options.onLoad && this._options.onLoad.call(this, param)
        this.onReady()
      })
    })
  }).catch(err => {
    console.log(err)
  })
}
PageBase.prototype.onReady = function () {
  let tips = this.selectComponent("#tips")
  if (tips) {
    this.showTips = function () {
      tips.showTips(...arguments)
    }
  } else {
    this.showTips = (msg, icon, cb) => {
      wx.showToast({
        title: msg,
        icon: icon,
        success: () => {
          if (cb && typeof cb === "function") {
            setTimeout(() => {
              cb()
            }, 200)
          }
        }
      })
    }
  }
  this._options && this._options.onReady && this._options.onReady.call(this)
}
PageBase.prototype.onShow = function () {
  if (this.data.sysData.pageCode === 9) {
    this.dataSync.sysData.pageCode === 8
  }
  this.dataSync.sysData.pageTimes++
  if (this.dataSync.sysData.pageTimes > 1) {
    this.pageRefresh()
  }
  this._options && this._options.onShow && this._options.onShow.call(this)
}
PageBase.prototype.onHide = function () {
  if (this.dataSync.sysData.pageCode === 8) {
    this.dataSync.sysData.pageCode === 9
  }
  this._options && this._options.onHide && this._options.onHide.call(this)
}
PageBase.prototype.onUnload = function () {
  this._options && this._options.onUnload && this._options.onUnload.call(this)
}
PageBase.prototype.onPullDownRefresh = function () {
  this._options && this._options.onPullDownRefresh && this._options.onPullDownRefresh.call(this)
}
PageBase.prototype.onReachBottom = function () {
  this._options && this._options.onReachBottom && this._options.onReachBottom.call(this)
}
PageBase.prototype.onShareAppMessage = function (res) {
  return this._options && this._options.onShareAppMessage && this._options.onShareAppMessage.call(this, res)
}
PageBase.prototype.onPageScroll = function (res) {
  this._options && this._options.onPageScroll && this._options.onPageScroll.call(this, res)
}
PageBase.prototype.onResize = function () {
  this._options && this._options.onResize && this._options.onResize.call(this)
}
PageBase.prototype.onTabItemTap = function () {
  this._options && this._options.onTabItemTap && this._options.onTabItemTap.call(this)
}
PageBase.prototype.authentication = function () {
  return new Promise((resolve, reject) => {
    if (this.data.sysData.isNeedLogin) {
      login(true).then(res => {
        resolve(res)
      }).catch(err => {
        this.dataSync.sysData.pageCode = 2
      })
    } else {
      login().then(res => {
        resolve(res)
      }).catch(err => {
        this.dataSync.sysData.pageCode = 2
      })
    }
  })
}
PageBase.prototype.ajaxLoad = function () {
  return new Promise((resolve, reject) => {
    if (this._options && this._options.bindData) {
      this._options.bindData.call(this, resolve, reject)
    } else {
      resolve()
    }
    if (this.dataSync.sysData.pageCode == 2) {
      this.dataSync.sysData.pageCode = 3
    }
  }).catch(err => {
    this.dataSync.sysData.pageCode = 4
    throw new Error(err)
  })
}
PageBase.prototype.bindEvent = function () {
  return new Promise((resolve, reject) => {
    if (this._options && this._options.bindEvent) {
      this._options.bindEvent.call(this, resolve, reject)
    } else {
      resolve()
    }
  }).catch(err => {
    this.dataSync.sysData.pageCode = 7
  })
}
PageBase.prototype.pageRefresh = function (isRefresh) {
  // 强制刷新,最高级别，并且是刷新整个页面
  if (isRefresh) {
    this.onLoad(this.options)
    return
  }
  // 在页面要求登录而未登录的时候刷新，在页面未成功加载的时候刷新整个页面，较高级别
  if (this.data.sysData.pageCode < 8) {
    this.onLoad(this.options)
    return
  }
  if (this.data.sysData.pageRefreshLevel === 1) {
    this.onLoad(this.options)
  } else if (this.data.sysData.pageRefreshLevel === 2) {
    this.ajaxLoad()
  } else if (this.data.sysData.pageRefreshLevel === 3) {
    if (this._options.refreshPage && typeof this._options.refreshPage === 'function') {
      this._options.refreshPage.call(this)
    }
  }
}
PageBase.prototype.event = function (e) {
  if (e.currentTarget.dataset.id) {
    this.eventManagement.implementEvent(e.currentTarget.dataset.id, e.detail, e.currentTarget.dataset, e.type, e)
  } else {
    console.error('未绑定事件ID！')
  }
}

export default PageBase
