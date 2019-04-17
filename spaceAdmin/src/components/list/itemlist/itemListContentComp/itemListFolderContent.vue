<template>
  <div class="folder-Content">
    <div class="folder-left">
      <itemListTitle @childchange="reloadfunc" :json="title"/>
      <itemListSubtitle
        @childchange="changevalue"
        :originalityData="{files: Folder, projects: project}"
        @changeCheckStatus="checkAllAction"
        @changeShowContentCreate="showCreateIf=arguments[0]"
        :isCheckAll="checkAll"
        :folderItems="selectFolderArr"
        :projectItems="selectProjectArr" />
      <itemListFolder
        :isCheckAll="checkAll"
        :json="item"
        v-for="(item) in Folder"
        @putInfo="transformFolderItem"
        @getThisInfo="EditorCreate=arguments[0]"
        @changeShowContentCreate="showCreateIf=arguments[0]"
        :key="item.id + 'a'"/>
      <ItemListContent
        :isCheckAll="checkAll"
        @putInfo="transformProjectItem"
        @changeShowContentCreate="showCreateIf=arguments[0]"
        @getThisInfo="EditorCreate=arguments[0]"
        v-for="(json, index) in project"
        :key="index"
        :json="json"/>
      <itemListContentCreate
        :projectItems="selectProjectArr"
        :FolderItems="selectFolderArr"
        v-if="showCreateIf"
        @changeShowContentCreate="showCreateIf=arguments[0]"/>
      <itemListContentEditor v-if="EditorProjectIf" :EditorProject="EditorProject"/>
      <itemListdeletaFile v-if="showDeleteFileIf" :showDeleteFileMsg="showDeleteFileMsg"/>
      <item-list-modal v-if="inviteIf" :inviteProject="inviteProject"></item-list-modal>
      <item-list-page
        v-if="isShowPage"
        :pageSize="sourcePages.pageSize"
        :current="sourcePages.page"
        :count="sourcePages.count"
        @pagechange="soureChange"></item-list-page>
    </div>
    <item-list-invite
      v-if="FolderPop.edit_type === 2 || $store.userInfo.user_type !== 3"
      :projects="project"
      :folderProps="FolderPop"></item-list-invite>
  </div>
