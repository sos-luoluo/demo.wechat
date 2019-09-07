import {extend} from './base.js'
/**
 * 构造一个对象，这个对象要实现的功能
 * 继承父元素的路径，并且记录自己的路径
 * 能直接赋值和获取值，所以应该返回一个Proxy
 * 对象在可以挂载事件用来监听改变事件，改变了的时候触发change事件，回调传入的change方法
 */

// let test = new DataSync({}, 'data', function(path, value) {
//   console.log(path)
//   console.log(value)
// })
/**
 * 数据双向同步辅助方法
 * @overview 这个是实现类似vue的自动更新数据效果的方法，使用Proxy,实现的方法和vue不一样
 * @author [luoluo]
 * @version 2.0.0
 */
export class DataSync {
  constructor(obj, path, onChange) {
    this.onChange = onChange
    this.path = path
    return this.setProxy(obj)
  }
  /**
   * 处理方法
   * @overview 用来检测对象的改变
   * @author [luoluo]
   * @version 1.0.0
   */
  hanler = {
    get: (target, prop) => {
      return target[prop]
    },
    set: (target, prop, value) => {
      if (target[prop] !== value) {
        if (typeof value === 'object' && value!==null) {
          if (target.isArray()){
            target[prop] = new DataSync(value, this.path ? (this.path + '[' + prop + ']') : prop , this.onChange)
            if (this.onChange) {
              this.onChange(this.path ? (this.path + '[' + prop + ']') : prop, value)
            }
          }else{
            target[prop] = new DataSync(value, this.path ? (this.path + '.' + prop) : prop, this.onChange)
            if (this.onChange) {
              this.onChange(this.path ? (this.path + '.' + prop) : prop, value)
            }
          }
        } else {
          target[prop] = value
          if (this.onChange) {
            this.onChange(this.path ? (this.path + '.' + prop) : prop, value)
          }
        }
      }
      return true
    }
  }
  /**
   * 递归给对象挂载代理
   * @author [luoluo]
   * @version 1.0.0
   */
  setProxy(target) {
    if (typeof target === 'object' && target !== null) {
      for (let prop in target) {
        if (typeof target[prop] === 'object' && target[prop] !== null) {
          if (target.isArray()){
            target[prop] = new DataSync(target[prop], this.path ? (this.path + '[' + prop + ']') : prop , this.onChange)
          }else{
            target[prop] = new DataSync(target[prop], this.path ? (this.path + '.' + prop) : prop, this.onChange)
          }
        }
      }
      return new Proxy(target, this.hanler)
    }else{
      return target
    }
  }
}
/**
 * 数据管理方法
 * @overview 管理待同步的数据，同步更新到data
 * @author [luoluo]
 * @version 2.0.0
 */
export class UpdateData {
  constructor(that) {
    this.page=that
    this.dataPool={}
    this.lock=false
    this.callbackList=[]
    that.nextTick =(fn)=>{
      this.callbackList.push(fn)
    }
  }
  /**
   * 设置数据方法
   * @param {string} path 路径
   * @param {any} value 值
   */
  setData(path,value){
    this.dataPool[path]=value
    this.checkLock()
  }
  /**
   * 推送数据方法
   * 必须复制一份数据到data，不能使用原数据，另外这里还有一个用处就是将Proxy对象转化为普通object，防止死循环
   */
  pushData(){
    let res = extend(true, {}, this.dataPool) 
    this.dataPool={}
    this.page.setData(res,()=>{
      this.checkCallBack()
    })
  }
  /**
   * 检查下个时间片段回调方法
   */
  checkCallBack(){
    while (this.callbackList.length > 0) {
      const item = this.callbackList.shift();
      if(typeof item ==='function'){
        item()
      }
    }
  }
  /**
   * 是否可以推送
   */
  checkLock(){
    if (this.lock === true || this.dataPool.isEmpty()) {
      return
    }
    this.lock = true
    setTimeout(() => {
      this.lock = false
      this.checkLock()
    }, 10)
    this.pushData()
  }
}
