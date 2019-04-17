<template>
  <div>
    <stainavhead />
    <staiprojectitem v-for="(json, index) in list" :json="json" :key="index" />
  </div>
</template>

<script>
import staiprojectitem from './staiprojectitem'
import stainavhead from './stainavhead'
export default {
  name: 'staiprojectlist',
  components: {
    staiprojectitem,
    stainavhead
  },
  computed: {
    list () {
      return this.$store.state.statobj.list
      // let page = this.$store.state.stanum
      // let num = (page - 1) * 10
      // let maxnum = page * 10
      // if (maxnum > this.$store.state.statobj.list.length) {
      //   return this.$store.state.statobj.list.slice(num)
      // } else {
      //   return this.$store.state.statobj.list.slice(num, maxnum)
      // }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
