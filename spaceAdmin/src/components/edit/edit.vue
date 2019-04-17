<template>
  <div class="box">
    <div class="demo-spin-container" v-if="isupload">
      <Spin fix>
        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
        <div>资源上传中...</div>
      </Spin>
    </div>
    <a class="colsebtn" @click.stop="parentcolsefunc"><Icon style="margin-top:10px;" color="#fff" size=24 type="close-circled"></Icon></a>
    <div class="iframe" @click.stop.prevent="clickStop">
      <iframe ref="iframe" name="htmliframe" :src="src"></iframe>
    </div>
  </div>
</template>
<script>
export default {
  name: 'editComponent',
  data () {
    return {
      isupload: false
    }
  },
  created () {
    window.onmessage = (e) => {
      let data = e.data
      this.datafunc(data)
    }
  },
  destroyed () {
    window.onmessage = null
  },
  methods: {
    clickStop () {
      this.parentcolsefunc()
    },
    parentcolsefunc () {
      this.$emit('parentcolsefunc', 'close')
    },
    datafunc (data) {
      switch (data) {
        case 'sendsuc' :
          this.$Notice.success({
            title: '发布成功'
          })
          break
        case 'deleteImage' :
          this.$Notice.success({
            title: '删除成功'
          })
          break
        case 'setInitial' :
          this.$Notice.success({
            title: '设置初始图片成功'
          })
          break
        case 'setInitialagain' :
          this.$Notice.success({
            title: '请勿重复设置初始图片'
          })
          break
        case 'savesuccess' :
          this.$Notice.success({
            title: '保存成功'
          })
          break
        case 'nodesbute' :
          this.$Notice.info({
            title: '请输入描述'
          })
          break
        case 'nofile' :
          this.$Notice.info({
            title: '请选择文件资源'
          })
          break
        case 'uploading' :
          this.isupload = true
          break
        case 'uploadsuccess' :
          this.isupload = false
          this.$Notice.success({
            title: '文件资源上传成功'
          })
          break
        case 'uploadfail' :
          this.isupload = false
          this.$Notice.warning({
            title: '文件资源上传失败,请重试'
          })
          break
        case 'Screenshot' :
          this.isupload = false
          this.$Notice.success({
            title: '截屏成功'
          })
          break
        case 'startRuler' :
          this.$Notice.info({
            title: '开始测量'
          })
          break
        case 'endRuler' :
          this.$Notice.info({
            title: '停止测量'
          })
          break
        case 'CannotPlay':
          this.$Notice.warning({
            title: '无法开启此按钮，请先截图'
          })
          break
        case 'NotAbbreviated':
          this.$Notice.warning({
            title: '无法开启此按钮，请先截图'
          })
      }
    }
  },
  computed: {
    src () {
      return localStorage.getItem('editurl') + '&_=' + this.$store.state.userInfo.token
    }
  }
}
</script>

<style lang="scss" scoped>
.ivu-spin-fix{
  background-color: rgba(1, 1, 1, 0.3);
}
.demo-spin-container{
  background-color: transparent;
  display: block;
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 999;
}
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
.demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
}
.colsebtn{
  position: absolute;
  right: 3vw;
  width: 100px;
  height: 40px;
  // background-color: rgb(0, 161, 255);
  line-height: 40px;
  text-align: right;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}
.box{
  position: fixed;
  z-index: 100;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(1, 1, 1, 0.6);
  .iframe{
    width: 100%;
    height: 100%;;
    padding: 2.5vh 5vw;
    iframe{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
