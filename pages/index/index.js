//index.js
import PageBase from '../../utils/pagebase.js'

Page(new PageBase({
  isNeedLogin: false,
  onShow(){
    this.dataSync.ajaxData=[{},{a:2}]
    this.dataSync.ajaxData[0].a=5
    this.dataSync.testData= 6
    console.log(new Date().getTime())
    this.nextTick(()=>{
      console.log(new Date().getTime())
      
    })
    setTimeout(()=>{
      this.dataSync.testData = 8
      console.log('渲染完成')
    },2000)
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
