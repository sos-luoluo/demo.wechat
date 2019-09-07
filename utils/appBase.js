import LogManager from './log.js'
import wxp from './wxp.js'
/**
 * app注册对象原型
 * @overview app注册对象原型
 * @constructor
 * @author [luoluo]
 * @version 2.0.0
 */
function AppBase(options) {
  this._options = options
  this.globalData = {}
  if (options && options.globalData && typeof options.globalData === 'object') {
    this.globalData = Object.assign({}, options.globalData)
  }
  options && options.init && options.init.call(this)
}
AppBase.prototype.updateManager = wx.getUpdateManager()
AppBase.prototype.onLaunch = function (param) {
  this.globalData.enterOptions = param
  this._options && this._options.onLaunch && this._options.onLaunch.call(this, param)
}
AppBase.prototype.onShow = function (param) {
  this.globalData.enterOptions = param
  this.updateManager.onUpdateReady(() => {
    wx.showModal({
      title: "检测到有新版本，即将重启以更新程序。",
      success: res => {
        if (res.confirm) {
          this.updateManager.applyUpdate()
        }
      }
    })
  })
  this._options && this._options.onShow && this._options.onShow.call(this, param)
}
AppBase.prototype.onHide = function (param) {
  this.logManager.save()
  this._options && this._options.onHide && this._options.onHide.call(this, param)
}
AppBase.prototype.onError = function (param) {
  this.logManager.addMsg({
    type: "error",
    msg: param,
    time:Date.now()
  })
  this._options && this._options.onError && this._options.onError.call(this, param)
}
AppBase.prototype.onPageNotFound = function (param) {
  wx.switchTab({
    url: '/pages/home/index',
  })
  this._options && this._options.onPageNotFound && this._options.onPageNotFound.call(this, param)
}
AppBase.prototype.logManager = new LogManager()
/**
 * 执行方法
 * @overview 警告，请勿轻易使用该方法,git地址https://github.com/bramblex/jsjs
 */
AppBase.prototype.implement = function (name, param) {
  switch (name) {
    /**
     * 进入测试页面
     */
    case 'testPage':
      wx.navigateTo({
        url: '/pages/test/test',
      })
    break
    default:
      wxp.showToast({
        title:'错误的指令',
        icon: 'none'
    })
  }
}

export default AppBase