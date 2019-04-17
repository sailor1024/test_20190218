<style lang="scss" scoped>
.account-register{
  padding-top:16px;
  .ivu-form-item-error-tip{
    padding-top:0;
  }
  .register-accountname{
    min-height:24px;
    padding-top:32px;
  }
  //  覆盖框架按钮样式
  .register-passwd{
    .ivu-btn{
      border:none;
      background:#fff;
    }
    .ivu-btn:hover{
      color:#000;
    }
    .ivu-btn:focus{
      box-shadow: 0 0 0 0px rgba(45,140,240,.2);
    }
    .register-passwd-tips{
      font-size:12px;
      height:24px;
      line-height:24px;
    }
  }
  //  主标题
  .account-title{
    font-size:24px;
    font-weight:400;
    line-height:1.3333333333;
    font-family: 'Google Sans',arial,sans-serif;
    color:#000;
  }
  .register-phone{
    width:100%;
  }
  //  底端容器样式
  .account-utilities{
    display:flex;
    justify-content: space-between;
    margin-top:32px;
    .account-utilities-left{
      text-align:left;
      a{
        font-size:14px;
      }
    }
     .account-utilities-right{
      text-align:right;
    }
  }
}
</style>

<template>
  <div class="account-registerBox">
    <div class="account-register">
    <h1 class="account-title">
      激活你的账号
    </h1>
    <div class="register-accountname account-form">
      <div style="display:flex;">
        <!-- 姓名 -->
        <text-input label="姓氏" style="margin-right:8px">
          <input type="text" slot="cw-input-0609" class="cw-dc-input" v-model="lastname">
        </text-input>
        <text-input label="名字" style="margin-left:8px">
          <input type="text" slot="cw-input-0609" class="cw-dc-input" v-model="famailname">
        </text-input>
      </div>
    </div>
    <div class="register-passwd account-form">
      <div style="display:flex;">
        <!-- 密码 -->
        <text-input label="输入密码" style="flex:4;margin-right:8px;">
          <input :type="eye_isDisable?'text':'password'" slot="cw-input-0609" class="cw-dc-input" v-model="upwd">
        </text-input>
        <text-input label="重复密码" style="flex:4;margin-left:8px;">
          <input :type="eye_isDisable?'text':'password'" slot="cw-input-0609" class="cw-dc-input" v-model="cpwd">
        </text-input>
        <Button shape="circle" :icon="eye_isDisable?'eye':'eye-disabled'" style="flex:1;width:48px;height:48px;position:relative;" @click="eyeDisable"></Button>
      </div>
      <div class="register-passwd-tips"> 使用 8 个或更多字符（字母、数字和符号的组合）</div>
    </div>
    <div class="account-utilities">
      <div class="account-utilities-left">
        <a href="javascript;"></a>
      </div>
      <div class="account-utilities-right">
        <Button type="primary" size="large" @click.stop="registerfunc()">激活</Button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
//  引入输入框组件
import textInput from '../common/input'
import encrypt from '@/utils/encryption.js'

export default {
  name: 'accountFinsh',
  components: {
    textInput
  },
  data: function () {
    return {
      eye_isDisable: false,
      lastname: '',
      famailname: '',
      upwd: '',
      cpwd: '',
      email: ''
    }
  },
  created: function () {
    this.email = this.getQueryString('email')
    if (!this.email) {
      this.$router.push({
        'path': '/account'
      })
    }
    // 发送请求，验证用户是否已经是激活状态
    this.$http.post('', {
      'email': this.email
    }).then((res) => {
      if (!res.data.data.code) return false
      this.$router.push({
        'path': '/account'
      })
    })
  },
  methods: {
    getQueryString (name) {
      let search = location.hash.split('?')[1]
      if (search) {
        var r = search.replace('email=', '')
        return unescape(r)
      } else {
        return false
      }
    },
    //  切换密码隐藏
    eyeDisable: function () {
      if (this.eye_isDisable) {
        this.eye_isDisable = false
      } else {
        this.eye_isDisable = true
      }
    },
    //  注册功能
    registerfunc: function () {
      //  验证各个输入框有没空字符
      if (this.lastname === '') {
        this.$Message.error('请输入名字')
        return false
      } else if (this.famailname === '') {
        this.$Message.error('请输入姓氏')
        return false
      } else if (this.upwd === '') {
        this.$Message.error('请输入密码')
        return false
      } else if (this.cpwd === '') {
        this.$Message.error('请重复密码')
        return false
      }
      //  验证姓名格式
      var regName = /^([\u4e00-\u9fa5]{1,4})$|^([a-zA-Z]{1,32})$/
      if (!regName.test(this.lastname) || !regName.test(this.famailname)) {
        this.$Message.error('姓名格式不正确')
        return false
      }
      //  验证密码格式
      var regPwd = /^[\w@0-9]{8,16}$/
      if (!regPwd.test(this.upwd) || !regPwd.test(this.cpwd)) {
        this.$Message.error('密码格式不正确')
        return false
      }
      if (this.upwd.length < 8) {
        this.$Message.error('请输入至少8位数的密码')
        return false
      }
      if (this.upwd.length > 16) {
        this.$Message.error('请输入不超过16位数的密码')
        return false
      }
      //  验证两次输入密码是否一致
      if (this.upwd !== this.cpwd) {
        this.$Message.error('两次输入密码不一致')
        return false
      }
      //  发送请求
      this.$http.post('index/user/active_user', {
        'lastname': this.lastname,
        'famailname': this.famailname,
        'email': encrypt(this.email),
        'password': encrypt(this.upwd),
        // 这个字段说明用户是否已经激活
        'active': true
      }).then((res) => {
        var data = res.data
        if (data.code === 1) {
          this.$Message.success('激活成功')
          this.$store.dispatch('userInfo', data.data)
          this.$router.push({
            path: '/'
          })
        } else if (data.code === 0) {
          this.$Message.error('出错啦，请重试')
        } else if (data.code === 3) {
          this.$Notice.info({
            title: '您已经激活了,请直接登录'
          })
          setTimeout(() => {
            this.$router.push({
              path: '/account'
            })
          }, 2000)
        }
      })
    }
  }
}
</script>
