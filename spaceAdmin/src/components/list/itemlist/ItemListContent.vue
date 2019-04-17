<style lang="scss">
.build--success {
  &:after {
    position: absolute;
    display: inline-block;
    content: '成功';
    font-size: 12px;
    // background-color: green;
    // width: 10px;
    // height: 10px;
    // border-radius: 5px;
    top: 3px;
    left: 17px;
    z-index: 1;
  }
}
.build--default {
  &:before {
    position: absolute;
    display: inline-block;
    font-size: 12px;
    content: '传输时间过长';
    // background-color: red;
    // width: 10px;
    // height: 10px;
    // border-radius: 5px;
    top: 3px;
    left: 17px;
    z-index: 1;
  }
}
.build--ing {
  &:before {
    position: absolute;
    display: inline-block;
    content: '上传中';
    font-size: 12px;
    // background-color: red;
    // width: 10px;
    // height: 10px;
    // border-radius: 5px;
    top: 3px;
    left: 17px;
    z-index: 1;
  }
}
.itemList-contentBox{
  position: relative;
  cursor: default;
  // max-width:1144px;
  //  margin-top:8px;
  //  覆盖组件card样式
  .ivu-card {
    border-bottom:0;
  }
  .ivu-card-body{
    padding: 14px 16px 8px;
  }
}
.itemList-contentBox-inside{
  position: relative;
  display:flex;
  min-height:70px;
}
.itemList-thumbnail{
  margin-right:17px;
  width:100px;
  >img{
    display: block;
    width:100px;
    height:70px;
    background-color: #222;
  }
}
//卡片内容样本
@mixin contentCss($h,$fz,$lh){
  min-height:$h;
  font-size:$fz;
  color:rgba(98,98,98,1);
  line-height:$lh;
  text-align:left;
}
.itemList-contentMsg{
  width: calc(100% - 117px);
  .itemList-contentMsg-tit{
    @include contentCss(25px,18px,25px);
    // font-family:'PingFang-SC';
    color:#333333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .itemList-contentMsg-address{
    @include contentCss(20px,14px,20px);
    // font-family:'PingFangSC';
    margin-top: 3px;
    color:#666666;
  }
  .itemList-contentMsg-source{
    @include contentCss(17px,12px,17px);
    margin-top:6px;
    // font-family:'PingFangSC';
    color:#999999;
  }
}
.itemList-contentBox-left{
  display:flex;
  width: 100%;
}
.itemList-contentFn{
  min-height:70px;
  line-height:70px;
  width:15%;
  min-width:117px;
  position: absolute;
  right: 0;
}
//卡片功能按键
.itemList-fnbtns{
  list-style:none;
  display:flex;
  width:100%;
  height:28px;
  margin-top:21px;
  justify-content:flex-end;
  align-items: center;
  >li{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height:28px;
    line-height:28px;
    width:39px;
    text-align:center;
    .ivu-checkbox-wrapper {
      margin-right: 0;
    }
    i {
      font-size:18px;
    }
    .font_family.icon-icon-test11{
      width:39px;
    }
    //功能按钮样式
    .ivu-btn{
      padding:0;
      border:none;
      color:#00A1FF;
      border-radius:0;
      background:#fff;
    }
    .ivu-btn:focus{
      box-shadow:none;
    }
    //复选框样式
    .ivu-checkbox-inner{
      border:2px solid #00A1FF;
      border-radius:0;
    }
    .ivu-checkbox:hover .ivu-checkbox-inner{
      border-color: #00a1ff !important;
    }
    //  弹出框样式
    .ivu-tooltip-popper[x-placement^=bottom] .ivu-tooltip-arrow{
      border-bottom-color: #fff;
      display: none;
    }
    .ivu-tooltip-inner{
      padding:0;
       .ivu-btn{
        display:block;
        width:120px;
        height:36px;
        text-align:left;
        font-size:14px;
        line-height:36px;
        padding-left:17px;
        padding-right:17px;
      }
      .ivu-btn:hover{
        background:rgba(193,193,193,0.4);
      }
    }
  }
  .ivu-tooltip-inner{
    background-color:#fff;
    border-radius: 4px;
    overflow: hidden;
  }

  .itemList-fnbtn-person{
    list-style: none;
    li{
      width:120px;
      height:36px;
      line-height:36px;
    }
  }
  .icon-content{
    color:#00A1FF;
    text-align: center;
    font-size: 14px;
    padding: 11px 16px;
  }
  .f__size__12 {
    margin-left: -5px;
    font-size: 12px;
  }
  .itemList-tooltip__icon {
    .ivu-icon {
      transform: translateY(2px);
      font-size: 16px;
    }
  }
}

</style>

