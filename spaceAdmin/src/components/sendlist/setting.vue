<template>
  <div class="list">
    <headerConponent />
    <settingColund />
    <settingContent />
  </div>
</template>

<script>
import headerConponent from '@/components/common/header/headComp/headerConponent'
import settingColund from './settingComp/settingColund'
import settingContent from './settingComp/settingContent'
export default {
  name: 'setting',
  components: {
    headerConponent,
    settingColund,
    settingContent
  }
}
</script>

<style lang="scss" scoped>
.list {
  background: #efefef;
}
</style>
