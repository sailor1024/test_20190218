<style lang="scss" scoped>
//字体
$ff:"PingFangSC";
.plan{
  max-width:1540px;
  min-height:935px;
  // font-family:$ff;
}
.plan-detail{
  margin-top:7px;
  margin-left: 67px;
}
</style>

<template>
  <div class="plan">
    <buy-comp></buy-comp>
    <div class="plan-detail">
      <img-comp></img-comp>
      <sixth-page></sixth-page>
    </div>
  </div>
</template>

<script>
import buyComp from './commonComp/buyComp'
import imgComp from './commonComp/imgComp'
import sixthPage from './sixthPageComp/sixthPageDesc'
export default {
  name: 'planAndDownload',
  components: {
    buyComp,
    imgComp,
    sixthPage
  }
}
</script>
