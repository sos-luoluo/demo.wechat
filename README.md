# demo.wechat介绍
- 在开发了众多的小程序之后，开始萌发了重新写一套模板项目的想法。市面上大多框架仅仅是针对代码与逻辑进行了优化处理，但对业务方面的优化却很少，再三考虑下还是自己写一个。
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
## APP注册详细配置
- globalData 全局数据
- onLaunch app加载的时候执行
- onShow app显示的时候执行
- onHide app隐藏的时候
执行
- onError app出错的时候执行
- onPageNotFound app查询不到页面的时候执行
- app里集成了一个日志处理模块，可以使用this.logManager添加日志或者执行发送操作
- app里还有个隐藏的方法，this.implement，可以定义一些特殊指令，例如跳转到特殊的测试页面，获取日志记录等
## page注册与代码编辑
- page注册也仅仅需要像示例代码一样new一个page实例即可，如需执行其它代码，可以在相应生命周期添加执行代码，参数与原生的参数一致。如有bindData，bindEvent，则必须resolve promise用来控制页面加载进程。
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
- bindEvent 绑定事件处理程序，你可以用this.implementEvent来绑定事件，包含两个参数事件名，与处理方法，页面使用data-id来定义事件名，使用catchtap='event'来绑定事件，处理方法里有两个参数，包含了data里的所有数据
- pageRefresh 页面刷新方法，传入true可以强制刷新整个页面
- 小程序里设置数据需要用setData方法，为了避免这样的事，你可以使用dataSync，这个方法会同步当然的数据到data里，你可知直接使用类似this.dataSync.testData=1这样来设置数据，当然这里也提供了nextTick的方法用来在数据渲染完成后绑定一个回调，使用方法类似vue
## 数据与事件绑定
- bindData 请求并绑定数据方法，在完成的时候需要调用resolve，reject，如果有多个请求，你可以使用Promise.all
- bindEvent 注册事件处理方法，在完成的时候需要调用resolve，reject，当然并非所有的事件都要求在这里一并处理。在完成的时候需要调用resolve，reject。页面使用data-id来定义事件名，使用catchtap='event'来绑定事件，，使用this.implementEvent来绑定事件，包含两个参数，事件名与处理方法，处理方法里有两个参数，包含了data里的所有数据
# 文档
## components
### ajaxloading
- 这是请求loading，一般不主动调起，包含两个方法
- show：显示loading
- hide: 隐藏loading
### formid
- 收集formid的组件，放入需要的地方即可
### liststate
- 列表状态显示组件，一般放在列表数据绑定的末尾，配合js使用
### navbar
- 导航栏组件，会自动根据历史记录情况加载主页和返回按钮。导航栏图标使用自定义字体加载，所以需要根据项目情况生成字体代码，主要属性如下
- title:标题
- theme:主题
- backgroundColor: 背景色
- backEnable:返回按钮
- homeEnable：返回主页按钮
### pageloading
- 页面loading，一般有如下几种状态，加载中，加载失败，加载成功，一般不主动调起，具有一个属性
- state: 页面状态
### scrollbox 
- 简化版的自定义滚动组件，当滚动到底部时会自动吸附在底部。具有的主要属性和方法如下
- content属性：滚动组件内容，一般绑定组件内部插入的内容时可以同时绑定到改属性，属性发生变动的时候会触发重置
- scrollintoview属性：滑动到某个位置
- lock属性：为true的时候会被锁定导致滚动事件不触发
- resize方法：重置组件尺寸，一般内部内容发生改变的时候需要调用一下，与content属性功能一致
### tips
- 提示组件，2s后消失，主要方法如下
- showTips：显示内容，具有三个三参数text提示内容，iconType图标类型，callback回调函数
### updateinfo
- app升级提示组件，一般不用主动调起
### wx-cropper
- 裁剪图片组件
### wxParse
- 富文本工具，不是自定组件，使用方法参考官方文档https://github.com/icindy/wxParse
## ajax
## api
- 所有的详情接口都需要写在这个文件里，页面引用该处的接口即可
## base
### extend
- 支持深度合并的方法，第一个参数传入true则执行深度合并
### Deferred
- 延迟对象，使用方法类似$.Deferred，主要方法为：
- resolve：成功解决掉，可以携带参数；reject：失败，也可以携带参数
- done：绑定成功回调；fail：绑定失败回调；then：绑定完成回调
### deferredAll
- 将多个延迟对象封装为一个，参数为Deferred，使用方法类似$.when
### random
- 随机数算法，可以自定义种子
### serialize
- 序列化ajax数据，返回FormData。在某些特殊情况下需要手动序列化参数
### convertTree
- 将列表数据转化为树状结构数据
### base64
- base64数据数据加解密方法
### WorkerManage
- 多线程管理器，，用于处理复杂的数据，注意全局只能new一个。主要方法有
- handle：发送多线程任务，参数有，name:任务名；data：可选参数；callback：回调
- terminate：关闭多线程任务
## config
- 项目配置文件
### environment
- 开发模式配置
### version
- 版本信息
### projectInfo
- 项目配置信息
### ajaxConfig
- 请求相关配置
### pageConfig
- 页面相关配置
### imgURLHead
- 图片资源头部地址
### key
- key配置，包含token
## constants
- 静态数据配置
### NPCInfo
- 静态用户模拟数据
### wordLib
- 静态字典数据
### regular
- 正则表达式
### extensions
- 基础方法，增加了一些原型方法
- Array：新增了sum求和方法，groupBy用于数据分组的方法
- Map:getLength获取map长度的方法
- Object：string重新写了一个专为字符串的方法，isEmpty判断对象是否为空对象的方法，isArray判定对象是否为数组的方法
## log
- 日志管理器，挂在app上了，需要的时候可以主动调用
- addMsg：添加一条消息
- getData：获取消息记录
- clear: 清除消息
- save： 保存消息
## login
- 小程序授权登录方法，可以根据项目实际需求进行修改
## store
### store
- 一个Map对象，可以用来缓存数据
### mmoize
- 缓存函数，用来缓存函数的结果，第一个参数为函数，第二个参数为调用时候得参数
### ListStore
- 列表数据缓存
- getList：获取数据
- clearList：清除数据
- delItem：删除数据项
- pushItem：新增数据
## tools
- imgUrlCmplement：图片地址补全
- timeFormat：时间格式化方法
- dateFormat： 日期转化为指定的时间格式
- timeAgoFormat：时间转化为今天、昨天及具体时间
- priceFormat： 价格处理方法
- doubleDigit： 补全两位数字方法
- onlyOneImg： 将逗号分隔的图片数据转化为列表并取第一条数据
- randomChars： 返回随机字符串
- timeIntervalChange： 时间转化为天时分秒
- timeAgo： 时间转化为几分钟、几小时之前
- getUrlParam： 获取url参数的方法
- changeLog： 数据进制转化
- getPureModel： 获取纯净的数据
- urlJump： 地址跳转方法
- verificationCodeTime：验证码计时器
- changeSize：转化内存大小
- splitString：将字符串分割为指定宽度的数组
- getBreakPoint：canvas中获取文字的换行位置，需要先设置好文字的格式再调用此方法
- filterText：处理特殊字符，防止意外发生
- getImageSize：根据父元素宽高设置图片宽高
## wxapi
- 与微信相关的api
### uploadImg
- 上传图片方法
### pay
- 支付方法
## wxp
- 拓展wxAPI的使用方法，使其支持Promise写法
## worker JS多线程支持方法
### Communications
- 这是网络控制层，如有需要可以加入一些验证数据的方法，一般不用改动
### Transaction
- 事务处理层，缓存事务，接受网络层的指令并将处理结果返回到网络层
### 应用层
- 这里调用transaction的注册方法，将业务注册到事务处理层即可