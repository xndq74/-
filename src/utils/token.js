const key = 'geek-itheima'
// 写入token
export const SetToken = (key = 'geek-itheima', token) => {
  localStorage.setItem(key, token)
}
// 读取token
export const GetToken = (key = 'geek-itheima') => {
  return localStorage.getItem(key)
}
// 移除token
export const RemoveToken = () => {
  localStorage.removeItem(key)
}
// 移除全部token
export const ClearToken = () => {
  localStorage.removeItem(key)
  localStorage.removeItem('refresh_token')
}
