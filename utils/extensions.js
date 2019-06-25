/**
 * 原生方法扩展
 * @overview 扩展JS原生方法，方便使用
 * @author [luoluo]
 * @version 2.0.0
 */

/**
 * 数组求和
 * @param {function|string|undefined} propertyOrFunc
 */
Array.prototype.sum = function (propertyOrFunc) {
  var total = 0
  for (let i = 0; i < this.length; i++) {
    total += typeof (propertyOrFunc) === "function" ? propertyOrFunc(this[i]) : typeof (propertyOrFunc) === "string" ? this[i][propertyOrFunc] : this[i]
  }
  return total
}

/**
 * 获取map的长度
 */
Map.prototype.getLength = function () {
  var count = 0;
  this.forEach(() => {
    count++
  })
  return count;
}

/**
 * 将对象转变为字符,不支持递归
 */
Object.defineProperty(Object.prototype,'string',{
  value: function () {
    const result = []
    for (let key in this) {
      result.push(key + '=' + this[key])
    }
    return result.join("&")
  }
})
/**
 * 判断对象是否为空对象
 */
Object.defineProperty(Object.prototype,'isEmpty',{
  value:function(){
    const keys = Object.keys(this)
    return keys.length === 0
  }
})
/**
 * 判断对象是否为数组
 */
Object.defineProperty(Object.prototype, 'isArray', {
  value: function () {
    return typeof this === "object" && typeof this.length === "number" && typeof this.splice === "function"
  }
})


export default undefined