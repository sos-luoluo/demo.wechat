/**
 * 多线程处理方法
 * @overview 常用组件
 * @author [luoluo]
 * @version 2.0.0
 */

// Code错误码定义
// 500 消息解析错误
// 501 指令执行错误
// 502 消息发送错误
// 503 其它类型错误

/**
 * 配置信息
 * @property {string} version 版本
 * @property {function} name 名字
 */
let config = {
  version: "0.1",
  name: "worker"
};

/**
 * 通信协议层
 * @overview 该层控制网络通信，校验数据，验证消息时效
 * @constructor
 * @property {function} sendData 发送数据
 * @property {function} packageData 包装数据
 * @property {function} analysisData 解析数据
 */
function Communications() {
  // 发送数据
  function sendData(data) {
    worker.postMessage(data);
  }
  // 包装数据
  function packageData(data) {
    let message = {
      version: config.version,
      timestamp: new Date().getTime(),
      form: config.name,
      code: 0,
      to: data.to,
      key: data.key,
      data: data.data
    };
    sendData(message);
  }
  // 解析数据
  function analysisData(data) {
    try {
      if (data.to !== config.name) {
        throw new Error("name error");
        return;
      }
      if (new Date().getTime() - data.timestamp > 60000) {
        throw new Error("time out");
        return;
      }
      transaction.implement(data.handle).then(res => {
        packageData({
          to: data.from,
          key: data.key,
          data: res
        });
      });
    } catch (e) {
      console.error(e);
    }
  }
  // 初始化方法,监听数据
  (() => {
    worker.onmessage = data => {
      analysisData(data.data);
    };
  })();
}
const communications = new Communications();

/**
 * 事务处理层
 * @overview 该层接收处理事务指令，在执行完指令之后返回数据,注册的事务可以是异步方法，但必须返回一个promise
 * @constructor
 * @property {object} affair 事务数据缓存
 * @property {function} registration 注册事务方法
 * @property {function} implement 执行事务方法
 */
function Transaction() {
  const affair = {};
  /**
   * 注册事务方法,注册方法必须返回一个Promise
   * @param {string} name 事务名称
   *  @param {function} method 事务处理函数
   */
  function registration(name, method) {
    if (!!name && typeof method === "function" && !affair[name]) {
      affair[name] = method;
    }
  }
  this.registration = registration;
  // 执行事务
  function implement(handle) {
    return new Promise((resolve, reject) => {
      if (handle.name && affair[handle.name]) {
        affair[handle.name](handle.data)
          .then(res => {
            resolve({
              code: 0,
              data: res
            });
          })
          .catch(res => {
            resolve({
              code: 501,
              data: res
            });
          });
      } else {
        resolve({
          code: 501,
          data: "handle missing"
        });
      }
    });
  }
  this.implement = implement;
}
const transaction = new Transaction();

/**
 * 业务逻辑层
 * @overview 该层注册具体业务逻辑及方法
 */
transaction.registration("test", function (data) {
  return new Promise((resolve, reject) => {
    resolve("我已收到你的消息");
  });
});
