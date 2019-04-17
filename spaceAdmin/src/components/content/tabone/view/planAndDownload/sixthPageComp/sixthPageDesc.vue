<style lang="scss" scoped>
$theme-color:#00A1FF;
$fb-color:#626262;
//sixth右侧文字列表
.plan-describe{
    display: inline-block;
    // width:85.3%;
    // padding-left:15%;
    // padding-top:9px;
    padding-bottom:8px;
    padding-right:32px;
    // @media(max-width:992px){
    //   padding-left:3%;
    //   padding-right:3%;
    //   padding-top:0;
    // }
}
.plan-describe-ul{
  list-style:none;
  //各列表间距（外层）
  .plan-describe-ul-item:not(:last-child){
    margin-bottom: 55px;
  }
  //内层列表样式
  .plan-describe-explanation-intr{
    min-height:18px;
    line-height:18px;
    margin-bottom:8px;
    color:$fb-color;
    >span{
      min-height:18px;
      line-height:18px;
      font-size:13px;
      text-align:justify;
    }
    //自定义小方块
    >i{
      display:inline-block;
      border:2.5px solid $fb-color;
      vertical-align:middle;
      margin-right:12px;
    }
    //第三个列表项
    .plan-describe-explanation-intr-sp{
      img{
        height:12px;
        vertical-align:middle;
      }
      .plan-describe-tm{
        font-size:15px;
        display:inline-block;
        transform:scale(0.6);
        vertical-align:middle;
      }
      //了解更多
      a{
        text-decoration: underline;
        color:$theme-color;
      }
    }
  }
  //列表内小标题样式
  .plan-describe-subtitle{
    color:$fb-color;
    min-height:20px;
    line-height:20px;
    margin-bottom:12px;
    img{
      height:14px;
      vertical-align:middle;
    }
    .plan-describe-tm{
      font-size:12px;
    }
    .plan-describe-subtitle-text{
      font-size:14px;
      height:20px;
      line-height:20px;
      color:$fb-color;
      >span{
        height:20px;
        line-height:20px;
      }
    }
  }
}
</style>

<template>
  <div class="plan-describe">
    <div>
      <ul class="plan-describe-ul">
        <li class="plan-describe-ul-item">
          <div class="plan-describe-subtitle">
            <img src="@/assets/images/logo1.png" alt=""><sup class="plan-describe-tm">TM</sup>
            <span class="plan-describe-subtitle-text">是一系列能被用于导入到第三方程序的商业3D资产，其中包括：</span>
          </div>
          <ul class="plan-describe-ul">
            <li class="plan-describe-explanation-intr">
              <i></i>
              <span>色彩云空间(.xyz)</span>
            </li>
            <li class="plan-describe-explanation-intr">
              <i></i>
              <span>
                反映天花板计划图像(.jpg and .pdf)
              </span>
            </li>
            <li class="plan-describe-explanation-intr">
              <i></i>
              <span>高分辨率平面图(.jpg and .pdf)</span>
            </li>
            <li class="plan-describe-explanation-intr">
              <i></i>
              <span>
                3D网格的OBJ格式(.obj)
              </span>
            </li>
          </ul>
        </li>
        <li class="plan-describe-ul-item">
          <div class="plan-describe-subtitle">
            <img src="@/assets/images/logo1.png" alt=""><sup class="plan-describe-tm">TM</sup>
            <span class="plan-describe-subtitle-text">适用于以下用户：</span>
          </div>
          <ul class="plan-describe-ul">
            <li class="plan-describe-explanation-intr">
              <i></i>
              <span>建筑师和工程师为竣工设计</span>
            </li>
            <li class="plan-describe-explanation-intr">
              <i></i>
              <span>专业建筑人员的文件和验证文件集</span>
            </li>
          </ul>
        </li>
        <li class="plan-describe-ul-item">
          <p class="plan-describe-subtitle">提示:</p>
          <ul class="plan-describe-ul">
            <li class="plan-describe-explanation-intr">
              <i></i>
              <span class="plan-describe-explanation-intr-sp">
                <img src="@/assets/images/logo1.png" alt=""><sup class="plan-describe-tm">TM</sup>
                <span>
                  <span>采取零点购买方式。每月底的账单会反映上个月的所有购买信息。</span>
                  <a href="javascribe;" @click.prevent="">了解更多</a>
                </span>
              </span>
            </li>
            <li class="plan-describe-explanation-intr">
              <i></i>
              <span>
                3D数据精确到现实数据的1%以内。顶视图和平面视图都会包含一个比例图。
              </span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {}
</script>
