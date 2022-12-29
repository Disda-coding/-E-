<template>
  <div>
    <!-- 1、 -->
    <div style="display: flex;justify-content: center;margin-top: 10px;">
      <!-- 9、v-model="keywords" \ @click="doSearch">搜索 -->
      <el-input v-model="keywords" placeholder="通过用户名搜索用户..."
                style="width: 400px;margin-right: 10px;"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
      <el-button type="success" icon="el-icon-plus" @click="showAddAdmin">添加</el-button>
    </div>
    <!-- 2、6、 -->
    <div class="admin-container">
      <el-card class="admin-card" v-for="(admin,index) in admins" :key="index">
        <div slot="header" class="clearfix">
          <span>{{ admin.name }}</span>
          <!-- 12、 @click="deleteAdmin(admin)" -->
          <el-button style="float: right; padding: 3px 0;color:red;" type="text" icon="el-icon-delete"
                     @click="deleteAdmin(admin)"></el-button>
        </div>
        <div>
          <div class="img-container">
            <img :src="admin.userFace" :alt="admin.name" :title="admin.name" class="userFace-img">
          </div>
        </div>
        <div class="userinfo-container">
          <div>用户名：{{ admin.name }}</div>
          <div>手机号码：{{ admin.phone }}</div>
          <div>电话号码：{{ admin.telephone }}</div>
          <div>地址：{{ admin.address }}</div>
          <div>用户状态：
            <!-- 14、更新操作员 @change="enabledChange(admin)" -->
            <el-switch
                v-model="admin.enabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="enabledChange(admin)"
                active-text="启用"
                inactive-text="禁用">
            </el-switch>
          </div>
          <table>
            <tr>
              <td style="width: 60px; vertical-align:top">
                用户角色：
              </td>
              <td>
                <el-tag style="margin-right: 4px;vertical-align:top" v-for="(role,index) in admin.roles" :key="index"
                        type="success">
                  {{ role.nameZh }}
                </el-tag>


                <!-- 16、更新操作员角色 弹出框、选择器、 -->
                <!-- 20、@show="showPop(admin)" -->
                <!-- 24、@hide="hidePop(admin)" hide 隐藏时触发-->
                <el-popover
                    placement="right"
                    title="角色列表"
                    width="200"
                    @show="showPop(admin)"
                    @hide="hidePop(admin)"
                    trigger="click">
                  <!-- 17、更新操作员角色 下拉框 -->
                  <!-- 22、v-model="selectedRoles" 存的是1个角色id，multiple 多选，显示已有角色 -->
                  <el-select v-model="selectedRoles" multiple placeholder="请选择">
                    <!--      label是给用户看的，显示的东西，value是它对应的值          -->
                    <el-option
                        v-for="(r,index) in allRoles"
                        :key="index"
                        :label="r.nameZh"
                        :value="r.id">
                    </el-option>
                  </el-select>
                  <!-- 3个点按钮 ... -->
                  <el-button slot="reference" type="text" icon="el-icon-more"></el-button>
                </el-popover>
              </td>
            </tr>
          </table>
          <div>备注：{{ admin.remark }}</div>
        </div>
      </el-card>
    </div>
    <!--  添加管理员  -->
    <el-dialog
        title="添加管理员"
        :visible.sync="showAddAdmin"
        width="30%"
        :before-close="handleClose">
      <!--  使用默认密码和头像    -->
      <el-form :model="adminForm">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "SysAdmin",
  data() {
    return {
      // 注册所需信息
      adminForm: {

      },
      // 系统内所有的角色
      roles:[],
      // 给与新用户的角色
      givenRoles:[],
      showAddAdmin: false,
      admins: [], // 3
      keywords: '', // 8、搜索关键字
      allRoles: [], // 18、更新操作员角色
      selectedRoles: [] // 23
    }
  },
  mounted() {
    this.initAdmins() // 5
  },
  methods: {
    showAdmin(){
      this.showAddAdmin = true
    },
    //添加操作员
    addAdmin() {

    },

    // 获取所有角色
    initRoles() {
      this.getRequest('/system/basic/permiss/').then(resp => {
        if (resp) {
          this.roles = resp
        }
      })
    },
    // 25、更新操作员角色
    hidePop(admin) {
      let roles = []
      Object.assign(roles, admin.roles) // 拷贝对象
      let flag = false
      // 如果选中的角色 id 的长度和原来的不一样
      if (roles.length != this.selectedRoles.length) { // 用户对应角色id
        flag = true
      } else {
        // 角色 id 长度和原来的一样，但可能角色不一样
        // 先循环 admin.roles
        for (let i = 0; i < roles.length; i++) {
          let role = roles[i] // 用户对应的角色对象
          for (let j = 0; j < this.selectedRoles.length; j++) {
            let sr = this.selectedRoles[j]  // 拿到用户对应的角色对象的id
            if (role.id == sr) { // 角色一样
              roles.splice(i, 1) // 删除
              i--
              break
            }
          }
        }
        if (roles.length != 0) {
          flag = true
        }
      }
      if (flag) {
        // 拼接 url(参数为 adminId、角色 rids )
        let url = '/system/admin/role?adminId=' + admin.id;
        this.selectedRoles.forEach(sr => {
          url += '&rids=' + sr
        });
        this.putRequest(url).then(resp => {
          if (resp) {
            this.initAdmins()
          }
        });
      }
    },
    // 21、下拉框获取所有用户角色
    showPop(admin) {
      if (this.allRoles === null || this.allRoles.length == 0) this.initAllRoles()
      let roles = admin.roles // 拿到整个数组
      this.selectedRoles = []
      roles.forEach(r => {
        this.selectedRoles.push(r.id) // r.id 相同的角色放进数组
      })
    },
    // 19、获取所有操作员
    initAllRoles() {
      this.getRequest(' /system/admin/roles').then(resp => {
        if (resp) {
          this.allRoles = resp
        }
      })
    },
    // 15、更新操作员
    enabledChange(admin) {
      this.putRequest('/system/admin/', admin).then(resp => {
        if (resp) {
          this.initAdmins()
        }
      })
    },
    // 13、删除操作员
    deleteAdmin(admin) {
      this.$confirm('此操作将永久删除该[' + admin.name + '], 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/admin/' + admin.id).then(resp => {
          if (resp) {
            this.initAdmins()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    // 10 搜索
    doSearch() {
      this.initAdmins()
    },
    // 4、获取所有操作员；11、加参数关键字
    initAdmins() {
      this.getRequest('/system/admin/?keywords=' + this.keywords).then(resp => {
        if (resp) {
          this.admins = resp
        }
      })
    }
  }
}
</script>

<style>
/* 7 */
.admin-container {
  margin: 20px 20px;
  display: flex;
  justify-content: space-between; /* 在弹性盒对象的 <div> 元素中的各项周围留有空白：*/
  /*align-content: flex-start;*/
  flex-wrap: wrap; /* 自动换行 */
}

.admin-card {
  width: 350px;
  margin-bottom: 20px;

}

/*可能还有些许bug，实现第二行左对齐*/
/*.admin-card:last-child{*/
/*  margin-right: auto;*/
/*}*/

.userFace-img {
  width: 72px;
  height: 72px;
  border-radius: 72px;
}

/* 头像居中 */
.img-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.userinfo-container {
  font-size: 12px;
  color: #3e9ef5;
}

.admin-roles {
  margin-right: 50px;
  width: 300px;

}
</style>
