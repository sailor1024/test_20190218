import axios from 'axios'
import store from '@/store'
import {removeCookie} from '@/utils/utils'
import Vue from 'vue'
// import {ACCOUNT_TIME_OUT} from '@/utils/magicNumber'
let isLock = false
const instance = axios.create({
  // 默认http请求需要传token参数
  isNeedToken: true
})
instance.interceptors.request.use((config) => {
  let paramsObj
  if (config.isNeedToken) {
    if (config.method === 'post') {
      paramsObj = config.data
      if (store.state.token) { paramsObj._ = store.state.token }
      config.data = paramsObj
    } else if (config.method === 'get') {
      if (!config.params) {
        config.params = {}
      }
      paramsObj = config.params
      if (store.state.token) { paramsObj._ = store.state.token }
      config.data = paramsObj
    }
  }
  return config
})

export default instance

instance.interceptors.response.use((res) => {
  if (!res.data) {
    return res
  }
  if (res.data.message && res.data.message === 'token失效') {
    if (!isLock) Vue.prototype.$Message.error('登录异常，请重新登录')
    isLock = true
    exit()
  } else {
    return res
  }
})

function exit () {
  removeCookie()
  setTimeout(() => {
    document.location.reload()
  }, 1000)
}
