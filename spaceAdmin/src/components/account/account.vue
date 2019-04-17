<style lang="scss">
//  用户登陆页容器
.account{
   min-height:100vh;
   background:#fff;
   display:flex;
   flex-direction:column;
   justify-content: center;
   .loginBox{
    float: left;
    background:#fff;
    min-height:500px;
    // margin:0 auto;
    // border-radius: 8px;
    padding:60px 40px 0;
    box-shadow:0px 0px 0px 0px rgba(155,155,155,.4);
    //  logo样式
    .logo-login{
      img{
        height:24px;
      }
    }
    @media(max-width:600px){
      width:100%;
      min-width:332px;
      display:block;
    }
    @media(min-width:601px){
      width:450px;
      box-shadow:1px 1px 2px 1px rgba(155,155,155,.4);
    }
    //覆盖目录下框架表单样式
    .ivu-input{
      border:1px solid transparent;
      border-bottom-color:#999;
      border-radius:0;
      background:transparent;
      color:#626262;
      font-size:14px;
      transition:all .3s cubic-bezier(.55,0,.55,.2);
      height:auto;
      padding:0;
      margin-top:5px;
      margin-bottom:5px;
    }
    .ivu-input:focus{
      box-shadow: 0 0 0 0 ;
    }
    //覆盖目录下按钮样式
    .ivu-btn-primary{
      background-color:#00a1ff;
      border-color:#00a1ff;
    }
    .ivu-checkbox-checked .ivu-checkbox-inner{
      background-color:#00a1ff;
      border-color:#00a1ff;
    }
    //覆盖目录下a样式
    a{
      color:#00a1ff;
    }
  }
  .account-form{
    margin-bottom:16px;
  }
}
.account {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  transition: background-image 1s ease-in-out;

  &.white {
    background-image: url('~@/assets/images/white.png');
  }

  &.night {
    background-image: url('~@/assets/images/night.png');
  }

  &.dusk {
    background-image: url('~@/assets/images/dusk.png');
  }

  .company-logo {
    position: absolute;
    top: 20px;
    left: 21px;
    img {
      width: 169px;
    }
  }

  .account-center__container {
    display: flex;
    margin: 0 auto;

    .logo-text {
      float: left;
      font-size: 72px;
      color: #fff;
      font-weight: normal;
      margin-right: 200px;
      align-self: center;
      >div {
        max-width: 683px;
        width: 35.5vw;
      }
      img {
        display: inline-block;
        width: 100%;
      }
      @media screen and (max-width: 1310px) {
        display: none;
      }
    }
  }

  .copyright {
    position: absolute;
    width: 100%;
    bottom: 31px;
    opacity: .8;

    p {
      text-align: center;
      color: #fff;
      font-size: 12px;
    }
  }
}
</style>

<template>
  <div class="account" :class="bkObject">
    <div class="company-logo">
      <img v-if="when==='white'" src="@/assets/images/account_logo_2.png" alt="logo">
      <img v-else src="@/assets/images/account_logo_1.png" alt="logo">
    </div>
    <div class="account-center__container">
      <div class="logo-text">
        <div>
          <img src="@/assets/images/text_img.png" alt="">
        </div>
      </div>
      <div class="loginBox">
        <!-- logo -->
        <div class="logo-login">
          <img src="@/assets/images/kangyun.png" alt="">
        </div>
        <router-view></router-view>
      </div>
    </div>
    <div class="copyright">
      <p>©2017 Light＆Magic Technologies Ltd.保留所有权利。</p>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    bkObject () {
      return {
        white: this.when === 'white',
        night: this.when === 'night',
        dusk: this.when === 'dusk'
      }
    }
  },
  data () {
    return {
      when: null
    }
  },
  mounted () {
    const _this = this
    ;(function () {
      function getAlwaysHours () {
        const hours = new Date().getHours()
        if (hours >= 6 && hours < 17) {
          _this.when = 'white'
        } else if (hours >= 19 || hours < 6) {
          _this.when = 'night'
        } else {
          _this.when = 'dusk'
        }
      }
      setInterval(getAlwaysHours, 2000)
      getAlwaysHours()
    })()
  }
}
</script>
