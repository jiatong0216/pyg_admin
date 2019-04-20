import Vue from 'vue'
import App from './App'
import router from './router'

// 依赖全局样式文件
import './assets/css/global.css'

// 依赖element-UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

// 控制台的日志是否详细
Vue.config.productionTip = false

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
