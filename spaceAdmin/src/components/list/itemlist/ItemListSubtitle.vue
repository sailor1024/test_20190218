<style lang="scss">
.itemList-subTitle{
  margin-left:15px;
  height:20px;
  line-height:20px;
  >span{
    color:#626262;
    font-size:14px;
    margin-right:4px;
  }
  >.icon-icon-test{
    color:#626262;
    font-size:10px;
  }
}
.itemList-checkAll{
  display:flex;
  align-items: center;
  justify-content: flex-end;
  .move {
    height:100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    span {
      font-size: 14px;
      color: #626262;
    }
    i {
      color:#00A1FF;
      font-size:18px;
      font-weight: bold;
      padding-left:2px;
    }
  }
  .checkAll {
    height:100%;
    margin-left:10px;
    span:first-child{
      font-size:14px;
      color:#626262;
    }
    .ivu-checkbox-inner{
      border:2px solid #00A1FF;
      border-radius: 0px;
    }
  }
}
.itemList-subTitle{
  .slide {
    border-bottom:1px solid #e0e0e0 !important;
  }
  .slide:last-child {
    border-bottom:0 !important;
  }
  .ivu-checkbox:hover .ivu-checkbox-inner{
    border-color: #00a1ff !important;
  }
  //select
  .ivu-select-single .ivu-select-selection{
    height:20px;
  }
  //select边框，背景
  .ivu-select-selection{
    border:none;
    border-radius: 0px;
    background: transparent;
  }
  //select高度
  .ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
    height:20px;
    line-height:20px;
  }
  //边框阴影
  .ivu-select-visible .ivu-select-selection{
    box-shadow: 0 0 0 0;
  }
  //下拉框样式
  // .ivu-select-dropdown{
  //   border-radius:0;
  // }
  .ivu-select-item:hover{
    color:#00a1ff !important;
  }
  .ivu-select-single .ivu-select-selection .ivu-select-placeholder{
    color:#626262;
  }
}
.itemList-checkAll{
  .ivu-checkbox:hover .ivu-checkbox-inner{
    border-color: #00a1ff !important;
  }
}
#marginChange {
  margin-right:16px;
}
.menue{
  font-size:14px;
  color:#626262;
  margin-left: 20px;
  // padding: 8px 0px 9px 0px;
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
  .slide:hover {
    color: rgb(0, 161, 255)
  }
  .slide:last-child {
    border-bottom:0 !important;
  }
  & /deep/ .ivu-dropdown-item {
    color: #666666 !important;
    font-size: 14px;
    padding: 11px 16px;
  }
}
</style>

<template>
<div style="margin-bottom:21px;">
  <!-- <itemListContentCreate :checkShowChange="checkShowChange" v-if="moveShow"/> -->
  <Row style="margin-top:31px;">
    <i-col span="12" style="text-align:left;">
      <div class="itemList-subTitle">
        <Dropdown class="menue" @on-click="valuechange">
            <a style="color: rgba(98,98,98,1)" href="javascript:void(0)">
                {{choiceSelectName}}
                <Icon class="icon" type="arrow-down-b" color="#626262" size="16px"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem :name="1" class="slide">名称</DropdownItem>
                <DropdownItem :name="2" class="slide">创建日期</DropdownItem>
            </DropdownMenu>
        </Dropdown>
      </div>
    </i-col>
    <i-col span="12" style="text-align:right;">
      <div class="itemList-checkAll">
        <!-- 移动 -->
        <div class="move" v-show="isShowMove" @click="projectMove">
          <span>移动</span>
          <i class="font_family icon-share"></i>
        </div>
        <!-- 全选 -->
        <div class="checkAll">
          <span>选择所有项目</span>
          <Checkbox id="marginChange" :indeterminate="indeterminate" :value="isCheckAll" @click.prevent.native="checkChange()"></Checkbox>
        </div>
      </div>
    </i-col>
  </Row>
</div>
</template>

<script>
import itemListContentCreate from './itemListContentComp/itemListContentCreate'
import listMenu from '../../userlist/usermenue'
export default {
  watch: {
    checkShowChange (newVal) {
      // 选中的项目id数组
      if (newVal.length > 0) {
        this.showMove = true
      } else {
        this.showMove = false
      }
    },
    showMoveCreateTo (newVal) {
      this.moveShow = newVal
    },
    isShowMove (val) {
      // if (!val) {
      //   if (this.isCheckAll) {
      //     this.$emit('changeCheckStatus')
      //   }
      // }
      const projects = this.originalityData.projects
      const files = this.originalityData.files
      let num = 0
      for (let i = 0, j = projects.length; i < j; i++) {
        if (projects[i].edit_type === 2) {
          num++
        }
      }
      for (let i = 0, j = files.length; i < j; i++) {
        if (files[i].edit_type === 2) {
          num++
        }
      }
      this.peroteTotal = num
      if (this.peroteTotal === val) {
        if (!this.isCheckAll) {
          this.$emit('changeCheckStatus')
        }
        this.indeterminate = false
      } else if (val === 0) {
        if (this.isCheckAll) {
          this.$emit('changeCheckStatus')
        }
        this.indeterminate = false
      } else {
        this.indeterminate = true
      }
    }

  },
  props: {
    projectItems: {
      default: () => [],
      type: Array
    },
    folderItems: {
      default: () => [],
      type: Array
    },
    isCheckAll: {
      type: Boolean
    },
    originalityData: {
      type: Object,
      default: () => ({
        files: [],
        projects: []
      })
    }
  },
  created: function () {
  },
  computed: {
    // isCheckAll () {
    //   return this.$store.state.checkAll
    // },
    checkShowChange () {
      return this.$store.state.checkShow
    },
    showMoveCreateTo () {
      return this.$store.state.showMoveCreateTo
    },
    isShowMove () {
      return this.projectItems.length + this.folderItems.length
    },
    choiceSelectName () {
      for (let i = 0, j = this.selectList.length; i < j; i++) {
        if (this.selectList[i].value === this.selectType) {
          return this.selectList[i].label
        }
      }
    }
  },
  methods: {
    // 多选项目移动
    projectMove: function () {
      // this.$store.dispatch('showMoveCreateTo', true)
      // this.moveShow = true
      this.$emit('changeShowContentCreate', true)
    },
    checkChange: function () {
      // this.$store.dispatch('checkAll', !this.isCheckAll)
      this.$emit('changeCheckStatus')
      this.showMove = this.isCheckAll
      // let arr = this.$store.state.Lister
      let arr = this.projectItems
      if (this.isCheckAll) {
        for (let i = 0; i < arr.length; i++) {
          this.$store.dispatch('checkShow', arr[i].id)
        }
      } else {
        this.$store.commit('checkShowSpace')
      }
    },
    valuechange (name) {
      this.selectType = name
      this.$emit('childchange', name)
    }
  },
  data: function () {
    return {
      selectType: 2,
      selectList: [
        {
          value: 1,
          label: '名称'
        },
        {
          value: 2,
          label: '创建日期'
        }
        // {
        //   value: 3,
        //   label: '邮政编码'
        // },
        // {
        //   value: 4,
        //   label: '内部ID'
        // },
        // {
        //   value: 5,
        //   label: 'MLS清单ID'
        // },
        // {
        //   value: 5,
        //   label: '修改日期'
        // }
      ],
      showMove: false,
      moveShow: false,
      indeterminate: false,
      peroteTotal: 0
    }
  },
  components: {
    itemListContentCreate,
    listMenu
  }
}
</script>
