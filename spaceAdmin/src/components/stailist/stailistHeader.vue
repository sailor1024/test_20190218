<template>
  <div>
    <!-- <div class="titleheader">
      <div class="left">
        <a>所有项目</a>
      </div>
      <div class="right">
        <a>选择文件夹</a>
      </div>
    </div> -->
    <div class="typebox">
      <div class="left">
        <button
          @click="selectfunc1"
          class="c-button c-button__primary--radius"
          :class="select1 === true ? '' : 'c-button--text'">永久</button>
        <button
          @click="selectfunc2"
          class="c-button c-button__primary--radius"
          :class="select2 === true ? '' : 'c-button--text'">30天内</button>
        <button
          @click="selectfunc3"
          class="c-button c-button__primary--radius"
          :class="select3 === true ? '' : 'c-button--text'">7天内</button>
      </div>
      <div class="right">
        <!-- <a @click="downloadExecel">导出数据</a> -->
        <button @click="downloadExecel" class="c-button c-button__primary--radius">导出数据</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'stailistHeader',
  data () {
    return {
      'select1': true,
      'select2': false,
      'select3': false,
      pagesObject: {
        page: 1,
        count: 1
      },
      obj: {
        0: 100,
        1: 30,
        2: 7
      }
    }
  },
  computed: {
    selectType () {
      return this.$store.state.stailList.selectType
    },
    stanum () {
      return this.$store.state.stanum || 1
    }
  },
  methods: {
    selectfunc1 () {
      this.allnoselect()
      this.select1 = true
      // this.loadsoure(0)
      this.$emit('key', 0)
    },
    selectfunc2 () {
      this.allnoselect()
      this.select2 = true
      // this.loadsoure(1)
      this.$emit('key', 1)
    },
    selectfunc3 () {
      this.allnoselect()
      this.select3 = true
      // this.loadsoure(2)
      this.$emit('key', 2)
    },
    allnoselect () {
      this.$store.dispatch('stanum', 1)
      this.select1 = false
      this.select2 = false
      this.select3 = false
    },
    loadsoure (type) {
      // let src = this.selectType === 'name' ? 'index/index/countbyname' : 'index/index/countbytime'
      let src = 'index2/statistics/visitlist'
      this.$http.post(src, {
        time_horizon: this.obj[type],
        page: this.pagesObject.page,
        limit_num: 10,
        is_excel: 0
      }).then((res) => {
        if (res.data.code === 200) {
          let data = res.data
          this.$store.dispatch('statobj', data.data)
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    load (type) {
      let src = 'index/index/count_project'
      this.$http.post(src, {
        'type': type,
        'userid': this.$store.state.userInfo.id,
        'phone': this.$store.state.userInfo.phone
      }).then((res) => {
        let data = res.data
        this.$store.dispatch('statobj', data.data)
      }).catch(() => {
      })
    },
    downloadExecel () {
      let type
      if (this.select1) {
        type = 0
        // name = 'data-lifetime'
      } else if (this.select2) {
        type = 1
        // name = 'data-month'
      } else if (this.select3) {
        type = 2
        // name = 'data-week'
      }
      // window.open(`/index.php/index/index/excel?type=${type}&userid=${this.$store.state.userInfo.id}&phone=${this.$store.state.userInfo.phone}`)
      window.location.href = window.location.origin + `/index.php/index2/statistics/visitlist?time_horizon=${this.obj[type]}&page=1&limit_num=10&is_excel=1&_=${this.$store.state.userInfo.token}&sort_type=2`
      // this.$http.get('index2/statistics/visitlist', {
      //   params: {
      //     time_horizon: this.obj[type],
      //     page: this.pagesObject.page,
      //     limit_num: 10,
      //     is_excel: 1
      //   }
      // }).then(res => {
      //   if (res.data.code === 200) {}
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.titleheader{
  background-color: white;
  height: 70px;
  display: flex;
  border-bottom: 1px solid rgb(231, 231, 231);
  .left{
    flex: 1;
    position: relative;
    a{
      display: block;
      font-size:18px;
      color:rgba(0,161,255,1);
      position: absolute;
      bottom: 6px;
      left: 40px;
      &::after{
        contain: ' ';
        display: block;
        position: absolute;
        height: 5px;
        width: 111px;
        background-color: #00A1FF;
        bottom: 0px;
        left: 0px;
        right: 0px;
      }
    }
  }
  .right{
    width: 262px;
    border-left: 1px solid rgb(231, 231, 231);
    a{
      display: block;
      width: 231px;
      height: 34px;
      background-color: #00A1FF;
      font-size:14px;
      line-height: 34px;
      color:rgba(255,255,255,1);
      text-align: center;
      margin: 0 auto;
      border-radius: 5px;
      margin-top: 17px;
    }
  }
}
.typebox{
  padding: 0 35px;
  display: flex;
  margin-top: 36px;
  .left{
    flex: 1;
    a{
      margin-top: 16px;
      display: inline-block;
      vertical-align: top;
      height:34px;
      line-height: 34px;
      font-size:14px;
      color:rgba(98,98,98,1);
      padding: 0 31px;
    }
    .active{
      color: white;
      background-color: #00A1FF;
      border-radius: 2px;
    }
  }
  .right{
    width: 262px;
    text-align: right;
    a{
      display: block;
      width: 231px;
      height: 34px;
      background-color: #00A1FF;
      font-size:14px;
      line-height: 34px;
      color:#fff;
      text-align: center;
      margin: 0 auto;
      border-radius: 2px;
      margin-top: 17px;
    }
  }
}
</style>
