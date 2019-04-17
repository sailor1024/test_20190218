<template>
<div class="userInvite">
  <!-- <div class="userheader">
    <h3>{{activeUser.length}}名合作者</h3>
  </div> -->
  <div class="user__b">
    <div class="userContent">
      <p>邀请合作者</p>
      <!-- <i :class="['font_family', slideIf === true ? 'icon-xiangshang' : 'icon-xiangxia']" @click="slide"></i> -->
    </div>
    <div :class="['userInset', userInsetIf === true ? 'active' : '']">
      <div class="email"  :class="{'active': active}" @click.stop="clickPop">
        <input type="email" autocomplete name="email" @focus="focus" @blur="blur" v-model="email" @keyup="keyup">
        <label class="fltText" :class="{'active': pop}" >电子邮件地址*</label>
        <label class="bottomText" v-if="errorShow">此项为必填项*</label>
      </div>
      <div class="textArea">
        <i-input type="textarea" :maxlength="len" :rows="3" placeholder="邀请消息" v-model="textarea"></i-input>
        <!-- 字数 -->
        <div class="size">
          <p>{{textareaLength}}/250</p>
        </div>
      </div>
      <div class="confirm">
        <i-select v-model="Jurisdiction" style="width:200px" class="Confirm-invite">
          <i-option v-for="(item, index) in JurisdictionList" :key="index" :value="item.value">
            {{ item.label }}
          </i-option>
        </i-select>
        <!-- <i-button type="primary" @click="invite">邀请</i-button> -->
        <button class="c-button c-button__primary--radius" @click="invite">邀请</button>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import encrypt from '@/utils/encryption'
