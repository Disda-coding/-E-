<template>
  <div>
    <el-form
        label-position="left"
        :model="ruleForm"
        :rules="rules" ref="ruleForm"
        label-width="80px"
        class="retrieveContainer">
      <h2 class="registerTitle" style="color: #1d1d1f">注 册</h2>
      <el-form-item label="账号" prop="username">
        <el-input placeholder="请输入账号" v-model="ruleForm.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input placeholder="请输入姓名" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input placeholder="请输入邮箱" v-model="ruleForm.email"></el-input>
      </el-form-item>

      <el-form-item label="手机号" prop="telephone">
        <el-input placeholder="请输入手机号码" v-model="ruleForm.telephone"></el-input>
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
  name: "Register",
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
    var checkUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
      } else {
        this.getRequest("/register?username=" + value.trim()).then(resp => {
          console.log(value)
          if (resp.code !== 200) {
            //如果用户名已存在,清空
            this.ruleForm.username = ''
            // callback一定不能漏掉，不然走不出验证逻辑
            callback(new Error('用户名已存在！'));
          }else {
            callback();
          }
        })
      }
    };
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
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[34578]\d{9}$$/
      if (!value) {
        return callback(new Error('电话号码不能为空'))
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换
        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }, 100)
    };
    return {
      content: '发送验证码',
      totalTime: 60,
      canClick: true,
      ruleForm: {
        password: '123',
        checkPass: '123',
        username: '123',
        name: '',
        email: '497457669@qq.com',
        registerCode: '123',
        telephone:'13022220202'
      },
      rules: {
        // email:{required: true, message: '请输入邮箱', trigger: 'blur'},
        telephone: {require:true,validator:checkPhone, trigger: 'blur'},
        registerCode: {required: true, message: '请输入验证码', trigger: 'blur'},
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 15, message: '用户名长度必须在3到15之间', trigger: 'blur'},
          {validator: checkUserName, trigger: 'blur'}
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
      this.postRequest("/register/sendCode", this.ruleForm).then(resp => {
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
          // alert('submit!');
          this.postRequest("/register",this.ruleForm).then(resp => {
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

  // created: function () {
  //   this.getRequest('/register').then(resp => {
  //     console.log(resp)
  //   })
  // }
}
</script>

<style scoped>
.retrieveContainer {
  border-radius: 15px;
  background-clip: padding-box;
  /*margin-top: 50px;*/
  margin: 50px auto;
  width: 375px;
  height: 500px;
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
