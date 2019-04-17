<template>
  <div>
    <div class="numtitle">{{num}} 个发布项目</div>
    <div class="desbute">任何有此链接的访问者均可以在公共空间中访问已发布的项目。</div>
  </div>
</template>

<script>
export default {
  name: 'sendrightConponent',
  props: ['list'],
  computed: {
    num () {
      return this.list
    }
  }
}
</script>

<style lang="scss" scoped>
.numtitle{
  height:22px;
  font-size:16px;
  color:#333333;
  line-height:22px;
  // margin-top: 36px;
}
.desbute{
  height:17px;
  margin-top: 15px;
  font-size:12px;
  font-family:PingFangSC-Regular;
  color:rgba(98,98,98,1);
  line-height:17px;
}
</style>
