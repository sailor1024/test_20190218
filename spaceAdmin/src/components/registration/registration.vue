<template>
<div class="dialog_container" v-if="loginShow">
  <div class="dialog_box">
    <div class="dialog_body">
      <div class="dialog_content">
        <!-- title-icon -->
        <div class="title-icon">
          <img src="../../assets/images/logo1.png" alt="">
        </div>
        <!-- title -->
        <div class="title">
          <h3>欢迎来到广东康云科技云空间</h3>
          <p>您正使用以下邮箱地址创建新账号。若有误，则请返回上一步操作。</p>
        </div>
        <!-- email -->
        <div class="email-button">
          <i-button type="primary" long>{{this.$route.query.email}}</i-button>
        </div>
        <!-- detail -->
        <div class="detail">
          <div class="Folder">
            <!-- input -->
            <text-input label="姓" class="xing">
              <input type="text" slot="cw-input-0609" class="cw-dc-input" v-model="lastname">
            </text-input>
            <text-input label="名字" class="name">
              <input type="text" slot="cw-input-0609" class="cw-dc-input" v-model="firstname">
            </text-input>
            <text-input label="电话号码" class="name">
              <input type="text" slot="cw-input-0609" class="cw-dc-input" v-model="phone" @blur="blur">
            </text-input>
            <text-input label="密码" class="password">
              <input type="password" slot="cw-input-0609" class="cw-dc-input" v-model="password" @blur="passwordConfirm">
            </text-input>
            <text-input label="确认密码" class="repassword">
              <input type="password" slot="cw-input-0609" class="cw-dc-input" v-model="repassword" @blur="repasswordConfirm">
            </text-input>
            <!-- 同意服务 -->
            <div class="Agreement">
              <Checkbox :checked.sync="Agreement" v-model="Agreement">我同意康云科技<a href="">协议</a></Checkbox>
            </div>
            <div class="Agreement AgreementServe">
              <Checkbox :checked.sync="serve" v-model="serve">我同意康云科技<a href="">服务</a></Checkbox>
            </div>
          </div>
        </div>
      </div>
      <!-- comfrim -->
      <div class="dialog_body-choose">
        <i-button shape="circle" size="large" @click="confirm">加入</i-button>
        <i-button shape="circle" size="large" @click="cancle">取消</i-button>
      </div>
      <!-- close btn-->
      <div class="dialog_body-close" @click="cancle">
        <Icon type="close-round"></Icon>
      </div>
    </div>
  </div>
</div>
</template>

