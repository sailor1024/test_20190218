<template>
  <div class="cloundbox">
    <div style="width:100%;height:100%">
      <blockquote>
        <span class="c-brumns__span" @click="fly">云空间</span>
        <template v-if="routeObj.path==='/' || routeObj.name==='folder'">
          <span
            @click="routeFolder(item.path_id)"
            class="c-brumns__span"
            v-for="(item, index) in pathList"
            :key="index">{{item.path_name}}</span>
        </template>
      </blockquote>
      <span class="clounbox-icon__make" style="cursor: default;margin-left: 3px;" v-if="routeObj.path==='/' || routeObj.name==='folder'">/</span>
        <Tooltip content="新建文件夹" style="margin-left: 25px;">
          <span @click.stop="popAddProject" v-if="routeObj.path==='/' || routeObj.name==='folder'" style=" width: 8px;"><Icon type="plus-round" size="16"></Icon></span>
        </Tooltip>
        <Tooltip content="新建文件夹" style="margin-left: 25px;">
          <span @click.stop="popAddProject" v-if="routeObj.path==='/' || routeObj.name==='folder'" style="width: 8px;"><Icon type="folder" size="16"></Icon></span>
        </Tooltip>
      <!-- 弹出添加项目 -->
      <create v-if="modal"/>
    </div>
  </div>
</template>

<script>
import create from './create'
export default {
  name: 'cloundConponent',
  data () {
    return {
      modal: this.$store.state.createTo
    }
  },
  methods: {
    fly: function () {
      this.$router.push({
        path: '/'
      })
    },
    popAddProject: function () {
      this.$store.dispatch('createTo', true)
      this.$data.modal = true
    },
    routeFolder (id) {
      this.$router.push({
        name: 'folder',
        params: {
          id
        }
      })
    }
  },
  components: {
    create
  },
  computed: {
    createToChange () {
      return this.$store.state.createTo
    },
    routeObj () {
      return this.$route
    },
    pathList () {
      const pathList = this.$store.state.pathList
      return pathList
    }
  },
  watch: {
    createToChange (newVal, oldVal) {
      this.$data.modal = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
.cloundbox{
  height:40px;
  background:rgba(255,255,255,1);
  span{
    display: block;
    float: left;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    // color: rgb(169, 169, 170);
    color: #00a1ff;
    &:hover i {
      // color:rgb(0, 161, 255) !important;
      color:rgba($color: #00a1ff, $alpha: .5)
    }
  }
  .c-brumns__span:nth-of-type(1){
    margin-left: 167px;
    // width:45px;
    font-size:13px;
    // font-family:PingFang-SC-Medium;
    color:rgb(0, 161, 255);
    &:hover {
      color:rgba($color: #00a1ff, $alpha: .8)
    }
  }
  // span:nth-of-type(3){
  //   width: 20px;
  //   margin-left:5px;
  // }
  // span:nth-of-type(4){
  //   width: 20px;
  // }
  /deep/ .ivu-tooltip-inner {
    color: #FEFEFE;
    min-height: 25px;
    padding: 8px 16px;
    background-color: rgba($color: #00A1FF, $alpha: .3);
    box-shadow:0px 1px 3px 0px rgba(0,161,255,0.3);
  }
  /deep/ .ivu-tooltip-popper[x-placement^=bottom] .ivu-tooltip-arrow {
    display: none;
  }
  /deep/ .ivu-tooltip-popper {
    top: 92px !important;
  }
}
.c-brumns__span {
  font-size: 13px;
  &:not(:last-child)::after {
    content: '/';
    font-size: 16px;
    line-height: 40px;
    margin: 0 4px;
    cursor: default;
    // color: rgb(169, 169, 170);
    color:rgb(0, 161, 255);
  }
  &:hover {
      color:rgba($color: #00a1ff, $alpha: .8)
  }
}
.clounbox-icon__make {
  i {
    color: #00a1ff;
    &:hover {
      color: rgba($color: #00a1ff, $alpha: .8)
    }
  }
}

</style>
