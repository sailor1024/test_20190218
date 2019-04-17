<template>
  <kangyun-modal
    @closeModal="popClose"
    @confirm="confirm"
    submitText="确认">
      <template slot="title">
        <template v-if="shareShow === 0">公开展示</template>
        <template>仅自己可以看</template>
      </template>
      <template slot="detail">
        <!-- <span>{{giveData.title}}</span> -->
        <p style="padding: 0 60px 0 45px;" v-if="shareShow === 0">{{giveData.title}}为了让其他人查看你的空间，我们将公开您的空间</p>
        <p style="padding: 0 60px 0 45px;" v-else>{{giveData.title}}此空间仅供您和您的协作者使用。任何链接或嵌入的空间将不再有效。</p>
      </template>
  </kangyun-modal>
</template>

<script>
import kangyunModal from '@/components/common/modal/kangyunModal'
export default {
  name: 'pop',
  props: ['giveData', 'shareShow'],
  methods: {
    confirm: function () {
      // if (!this.shareShow) {
      //   this.$http.post('index/index/editisshow', {
      //     // 传递项目id
      //     'id': this.giveData.id
      //   }).then((res) => {
      //     // 提示公开成功
      //     if (res.data.data.code) {
      //       this.$store.dispatch('shareShowChange', 1)
      //       this.$Message.success('公开成功')
      //       this.$store.dispatch('isRouterReload', true)
      //       this.popClose()
      //     } else {
      //       this.$store.dispatch('shareShowChange', 0)
      //       this.$Message.error('公开失败')
      //     }
      //   })
      // } else {
      //   // 项目私密
      //   this.$http.post('index/index/isofficabmap', {
      //     'id': this.giveData.id
      //   }).then((res) => {
      //     this.$store.dispatch('shareShowChange', 0)
      //     this.$store.dispatch('publicProject', true)
      //     this.$store.dispatch('isRouterReload', true)
      //     this.$Message.success('空间私密成功')
      //     this.popClose()
      //   })
      // }
      const shareShow = this.shareShow ? 0 : 1
      this.$http.post('/index2/items/edit_isshow', {
        id: this.giveData.id,
        isshow_offica: shareShow // 是否在官网显示，0不显示，1显示
      }).then(res => {
        if (res.data.code === 200) {
          this.$store.dispatch('shareShowChange', shareShow)
          if (shareShow === 1) {
            this.$Message.success('公开成功')
          } else {
            this.$Message.success('空间私密成功')
          }
          this.$store.dispatch('isRouterReload', true)
          this.popClose()
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    popClose: function () {
      this.$store.dispatch('popTo', false)
      this.$emit('clickNone', false)
    }
  },
  components: {
    kangyunModal
  }
}
</script>

<style lang="scss">
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
//     display: inline-block;
//     border: 1px solid #ccc;
//     text-align: left;
//     vertical-align: middle;
//     box-shadow: 0 7px 8px -4px rgba(0,0,0,.2), 0 13px 19px 2px rgba(0,0,0,.14), 0 5px 24px 4px rgba(0,0,0,.12);
//     position: relative;
//     .dialog_body {
//       position: relative;
//       width:18.1vw;
//       min-width:258px;
//       background-color: #fff;
//       .dialog_body-choose {
//         display: flex;
//         flex-direction: row-reverse;
//         justify-content: flex-start;
//         align-items: center;
//         width:100%;
//         border-top:1px solid #e0e0e0;
//         padding:20px 40px;
//         button {
//           padding:10px 30px;
//           color:#fff;
//           background: #2d8cf0;
//           border-radius: 0;
//         }
//         button+button {
//           margin-right:20px;
//           background: #B3B4B6;
//           color:#fff;
//         }
//       }
//       .dialog_content {
//         width: 100%;
//         background: #fff;
//         padding:15px;
//         box-sizing: border-box;
//         .dialog_body-title {
//           width:100%;
//           height:auto;
//           padding:15px;
//           box-sizing: border-box;
//           font-size:24px;
//           color:#274A4B
//         }
//         .dialog_body-detail {
//           display: flex;
//           flex-direction: column;
//           justify-content: space-between;
//           padding:30px 0;
//           span {
//             font-size:16px;
//             color:#737373;
//             padding-bottom:20px;
//           }
//           p {
//             font-size:14px;
//             color: #a9a9a9;
//             line-height: 18px;
//           }
//         }
//       }
//       .dialog_body-close {
//         position: absolute;
//         top:15px;
//         right:15px;
//         color:#274A4B;
//         cursor:pointer;
//       }
//     }
//   }
// }
// .dialog_container:after {
//   display: inline-block;
//   content: '';
//   width: 0;
//   height: 100%;
//   vertical-align: middle;
// }
</style>
