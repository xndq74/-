const key = 'geek-itheima'
// 写入token
export const SetToken = (token) => {
  localStorage.setItem(key, token)
}
// 读取token
export const GetToken = () => {
  return localStorage.getItem(key)
}
// 移除token
export const RemoveToken = () => {
  localStorage.removeItem(key)
}
