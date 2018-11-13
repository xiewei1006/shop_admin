// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import axios from 'axios'
import './assets/index.css'

Vue.use(ElementUI)
// axios全局对象配置
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 请求拦截，发送时自动携带token令牌
axios.interceptors.request.use(function(config) {
  // 配置token令牌
  config.headers.Authorization = localStorage.getItem('token')
  return config
})
// 响应拦截，接收为res中的data属性
axios.interceptors.response.use(function(res) {
  return res.data
})

// 挂载axios对象
Vue.prototype.axios = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    token: ''
  },
  methods: {
    gettoken(data) {
      this.token = data
    }
  },
  router,
  components: { App },
  template: '<App/>'
})
