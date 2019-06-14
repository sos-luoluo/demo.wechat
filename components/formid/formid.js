// components/LL/Formid.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    submit:function(e){
      App.addformID(e.detail.formId)
    }
  }
})
