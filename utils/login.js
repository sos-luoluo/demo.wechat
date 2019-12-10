import { pageConfig, key, ajaxConfig } from './config.js'
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
      wx.login({
        success: res => {
          this.code = res.code
          resolve(res.code)
        }
      })
    })
  }
}
const codeManager = new CodeManager()

/**
 * 获取微信个人信息方法
 * @return Promise
 */
export function getWechatInfo(isNav = false) {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN',
      success: function (res) {
        resolve(res)
      },
      fail: function (res) {
        wx.removeStorageSync(key.tokenKey)
        getApp().globalData.userInfo = {}
        if (isNav) {
          reject()
          const pageList = getCurrentPages()
          const page = pageList[pageList.length - 1]
          const keys = Object.keys(page.options).map(key => {
            return `${key}=${page.options[key]}`
          }).join('&')
          const url = '/' + page.route + '?' + keys
          // 如果处于登陆页面,则不跳转
          if (!(page.route.indexOf(pageConfig.login) >= 0)) {
            wx.redirectTo({
              url: pageConfig.login + '?url=' + encodeURIComponent(url),
            })
          }
        } else {
          resolve({})
        }
      }
    })
  })
}
/**
 * 检查用户是否已授权,进入APP的时候需要调用一次
 * @return Promise
 */
export function getUserInfoState() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: function () {
        resolve(true)
      },
      fail: function () {
        resolve(false)
      }
    })
  })
}

/**
 * 检查用户是否登录,有token
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
 * 用户登录
 *@params{boolean} force  是否强制
 *@params{boolean} isLogin 是否授权登陆
 */
function authLogin(force) {
  return new Promise((resolve, reject) => {
    Promise.all([codeManager.getCode(), getWechatInfo(force)]).then((res) => {
      let data = {
        code: res[0],
      }
      const pageList = getCurrentPages()
      const page = pageList[pageList.length - 1]

      if (page.route.indexOf('pages/home/login') >= 0) {
        if (res[1].encryptedData && res[1].iv) {
          data.encryptedData = res[1].encryptedData
          data.iv = res[1].iv
        }
      }
      ajax({
        url: ajaxConfig.loginPort,
        data: data,
        id: "login"
      }).then(res => {
        wx.setStorageSync(key.tokenKey, res.data.token)
        getUserInfo().then(res => {
          const app = getApp()
          app.globalData.userInfo = res.data
          resolve(res.data)
        })
      }).catch(err => {
        if (force){
          reject(err)
        }else{
          resolve({})
        }
      })
    })
  })
}


/**
 * 登录方法，在用户未登录的时候调用该方法保证用户能登录
 * @params{boolean} force  是否强制
 * @return Promise
 */
export default function login(force = false) {
  return new Promise((resolve, reject) => {
    getUserInfoState().then(state => {
      let app = getApp()
      if (app.globalData.userInfo && (!app.globalData.userInfo.isEmpty()) && ((force && state && app.globalData.userInfo.avatarUrl) || (!force && !!app.globalData.userInfo.userId))) {
        resolve(app.globalData.userInfo)
      } else if (force && (!state)) {
        getWechatInfo(true)
      } else {
        authLogin(force).then(res => {
          resolve(res)
        }).catch(err=>{
          wx.showToast({
            title: '登录失败，请稍后再试',
          })
        })
      }
    })
  })
}