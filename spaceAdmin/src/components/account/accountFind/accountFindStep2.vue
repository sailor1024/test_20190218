<style lang="scss">
.login-accountPast{
  padding-top:16px;
  .login-title{
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
    .ivu-btn:hover{
      color:#000;
    }
    .ivu-btn:focus{
      box-shadow: 0 0 0 0px rgba(45,140,240,.2);
    }
  }
  // 底端容器
  .login-utilities{
    display:flex;
    justify-content: space-between;
    margin-top:32px;
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
  <div class="login-accountPast">
    <h1 class="login-title">
      账号恢复
    </h1>
    <div class="login-accountname account-form">
      <div class="login-avatar">
        <div v-html="account.svg" style="background:transparent" v-if="account.avatarUrl===''"></div>
        <img :src="account.avatarUrl" alt="" v-if="account.avatarUrl!==''">
      </div>
      <input type="text" readonly :value="account.p" class="login-accountname-text">
    </div>
    <div class="login-passwdInput">
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
    <!-- <div class="login-utilities">
      <div class="login-utilities-left">
        <a href="javascript;" @click.prevent="">预留空位</a>
      </div>
      <div class="login-utilities-right">
        <Button type="primary" size="large" @click.stop="resetPwd()">下一步</Button>
      </div>
    </div> -->
    <div class="btn-group">
      <button class="c-button c-button__primary--radius" @click.stop="resetPwd()">下一步</button>
    </div>
  </div>
</template>

<script>
//  引入输入框组件
import textInput from '../common/input'
import encrypt from '@/utils/encryption.js'

export default {
  components: {
    textInput
  },
  data: function () {
    return {
      account: {p: '', avatarUrl: '', svg: ''},
      svg: null,
      upwd: '',
      cpwd: '',
      phone: ''
    }
  },
  created: function () {
    this.account = this.$route.params.account
    if (!this.account) {
      this.account = JSON.parse(localStorage.getItem('userList'))[0]
    }
  },
  mounted: function () {
  },
  methods: {
    resetPwd: function () {
      // 检查密码是否为空
      if (this.upwd === '') {
        this.$Message.error('请输入密码')
        return false
      } else if (this.upwd.length < 8) {
        this.$Message.error('请输入至少8位数的密码')
      } else if (this.upwd.length > 16) {
        this.$Message.error('请输入不超过16位数的密码')
      } else if (this.cpwd === '') {
        this.$Message.error('请重复密码')
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
      // 发送请求找回密码
      this.$http.post('index/user/reset_pass', {
        'phone': encrypt(this.account.p),
        'password': encrypt(this.upwd)
      }).then((res) => {
        var data = res.data
        if (data.code === 1) {
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
          this.$Message.error('出错了，请重试')
          return false
        }
      })
    }
  }
}
</script>
