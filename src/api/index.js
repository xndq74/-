import request from '@/utils/request'
import * as user from '@/api/user'

export const GetUserChannels = () => request({ url: '/channels', method: 'get' })

export default {
  user
}
