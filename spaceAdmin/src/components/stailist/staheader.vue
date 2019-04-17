<template>
  <header>
    <h4 class="title">各类数据统计</h4>
    <p class="updatetime">数据实时更新 - 最新更新日期：{{timestr}}</p>
    <!-- <p class="updatedesc">数据实时更新</p> -->
  </header>
</template>

<script>
export default {
  name: 'staheader',
  computed: {
    timestr () {
      let date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let d = date.getDate()
      return y + '年' + m + '月' + d + '日'
    }
  }
}
</script>

<style lang="scss" scoped>
header{
  .title{
    font-size:26px;
    color:#333333;
    line-height:1.5;
    margin-top: 29px;
  }
  .updatetime{
    height:17px;
    margin-top: 19px;
    font-size:14px;
    color:rgba(98,98,98,1);
    line-height:17px;
  }
  .updatedesc{
    height:17px;
    font-size:12px;
    color:rgba(98,98,98,1);
    line-height:17px;
    margin-top: 2px;
  }
}
</style>
