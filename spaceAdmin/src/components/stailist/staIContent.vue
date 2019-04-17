<template>
  <div>
    <stailistHeader @key="key = arguments[0]" />
    <stainumCon />
    <staiprojectlist />
    <div class="pagediv">
      <!-- <Page :current="stanum" @on-change="valuechange" class="pagebox" :total="sums" v-if="sums !== 0"></Page> -->
      <ItemListPage :current="stanum" :count="sums" @pagechange="valuechange" v-if="sums !== 0"/>
      <nosoureComponent v-else :title="title"/>
    </div>
  </div>
</template>

<script>
import stailistHeader from './stailistHeader'
import stainumCon from './stainumCon'
import staiprojectlist from './staiprojectlist'
import nosoureComponent from '../common/nosoureComponent'
import ItemListPage from '@/components/list/itemlist/ItemListPage'
export default {
  name: 'staIContent',
  data () {
    return {
      sums: 0,
      title: '数据加载中',
      obj: {
        0: 100,
        1: 30,
        2: 7
      },
      key: 0
    }
  },
  components: {
    stailistHeader,
    stainumCon,
    staiprojectlist,
    nosoureComponent,
    ItemListPage
  },
  created () {
    this.loadsoure()
  },
  computed: {
    sum: function () {
      return this.$store.state.statobj
    },
    stanum () {
      return this.$store.state.stanum || 1
    },
    selectType () {
      return this.$store.state.stailList.selectType
    }
  },
  watch: {
    sum (newVal) {
      this.sums = newVal.count_total
      if (this.sums === 0) {
        this.title = ''
      }
    },
    key (neVal) {
      this.loadsoure()
    },
    selectType () {
      this.loadsoure()
    }
  },
  methods: {
    valuechange (page) {
      this.$store.dispatch('stanum', page)
      this.loadsoure()
    },
    loadsoure () {
      let selectType = this.selectType === 'name' ? 1 : 2
      let src = 'index2/statistics/visitlist'
      this.$http.post(src, {
        time_horizon: this.obj[this.key],
        page: this.stanum,
        limit_num: 10,
        is_excel: 0,
        sort_type: selectType
      }).then((res) => {
        if (res.data.code === 200) {
          let data = res.data
          if (res.data.message === '无数据') {
            data.data.count_total = 0
            data.data.type_1_total = 0
            data.data.type_2_total = 0
          }
          this.$store.dispatch('statobj', data.data)
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pagediv{
  text-align: center;
  margin-bottom:60px;
  .pagebox{
    padding: 13px;
    margin: 0 auto;
    display: inline-block;
  }
}
</style>
