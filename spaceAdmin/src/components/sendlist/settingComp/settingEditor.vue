<template>
  <div class="origanization-box">
    <section class="company__header">
      <div style="width:100%;">
        <div class="company__avatar">
          <i class="font_family icon-huaban"></i>
        </div>
        <div class="company__header--content">
          <span v-if="isShowEdite">组织机构</span>
          <p v-else style="padding-top: 10px;">
            <span v-if="$store.state.userInfo.company_name">
              {{$store.state.userInfo.company_name}}
            </span>
            <span v-else>未设置机构名称</span>
          </p>
          <div v-if="isShowEdite">
            <input class="company__header--input" v-model.trim="companyName" type="text">
          </div>
        </div>
      </div>
      <div>
        <!-- <Button
          v-if="!isShowEdite"
          @click="isShowEdite=true"
          class="company-btn"
          type="primary">编辑</Button> -->
        <button
          v-if="!isShowEdite"
          @click="isShowEdite=true"
          class="company-btn c-button c-button__primary--radius">编辑</button>
      </div>
    </section>
    <div class="company__list">
      <div class="list__block">
        <div class="list__name">管理类型</div>
        <div v-if="!isShowEdite" class="list__content">{{userType[$store.state.userInfo.user_type]}}</div>
        <i-select
          v-else
          class="list__select"
          v-model="origanizationType">
            <i-option :value="2">管理员</i-option>
            <i-option :value="3">合作者</i-option>
          </i-select>
      </div>
      <div class="list__block" style="margin-top: 95px;">
        <div class="list__name">默认上传文件夹</div>
        <div class="list__content">没有指定上传文件夹</div>
      </div>
    </div>
    <div class="company__display" v-if="!isShowEdite">
      <div class="company__display--title">
        {{data.length}}名管理员
      </div>
      <div style="margin-left: 12px;margin-right: -28px;">
        <div class="company__manage--box"
          :key="item.id"
          v-for="(item) in data">
          <div class="company__manage--pos">
            <div class="company__manage--content">
              <i></i>
              <div class="company__manage--name">{{item.lastname + item.firstname}}</div>
              <div class="company__manage--email" v-if="item.decrypt_email">{{item.decrypt_email}}</div>
              <div class="company__manage--email" v-else>该用户没有设置邮箱</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="company__topic" v-if="isShowEdite">
      <!-- <Button
        @click="isShowEdite=false"
        class="company-btn--cancel">取消</Button>
      <Button
        @click="confirm"
        class="company-btn"
        type="primary">更新</Button> -->
      <button
        @click="isShowEdite=false"
        class="c-button c-button__default"
        >取消</button>
      <button
        @click="confirm"
        class="c-button c-button__primary"
        >更新</button>
    </div>
    <kangyun-modal isShowWarn submitText="确定" v-if="isShowModal" @closeModal="isShowModal=false" @confirm="loginAgain">
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
  name: 'settingEdite',
  components: {kangyunModal},
  data: () => ({
    isShowEdite: false,
    origanizationType: null,
    userType: {
      1: '管理员',
      2: '管理员',
      3: '合作者'
    },
    companyName: '',
    isShowModal: false,
    data: []
  }),
  created () {
    this.origanizationType = this.$store.state.userInfo.user_type
    this.companyName = this.$store.state.userInfo.company_name
    this.getData()
  },
  methods: {
    updateInfo () {
      this.$http.post('index2/user/edit_organization', {
        edit_user_type: this.origanizationType,
        company_name: this.companyName
      }).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('修改成功')
          const obj = this.$store.state.userInfo
          obj.user_type = this.origanizationType
          obj.company_name = this.companyName
          this.$store.dispatch('userInfo', obj)
          this.isShowEdite = false
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    confirm () {
      if (this.origanizationType !== this.$store.state.userInfo.user_type) {
        this.isShowModal = true
      } else {
        this.updateInfo()
      }
    },
    loginOut () {
      this.$http.post('index2/login/login_out', {}).then(res => {
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
      this.$http.post('index2/user/edit_organization', {
        edit_user_type: this.origanizationType,
        company_name: this.companyName
      }).then(res => {
        if (res.data.code === 200) {
          this.loginOut()
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    getData () {
      this.$http.post('index2/user/manage_user', {}).then(res => {
        if (res.data.code === 200) {
          this.data = res.data.data
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.origanization-box {
  padding: 0 20px 32px;
  flex: 1;
  margin-left: 20px;
  background-color: #fff;
  border-radius: 4px;
}
.company__header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 3px solid #efefef;
  padding-bottom: 24px;
  .company__avatar {
    position: absolute;
    top: -20px;
    left: 4px;
    display: flex;
    float: left;
    width: 64px;
    height: 64px;
    background-color: #00A1FF;
    border-radius: 4px;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 3px 0 rgba($color: #00A1FF, $alpha: .3);
    i {
      font-size: 35px;
      color: #fff;
    }
  }

  .company__header--content {
    margin-left: 84px;
    font-size: 18px;
    margin-top: 12px;
  }

  .company__header--input {
    width: 100%;
    border: 0;
    background: transparent;
    outline: 0;
    color: inherit;
    font-size: 14px;
    line-height: 1.15;
    border-bottom: 2px solid #efefef;
    padding-bottom: 3px;
    margin-top: 8px;
    transition: all 0.3s;
    &:focus {
      border-bottom-color: #00a1ff;
    }
  }
}
.company__list {
  margin-top: 32px;
  padding: 0 12px;
  .list__name {
    font-size: 18px;
    color: #333333;
  }
  .list__content {
    font-size: 14px;
    padding-top: 16px;
    color: #999999;
    padding-left: 16px;
  }
  .list__block {
    margin-top: 31px;
  }
  .list__select {
    border: 0;
    width: 100px;
    margin-top: 8px;
    color: #666666;
  }
}
.company__display {
  margin-top: 30px;
}
.company__display--title {
  height: 40px;
  font-size: 16px;
  background-color: #00A1FF;
  line-height: 40px;
  padding-left: 15px;
  margin: 0 12px;
  color: #FFFFFF;
}

.company__manage--box {
  width: 33.333%;
  min-width: 400px;
  float: left;
  padding-top: 20px;
  .company__manage--pos {
    margin-top: 30px;
    border-radius: 6px;
    box-shadow:0px 3px 10px 2px rgba(204,204,204,0.4);
    margin-right: 40px;
  }
  .company__manage--content {
    position: relative;
    padding: 0 20px;

    i {
      position: absolute;
      top: -20px;
      display: inline-block;
      width: 86px;
      height: 86px;
      border-radius: 4px;
      box-shadow: 0 4px 3px 0 rgba(0, 161, 255, 0.3);
      background: #00A1FF url('~@/assets/images/setting.png') no-repeat center;
      background-size: 36px;
    }
  }

  .company__manage--name {
    font-size: 18px;
    color: #666666;
    padding-left: 98px;
    padding-top: 34px;
    padding-bottom: 34px;
    border-bottom: 1px solid #EEEEEE;
  }

  .company__manage--email {
    font-size: 14px;
    padding: 14px 2px;
    color: #666364;
  }
}
.company__topic {
  margin-top: 10px;
  float: right;
}
.company-btn {
  margin-top: 12px;
  padding: 11px 25px;
}
.company-btn--cancel {
  border-radius: 1px;

  &:focus, &:active, &:hover {
    border-color: #dddee1;
    color: #495060;
    box-shadow: 0 0 0 0px rgba(45, 140, 240, 0.2)
  }
}
.company__list {
  & /deep/ .ivu-select-single .ivu-select-selection {
    border: 0;
  }
  & /deep/ .ivu-select-visible .ivu-select-selection {
    box-shadow: 0 0 0 0px rgba(45, 140, 240, 0.2)
  }
  & /deep/ .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
    padding-left: 16px;
    color: #666666;
  }
  & /deep/ .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
    padding-left: 16px;
  }
}

</style>
