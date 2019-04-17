<style lang="scss">
$theme-color:#00A1FF;
.plan-download{
  display: inline-block;
  vertical-align: top;
  width: 224px;
  max-width:302px;
  margin-right: 212px;
  margin-bottom: 80px;
  // @media(max-width:992px){
  //   margin-left:3%;
  // }
  //样本示意图
  .plan-download-img{
    width:100%;
    max-height:227px;
    >img{
    }
  }
  //样本示意图下载
  .plan-download-link{
    text-align: center;
    margin-top:15px;
    height:15px;
    line-height:15px;
    cursor:pointer;
    >.plan-down-link-text{
      font-size:12px;
      color:$theme-color;
    }
    >i{
      font-size:15px;
      color:$theme-color;
    }
  }
}
</style>

<template>
  <div class="plan-download">
    <div class="plan-download-img">
      <img src="@/assets/images/example.png" alt="">
    </div>
    <div class="plan-download-link">
      <i class="font_family icon-icon-test21"></i>
      <span class="plan-down-link-text">下载样本视图</span>
    </div>
  </div>
</template>

<script>
export default {}
</script>
