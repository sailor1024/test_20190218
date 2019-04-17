<style lang="scss">
.itemList{
  position: relative;
  margin: 0 165px;
  // @media screen and (min-width: 992px) {
  //   margin-left: 154px;
  //   margin-right:174px;
  // }
  // @media screen and (max-width: 1120px) {
  //   margin-left: 70px;
  //   margin-right:70px;
  // }
  padding-bottom: 60px;
  &>.itemList-contentBox:nth-last-child(2) {
    .ivu-card {
      border: 1px solid #dddee1;
    }
  }
}
.nosoure{
  width: 300px;
  height: 100px;
  line-height: 100px;
  font-size: 14px;
  text-align: center;
  margin: 0 auto;
}
</style>

<template>
<div class="itemList">
  <Spin v-if="isShowLoading" fix></Spin>
  <item-list-modal v-if="inviteIf" :inviteProject="inviteProject"></item-list-modal>
  <item-list-title @childchange="reloadfunc"></item-list-title>
  <item-list-subtitle
    v-if="issoure"
    :originalityData="{files: CreateFolderMsg, projects: list}"
    @childchange="changevalue"
    @changeCheckStatus="checkAllAction"
    @changeShowContentCreate="showCreateIf=arguments[0]"
    :isCheckAll="checkAll"
    :folderItems="selectFolderArr"
    :projectItems="selectProjectArr"></item-list-subtitle>
  <itemListFolder
    :page="somePage"
    :isCheckAll="checkAll"
    @putInfo="transformFolderItem"
    @getThisInfo="EditorCreate=arguments[0]"
    @changeShowContentCreate="showCreateIf=arguments[0]"
    v-for="(json, index) in CreateFolderMsg"
    :json="json"
    :key="index + 'a'"/>
  <!-- 文件夹重命名 -->
  <!-- <itemListFolderRename v-if="FolderRenameIf" :FolderRenameMessage="FolderRenameMessage"/> -->
  <item-list-content
    :page="somePage"
    @putInfo="transformProjectItem"
    @changeShowContentCreate="showCreateIf=arguments[0]"
    @getThisInfo="EditorCreate=arguments[0]"
    :isCheckAll="checkAll"
    v-for="(json, index) in list"
    :json="json"
    :key="index"></item-list-content>
  <item-list-page
    :pageSize="sourcePage.pageSize"
    :current="sourcePage.page"
    :count="countnum"
    v-if="issoure && isShowSourcePage"
    @pagechange="sourechange"></item-list-page>
  <item-list-page :count="searchPages.count" v-if="isShowSearchPage" @pagechange="loadSearch"></item-list-page>
  <nosoureComponent v-if="!issoure"/>
  <itemListContentEditor v-if="EditorProjectIf" :EditorProject="EditorProject"/>
  <itemListContentCreate
    :projectItems="selectProjectArr"
    :FolderItems="selectFolderArr"
    @changeShowContentCreate="showCreateIf=arguments[0]"
    v-if="showCreateIf"/>
  <itemListdeletaFile v-if="showDeleteFileIf" :showDeleteFileMsg="showDeleteFileMsg"/>
  <!-- <itemListModelFolder v-if="showModelFolderInvite" :inviteFolder="showModelFolderInviteJson"/> -->
  <!-- <itemListFolderMove v-if="showFolderMoveIf" :showFolderMoveIfJson="showFolderMoveIfJson"/> -->
</div>
</template>

