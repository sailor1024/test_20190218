<template>
  <div id="tabBar">
    <div class="editbtn">
      <!-- <a @click="gotofunc" v-if="$store.state.json.edit_type === 2 ? true : false">编辑</a> -->
      <button
        style="padding: 11px 25px;"
        @click="gotofunc"
        v-if="$store.state.json.edit_type === 2 ? true : false"
        class="c-button c-button__primary--radius">编辑</button>
    </div>
    <!-- <Tabs :value="$route.name" @on-click="selectfunc">
      <TabPane class="tabphone" label="媒体" name="tabone">
      </TabPane>
      <TabPane class="tabphone" label="详细信息" name="tabtwo">
      </TabPane> -->
      <!-- <TabPane class="tabphone" label="应用" name="tabthr"> -->
        <!-- <tabthrConponent /> -->
      <!-- </TabPane> -->
      <!-- <TabPane class="tabphone" label="数据统计" name="tabfou">
      </TabPane>
    </Tabs> -->
    <div style="margin-bottom: 24px;">
      <button
        @click="selectfunc('tabone')"
        :class="{'c-button--text': $route.name !== 'tabone'}"
        class="c-button c-button__primary--radius">媒体</button>
      <button
        @click="selectfunc('tabtwo')"
        :class="{'c-button--text': $route.name !== 'tabtwo'}"
        class="c-button c-button__primary--radius">详细信息</button>
      <button
        @click="selectfunc('tabfou')"
        :class="{'c-button--text': $route.name !== 'tabfou'}"
        class="c-button c-button__primary--radius">数据统计</button>
    </div>
    <router-view :json="json"/>
    <editConponent @parentcolsefunc="colsefunc" v-if="isedit" />
  </div>
</template>

<script>

// import taboneConponent from './tabone/taboneConponent'
// import tabthrConponent from './tabthr/tabthrConponent'
// import tabfouConponent from './tabfou/tabfouConponent'
// import tabtwoConponent from './tabtwo/tabtwoConponent'
import editConponent from '@/components/edit/edit'
export default {
  name: 'tabBarConponent',
  props: ['json'],
  data () {
    return {
      isedit: false,
      path: 2
    }
  },
  created () {
    this.path = 2
  },
  computed: {
    pathJson: function () {
      return this.$route.path
    }
  },
  watch: {
    pathJson: function (newVal) {
      if (this.$store.state.json.edit_type === 2) {
        if (newVal === '/home' || newVal === '/home/') {
          this.path = 2
        } else {
          this.path = 1
        }
      }
    }
  },
  methods: {
    gotofunc () {
      document.body.style.height = '100vh'
      document.body.style['overflow-y'] = 'hidden'
      this.isedit = true
    },
    colsefunc () {
      document.body.style.height = 'unset'
      document.body.style['overflow-y'] = 'auto'
      this.isedit = false
      this.$store.dispatch('resetiFramPage', true)
    },
    selectfunc (name) {
      console.log(name)
      this.$router.push({
        name: name,
        query: {
          id: this.$route.query.id
        }
      })
    }
  },
  components: {
    editConponent
  }
}
</script>

<style lang="scss">
#tabBar{
  position: relative;
  .editbtn{
    display: block;
    position: absolute;
    right: 0;
    top: 5px;
    bottom: 0;
    width: 80px;
    height: 37px;
    z-index: 10;
    a{
      cursor: pointer;
      display: block;
      width: 100%;
      height: 32px;
      border-radius: 4px;
      line-height: 35px;
      text-align: center;
      background-color: #00A1FF;
      color: white;
      font-size: 14px;
      &:hover{
        background-color: #00A1FF;
        color: white;
      }
    }
  }
  .tabphone{
    background:rgba(255,255,255,1);
    box-shadow:2px 2px 2px 0px rgba(0,0,0,0.1);
  }
  background-color: #F1F1F1;
  .ivu-tabs-bar{
    border-bottom: 3px solid #00A1FF;
    margin-bottom: 0px;
  }
  .ivu-tabs:after{
    display: none;
  }
  .ivu-tabs-ink-bar{
    display: none;
  }
  .ivu-tabs-nav{
    .ivu-tabs-tab{
      min-width: 80px;
    }
    .ivu-tabs-tab-active {
      min-width: 80px;
      text-align: center;
      color: white;
      background-color: #00A1FF;
      border-radius: 10px 10px 0px 0px;
    }
  }

}
</style>
