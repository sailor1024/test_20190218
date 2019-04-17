<template>
<kangyun-modal
  :modalWidth="json[0].width"
  @closeModal="popClose">
  <template slot="title"><span :style="{'font-size': json[0].fontS}">{{json[0].title}}</span></template>
  <template slot="detail"><p style="padding: 0 78px;">{{json[0].msg}}</p></template>
  <template slot="confirm">
    <button class="c-button c-button__primary" @click="popClose">知道了</button>
  </template>
</kangyun-modal>
</template>

<script>
import kangyunModal from '@/components/common/modal/kangyunModal'
export default {
  name: 'pop',
  props: ['json'],
  components: {kangyunModal},
  created () {
    // document.body.setAttribute('class', 'bodyOf')
  },
  methods: {
    popClose: function (e) {
      this.$store.dispatch('stainumTo', false)
      // document.body.removeAttribute('class', 'bodyOf')
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
//               font-size:16px;
//               color:#737373;
//               padding-bottom:20px;
//             }
//             p {
//               font-size:14px;
//               padding: 0 80px;
//               line-height: 1.15;
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
</style>
