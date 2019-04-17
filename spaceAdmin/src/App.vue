<template>
  <div id="app">
    <!-- <Upload action="http://localhost/spacephp/public/index.php/index/upload/file_test">
        <Button type="ghost" icon="ios-cloud-upload-outline">Upload files</Button>
    </Upload> -->
    <router-view v-if="isRouterActive"/>
    <!-- <div class="box">
      <div class="uploadbox">
        <Input v-model="uuid" placeholder="uuid" style="width: 300px"></Input>
        <Upload action="//todo.kangyun3d.com/index.php/index/upload/upload_file" name='file' :data="obj">
          <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
        </Upload>
      </div>
    </div> -->
  <itemListFolderDelete v-if="showDeleteIf"/>
  <itemListFolderRename v-if="FolderRenameIf" :FolderRenameMessage="FolderRenameMessage"/>
  <itemListModelFolder v-if="showModelFolderInvite" :inviteFolder="showModelFolderInviteJson"/>
  <itemListFolderMove v-if="showFolderMoveIf" :showFolderMoveIfJson="showFolderMoveIfJson"/>
  <itemListFolderConfirm v-if="deleteFolderIf"></itemListFolderConfirm>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      uuid: '',
      isRouterActive: true,
      showDeleteIf: false,
      FolderRenameIf: false,
      // 文件夹重命名信息
      FolderRenameMessage: [],
      // 文件夹用户邀请
      showModelFolderInvite: false,
      showModelFolderInviteJson: '',
      // 移动文件夹
      showFolderMoveIf: false,
      showFolderMoveIfJson: ''
    }
  },
  provide: {
    isReload: 'save'
  },
  methods: {
    reload () {
      this.isRouterActive = false
      this.$nextTick(function () {
        this.isRouterActive = true
        this.$store.dispatch('isRouterReload', false)
      })
    }
  },
  watch: {
    // 文件夹移动
    FolderMove: function (newVal) {
      this.showFolderMoveIf = newVal.isShow
      this.showFolderMoveIfJson = newVal.json
    },
    // 文件夹用户邀请
    ModelFolderInvite: function (newVal) {
      this.showModelFolderInvite = newVal.isShow
      this.showModelFolderInviteJson = newVal.json
    },
    // 文件夹重命名判断
    FolderRenameTo (newVal) {
      this.FolderRenameIf = newVal
    },
    // 删除文件夹
    deleteFolder (newVal) {
      this.showDeleteIf = newVal
    },
    isRouterReload: function (newVal) {
      this.reload()
    },
    // 文件夹重命名信息
    FolderRenameMsg (newVal) {
      this.FolderRenameMessage = newVal
    }
  },
  computed: {
    // 文件夹移动
    FolderMove: function () {
      return this.$store.state.FolderMove
    },
    // 文件夹用户邀请
    ModelFolderInvite: function () {
      return this.$store.state.ModelFolderInvite
    },
    // 文件夹重命名判断
    FolderRenameTo: function () {
      return this.$store.state.FolderRenameTo
    },
    FolderRenameMsg () {
      return this.$store.state.FolderRename
    },
    // 删除文件夹
    deleteFolder: function () {
      return this.$store.state.deleteFolder
    },
    isRouterReload () {
      return this.$store.state.isRouterReload
    },
    obj () {
      return {
        'name': this.uuid
      }
    },
    deleteFolderIf: function () {
      return this.$store.state.deleteFolderIf
    }
  },
  mounted () {
    this.$store.dispatch('userInfo', JSON.parse(localStorage.getItem('userInfo')))
  }
}
</script>

<style lang="scss">
// html{
//   font-family: OpenSansRegular, -apple-system,BlinkMacSystemFont,PingFang\ SC,Helvetica\ Neue,STHeiti,Microsoft\ Yahei,Tahoma,Simsun,sans-serif
// }
body {
  background: #efefef !important;
  &.bodyOf::-webkit-scrollbar {
    display: none;
    // width:8px;
  }
  &.bodyOf::-webkit-scrollbar-thumb {
    background: #495060;
  }
}
</style>
