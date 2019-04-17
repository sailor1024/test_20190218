<template>
  <div class="userlistComp" :class="json !== 3 ? '' : 'active'">
    <usermenue @select-type="selectType = arguments[0]" />
    <userlistitem v-for="(json, index) in list" :key="index" :json="json" :jsonIf="iconShow"/>
    <userlistActivation v-if="activationIf"/>
    <userlistDelete v-if="deleteIf"/>
    <nosoureComponent :title="title" v-if="list.length <= 0"/>
  </div>
</template>

<script>
import userlistitem from './userlistitem'
import usermenue from './usermenue'
import userlistActivation from './userlistActivation'
import userlistDelete from './userlistDelete'
// 暂无图片
import nosoureComponent from '@/components/common/nosoureComponent'
export default {
  name: 'userlistConponent',
  props: ['json'],
  data () {
    return {
      'list': [],
      title: '',
      issoure: false,
      activationIf: false,
      deleteIf: false,
      iconShow: parseInt(sessionStorage.getItem('key')) || 0,
      selectType: 2, // 1为选择姓名，2为选择日期
      ajaxObj: {
        0: 'index2/user/reception',
        1: 'index2/user/wait_reception',
        2: 'index2/user/delete_reception'
      }
    }
  },
  computed: {
    deleteCollaborator: function () {
      return this.$store.state.deleteCollaborator
    },
    userTabsChange: function () {
      return this.$store.state.userTabs
    },
    activationIfChange: function () {
      return this.$store.state.activationIf
    },
    userid () {
      return this.$store.state.userInfo.id
    },
    phone () {
      return this.$store.state.userInfo.phone
    }
  },
  watch: {
    deleteCollaborator (newVal) {
      this.deleteIf = newVal
    },
    userTabsChange (newVal) {
      this.iconShow = parseInt(newVal)
      // this.requestDelete(parseInt(newVal))
      this.loadData()
    },
    activationIfChange (newVal) {
      if (newVal) {
        this.activationIf = true
      } else {
        this.activationIf = false
      }
    },
    selectType (newVal) {
      this.loadData()
    }
  },
  created () {
    // let key
    // if (!sessionStorage.getItem('key')) {
    //   key = 0
    // } else {
    //   key = sessionStorage.getItem('key')
    // }
    // this.requestDelete(parseInt(key))
    this.loadData()
  },
  methods: {
    // 请求协助者数据
    requestUser () {
      this.$http.post('index2/items/reception', {
        company_id: this.$store.state.userInfo.company_id
      }).then((res) => {
        let data = res.data
        if (data.code === 200) {
          this.list = data.data
          this.$store.dispatch('activeUser', data.data)
        }
        if (this.list.length === 0) {
          this.issoure = true
          this.title = ''
        }
      }).catch(() => {})
    },
    // 请求有待删除者数据
    // 0为使用中，1为未激活， 3为以删除
    requestDelete (newVal) {
      this.title = '数据加载中'
      if (newVal === 0) {
        // 活性
        this.requestUser()
      } else if (newVal === 1) {
        // 有待
        this.$http.post('/index/user/waitreception', {
          'userid': this.$store.state.userInfo.id
        }).then((res) => {
          this.list = res.data.data
          this.title = ''
        })
      } else {
        // 删除
        // this.$http.post('/index/user/faildelete', {
        this.$http.post('/index/user/deletebytime', {
          'userid': this.$store.state.userInfo.id
        }).then((res) => {
          this.list = res.data.data
          this.title = ''
        })
      }
    },
    loadData () {
      this.title = '数据加载中'
      const queryParams = {}
      queryParams.company_id = this.$store.state.userInfo.company_id
      queryParams.user_type = this.$store.state.userInfo.user_type
      queryParams.type = this.selectType
      const url = this.ajaxObj[this.iconShow]
      this.$http.post(url, queryParams).then((res) => {
        if (res.data.code === 200) {
          const temArray = res.data.data
          temArray.forEach(item => {
            item.key = this.iconShow
          })
          this.list = temArray
          if (this.iconShow === 0) {
            this.$store.dispatch('activeUser', this.list)
          }
          if (this.list.length === 0) this.issoure = true
          this.title = ''
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }
  },
  components: {
    userlistitem,
    usermenue,
    userlistActivation,
    userlistDelete,
    nosoureComponent
  }
}
</script>

<style lang="scss" scoped>
.userlistComp{
  margin:0;
  &.active {
    background: transparent
  }
}
</style>
