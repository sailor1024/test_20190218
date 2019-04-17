<template>
  <div class="folder-right">
    <p class="right__title">合作者信息</p>
    <div class="right__container">
      <div class="right__select__block" v-if="inviteList.length">
        <header class="right__container__title">现有合作者</header>
        <i-select
          v-model="userSelected"
          @on-change="selectUser"
          class="right__select">
          <i-option v-for="(item, index) in inviteList"
            :key="index"
            :value="index">{{item.user_name}}</i-option>
        </i-select>
        <RadioGroup class="radio__block" v-model="userEditType">
            <Radio :label="1">
              <span class="radio__span">可以查看</span>
            </Radio>
            <Radio :label="2">
              <span class="radio__span">可以编辑</span>
            </Radio>
            <Radio :label="3">
              <span class="radio__span">删除该合作者</span>
            </Radio>
        </RadioGroup>
        <button
          @click="sendItem"
          class="right__select__button c-button c-button__primary--radius">保存</button>
      </div>

      <div class="right__select__bottom">
        <header class="right__container__title">新增合作者</header>
        <input
          v-model="email"
          class="input"
          type="text"
          placeholder="请输入账户协作者的电子邮件地址">
        <RadioGroup class="radio__block" v-model="editorType">
            <Radio :label="1">
              <span class="radio__span">可以查看</span>
            </Radio>
            <Radio :label="2">
              <span class="radio__span">可以编辑</span>
            </Radio>
        </RadioGroup>
        <button
          @click="sendemail"
          class="right__select__bottom__button c-button c-button__primary--radius">邀请</button>
      </div>
    </div>
    <!-- <ul>
      <li
        v-for="(item, index) in inviteList"
        :key="index"
        class="right__li">
          {{item.user_name}}
          <i-select
            @on-change="sendItem(item,arguments[0])"
            v-model="item.edit_type"
            class="right__select">
            <i-option :value="1">可以查看</i-option>
            <i-option :value="2">可以编辑</i-option>
            <i-option :value="3">删除用户</i-option>
          </i-select>
      </li>
    </ul> -->
    <!-- <div class="right__btn" @click="invite">
      <Icon type="plus-round" size="12" color="#626262"></Icon>
      <span>邀请合作者</span>
    </div> -->
  </div>
</template>
<script>
import MD5 from 'md5'
import encrypt from '@/utils/encryption.js'
export default {
  props: {
    projects: {
      type: Array,
      default: () => ([])
    },
    folderProps: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    inviteList: [],
    userSelected: 0,
    userEditType: 1,
    editorType: null,
    email: ''
  }),
  methods: {
    sendItem () {
      this.$http.post('index2/email/edit_invite_items', {
        dir_item_id: this.$route.params.id,
        email: MD5(this.inviteList[this.userSelected].email),
        type: this.userEditType,
        file_type: 1,
        edit_type: this.folderProps.edit_type
      }).then(res => {
        if (res.data.code === 200) {
          if (this.userEditType === 3) {
            this.getData()
          }
          this.$Message.success('修改成功')
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    selectUser (index) {
      this.userEditType = this.inviteList[index].edit_type
      this.userSelected = index
    },
    invite () {
      this.$store.dispatch('ModelFolderInvite', {
        isShow: true,
        json: this.folderProps
      })
    },
    getData () {
      this.$http.post('index2/index/invite_cooperator_list', {
        'item_dir': this.folderProps.id,
        'project_id': ''
      }).then((res) => {
        let data = res.data
        if (data.code === 200) {
          this.inviteList = data.data
          this.selectUser(0)
        }
      })
    },
    sendemail () {
      if (this.email) {
        if (!this.editorType) {
          this.$Message.error('请选择合作者权限')
          return false
        }
        this.$http.post('/index2/email/email', {
          'email': encrypt(this.email),
          'file_type': 1, // 文件夹1 或者项目2
          'userid': this.$store.state.userInfo.id,
          'type': this.editorType,
          'item_id': this.$route.params.id
        }).then((res) => {
          if (res.data.code === 200) {
            this.$Message.success('邀请成功')
            this.getData()
          } else if (res.data.code === 401) {
            this.$Message.error('邀请失败，请重新邀请')
          } else {
            this.$Message.error(res.data.message)
          }
        })
      } else {
        this.$Message.error('请输入邮箱')
      }
    }
  },
  created () {
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
.folder-right {
  margin-left: 38px;
  margin-top: 148px;
  width: 20%;
  min-width: 250px;
  overflow: hidden;
  border-radius: 4px;

  .right__title {
    color: #666666;
    font-size: 20px;
    height: 74px;
    line-height: 74px;
    background-color: #fff;
    padding-left: 20px;
    border-bottom: 1px solid #efefef;
  }

  .right__li  {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: default;
    font-size: 14px;
  }

  // .right__select {
  //   width: 80px;
  //   margin-right: 4px;

  //   & /deep/ .ivu-select-selection {
  //     background-color: transparent;
  //     border: none;
  //   }

  //   &.ivu-select-visible /deep/ .ivu-select-selection {
  //     box-shadow: 0 0 0 0px
  //   }
  //   & /deep/ .ivu-select-arrow {
  //     margin-top: -9px;
  //   }
  // }
  .right__btn {
    display: inline-block;
    font-size: 12px;
    color: #626262;
    cursor: pointer;
  }

  .right__container {
    padding: 20px 20px 32px;
    background-color: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .right__container__title {
    color: #666666;
    font-size: 14px;
  }

  .right__select__block {
    position: relative;
    margin-bottom: 33px;

    .right__select__button {
      position: absolute;
      padding: 10px 25px;
      font-size: 12px;
      right: 0;
      bottom: 0;
    }
  }

  .right__select__bottom {
    position: relative;

    .right__select__bottom__button {
      position: absolute;
      padding: 10px 25px;
      font-size: 12px;
      bottom: 0;
      right: 0;
    }
  }

  .radio__block {
    /deep/ .ivu-radio-wrapper {
      margin-top: 24px;
      display: block;
    }

    span {
      display: inline-block;
      margin-left: 12px;
      font-size: 14px;
      color: #666666;
    }
  }

  .input {
    margin-top: 15px;
    outline: 0;
    border: 0;
    border-bottom: 1px solid #E0E0E0;
    font-size: 12px;
    color: #666666;
    line-height: 1.5;
    width: 100%;
    transition: all .3s ease-in-out;

    &::placeholder {
      color: #999999;
    }

    &:focus {
      border-color: #00A1FF;
    }
  }
}

.right__select {
  margin-top: 3px;
}

.right__select /deep/ {
  .ivu-select-selection {
    border-color: transparent;
    box-shadow: none !important;
    border-bottom: 1px solid #efefef;
    border-radius: 0;
  }
  .ivu-select-selected-value {
    color: #999999;
    padding-left: 0;
    font-size: 12px;
    height: 36px;
    line-height: 36px;
  }
  .ivu-select-item {
    color: #666666;
    padding: 13px 0;
    padding-left: 8px;
    font-size: 12px !important;
  }
  .ivu-select-dropdown {
    margin-top: 0px;
  }
  .ivu-select-single .ivu-select-selection {
    height: 38px;
  }
  .ivu-select-item-selected {
    color: #00A1FF;
  }
}
</style>
