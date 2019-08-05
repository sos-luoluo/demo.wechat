//index.js
import PageBase from '../../utils/pagebase.js'

Page(new PageBase({
  isNeedLogin: false,
  init(){
    console.log(this)
  },
  onShow(){
    console.log(this)
    this.dataSync.ajaxData=[{},{a:2}]
    this.dataSync.ajaxData[0].a=5
    this.nextTick(()=>{
      console.log(new Date().getTime())
    })
    this.nextTick(() => {
      console.log(new Date().getTime())
    })
    this.dataSync.testData = 6
    console.log('完成')
  },
  bindData(resolve,reject){
    resolve()
  },
  bindEvent(resolve){
    this.implementEvent('a',function(e){

    })
    resolve()
  }
}))
