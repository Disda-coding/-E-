<template>
  <div>
    <el-form
        label-position="left"
        :model="ruleForm"
        :rules="rules" ref="ruleForm"
        label-width="80px"
        class="retrieveContainer">
      <h2 class="registerTitle" style="color: #1d1d1f">找回密码</h2>
      <el-form-item label="邮箱" prop="email">
        <el-input placeholder="请输入邮箱" v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="verificationCode">
        <el-input placeholder="请输入验证码" class="codeInput" v-model="ruleForm.registerCode"
                  autocomplete="off"></el-input>
        <el-button class="button" :class="{disabled:!this.canClick}" type="primary" @click="getCode">{{ content }}
        </el-button>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input placeholder="请输入密码" type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input placeholder="请再次输入密码" type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <div style="text-align: center;margin: 35px auto">
        <el-button style="width: 80%" type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </div>
    </el-form>

  </div>
</template>

<script>

export default {
  name: "Forgot",
  //通过这两个函数改变背景颜色
  //创建前设置
  beforeCreate() {
    document.querySelector('body').setAttribute('style', 'background-color:#f5f5f7;')
  },
  //销毁前清除
  beforeDestroy() {
    document.querySelector('body').removeAttribute('style')
  },
  data() {

    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'));
      } else if (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确邮箱'))
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      content: '发送验证码',
      totalTime: 60,
      canClick: true,
      // disabled:false,
      ruleForm: {
        password: '123',
        checkPass: '123',
        email: '497457669@qq.com',
        registerCode: '123',
      },
      rules: {
        // email:{required: true, message: '请输入邮箱', trigger: 'blur'},
        registerCode: {required: true, message: '请输入验证码', trigger: 'blur'},
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 15, message: '用户名长度必须在3到15之间', trigger: 'blur'},
          // {validator: checkUserName, trigger: 'blur'}
        ],
        email: {required: true, validator: validateEmail, trigger: 'blur'},
        password: [
          {required: true, validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {required: true, validator: validatePass2, trigger: 'blur'}
        ],
      }
    };
  },
  methods: {
    getCode() {
      if (!this.canClick) return
      this.canClick = false
      this.postRequest("/register/retrieveAccount", this.ruleForm).then(resp => {
        if (resp.code == 200) {
          this.content = this.totalTime + 's后重新发送'
          let clock = window.setInterval(() => {
            this.totalTime--
            this.content = this.totalTime + 's后重新发送'
            if (this.totalTime < 0) {
              window.clearInterval(clock)
              this.content = '重新发送验证码'
              this.totalTime = this.totalTime
              this.canClick = true  //这里重新开启
            }
          }, 1000)
        } else {
          return;
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        //如果参数合理
        if (valid) {
          this.postRequest("/register/resetAccount",this.ruleForm).then(resp => {
            console.log(resp)
          })
          this.$router.replace("/")
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },

}
</script>

<style scoped>
.retrieveContainer {
  border-radius: 15px;
  background-clip: padding-box;
  /*margin-top: 50px;*/
  margin: 60px auto;
  width: 375px;
  height: 370px;
  padding: 15px 35px 25px 35px;
  border: 1px solid #eaeaea;
  background: #fefefe;
  box-shadow: 0 0 25px #c6caca;

}

.registerTitle {
  margin: 10px auto 40px;
  text-align: center;
}

.codeInput {
  width: 174px;
  margin-right: 5px;
}

.disabled {
  background-color: #ddd;
  border-color: #ddd;
  color: #57a3f3;
  /*cursor: not-allowed; // 鼠标变化*/
}

.button {
  width: 116px;
}

</style>
