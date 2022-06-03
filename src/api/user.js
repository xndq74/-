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
