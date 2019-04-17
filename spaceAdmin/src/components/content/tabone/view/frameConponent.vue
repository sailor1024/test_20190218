<template>
  <div class="box" v-if="!isResetRender">
    <iframe
      v-show="isPlay"
      id="iframe"></iframe>
    <div class="box-mask" v-if="!isPlay">
      <div class="box-mask__body">
        <div class="box-mask__name">
          <p v-if="!isShowLoading">{{$store.state.json.title}}</p>
        </div>
        <div class="box-mask__img">
          <div v-if="isShowLoading" class="loading"></div>
          <img
            v-if="!isShowLoading"
            @click="showIframe"
            class="box-mask__play"
            :src="img"
            alt="播放按钮">
          <p v-if="!isShowLoading" class="box-mask__img--text"><span>探索3D空间</span></p>
        </div>
        <div class="box-mask__logo" v-if="!isShowLoading">
          <img :src="logo" alt="logo">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import img from '@/assets/images/iframe-play.png'
import logo from '@/assets/images/logo.png'
export default {
  name: 'frameConponent',
  props: ['htmlsrc'],
  data: () => ({
    img,
    logo,
    isPlay: false,
    isShowLoading: false
  }),
  computed: {
    isResetRender () {
      return this.$store.state.isResetIframCom
    }
  },
  watch: {
    isResetRender (newValue) {
      if (newValue === true) {
        this.isPlay = false
        this.isShowLoading = false
        setTimeout(() => {
          this.$store.dispatch('resetiFramPage', false)
        }, 50)
      }
    }
  },
  methods: {
    showIframe () {
      this.isShowLoading = true
      const _this = this
      const iframe = document.getElementById('iframe')
      iframe.src = this.htmlsrc + '&_=' + _this.$store.state.userInfo.token
      iframe.onload = function () {
        _this.isPlay = true
        _this.isShowLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box{
  position: relative;
  padding: 32px 12px 32px 14px !important;
  iframe{
    width: 100%;
    height: 100%;
  }
  .box-mask {
    position: relative;
    width: 100%;
    height: 100%;

    .box-mask__body {
      position: absolute;
      display: table;
      width: 100%;
      height: 100%;
      background: #222;
    }
    .box-mask__img {
      display: table-cell;
      vertical-align: middle;
      .box-mask__img--text {
        font-size: 24px;
        color: #fff;
        text-align: center;
        margin-top: 26px;
      }
      .box-mask__play {
        display: block;
        width: 90px;
        height: auto;
        margin: 0 auto;
        cursor: pointer;
      }
    }
    .box-mask__name {
      position: absolute;
      width: 100%;
      top: 100px;
      left: 0px;
      text-align: center;
      color: #fff;
      font-size: 30px;
    }
    .box-mask__logo {
      position: absolute;
      width: 100%;
      bottom: 50px;
      left: 0px;
      text-align: center;
      img {
        width: 165px;
        max-width: 258px;
        min-width: 150px;
      }
    }
  }
  .loading, .loading::before, .loading::after {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-left-color: rgba(255, 255, 255, 0.4);
    border-radius: 999px;
  }
  .loading {
    position: relative;
    width: 50px;
    height: 50px;
    margin: 0 auto;
    animation: animation-rotate 1000ms linear infinite;
  }
  .loading::before {
    position: absolute;
    display: inline-block;
    content: '';
    height: 44px;
    left: 2px;
    top: 2px;
    width: 44px;
    animation: animation-rotate 1000ms linear infinite;
  }
  .loading::after {
    position: absolute;
    display: inline-block;
    content: "";
    height: 56px;
    top: -4px;
    left: -4px;
    width: 56px;
    animation: animation-rotate 2000ms linear infinite;
  }

  @keyframes animation-rotate {
    100% {
        transform: rotate(360deg);
    }
  }
}

</style>
