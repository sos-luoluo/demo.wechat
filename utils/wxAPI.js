import { extend } from "./base.js"
import { key, ajaxConfig } from "./config";
import {ajax} from "./ajax.js"
/**
 * 微信API进一步封装
 * @overview 微信API进一步封装
 * @author [luoluo]
 * @version 2.0.0
 */


/**
 * 上传图片方法
 * @param {object} options 传入配置使用
 * @param {boolean} hasLoading 是否有loading
 * @param {number} count 图片数目
 * @param {string} name 后台接受的key
 */
export const uploadImg = function(options) {
  const config = extend(true,{
    hasLoading: true,
    url: ajaxConfig.urlHead + ajaxConfig.imgUpload,
    count: 1,
    name: "imagefile",
    success: function () { },
    fail: function () { }
  }, options)
  wx.chooseImage({
    count: config.count,
    sizeType: ["compressed"],
    success:function(res){
      if (config.hasLoading) {
        wx.showLoading({
          title: "上传中",
          mask: true
        })
      }
      const ajaxList = res.tempFilePaths.map(function(item){
        return new Promise((resolve,reject)=>{
          wx.uploadFile({
            url: config.url,
            filePath: item,
            name: config.name,
            header: {
              Authorization: 'Bearer ' + wx.getStorageSync('token')
            },
            success: function (res) {
              try {
                res.data = JSON.parse(res.data)
              } catch (e) { }
              resolve(res.data.data.path)
            },
            fail: function (res) {
              reject(res.data)
            }
          })
        })
      })
      Promise.all(ajaxList).then((res) => {
        wx.hideLoading()
        config.success(res)
      }).catch((res) => {
        wx.hideLoading()
        config.fail(res)
      })
    }
  })
}

/**
 * 支付方法
 * @param {object} options 传入配置使用
 * @param {boolean} hasLoading 是否有loading
 * @param {number} count 图片数目
 * @param {string} name 后台接受的key
 */
export const pay = function (options){
  const config = extend(true,{
    hasLoading: true,
    url: ajaxConfig.payPort,
    data: {},
    success: function () { },
    fail: function () { },
  }, options)
  ajax({
    url: config.url,
    data: config.data
  }).then((res)=>{
    const param=res.data
    wx.requestPayment({
      "nonceStr": param.nonceStr,
      "package": param.packageValue,
      "paySign": param.paySign,
      "signType": "MD5",
      "timeStamp": param.timeStamp,
      success: function (res) {
        config.success(res)
      },
      fail: function (res) {
        config.fail(res)
      },
      complete: function (res) {
        //用户取消支付不会触发fail，需要判断
        if (res.errMsg === "requestPayment:cancel") {
          config.fail(res)
        }
      }
    })
  }).catch((res)=>{
    config.fail(res)
  })
}
