<template>
<div
  class="dialog_container"
  tabindex="-1"
  @keyup.esc="popClose"
  :class="{'dialog_container--pointer': maskClosable}"
  @click.self="mask">
  <div v-focus class="dialog_box">
    <div class="dialog_body"
      :class="[className]"
      :style="[modalWidth ? {width: modalWidth + 'px'} : '', styleObject]">
      <slot>
        <div class="dialog_content">
          <img v-if="isShowWarn" class="warn-img" :src="warnImg" alt="">
          <!-- title -->
          <h3
            :class="{'dialog_body-title--lg': !isShowWarn}"
            class="dialog_body-title">
            <slot name="title"></slot>
          </h3>
          <!-- detail -->
          <div class="dialog_body-detail">
            <slot name="detail"></slot>
          </div>
        </div>
        <!-- comfrim -->
        <div
          :class="{'dialog_body-choose--lg': !isShowWarn}"
          class="dialog_body-choose">
          <slot name="confirm">
            <button class="c-button c-button__default" @click="popClose">{{cancelText}}</button>
            <button class="c-button c-button__primary" @click="confirm">{{submitText}}</button>
          </slot>
        </div>
      </slot>
      <!-- close btn-->
      <div v-if="isShowCloseBtn" class="dialog_body-close"  @click="popClose">
        <Icon type="close-round"></Icon>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import warnImg from '@/assets/images/warn.png'

export default {
  props: {
    isShowWarn: {
      type: Boolean,
      default: false
    },
    submitText: {
      type: [String, Number],
      default: '是的，删除它！'
    },
    cancelText: {
      type: [String, Number],
      default: '取消'
    },
    modalWidth: {
      type: Number
    },
    classPrefix: {
      type: String,
      default: ''
    },
    styleObject: {
      type: [Function, Object],
      default: () => ({})
    },
    isShowCloseBtn: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    className () {
      return this.classPrefix ? `${this.classPrefix}-dialog_body` : ''
    }
  },
  methods: {
    popClose () {
      this.$emit('closeModal', false)
    },
    confirm () {
      this.$emit('confirm')
    },
    mask () {
      if (this.maskClosable) {
        this.popClose()
      }
    }
  },
  data: () => ({
    warnImg
  })
}
</script>
<style lang="scss" scoped>
.dialog_body-title--lg {
  padding-top: 17px;
}
.dialog_body-choose--lg {
  margin-top: 45px !important;
}
.dialog_container {
  cursor: default;
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
  z-index: 1070;
  &.dialog_container--pointer {
    cursor: pointer;
  }
  .dialog_box {
    cursor: default;
    display: inline-block;
    text-align: left;
    vertical-align: middle;
    position: relative;
  }
  .dialog_body {
    position: relative;
    width: 478px;
    min-width:258px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid transparent;
    // padding: 37px 0 33px 0;
    .dialog_body-choose {
      margin-top: 28px;
      text-align: center;
      margin-bottom: 32px;
    }
    .dialog_content {
      margin: 37px 0 33px 0;
      width: 100%;
      box-sizing: border-box;
      .dialog_body-title {
        width:100%;
        text-align: center;
        height:auto;
        box-sizing: border-box;
        font-size:36px;
        color:#333333;
        font-weight: normal;
        margin-top: 38px;
      }
      .dialog_body-detail {
        text-align: center;
        padding-top: 43px;
        span {
          font-size:16px;
          color:#737373;
          padding-bottom:20px;
        }
        p {
          font-size:14px;
          line-height: 1.5;
          color: #666666;
        }
      }
    }
    .dialog_body-close {
      position: absolute;
      top:25px;
      right:25px;
      color:#274A4B;
      cursor:pointer;
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

.warn-img {
  display: block;
  width: 88px;
  margin: 0 auto;
}
</style>
