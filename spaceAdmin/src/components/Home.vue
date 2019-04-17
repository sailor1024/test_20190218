<template>
  <div id="home">
    <Header class="header" :title="titlestr"></Header>
    <mainConponent class="maincontent" :json="json"></mainConponent>
  </div>
</template>

<script>
import Header from './common/header/header'
import mainConponent from './content/mainConponent'
export default {
  name: 'Home',
  data () {
    return {
      value: ''
    }
  },
  computed: {
    titlestr () {
      if (this.json.title) {
        return {
          title: this.json.title,
          id: this.json.id
        }
      }
      return ''
    },
    json () {
      return this.$store.state.json
    }
  },
  created () {
    this.$http.post('index2/items/space_detil', {
      'id': this.$route.query.id
    }).then((res) => {
      let data = res.data
      if (data.code === 200) {
        this.$store.dispatch('json', data.data)
        sessionStorage.setItem('jsonMsg', JSON.stringify(data.data))
        // this.getModelJson(this.json.dirname)
        let itemid = this.$route.query.id
        let editurl = this.$imgURL + this.json.edit_url + '&tn=' + this.json.dirname + '&itemid=' + itemid + '&t=' + new Date().getTime()
        localStorage.setItem('editurl', editurl)
      } else {
        this.$message.error('出错了,请重试')
      }
    })
  },
  methods: {
    getModelJson: function (data) {
      // 请求判断
      // let url = 'https://space.kangyun3d.cn/edit/path/' + data + '/model.json'
      let url = window.location.origin + '/edit/path/' + data + '/model.json'
      this.$http.get(url).then((res) => {
        // success
      }).catch((error) => {
        console.log(error)
        this.postCopyJson(data)
        return false
      })
    },
    postCopyJson: function (data) {
      this.$http.get('index/upload/start_copy?dirname=' + data + '', {
      }).then((res) => {
        // success
      })
    }
  },
  components: {
    Header,
    mainConponent
  }
}
</script>

<style lang="scss" scoped>
</style>
