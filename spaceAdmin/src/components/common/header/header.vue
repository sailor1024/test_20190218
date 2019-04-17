<template>
  <div id="header">
    <headerConponent />
    <!-- 云空间导航 -->
    <clounnavConponent :title="title"/>
  </div>
</template>
<script>
import headerConponent from '@/components/common/header/headComp/headerConponent'
import clounnavConponent from '@/components/common/header/headComp/clounnavConponent'
export default {
  name: 'Header',
  props: ['title'],
  components: {
    clounnavConponent,
    headerConponent
  }
}
</script>
<style scoped lang="scss">
</style>
