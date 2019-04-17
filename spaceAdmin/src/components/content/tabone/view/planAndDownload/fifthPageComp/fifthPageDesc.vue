<style lang="scss" scoped>
$theme-color:#00A1FF;
$fb-color:#626262;
//fifth右侧文字列表
.plan-describe{
    // width:85.7%;
  display: inline-block;
    // padding-left:15%;
    padding-bottom:8px;
    // @media(max-width:992px){
    //   padding-left:3%;
    //   padding-right:3%;
    //   padding-top:0;
    // }
    .plan-describe-explanation{
      >ul{
        list-style:none;
        >.plan-describe-explanation-msg{
          min-height:20px;
          line-height:20px;
          margin-bottom:15px;
          color:$fb-color;
          >span{
            font-size:14px;
            text-align:justify;
            color: #666666;
          }
          //自定义小方块
          >i{
            display:inline-block;
            border:2.5px solid $fb-color;
            vertical-align:middle;
            margin-right:12px;
          }
        }
      }
    }
    .plan-describe-more{
      margin-top:65px;
      height:20px;
      line-height:20px;
      >a{
        text-decoration:underline;
        color:$theme-color;
        font-size:14px;
      }
    }
  }
</style>

<template>
  <div class="plan-describe">
        <div class="plan-describe-explanation">
          <ul>
            <li class="plan-describe-explanation-msg">
              <i></i>
              <span>平面图示意图可以提供PDF和PNG两种格式下载</span>
            </li>
            <li class="plan-describe-explanation-msg">
              <i></i>
              <span>平面图将在2个工作日内发送给您。同时在交付完成后我们会记录此次下载。</span>
            </li>
            <li class="plan-describe-explanation-msg">
              <i></i>
              <span>
                请注意：我们不支持为10,000平方英尺（930平方米）以上的扫描空间创建平面图示意图。
              </span>
            </li>
            <li class="plan-describe-explanation-msg">
              <i></i>
              <span>楼层平面图并未按照RICS标准制作。</span>
            </li>
          </ul>
        </div>
        <div class="plan-describe-more">
          <a href="javascript;" @click.prevent="">
            了解更多信息并查看相关定价
          </a>
        </div>
      </div>
</template>

<script>
export default {}
</script>
