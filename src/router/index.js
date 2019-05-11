import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/home/Home'
import Welcome from '@/components/home/Welcome'
import Users from '@/components/users/Users'
import Rights from '@/components/auth/Rights'
import Roles from '@/components/auth/Roles'
import Categories from '@/components/goods/Categories'
import Goods from '@/components/goods/Goods'
import Params from '@/components/goods/Params'
import GoodsAdd from '@/components/goods/Goods-Add'
import Orders from '@/components/orders/Orders'
import Reports from '@/components/reports/Reports'

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
        {path: '/rights', name: 'rights', component: Rights},
        {path: '/roles', name: 'roles', component: Roles},
        {path: '/categories', name: 'categories', component: Categories},
        {path: '/goods', name: 'goods', component: Goods},
        {path: '/params', name: 'params', component: Params},
        {path: '/goods/add', name: 'goodsAdd', component: GoodsAdd},
        {path: '/orders', name: 'orders', component: Orders},
        {path: '/reports', name: 'orders', component: Reports}
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
