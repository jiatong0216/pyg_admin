import Vue from 'vue'
import App from './App'
import router from './router'

// 依赖全局样式文件
import './assets/css/global.css'

// 依赖element-UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 依赖配置好的axios
import axios from './http'

// 依赖iconfont
import './assets/fonts/iconfont.css'
// 注册 ElementUI
Vue.use(ElementUI, { size: 'small' })

Vue.prototype.$http = axios

// 控制台的日志是否详细
Vue.config.productionTip = false
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
