// pages/ScrollBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: Object,
      observer: 'resize'
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
    bottomLock: false,
    css: '', //绑定的样式，需要编译为字符串
    distance: 0, //变换距离数据
    heightReduce: 0, //父元素-子元素尺寸
    touchPosition: {
      y: 0,
      timestamp: 0,
      speed: 0,
    }, //touch事件缓存数据
    faInfo:{
      top:0,
      bottom:0,
    },
    stopKey: undefined, //计时器key
    scrollReduce: 0.95, //滑动停止时间参数
    timeinterval: 15 //滑动细腻程度单位ms
  },

  ready() {
    this.resize()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //查询父元素和子元素布局方法，在改变布局及尺寸的时候需要调用
    resize() {
      const queryFa = new Promise((resolve)=> {
        this.createSelectorQuery().select('#viewport').boundingClientRect((rect)=> {
          this.data.faInfo=rect
          resolve(rect)
        }).exec()
      })
      const queryChild = new Promise((resolve)=> {
        this.createSelectorQuery().select('#content').boundingClientRect((rect)=> {
          resolve(rect)
        }).exec()
      })
      Promise.all([queryFa, queryChild]).then(([faData,childData])=> {
        const value = faData.height - childData.height
        this.data.heightReduce = value
        if (this.data.bottomLock && value<0){
          this.data.distance = value
        }
        this.setStyle()
      }).catch(function() {
        console.error('查询出错')
      })
    },
    //重设定位的方法
    setStyle(y) {
      this.setData({
        'css': `transform:translate(0,${this.data.distance}px);`
      })
    },
    //移动方法，传入计划移动的距离
    move(distance) {
      this.triggerEvent('scroll', {})
      if (this.data.distance + distance > 0 || this.data.heightReduce >= 0) {
        this.data.distance = 0
        this.triggerEvent('scrolltoupper', {})
        this.data.bottomLock = false
        this.stopInterval()
      } else if (this.data.distance + distance < this.data.heightReduce) {
        this.data.distance = this.data.heightReduce
        this.triggerEvent('scrolltolower', {})
        this.data.bottomLock = true
        this.stopInterval()
      } else {
        this.data.distance += distance
        this.data.bottomLock = false
      }
      this.setStyle()
    },
    scrollIntoView(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        wx.createSelectorQuery().select("#"+newVal).boundingClientRect((rect)=> {
          if (rect) {
            this.move(-rect['top'] + this.data.faInfo['top'])
          }
        }).exec()
      }
    },
    bindEvent(e) {
      if (this.properties.lock){
        return
      }
      this.stopInterval()
      switch (e.type) {
        case 'touchstart':
          this.data.touchPosition.speed = 0
          if (e.touches[0]) {
            this.data.touchPosition.timestamp = Date.now()
            this.data.touchPosition.y = e.touches[0].clientY
          }
          this.triggerEvent('scrollstart', {
            type: 'scrollstart'
          })
          break
        case 'touchmove':
          if (e.touches[0]) {
            let distance = e.touches[0].clientY - this.data.touchPosition.y
            this.move(distance)
            let newTimestamp = Date.now()
            this.data.touchPosition.speed = distance / (newTimestamp - this.data.touchPosition.timestamp) || 0
            this.data.touchPosition.timestamp = newTimestamp
            this.data.touchPosition.y = e.touches[0].clientY
          }
          break;
        case 'touchend':
          let speed = this.data.touchPosition.speed
          if (speed>10){
            speed=10
          } else if (speed<-10){
            speed=-10
          }
          this.data.stopKey = setInterval(()=> {
            speed *= this.data.scrollReduce
            this.move(speed * this.data.timeinterval)
            if (Math.abs(speed)< 0.05) {
              this.stopInterval()
              this.triggerEvent('scrollend', {
                type: 'scrollend'
              })
            }
          }, this.data.timeinterval)
          break
      }
    },
    stopInterval(){
      if (this.data.stopKey){
        clearInterval(this.data.stopKey)
        this.data.stopKey = undefined
      }
    }
  }
})