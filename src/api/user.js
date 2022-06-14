import request from '@/utils/request'
import { GetToken } from '@/utils/token'
export const SetLogin = (data) => {
  return request({
    url: '/authorizations',
    method: 'POST',
    data
  })
}

/*
获取用户的频道
user/channels
 GET
*/
export const GetUserChannels = () => {
  return request({
    url: '/user/channels',
    method: 'get'
  })
}

/*
获取文章新闻推荐
基本信息
Path： /v1_0/articles
Method： GET
*/
export const GetArticles = (GetArticlesData) => {
  return request({
    url: '/articles',
    method: 'get',
    params: GetArticlesData
  })
}

/*
对文章不喜欢
Path： /v1_0/article/dislikes
Method： POST
*/
export const articleNoLike = (target) => {
  return request({
    url: '/article/dislikes',
    method: 'POST',
    data: target
  })
}

/*
获取用户自己信息
Path： /v1_0/user
Method： GET
*/
export const GetUserInfo = () => {
  return request({
    url: '/user',
    method: 'GET'
  })
}
/*
举报文章
Path： /v1_0/article/reports
Method： POST */
export const ReportArticle = (target, type) => {
  return request({
    url: '/article/reports',
    method: 'POST',
    data: {
      target,
      type,
      remark: '没问题'
    }
  })
}

/*
获取用户的频道
Path： /v1_0/channels
Method： GET
*/
export const GetAllChannels = () =>
  request({
    url: '/channels',
    method: 'GET'
  })
/*
设置用户的频道（部分覆盖）
Path： /v1_0/user/channels
Method： PATCH
*/
export const SetUserChannels = ({ channels }) =>
  request({
    url: '/user/channels',
    method: 'PUT',
    data: {
      channels
    }
  })
/* 删除指定用户频道
Path： /v1_0/user/channels/:target
Method： DELETE
*/
export const DeleteUserChannels = (target) =>
  request({
    url: `/user/channels/${target}`,
    method: 'DELETE'
  })
/*
获取联想建议（自动补全）
Path： /v1_0/suggestion
Method： GET
*/
export const GetSearchLenovo = ({ keyWord }) => {
  return request({
    url: '/suggestion',
    method: 'GET',
    params: {
      q: keyWord
    }
  })
}
/*
获取搜索结果
Path： /v1_0/search
Method： GET
*/
export const GetSearchResult = ({ page = 1, per_page = 10, q }) => {
  return request({
    url: '/search',
    method: 'GET',
    params: {
      page,
      per_page,
      q
    }
  })
}
/*
获取新闻详情
Path：/v1_0/articles/:article_id
Method： GET
*/
export const GetDetail = (article_id) =>
  request({
    url: `/articles/${article_id}`,
    method: 'GET'
  })
/*
关注用户
基本信息
Path： /v1_0/user/followings
Method： POST
*/
export const SetFocusOn = ({ target }) =>
  request({
    url: '/user/followings',
    method: 'POST',
    data: {
      target
    }
  })
/*
取消关注用户
Path： /v1_0/user/followings/:target
Method： DELETE
*/
export const SetCancelFocusOn = ({ target }) =>
  request({
    url: `/user/followings/${target}`,
    method: 'DELETE'
  })
/*
对文章点赞
Path： /v1_0/article/likings
Method： POST
*/
export const SetGiveLike = ({ target }) =>
  request({
    url: '/article/likings',
    method: 'POST',
    data: {
      target
    }
  })
/*
取消对文章点赞
基本信息
Path： /v1_0/article/likings/:target
Method： DELETE
*/
export const SetCancelGiveLike = ({ target }) =>
  request({
    url: `/article/likings/${target}`,
    method: 'DELETE'
  })
/*
获取评论或评论回复
Path： /v1_0/comments
Method： GET
*/
export const GetComments = ({ type = 'a', source, offset = null, limit = 3 }) =>
  request({
    url: '/comments',
    method: 'GET',
    params: {
      type,
      source,
      offset,
      limit
    }
  })
/*
对评论或评论回复点赞
基本信息
Path： /v1_0/comment/likings
Method： POST
*/
export const GetCommentLike = ({ target }) =>
  request({
    url: '/comment/likings',
    method: 'POST',
    data: {
      target
    }
  })
/*
取消对评论或评论回复点赞
Path： /v1_0/comment/likings/:target
Method： DELETE
*/
export const GetCommentCancelLike = ({ target }) =>
  request({
    url: `/comment/likings/${target}`,
    method: 'DELETE'
  })
/*
对文章或者评论进行评论
Path： /v1_0/comments
Method： POST
target string 必须  评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
content string 必须 评论内容
art_id string 必须 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
本次返回结果的最后一个评论id，作为请求下一页数据的offset参数，若本次无具体数据，则值为NULL
服务器会返回
*/
export const SetComment = ({ target, content, art_id = null }) =>
  request({
    url: '/comments',
    method: 'POST',
    data: {
      target,
      content,
      art_id
    }
  })
/*
获取用户个人资料
基本信息
Path： /v1_0/user/profile
Method： GET
*/
export const GetUserEditor = () =>
  request({
    url: '/user/profile',
    method: 'GET'
  })
/*
编辑用户照片资料（头像、身份证照片）
基本信息
Path： /v1_0/user/photo
Method： PATCH
*/
export const SetUserPhoto = (photo) => {
  console.log(photo)
  return request({
    url: '/user/photo',
    method: 'PATCH',
    data: photo
  })
}
/* 编辑用户个人资料
Path： /v1_0/user/profile
Method： PATCH
// 准备需要修改什么传入什么，但是有怕忘记参数就把所以数据拿过来。
名称 类型 是否必须 默认值 备注 其他信息
name  string 必须 昵称
gender string 必须 性别，0-男，1-女
birthday string 必须 生日，格式'2018-12-20'
real_name string 必须 真实姓名
intro string 必须 个人介绍
*/
export const SetUserInfo = (data) =>
  request({
    url: '/user/profile',
    method: 'PATCH',
    data
  })

/*
刷新用户token
Path： /v1_0/authorizations
Method： PUT
*/
export const acquireNewToken = () => {
  return request({
    url: '/authorizations',
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GetToken('refresh_token')}`
    }
  })
}
