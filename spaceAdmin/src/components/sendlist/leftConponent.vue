<template>
  <div class="sendlist">
    <sendmenue @select-type="select" />
    <sendlistConponent :list="list"/>
  </div>
</template>

<script>
import sendlistConponent from './sendlistConponent'
import sendmenue from './sendmenue'
export default {
  name: 'sendleftConponent',
  props: ['list'],
  components: {
    sendlistConponent,
    sendmenue
  },
  methods: {
    select (name) {
      this.$emit('select-type', name)
    }
  }
}
</script>

<style lang="scss" scoped>
.sendlist {
  position: relative;
}
</style>
