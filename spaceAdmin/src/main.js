// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import store from './store'
import axios from '@/utils/axiosConfig'
import {getCookie, formatDate} from '@/utils/utils'
import '@/assets/css/style.less'
import '@/assets/css/button.scss'

// 引入icon
import './assets/iconfont/iconfont.css'
// 引入reset.css
import './components/reset/reset.css'
// 引入复制插件
import VueClipboard from 'vue-clipboard2'
import '../node_modules/babel-polyfill/dist/polyfill.js'

import comp from './components/comp.js'
Vue.use(comp)
Vue.use(iView)
Vue.use(VueClipboard)
Vue.config.productionTip = false

if (process.env.NODE_ENV === 'sendproduction') {
  axios.defaults.baseURL = 'https://todo.kangyun3d.cn/index.php'
  Vue.prototype.$imgURL = 'https://todo.kangyun3d.cn/'
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://space.kangyun3d.cn/index.php'
  Vue.prototype.$imgURL = 'https://space.kangyun3d.cn/'
} else {
  // axios.defaults.baseURL = 'http://localhost/spacephp/public/index.php'
  axios.defaults.baseURL = 'http://localhost:8080' + '/index.php'
  // Vue.prototype.$imgURL = 'http://localhost/spacephp/public/'
  Vue.prototype.$imgURL = 'http://localhost:8080/api/'
}

Vue.prototype.$http = axios
const filters = {
  formateTime (val) {
    let arr = new Date(val)
    let time
    time = arr.getFullYear() + '年' + (arr.getMonth() + 1) + '月' + arr.getDate() + '日' + arr.getHours() + '时' + arr.getMinutes() + '分' + arr.getSeconds() + '秒'
    return time
  },
  formatDate
}
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
Object.keys(filters).forEach(val => {
  Vue.filter(val, filters[val])
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

store.commit('getCookie', getCookie('token'))
