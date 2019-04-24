import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/home/Home'
import Welcome from '@/components/home/Welcome'
import Users from '@/components/users/Users'
import Rights from '@/components/auth/Rights'
import Roles from '@/components/auth/Roles'

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
        {path: '/users', name: 'users', component: Users},
        {path: '/rights', name: 'users', component: Rights},
        {path: '/roles', name: 'users', component: Roles}
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
