<template>
  <kangyun-modal
    isShowWarn
    @confirm="confirm"
    @closeModal="popClose">
    <template slot="title">确定删除{{deletaFolderMsg.dir_name}}？</template>
    <template slot="detail"><p style="padding: 0 78px;">你将无法恢复这个文件夹及其所有内容！</p></template>
  </kangyun-modal>
</template>
<script>
import kangyunModal from '@/components/common/modal/kangyunModal'
export default {
  data () {
    return {
      deleteFolderIf: false,
      deletaFolderMsg: [],
      json: {}
    }
  },
  components: {kangyunModal},
  created () {
    this.json = this.$store.state.deleteFolderMsg
    this.deletaFolderMsg = this.json
  },
  methods: {
    confirm () {
      // this.$http.post('index/file/newdeletedir', {
      //   // 传递删除的项目id:
      //   dirid: this.deletaFolderMsg.id,
      //   pid: this.$route.params.id
      // }).then((res) => {
      //   this.$Message.success('删除成功')
      //   this.popClose()
      //   // 路由刷新
      //   this.$store.dispatch('isRouterReload', true)
      //   // 显示结束
      //   this.$store.dispatch('deleteFolder', false)
      // })
      this.$http.post('index2/file/delete_dir', {
        id: this.json.id
      }).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('删除成功')
          this.popClose()
          // 路由刷新
          this.$store.dispatch('isRouterReload', true)
          // 显示结束
          this.$store.dispatch('deleteFolder', false)
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    popClose () {
      this.$store.dispatch('deleteFolderIf', false)
    }
  }
}
</script>
<style lang="scss" scoped>
// .deletaFolderConfirm {
//   .dialog_container {
//     display: block;
//     width: 100%;
//     width: 100vw;
//     height: 100%;
//     height: 100vh;
//     background-color: rgba(24,82,94,.7);
//     text-align: center;
//     position: fixed;
//     top: 0;
//     left: 0;
//     z-index: 10;
//     .dialog_box {
//       display: inline-block;
//       text-align: left;
//       vertical-align: middle;
//       position: relative;
//       .dialog_body {
//         position: relative;
//         width: 478px;
//         min-width:258px;
//         background-color: #fff;
//         border-radius: 4px;
//         padding: 37px 0 33px 0;
//         .dialog_body-choose {
//           margin-top: 28px;
//           text-align: center;
//         }
//         .dialog_content {
//           width: 100%;
//           box-sizing: border-box;
//           .dialog_body-title {
//             width:100%;
//             text-align: center;
//             height:auto;
//             box-sizing: border-box;
//             font-size:36px;
//             color:#333333;
//             font-weight: normal;
//             margin-top: 38px;
//           }
//           .dialog_body-detail {
//             text-align: center;
//             padding-top: 43px;
//             span {
//               font-size:16px;
//               color:#737373;
//               padding-bottom:20px;
//             }
//             p {
//               font-size:14px;
//               color: #666666;
//             }
//           }
//         }
//         .dialog_body-close {
//           position: absolute;
//           top:15px;
//           right:15px;
//           color:#274A4B;
//           cursor:pointer;
//         }
//       }
//     }
//   }
//   .dialog_container:after {
//     display: inline-block;
//     content: '';
//     width: 0;
//     height: 100%;
//     vertical-align: middle;
//   }
// }
// .warn-img {
//   display: block;
//   width: 88px;
//   margin: 0 auto;
// }
</style>
