<style lang="scss">
.itemList-page{
  margin-top:13px;
  text-align:center;
  position:relative;
  .ivu-page-item{
    font-size:18px;
    font-family:Helvetica;
    border-radius:0;
    width:38px;
    height:38px;
    line-height:38px;
    border:none;
    background:#fff;
    color:#000;
  }
  .ivu-page-item-jump-next, .ivu-page-item-jump-prev, .ivu-page-next, .ivu-page-prev{
    font-size:18px;
    font-family:Helvetica;
    border-radius:0;
    width:38px;
    height:38px;
    line-height:38px;
    border:none;
    background:#fff;
    color:#000;
  }
  .ivu-page-item-active{
    background:#00A1FF;
  }
  .ivu-page-next a, .ivu-page-prev a{
    color:#000;
  }
}
</style>

<template>
  <div class="itemList-page">
    <Page v-if="current" :page-size="pageSize" @on-change="pagechange" :current="current" :total="allcount" style="margin:0 auto;"></Page>
    <Page v-else @on-change="pagechange" :page-size="pageSize" :current="current" :total="allcount" style="margin:0 auto;"></Page>
    <i class="font_family icon-icon-test7" style="color:#ADACA7;font-size:18px;position:absolute;top:0;right:14px;cursor:pointer"></i>
  </div>
</template>

<script>
export default {
  props: ['count', 'current', 'pageSize'],
  methods: {
    pagechange (page) {
      this.$emit('pagechange', page)
    }
  },
  computed: {
    allcount () {
      if (this.count) {
        return this.count
      } else {
        return 10
      }
    }
  }
}
</script>
