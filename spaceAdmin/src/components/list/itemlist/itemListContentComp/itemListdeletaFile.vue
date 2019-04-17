<template>
<kangyun-modal
  isShowWarn
  @confirm="confirm"
  @closeModal="popClose">
  <template slot="title">删除空间</template>
  <template slot="detail">
    <span style="padding: 0 20px; display:inline-block;">{{showDeleteFileMsg.title}}创立于{{showDeleteFileMsg.create_time | desbute}}{{showDeleteFileMsg.niname}}</span>
  </template>
</kangyun-modal>
</template>

<script>
import kangyunModal from '@/components/common/modal/kangyunModal'
export default {
  name: 'deleteFile',
  props: ['showDeleteFileMsg'],
  created () {
    // document.body.setAttribute('class', 'bodyOf Pdd')
  },
  components: {kangyunModal},
  filters: {
    desbute (val) {
      let arr = new Date(val)
      let time
      time = arr.getFullYear() + '年' + (arr.getMonth() + 1) + '月' + arr.getDate() + '日'
      return time
    }
  },
  methods: {
    keyCodeCon (e) {
      if (e.keyCode === 13) {
        this.confirm()
      }
    },
    confirm: function () {
      this.$http.post('index2/items/deteledir_project', {
        // 传递项目id
        'id': this.showDeleteFileMsg.id
      }).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success('删除成功')
          this.popClose()
          this.$store.dispatch('isRouterReload', true)
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    popClose: function () {
      this.$store.dispatch('deleteFileSpace', false)
      // document.body.removeAttribute('class', 'bodyOf Pdd')
    }
  }
}
</script>

<style lang="scss" scoped>
// .dialog_container {
//   display: block;
//   width: 100%;
//   width: 100vw;
//   height: 100%;
//   height: 100vh;
//   background-color: rgba(24,82,94,.7);
//   text-align: center;
//   position: fixed;
//   top: 0;
//   left: 0;
//   z-index: 10;
//   .dialog_box {
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
//               display: inline-block;
//               font-size:16px;
//               color:#737373;
//               padding: 0 20px 20px;
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
// }
// .dialog_container:after {
//   display: inline-block;
//   content: '';
//   width: 0;
//   height: 100%;
//   vertical-align: middle;
// }
// .warn-img {
//   display: block;
//   width: 88px;
//   margin: 0 auto;
// }
</style>
