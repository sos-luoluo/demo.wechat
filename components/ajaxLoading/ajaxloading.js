// components/LL/ajaxLoading.js
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
    state: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show(){
      this.setData({
        'state': true
      })
    },
    hide(){
      this.setData({
        'state': false
      })
    }
  }
})
