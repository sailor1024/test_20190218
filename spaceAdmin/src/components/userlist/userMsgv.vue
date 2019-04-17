<template>
  <div class="userMsg">
    <div class="userMsgTitle">
      <h3>{{username}}</h3>
      <p class="userMsg-border">描述</p>
    </div>
    <div class="baseMsg userMsgTitle">
      <h3>基本信息</h3>
      <p>
        <span style="margin-right: 15px;"
          v-show="!isShowEdit
            && ($store.state.userInfo.user_type !== 3 || $store.state.userInfo.id === json.id)">
          <i-button @click="isShowEdit = true" type="info">编辑</i-button>
        </span>
        <span style="margin-right: 15px;" v-show="isShowEdit">
          <i-button class="btn-cancel" @click="isShowEdit = false" type="info">取消</i-button>
          <i-button type="info" @click="confirm">更新</i-button>
        </span>
        这是您可以查看有关用户的基本信息的位置。
      </p>
    </div>
    <div class="detailMsg">
      <p>创建于：{{json.create_time * 1000 | formatDate('chineseTime')}}</p>
      <!-- <div class="name" v-for="(item, index) in nameMsg" :key="index">
        <p class="name-one">{{item.nameTitle}}</p>
        <p class="name-two">{{item.name}}</p>
      </div> -->
      <div class="name" v-if="!isShowEdit">
        <p class="name-one">姓</p>
        <p class="name-two" v-if="!isShowEdit">{{json.lastname}}</p>
        <input v-else class="name-input" type="text" v-model.trim="nameMsg[1].name" placeholder="请输入姓">
      </div>
      <div class="name" v-if="!isShowEdit">
        <p class="name-one">名字</p>
        <p class="name-two" v-if="!isShowEdit">{{json.firstname}}</p>
        <input v-else class="name-input" type="text" v-model.trim="nameMsg[0].name" placeholder="请输入名字">
      </div>
      <div class="name" v-if="!isShowEdit">
        <p class="name-one">电话</p>
        <p class="name-two">{{json.decrypt_phone}}</p>
      </div>
      <div class="name" v-if="!isShowEdit">
        <p class="name-one">电子邮件地址</p>
        <p class="name-two">{{json.decrypt_email}}</p>
      </div>
      <div class="name">
        <p class="name-one">账户类型</p>
        <p class="name-two">
          <i-select v-if="isShowEdit
            && ($store.state.userInfo.user_type !== 3)"
            style="width: 98px;"
            v-model="selectValue"
            placeholder="选择账户类型">
            <i-option :value="item.value" v-for="(item,index) in selectList" :key="index" class="slide">{{item.label}}</i-option>
          </i-select>
          <template v-else>
            {{userArr[selectValue]}}
          </template>
        </p>
      </div>
      <div class="name">
        <p class="name-one">默认上传文件夹</p>
        <p class="name-two">没有指定上传文件夹</p>
      </div>
    </div>
    <user-confirm
      @deleteCollaborator="isShowModal = arguments[0]"
      @confirm="loginAgain"
      v-if="isShowModal"
    ></user-confirm>
  </div>
</template>

