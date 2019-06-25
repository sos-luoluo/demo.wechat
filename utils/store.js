/**
 * 缓存方法
 * @overview 跟缓存相关的方法
 * @author [luoluo]
 * @version 2.0.0
 */

/**
 * 缓存器
 * @overview 缓存器，全局只能new 一个
 * @author [luoluo]
 * @version 2.0.0
 */
export const store = new Map()

/**
 * 缓存函数
 * @overview 缓存函数，用来缓存结果
 * @param {function} func 需要缓存的函数
 * @param {object} obj 参数
 */
export function mmoize(func, obj) {
  var obj = obj || {},
    func = obj[func],
    cache = {};
  return function() {
    var key = Array.prototype.join.call(arguments, '_');
    if (!(key in cache))
      cache[key] = func.apply(obj, arguments);
    return cache[key];
  }
}

/**
 * 列表数据缓存
 * @overview 缓存列表数据，全局只new一个，注意不会去重
 */
export class ListStore {
  constructor() {
    this.store = wx.getStorageSync('liststore') || {}
  }
  /**
   * 获取列表
   * @param {string} name 列表名
   */
  getList(name) {
    if (this.store[name]) {
      return this.store[name]
    } else {
      return []
    }
  }
  /**
   * 清除列表
   * @param {string} name 列表名
   */
  clearList(name) {
    this.store[name] = []
    this.refreshStore()
  }
  /**
   * 删除某项
   * @param {string} name 列表名
   * @param {number|string|object} value 配置的序号或值
   */
  delItem(name, value) {
    if (this.store[name]) {
      if (typeof value === 'number') {
        this.store[name].splice(value, 1)
      } else if (typeof value === 'string') {
        let index = this.store[name].findIndex(item => {
          return item === value
        })
        if (index !== -1) {
          this.store[name].splice(index, 1)
        }
      } else if (typeof value === 'object') {
        let index = this.store[name].findIndex(item => {
          return item[value.key] === value.value
        })
        if (index !== -1) {
          this.store[name].splice(index, 1)
        }
      }
    }
    this.refreshStore()
  }
  /**
   * 新增数据
   * @param {string} name 列表名
   * @param {any} value 新增数据
   */
  pushItem(name, value) {
    if (!this.store[name]) {
      this.store[name] = []
    }
    this.store[name].push(value)
    this.refreshStore()
  }
  refreshStore() {
    wx.setStorage({
      key: 'liststore',
      data: this.store,
    })
  }
}

export const listStore = new ListStore()
