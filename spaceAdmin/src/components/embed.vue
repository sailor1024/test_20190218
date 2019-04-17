<template>
  <div></div>
</template>
<script>
export default {
  // 文件夹功能跳转
  created () {
    // 跳转到对应的路由
    let If = typeof this.$route.query.id
    if (If === 'number') {
      // 跳转下一个文件夹
      this.$router.push({
        path: '/folder/' + this.$route.query.id + ''
      })
    } else {
      // 返回上一个文件夹
      // window.location.reload()
      this.$router.push({
        path: '/'
      })
      // setTimeout(() => {
      // 跳转到上一个目录
      // this.$router
      // this.$router.push({
      //   path: '/embedBack',
      //   query: {id: this.$router.history.current.fullPath}
      // })
      // }, 2000)
    }
  }
}
</script>
