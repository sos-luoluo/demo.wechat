// components/LL/listTips.js
Component({
  options: {
    addGlobalClass: true,
  },
  properties:{
    state: {
      type: Number,
      value: 0
    },
    nodatatext: {
      type: String,
      value: '暂无数据'
    },
    nomoretext: {
      type: String,
      value: '已无更多'
    },
    msg: {
      type: String,
      value: '暂无数据'
    },
  }
})