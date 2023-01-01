<template>
  <div style="display: flex">
    <!--  头像信息  -->
    <el-card class="box-card" style="width: 400px;height: 200px">
      <div>
        <div>
          <div style="display: flex;justify-content: center;margin-top: 15px">
            <el-upload
                :show-file-list="false"
                :headers="headers"
                :data="admin"
                :on-success="onSuccess"
                action="/admin/userface">
              <img title="点击修改用户头像" :src="admin.userFace" style="height: 80px;width: 80px;border-radius: 50px;"
                   alt="">
            </el-upload>
          </div>
          <div style="text-align: center;margin-top: 15px">{{ admin.name }}</div>
        </div>
      </div>
    </el-card>
    <!--  个人信息列  -->
    <el-card class="personalInfo">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="用户信息" name="ShowInfo">
          <ShowInfo/>
        </el-tab-pane>
        <el-tab-pane label="修改信息" name="EditInfo">
          <EditInfo/>
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="EditPassword">
          <EditPassword/>
        </el-tab-pane>
      </el-tabs>
    </el-card>


  </div>
</template>
<script>
import EditInfo from "@/components/info/EditInfo";
import EditPassword from "@/components/info/EditPassword";
import ShowInfo from "@/components/info/ShowInfo";

export default {
  name: "AdminInfo",
  components: {
    EditInfo,
    EditPassword,
    ShowInfo
  },
  data() {
    return {
      activeName: 'ShowInfo',
      headers: {
        Authorization: window.sessionStorage.getItem('tokenStr')
      },
    }
  },
  computed: {
    // 变成计算属性，使得可以进行动态更新
    admin() {
      return this.$store.state.currentAdmin
    }
  },
  methods: {
    // 头像
    onSuccess() {
      this.initAdmin()
    },
    initAdmin() {
      this.getRequest('/admin/info').then(resp => {
        if (resp.data) {
          this.admin = resp.data
          window.sessionStorage.setItem('user', JSON.stringify(resp.data))
          this.$store.commit('INIT_ADMIN', resp.data)
        }
      })
    }
  }
}
</script>

<style scoped>
.personalInfo {
  margin-left: 15px;
  width: 100%;
  height: 500px;
}

</style>
