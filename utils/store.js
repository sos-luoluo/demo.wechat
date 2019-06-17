/**
 * 缓存器
 * @overview 缓存器，全局只能new 一个
 * @author [luoluo]
 * @version 2.0.0
 */
const store=new Map()

/**
 * 缓存函数
 * @overview 缓存函数，用来缓存结果
 * @param {function} func 需要缓存的函数
 * @param {object} obj 参数
 */
function mmoize(func, obj) {
  var obj = obj || {},
    func = obj[func],
    cache = {};
  return function () {
    var key = Array.prototype.join.call(arguments, '_');
    if (!(key in cache))
      cache[key] = func.apply(obj, arguments);
    return cache[key];
  }
}

export default store