<template>
  <div id="userlistTabs">
    <!-- <Tabs class="userTabs" @on-click="click" :value="key">
        <Tab-pane label="活跃账户" key="0" name="0"></Tab-pane>
        <Tab-pane label="未激活" key="1" name="1"></Tab-pane>
        <Tab-pane label="已删除" key="2" name="2"></Tab-pane>
    </Tabs> -->
    <div class="left">
      <button
        @click="click(0)"
        class="c-button c-button__primary--radius"
        :class="key === 0 ? '' : 'c-button--text'">活跃账户</button>
      <button
        @click="click(1)"
        class="c-button c-button__primary--radius"
        :class="key === 1 ? '' : 'c-button--text'">未激活</button>
      <button
        @click="click(2)"
        class="c-button c-button__primary--radius"
        :class="key === 2 ? '' : 'c-button--text'">已删除</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      key: 0
    }
  },
  created () {
    let key = sessionStorage.getItem('key')
    this.$data.key = parseInt(key) || 0
  },
  methods: {
    click: function (data) {
      this.$data.key = parseInt(data)
      sessionStorage.setItem('key', data)
      this.$store.dispatch('userTabs', data)
    }
  }
}
</script>
<style lang="scss">
// #userlistTabs {
//   .userTabs {
//     .ivu-tabs-bar {
//       margin-bottom:0;
//     }
//     .ivu-tabs-tab {
//       font-size: 16px;
//       font-family: PingFangSC-Regular;
//       color: #0f2d3e;
//       font-weight: bold;
//     }
//     .ivu-tabs-nav .ivu-tabs-tab:hover {
//       color: #57a3f3;
//     }
//     .ivu-tabs-nav .ivu-tabs-tab-active {
//       color: #2d8cf0;
//     }
//   }
// }
</style>
<style lang="scss" scoped>
// #userlistTabs {
//   padding-top:10px;
//   width:100%;
//   .userTabs {
//     background: white;
//     .ivu-tabs-bar {
//       margin-bottom:0;
//     }
//   }
// }
// /deep/ .ivu-tabs-nav-container {
//   line-height: 2;
// }
.left {
  margin-top: 37px;
  margin-left: 36px;
}
</style>
