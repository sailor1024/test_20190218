<template>
  <div >
    <header>
      <h4>所有合作者</h4>
      <p class="small-title">{{activeUser.length}}名合作者</p>
    </header>
  </div>
</template>

<script>
export default {
  name: 'userheader',
  props: ['activeUser']
}
</script>

<style lang="scss" scoped>
header{
  h4{
    margin-top: 46px;
    // height:37px;
    font-size:26px;
    // font-family:PingFangSC-Regular;
    color:#333333;
    // line-height:37px;
  }
}
.small-title {
  margin-top: 31px;
  font-size: 14px;
  color: #333;
}
</style>
