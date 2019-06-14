/**
 * 基础方法库
 * @overview 基础方法库
 * @author [luoluo]
 * @version 2.0.0
 */


/**
 * 合并对象，以第一个有效对象为基础进行合并
 * @param {boolean} mode 是否深度合并,可选
 * @param {object} obj 待合并对象数组
 */
export function extend() {
  if (typeof arguments[0] === "boolean" && arguments[0] === true) {
    for (let k = 1; k < arguments.length; k++) {
      if (typeof arguments[k] === "object") {
        if (!result) {
          var result = arguments[k];
          continue;
        }
        for (const key in arguments[k]) {
          if (typeof arguments[k][key] === "object") {
            result[key] = extend(true, result[key], arguments[k][key]);
          } else if (arguments[k][key]) {
            result[key] = arguments[k][key];
          }
        }
      }
    }
  } else {
    for (let i = 0; i <= arguments.length; i++) {
      if (typeof arguments[i] === "object") {
        if (!result) {
          var result = arguments[i];
          continue;
        }

        for (const key in arguments[i]) {
          if (arguments[i][key]) {
            result[key] = arguments[i][key];
          }
        }
      }
    }
  }
  return result;
}


/**
 * 判断一个对象是否为数组
 * @param {object} obj 对象
 */
export function isArray(obj) {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.length === "number" &&
    typeof obj.splice === "function" &&
    !obj.propertyIsEnumerable("length")
  );
}

/**
 * 延迟对象
 * @constructor
 * @property {number} state 状态
 * @property {function} resolve 将状态置为成功
 * @property {function} reject 将状态置为失败
 * @property {function} done 绑定成功回调
 * @property {function} fail 绑定失败回调
 * @property {function} then 绑定完成回调
 */
export class Deferred {
  state = undefined;
  param = undefined;
  doneFn = [];
  failFn = [];
  thenFn = [];
  constructor() {
    this.state = 0;
  }
  resolve() {
    if (this.state === 0) {
      this.state === 2;
      this.param = arguments;
    }
    this.check();
  }
  reject() {
    if (this.state === 0) {
      this.state = 1;
      this.param = arguments;
      this.check();
    }
  }
  done(method) {
    this.doneFn.push(method);
    this.check();
    return this;
  }
  fail(method) {
    this.failFn.push(method);
    this.check();
    return this;
  }
  then(method) {
    this.thenFn.push(method);
    this.check();
    return this;
  }
  check() {
    if (this.state === 2) {
      this.doList("doneFn", arguments);
      this.doList("thenFn", arguments);
    } else if (setting.state === 1) {
      this.doList("failFn", arguments);
      this.doList("thenFn", arguments);
    }
  }
  doList(name) {
    while (this[name].length > 0) {
      const item = this[name].shift();
      item.apply(this, this.param);
    }
  }
}

/**
 * 将多个延迟对象封装成一个
 * @param {Deferred} 延迟对象
 */
export function deferredAll() {
  const def = new Deferred();
  const result = [];
  let state = true;
  let length = arguments.length;
  for (let item of arguments) {
    item.done(function(res) {
      result.push(res);
      checked();
    });
    item.fail(function(res) {
      result.push(res);
      state = false;
      checked();
    });
  }

  function checked() {
    if (result.length === length) {
      if (state) {
        def.resolve.apply(this, result);
      } else {
        def.reject.apply(this.result);
      }
    }
  }
  return def;
}

/**
 * 随机数算法
 * @param {number} seed 种子
 */
