/**
 * 项目配置文件
 * @overview 配置文件，需要配置的信息均写在该文件里
 * @author [luoluo]
 * @version 2.0.0
 */

/**
 * 项目执行环境
 * development:开发模式，test:测试模式，online:线上模式
 */
export const environment = "development"

/**
 * 程序版本
 */
export const version = '1.0'


/**
 * 项目配置
 * @property {string} nameCn 项目中文名字
 * @property {string} nameEn 项目英文名字
 */
export const projectInfo = {
  nameCn: '',
  nameEn: ''
}


/**
 * ajax配置
 * @property {string} urlHead 请求地址头部
 * @property {string} imgUpload 图片上传地址
 * @property {string} fileUpload 文件上传地址
 * @property {string} loadingText loading显示的文字
 */
export const ajaxConfig = {
  urlHead: environment === "development" ? "http://www.iquntv.com/qtv" : "/qtv",
  userInfoPort: "/wechat/user/info",
  loginPort: "",
  payPort: "/order/joinGroup",
  getPhonePort: "/member/GetWechatPhoneModelInXcx",
  imgUpload: "",
  fileUpload: "",
  loadingText: "加载中"
}

/**
 * 页面配置
 * @property {string} home 主页路径
 * @property {string} login 登录页面
 */
export const pageConfig = {
  home: "/pages/Home/Index",
  login: "/pages/Home/login"
}

/**
 * 页面图片地址头部
 * @property {number} scale 标准页面比例
 * @property {string} scaleMode 缩放模式
 */

export const imgURLHead = "http://60.205.209.49:8090/"

/**
 * key配置
 * @property {string} tokenKey 存储token的key
 */
export const key = {
  tokenKey: 'token'
}

/**
 * app项目配置
 */
export const appConfig = {}