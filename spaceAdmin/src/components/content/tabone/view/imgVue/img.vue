<template>
  <!-- 使用menu组件 -->
  <div @click="gotoedit">
     <div class="imgList">
      <div class="addImg">
        <Icon type="plus" size="40"></Icon>
      </div>
      <Icon type="help-circled" class="quest"></Icon>
    </div>
    <editConponent @parentcolsefunc="colsefunc" v-if="isedit" />
  </div>
</template>

<script>
import editConponent from '@/components/edit/edit'
export default {
  name: 'imgConponent',
  data () {
    return {
      isedit: ''
    }
  },
  methods: {
    colsefunc () {
      document.body.style.height = 'unset'
      document.body.style['overflow-y'] = 'auto'
      this.isedit = false
    },
    gotoedit () {
      document.body.style.height = '100vh'
      document.body.style['overflow-y'] = 'hidden'
      this.isedit = true
      // let editurl = localStorage.getItem('editurl')
      // window.location = editurl
    }
  },
  components: {
    editConponent
  }
}
</script>

<style lang="scss" scoped>
.imgList {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width:166px;
  height:166px;
  border-radius: 10px;
  border:1px dashed #CCCCCC;
  cursor: pointer;
  &:hover {
    border:1px dashed rgba(0,161,255,1);
  }
  .addImg {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #CCCCCC;
  }
  .quest {
    position: absolute;
    right:10px;
    top:10px;
    color:#CCCCCC
  }
}
.layout-nav>.ivu-menu-item {
  border-bottom:none;
}
.layout-nav>.ivu-menu-item:hover {
  border-bottom:none;
}
.layout-nav>.ivu-menu-item:hover .imgList:hover{
  border:1px dashed rgba(0,161,255,1);
}
.ivu-menu-horizontal.ivu-menu-light:after {
  width:0;
  height:0;
}
</style>
