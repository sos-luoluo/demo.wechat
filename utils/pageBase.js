import login from "./login.js"
import {extend} from "./base.js"

/**
 * 注册页面对象原型
 * @overview 注册页面对象原型
 * @constructor
 * @author [luoluo]
 * @version 2.0.0
 */

// 定义的data数据结构
const defaultData={
  // 页面数据
  pageData:{

  },
  // 请求数据
  ajaxData:{

  },
  // 用户数据
  userData:{

  },
  // 系统数据
  sysData:{
    isNeedLogin: false, // 是否需要登录
    pageCode:0, //页面状态码定义 0未初始化，1初始化，2权限验证未通过，3请求数据中，4请求数据失败，5页面渲染中，6页面渲染失败，7页面正常进入，8页面隐藏
  }
}


class PageBase {
  // 数据缓存
  data={}
  constructor(options){
    this.data = extend({}, defaultData)
    if (options && typeof options==='object'){
      this.init(options)
    }
  }
  // 加载的时候执行
  onLoad(options){
    this.authentication.then(res=>{

    })
  }
  // 就绪
  onReady(){}
  // 首次显示
  onShow(){}
  // 隐藏
  onHide(){}
  // 卸载
  onUnload(){}
  // 下拉
  onPullDownRefresh(){}
  // 到达页面底部
  onReachBottom(){}
  // 分享
  onShareAppMessage(){}
  // 下面是自定义加入的方法
  // 初始化方法,这个方法初始化页面，在注册page之前执行
  init(options){
    if (options.data && typeof options.data === 'object'){
      this.data = extend(this.data, options.data)
    }
    // 允许挂载方法
    for (let key in options){
      if (typeof options[key]==='function'){
        this[key] = options[key]
      }
    }
    this.data.sysData.pageCode=1
  }
  // 权限验证
  authentication(){
    return new Promise((resolve,reject)=>{
      if (this.data.sysData.isNeedLogin){

      }else{
        resolve()
      }
    })
  }
  // 请求数据，处理数据，页面渲染
  ajaxLoad(){}
}
