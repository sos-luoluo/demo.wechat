/**
 * 拓展wxAPI的使用方法，使其支持Promise
 * @author [luoluo]
 * @version 1.0.0
 */

let hanler = {
  get: function(target, name) {
    if (target[name] && typeof target[name] === "function") {
      return function(param) {
        return new Promise((resolve, reject) => {
          if (!param) {
            param = {}
          }
          let success = param.success
          let fail = param.fail
          param.success = function() {
            success && success(...arguments)
            resolve(...arguments)
          }
          param.fail = function() {
            fail && fail(...arguments)
            reject(...arguments)
          }
          target[name](param)
        })
      }
    } else if (target[name] && typeof target[name] === "object") {
      return target[name]
    } else {
      return null
    }
  }
}

export default new Proxy(wx, hanler)