<template>
  <div class="userMsg">
    <div class="container">
      <i class="userMsg-avatar" :style="userInfoAvatar"></i>
      <p v-for="(item, index) in list"
        v-if="!item.isLimit || item.isLimit && $store.state.userInfo.user_type !== 3"
        :key="index" @click="change(index)" :class="[active === index ? 'active' : '']">{{item.name}}</p>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      active: 0,
      list: [{
        name: '用户资料',
        isLimit: false
      }, {
        name: '隐私',
        isLimit: false
      }, {
        name: '组织信息',
        isLimit: true
      }, {
        name: '空间设置',
        isLimit: false
      }]
    }
  },
  methods: {
    change: function (index) {
      this.$store.dispatch('settingChange', index)
      this.active = index
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    },
    userInfoAvatar () {
      if (!this.userInfo.head_photo_url) return ''
      return {'background-image': `url(${this.$store.state.userInfo.head_photo_url})`}
    }
  }
}
</script>
<style scoped lang="scss">
.userMsg {
  .container {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    background: #fff;
    padding-bottom: 57px;
    box-shadow: 0 4px 10px rgba(0,0,0,.1);
    & p:last-child {
      border:0
    }
    p {
      padding: 20px 58px 20px 60px;
      font-size: 18px;
      color: #333333;
      font-weight: bold;
      cursor: pointer;
      border-right: 2px solid transparent;
      &.active {
        border-right: 2px solid #00A1FF;
        color:rgb(0, 161, 255);
      }
    }
    p {
      // border-bottom: 1px solid #F1F1F1;
    }
  }
  .userMsg-avatar {
    display: inline-block;
    margin: 0 auto 20px;
    width: 90px;
    height: 90px;
    border-radius: 45px;
    box-shadow: 0 6px 18px 0 rgba(0,0,0,.3);
    background-size: cover;
    background-position: center;
  }
}
</style>
