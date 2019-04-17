<template>
  <div class="setting-content">
    <settingLeft />
    <settingRight v-if="show && changeShow === 0" @changeComp="change"/>
    <settingPrivacy v-else-if="changeShow === 1"/>
    <settingEditor v-else-if="changeShow === 2"/>
    <settingSpace v-else-if="changeShow === 3"/>
    <settingRightEditor v-else @changeComp="changeIf"/>
  </div>
</template>
<script>
import settingLeft from './settingLeft'
import settingRight from './settingRight'
import settingRightEditor from './settingRightEditor'
import settingPrivacy from './settingPrivacy'
import settingSpace from './settingSpace'
import settingEditor from './settingEditor'
export default {
  data () {
    return {
      show: true,
      changeShow: 0
    }
  },
  computed: {
    settingChange: function () {
      return this.$store.state.settingChange
    }
  },
  watch: {
    settingChange (newVal) {
      this.changeShow = newVal
    }
  },
  methods: {
    change: function (data) {
      this.show = false
    },
    changeIf (data) {
      this.show = true
    }
  },
  components: {
    settingLeft,
    settingRight,
    settingRightEditor,
    settingPrivacy,
    settingSpace,
    settingEditor
  }
}
</script>
<style scoped lang="scss">
.setting-content {
  margin: 37px 165px 0px 165px;
  display: flex;
  justify-content: space-between;
}
</style>
