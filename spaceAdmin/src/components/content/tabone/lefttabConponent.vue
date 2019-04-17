<template>
  <div id="lefttab">
    <tabitemConponent @childchange="changevalue" v-for="(json,index) in list" :json="json" :key="index"></tabitemConponent>
  </div>
</template>

<script>
import tabitemConponent from './tabitemConponent'
export default {
  name: 'lefttabConponent',
  data () {
    return {
      list: [{
        name: '展示窗口',
        icon: 'cube',
        isselect: true,
        path: '/home'
      }, {
        name: '照片',
        icon: 'image',
        isselect: false,
        path: '/home/image'
      },
      //  {
      //   name: '视频',
      //   icon: 'play',
      //   isselect: false,
      //   path: '/home/video'
      // },
      {
        name: '平面视图',
        icon: 'grid',
        isselect: false,
        path: '/home/view'
      }, {
        name: '下载项目',
        icon: 'ios-cloud-download',
        isselect: false,
        path: '/home/download'
      }]
    }
  },
  computed: {
    JsonMsg: function () {
      return this.$store.state.json
    }
  },
  // watch: {
  //   JsonMsg: function (newVal) {
  //     this.pop(newVal.edit_type)
  //   }
  // },
  mounted () {
    this.pop(this.JsonMsg.edit_type)
  },
  methods: {
    // 延迟操作
    pop (status) {
      let show = status
      if (show === 2 || this.$store.state.userInfo.user_type !== 3) {
      } else {
        for (let i = 0; i < 2; i++) {
          this.list.pop()
        }
      }
    },
    changevalue (json) {
      // if (json.isselect) return
      let array = this.list
      array.forEach((item, i, arr) => {
        item.isselect = false
        if (item.path === json.path) {
          item.isselect = true
          this.$router.push({
            path: item.path,
            query: {
              id: this.$route.query.id
            }
          })
        }
      })
      this.list = array
    }
  },
  components: {
    tabitemConponent
  }
}
</script>

<style lang="scss" scoped>
#lefttab{
  position: absolute;
  left: 0;
  padding-top: 32px;
  max-height: 100%;
  background-color: white;
  border-radius: 4px;
  // width: 77px;
  // box-shadow:1px 1px 2px 1px rgba(0,0,0,0.1);
}
</style>