<script>
//  引入输入框组件
import textInput from '../account/common/input'
import encrypt from '@/utils/encryption'
import MD5 from 'md5'
export default {
  components: {
    textInput
  },
  data () {
    return {
      loginShow: false,
      Agreement: false,
      serve: false,
      email: '',
      firstname: '',
      lastname: '',
      phone: '',
      password: '',
      repassword: '',
      // 路径地址
      path: [],
      if: true
    }
  },
  created () {
    // 检测用户是否存在
    this.$http.post('', {
      'email': this.$route.query.email
    }).then((res) => {
      if (res.data.code === 1) {
        this.$Message.success('登录成功')
        this.$router.push({
          path: '/'
        })
      }
    })
    this.loginShow = true
  },
  methods: {
    // 判断手机号
    blur: function () {
      this.$http.post('index2/login/has_phone', {
        'phone': MD5(this.phone)
      }).then((res) => {
        if (res.data.code !== 200) {
          this.$Message.error('手机号已存在')
          this.if = false
          return false
        } else {
          this.if = true
        }
      })
    },
    cancle: function () {
      this.loginShow = false
      this.$router.push({
        path: '/account'
      })
    },
    passwordConfirm: function () {
      //  验证密码格式
      let regPwd = /^[\w@0-9]{8,16}$/
      if (!regPwd.test(this.password)) {
        this.$Message.error('密码格式不正确')
        return false
      }
    },
    repasswordConfirm: function () {
      if (this.password !== this.repassword) {
        this.$Message.error('两次密码不一致')
      }
    },
    confirm: function () {
      let regPwd = /^[\w@0-9]{8,16}$/
      //  验证手机格式
      let regPhone = /^1[0-9]{10}$/
      if (!this.firstname) {
        this.$Message.error('请输入姓')
        return false
      } else if (!this.lastname) {
        this.$Message.error('请输入名字')
        return false
      } else if (!this.phone) {
        this.$Message.error('请输入电话号码')
        return false
      } else if (!this.if) {
        this.$Message.error('手机号已存在')
        return false
      } else if (!regPhone.test(this.phone)) {
        this.$Message.error('手机号格式不正确')
        return false
      } else if (!this.password) {
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
      } else if (!this.repassword) {
        this.$Message.error('请输入确认密码')
        return false
      } else if (this.password !== this.repassword) {
        this.$Message.error('两次密码不一致')
        return false
      } else if (!this.Agreement) {
        this.$Message.error('请同意协议')
        return false
      } else if (!this.serve) {
        this.$Message.error('请同意服务')
        return false
      } else {
        this.$Loading.start()
        // post createUser
        this.$http.post('index2/login/invite_register', {
          // type
          // 'type': this.$route.query.type,
          // userid
          // 'userid': this.$route.query.userid,
          // 'email': encrypt(this.$route.query.email),
          'firstname': this.firstname,
          'lastname': this.lastname,
          'password': MD5(this.password),
          // 'repassword': encrypt(this.repassword),
          'decrypt_phone': encrypt(this.phone),
          'email_key': this.$route.query.email_key
        }).then((res) => {
          if (res.data.code === 200) {
            this.$Loading.finish()
            this.$Message.success('注册成功，请用您的邮箱/电话号码进行登录')
            this.$router.push({
              path: '/account'
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
<style lang="scss">
// .AgreementServe {
//   margin-top:30px;
// }
.Agreement {
  width:100%;
  display: flex;
  padding-top:30px;
  .ivu-checkbox-wrapper {
    font-size: 14px;
    color:#767676;
    .ivu-checkbox {
      a {
        margin:0;
      }
      .ivu-checkbox-inner {
        width: 15px;
        height: 15px;
        border: 2px solid #666666;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.dialog_container {
  display: block;
  width: 100%;
  width: 100vw;
  height: 100%;
  height: 100vh;
  background-color: rgba(24,82,94, .1);
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  .dialog_box {
    display: inline-block;
    border: 1px solid #ccc;
    text-align: left;
    vertical-align: middle;
    position: relative;
    box-shadow: 0 7px 8px -4px rgba(0,0,0,.2), 0 13px 19px 2px rgba(0,0,0,.14), 0 5px 24px 4px rgba(0,0,0,.12);
    .dialog_body {
      position: relative;
      width:26.6vw;
      min-width:258px;
      background-color: #fff;
      .dialog_body-choose {
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-start;
        align-items: center;
        width:100%;
        padding:20px 40px;
        button {
          padding:10px 45px;
          color:#fff;
          background: #2d8cf0;
          border-radius: 0;
        }
        button+button {
          margin-right:20px;
          background: #B3B4B6;
          color:#fff;
        }
      }
      .dialog_content {
        width: 100%;
        background: #fff;
        padding:15px;
        padding-bottom:0;
        box-sizing: border-box;
        .title-icon {
          width:100%;
          height:100px;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width:170px;
          }
        }
        .title {
          width:100%;
          margin-bottom:20px;
          h3 {
            font-size:20px;
            color: #2d8cf0;
            box-sizing: border-box;
            text-align: center;
            padding:0 10px;
            margin-bottom:20px;
          }
          p {
            font-size:14px;
            color:#8A8E8F;
            margin-top:5px;
            text-align: center;
          }
        }
        .email-button {
          width:100%;
          padding: 0 20px;
          box-sizing: border-box;
          button {
            padding: 10px 15px;
            border-radius: 0px;
            font-size:18px;
            background: #2d8cf0
          }
        }
        .detail {
          width:100%;
          height:100%;
          padding:0px 20px;
          box-sizing: border-box;
          p:first-child {
            margin-top:0;
          }
          a {
            margin-left:5px;
          }
          p {
            font-size:14px;
            color:#8A8E8F;
            margin-top:5px;
          }
          .Folder {
            width:100%;
            // height: 45vh;
            margin-top:20px;
            .xing, .name, .password, .repassword{
              margin-bottom:30px;
            }
          }
        }
      }
      .dialog_body-close {
        position: absolute;
        top:15px;
        right:15px;
        color:#274A4B;
        cursor:pointer;
      }
    }
  }
}
.dialog_container:after {
  display: inline-block;
  content: '';
  width: 0;
  height: 100%;
  vertical-align: middle;
}
</style>
