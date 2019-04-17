<template>
<div class="dialog_container">
  <div class="dialog_box">
    <div class="dialog_body">
      <div class="dialog_content">
        <!-- title -->
        <h3 class="dialog_body-title">移动文件夹</h3>
        <!-- detail -->
        <div class="detail">
          <p>{{showFolderMoveIfJson.name}}</p>
          <p>Created {{showFolderMoveIfJson.addtime}}</p>
          <div class="Folder">
            <!-- 树形控件 -->
            <Tree :data="baseData" @on-select-change="choose"></Tree>
          </div>
        </div>
      </div>
      <!-- comfrim -->
      <div class="dialog_body-choose">
        <i-button shape="circle" size="large" @click="confirm">确认</i-button>
        <i-button shape="circle" size="large" @click="popClose">取消</i-button>
      </div>
      <!-- close btn-->
      <div class="dialog_body-close"  @click="popClose">
        <Icon type="close-round"></Icon>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'createProject',
  data () {
    return {
      baseData: [],
      MoveProjectMsg: this.EditorCreate ? this.EditorCreate : this.checkShowChange,
      // 建设用户选中的文件夹信息
      chooseFolder: [],
      // 是否可以继续进行操作
      isSuccess: true
    }
  },
  props: ['showFolderMoveIfJson'],
  created () {
    // 发送请求获取当前文件的数量及名字
    let json = this.$store.state.moveFolderProject
    // 判断当前文件夹的数量
    if (json.length <= 1) {
      this.$Message.error('当前文件夹已经是顶层目录')
      this.isSuccess = false
      return false
    }
    // 设置当前显示的文件夹信息
    for (let i = 0; i < json.length; i++) {
      this.baseData.push({
        expand: true,
        title: json[i].name,
        // 自定义文件夹id属性
        id: json[i].id
      })
    }
  },
  methods: {
    // 选择树形控件值
    choose: function (data) {
      // 获取选中的文件夹id
      this.$data.chooseFolder = data
    },
    popClose: function () {
      this.$store.dispatch('FolderMove', false)
    },
    confirm () {
      if (!this.isSuccess) {
        this.$Message.error('您不能移动顶层文件夹')
        return false
      }
      if (this.$data.chooseFolder.length <= 0) {
        this.$Message.error('请选择要移动的文件夹')
        return false
      }
      if (this.showFolderMoveIfJson.id === this.chooseFolder[0].id) {
        this.$Message.error('操作无效')
        return false
      }
      // 获取用户要移动的项目id this.MoveProjectMsg
      this.$http.post('index/user/movedir', {
        // 当前的文件夹id:
        id: this.showFolderMoveIfJson.id,
        // 传递目标文件夹id
        dirid: this.chooseFolder[0].id
      }).then((res) => {
        this.$Message.success('移动成功')
        this.popClose()
        this.$store.dispatch('isRouterReload', true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog_container {
  display: block;
  width: 100%;
  width: 100vw;
  height: 100%;
  height: 100vh;
  background-color: rgba(24,82,94,.7);
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  .dialog_box {
    display: inline-block;
    border: 1px solid #ccc;
    text-align: left;
    vertical-align: middle;
    position: relative;
    box-shadow: 0 7px 8px -4px rgba(0,0,0,.2), 0 13px 19px 2px rgba(0,0,0,.14), 0 5px 24px 4px rgba(0,0,0,.12);
    .dialog_body {
      position: relative;
      width:26.6vw;
      min-width:258px;
      background-color: #fff;
      .dialog_body-choose {
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-start;
        align-items: center;
        width:100%;
        padding:20px 40px;
        button {
          padding:10px 45px;
          color:#fff;
          background: #2d8cf0;
          border-radius: 0;
        }
        button+button {
          margin-right:20px;
          background: #B3B4B6;
          color:#fff;
        }
      }
      .dialog_content {
        width: 100%;
        background: #fff;
        padding:15px;
        padding-bottom:0;
        box-sizing: border-box;
        .dialog_body-title {
          width:100%;
          height:auto;
          padding:15px;
          box-sizing: border-box;
          font-size:24px;
          color:#274A4B
        }
        .detail {
          width:100%;
          height:100%;
          padding:0px 15px;
          box-sizing: border-box;
          p:first-child {
            margin-top:0;
          }
          a {
            margin-left:5px;
          }
          p {
            font-size:14px;
            color:#8A8E8F;
            margin-top:5px;
          }
          .Folder {
            width:100%;
            height:56.5vh;
            border:1px solid #e0e0e0;
            margin-top:20px;
            padding:0 8px;
            box-sizing: border-box;
          }
        }
      }
      .dialog_body-close {
        position: absolute;
        top:15px;
        right:15px;
        color:#274A4B;
        cursor:pointer;
      }
    }
  }
}
.dialog_container:after {
  display: inline-block;
  content: '';
  width: 0;
  height: 100%;
  vertical-align: middle;
}
</style>