export function random(seed) {
  seed = seed || new Date().getTime();
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

/**
 * 序列化数据用于Ajax,数据会被转换为key/value形式的formData对象
 * @param {Array|object} data 原始数据
 * @returns {object} formData
 */
export function serialize(data) {
  const formData = new FormData();

  function conversion(data, name) {
    const isFirst = name === "" || name === undefined || name === null;
    for (let item in data) {
      if (typeof data[item] === "object") {
        conversion(data[item], isFirst ? item : name + "[" + item + "]");
      } else {
        formData.append(isFirst ? item : name + "[" + item + "]", data[item]);
      }
    }
  }
  conversion(data, "");
  return formData;
}

/**
 * 将列表数据转化为树状结构数据
 * @param {Array} treeList 原始数据
 * @param {object} treeConfig 配置
 * @param {number|string} rootID 根节点的值
 * @param {string} Fkey 子节点指向父节点Id的key
 * @param {string} Fid 节点ID的key
 * @param {string} Skey 生成子节点的key
 */
export function convertTree(treeList, treeConfig) {
  const setting = $.extend({
      rootID: 0,
      Fkey: "fcode",
      Fid: "id",
      Skey: "children"
    },
    treeConfig
  );

  function querySon(condition) {
    const temp = [];
    for (let i = 0; i < treeList.length; i++) {
      if (treeList[i][setting.Fkey] === condition) {
        temp.push(treeList.splice(i, 1)[0]);
        i--;
      }
    }
    if (temp.length > 0) {
      for (let j = 0; j < temp.length; j++) {
        const result = querySon(temp[j][setting.Fid]);
        if (result.length > 0) {
          temp[j][setting.Skey] = result;
        }
      }
    }
    return temp;
  }
  return querySon(setting.rootID);
}

const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
/**
 * base64数据数据加解密方法
 * @property {function} encode 加密方法
 * @property {function} decode 解密方法
 */
export const base64 = {
  /**
   * 加密方法
   * @property {string} input 加密内容
   */
  encode: function(input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = this._utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output =
        output +
        _keyStr.charAt(enc1) +
        _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) +
        _keyStr.charAt(enc4);
    }
    return output;
  },
  /**
   * 解密方法
   * @property {string} input 解密内容
   */
  decode: function(input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = this._utf8_decode(output);
    return output;
  },
  // private method for UTF-8 encoding
  _utf8_encode: function(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  },
  // private method for UTF-8 decoding
  _utf8_decode: function(utftext) {
    var string = "";
    var i = 0;
    var c = (c1 = c2 = 0);
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(
          ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        );
        i += 3;
      }
    }
    return string;
  }
};

/**
 * 多线程管理器
 * @overview 创建多线程管理器，用于处理复杂的数据，注意全局只能new一个
 * @constructor
 * @param {function} init 初始化方法
 * @param {function} sendData 发送数据方法
 * @param {function} packageData 包装数据方法
 * @param {function} analysisData 解析数据方法
 * @param {function} handle 解析事务方法
 * @param {function} terminate 关闭多线程方法
 */
export class WorkerManage {
  constructor(options) {
    this.config = Object.assign({
        version: "1.0",
        url: "../worker/index.js",
        name: "app",
        to: "worker",
        handle: {}
      },
      options
    );
    this.init();
  }
  /**
   * 初始化方法，会根据配置初始化一个多线程
   */
  init() {
    this.worker = wx.createWorker(this.config.url);
    this.worker.onmessage = data => {
      this.analysisData(data.data);
    };
  }
  /**
   * 发送数据方法
   */
  sendData(data) {
    if (!this.worker) {
      this.init();
    }
    this.worker.postMessage(data);
  }
  /**
   * 打包数据方法
   */
  packageData(data) {
    let message = {
      version: this.config.version,
      timestamp: new Date().getTime(),
      from: this.config.name,
      to: this.config.to,
      key: data.key,
      handle: data.data
    };
    this.sendData(message);
  }
  /**
   * 解析返回的数据
   */
  analysisData(result) {
    try {
      if (result.to !== this.config.name) {
        throw new Error("name error");
        return;
      }
      if (new Date().getTime() - result.timestamp > 60000) {
        throw new Error("time out");
        return;
      }
      if (!this.config.handle[result.key]) {
        throw new Error("handle missing");
        return;
      }
      if (result.data.code === 0) {
        this.config.handle[result.key](result.data.data);
      } else {
        throw new Error("handle error");
        return;
      }
    } catch (e) {
      console.error(e);
    }
  }
  /**
   * 发送任务
   * @constructor
   * @param {string} name 调起的业务名称
   * @param {object} data 传递的参数
   * @param {function} callback 回调函数
   */
  handle(name, data = {}, callback) {
    let key = Math.random();
    if (typeof callback === "function") {
      this.config.handle[key] = callback;
    }
    this.packageData({
      data: {
        name: name,
        data: data
      },
      key: key
    });
  }
  /**
   * 关闭多线程任务
   */
  terminate() {
    this.worker.terminate();
    this.worker = undefined;
  }
}