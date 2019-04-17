<template>
  <div class="sendlist">
    <div class="sendbox">
      <div class="leftbox">
        <Spin v-if="isShowLoading" fix></Spin>
        <header>
          <h4>公共空间</h4>
          <div class="rightbox">
            <sendrightConponent :list="count" />
          </div>
        </header>
        <sendleftConponent
          @select-type="changeSelectType"
          :list="list" />
        <nosoureComponent v-if="issoure" />
      <ItemListPage v-else :count="count" @pagechange="sourechange"/>
      </div>
    </div>
  </div>
</template>

<script>
import sendrightConponent from './rightConponent'
import sendleftConponent from './leftConponent'
import nosoureComponent from '@/components/common/nosoureComponent'
import ItemListPage from '@/components/list/itemlist/ItemListPage'
export default {
  name: 'sendlistConponent',
  data () {
    return {
      'list': [],
      issoure: false,
      count: '',
      isShowLoading: false
    }
  },
  computed: {
    publicProjectChange () {
      return this.$store.state.publicProject
    },
    selectType () {
      // time为日期，name为名称
      return this.$store.state.sendList.selectType
    }
  },
  watch: {
    publicProjectChange (newVal) {
      if (newVal === true) {
        this.loadData()
        this.$store.dispatch('publicProject', false)
      }
    },
    selectType (newVal) {
      this.loadData()
    }
  },
  methods: {
    changeSelectType (type) {
      this.$store.dispatch('updateSendListSelectType', type)
    },
    sourechange (page) {
      this.loadData(page)
    },
    load (page = 1) {
      this.$http.post('index/index/has_send_list', {
        'userid': this.$store.state.userInfo.id,
        'page': page,
        'phone': this.$store.state.userInfo.phone
      }).then((res) => {
        let data = res.data
        if (data.code === 1) {
          this.list = data.data.data
          this.count = data.data.num
          if (this.list.length === 0) this.issoure = true
        } else {
          this.$Message.error('你没有发布的项目')
          this.issoure = true
        }
      }).catch((err) => {
        console.log(err)
        this.$Message.error('出错了,请重试')
      })
    },
    loadData (page = 1) {
      this.isShowLoading = true
      let sortType = this.selectType === 'name' ? 1 : 2 // 排序类型，1：名字，2：时间
      this.$http.post('index2/publicspace/sortspace', {
        limit_num: 10,
        'page': page,
        company_id: this.$store.state.userInfo.company_id,
        sort_type: sortType
      }).then(res => {
        this.isShowLoading = false
        let data = res.data
        if (data.code === 200) {
          this.list = data.data.list
          this.count = data.data.total
          if (this.list.length === 0) {
            this.issoure = true
          } else {
            this.issoure = false
          }
        } else {
          this.$Message.error(res.data.message)
          this.issoure = true
        }
      }).catch(err => {
        console.log(err)
        this.$Message.error('出错了，请重试')
      })
    }
  },
  created () {
    this.loadData()
  },
  components: {
    sendleftConponent,
    sendrightConponent,
    nosoureComponent,
    ItemListPage
  }
}
</script>

<style lang="scss" scoped>
.sendlist{
  position: relative;
  padding-bottom: 20px;
  .sendbox{
    margin: 0px 165px;
    display: flex;
    @media screen and (max-width: 1120px) {
      margin: 0px 70px;
    }
    .leftbox{
      position: relative;
      margin-top: 40px;
      flex: 1;
      header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        h4{
          // margin-top: 40px;
          margin-bottom: 31px;
          height:37px;
          font-size:26px;
          color:#333333;
          line-height:37px;
        }
      }
    }
  }
}

@media screen and (max-width: 1100px) {
  .rightbox{
    width: 120px !important;
  }
}
</style>
