import Vue from "vue"
// 导入router
import VueRouter from "vue-router"
// 导入自定义的包
import Login from "../views/Login"
import Home from "../views/Home"
import LoginC from "@/views/LoginC";
import Register from "@/views/Register";
import Forgot from "@/views/Forgot";
import FriendChat from "@/views/chat/FriendChat";
import AdminInfo from "@/views/AdminInfo";

// 开启路由
Vue.use(VueRouter)
// 配置路由
const routes = [
  {
    path:"/",
    name:"LoginC",
    component: LoginC,
    hidden:true //防止被渲染出来
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    hidden:true //防止被渲染出来
  },
  {
    path: "/register",
    name: "注册",
    component: Register,
    hidden: true
  },
  {
    path: "/forgot",
    name: "找回",
    component: Forgot,
    hidden: true
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/chat',
        name: '在线聊天',
        component: FriendChat
      },
      {
        path: '/userinfo',
        name: '个人中心',
        component: AdminInfo
      }
    ]
  }
]



const router = new VueRouter({
  routes
})

export default router
