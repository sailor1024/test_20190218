<style lang="scss" scoped>
//字体
$ff:"PingFangSC";
.plan{
  max-width:1540px;
  min-height:935px;
}
.plan-detail{
  margin-left:67px;
  margin-top:7px;
  // display:flex;
}
</style>

<template>
  <div class="plan">
    <buy-comp></buy-comp>
    <div class="plan-detail">
      <img-comp></img-comp>
      <fifth-page></fifth-page>
    </div>
  </div>
</template>

<script>
import buyComp from './commonComp/buyComp'
import imgComp from './commonComp/imgComp'
import fifthPage from './fifthPageComp/fifthPageDesc'
export default {
  name: 'planAndDownload',
  components: {
    buyComp,
    imgComp,
    fifthPage
  }
}
</script>