<script>
import itemListTitle from './ItemListTitle'
import itemListContent from './ItemListContent'
import itemListPage from './ItemListPage'
import itemListSubtitle from './ItemListSubtitle'
import nosoureComponent from '@/components/common/nosoureComponent'
import itemListModal from './ItemListModal'
import itemListContentEditor from './itemListContentComp/itemListContentEditor'
import itemListContentCreate from './itemListContentComp/itemListContentCreate'
import itemListFolder from './itemListContentComp/itemListFolder'
import itemListdeletaFile from './itemListContentComp/itemListdeletaFile'
// import {getCookie} from '@/utils/utils'
// 文件夹用户邀请
// import itemListModelFolder from './itemListContentComp/itemListModelFolder'
// import itemListFolderMove from './itemListContentComp/itemListFolderMove'
export default {
  name: 'itemList',
  computed: {
    // // 文件夹用户邀请
    // ModelFolderInvite: function () {
    //   return this.$store.state.ModelFolderInvite
    // },
    deleteFileSpace: function () {
      return this.$store.state.deleteFileSpace
    },
    isShow: function () {
      return this.$store.state.showModal
    },
    showEditorTo: function () {
      return this.$store.state.showEditorTo
    },
    showCreateTo: function () {
      return this.$store.state.showCreateTo
    },
    // 创建的文件夹信息
    ListerMsgChange: function () {
      return this.$store.state.ListerMsg
    },
    // 检测文件夹是否被添加
    FolderJudgment: function () {
      return this.$store.state.FolderJudgment
    },
    somePage () {
      return this.searchPages.page + this.sourcePage.page
    },
    isShowFloder () {
      if (this.isShowSearchPage && this.searchPages.page === 1) {
        return true
      } else if (this.issoure && this.isShowSourcePage && this.sourcePage.page === 1) {
        return true
      }
      return false
    }
    // // 文件夹移动
    // FolderMove: function () {
    //   return this.$store.state.FolderMove
    // }
  },
  data () {
    return {
      isShowLoading: false,
      searchText: '',
      list: this.$store.state.Lister,
      type: 2,
      issoure: true,
      asignarr: [],
      checkItems: 0,
      checkAll: false,
      countnum: 0,
      // 邀请用户判断
      inviteIf: false,
      // 邀请用户项目信息
      inviteProject: '',
      // 项目编辑判断
      EditorProjectIf: false,
      // 编辑项目信息
      EditorProject: '',
      // 移动文件夹判断
      showCreateIf: false,
      // 移动文件夹信息
      EditorCreate: '',
      // 文件夹区域信息
      CreateFolderMsg: [],
      // 文件夹重命名
      FolderRenameIf: false,
      showDeleteFileIf: false,
      showDeleteFileMsg: '',
      // // 文件夹用户邀请
      // showModelFolderInvite: false,
      // showModelFolderInviteJson: '',
      // // 移动文件夹
      // showFolderMoveIf: false,
      // showFolderMoveIfJson: '',
      // search的分页
      isShowSearchPage: false,
      isShowSourcePage: true,
      // 搜索功能配置信息
      searchPages: {
        page: 1,
        count: 0,
        pageSize: 10
      },
      sourcePage: {
        page: 1,
        pageSize: 10
      },
      selectProjectArr: [],
      selectFolderArr: []
    }
  },
  watch: {
    // // 文件夹移动
    // FolderMove: function (newVal) {
    //   this.showFolderMoveIf = newVal.isShow
    //   this.showFolderMoveIfJson = newVal.json
    // },
    // // 文件夹用户邀请
    // ModelFolderInvite: function (newVal) {
    //   this.showModelFolderInvite = newVal.isShow
    //   this.showModelFolderInviteJson = newVal.json
    // },
    deleteFileSpace: function (newVal) {
      this.showDeleteFileIf = newVal.isShow
      this.showDeleteFileMsg = newVal.json
    },
    // 创建的文件夹信息
    ListerMsgChange: function (newVal) {
      this.CreateFolderMsg.push(newVal)
    },
    // 邀请用户
    isShow: function (newVal) {
      this.inviteIf = newVal.isShow
      this.inviteProject = newVal.json
    },
    // 编辑项目
    showEditorTo: function (newVal) {
      this.EditorProjectIf = newVal.isShow
      this.EditorProject = newVal.json
    },
    // 移动项目
    showCreateTo: function (newVal) {
      this.showCreateIf = newVal.isShow
      this.EditorCreate = newVal.json
    },
    // 文件夹是否被添加
    FolderJudgment (newVal) {
      // this.GetFolder()
      this.loadsoure()
    }
  },
  methods: {
    checkAllAction () {
      this.checkAll = !this.checkAll
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
    changevalue (name) {
      // this.type为1的时候代表选择了名称，为2的时候代表选择了日期
      this.checkAll = false
      this.type = name
      this.sourcePage.page = 1
      this.loadsoure(name)
    },
    sourechange (page) {
      this.checkAll = false
      this.sourcePage.page = page
      this.loadsoure(this.type, page)
    },
    loadSearch (page) {
      this.checkAll = false
      this.searchPages.page = page
      this.searchfunc()
    },
    // 触发搜索功能，判断是否存在内容，存在则调用搜索接口
    reloadfunc (search, type) {
      this.checkAll = false
      this.searchPages.page = 1
      this.searchPages.keyWords = search
      this.searchPages.type = type
      if (search) {
        this.isShowSearchPage = true
        this.isShowSourcePage = false
        this.searchfunc()
      } else {
        this.isShowSearchPage = false
        this.isShowSourcePage = true
        let arr = this.asignarr
        this.list = arr
        if (arr.length !== 0) {
          this.issoure = true
        } else {
          this.issoure = false
        }
      }
    },
    searchfunc (key, type, userid) {
      this.$http.post('/index/index/search', {
        'key': this.searchPages.keyWords,
        'userid': this.$store.state.userInfo.id,
        'type': this.searchPages.type,
        'phone': this.$store.state.userInfo.phone,
        'page': this.searchPages.page
      }).then((res) => {
        let data = res.data
        if (data.code === 1) {
          this.list = data.data.list
          this.searchPages.count = data.data.count
        } else {
          this.isShowSearchPage = false
          this.$Message.warning('没有找到呢')
        }
      }).catch(() => {})
    },
    // 获取项目信息
    loadsoure (type, page = 1) {
      this.$http.post('index2/index/space_list', {
        user_type: this.$store.state.userInfo.user_type,
        company_id: this.$store.state.userInfo.company_id,
        user_id: this.$store.state.userInfo.id,
        dir_father_id: 0,
        items_dir_id: 0,
        'page': page,
        limit_num: 10,
        type: this.type
        // '_': getCookie('token')
      }).then((res) => {
        this.isShowLoading = false
        let data = res.data
        if (data.code === 200) {
          this.list = data.data.items.data
          this.asignarr = data.data.items.data
          this.CreateFolderMsg = data.data.dir.data
          // 记录文件夹目录信息
          this.$store.dispatch('moveFolderProject', data.data.dir.data)
          // 记录当前文件夹的编辑权限
          this.$store.dispatch('folderEditType', data.data.edit_type)
          // 获取面包屑数组
          const pathList = res.data.data.all_path
          pathList.shift()
          this.$store.dispatch('pathList', pathList)
          // this.countnum = data.data.count
          this.countnum = data.data.count
          window.scrollTo(0, 0)
        } else {
          this.$Message.error(res.data.message)
        }
        if (this.list.length === 0 && this.CreateFolderMsg.length === 0) {
          this.issoure = false
        }
      })
    },
    // 选择名称调用
    loadNameSort (type, page = 1) {
      this.$http.post('/index/index/nameSort', {
        'userid': this.$store.state.userInfo.id,
        'type': type,
        'page': page,
        'phone': this.$store.state.userInfo.phone
      }).then((res) => {
        let data = res.data
        if (data.code === 1) {
          this.list = data.data.list
          this.asignarr = data.data.list
          this.countnum = data.data.count
        } else {
          this.$Message.error('出错了,请重试')
        }
        if (this.list.length === 0) {
          this.issoure = false
        }
      })
    },
    // 获取文件夹信息
    GetFolder () {
      this.$http.post('index/file/filelist', {
        // 传递用户id
        userId: this.$store.state.userInfo.id,
        phone: this.$store.state.userInfo.phone
      }).then((res) => {
        if (res.data.data.length > 0) {
          this.CreateFolderMsg = res.data.data
          // 记录文件夹目录信息
          this.$store.dispatch('moveFolderProject', res.data.data)
          this.getUserFolder()
        } else {
          this.getUserFolder()
        }
      })
    },
    // 获取邀请的合作者创建的文件夹
    getUserFolder () {
      this.$http.post('index/file/sonfilelist', {
        // 传递用户id
        'id': this.$store.state.userInfo.id
      }).then((res) => {
        // sessionStorage.setItem('projectMsg', JSON.stringify(res.data.data))
        if (res.data !== '') {
          setTimeout(() => {
            let arr = res.data.data
            for (let i = 0; i < arr.length; i++) {
              this.CreateFolderMsg.push(arr[i])
            }
          }, 100)
          // this.$store.dispatch('moveFolderProject', res.data.data)
        }
      })
    }
  },
  created () {
    this.isShowLoading = true
    this.loadsoure(this.type)
    // this.GetFolder()
    // this.$http.post('index/index/getuniqueimage', {
    //   userid: this.$store.state.userInfo.id
    // }).then((res) => {})
    // 补充的接口
    // this.$http.post('index/file/modelexiste', {
    //   'userid': this.$store.state.userInfo.id
    // }).then((res) => {})
    // 在这里必须进行设置当前文件夹信息为顶层目录
    localStorage.setItem('FolderJsonOnce', JSON.stringify(0))
  },
  destroyed () {
    this.$store.dispatch('showModal', false)
  },
  components: {
    itemListTitle,
    itemListSubtitle,
    itemListContent,
    itemListPage,
    nosoureComponent,
    itemListModal,
    itemListContentEditor,
    itemListContentCreate,
    itemListFolder,
    // itemListFolderDelete,
    itemListdeletaFile
    // itemListModelFolder,
    // itemListFolderMove
  }
}
</script>
