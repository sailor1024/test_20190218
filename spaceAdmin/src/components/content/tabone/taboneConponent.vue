<template>
  <div class="tabone" >
    <lefttabConponent />
    <router-view :htmlsrc="htmlsrc"  class="view"/>
  </div>
</template>

<script>
import lefttabConponent from './lefttabConponent'
export default {
  name: 'taboneConponent',
  props: ['json'],
  computed: {
    htmlsrc () {
      if (this.json.url) {
        return this.$imgURL + this.json.url
      }
    }
  },
  components: {
    lefttabConponent
  }
}
</script>

<style lang="scss" scoped>
.tabone{
  width: 100%;
  height: 90vh;
  box-shadow:0px 2px 3px 0px #DFDFDF;
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
  @media screen and (min-width: 1940px) {
    height: 1138px !important;
  }
  .view{
    padding: 32px 32px 32px 28px;
    margin-left: 96px;
    height: 100%;
  }
}
</style>
