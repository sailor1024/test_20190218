<template>
  <div class="itemList-contentBox" style="cursor:pointer">
    <Card @click.stop.native="gotodetilfunc">
      <div class="itemList-contentBox-inside" >
        <div class="itemList-contentBox-left">
          <div class="itemList-thumbnail">
            <img src="../../../../assets/images/projectv1.png" alt="" >
          </div>
          <div class="itemList-contentMsg">
            <p class="itemList-contentMsg-tit">{{json.dir_name}}</p>
            <p class="itemList-contentMsg-address">{{json.items_num ? json.items_num : 0}} 个项目</p>
            <!-- <p class="itemList-contentMsg-source"></p> -->
          </div>
        </div>
        <div class="itemList-contentFn" v-if="editorShow">
          <ul class="itemList-fnbtns">
            <li>
              <Tooltip>
                <i-button style="width:39px;height:28px;" @click.stop="inviteFolder(json)">
                  <i class="font_family icon-icon-test4" style="13px;"></i>
                </i-button>
                <div slot="content">
                  <div class="icon-content">邀请合作者</div>
                </div>
              </Tooltip>
            </li>
            <li>
              <Tooltip @click.stop.native="" placement="bottom" width="400">
                <i-button style="width:39px;height:28px;">
                  <i class="font_family icon-icon-test11" style="font-size12px;display:block;transform:scale(0.25)"></i>
                </i-button>
                <div slot="content" style="background-color:#fff;" class="api itemList-tooltip__icon">
                  <Button type="primary" icon="edit" style="border-bottom: 1px solid #e0e0e0;" @click.stop="rename(json)">
                    <span class="f__size__12">重命名</span>
                  </Button>
                  <Button type="primary" icon="folder" style="border-bottom: 1px solid #e0e0e0;" @click.stop="MoveFolder(json)">
                    <span class="f__size__12">移动到文件夹</span>
                  </Button>
                  <Button type="primary" icon="trash-a" @click.stop="delate(json)" v-if="editorShowDeleFolder">
                    <span class="f__size__12">删除文件夹</span>
                  </Button>
                </div>
              </Tooltip>
            </li>
            <li v-if="$route.name !== 'search'">
              <Tooltip>
                <Checkbox v-model="isCheck" @click.stop.native="checkThis(json)"></Checkbox>
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
      :FolderItems="[json]"
      v-if="showCreateIf"
      @changeShowContentCreate="showCreateIf=arguments[0]"
      :EditorCreate="EditorCreate"/>
  </div>
</template>

<script>
import itemListContentCreate from './itemListContentCreate'
export default {
  props: {
    json: Object,
    isCheckAll: Boolean,
    page: {
      type: Number,
      default: 0
    }
  },
  components: {itemListContentCreate},
  data () {
    return {
      isCheck: false,
      editorShow: false,
      editorShowDeleFolder: false,
      // 保存当前的文件夹的id
      FolderId: [],
      showCreateIf: false,
      EditorCreate: {}
    }
  },
  created () {
    this.EditorCreate = this.json
    this.EditorCreate.title = this.EditorCreate.name
    if (this.$store.state.userInfo.id === this.json.user_id) {
      this.editorShow = true
      this.editorShowDeleFolder = true
    } else if (this.$store.state.userInfo.user_type !== 3) {
      this.editorShow = true
      this.editorShowDeleFolder = true
    } else if (this.json.edit_type === 2) {
      this.editorShow = true
      this.editorShowDeleFolder = true
    } else {
      this.editorShow = false
      this.editorShowDeleFolder = false
    }
    // if (this.json.status && this.json.status === 2) {
    //   this.editorShow = true
    // } else {
    //   this.editorShow = false
    // }
  },
  watch: {
    // check: function (val) {
    //   this.isCheck = val
    // }
    isCheckAll (val) {
      if (this.$store.state.userInfo.user_type !== 3 || this.json.edit_type === 2) {
        if (
          (this.isCheck === false && val === true) ||
          (this.isCheck === true && val === false)
        ) {
          this.$emit('putInfo', this.json)
        }
        this.isCheck = val
      }
    },
    page () {
      if (this.isCheck) {
        this.$emit('putInfo', this.json)
        this.isCheck = false
      }
    }
  },
  // computed: {
  //   check () {
  //     return this.$store.state.checkAll
  //   }
  // },
  methods: {
    // 文件夹邀请
    inviteFolder (data) {
      this.$store.dispatch('ModelFolderInvite', {
        isShow: true,
        json: data
      })
    },
    // 移动文件夹
    MoveFolder (data) {
      this.showCreateIf = true
      // this.$store.dispatch('FolderMove', {
      //   isShow: true,
      //   json: data
      // })
    },
    checkThis () {
      this.isCheck = !this.isCheck
      this.$emit('putInfo', this.json)
      // if (this.isCheck) {
      //   this.$store.dispatch('checkShow', data.id)
      // } else {
      //   this.$store.dispatch('checkShowSplice', this.$store.state.checkShow.indexOf(data.id))
      // }
    },
    gotodetilfunc: function () {
      // 使用localStroge存储当前的文件夹信息(很重要，不要删)
      localStorage.setItem('FolderJsonOnce', JSON.stringify(this.json.id))
      // 传参数
      this.$store.dispatch('Folder', this.json)
      // 路由传递数据
      // this.$router.push({
      //   path: '/embed',
      //   query: {id: this.json.id}
      // })
      this.$router.push({
        path: '/folder/' + this.json.id
      })
    },
    rename: function (data) {
      this.$store.dispatch('FolderRenameTo', true)
      // 重命名文件夹信息
      this.$store.dispatch('FolderRename', data)
    },
    delate (data) {
      // this.$store.dispatch('deleteFolder', true)
      this.$store.dispatch('deleteFolderIf', true)
      this.$store.dispatch('deleteFolderMsg', data)
    }
  }
}
</script>
<style lang="scss" scoped>
.itemList-contentBox{
  cursor: default;
  // max-width:1144px;
  //  margin-top:8px;
  //  覆盖组件card样式
  .ivu-card {
    border-bottom:0;
  }
  .ivu-card-body{
    padding:15px;
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
    margin-top: 6px;
    // font-family:'PingFang-SC';
    color:#333333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .itemList-contentMsg-address{
    @include contentCss(20px,14px,20px);
    margin-top: 7px;
    color:#999999;
  }
  .itemList-contentMsg-source{
    @include contentCss(17px,12px,17px);
    margin-top:6px;
    // font-family:'PingFangSC';
    color:rgba(98,98,98,1);
  }
}
.itemList-contentBox-left{
  display: flex;
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
.itemList-fnbtns /deep/{
  list-style:none;
  display:flex;
  width:100%;
  height:28px;
  margin-top:21px;
  justify-content:flex-end;
  align-items: center;
  > li{
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
      display: none;
      border-bottom-color: #fff;
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
        padding-left: 17px;
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
    font-size: 12px;
    margin-left: -5px;
  }
  .itemList-tooltip__icon {
    .ivu-icon {
      transform: translateY(2px);
      font-size: 16px;
    }
  }
}

</style>
