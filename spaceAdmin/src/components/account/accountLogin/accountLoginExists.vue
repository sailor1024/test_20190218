<style lang="scss" scoped>
.account-login{
  padding-top: 22px;
  .account-title{
    font-size:24px;
    font-weight:400;
    line-height:1.3333333333;
    color:#666666;
  }
  .login-accountname{
    display:flex;
    min-height:24px;
    justify-content: space-between;
    padding-top:32px;
    margin-top:24px;
    //  头像
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
    //  用户名
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
    .login-accountname-btn{
      flex:1;
      .ivu-btn{
        border:none;
        width:48px;
        height:48px;
        position:relative;
        top:-8px;
        background-color:#fff;
      }
    }
    .ivu-btn:hover{
      color:#000;
    }
    .ivu-btn:focus{
      box-shadow: 0 0 0 0px rgba(45,140,240,.2);
    }
  }
  //  底端容器
  .account-utilities{
    display:flex;
    justify-content: space-between;
    margin-top: 22px;
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
  /deep/ .cw-dc-label {
    font-size: 12px !important;
    color: #cccccc !important;
  }
  .btn-group {
    margin-top: 40px;
    .c-button {
      font-size: 16px;
      width: 100%;
    }
  }
}
</style>

<template>
  <div class="account-login">
    <h1 class="account-title">
      用户账号
    </h1>
    <div class="login-accountname">
      <div class="login-avatar">
        <div v-html="account.svg" style="background:transparent" v-if="account.avatarUrl===''"></div>
        <img :src="account.avatarUrl" alt="" v-if="account.avatarUrl!==''">
      </div>
      <input type="text" readonly :value="account.p" class="login-accountname-text">
      <div class="login-accountname-btn">
         <Button shape="circle" icon="chevron-down" @click.prevent="accountSelect()"></Button>
      </div>
    </div>
    <div class="login-passwd account-form" @keyup.enter="loginfunc">
      <text-input label="密码">
        <input type="password" slot="cw-input-0609" class="cw-dc-input" v-model="password">
      </text-input>
    </div>
    <div class="account-utilities">
      <div class="account-utilities-left">
        <a href="javascript;" @click.prevent="toFindStep1()">忘记密码？</a>
      </div>
      <div class="login-utilities-right">
        <!-- <Button type="primary" size="large" @click="loginfunc()">下一步</Button> -->
      </div>
    </div>
    <div class="btn-group">
      <button class="c-button c-button__primary--radius" @click.stop="loginfunc()">登录</button>
    </div>
  </div>
</template>

<script>
// 引入输入框组件
import textInput from '../common/input'
//  缓存中有账号信息加载此页****************************************
import MD5 from 'md5'
// import encrypt from '@/utils/encryption.js'
// import {ACCOUNT_UNSUAL} from '@/utils/magicNumber'

export default {
  components: {
    textInput
  },
  data: function () {
    return {
      account: {p: '', svg: '', avatarUrl: ''}, //  用户信息，avataUrl为空则随机生成头像
      password: ''
    }
  },
  mounted: function () {
  },
  created: function () {
    if (this.$route.params.account) {
      this.account = this.$route.params.account
    } else {
      let accounts = JSON.parse(localStorage.getItem('userList'))
      if (accounts == null) {
        this.$router.push('/account/login')
      }
      let account = accounts[0]
      this.account = account
    }
  },
  methods: {
    //  跳转到找回账号页
    toFindStep1: function () {
      this.$router.push({
        path: '/account/findStep1',
        name: 'accountFindStep1',
        params: {
          account: this.account
        }
      })
    },
    //  跳转到选择账号登陆页
    accountSelect: function () {
      this.$router.push('/account/select')
    },
    loginfunc: function () {
      //  验证用户名，密码是否为空
      let phone = this.account.p
      if (this.password === '') {
        this.$Message.error('请输入密码')
      } else if (this.password.length < 8) {
        this.$Message.error('请输入至少8位数的密码')
      } else if (this.password.length > 16) {
        this.$Message.error('请输入不超过16位数的密码')
      } else {
        this.$http.post('index2/login/user_login', {
          'phone_email': MD5(phone),
          'password': MD5(this.password)
        }, {
          isNeedToken: false
        }).then((res) => {
          let data = res.data
          if (data.code === 200) {
            // 读取localStorage
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
            let obj = data.data
            //  更新用户信息缓存
            this.$store.dispatch('userInfo', obj)
            this.$store.dispatch('setupCookies', obj)
            this.$router.push({
              path: '/'
            })
          } else {
            this.$Message.error(res.data.message)
          }
        })
      }
    }
  }
}
</script>
