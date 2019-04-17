<template>
  <div >
    <Row class="itembox">
      <Col class="item" span="11">
        <div class="content">
          <Dropdown class="menue" @on-click="select" trigger="click">
            <a style="color: rgb(98,98,98)" href="javascript:void(0)">
                {{choiceSelectName}}
                <Icon class="icon" type="arrow-down-b" color="rgb(98,98,98)" size="16px"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem name="time" class="slide">创建日期</DropdownItem>
                <DropdownItem name="name" class="slide">名称</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Col>
      <Col class="item" span="3">
        <div class="numspan">
          <span>天数</span>
        </div>
      </Col>
      <Col class="item" span="3">
        <div class="numspan"><span>浏览</span></div>
      </Col>
      <Col class="item" span="3">
        <div class="numspan"><span>访问</span></div>
      </Col>
      <Col class="item" span="3">
        <div class="numspan"><span>特殊访客</span></div>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'stainavhead',
  data () {
    return {
      selectObj: [
        { id: 'name', name: '名称' },
        { id: 'time', name: '创建日期' }
      ]
    }
  },
  computed: {
    choiceSelectName () {
      for (let i = 0, length = this.selectObj.length; i < length; i++) {
        if (this.selectObj[i].id === this.selectType) {
          return this.selectObj[i].name
        }
      }
    },
    selectType () {
      return this.$store.state.stailList.selectType
    }
  },
  methods: {
    select: function (name) {
      this.$store.dispatch('stanum', 1)
      this.$store.dispatch('updateStailListSelectType', name)
    }
  }
}
</script>

<style lang="scss" scoped>
.menue{
  font-size:14px;
  font-family:PingFangSC-Regular;
  color:#00A1FF;
  margin-left: 14px;
  padding: 8px 0px 9px 0px;
  a{
    .icon{
      transform: rotate(180deg);
    }
  }
  a:hover{
    transform: rotate(0deg);
  }
  .slide {
    border-bottom:1px solid #e0e0e0 !important;
  }
  .slide:last-child {
    border-bottom:0 !important;
  }
  .slide:hover {
    color: rgb(0, 161, 255)
  }
}
.itembox{
  // height: 25px;
  margin-top: 27px;
  margin-bottom: 10px;
  padding: 2px 0px;
  .item{
    height: 100%;
    .numspan{
      text-align: center;
      span{
        display: inline-block;
        font-size:14px;
        color:#666666;
        line-height: 32px;
      }
    }
  }
}
</style>
