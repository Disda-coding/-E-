import Vue from 'vue'
// 导入router
import VueRouter from 'vue-router'
// 导入自定义的包
import Login from '../views/Login'
import Home from '../views/Home'
import LoginC from "@/views/LoginC";
// 开启路由
Vue.use(VueRouter)
// 配置路由
const routes = [
  {
    path:'/',
    name:'LoginC',
    component: LoginC,
    hidden:true //防止被渲染出来
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    hidden:true //防止被渲染出来
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    //使得组件内的router生效，而不是跳进app.vue的路由中
    children: [
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
