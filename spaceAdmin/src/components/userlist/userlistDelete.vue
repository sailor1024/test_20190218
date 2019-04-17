<template>
  <kangyun-modal
    @closeModal="popClose"
    @confirm="confirm"
    isShowWarn>
    <template slot="title">
      删除合作者
    </template>
    <template slot="detail">
      <p>确定删除合作者{{this.$store.state.deleteCollaboratorMsg.lastname}}{{this.$store.state.deleteCollaboratorMsg.firstname}}？</p>
    </template>
  </kangyun-modal>
</template>
<script>
import kangyunModal from '@/components/common/modal/kangyunModal'
export default {
  name: 'deleteUser',
  methods: {
    confirm: function () {
      this.$http.post('index2/user/remove_user', {
        // 传递userid
        'id': this.$store.state.deleteCollaboratorMsg.id
      }).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success('删除成功')
          this.popClose()
          // 路由跳转
          this.$store.dispatch('isRouterReload', true)
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    popClose: function () {
      this.$store.dispatch('deleteCollaborator', false)
    }
  },
  components: {
    kangyunModal
  }
}
</script>

<style lang="scss" scoped>
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
    border: 1px solid #ccc;
    text-align: left;
    vertical-align: middle;
    box-shadow: 0 7px 8px -4px rgba(0,0,0,.2), 0 13px 19px 2px rgba(0,0,0,.14), 0 5px 24px 4px rgba(0,0,0,.12);
    position: relative;
    .dialog_body {
      position: relative;
      width:18.1vw;
      min-width:258px;
      background-color: #fff;
      .dialog_body-choose {
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-start;
        align-items: center;
        width:100%;
        border-top:1px solid #e0e0e0;
        padding:20px 40px;
        button {
          padding:10px 30px;
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
        box-sizing: border-box;
        .dialog_body-title {
          width:100%;
          height:auto;
          padding:15px;
          box-sizing: border-box;
          font-size:24px;
          color:#274A4B
        }
        .dialog_body-detail {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding:30px 0;
          span {
            font-size:16px;
            color:#737373;
            padding-bottom:20px;
          }
          p {
            font-size:14px;
            color: #a9a9a9;
            line-height: 18px;
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