</template>
<script>
import itemListTitle from '../ItemListTitle'
import itemListSubtitle from '../ItemListSubtitle'
// 引入文件夹
import itemListFolder from './itemListFolder'
// 引入项目信息
import ItemListContent from '../ItemListContent'
// 引入移动文件夹
import itemListContentCreate from './itemListContentCreate'
// 编辑项目
import itemListContentEditor from './itemListContentEditor'
// 删除项目
import itemListdeletaFile from './itemListdeletaFile'
// 邀请用户
import itemListModal from '../ItemListModal'
import itemListPage from '../ItemListPage'
import itemListInvite from './itemListInvite'
export default {
  data () {
    return {
      type: 2,
      // title信息
      title: ' ',
      // 传递的项目信息
      FolderPop: [],
      // 文件夹信息
      Folder: [],
      // 项目信息
      project: [],
      showCreateIf: false,
      EditorCreate: '',
      // 项目编辑判断
      EditorProjectIf: false,
      // 编辑项目信息
      EditorProject: '',
      showDeleteFileIf: false,
      showDeleteFileMsg: '',
      // 邀请用户判断
      inviteIf: false,
      // 邀请用户项目信息
      inviteProject: '',
      // 搜索功能配置信息
      searchPages: {
        page: 1,
        count: 0,
        pageSize: 10
      },
      // 全选开关
      checkAll: false,
      // 选中的数据
      selectProjectArr: [],
      selectFolderArr: [],
      sourcePages: {
        page: 1,
        count: 0,
        pageSize: 10
      },
      isShowPage: false,
      inviteList: []
    }
  },
  computed: {
    showCreateTo: function () {
      return this.$store.state.showCreateTo
    },
    showEditorTo: function () {
      return this.$store.state.showEditorTo
    },
    deleteFileSpace: function () {
      return this.$store.state.deleteFileSpace
    },
    isShow: function () {
      return this.$store.state.showModal
    }
  },
  watch: {
    '$route.params.id' () {
      this.$store.dispatch('isRouterReload', true)
    },
    // 移动项目
    // showCreateTo: function (newVal) {
    //   this.showCreateIf = newVal.isShow
    //   this.EditorCreate = newVal.json
    // },
    // 编辑项目
    showEditorTo: function (newVal) {
      this.EditorProjectIf = newVal.isShow
      this.EditorProject = newVal.json
    },
    deleteFileSpace: function (newVal) {
      this.showDeleteFileIf = newVal.isShow
      this.showDeleteFileMsg = newVal.json
    },
    // 邀请用户
    isShow: function (newVal) {
      this.inviteIf = newVal.isShow
      this.inviteProject = newVal.json
    }
  },
  created () {
    let json = this.$store.state.Folder
    if (!json.id) {
      this.FolderPop = JSON.parse(sessionStorage.getItem('FolderId'))
    } else {
      this.FolderPop = json
      sessionStorage.setItem('FolderId', JSON.stringify(this.FolderPop))
    }
    // this.$data.title = this.FolderPop.dir_name
    this.FolderPop.id = this.$route.params.id
    this.getData()
  },
  methods: {
    soureChange (page) {
      this.sourcePages.page = page
      this.getData()
    },
    transformProjectItem (data) {
      const arr = this.selectProjectArr.map(element => {
        return element.id
      })
      const i = arr.indexOf(data.id)
      if (i > -1) {
        this.selectProjectArr.splice(i, 1)
      } else {
        this.selectProjectArr.push(data)
      }
    },
    transformFolderItem (data) {
      const arr = this.selectFolderArr.map(element => {
        return element.id
      })
      const i = arr.indexOf(data.id)
      if (i > -1) {
        this.selectFolderArr.splice(i, 1)
      } else {
        this.selectFolderArr.push(data)
      }
    },
    checkAllAction () {
      this.checkAll = !this.checkAll
      console.log(this.checkAll)
    },
    /**
     * 2018年11月05日16:34:15
     * 该接口同时返回文件夹和项目的数据
     */
    getData () {
      this.$http.post('index2/index/space_list', {
        user_type: this.$store.state.userInfo.user_type,
        company_id: this.$store.state.userInfo.company_id,
        user_id: this.$store.state.userInfo.id,
        dir_father_id: this.FolderPop.id,
        items_dir_id: this.FolderPop.id,
        'page': this.sourcePages.page,
        limit_num: this.sourcePages.pageSize,
        type: this.type
      }).then(res => {
        if (res.data.code === 200) {
          this.project = res.data.data.items.data
          this.Folder = res.data.data.dir.data
          this.title = res.data.data.parent_name
          this.sourcePages.count = res.data.data.count
          this.$store.dispatch('folderEditType', res.data.data.edit_type)
          // 获取面包屑数组
          const pathList = res.data.data.all_path
          pathList.shift()
          this.$store.dispatch('pathList', pathList)
          if (this.project.length || this.Folder.length) {
            this.isShowPage = true
          }
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    // 根据当前的文件夹信息，获取对应的项目信息
    getProject: function () {
      this.$http.post('index/file/getproject', {
        // 传递文件夹id, 获取对应的项目信息
        id: this.FolderPop.id,
        userid: this.$store.state.userInfo.id
      }).then((res) => {
        // 返回文件夹中对应的项目信息
        if (res.data.code === 1) {
          let arr = []
          for (let i = 0; i < res.data.data.length; i++) {
            arr.push(res.data.data[i][0])
          }
          this.project = arr
        }
      })
    },
    // 获取当前文件夹中包含的子文件夹信息
    getFolderChilden: function () {
      this.$http.post('index/user/getdirnumber', {
        // 传递文件夹id, 获取对应的子文件夹信息
        'dirid': this.FolderPop.id
      }).then((res) => {
        // 返回当前子文件夹的信息
        for (let i = 0; i < res.data.data.length; i++) {
          this.Folder.push(res.data.data[i][0])
        }
      })
    },
    // 触发搜索功能，判断是否存在内容，存在则调用搜索接口
    reloadfunc (search, type) {
      this.searchPages.page = 1
      this.searchPages.keyWords = search
      this.searchPages.type = type
      if (search) {
        this.searchfunc()
      }
    },
    searchfunc () {
      this.$http.post('/index/index/search', {
        'key': this.searchPages.keyWords,
        'userid': this.$store.state.userInfo.id,
        'type': this.searchPages.type,
        'phone': this.$store.state.userInfo.phone,
        'page': this.searchPages.page
      }).then((res) => {
        let data = res.data
        if (data.code === 1) {
          this.project = data.data.list
          this.searchPages.count = data.data.count
        } else {
          this.$Message.warning('没有找到呢')
        }
      }).catch(() => {})
    },
    changevalue (name) {
      // this.type为1的时候代表选择了名称，为2的时候代表选择了日期
      this.checkAll = false
      this.type = name
      this.sourcePages.page = 1
      this.getData()
    },
    loadNameSort () {
      this.$http.post('index/file/dirnameSort', {
        id: this.FolderPop.id,
        userid: this.$store.state.userInfo.id
      }).then(res => {
        if (res.data.code === 1) {
          // let arr = []
          // for (let i = 0; i < res.data.data.length; i++) {
          //   arr.push(res.data.data[i][0])
          // }
          this.project = res.data.data.list
        }
      })
    },
    loadsoure (type) {
      this.$http.post('index/file/dirnameSort', {
        id: this.FolderPop.id,
        userid: this.$store.state.userInfo.id
      }).then(res => {})
    }
  },
  components: {
    itemListTitle,
    itemListSubtitle,
    itemListFolder,
    ItemListContent,
    itemListContentCreate,
    itemListContentEditor,
    itemListdeletaFile,
    itemListModal,
    itemListPage,
    itemListInvite
  }
}
</script>
<style lang="scss" scoped>
.folder-Content {
  display: flex;
  margin: 0 165px 50px 165px;
}
.folder-left {
  flex: 1;
  float: left;
  width: 100%;
}
// .folder-right {
//   padding-left: 20px;
//   margin-top: 38px;
//   width: 27%;

//   .right__title {
//     font-size: 20px;
//     color: #0f2d3e;
//     margin-bottom: 15px;
//   }

//   .right__li  {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-top: 10px;
//     cursor: pointer;
//   }

//   .right__select {
//     width: 80px;
//     margin-right: 4px;

//     /deep/ .ivu-select-selection {
//       background-color: transparent;
//       border: none;
//     }

//     &.ivu-select-visible /deep/ .ivu-select-selection {
//       box-shadow: 0 0 0 0px
//     }
//     /deep/ .ivu-select-arrow {
//       margin-top: -9px;
//     }
//   }
//   .right__btn {
//     display: inline-block;
//     font-size: 12px;
//     color: #626262;
//     cursor: pointer;
//   }
// }
</style>