<template>
  <div class="itemList-contentBox" :class="{'build--success': json.build_status===1, 'build--default': json.build_status===2, 'build--ing': json.build_status===3}">
    <Card style="cursor:pointer;" @click.stop.native="gotodetilfunc">
      <div class="itemList-contentBox-inside" >
        <div class="itemList-contentBox-left">
          <div class="itemList-thumbnail">
            <img :src="imgsrc" alt="" >
          </div>
          <div class="itemList-contentMsg">
            <p class="itemList-contentMsg-tit" :title="json.title + json.dirname">{{json.title}}({{json.dirname}})</p>
            <p class="itemList-contentMsg-address" v-if="json.location">{{address}}</p>
            <p class="itemList-contentMsg-address" v-else>{{json.title}}</p>
            <p class="itemList-contentMsg-source">该项目由{{json.lastname + json.firstname}}创建于{{json.create_time | formateTime}}</p>
          </div>
        </div>
        <div class="itemList-contentFn" v-if="editorShow">
          <ul class="itemList-fnbtns">
            <li @click.stop="personfunc(json)">
              <Tooltip>
                <i-button style="width:39px;height:28px;">
                  <i class="font_family icon-icon-test4" style="13px;"></i>
                </i-button>
                <div slot="content">
                  <div class="icon-content">邀请合作者</div>
                </div>
              </Tooltip>
            </li>
            <li @click.stop="morefunc">
              <Tooltip placement="bottom" width="400">
                <i-button style="width:39px;height:28px;">
                  <i class="font_family icon-icon-test11" style="font-size12px;display:block;transform:scale(0.25)"></i>
                </i-button>
                <div class="itemList-tooltip__icon api" slot="content" style="background-color:#fff;">
                  <Button type="primary" icon="edit" @click.stop="editFile(json)" style="border-bottom: 1px solid #e0e0e0;">
                    <span class="f__size__12">编辑文件</span>
                  </Button>
                  <Button type="primary" icon="folder" @click.stop="moveFile(json)" style="border-bottom: 1px solid #e0e0e0;">
                    <span class="f__size__12">移动到文件夹</span>
                  </Button>
                  <Button type="primary" icon="trash-a" @click.stop="deleteFile(json)" v-if="showDele">
                    <span class="f__size__12">删除空间</span>
                  </Button>
                </div>
              </Tooltip>
            </li>
            <li v-if="$route.name !== 'search'">
              <Tooltip>
                <Checkbox v-model="isCheck" @click.stop.prevent.native="checkThis(json)"></Checkbox>
                <div slot="content">
                  <div class="icon-content">选择</div>
                </div>
              </Tooltip>
            </li>
          </ul>
        </div>
      </div>
    </Card>
    <itemListContentCreate
      :projectItems="[json]"
      v-if="showCreateIf"
      @changeShowContentCreate="showCreateIf=arguments[0]"
      :EditorCreate="json"/>
  </div>
</template>

<script>
import itemListContentCreate from './itemListContentComp/itemListContentCreate'
export default {
  components: {itemListContentCreate},
  watch: {
    // 'isCheckAll': function (val) {
    //   this.isCheck = val
    // },
    isCheckAll (val, oldValue) {
      if (
        (this.$store.state.userInfo.user_type !== 3 || this.json.edit_type === 2)
      ) {
        if (
          (this.isCheck === false && val === true) ||
          (this.isCheck === true && val === false)
        ) {
          this.$emit('putInfo', this.json)
        }

        this.isCheck = val
      }
    },
    showEditorChange (newVal) {
      this.showEditor = newVal
    },
    jsonMsg: function (newVal) {
      if (this.$store.state.userInfo.user_type !== 3 || newVal.edit_type === 2) {
        this.editorShow = true
      } else {
        this.editorShow = false
      }
    },
    page () {
      if (this.isCheck) {
        this.$emit('putInfo', this.json)
        this.isCheck = false
      }
    }
  },
  data: function () {
    return {
      isCheck: false,
      showEditor: false,
      editorShow: false,
      showDele: false,
      showCreateIf: false
    }
  },
  props: {
    json: Object,
    checkAll: Boolean,
    isCheckAll: Boolean,
    page: {
      type: Number,
      default: 0
    }
  },
  created () {
    if (this.$store.state.userInfo.user_type !== 3 || this.$store.state.userInfo.id === this.json.user_id) {
      this.editorShow = true
      this.showDele = true
    } else {
      this.editorShow = false
      this.showDele = false
    }
    if (!this.json.edit_type || this.json.edit_type === 2) {
      this.editorShow = true
    } else {
      this.editorShow = false
    }
  },
  computed: {
    jsonMsg () {
      return this.json
    },
    address () {
      return this.json.location
    },
    imgsrc () {
      if (this.json.marker_image) {
        return this.$imgURL + this.json.marker_image
      } else {
        return this.$imgURL + 'assets/img/loading.gif'
      }
    },
    desbute () {
      let arr = new Date(this.json.create_time)
      let time
      time = arr.getFullYear() + '年' + (arr.getMonth() + 1) + '月' + arr.getDate() + '日'
      return '该项目由' + this.json.lastname + this.json.firstname + '创建于' + time
    },
    // isCheckAll () {
    //   return this.$store.state.checkAll
    // },
    showEditorChange () {
      return this.$store.state.showEditorTo
    }
  },
  methods: {
    deleteFile (data) {
      this.$store.dispatch('deleteFileSpace', {
        isShow: true,
        json: data
      })
    },
    editFile (data) {
      this.$store.dispatch('showEditorTo', {
        isShow: true,
        json: data
      })
    },
    moveFile (data) {
      this.showCreateIf = true
    },
    checkThis (data) {
      // if (!this.preventFunc()) {
      //   return
      // }
      this.isCheck = !this.isCheck
      this.$emit('putInfo', this.json)
      // if (this.isCheck) {
      //   this.$store.dispatch('checkShow', data.id)
      // } else {
      //   this.$store.dispatch('checkShowSplice', this.$store.state.checkShow.indexOf(data.id))
      // }
    },
    changefunc () {
      return false
    },
    personfunc (data) {
      this.$store.dispatch('showModal', {
        isShow: true,
        json: data
      })
    },
    morefunc () {

    },
    gotodetilfunc () {
      if (this.preventFunc()) {
        this.$router.push({
          path: '/home',
          query: {
            id: this.json.id
          }
        })
      }
    },
    preventFunc () {
      if (!this.json.marker_image) {
        const msg = this.$Message.loading({
          content: '项目正在构建...',
          duration: 0
        })
        setTimeout(msg, 2000)
        return false
      }
      return true
    }
  }
}
</script>
