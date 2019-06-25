//index.js
import PageBase from '../../utils/pagebase.js'

Page(new PageBase({
  isNeedLogin: true,
  onShow(){
    this.dataSync.ajaxData=[{},{a:2}]
    this.nextTick(() => {
      console.log(JSON.stringify(this.data))
    })
    this.dataSync.ajaxData[0].a=5
    this.nextTick(()=>{
    })
    setTimeout(()=>{
      this.dataSync.sysData.pageCode = 2
      this.nextTick(() => {
      })
    },1000)
  },
  bindData(resolve,reject){
    resolve()
  }
}))
