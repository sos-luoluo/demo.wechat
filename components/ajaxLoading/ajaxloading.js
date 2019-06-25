// components/LL/ajaxLoading.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    state: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show(){
      this.setData({
        'state': this.data.state + 1
      })
    },
    hide(){
      this.setData({
        'state': this.data.state - 1
      })
    }
  }
})
