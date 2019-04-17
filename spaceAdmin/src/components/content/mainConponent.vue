<template>
  <div id="main">
    <div id="content">
      <tabBarConponent :json="json"/>
    </div>
  </div>
</template>

<script>
import tabBarConponent from './tabbarConponent'
export default {
  name: 'mainConponent',
  props: ['json'],
  components: {
    tabBarConponent
  }
}
</script>

<style lang="scss" scoped>
#main{
  width: 100%;
  padding: 38px 155px 48px 155px;
  background-color: #F1F1F1;
  #content{
    // height: 933px;
    background-color: white;
  }
}
</style>
