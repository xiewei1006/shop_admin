import Vue from 'vue'
import Router from 'vue-router'

// 导入组件
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Users from '@/components/user/Users.vue'
import Roles from '@/components/roles/Roles.vue'
import Rights from '@/components/roles/Rights.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        { path: '/users', component: Users },
        { path: '/roles', component: Roles },
        { path: '/rights', component: Rights }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
