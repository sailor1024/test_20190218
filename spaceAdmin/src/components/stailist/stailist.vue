<template>
  <div class="stalist">
    <staheader />
    <staIContent />
  </div>
</template>

<script>
import staheader from './staheader'
import staIContent from './staIContent'
export default {
  name: 'stailistConponent',
  components: {
    staheader,
    staIContent
  }
}
</script>

<style lang="scss" scoped>
.stalist{
  margin: 0px 165px 0px 165px;
  @media screen and (max-width: 1120px) {
    margin: 0px 70px;
  }
}
</style>