export default {
  data () {
    return {
      JurisdictionList: [
        {
          value: 3,
          label: '合作者'
        },
        {
          value: 2,
          label: '管理员'
        }
      ],
      Jurisdiction: '',
      active: false,
      // textarea
      textarea: '',
      textareaLength: 0,
      len: 250,
      email: '',
      emailIf: false,
      pop: false,
      errorShow: false,
      // slide判断
      slideIf: true,
      // slide内容判断
      userInsetIf: true,
      confirmArr: [],
      confirmIf: true
    }
  },
  created () {
    setTimeout(() => {
      let arr = this.$store.state.activeUser
      for (let i = 0; i < arr.length; i++) {
        this.confirmArr.push(arr[i].email)
      }
    }, 1500)
  },
  methods: {
    // 键盘事件
    keyup (e) {
      if (e.keyCode === 13) {
        this.invite()
      }
    },
    // 点击下拉
    slide () {
      if (this.slideIf) {
        this.slideIf = !this.slideIf
        this.userInsetIf = !this.userInsetIf
      } else {
        this.slideIf = !this.slideIf
        this.userInsetIf = !this.userInsetIf
      }
    },
    clickPop: function () {
      this.pop = true
      this.errorShow = false
      this.focus()
    },
    blur: function () {
      document.getElementsByClassName('email')[0].classList.remove('activeError')
      document.getElementsByClassName('fltText')[0].classList.remove('activeError')
      this.errorShow = false
      this.active = false
      if (!this.email) {
        this.pop = false
        return
      }
      // 验证格式
      let myreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (!myreg.test(this.email)) {
        this.emailIf = false
        this.$Message.error('邮箱格式不正确')
        return false
      } else {
        this.emailIf = true
      }
      // 验证重复
      let res = this.confirmArr.indexOf(this.email)
      if (res !== -1) {
        this.$Message.error('已邀请的协助者不能再邀请')
        this.confirmIf = false
        return false
      } else {
        this.confirmIf = true
      }
    },
    focus: function () {
      this.active = true
    },
    chooseUser: function (data) {
      this.Jurisdiction = data
    },
    // 邀请用户
    invite: function () {
      if (!this.email) {
        document.getElementsByClassName('email')[0].classList.add('activeError')
        document.getElementsByClassName('fltText')[0].classList.add('activeError')
        this.errorShow = true
        return
      } else if (!this.confirmIf) {
        this.$Message.error('已邀请的协助者不能再邀请')
        return
      } else if (!this.Jurisdiction) {
        this.$Message.error('请选择邀请用户的类型')
        return
      } else if (!this.emailIf) {
        this.$Message.error('邮箱格式不正确')
        return
      }
      // 发送用户邀请链接
      this.$http.post('index2/email/send_invite', {
        company_id: this.$store.state.userInfo.company_id,
        user_id: this.$store.state.userInfo.id,
        invite_email: encrypt(this.email.replace(/(^\s*)|(\s*$)/g, '')),
        invite_user_type: this.Jurisdiction,
        content: this.textarea.replace(/(^\s*)|(\s*$)/g, '')
      }).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('邀请成功')
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }
  },
  computed: {
    activeUser: function () {
      return this.$store.state.activeUser
    }
  },
  watch: {
    textarea (newVal) {
      if (newVal.length >= 250) {
        this.textareaLength = 250
      } else {
        this.textareaLength = newVal.length
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.userInvite {
  width:20%;
  margin-right:165px;
  margin-top:278px;
  margin-left:30px;
  .user__b {
    border-radius: 4px;
    overflow: hidden;
  }
  @media screen and (max-width: 1100px){
    & {
      width:27%;
      margin-right:70px;
    }
  }
  .userheader {
    display: flex;
    height:37px;
    align-items: center;
    justify-content: flex-start;
    margin-bottom:20px;
    h3 {
      font-size:20px;
      font-family: PingFangSC-Regular;
      color: #0f2d3e;
    }
  }
  .userContent {
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height:74px;
    padding: 0 13px;
    box-sizing: border-box;
    margin-bottom: 1px;
    overflow: hidden;
    p {
      font-size:20px;
      color: #666666;
    }
    i {
      color:#0f2d3e;
      cursor: pointer;
    }
  }
  .userInset {
    width:100%;
    // height: 0;
    background: #fff;
    box-sizing: border-box;
    overflow: hidden;
    transition: all .5s ease;
    padding: 0 15px 24px 15px;
    &.active {
      // height: 284px;
      padding: 0 15px 24px 15px;
    }
    .email {
      border-bottom:1px solid #e0e0e0;
      transition: all .3s ease;
      margin-bottom:30px;
      margin-top:35px;
      position: relative;
      &.activeError {
        border-bottom:1px solid red;
      }
      .bottomText {
        position: absolute;
        bottom:-18px;
        cursor: pointer;
        font-size: 12px;
        color:red;
        transition: all .3s ease;
      }
      .fltText {
        position: absolute;
        top:0;
        left: 0;
        cursor: pointer;
        font-size: 12px;
        color:#a9a9aa;
        transition: all .3s ease;
        &.active {
          top:-18px;
          color:rgb(0, 161, 255)
        }
        &.activeError {
          top:-18px;
          color:red
        }
      }
      &.active {
        border-bottom-color: rgb(0, 161, 255);
      }
      input {
        width:100%;
        border: 0;
        font-size:14px;
        padding-bottom:5px;
        &:focus {
          outline: none;
        }
      }
    }
    .textArea {
      margin-top:20px;
      .size {
        margin-top:10px;
        font-size:14px;
        color:#626262;
        display: flex;
        justify-content: flex-end;
        p {
          color:#99908D
        }
      }
    }
    .confirm {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 45px;

      & /deep/ .ivu-select-item:not(:last-child) {
        border-bottom: 1px solid #e0e0e0;
      }
    }
  }
  @media screen and (max-width: 1900px){
    .ivu-select{
      width:50% !important;
    }
  }
  & /deep/ .ivu-select-dropdown {
    padding: 0;
  }

  .Confirm-invite /deep/ {
    .ivu-select-selection {
      height: 48px;
      font-size: 16px;

      .ivu-select-placeholder {
        height: 48px;
        line-height: 48px;
        font-size: 14px;
      }

      .ivu-select-selected-value {
        height: 48px;
        line-height: 48px;
        font-size: 14px;
      }
    }
    .ivu-select-item {
      padding: 14px 8px !important;
      font-size: 14px !important;
    }
  }
}
</style>
