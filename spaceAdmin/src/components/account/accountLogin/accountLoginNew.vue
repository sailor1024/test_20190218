<style lang="scss" scoped>
.account-login{
  padding-top: 22px;
  position: relative;
    // 输入手机号码
  .login-find-tip{
    font-size:12px;
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
  .login-change {
    position: absolute;
    width: 2.5rem;
    height:2.5rem;
    right:0;
    top:14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    // &.active {
    //   background-position: -40px -40px;
    // }
    i {
      font-size:20px;
      color:#00a1ff;
    }
  }
  .account-title{
    font-size:24px;
    font-weight:400;
    line-height:1.3333333333;
    color: #636363;
    user-select: none;
  }
  .login-accountname{
    padding-top:28px;
  }
  .login-accountname,.login-passwd{
    margin-bottom:16px;
    }
  //底端容器样式
  .login-accountname-new{
    min-height:24px;
    padding-top:8px;
    margin-top:24px;
  }
  .account-utilities-new{
    display:flex;
    justify-content: space-between;
    margin-top: 25px;
    .account-utilities-left{
      text-align:left;
      a{
        font-size:14px;
      }
      .account-toLoginExists{
        font-size:14px;
      }
    }
    .account-utilities-right{
      text-align:right;
      a{
        font-size:12px !important;
      }
    }
  }
  .btn-group {
    margin-top: 40px;
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
  <div class="account-login">
    <div class="login-change" ref="loginWayChangeDom" @click="loginWayChange">
      <i class="font_family icon-31" v-if="codeShow" title="账号密码登录"></i>
      <i class="font_family icon-phone" v-if="PcShow" title="验证码登录"></i>
    </div>
    <h1 class="account-title">
      登录
    </h1>
    <div class="login-accountname account-form" v-if="PcShow">
      <text-input label="手机号码/邮箱">
        <input type="text" slot="cw-input-0609" class="cw-dc-input" v-model.trim="phone" @keyup="keyup" autocomplete="new-password">
      </text-input>
    </div>
    <div class="login-passwd account-form" v-if="PcShow">
      <text-input label="密码">
        <input autocomplete="new-password" :type="inputtype" slot="cw-input-0609" class="cw-dc-input" v-model="password" @keyup="keyup">
      </text-input>
    </div>
    <div class="login-accountname account-form" v-if="codeShow">
      <text-input label="手机号码">
        <input type="text" slot="cw-input-0609" class="cw-dc-input" v-model.trim="codePhone" autocomplete="new-password">
      </text-input>
    </div>
    <div class="login-find-tip" v-if="codeShow">
      <div class="login-find-phoneInput account-form">
        <text-input label="输入验证码">
          <input type="text" slot="cw-input-0609" class="cw-dc-input" v-model.trim="code" autocomplete="new-password">
        </text-input>
        <Button :type="type" :disabled="disabled" style="flex:1;height:36px;position:relative;top:10px;margin-left:8px;" @click="getCode()">获取验证码</Button>
      </div>
    </div>
    <div class="countDown" v-show="showMsg">
      <p>{{'验证码'+number+'秒后重新获取'}}</p>
    </div>
    <div class="account-utilities-new">
      <div class="account-utilities-left">
        <a href="javascript;" @click.prevent="toLoginExists()" class="account-toLoginExists">登录现有账号</a>
      </div>
      <div class="account-utilities-right">
        <a href="javascript;" @click.prevent="toFind()">忘记密码？</a>
      </div>
    </div>
    <div class="account-utilities-new" style="margin-top: 13px;">
      <div class="account-utilities-left">
        <a href="javascript;" @click.prevent="toRegister()">注册账号</a>
      </div>
      <div class="account-utilities-right">
        <!-- <Button type="primary" size="large" @click.stop="loginfunc()">下一步</Button> -->
      </div>
    </div>
    <div class="btn-group">
      <button class="c-button c-button__primary--radius" @click.stop="loginfunc()">登录</button>
    </div>
  </div>
</template>

<script>
//  引入头像库
import Avatars from '@dicebear/avatars'
import SpriteCollection from '@dicebear/avatars-identicon-sprites'
//  引入输入框组件
import textInput from '../common/input'
//  缓存中没账号信息加载此页****************************************
import encrypt from '@/utils/encryption.js'
// import {ACCOUNT_UNSUAL} from '@/utils/magicNumber'
import MD5 from 'md5'
export default {
  components: {
    textInput
  },
  data: function () {
    return {
      phone: '',
      codePhone: '',
      password: '',
      inputtype: 'text',
      number: 0,
      code: '',
      showMsg: false,
      codeShow: false,
      PcShow: true,
      timer: null,
      account: {p: '', avatarUrl: '', svg: ''},
      userMsg: '',
      disabled: false,
      type: 'primary'
    }
  },
  mounted: function () {
    let pro = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
    pro.then(() => {
      this.inputtype = 'password'
    })
  },
  methods: {
    // 键盘事件
    keyup (e) {
      if (e.keyCode === 13) {
        this.loginfunc()
      }
    },
    loginWayChange () {
      let condition = this.$refs['loginWayChangeDom'].classList.value.indexOf('active')
      if (condition === -1) {
        this.PcShow = false
        this.codeShow = true
        this.$refs['loginWayChangeDom'].classList.add('active')
      } else {
        this.PcShow = true
        this.codeShow = false
        this.$refs['loginWayChangeDom'].classList.remove('active')
      }
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
    //  获取验证码
    getCode: function () {
      if (!this.codePhone) {
        this.$Message.error('请输入电话号码')
        return false
      }
      //  验证手机格式
      let regPhone = /^1[0-9]{10}$/
      if (!regPhone.test(this.codePhone)) {
        this.$Message.error('手机号格式不正确')
        return false
      }
      if (this.showMsg) {
        return false
      } else {
        this.$http.post('index2/login/captche_code', {
          // 'phone': this.account.p,
          'phone': encrypt(this.codePhone),
          verify_code_type: 1
        }, { isNeedToken: false }).then((res) => {
          if (res.data.code === 200) {
            this.$Message.info('验证码已发送，请在60秒内输入')
            this.showMsg = true
            this.disabled = true
            this.type = 'default'
            this.number = 60
            this.count(60)
          } else {
            // this.$Message.error('超出当天验证码次数限制')
            this.$Message.error(res.data.message)
          }
        })
      }
    },
    //  使用现有账号登录
    toLoginExists: function () {
      let accounts = JSON.parse(localStorage.getItem('userList'))
      if (accounts === null) {
        this.$Message.error('没有保存的现有账号，请重新登录')
        return false
      }
      this.$router.push('/account/loginExists')
    },
    //  跳转到找回账号页
    toFind: function () {
      //  生成随机头像
      let avatars = new Avatars(SpriteCollection)
      let svg = avatars.create()
      this.$router.push({
        path: '/account/findStep1',
        query: {
          avatarUrl: '',
          p: this.phone,
          svg: svg
        }
      })
    },
    //  跳转到注册页
    toRegister: function () {
      this.$router.push('/account/register')
    },
    //  登录功能
    loginfunc: function () {
      if (!this.codeShow) {
        var regPhone = /^1[0-9]{10}$/
        var regPwd = /^[\w@0-9]{8,16}$/
        let myreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
        //  验证用户名，密码是否为空
        if (this.phone === '') {
          this.$Message.error('请输入手机号')
          return false
        } else if (!(regPhone.test(this.phone) || myreg.test(this.phone))) {
          this.$Message.error('手机号或邮箱格式不正确')
          return false
        } else if (this.password === '') {
          this.$Message.error('请输入密码')
          return false
        } else if (this.password.length < 8) {
          this.$Message.error('请输入至少8位数的密码')
          return false
        } else if (this.password.length > 16) {
          this.$Message.error('请输入不超过16位数的密码')
          return false
        } else if (!regPwd.test(this.password)) {
          this.$Message.error('密码格式不正确')
          return false
        }
        this.$http.post('index2/login/user_login', {
          'phone_email': MD5(this.phone),
          'password': MD5(this.password)
        }, {
          isNeedToken: false
        }).then((res) => {
          let data = res.data
          if (data.code === 200) {
            let obj = data.data
            this.$store.dispatch('userInfo', obj)
            this.$store.dispatch('setupCookies', obj)
            //  更新用户信息缓存
            this.updateUserList(this.phone, obj)
            this.$router.push({
              path: '/'
            })
          } else if (data.code === 201) {
            this.$Message.error(res.data.message)
            this.$Message.error('该账号不存在')
          } else if (data.code === 202) {
            this.$Message.error('密码错误')
          } else if (data.code === 203) {
            this.loginWayChange()
            this.$Message.error('账号异常,请用手机验证登录')
          } else {
            this.$Message.error(data.message)
          }
        })
      } else {
        //  验证手机格式
        let regPhone = /^1[0-9]{10}$/
        if (this.codePhone === '') {
          this.$Message.error('请输入手机号')
          return false
        } else if (!regPhone.test(this.codePhone)) {
          this.$Message.error('手机号格式不正确')
          return false
        } else if (this.code === '') {
          this.$Message.error('请输入验证码')
          return false
        } else {
          this.$http.post('index2/login/phone_login', {
            'phone': MD5(this.codePhone),
            'phone_code': this.code
          }, {
            isNeedToken: false
          }).then((res) => {
            if (res.data.code === 200) {
              this.userMsg = res.data.data
              this.$store.dispatch('userInfo', this.userMsg)
              this.$store.dispatch('setupCookies', this.userMsg)
              //  更新用户信息缓存
              this.updateUserList(this.codePhone, this.userMsg)
              this.$router.push({
                path: '/'
              })
            } else {
              this.$Message.error(res.data.message)
            }
          })
        }
      }
    },
    //  将用户信息缓存
    updateUserList: function (phone, userInfo) {
      //  生成随机头像
      let avatars = new Avatars(SpriteCollection)
      let svg = avatars.create()
      const avatarUrl = ''
      this.svg = svg
      //  如果之前localStorage中有userList,登录时操作localStorage进去
      if (localStorage.getItem('userList')) {
        var userList = JSON.parse(localStorage.getItem('userList'))
        var isExists = false
        //  遍历localStorage数组查看是否已有该用户
        for (var i = 0; i < userList.length; i++) {
          if (phone === userList[i].p) {
            isExists = true
            //  该用户存在，则深克隆对象，localStorage数组换位
            var temp = JSON.parse(JSON.stringify((userList[i])))
            userList.splice(i, 1)
            userList.unshift(temp)
            //  更新localStorage
            localStorage.setItem('userList', JSON.stringify(userList))
            break
          }
        }
        if (isExists === false) {
          //  该用户不存在则创建新对象，unshift
          userList.unshift({p: phone, svg: svg, avatarUrl: avatarUrl})
          localStorage.setItem('userList', JSON.stringify(userList))
        }
      } else { //  没有则创建新,每个用户对应一个默认svg头像和可自定义头像
        localStorage.setItem('userList', JSON.stringify([{p: phone, svg: svg, avatarUrl: avatarUrl}]))
      }
    }
  },
  watch: {
    number (newVal) {
      if (newVal <= 0) {
        clearInterval(this.timer)
        this.timer = null
        this.disabled = false
        this.type = 'primary'
        this.showMsg = false
      }
    }
  }
}
</script>
