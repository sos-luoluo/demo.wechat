import { ajax, listAjax} from './ajax.js'

/**
 * 项目api
 * @overview 项目所有api,一般是详情接口
 * @author [luoluo]
 * @version 2.0.0
 */

// 热门三条数据
export let hotList = () => {
  return ajax({
    url: "/post/list",
    data: {
      current: 1,
      size: 3,
      order: 1
    },
  })
}
// 首页轮播图
export let swiperList = () => {
  return ajax({
    url: "/post/list",
    data: {
      current: 1,
      size: 10,
      wheelShow: 1
    },
  })
}
// 最新三条数据
export let newList = () => {
  return ajax({
    url: "/post/list",
    data: {
      current: 1,
      size: 3,
      order: 2
    },
  })
}
// 精选圈子-九条数据
export let hotForum = () => {
  return ajax({
    url: "/forum/list",
    data: {
      current: 1,
      size: 9,
      hot: 1
    }
  })
}
// 精选圈子-十条数据
export let hotForum2 = () => {
  return ajax({
    url: "/forum/list",
    data: {
      current: 1,
      size: 10,
      hot: 1
    }
  })
}

// 内容详情
export let postDetail = (id) => {
  return ajax({
    url: "/post/detail",
    data: {
      id: id
    }
  })
}

// 回复详情
export let postReplyRecordDetail = (id)=>{
  return ajax({
    url: "/postReplyRecord/detail",
    data:{
      id: id
    },
  })
}

// 发表内容
export let postCreate = (formData) => {
  return ajax({
    url: "/post/create",
    hasLoading: true,
    data: formData,
  })
}

// 打卡
export let planPunch = (formData) => {
  return ajax({
    url: "/plan/punch",
    hasLoading: true,
    data: formData,
  })
}
// 圈子详情
export let forumDetail = (id) => {
  return ajax({
    url: "/forum/detail",
    data: {
      id: id
    },
  })
}
// 圈子关注
export let forumLike = (forumId, type) => {
  return ajax({
    id: 'forumLike',
    url: "/forum/like",
    hasLoading: true,
    data: {
      forumId: forumId,
      type: type
    },
  })
}
// 推荐关注的人
export let listRecommend = () => {
  return ajax({
    url: "/user/listRecommend",
    data: {
      current: 1,
      size: 20
    }
  })
}

// 点赞内容
export let postSupport = (id, type) => {
  return ajax({
    id: 'follow',
    hasLoading: true,
    url: "/post/support",
    data: {
      id: id,
      type: type
    }
  })
}

// 点赞回复
export let postReplyRecordLike = (replyId, type) => {
  return ajax({
    url: "/postReplyRecord/like",
    data: {
      replyId: replyId,
      type: type
    },
  })
}

// 回复内容
export let replyPost = (postId, content, replyImgUrl) => {
  return ajax({
    url: "/postReplyRecord/replyPost",
    hasLoading:true,
    id: 'replyPost',
    data: {
      postId: postId,
      content: content,
      replyImgUrl: replyImgUrl
    },
  })
}

// 回复别人的回复 (评论别人的回答)
export let replyReply = (data) => {
  return ajax({
    url: "/postReplyRecord/replyReply",
    hasLoading:true,
    id: 'replyReply',
    data: {
      replyId: data.replyId,
      atReplyId: data.atReplyId,
      content: data.content
    },
  })
}

// 关注/取关
export let likeUser = (data) => {
  return ajax({
    url: "/userRelation/like",
    hasLoading:true,
    id: 'like',
    data: {
      userId: data.userId,
      type: data.type
    },
  })
}

// 提交formid
export let formIdSubmit = (formId) => {
  return ajax({
    url: "/formId/collect",
    data: {
      formTemplates: [{
        formId: formId,
        expire: new Date().getTime() + 7 * 24 * 60 * 60 * 1000
      }]
    }
  })
}

// 关注、取消关注某人
export let userRelation = (userId, type) => {
  return ajax({
    url: "/userRelation/like",
    hasLoading:true,
    data: {
      userId: userId,
      type: type
    }
  })
}

// 获取他人的用户信息
export let otherDetail = (userId)=>{
  return ajax({
    url: "/user/otherDetail",
    data: {
      userId: userId
    }
  })
}

// 根据关键字查询名称类似的圈子
export let searchForum = (keyWord)=>{
  return ajax({
    url: "/forum/searchForum",
    data: {
      size: 20,
      current: 1,
      keyWord: keyWord
    }
  })
}

// 根据关键字查询名称类似的文章、视频等
export let searchArticle = (keyWord,type)=>{
  return ajax({
    url: "/post/searchArticle",
    data: {
      size: 10,
      current: 1,
      keyWord: keyWord,
      type:type
    }
  })
}

// 加入圈子或退出
export let joinGroup = (forumId ,type)=>{
  return ajax({
    url: "/forum/join",
    data: {
      forumId: forumId,
      type: type
    }
  })
}

//饮食字典列表
export let detailFood = (foodsId)=>{
  return ajax({
    url: "/foods/detail",
    data: {
      foodsId: foodsId,
    }
  })
}

// 查看某一条咨询记录的详情
export let replyDetail=(askId)=>{
    return ajax({
      url:"/yuanToAsk/detail",
      data:{
        askId:askId
      }
    })
}

//直播详情
export let liveDetail = (id)=>{
  return ajax({
    url: "/live/liveDetail",
    data: {
      postId: id
    }
  })
}
//生成直播流
export let initLive = (id)=>{
  return ajax({
    url: "/live/initLive",
    data: {
      liveId: id
    }
  })
}
//改变直播的状态
export let updateLiveStatus = (id, liveStatus, liveDesc)=>{
  return ajax({
    url: "/live/updateLiveStatus",
    data: {
      liveId: id,
      liveStatus: liveStatus,
      liveDesc: liveDesc
    }
  })
}
//查询历史弹幕消息
export let liveMessageList = (id)=>{
  return ajax({
    url: "/live/liveMessage",
    data: {
      liveId: id,
      time: new Date().getTime(),
      size: 50
    }
  })
}
//用户追问
export let askAagin=(askId)=>{
  return ajax({
    url: "/order/askAgain",
    data: {
      askId: askId
    }
  })
}
//查询单个医生信息
export let detail=(doctorId)=>{
  return ajax({
    url: "/consultant/detail",
    data: {
      doctorId: doctorId
    }
  })
}
//某个计划打卡详情
export let planPlunDetail=(planId)=>{
  return ajax({
    url: "/plan/getMyPunchPlan",
    data: {
      planId: planId
    }
  })
}
//查询单个营养师套餐详情
export let getDietitianService=(id)=>{
  return ajax({
    url: "/dietitianService/getDietitianService",
    data: {
      serviceId: id
    }
  })
}
//购买营养师套餐
export let dietitianService=(id)=>{
  return ajax({
    id:'dietitianService',
    url: "/order/dietitianService",
    data: {
      serviceId: id
    }
  })
}
// 获取推荐阅读 (固定三条))
export let postList=()=>{
   return ajax({
     id:'postList',
     url:'/post/list',
     data:{
       current: 1,
       size: 3,
       type: 0,
       order: 1
     }
   })
}
// 关于我们 说明
export let getDesc=()=>{
  return ajax({
    url:'/setting/getDesc',
    data:{
    }
  })
}

//  反馈邮箱
export let getEmail=()=>{
  return ajax({
    url:'/setting/getEmail',
    data:{
    }
  })
}