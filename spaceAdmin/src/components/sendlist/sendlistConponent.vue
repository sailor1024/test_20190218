<template>
  <div>
    <sendlistitem v-for="(json, index) in list" :json="json" :key="index"/>
  </div>
</template>

<script>
import sendlistitem from './sendlistitem'
export default {
  name: 'sendlistConponent',
  props: ['list'],
  components: {
    sendlistitem
  }
}
</script>

<style lang="scss" scoped>

</style>
