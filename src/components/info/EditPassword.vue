<template>
  <div>
    <!-- 2-8 调整修改密码表单 -->
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="请输入旧密码" prop="oldPass">
        <el-input class="pwdInput" type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="请输入新密码" prop="pass">
        <el-input class="pwdInput" type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="请确认新密码" prop="checkPass">
        <el-input class="pwdInput" type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "EditPassword",
  data(){
    // 2-5 修改密码校验规则 一定要放最前面
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return{
      admin:null,
      ruleForm: { // 2-6 校验对象 规则
        pass: '',
        checkPass: '',
        oldPass: '', // 2-9
        adminId:-1
      },
      rules: {
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ],
        oldPass: [
          {validator: validatePass, trigger: 'blur'}
        ]
      }
    }
  },
  mounted() {
     this.admin=JSON.parse(window.sessionStorage.getItem("user"))
  },
  methods:{
    // 2-7 重围修改密码表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 2-7 预校验 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.adminId = this.admin.id
          this.putRequest('/admin/pass', this.ruleForm).then(resp => {
            if (resp.code == 200) {
              // 更新密码成功后 退出登录
              this.postRequest('/logout') // 退出登录
              window.sessionStorage.removeItem('user')
              window.sessionStorage.removeItem('tokenStr')
              this.$store.commit('initRoutes', []) // 初始化路由 菜单 置空
              this.$router.replace('/') // 跳到登录页面

            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>
.pwdInput{
  width: 70%;
}
</style>
