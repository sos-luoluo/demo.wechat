// components/LL/ajaxLoading.js
var App = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    state: false,
    updataList: []
  },
  // 初始化
  attached: function() {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        var navigationBarHeight = res.platform == 'android' ? 50 : 45
        var statusBarHeight = res.statusBarHeight
        that.setData({
          'css.redHeight': res.windowHeight - navigationBarHeight,
          'css.topHeight': navigationBarHeight + statusBarHeight,
        })
        // that.data.css.proportion = res.windowWidth / 375
      }
    })
    App.completeSetting.then((res) => {
      // console.log(res)
      that.setData({
        'updataList': res.updateNotice.split('#')
      },function() {
        that.updateManager = wx.getUpdateManager()
        that.updateManager.onUpdateReady(function () {
          that.setData({
            'state': true
          })
        })
      })
    })
    // updateManager.applyUpdate()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    update() {
      var that = this
      that.updateManager.applyUpdate()
    }
  }
})