<template>
  <div>
    <div class="info">电话号码：
      <el-tag>{{ admin.telephone }}</el-tag>
    </div>
    <div class="info">手机号码：
      <el-tag>{{ admin.phone }}</el-tag>
    </div>
    <div class="info">居住地址：
      <el-tag>{{ admin.address }}</el-tag>
    </div>
    <div class="info">用户标签：
      <el-tag type="success" v-for="(r,index) in admin.roles" :key="index">{{ r.nameZh }}</el-tag>
    </div>
  </div>

</template>

<script>
export default {
  name: "ShowInfo",
  data(){
    return{
      admin: null,
    }
  },
  methods: {
    initAdmin() {
      this.getRequest('/admin/info').then(resp => {
        if (resp.data) {
          this.admin = resp.data
          window.sessionStorage.setItem('user', JSON.stringify(resp.data))
          this.$store.commit('INIT_ADMIN', resp.data)
        }
      })
    }
  },mounted() {
    this.initAdmin()
  },
}
</script>

<style scoped>
.info{
  margin-bottom: 20px;
  font-size: 14px;
  color: #606266;
}
</style>
