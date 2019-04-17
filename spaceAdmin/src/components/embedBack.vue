<template>
  <div></div>
</template>
<script>
export default {
  // 文件夹功能跳转
  created () {
    // 跳转下一个文件夹
    this.$router.push({
      // path: this.$route.query.id
      path: '/folder/57'
    })
  }
}
</script>
