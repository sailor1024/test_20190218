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
    color: #636363;
    user-select: none;
  }
  .register-phone{
    width:100%;
  }
  //  底端容器样式
  .account-utilities{
    display:flex;
    justify-content: space-between;
    margin-top:22px;
    margin-bottom: 46px;
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
      创建你的账号
    </h1>
    <div class="register-accountname account-form">
      <div style="display:flex;">
        <!-- 姓名 -->
        <text-input label="姓氏" style="margin-right:8px">
          <input type="text" slot="cw-input-0609" class="cw-dc-input" v-model.trim="lastname">
        </text-input>
        <text-input label="名字" style="margin-left:8px">
          <input type="text" slot="cw-input-0609" class="cw-dc-input" v-model.trim="famailname">
        </text-input>
      </div>
    </div>
    <div class="register-phone account-form">
      <!-- 手机号 -->
      <text-input label="手机号码">
        <input type="text" slot="cw-input-0609" class="cw-dc-input" v-model.trim="phone">
      </text-input>
      <text-input label="公司名称(选填)" style="margin-top:5px;">
        <input type="text" slot="cw-input-0609" class="cw-dc-input" v-model.trim="address">
      </text-input>
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
      <div class="register-passwd-tips"> 使用8到16个字符（字母、数字和符号的组合）</div>
    </div>
    <div class="account-utilities">
      <div class="account-utilities-left">
        <a href="javascript;" style="padding-top: 19px;display: inline-block;" @click.prevent="toLoginExist()">登录现有账号</a>
      </div>
      <div class="account-utilities-right">
        <!-- <Button type="primary" size="large" @click.stop="registerfunc()">下一步</Button> -->
        <button style="width: 174px;" class="c-button c-button__primary--radius" @click.stop="registerfunc()">完成</button>
      </div>
    </div>
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
  data: function () {
    return {
      eye_isDisable: false,
      lastname: '',
      famailname: '',
      phone: '',
      upwd: '',
      cpwd: '',
      address: ''
    }
  },
  created: function () {
  },
  methods: {
    //  切换密码隐藏
    eyeDisable: function () {
      if (this.eye_isDisable) {
        this.eye_isDisable = false
      } else {
        this.eye_isDisable = true
      }
    },
    //  跳转到使用已有账号登录
    //  如果缓存中有账号信息,跳转到/account/loginExists，没有则跳转到/account/login
    toLoginExist: function () {
      this.$router.push('/account/loginExists')
    },
    //  判断手机有没被注册
    testPhone: function () {
      var regPhone = /^1[0-9]{10}$/
      if (!regPhone.test(this.phone)) {
        this.$Message.error('手机号格式不正确')
        return false
      }
      this.$http.post('index2/login/has_phone', {
        'phone': MD5(this.phone)
      }, {
        isNeedToken: false
      }).then((res) => {
        var data = res.data
        if (data.code !== 200) {
          this.$Message.error('手机号已被注册')
        }
      })
    },
    //  注册功能
    registerfunc: function () {
      var regName = /^([\u4e00-\u9fa5]{1,4})$|^([a-zA-Z]{1,32})$/
      var regPhone = /^1[0-9]{10}$/
      var regPwd = /^[\w@0-9]{8,16}$/
      //  验证各个输入框有没空字符
      if (this.lastname === '') {
        this.$Message.error('请输入姓氏')
        return false
      } else if (!regName.test(this.lastname)) {
        this.$Message.error('姓氏格式不正确')
        return false
      } else if (this.famailname === '') {
        this.$Message.error('请输入名字')
        return false
      } else if (!regName.test(this.famailname)) {
        this.$Message.error('名字格式不正确')
        return false
      } else if (this.phone === '') {
        this.$Message.error('请输入手机号')
        return false
      } else if (!regPhone.test(this.phone)) {
        this.$Message.error('手机号格式不正确')
        return false
      } else if (this.upwd === '') {
        this.$Message.error('请输入密码')
        return false
      } else if (this.upwd.length < 8) {
        this.$Message.error('请输入至少8位数的密码')
        return false
      } else if (this.upwd.length > 16) {
        this.$Message.error('请输入不超过16位数的密码')
        return false
      } else if (!regPwd.test(this.upwd)) {
        this.$Message.error('密码格式不正确')
        return false
      } else if (this.cpwd === '') {
        this.$Message.error('请重复密码')
        return false
      } else if (this.upwd !== this.cpwd) {
        this.$Message.error('两次输入密码不一致')
        return false
      }
      (async () => {
        const res1 = await this.$http.post('index2/login/has_phone', {
          'phone': MD5(this.phone)
        }, {
          isNeedToken: false
        })
        if (res1.data.code !== 200) {
          this.$Message.error(res1.data.message)
        } else {
          const res2 = await this.$http.post('index2/login/company_register', {
            'lastname': this.lastname,
            'firstname': this.famailname,
            'decrypt_phone': encrypt(this.phone),
            'password': MD5(this.upwd),
            // 公司名称
            'company_name': this.address.replace(/(^\s*)|(\s*$)/g, '')
          }, {isNeedToken: false})
          if (res2.data.code === 200) {
            this.$Message.success('注册成功')
            this.$router.push({
              path: '/account',
              name: 'accountLogin'
            })
          } else if (res2.data.code === 201) {
            this.$Message.error('注册用户失败')
          } else if (res2.data.code === 202) {
            this.$Message.error('公司注册失败')
          } else {
            this.$Message.error(res2.data.message)
          }
        }
      })()
    }
  }
}
</script>
