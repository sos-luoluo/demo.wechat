# demo.wechat介绍
- 在开发了众多的小程序之后，开始萌发了重新写一套模板项目的想法。市面上大多框架仅仅是针对代码与逻辑进行了优化处理，但对对业务方面的优化却很少，再三考虑下还是自己写一个。
- 该套模板项目为小程序开发工具开发，集成了较多与业务处理相关的方法，重新封装了wx，也增加了类似vue的数据自动同步的方法
# 安装
## 克隆项目
- git clone https://github.com/sos-luoluo/demo.wechat
## 安装依赖
- 小程序现在支持npm包了，可以安装小程序的npm包
# 开发
## app注册
- app注册仅仅需要像示例代码一样new一个APP实例即可，如需执行其它代码可以在相应的生命周期添加想执行的代码即可，参数与原生的参数一致
- app.json与app.wxss处理方式与原生一致，全局组件需要在app.json里注册
## page注册与代码编辑
- page注册也仅仅需要像示例代码一样new一个page实例即可，如需执行其它代码，可以在相应生命周期添加执行代码，参数与原生的参数一致。如有bindData，bindEvent，则必须resolve promise用来控制页面加载进程。
## APP注册详细配置
- globalData 全局数据
- onLaunch app加载的时候执行
- onShow app显示的时候执行
- onHide app隐藏的时候执行
- onError app出错的时候执行
- onPageNotFound app查询不到页面的时候执行
- app里集成了一个日志处理模块，可以使用this.logManager添加日志或者执行发送操作
- app里还有个隐藏的方法，this.implement，可以定义一些特殊指令，例如跳转到特殊的测试页面，获取日志记录等
## page注册详细配置
- data 页面初始数据
- isNeedLogin 是否执行登录状态判定
- init 对象初始化的时候执行。注意，此时page尚未注册，拿不到页面this，此时this指向的是new出来的这个对象。
- onLoad 页面初始化的时候执行
- onReady 页面就绪的时候执行
- onShow 页面显示的时候执行
- onHide 页面隐藏的时候执行
- onUnload 页面卸载的时候执行
- onPullDownRefresh 页面下拉的时候执行
- onReachBottom 滑动到页面底部的时候执行
- onShareAppMessage 分享的时候执行
- onPageScroll 页面滚动的时候执行
- onResize 页面尺寸发生改变的时候执行
- onTabItemTap 页面尺寸变化时执行
- bindData 请求并绑定数据，包含两个参数resolve，reject，必须执行一个
- bindEvent 绑定事件处理程序，你可以用this.implementEvent来绑定事件，包含两个参数事件名，与处理方法，页面使用data-id来定义事件名，使用catchtap='event'来绑定事件，处理方法里有一个参数，包含了data里的所有数据
- pageRefresh 页面刷新方法，传入true可以强制刷新整个页面
- 小程序里设置数据需要用setData方法，为了避免这样的事，你可以使用dataSync，这个方法会同步当然的数据到data里，你可知直接使用类似this.dataSync.testData=1这样来设置数据，当然这里也提供了nextTick的方法用来在数据渲染完成后绑定一个回调，使用方法类似vue
## 数据与事件绑定
- bindData 请求并绑定数据方法，在完成的时候需要调用resolve，reject，如果有多个请求，你可以使用Promise.all
- bindEvent 注册事件处理方法，在完成的时候需要调用resolve，reject，当然并非所有的事件都要求在这里一并处理。在完成的时候需要调用resolve，reject。页面使用data-id来定义事件名，使用catchtap='event'来绑定事件，，使用this.implementEvent来绑定事件，包含两个参数，事件名与处理方法，处理方法里有一个参数，包含了data里的所有数据
# 文档
## components
## wxp
## ajax
## log
## login
## store
## tools
## wxapi
## worker
