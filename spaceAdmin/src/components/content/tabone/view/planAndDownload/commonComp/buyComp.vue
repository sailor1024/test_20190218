<style lang="scss">
$btn-color:#00A1FF;
$ff:".PingFang-SC";
  .plan-buy{
    text-align: right;
    padding-right:14px;
    @media(max-width:992px){
      padding-right:3%;
    }
    //框架组件按钮样式
    .ivu-btn-primary{
      background:$btn-color;
      border-color:$btn-color;
    }
    .plan-buy-btnText{
      // font-family: $ff;
      font-size:14px;
    }
  }
</style>

<template>
  <div class="plan-buy">
    <!-- <i-button type="primary" shape="circle" style="width:100px" size="large">
      <span class="plan-buy-btnText">购买</span>
    </i-button> -->
    <button class="c-button c-button__primary--radius">购买</button>
  </div>
</template>

<script>
export default {
}
</script>
