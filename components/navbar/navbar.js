var App = getApp()
Component({

  properties: {
    theme: {
      type: String,
      value: 'light',
    },
    title: {
      type: String,
      value: '群TV'
    },
    backEnable: {
      type: Boolean,
      value: false,
      observer: 'setStyle'
    },
    backgroundColor:{
      type: String,
      value: 'white'
    },
    homeEnable: {
      type: Boolean,
      value: false,
      observer: 'setStyle'
    },
    addEnable: {
      type: Boolean,
      value: false
    },
    liveEnable: {
      type: Boolean,
      value: false
    },
    redpacketsEnable: {
      type: Boolean,
      value: false
    }
  },
  data:{
    btnNumber: 0,
    addShow: false
  },

  attached(){
    const that = this
    wx.getSystemInfo({
      success: e => {
        var navigationBarHeight = e.platform == 'android' ? 50 : 45
        that.setData({
          statusBarHeight : e.statusBarHeight,
          navigationBarHeight: navigationBarHeight,
          lineHeight: navigationBarHeight - 13 - 2 ,
          pageHeight: e.windowHeight - e.statusBarHeight - (e.platform == 'android' ? 50 : 45)
        })
      }
    })
    var pages = getCurrentPages()
    if (pages.length < 2 && pages[0].route !== "pages/Home/IndexNew" && pages[0].route !== "pages/Group/Index" && pages[0].route !== "pages/User/UserCenter") {
      that.setData({
        'homeEnable': true
      })
    }
    if (pages.length >= 2) {
      that.setData({
        'backEnable': true
      })
    }
    that.setStyle()
   
    //判断是是否已经收藏了小程序
    if (!wx.getStorageSync('addShow')) {
      let scene = wx.getLaunchOptionsSync().scene
      if (scene === 1089) {
        wx.setStorageSync('addShow', true)
      } else if (!App.globalData.addShow){
        that.setData({
          'addShow': true
        })
        App.globalData.addShow = true
        setTimeout(function() {
          that.setData({
            'addShow': false
          })
        },4000)
      }
    }
  },

  methods: {
    redpacketsTips:function(){
      this.triggerEvent('redpackets', {})
    },
    add: function() {
      App.globalData.addShow = true
      this.setData({
        'addShow': false
      })
    },
    setStyle:function(){
      var that=this
      var btnNumber = 0
      if (that.data.backEnable) {
        btnNumber++
      }
      if (that.data.homeEnable) {
        btnNumber++
      }
      if (that.data.addEnable) {
        btnNumber++
      }
      if (that.data.liveEnable) {
        btnNumber++
      }
      that.setData({
        'btnNumber': btnNumber
      })
    }
  }
})