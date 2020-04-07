// pages/test/log.js
import PageBase from '../../utils/pageBase.js'
import login from '../../utils/login.js'
import wxp from '../../utils/wxp.js'
import { key } from '../../utils/config.js'
import tools from '../../utils/tools'
const app=getApp()
Page(new PageBase({
  isNeedLogin: false,
  bindData(resolve, reject) {
    this.dataSync.ajaxData.listData = app.logManager.getData().map(item=>{
      item.time = tools.timeFormat(item.time,"yyyy-MM-dd hh:mm:ss")
      return item
    })
    resolve()
  },
  bindEvent(resolve) {
    resolve()
  }
}))
