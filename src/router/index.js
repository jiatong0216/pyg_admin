import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/Users'

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
      component: Home,
      redirect: '/welcome',
      children: [
        {path: '/welcome', name: 'welcome', component: Welcome},
        {path: '/users', name: 'users', component: Users}
      ]
    }
  ]
})
// 添加导航守卫
router.beforeEach((to, from, next) => {
  // 如果跳转是登录状态 next()
  if (to.path === '/login') return next()
  // 如果未登录 检测sessionStorage是否有token 没有token 拦截到登录页
  if (!sessionStorage.getItem('token')) return next('/login')
  // 其他情况
  next()
})
export default router
