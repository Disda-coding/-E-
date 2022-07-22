<template>
  <div>
    <!--  通过:rules绑定规则，通过:model和v-model绑定数据，通过this.$refs.ref来绑定prop  通过v-loading来绑定loading状态-->
    <el-form :rules="loginRules" ref="form"
             :model="LoginForm"
             class="loginContainer"
             v-loading="loading"
             element-loading-text="正在登录......"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
      <h2 class="loginTitle" style="color: #1d1d1f">系统登录</h2>
      <el-form-item prop="username">
        <el-input type="text" v-model="LoginForm.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="LoginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <!--    auto-complete=false来关闭自动填充    -->
        <el-input type="text" auto-complete="false" v-model="LoginForm.code" placeholder="请输入验证码"
                  class="captcha"></el-input>
        <!--    通过:src来绑定验证码的url,通过@click来绑定更新验证码点击事件    -->
        <img :src="captchaUrl" @click="updateCaptcha" class='captchaImg'>
      </el-form-item>
      <el-row style="width: 400px">
        <el-col :span="4">
          <el-checkbox v-model="checked" class="remember">记住我</el-checkbox>
        </el-col>
        <el-col :span="4" :offset="15">
          <el-link type="info" class="forgotPasswd" @click="forgot">忘记密码</el-link>
        </el-col>
      </el-row>
      <!--  通过@click来绑定事件    -->
      <el-button style="width: 100%" type="primary" @click="submitLogin">登录</el-button>

      <el-link type="info" style="margin:10px 10px 0px;position: relative;right: 5px" @click="register">注册用户</el-link>


    </el-form>

  </div>
</template>

<script>
import {Encrypt} from '@/utils/aes.js'
// 导出模块
export default {
  name: "LoginC",
  //创建前设置
  beforeCreate () {
    document.querySelector('body').setAttribute('style', 'background-color:#f5f5f7;')
  },
  //销毁前清除
  beforeDestroy () {
    document.querySelector('body').removeAttribute('style')
  },
  data() {
    return {
      captchaUrl: '/captcha?time=' + new Date(),
      LoginForm: {
        username: 'admin',
        password: '123',
        code: ''
      },
      checked: true,
      loading: false, // 加载中 转圈圈ui
      loginRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 15, message: '用户名长度必须在3到15之间', trigger: 'blur'}
        ],
        password: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      }
    }
  },

  methods: {
    // 点击刷新验证码
    forgot(){
      this.$router.push('/forgot')
    },
    updateCaptcha() {
      this.captchaUrl = '/captcha?time=' + new Date()
    },
    // 注册
    register(){
      this.$router.push('/register')
    },
    submitLogin() {
      // 登录
      this.$refs.form.validate((valid) => { //$refs.form这里绑的是ref
        if (valid) {
          this.loading = true
          this.postRequest('/getSalt', this.LoginForm).then(resp => {

            // alert(this.LoginForm.username) //这里绑定的是:model的属性

            if (resp.message.includes('用户名')) {
              console.log(resp)
              // this.$message.error('用户不存在！')
              this.LoginForm.username = ""
              this.LoginForm.password = ""
              //加一个抛异常 然后捕获异常
              // this.updateCaptcha()
              throw new Error("用户不存在")
            }
            let salt = resp.obj.salt;
            // alert(salt)
            this.LoginForm.password = Encrypt(this.LoginForm.password, salt);
            return 'ok'
          }).then(resp => {
            // alert(resp)
            this.postRequest('/loginC', this.LoginForm).then(resp => {
              // alert(JSON.stringify(resp));
              this.loading = false
              if (resp.code==200) {
                // 存储用户 token 到 sessionStorage
                const tokenStr = resp.obj.tokenHead + resp.obj.token

                window.sessionStorage.setItem('tokenStr', tokenStr)
                // 跳转到首页
                // this.$router.push('/home') // 路由跳转，可以回退到上一页
                // this.$router.replace('/home') // 路径替换，无法回退到上一页

                // 页面跳转
                // 拿到用户要跳转的路径
                let path = this.$route.query.redirect;
                // 用户可能输入首页地址或错误地址，让他跳到首页，否则跳转到他输入的地址
                this.$router.replace((path === '/' || path === undefined) ? '/home' : path)
              }
              // 如果输入用户、密码、验证码错误
              if(resp.code==500){
                this.LoginForm.username=""
                this.LoginForm.password=""
                this.LoginForm.code =""
                this.updateCaptcha()
              }

            })
          //  抛出的异常会在这里被捕获
          }).catch(error=>{
            console.log(error)
            this.loading=false
          })
        } else {
          this.$message.error('请输入所有字段！')
          return false;
        }

      })

    }
  }
}

</script>

<style scoped>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 375px;
  padding: 15px 35px 25px 35px;
  border: 1px solid #eaeaea;
  background: #fefefe;
  box-shadow: 0 0 25px #c6caca;
}

.loginTitle {
  margin: 10px auto 40px;
  text-align: center;
}

.captcha {
  width: 290px;
  margin-right: 5px
}

.remember {
  text-align: left;
  margin: 0px 0px 15px 0px;
}

/*验证码*/
.el-form-item__content {
  display: flex;
  align-items: center;
}

.captchaImg {
  position: absolute;
  bottom: 0px;
  height: 32px;
}

.forgotPasswd {
  vertical-align: middle;
  line-height: 19px;
  margin-bottom: 1px;
}

</style>
