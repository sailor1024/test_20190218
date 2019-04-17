<template>
  <div class="userInset">
    <div class="userInset-header">
      <i class="userInset__icon"></i>
      <p>您访问的所有账户和组织的配置文件</p>
    </div>
    <div class="name" v-for="(item, index) in nameMsg" :key="index">
      <p class="name-one">{{item.nameTitle}}<span v-if="item.notice" style="font-size: 14px;">(如果不需要修改密码不用填)</span></p>
      <p class="name-two">
        <input :type="item.type" :placeholder="item.name" @focus="focus" @blur="blur" v-model="item.name">
      </p>
    </div>
    <div class="userInset__avatar">
      <div><i :style="userInfoAvatar"></i></div>
      <input class="userInset__input" type="file" ref="input" @change="handleChange"/>
      <button style="margin: 32px auto 0;" class="c-button c-button__primary--radius" @click="upload">上传头像</button>
    </div>
    <!-- forget -->
    <div class="forget">
      <!-- <i-button @click="cancle">取消</i-button>
      <i-button type="primary" @click="updata">更新</i-button> -->
      <button class="c-button c-button__default" @click="cancle">取消</button>
      <button class="c-button c-button__primary" @click="updata">更新</button>
    </div>
  </div>
</template>
<script>
import encrypt from '@/utils/encryption'
import md5 from 'md5'
export default {
  data () {
    return {
      nameMsg: [
        {
          nameTitle: '姓',
          name: this.$store.state.userInfo.lastname,
          type: 'text'
        },
        {
          nameTitle: '名字',
          name: this.$store.state.userInfo.firstname,
          type: 'text'
        },
        {
          nameTitle: '手机号',
          name: this.$store.state.userInfo.decrypt_phone,
          type: 'text'
        },
        {
          nameTitle: '电子邮件地址',
          name: this.$store.state.userInfo.decrypt_email,
          type: 'email'
        },
        {
          nameTitle: '旧密码*',
          name: '',
          type: 'password',
          notice: true
        },
        {
          nameTitle: '新密码*',
          name: '',
          type: 'password'
        },
        {
          nameTitle: '确认密码*',
          name: '',
          type: 'password'
        }
      ],
      postMsg: {}
    }
  },
  methods: {
    // 触发图片选择框
    upload () {
      this.$refs.input.click()
    },
    // 上传图片
    handleChange (e) {
      const files = e.target.files
      if (!files) {
        return
      }
      this.uploadFiles(files)
      this.$refs.input.value = null
    },
    uploadFiles (files) {
      let postFiles = Array.prototype.slice.call(files)
      postFiles = postFiles.slice(0, 1)
      if (postFiles.length === 0) return false
      const _fileFormat = postFiles[0].name.split('.').pop().toLocaleLowerCase()
      const check = ['png', 'jpg', 'jpeg'].some(item => item.toLocaleLowerCase() === _fileFormat)
      if (!check) {
        this.$Message.error('请上传正确的图片格式文件')
        return false
      }
      const formData = new FormData()
      const userInfo = this.$store.state.userInfo
      formData.append('head_photo', postFiles[0])
      formData.append('_', userInfo.token)
      this.$http.post('index2/user/head_photo', formData).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('上传成功')
          userInfo.head_photo_url = res.data.data.head_photo_url
          this.$store.dispatch('userInfo', userInfo)
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    updata () {
      // 获取用户输入的信息
      let arr = this.nameMsg
      this.postMsg = {
        name: arr[0].name,
        nameFirst: arr[1].name,
        number: arr[2].name,
        email: arr[3].name,
        originPassword: arr[4].name,
        newPassword: arr[5].name,
        confirmPassword: arr[6].name
        // user_id: this.$store.state.userInfo.id
      }
      const regName = /^([\u4e00-\u9fa5]{1,4})$|^([a-zA-Z]{1,32})$/
      const regPwd = /^[\w@0-9]{8,16}$/
      if (!this.postMsg.name) {
        this.$Message.error('姓不能为空')
        return false
      } else if (!regName.test(this.postMsg.name)) {
        this.$Message.error('姓格式不正确')
        return false
      } else if (!this.postMsg.nameFirst) {
        this.$Message.error('名字不能为空')
        return false
      } else if (!regName.test(this.postMsg.nameFirst)) {
        this.$Message.error('名字格式不正确')
        return false
      } else if (!this.postMsg.number) {
        this.$Message.error('手机号码不能为空')
        return false
      } else if (!/^1[0-9]{10}$/.test(this.postMsg.number)) {
        this.$Message.error('手机号码格式不正确')
        return false
      } else if (this.postMsg.email && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.postMsg.email)) {
        this.$Message.error('邮箱格式不正确')
        return false
      } else if (this.postMsg.originPassword !== '' && !regPwd.test(this.postMsg.originPassword)) {
        this.$Message.error('旧密码格式不正确')
        return
      } else if (this.postMsg.newPassword !== '' && this.postMsg.newPassword.length < 8) {
        this.$Message.error('请输入至少8位数的密码')
        return
      } else if (this.postMsg.newPassword !== '' && this.postMsg.newPassword.length > 16) {
        this.$Message.error('请输入不超过16位数的密码')
        return
      } else if (this.postMsg.newPassword !== '' && !regPwd.test(this.postMsg.newPassword)) {
        this.$Message.error('密码格式不正确')
        return
      } else if (this.postMsg.newPassword !== this.postMsg.confirmPassword) {
        this.$Message.error('两次输入的密码不正确')
        return false
      }
      const userInfo = this.$store.state.userInfo
      let isModifier = false
      if (this.postMsg.name !== userInfo.lastname) isModifier = true
      if (this.postMsg.nameFirst !== userInfo.firstname) isModifier = true
      if (this.postMsg.number !== userInfo.decrypt_phone) isModifier = true
      if (this.postMsg.email !== userInfo.decrypt_email) isModifier = true
      if (this.postMsg.originPassword !== '') isModifier = true
      if (this.postMsg.newPassword !== '') isModifier = true

      // 发送请求
      if (!isModifier) {
        this.$Message.error('没有修改任何信息')
        return false
      }
      const obj = {}
      obj.email = this.postMsg.email ? encrypt(this.postMsg.email) : ''
      obj.password = this.postMsg.newPassword ? md5(this.postMsg.newPassword) : ''
      obj.regpassword = this.postMsg.confirmPassword ? md5(this.postMsg.confirmPassword) : ''
      obj.phone = encrypt(this.postMsg.number)
      obj.firstname = this.postMsg.nameFirst
      obj.lastname = this.postMsg.name
      obj.origpassword = this.postMsg.originPassword ? md5(this.postMsg.originPassword) : ''
      this.$http.post('index2/user/edit_user', obj).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success('修改成功')
          const data = res.data.data.info
          const temObj = this.$store.state.userInfo
          temObj.decrypt_email = data.email
          temObj.decrypt_phone = data.phone
          temObj.firstname = data.firstname
          temObj.lastname = data.lastname
          this.$store.dispatch('userInfo', temObj)
          setTimeout(() => {
            this.$router.push({
              path: '/'
            })
          }, 20)
          // 把修改成功返回的对象渲染到视图上
        } else if (res.data.code === 406) {
          this.$Message.error('前后密码不一致')
        } else if (res.data.code === 400) {
          this.$Message.error('权限不够')
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    focus (e) {
      e.target.parentNode.style['border-bottom-color'] = 'rgb(0, 161, 255)'
      // e.target.parentNode.previousElementSibling.style.color = 'rgb(0, 161, 255)'
    },
    blur (e) {
      e.target.parentNode.style['border-bottom-color'] = '#E8E8E8'
      // e.target.parentNode.previousElementSibling.style.color = '#ADAFAF'
    },
    cancle () {
      this.$emit('changeComp', 'show')
    }
  },
  computed: {
    userInfoAvatar () {
      if (!this.$store.state.userInfo.head_photo_url) return ''
      return {'background-image': `url(${this.$store.state.userInfo.head_photo_url})`}
    }
  }
}
</script>
<style scoped lang="scss">
.userInset {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #fff;
  margin-left:20px;
  padding: 0 20px 32px;
  box-sizing: border-box;
  border-radius: 4px;
  .userInset-header {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 0 12px 31px 4px;
    border-bottom:3px solid #F1F1F1;
    p {
      margin-top: 21px;
      margin-left: 84px;
      color: #666666;
      font-size:18px;
    }
  }
  .name {
    margin-top:43px;
    padding-left: 11px;
    margin-right: 320px;
    .name-one {
      font-size:18px;
      color:#333;
      transition: all .3s ease;
    }
    .name-two {
      font-size:14px;
      color: #666;
      padding-top:5px;
      border-bottom:1px solid #E8E8E8;
      padding-bottom:5px;
      transition: all .3s ease;
      input {
        width:100%;
        font-size:14px;
        color:#666364;
        border: none;
        &:focus {
          outline: none;
        }
      }
    }
  }
  .forget {
    width:100%;
    margin-top:40px;
    text-align: right;
    padding-right: 63px;
  }
  .userInset__icon {
    position: absolute;
    display: inline-block;
    top: -20px;
    left: 4px;
    width: 64px;
    height: 64px;
    background: #00A1FF url('~@/assets/images/setting.png') no-repeat center;
    background-size: 32px;
    border-radius: 4px;
    box-shadow: 0 4px 3px 0 rgba($color: #00A1FF, $alpha: .3);
  }
  .userInset__avatar {
    position: absolute;
    top: 105px;
    right: 60px;
    text-align: center;
    i {
      display: inline-block;
      width: 150px;
      height: 150px;
      box-shadow: 0 4px 10px 0 rgba(0,0,0,.2);
      border-radius: 100px;
      background-size: cover;
      background-position: center;
    }
  }
  .userInset__input {
    &[type=file] {
      display: none;
    }
  }
}
</style>
