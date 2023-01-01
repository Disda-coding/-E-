<template>
  <!-- 1-1 编辑用户信息 -->
  <div>
    <table style="width: 100%">
      <div class="row">
        <tr>
          <td class="title">用户昵称：</td>
          <td>
            <!-- 1-5 重新给每项赋值 admin2 -->
            <el-input class="infoInput" v-model="adminEdit.name"></el-input>
          </td>
        </tr>
      </div>
      <div class="row">
        <tr>
          <td class="title">电话号码：</td>
          <td>
            <el-input class="infoInput" v-model="adminEdit.telephone"></el-input>
          </td>
        </tr>
      </div>
      <div class="row">
        <tr>
          <td class="title">手机号码：</td>
          <td>
            <el-input class="infoInput" v-model="adminEdit.phone"></el-input>
          </td>
        </tr>
      </div>
      <div class="row">
        <tr>
          <td class="title">用户地址：</td>
          <td>
            <el-input class="infoInput" v-model="adminEdit.address"></el-input>
          </td>
        </tr>
      </div>

    </table>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      <!-- 1-8 @click="updateAdminInfo" -->
        <el-button type="primary" @click="updateAdminInfo">确 定</el-button>
    </span>
  </div>

</template>

<script>
export default {
  name: "EditInfo",
  data() {
    return {
      admin: null,
      adminEdit: null, // 1-5 编辑的对象
    }
  },
  methods: {
    // 1-9 更新用户
    updateAdminInfo() {
      this.putRequest('/admin/info', this.adminEdit).then(resp => {
        if (resp.code == 200) {
          this.dialogVisible = false
          this.initAdmin()
        }
      })
    },
    initAdmin() {
      this.getRequest('/admin/info').then(resp => {
        if (resp.data) {
          this.admin = resp.data
          this.adminEdit = Object.assign({}, this.admin) // 1-6 对象拷贝给 admin2
          window.sessionStorage.setItem('user', JSON.stringify(resp.data))
          this.$store.commit('INIT_ADMIN', resp.data)
        }
      })
    }
  },
  mounted() {
    this.initAdmin()
  }
}
</script>

<style scoped>
.infoInput {
  width: 80%;
}

.title {
  width: 10%;
}

.row {
  margin-bottom: 15px;
  font-size: 14px;
  color: #606266;
}
</style>
