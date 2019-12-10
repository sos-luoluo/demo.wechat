// pages/test/test.js
import PageBase from '../../utils/pagebase.js'
import login from '../../utils/login.js'
import wxp from '../../utils/wxp.js'
import { key } from '../../utils/config.js'
Page(new PageBase({
  isNeedLogin: false,
  bindData(resolve, reject) {
    resolve()
  },
  bindEvent(resolve) {
    this.registerEvent('login', function (detail, dataset) {
      login().then(res => {
        this.showTips('登录成功')
      })
    })
    this.registerEvent('clearStorage', function (detail, dataset) {
      wxp.clearStorage().then(res=>{
        this.showTips('缓存已清空')
      })
    })
    this.registerEvent('copyToken', function (detail, dataset) {
      const token = wx.getStorageSync(key.tokenKey)
      if (token && token!=""){
        wxp.setClipboardData({ data: token }).then(res=>{
          this.showTips('token已复制')
        })
      }else{
        this.showTips('token不存在')
      }
    })
    this.registerEvent('viewLog', function (detail, dataset) {
      wxp.navigateTo({
        url: "/pages/test/log"
      })
    })
    this.registerEvent('sendLog', function (detail, dataset) {
      this.showTips('暂未开放')
    })
    resolve()
  }
}))
