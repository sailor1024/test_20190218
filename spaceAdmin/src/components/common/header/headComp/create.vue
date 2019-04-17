<template>
<div class="dialog_container" tabindex="-1" @keyup.esc="popClose">
  <div class="dialog_box">
    <div class="dialog_body">
      <div class="dialog_content">
        <!-- title -->
        <h3 class="dialog_body-title"><span style="font-size: 30px;">创建文件夹</span></h3>
        <!-- detail -->
        <div class="dialog_body-detail">
          <input v-focus type="text" v-model="name" placeholder="请输入名字" style="border:0; font-size:16px;line-height: 1.15" class="create-input" @focus="focus" @keyup="show" @blur="blur">
          <p style="" :class="{'active': active}"></p>
        </div>
      </div>
      <!-- comfrim -->
      <div class="dialog_body-choose">
        <!-- <div class="confirm"  @click="yes">确定</div>
        <div class="cancle"  @click="popClose">取消</div> -->
        <button class="c-button c-button__default" @click="popClose">取消</button>
        <button class="c-button c-button__primary" @click="yes">确定</button>
      </div>
      <!-- close btn-->
      <!-- <div class="dialog_body-close" @click="popClose">
        <Icon type="close-round"></Icon>
      </div> -->
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'create',
  data () {
    return {
      popOff: true,
      active: false,
      name: ''
    }
  },
  methods: {
    show (e) {
      if (e.keyCode === 13) {
        this.yes()
      }
    },
    yes: function () {
      let FolderIndex = JSON.parse(localStorage.getItem('FolderJsonOnce'))
      if (this.$store.state.folderEditType !== 2) {
        this.$Message.error('权限不足')
      } else if (!this.$data.name) {
        this.$Message.error('请输入文件夹名字')
      } else {
        this.$http.post('index2/file/create', {
          company_id: this.$store.state.userInfo.company_id,
          user_id: this.$store.state.userInfo.id,
          dir_name: this.$data.name,
          dir_id: FolderIndex
        }).then(res => {
          if (res.data.code === 200) {
            this.$Message.success('创建文件夹成功')
            this.$store.dispatch('isRouterReload', true)
          } else {
            this.$Message.error(res.data.message)
          }
          // 删除模态框
          this.$store.dispatch('createTo', false)
        })
      }
    },
    focus: function () {
      this.active = true
    },
    blur: function () {
      this.active = false
    },
    popClose: function () {
      this.$store.dispatch('createTo', false)
      document.body.removeAttribute('class', 'bodyOf Pdd')
    }
  }
}
</script>

<style lang="scss" scoped>
.create-input:focus {
  outline-style: none;
}
.dialog_container {
  display: block;
  width: 100%;
  width: 100vw;
  height: 100%;
  height: 100vh;
  background-color: rgba(24,82,94,.7);
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  .dialog_box {
    display: inline-block;
    text-align: left;
    vertical-align: middle;
    position: relative;
    width: 30%;
    max-width: 478px;
    min-width: 293px;
    overflow: hidden;
    border-radius: 4px;
    // box-shadow: 0 7px 8px -4px rgba(0,0,0,.2), 0 13px 19px 2px rgba(0,0,0,.14), 0 5px 24px 4px rgba(0,0,0,.12);
    box-shadow: 0 1px 3px 0 rgba(204,204,204,0.3);
    .dialog_body {
      position: relative;
      background-color: #fff;
      .dialog_body-choose {
        // display: flex;
        // flex-direction: row-reverse;
        // justify-content: flex-start;
        // align-items: center;
        width:100%;
        padding:26px 18px 32px;
        text-align: center;
        // .confirm {
        //   padding:10px 40px;
        //   background: rgb(0, 161, 255);
        //   color:#fff;
        //   margin-left:20px;
        //   cursor: pointer;
        // }
        // .cancle {
        //   padding:10px 40px;
        //   background: #E7E7E8;
        //   color:#6A6D70;
        //   cursor: pointer;
        // }
      }
      .dialog_content {
        width: 100%;
        background: #fff;
        padding:15px 17px;
        box-sizing: border-box;
        .dialog_body-title {
          width:100%;
          height:auto;
          margin-top: 40px;
          text-align: center;
          box-sizing: border-box;
          font-weight: normal;
          font-size:35px;
          color:#333333;
        }
        .dialog_body-detail {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding:40px 0 0;
          span {
            font-size:16px;
            color:#737373;
            padding-bottom:20px;
          }
          p {
            font-size:14px;
            color: #a9a9a9;
            line-height: 18px;
            transition: all .3s ease;
            height:1px;
            background:#ddd;
            margin-top:5px;
            &.active {
              background: rgb(0, 161, 255) !important;
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
