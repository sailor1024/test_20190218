<style lang="scss" scoped>
//查找页面第一步
.account-findStep1{
  padding-top: 22px;
  // 输入手机号码
  .login-find-tip{
    font-size:12px;
    padding-top:18px;
    // padding-bottom:3px;
    .login-find-phoneInput{
      display:flex;
      justify-content:space-between;
      margin-bottom:16px;
    }
  }
  // 获取验证码后显示的消息
  .countDown{
    height:32px;
    margin-bottom:8px;
    p{
      font-size:14px;
      color:#999;
    }
  }
  // 主标题
  .account-title{
    font-size:24px;
    font-weight:400;
    line-height:1.3333333333;
    color: #636363;
    user-select: none;
  }
  .login-accountname{
    display:flex;
    min-height:24px;
    justify-content: space-between;
    padding-top:32px;
    //  头像样式
    .login-avatar{
      flex:1;
      img{
        width:36px;
        height:36px;
        border-radius:50%;
      }
      div{
        width:36px;
        height:36px;
        border-radius:50%;
      }
      svg{
        width:36px;
        height:36px;
        border-radius:50%;
      }
    }
    //  账号文本样式
    .login-accountname-text{
      flex:4;
      letter-spacing: .25px;
      font-size:14px;
      height:32px;
      line-height:32px;
      color:#212121;
      border:none;
      outline:none;
    }
  }
  // 获取验证码后显示的消息
  .countDown{
    height:32px;
    margin-bottom:8px;
    p{
      font-size:14px;
      color:#999;
    }
  }
  // 最底下按钮
  .login-utilities{
    display:flex;
    justify-content: space-between;
    margin-top: 22px;
    .login-utilities-left{
      text-align:left;
      a{
        font-size:14px;
      }
    }
     .login-utilities-right{
      text-align:right;
    }
  }

  .btn-group {
    margin-top: 40px;
    margin-bottom: 32px;
    .c-button {
      font-size: 16px;
      width: 100%;
    }
  }
  /deep/ .cw-dc-label {
    font-size: 12px !important;
    color: #cccccc !important;
  }
}
</style>

<template>
  <div class="account-findStep1">
    <h1 class="account-title">
      找回密码
    </h1>
    <div class="login-accountname">
      <div class="login-avatar">
        <div v-html="account.svg" style="background:transparent" v-if="account.avatarUrl===''"></div>
        <img :src="account.avatarUrl" alt="" v-else>
      </div>
      <input type="text"  class="login-accountname-text" placeholder="请输入手机号" v-model="account.p" autocomplete="new-password">
    </div>
    <div class="login-find-tip">
      <div class="login-find-phoneInput account-form">
        <text-input label="输入验证码">
          <input type="text" slot="cw-input-0609" class="cw-dc-input" v-model="code">
        </text-input>
        <Button :type="type" :disabled="disabled" style="flex:1;height:36px;position:relative;top:10px;margin-left:8px;" @click="getCode()">获取验证码</Button>
      </div>
      <div class="countDown" v-show="showMsg">
        <p>{{'验证码'+number+'秒后过期'}}</p>
      </div>
      <div class="account-form">
        <text-input label="重置密码">
          <input type="password" slot="cw-input-0609" class="cw-dc-input" v-model="upwd">
        </text-input>
      </div>
      <div class="account-form">
        <text-input label="确认密码">
          <input type="password" slot="cw-input-0609" class="cw-dc-input" v-model="cpwd">
        </text-input>
      </div>
    </div>
    <div class="login-utilities">
      <div class="login-utilities-left">
        <a href="javascript;" @click.prevent="toLogin()">返回登录页</a>
      </div>
      <div class="login-utilities-right">
        <!-- <Button type="primary" size="large" @click="toFindStep2()">下一步</Button> -->
      </div>
    </div>
    <div class="btn-group">
      <button class="c-button c-button__primary--radius" @click="toFindStep2()">下一步</button>
    </div>
  </div>
</template>