<script>
import userConfirm from './userUpdateInFormation'
import uitly from '@/components/uitly/uitly.js'
import {removeCookie} from '@/utils/utils'
export default {
  name: 'userMsg',
  components: {userConfirm},
  methods: {
    loginOut () {
      this.$http.post('index2/login/login_out', {
        _: this.$store.getters.token
      }).then(res => {
        if (res.data.code === 200) {
          uitly.removeCookie('name')
          localStorage.removeItem('userInfo')
          removeCookie()
          this.$router.push({
            path: '/account'
          })
        } else {
          this.$Message.error('退出失败！')
        }
      })
    },
    loginAgain () {
      this.$http.post('index2/user/update_user', {
        id: this.$route.query.id,
        lastname: this.nameMsg[1].name,
        firstname: this.nameMsg[0].name,
        user_type: this.selectValue
      }).then(res => {
        if (res.data.code === 200) {
          this.loginOut()
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    timestr () {
      if (this.time) {
        // this.timeShow = new Date(this.time * 1000).toLocaleString()
        this.timeShow = this.time
      } else {
        this.timeShow = '暂无时间信息'
      }
    },
    updateMessage () {
      this.$http.post('index2/user/update_user', {
        id: this.$route.query.id,
        lastname: this.nameMsg[1].name,
        firstname: this.nameMsg[0].name,
        user_type: this.selectValue
      }).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('更新信息成功')
          // 路由跳转
          this.$store.dispatch('isRouterReload', true)
        } else if (res.data.code === 202) {
          this.$Message.error('您没进行任何修改')
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    confirm () {
      if (this.$store.state.userInfo.id === Number(this.$route.query.id)) {
        if (this.$store.state.userInfo.user_type !== this.selectValue) {
          this.isShowModal = true
        } else {
          this.updateMessage()
        }
      } else {
        this.updateMessage()
      }
    }
  },
  created () {
    // this.$http.post('/index/index/un_userdetil', {
    //   'id': this.$route.query.id,
    //   'phone': this.$route.query.phone
    // }).then((res) => {
    //   let data = res.data
    //   if (data.code === 1) {
    //     let json = data.data[0]
    //     this.username = json.lastname + json.famailname
    //     this.time = json.addtime
    //     this.timestr()
    //     if (json.administrator === 2) {
    //       this.user = '超级管理员'
    //     } else if (json.administrator === 1) {
    //       this.user = '管理员'
    //     } else if (json.type === 2) {
    //       this.user = '管理员'
    //     } else if (json.type === 1) {
    //       this.user = '用户'
    //     } else {
    //       this.user = '用户'
    //     }
    //     this.json = json
    //     this.nameMsg = [
    //       {
    //         nameTitle: '名字',
    //         name: json.famailname
    //       },
    //       {
    //         nameTitle: '姓',
    //         name: json.lastname
    //       },
    //       {
    //         nameTitle: '电话',
    //         name: json.phone
    //       },
    //       {
    //         nameTitle: '电子邮件地址',
    //         name: json.email
    //       },
    //       {
    //         nameTitle: '账户类型',
    //         name: this.user
    //       },
    //       {
    //         nameTitle: '默认上传文件夹',
    //         name: '没有指定上传文件夹'
    //       }
    //     ]
    //   }
    // })
    this.$http.post('index2/user/un_userdetil', {
      id: this.$route.query.id
    }).then(res => {
      if (res.data.code === 200) {
        let data = res.data.data
        this.username = data.lastname + data.firstname
        this.json = data
        this.selectValue = data.user_type
        this.nameMsg = [
          {
            nameTitle: '名字',
            name: data.firstname
          },
          {
            nameTitle: '姓',
            name: data.lastname
          },
          {
            nameTitle: '电话',
            name: data.decrypt_phone
          },
          {
            nameTitle: '电子邮件地址',
            name: data.decrpyt_email
          },
          {
            nameTitle: '账户类型',
            name: this.userArr[data.user_type]
          },
          {
            nameTitle: '默认上传文件夹',
            name: '没有指定上传文件夹'
          }
        ]
      }
    })
  },
  data () {
    return {
      isShowModal: false,
      isShowEdit: false,
      selectValue: 2,
      selectList: [
        {
          value: 2,
          label: '管理员'
        },
        {
          value: 3,
          label: '合作者'
        }
      ],
      userArr: {
        1: '超级管理员',
        2: '管理员',
        3: '合作者'
      },
      nameMsg: [
        {
          nameTitle: '名字',
          name: ''
        },
        {
          nameTitle: '姓',
          name: ''
        },
        {
          nameTitle: '标题',
          name: ''
        },
        {
          nameTitle: '电话',
          name: ''
        },
        {
          nameTitle: '电子邮件地址',
          name: 'li.wang817@gmail.com'
        },
        {
          nameTitle: '账户类型',
          name: ''
        },
        {
          nameTitle: '默认上传文件夹',
          name: '没有指定上传文件夹'
        }
      ],
      username: '',
      time: 0,
      user: '',
      timeShow: '',
      json: {
        famailname: '',
        lastname: '',
        decrypt_phone: '',
        decrpyt_email: '',
        user: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.userMsg {
  padding: 0 165px 0 165px;
  box-sizing: border-box;
  // background: #F2F2F2;
  .userMsgTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top:33px;
    h3 {
      font-size:24px;
      color:#043F5B;
    }
    p {
      font-size:18px;
      color:#043F5B;
      font-weight: 800;
    }
    .userMsg-border {
      margin-right:203px;
    }
  }
  .baseMsg {
    h3 {
      font-size:18px;
    }
    p {
      font-size:12px;
      font-weight: 100;
      color: #838383;
    }
    button {
      // padding: 6px 36px;
      border-radius: 0;
      background: #00a1ff;
    }
    .btn-cancel {
      background: #eeeeee;
      border-color: #eeeeee;
      color: inherit;
    }
    & /deep/ .ivu-btn-info:focus {
      box-shadow: 0 0 0 0;
    }
  }
  .detailMsg {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    &>p {
      margin-top:30px;
    }
  }
  .name {
    margin-top:43px;
    .name-one {
      font-size:20px;
      color:#043F5B
    }
    .name-two {
      font-size:14px;
      color: #838383;
      padding-top:10px;
    }
    & /deep/ .ivu-select-selection {
      background-color: transparent;
      border: 0;
    }
    & /deep/ .ivu-select-visible .ivu-select-selection {
      box-shadow: 0 0 0 0;
    }
    & /deep/ .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
      padding-left: 0;
      font-size: 14px;
      color: #838383;
    }
    .name-input {
      border: 0;
      background: transparent;
      outline: 0;
      color: inherit;
      font-size: 1em;
      border-bottom: 2px solid #ccc;
      padding-bottom: 3px;
      width: 245px;
      margin-top: 10px;
      transition: all 0.3s;
      &:focus {
        border-bottom-color: #00a1ff;
      }
    }
  }
}
</style>
