<template>
  <div class="list">

    <headerConponent />
    <cloundConponent />
    <router-view />
  </div>
</template>

<script>
import headerConponent from '@/components/common/header/headComp/headerConponent'
import cloundConponent from '@/components/common/header/headComp/cloundConponent'
export default {
  name: 'listConponent',
  components: {
    headerConponent,
    cloundConponent
  }
}
</script>

<style lang="scss" scoped>
.list {
  background: #efefef;
  height: 100%;
}
</style>