<script>
//  引入输入框组件
import textInput from '../common/input'
import encrypt from '@/utils/encryption.js'
import MD5 from 'md5'

export default {
  components: {
    textInput
  },
  watch: {
    'number': function (val) {
      if (val <= 0) {
        clearInterval(this.timer)
        this.timer = null
        this.disabled = false
        this.type = 'primary'
        this.showMsg = false
      }
    }
  },
  data: function () {
    return {
      number: 0, //  倒数
      showMsg: false,
      timer: null,
      account: {p: '', avatarUrl: '', svg: ''}, // 用户名和头像，avatarUrl为空则自动随机生成一个
      phone: '',
      code: '',
      captcha: '=11111=',
      disabled: false,
      type: 'primary',
      upwd: '',
      cpwd: ''
    }
  },
  created: function () {
    let userlist = localStorage.getItem('userList')
    if (userlist !== null) {
      this.account = JSON.parse(localStorage.getItem('userList'))[0]
      this.account.p = ''
    } else {
      this.account = this.$route.query
      this.account.p = ''
    }
  },
  destroyed: function () {
    if (this.timer != null) {
      //  清除定时器
      clearInterval(this.timer)
      this.timer = null
    }
  },
  methods: {
    //  找回密码步骤1，验证码正确后跳转
    toFindStep2: function () {
      if (this.account.p === '') {
        this.$Message.error('请输入手机号')
        return false
      } else if (!/^1[0-9]{10}$/.test(this.account.p)) {
        this.$Message.error('请输入正确的手机号')
        return false
      } else if (this.code === '') {
        this.$Message.error('请输入验证码')
        return false
      } else if (this.upwd === '') {
        this.$Message.error('请输入密码')
        return false
      } else if (this.upwd.length < 8) {
        this.$Message.error('请输入至少8位数的密码')
      } else if (this.upwd.length > 16) {
        this.$Message.error('请输入不超过16位数的密码')
      } else if (this.cpwd === '') {
        this.$Message.error('请输入重复密码')
        return false
      }
      //  验证密码格式
      var regPwd = /^[\w@0-9]{8,16}$/
      if (!regPwd.test(this.upwd) || !regPwd.test(this.cpwd)) {
        this.$Message.error('密码格式不正确')
        return false
      }
      // 验证两次输入密码是否一致
      if (this.upwd !== this.cpwd) {
        this.$Message.error('两次输入密码不一致')
        return false
      }
      this.$http.post('index2/login/reset_pass', {
        phone_code: this.code,
        new_password: MD5(this.cpwd),
        phone: MD5(this.account.p)
      }, {
        isNeedToken: false
      }).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('重置成功,返回登录页')
          var userList = JSON.parse(localStorage.getItem('userList'))
          for (var i = 0; i < userList.length; i++) {
            if (this.account.p === userList[i].p && i !== 0) {
              //  更新localStorage数组顺序
              userList.splice(i, 1)
              userList.unshift(this.account)
              localStorage.setItem('userList', JSON.stringify(userList))
              break
            }
          }
          this.$router.push({
            path: '/account',
            name: 'accountLogin'
          })
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    //  获取验证码
    getCode: function () {
      if (this.showMsg) {
        return false
      } else {
        this.getcaptche()
      }
    },
    getcaptche () {
      this.$http.post('index2/login/captche_code', {
        verify_code_type: 2,
        'phone': encrypt(this.account.p)
      }).then((res) => {
        let data = res.data
        if (data.code === 200) {
          this.captcha = data.data.captche
          this.$Message.info('验证码已发送，请在60秒内输入')
          this.showMsg = true
          this.disabled = true
          this.type = 'default'
          this.number = 60
          this.count(60)
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch(() => {
      })
    },
    // 定时器
    count (num) {
      if (num > 0) {
        this.timer = setInterval(() => {
          this.number -= 1
        }, 1000)
      } else {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    //  返回登录页
    toLogin: function () {
      this.$router.push('/account/login')
    }
  }
}
</script>
