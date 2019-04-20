import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      // 如果是 / 根路径 重定向到/home
      path: '/',
      redirect: 'home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    }
  ]
})
// 添加导航守卫
router.beforeEach((to, from, next) => {
  // 如果跳转是登录状态 next()
  if 
})
export default router
