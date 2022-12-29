<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title" @click="backToHome">☁️E办</div>
        <div style="display: flex;">
        <!--          -->
          <el-button :icon="!hasMsg?'el-icon-bell':'el-icon-message-solid'"
                     type="text"
                     class="bell"
                     size="normal"
                      :style="!hasMsg?('color:black'):('color:red')"
                     @click="goChat"
          >
          </el-button>
          <el-dropdown class="userInfo" @command="commandHandler">
          <span class="el-dropdown-link">
            <span class="userName">{{ user.name }}</span>
            <i><img :src="user.userFace"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
              <el-dropdown-item command="setting">设置</el-dropdown-item>
              <el-dropdown-item command="logout">注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container class="panel">
        <el-aside width="200px">
          <!--          router 开启路由模式（以index作为路径路由跳转） -->
          <el-menu router unique-opened class="menu">
            <template v-for="(item,index) in routes">
              <el-submenu :index="index +''"
                          :key="index" v-if="!item.hidden">
                <template slot="title"><i :class="item.iconCls" style="color:  rgb(64, 158, 255);margin-right: 5px"></i>
                  <span>{{ item.name }}</span>
                </template>
                <!-- 3、循环遍历子路由 -->
                <el-menu-item :index="children.path"
                              v-for="(children,index) in item.children" :key="index">{{ children.name }}
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <!-- 面包屑导航区域 -->
          <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 10px"
                         v-if="this.$router.currentRoute.path!=='/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <!--     进入默认home的页面     -->
          <div class="homeWelcome" v-if="this.$router.currentRoute.path==='/home'">
            欢迎来到协同办公！
          </div>
          <router-view class="homeRouterView"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {mapGetters,mapState} from 'vuex'
export default {
  name: "Home",
  // //创建前设置
  // beforeCreate () {
  //   document.querySelector('body').setAttribute('style', 'background-color:#f5f5f7;')
  // },
  // //销毁前清除
  // beforeDestroy () {
  //   document.querySelector('body').removeAttribute('style')
  // },


  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem('user')),
    }
  },
  computed: {
    // 从 vuex 获取 routes
    ...mapState([
        'hasMsg'
    ]),
    routes() {
      return this.$store.state.routes
    },
  },
  methods: {
    // 1-2 进入在线聊天页面
    goChat() {
      this.$router.push('/chat')
    },
    backToHome() {
      this.$router.replace("/home")
    },
    commandHandler(command) {
      if (command === 'logout') {
        // 弹框提示用户是否要删除
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 注销登录
          this.postRequest('/logout')
          // 清空用户信息
          window.sessionStorage.removeItem('tokenStr')
          window.sessionStorage.removeItem('user')
          // 路由替换到登录页面
          // this.$router.replace('/')
          // 清空菜单信息；在src/utils/menus.js 中初始化菜单信息
          this.$store.commit('initRoutes', [])
          this.$router.replace('/')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消注销登录'
          });
        });
      }
      if (command === 'userinfo') {
        this.$router.push('/userinfo')
      }
    }

  }

}
</script>

<style scoped>
.homeHeader {
  height: 60px;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  box-sizing: border-box;
  border-bottom: 1px solid rgb(220, 223, 230);
  /*margin:0px 0px 10px;*/
  /*box-shadow: 1px 1px 5px #888888;*/
  border-radius: 4px;
}


.homeHeader .title {
  font-size: 30px;
  /*font-family: 微软雅黑;*/
  font-family: 华文楷体;
  color: rgb(64, 158, 255);
  dispaly: flex;
}

.homeHeader .userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  /*width: 48px;*/
  /*height: 48px;*/
  /*border-radius: 50%;*/
  /*margin-left: 8px;*/
  padding: 2px;
  width: 33px;
  height: 33px;
  border-radius: 50%;
}

.homeWelcome {
  margin-top: 10px;
  text-align: center;
  font-size: 30px;
  font-family: 华文楷体;
  color: #409ef4;
  padding-top: 50px;
}

.homeRouterView {
  margin-top: 10px;
}

.menu {
  margin-top: 10px;
  /*height: 100%;*/
}

.main {
  padding: 10px;
}
.bell{
  padding-top: 14px;
  margin-right: 8px
}
.userName {
  display: inline-block;
  max-width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  vertical-align: top;
  margin-top: 12px;
  margin-right: 6px;
}

.el-main {
  height: calc(100vh - 60px);
  overflow-y: auto;
}
</style>

