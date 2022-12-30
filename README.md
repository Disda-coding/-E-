# yeb
技术栈
- Vue 2
- Vuex
- Axios
- ES6
- Webpack
- ElementUI
- Stomp
- Websocket
- Vue-chat
## 项目目录
### views
里面存放页面
### components
里面存放可复用的组件
### utils
工具类
- api.js
> 封装了axios的接口，实现了响应拦截器
### router
存放页面路由的信息
### assets
一些静态资源文件
### vue.config.js
配置nodejs的代理转发



## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# todolist
- 聊天组件的搜索（vuex监听
- tree组件一闪而过
- 聊天持久化
- 用户是否在线
- 用户分组

# Imporve
- 添加了聊天联系人搜索功能
- 使得主页header可以根据是否有消息进行样式改变
- 点击消息会跳转到聊天当前人
- 切换页面，聊天窗口还是刚刚那个人的情况下不会提醒 
- 纯css编写的聊天框箭头
- 对齐了聊天框的位置
