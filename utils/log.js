/**
 * 日志管理器
 * @overview 目前版本暂时只记录错误信息，供调试用
 * @constructor
 * @author [luoluo]
 * @version 2.0.0
 */
class LogManager{
  constructor(){
    this.logList=wx.getStorageSync('log')||[]
  }
  addMsg(msg){
    if (this.logList.length>100){
      this.logList.shift()
    }
    this.logList.push(msg)
    this.save()
  }
  getData(){
    return this.logList
  }
  clear(){
    this.logList=[]
    this.save()
  }
  save(){
    wx.setStorageSync('log', this.logList)
  }
}

export default LogManager
