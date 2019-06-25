import { pageConfig, key, ajaxConfig} from './config.js'
import { ajax } from './ajax.js'

/**
 * 登录方法
 * @overview 用户登录相关方法，为了保持用户最新信息，每次APP进入的时候都需要更新用户信息
 * @author [luoluo]
 * @version 2.0.0
 */


/**
 * 登录code状态管理器
 * @return Promise
 */
class CodeManager {
  code = ""
  getCode(callback) {
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success: res => {
          resolve(this.code)
        },
        fail: res => {
          wx.login({
            success: res => {
              this.code = res.code
              resolve(res.code)
            }
          })
        }
      })
    })
  }
}
const codeManager = new CodeManager()

/**
 * 获取微信个人信息方法
 * @param {function} callback 回调函数
 * @return Promise
 */
function getWechatInfo(callback) {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      withCredentials: true,
      success: function(res) {
        resolve(res)
      },
      fail: function(res) {
        wx.removeStorageSync(key.tokenKey)
        wx.navigateTo({
          url: pageConfig.login,
        })
      }
    })
  })
}

/**
 * 检查用户是否登录
 */
function checkLogin() {
  let token = wx.getStorageSync(key.tokenKey)
  return !!token
}


/**
 * 获取用户信息
 * @return Promise
 */
function getUserInfo() {
  return ajax({
    url: ajaxConfig.userInfoPort,
    success(res) {
      const app = getApp()
      app.globalData.userInfo = res.data
    }
  })
}

/**
 * 登录方法，在用户未登录的时候调用该方法保证用户能登录
 * @return Promise
 */
export default function login() {
  return new Promise((resolve, jectct) => {
    if (checkLogin()) {
      getUserInfo().then(res => {
        resolve(res.data)
      })
    } else {
      Promise.all([codeManager.getCode(), getWechatInfo()]).then((res) => {
        ajax({
          url: ajaxConfig.loginPort
        }).then(res => {
          const app = getApp()
          app.globalData.userInfo = res.data
          resolve(res.data)
        })
      })
    }
  })
}