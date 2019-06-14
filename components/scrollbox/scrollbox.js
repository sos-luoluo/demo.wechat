// pages/ScrollBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //滑动模式
    mode: {
      type: String,
      value: 'top',
      observer: 'changeMode'
    },
    //滑动到Id
    scrollintoview: {
      type: String,
      observer: 'scrollIntoView'
    },
    lock:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    direction: 'top',
    css: '', //绑定的样式，需要编译为字符串
    distance: 0, //变换距离数据
    size: {
      height: 0,
    }, //父元素-子元素尺寸
    touchPosition: {
      y: 0,
      timestamp: 0,
      speed: 0,
    }, //touch事件缓存数据
    sysInfo: {
      windowWidth: 0,
      windowHeight: 0
    },
    faInfo:{
      top:0,
      bottom:0,
    },
    stopKey: undefined, //计时器key
    scrollEndTime: 0.95, //滑动停止时间参数
  },

  ready() {
    // this.data.sysInfo = wx.getSystemInfoSync()
    this.resize()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //查询父元素和子元素布局方法，在改变布局及尺寸的时候需要调用
    resize() {
      var that = this
      var queryFa = new Promise(function(resolve) {
        that.createSelectorQuery().select('#viewport').boundingClientRect(function(rect) {
          that.data.faInfo=rect
          resolve(rect)
        }).exec()
      })
      var queryChild = new Promise(function(resolve) {
        that.createSelectorQuery().select('#content').boundingClientRect(function(rect) {
          resolve(rect)
        }).exec()
      })
      Promise.all([queryFa, queryChild]).then(function(res) {
        that.data.size = {
          height: res[0].height - res[1].height
        }
        that.setStyle()
      }).catch(function() {
        console.error('查询出错')
      })
    },
    //重设定位的方法
    setStyle(y) {
      if(y !== undefined){
        this.setData({
          'css': `${this.data.direction}:0;transform:translate(0,${y}px);`
        })
      }else{
        this.setData({
          'css': `${this.data.direction}:0;transform:translate(0,${this.data.distance}px);`
        })
      }
      
    },
    //移动方法，传入计划移动的距离
    move(distance) {
      var that = this
      that.triggerEvent('scroll', {})
      switch (that.data.direction) {
        case 'top':
          if (that.data.distance + distance > 0 || that.data.size.height >= 0) {
            that.data.distance = 0
            that.triggerEvent('scrolltoupper', {})
            if (that.data.stopKey) {
              that.stopInterval()
            }
          } else if (that.data.distance + distance < that.data.size.height) {
            that.data.distance = that.data.size.height
            that.triggerEvent('scrolltolower', {})
            if (that.data.stopKey) {
              that.stopInterval()
            }
          } else {
            that.data.distance += distance
          }
          break
        case 'bottom':
          if (that.data.distance + distance > -that.data.size.height) {
            that.data.distance = -that.data.size.height
            that.triggerEvent('scrolltoupper', {mode:'bottom'})
            if (that.data.stopKey) {
              that.stopInterval()
            }
          } else if (that.data.distance + distance < 0 || that.data.size.height >= 0) {
            that.data.distance = 0
            that.triggerEvent('scrolltolower', {mode:'bottom'})
            if (that.data.stopKey) {
              that.stopInterval()
            }
          } else {
            that.data.distance += distance
          }
          break
      }
      that.setStyle()
    },
    changeMode(newVal, oldVal) {
      if (newVal && newVal != this.data.direction) {
        this.data.direction = newVal
        this.setAllPosition(newVal, oldVal)
        this.setStyle()
      }
    },
    setAllPosition(newVal) {
      var that = this
      switch (newVal) {
        case 'top':
          that.data.distance = that.data.distance + that.data.size.height
          break
        case 'bottom':
          that.data.distance = that.data.distance - that.data.size.height
          break
      }
    },
    scrollIntoView(newVal, oldVal) {
      if (newVal && newVal != oldVal) {

        var that = this
        wx.createSelectorQuery().select(newVal).boundingClientRect(function(rect) {
          if (rect) {
            that.move(-rect[that.data.direction] + that.data.faInfo[that.data.direction])
          }
        }).exec()
      }
    },
    bindEvent(e) {
      var that = this
      if (that.properties.lock){
        return
      }
      switch (e.type) {
        case 'touchstart':
          if (that.data.stopKey) {
            that.stopInterval()
          }
          that.data.touchPosition.speed = 0
          if (e.touches[0]) {
            that.data.touchPosition.timestamp = new Date().getTime()
            that.data.touchPosition.y = e.touches[0].clientY
          }
          that.triggerEvent('scrollstart', {
            type: 'scrollstart'
          })
          break
        case 'touchmove':
          if (e.touches[0]) {
            var distance = e.touches[0].clientY - that.data.touchPosition.y
            that.move(distance)
            var newTimestamp = new Date().getTime()
            that.data.touchPosition.speed = distance / (newTimestamp - that.data.touchPosition.timestamp) || 0
            that.data.touchPosition.timestamp = newTimestamp
            that.data.touchPosition.y = e.touches[0].clientY
          }
          break;
        case 'touchend':
          var speed = that.data.touchPosition.speed
          if (speed>10){
            speed=10
          } else if (speed<-10){
            speed=-10
          }
          if (that.data.stopKey){
            clearInterval(that.data.stopKey)
          }
          that.data.stopKey = setInterval(function() {
            speed *= that.data.scrollEndTime
            that.move(speed * 25)
            if (Math.abs(speed)< 0.05) {
              that.stopInterval()
            }
          }, 25)
          that.data.touchPosition.x = 0
          break
      }
    },
    stopInterval(){
      clearInterval(this.data.stopKey)
      this.data.stopKey=undefined
      this.triggerEvent('scrollend', {
        type: 'scrollend'
      })
    }
  }
})