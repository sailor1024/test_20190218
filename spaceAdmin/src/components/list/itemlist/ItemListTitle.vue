<style lang="scss">
$deep: ">>>";
.itemList-titleComponent{
  .itemList-title{
      height:37px;
      font-size:26px;
      // font-family:'PingFangSC-Regular';
      color:#333333;
      line-height:37px;
    }
    //搜索框
    .ivu-input-group .ivu-input{
      height:41px;
      border-radius:0px;
      padding-left:9px;
      border:1px solid rgba(231,231,231,1);
      font-size:14px;
    }
    //搜索框获取焦点
    .ivu-input:focus{
      border:1px solid rgba(231,231,231,1);
      box-shadow: 0 0 0 0 rgba(231,231,231,1);
    }
    //搜索框select
    .ivu-input-group-append{
      background-color:#fff;
      color:#626262;
      border-radius:0;
      padding-top:0;
      padding-bottom:0;
      padding-right: 0;
    }
    //搜索框select字体颜色
    .ivu-select-single .ivu-select-selection .ivu-select-placeholder{
      color:#626262;
    }
    //下尖括号
    .ivu-select-arrow{
      color:#626262;
      font-size:16px;
      right:26px;
    }
    //下拉框样式
    .ivu-select-dropdown{
      border-radius: 0;
    }
    .ivu-select-item{
      text-align: left;
    }
    .ivu-select-item:hover{
      // color:#00A1FF !important;
    }
    .itemList-searchBox {
      position: absolute;
      right: 0;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      .ivu-input-wrapper  {
        position: static;
        top:0;
      }

      & /deep/ .ivu-select-item-selected {
        background-color: inherit;
        color: #00A1FF;
      }
      & /deep/ .ivu-select-item:hover {
        background: inherit;
      }
      & /deep/ .ivu-select-arrow {
        top: 45%;
      }
      & /deep/ .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
        padding-left: 0;
        font-size: 14px;
      }
      & /deep/ .ivu-select-item {
        padding: 14px 17px;
        font-size: 14px !important;
      }
    }
    //搜索按钮
    #itemList-searchBtn{
      width:39px;
      height:41px;
      border:none;
      outline:none;
      background:#00A1FF;
      border-bottom:1px solid #00A1FF;
      vertical-align:middle;
      >i{
        color:#fff;
        font-size:30px;
        transform:scale(0.5);
        display:block;
      }
    }
    .input-z input{
      z-index: 0;
      height: 43px !important;
    }
}
</style>

<template>
  <div class="itemList-titleComponent">
    <Row style="margin-top:38px;">
      <i-col span="12" style="text-align:left;">
        <h4 class="itemList-title" v-if="!json">所有项目</h4>
        <h4 class="itemList-title" v-else>{{json}}</h4>
      </i-col>
      <i-col span="12">
        <div class="itemList-searchBox" style="width: 100%;max-width: 535px;">
          <i-input @input="inputfunc" placeholder="搜索" class="input-z"  v-model="searchstr" @keyup.enter.native="sendemit">
            <i-select v-model="selectindex" slot="append" style="margin-right: 0;width: 130px" placeholder="名称和说明">
              <i-option :value="1">名称和说明</i-option>
              <i-option :value="2">地址</i-option>
            </i-select>
            <button @click="sendemit" slot="append" id="itemList-searchBtn" @mousedown="btnDown()" @mouseup="btnUp()">
            <i class="font_family icon-icon-test6"></i>
          </button>
          </i-input>

        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  props: ['json'],
  data: function () {
    return {
      selectList: [
        {
          value: 0,
          label: '名称和说明'
        },
        {
          value: 1,
          label: '地址'
        },
        {
          value: 2,
          label: '内部ID'
        },
        {
          value: 3,
          label: 'MLS名称'
        },
        {
          value: 4,
          label: 'MLS清单ID'
        }
      ],
      'searchstr': this.$route.query.q || '',
      'selectindex': parseInt(this.$route.query.t) || 1
    }
  },
  methods: {
    btnDown: function () {
      var btn = event.currentTarget
      btn.style.backgroundColor = '#46BBFF'
    },
    btnUp: function () {
      var btn = event.currentTarget
      btn.style.backgroundColor = '#00a1ff'
    },
    sendemit () {
      if (!this.searchstr) {
        this.$Message.error('请输入搜索关键词')
        return false
      }
      // this.$emit('childchange', this.searchstr, this.selectindex)
      this.$router.push({
        name: 'search',
        query: {
          q: this.searchstr,
          t: this.selectindex,
          page: 1
        }
      })
    },
    inputfunc (value) {
      if (value === '') {
        // this.$emit('childchange')
      }
    }
  },
  watch: {
    '$route.query' (newValue) {
      this.$emit('childchange')
    }
  }
}
</script>
