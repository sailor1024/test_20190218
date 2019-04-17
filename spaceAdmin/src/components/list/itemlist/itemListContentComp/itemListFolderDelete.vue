<template>
<div class="dialog_container">
  <itemListFolderConfirm v-if="deleteFolderIf" :json="json"/>
  <div class="dialog_box">
    <div class="dialog_body">
      <div class="dialog_content">
        <!-- title -->
        <h3 class="dialog_body-title" >删除文件夹</h3>
        <!-- detail -->
        <div class="detail">
          <p>{{json.name}}</p>
          <p >创建于 {{json.create_time | desbute}}</p>
          <div class="Folder">
            <!-- 树形控件 -->
            <Tree :data="baseData" @on-select-change="choose"></Tree>
          </div>
        </div>
      </div>
      <!-- delete Msg -->
      <p class="deleteMsg">这将删除文件夹及其所有内容</p>
      <!-- comfrim -->
      <div class="dialog_body-choose">
        <button class="c-button c-button__default" @click="popClose">取消</button>
        <button class="c-button c-button__primary" @click="confirm">确定</button>
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
import itemListFolderConfirm from './itemListFolderConfirm'
export default {
  name: 'createProject',
  data () {
    return {
      baseData: [],
      // 文件夹信息
      json: '',
      chooseFolder: '',
      deleteFolderIf: false,
      FolderMsg: []
    }
  },
  components: {
    itemListFolderConfirm
  },
  computed: {
    deleteFolderIfChange: function () {
      return this.$store.state.deleteFolderIf
    }
  },
  watch: {
    deleteFolderIfChange (newVal) {
      this.$data.deleteFolderIf = newVal
      if (!newVal) {
        this.popClose()
        // 路由刷新
        // this.$store.dispatch('FolderJudgment', true)
        // 路由跳转
        // this.$router.push({
        //   path: '/'
        // })
      }
    }
  },
  filters: {
    desbute (val) {
      let arr = new Date(val)
      let time
      time = arr.getFullYear() + '年' + (arr.getMonth() + 1) + '月' + arr.getDate() + '日'
      return time
    }
  },
  created () {
    // 发送请求获取当前文件的数量及名字
    let json = this.$store.state.deleteFolderMsg
    this.json = this.$store.state.deleteFolderMsg
    // 设置当前显示的文件夹信息
    this.baseData.push({
      expand: true,
      title: json.dir_name,
      // 自定义文件夹id属性
      id: json.id
    })
  },
  methods: {
    // 选择树形控件值
    choose: function (data) {
      // 获取选中的文件夹id
      this.$data.chooseFolder = data
    },
    popClose: function () {
      this.$store.dispatch('deleteFolder', false)
    },
    confirm () {
      this.$store.dispatch('deleteFolderIf', true)
      this.$data.deleteFolderIf = true
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
    width: 30%;
    max-width: 400px;
    min-width: 337px;
    box-shadow: 0 7px 8px -4px rgba(0,0,0,.2), 0 13px 19px 2px rgba(0,0,0,.14), 0 5px 24px 4px rgba(0,0,0,.12);
    .dialog_body {
      position: relative;
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
      .deleteMsg {
        color:red;
        padding:15px 30px;
        box-sizing: border-box;
        font-size:14px;
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
