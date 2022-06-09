import request from '@/utils/request'

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
export const GetAllChannels = () => request({
  url: '/channels',
  method: 'GET'
})
/*
设置用户的频道（部分覆盖）
Path： /v1_0/user/channels
Method： PATCH
*/
export const SetUserChannels = ({ channels }) => request({
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
export const DeleteUserChannels = (target) => request({
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
