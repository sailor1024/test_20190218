<template>
  <div>
    <Row class="box" :gutter="45">
      <Col class="item" span="8">
        <div class="itembox">
          <div class="icon icon1">
          </div>
          <div class="info">
            <p class="info__title">空间数量</p>
            <h4>{{this.$store.state.statobj.count_total}}<small>项</small></h4>
          </div>
          <div class="some">
            <div>
              <Tooltip content="说明">
                <Icon size="17" class="iconspan" color="#ccc" type="help-circled" @click="forever(foreverMsg)"></Icon>
              </Tooltip>
            </div>
          </div>
        </div>
      </Col>
      <Col class="look" span="8">
        <div class="itembox">
          <div class="icon icon2">
          </div>
          <div class="info">
            <p>浏览人数</p>
            <h4>{{this.$store.state.statobj.type_1_total}}<small>人</small></h4>
          </div>
          <div class="some">
            <div>
              <Tooltip content="说明">
                <Icon size="17" class="iconspan" color="#ccc" type="help-circled" @click="forever(foreverImpression)"></Icon>
              </Tooltip>
            </div>
          </div>
        </div>
      </Col>
      <Col class="line" span="8">
        <div class="itembox">
          <div class="icon icon3" >
          </div>
          <div class="info">
            <p>访问次数</p>
            <h4>{{this.$store.state.statobj.type_2_total}}<small>次</small></h4>
          </div>
          <div class="some">
            <div>
              <Tooltip content="说明">
                <Icon size="17" class="iconspan" color="#ccc" type="help-circled" @click="forever(foreverVisit)"></Icon>
              </Tooltip>
            </div>
          </div>
        </div>
      </Col>
    </Row>
    <stainumConPop v-if="stainumShow" :json="json"/>
  </div>
</template>

<script>
import stainumConPop from './stainumConPop'
export default {
  name: 'stainumCon',
  data () {
    return {
      stainumShow: this.$store.state.stainumTo,
      json: '',
      // 永久信息
      foreverMsg: [{
        title: '空间数量',
        msg: '自2018年6月1日起收集统计数据。在该日期之前创建的空间将显示自2018年6月1日以来收集的数据',
        width: 478,
        fontS: '36px'
      }],
      // 印象信息
      foreverImpression: [{
        title: '浏览人数',
        msg: '当有人查看包含3D空间的页面或点击公共空间链接时展示的浏览人数。',
        width: 418,
        fontS: '30px'
      }],
      // 访问信息
      foreverVisit: [{
        title: '访问次数',
        msg: '在空间成功加载时显示的访问量。',
        width: 418,
        fontS: '30px'
      }]
    }
  },
  methods: {
    forever: function (data) {
      this.json = data
      this.stainumShow = true
      this.$store.dispatch('stainumTo', true)
    }
  },
  computed: {
    stainumTo () {
      return this.$store.state.stainumTo
    }
  },
  watch: {
    stainumTo (newVal, oldVal) {
      this.$data.stainumShow = newVal
    }
  },
  components: {
    stainumConPop
  }
}
</script>

<style lang="scss" scoped>
$primaryColor: #00A1FF;
.box{
  padding: 0 10px;
  margin-top: 52px;
  .item{
    height: 130px;
  }
  .look{
    height: 130px;
  }
  .line{
    height: 130px;
  }
  .itembox{
    height: 100%;
    background: #fff;
    position: relative;
    border-radius: 4px;
    box-shadow: 0px 3px 3px 0px rgba($color: #cccccc, $alpha: .3);
    padding: 0 20px;
    .icon{
      position: absolute;
      top: -20px;
      left: 20px;
      width: 86px;
      height: 86px;
      border-radius: 4px;
      background-color: $primaryColor;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 25px;
      box-shadow: 0 4px 3px rgba($color: $primaryColor, $alpha: .3);
    }
    .icon1{
      background-image: url('../../assets/images/stat_hezi.png');
    }
    .icon2{
      background-image: url('../../assets/images/stat_file.png');
    }
    .icon3{
      background-image: url('../../assets/images/stat_zexian.png');
    }
    .info{
      float: right;
      h4{
        font-size:24px;
        color:#666666;
        font-weight: normal;
        margin-top: 5px;
        small {
          font-size: 14px;
          margin-left: 5px;
        }
      }
      p{
        font-size:14px;
        color:#666666;
        line-height:20px;
        text-align: right;
        margin-top: 14px;
      }
    }
    .some{
      padding-top: 87px;
      .iconspan{
        cursor: pointer;
      }
      > div {
        padding-top: 12px;
        border-top: 1px solid #eee;
      }
      & /deep/ .ivu-tooltip-inner {
        min-height: 25px;
        padding: 4px 10px;
        background-color: rgba(70, 76, 91, 0.5);
      }
      & /deep/ .ivu-tooltip-popper[x-placement^="bottom"] .ivu-tooltip-arrow {
        border-bottom-color: rgba(70, 76, 91, 0.5);
      }
    }
  }
}
</style>
