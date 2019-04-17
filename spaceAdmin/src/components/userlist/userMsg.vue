<template>
  <div class="userMsg">
    <!-- <div class="userMsgTitle">
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
    ></user-confirm> -->
    <div class="user-container__left">
      <header class="user_container__header">
        <i></i>
        <div class="user_container__header__title">用户资料</div>
      </header>
      <section class="user-container__content">
        <Row type="flex">
          <i-col :md="24" :lg="12" class="x-col user-container__content--weight">基本信息</i-col>
          <i-col :md="24" :lg="12" class="x-col">
            <div>
              <span class="x-name">创建于</span>
              <span class="x-content" style="margin-left: 12%;">{{json.create_time * 1000 | formatDate('chineseTime')}}</span>
            </div>
          </i-col>
          <i-col :md="24" :lg="12" class="pl24 x-col">
            <div>
              <span class="x-name">姓</span>
              <span class="x-content">{{json.lastname}}</span>
            </div>
          </i-col>
          <i-col :md="24" :lg="12" class="x-col">
            <div>
              <span class="x-name">名字</span>
              <span class="x-content">{{json.firstname}}</span>
            </div>
          </i-col>
          <i-col :md="24" :lg="12" class="pl24 x-col">
            <div>
              <span class="x-name">电话</span>
              <span class="x-content">{{json.decrypt_phone}}</span>
            </div>
          </i-col>
          <i-col :md="24" :lg="12" class="x-col">
            <div>
              <span class="x-name">账户类型</span>
              <span class="x-content">{{userArr[json.user_type]}}</span>
            </div>
          </i-col>
          <i-col :md="24" :lg="24" class="pl24 x-col">
            <div>
              <span class="x-name">电子邮件地址</span>
              <span class="x-content">{{json.decrypt_email}}</span>
            </div>
          </i-col>
          <i-col :md="24" :lg="24" class="pl24 x-col">
            <div>
              <span class="x-name">默认上传文件夹</span>
              <span class="x-content">没有指定上传文件夹</span>
            </div>
          </i-col>
        </Row>
      </section>
    </div>
    <div
      v-show="($store.state.userInfo.user_type !== 3)"
      class="user-container__right">
      <div class="background--white">
        <header class="user_container__header">
          <i></i>
          <div class="user_container__header__title">修改用户权限</div>
        </header>
        <section class="right__content">
          <p>账户类型</p>
          <RadioGroup v-model="selectValue">
            <Radio class="right__radio" :label="item.value" v-for="(item,index) in selectList" :key="index">
              <span>{{item.label}}</span>
            </Radio>
          </RadioGroup>
          <p style="margin-top: 44px;">默认上传文件夹</p>
          <span class="descript__span">没有指定上传文件夹</span>
          <div class="right__btn">
            <button class="c-button c-button__primary--radius" @click="confirm">保存</button>
          </div>
        </section>
      </div>
    </div>
    <kangyun-modal
      isShowWarn
      submitText="确定"
      v-if="isShowModal"
      @closeModal="isShowModal = false"
      @confirm="loginAgain">
        <template slot="title">修改账户类型</template>
        <template slot="detail">修改账户类型将会退出，请问继续修改吗？</template>
      </kangyun-modal>
  </div>
</template>

<script>
import kangyunModal from '@/components/common/modal/kangyunModal'
import uitly from '@/components/uitly/uitly.js'
import {removeCookie} from '@/utils/utils'
export default {
  name: 'userMsg',
  components: {kangyunModal},
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
        1: '管理员',
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
  display: flex;
  padding: 95px 165px 0 165px;
}
.user-container__left {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 3px 0 #DFDFDF;
}
.user-container__left {
  flex: 1;
  padding-bottom: 106px;
}
.user-container__right {
  width: 31.5%;
  min-width: 250px;
  margin-left: 36px;
  .background--white {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 3px 0 #DFDFDF;
  }
  .user_container__header i {
    background-image: url('~@/assets/images/usermsg-lock.png');
    background-size: 25px 36px;
  }
}
.user_container__header {
  position: relative;
  i {
    position: absolute;
    display: inline-block;
    top: -20px;
    left: 20px;
    width: 64px;
    height: 64px;
    background: #00A1FF url('~@/assets/images/setting.png') no-repeat center;
    background-size: 32px;
    border-radius: 4px;
    box-shadow: 0 4px 3px 0 rgba($color: #00A1FF, $alpha: .3);
  }
  .user_container__header__title {
    margin-left: 98px;
    font-size: 18px;
    color: #333333;
    padding-top: 18px;
  }
}
.user-container__content {
  padding: 0 0 0 83px;
  .user-container__content--weight {
    font-size: 18px;
  }
  .x-name {
    color: #999999;
    font-size: 14px;
    margin-right: 16px;
  }
  .x-content {
    color: #666666;
    font-size: 16px;
  }
  .x-col {
    margin-top: 63px;
    &.pl24 {
      padding-left: 24px;
    }
    @media (max-width: 1200px) {
      &:nth-child(2n) {
        padding-left: 24px;
      }
    }
  }
}
.right__content {
  padding: 63px 32px 32px 83px;
  .right__radio {
    display: block;
    margin-top: 33px;
    color: #999999;
    font-size: 14px;
    span {
      margin-left: 20px;
    }
  }
  p {
    font-size: 18px;
    color: #666666;
  }
  .descript__span {
    display: inline-block;
    margin-top: 35px;
    font-size: 14px;
    color: #999999;
  }
  .right__btn {
    margin-top: 62px;
    text-align: right;
  }
}
</style>
