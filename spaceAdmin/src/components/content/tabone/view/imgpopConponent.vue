<template>
<kangyun-modal
  isShowWarn
  @confirm="popIt"
  @closeModal="popCancel"
  submitText="确认">
  <template slot="title">删除图片</template>
  <template slot="detail">您确定要删除图片吗？</template>
</kangyun-modal>
</template>

<script>
import kangyunModal from '@/components/common/modal/kangyunModal'
export default {
  props: ['list', 'imgData', 'srcList'],
  name: 'imgpop',
  components: {
    kangyunModal
  },
  // props: ['giveData', 'shareShow'],
  created () {
    document.body.setAttribute('class', 'bodyOf Pdd')
  },
  methods: {
    popCancel () {
      this.$emit('clickCancel')
    },
    popIt () {
      let pictrueSrc
      // 判断是否多图删除
      if (this.srcList !== undefined) {
        pictrueSrc = []
        this.srcList.forEach(element => {
          pictrueSrc.push(element.src)
        })
        // pictrueSrc = JSON.stringify(pictrueSrc)
      } else {
        pictrueSrc = this.imgData
      }
      // 删除图片
      this.$http.post('index2/items/deletecutpic', {
        'id': JSON.stringify(pictrueSrc),
        path: this.$store.state.json.dirname
      }).then((res) => {
        if (this.srcList !== undefined) {
          this.$emit('clickConfirm')
        } else {
          this.$emit('clickOneConfirm')
        }
        this.$store.dispatch('popTo', false)
      })
    },
    popClose: function () {
      this.$store.dispatch('popTo', false)
      this.$emit('clickNone', false)
      document.body.removeAttribute('class', 'bodyOf Pdd')
    }
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
