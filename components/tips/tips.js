// components/LL/tips.js
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    state: false,
    text: '',
    iconName: ''
  },
  methods: {
    showTips: function(text, iconType, callback) {
      var cb, iconName=''
      if (iconType && typeof iconType === "string") {
        switch (iconType) {
          case 'info':
            iconName = 'ic-tips-info.png'
            break
          case 'success':
            iconName = 'ic-tips-success.png'
            break
          case 'warning':
            iconName = 'ic-tips-warning.png'
            break
          case 'fail':
            iconName = 'ic-tips-fail.png'
            break
        }
      } else if (typeof iconType === 'function'){
        cb = iconType
      }
      if (callback){
        cb = callback
      }
      this.setData({
        'state': true,
        'text': text,
        'iconName': iconName
      })
      setTimeout(()=> {
        this.setData({
          'state': false,
          'text': '',
          'iconName': ''
        })
        if (cb){
          cb()
        }
      }, 2000)
    }
  }
})