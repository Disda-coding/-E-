<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title" @click="backToHome">协同办公</div>

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
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
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


  data(){
    return {

    }
  },
  computed: {
    // 从 vuex 获取 routes
    routes() {
      return this.$store.state.routes
    },

  },
  methods:{
    backToHome(){
      this.$router.replace("/home")
    },


  }

}
</script>

<style scoped>
.homeHeader {
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
  dispaly:flex;
}

.homeHeader .userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-left: 8px;
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
.menu{
  margin-top: 10px;
}
.main{
  padding: 10px;
}

</style>

