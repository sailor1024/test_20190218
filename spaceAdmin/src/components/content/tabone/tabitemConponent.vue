<template>
  <div @click="childchange" class="tabitem" :class="j.path === $route.path?'active':''">
    <!-- <div class="icon">
      <Icon :type="type" size="23"></Icon>
    </div>
    <div class="fonttitle">{{this.json.name}}</div> -->
    <div style="text-align:center;">
      <Icon :type="type" size="23"></Icon>
      <p class="fonttitle">
        {{this.json.name}}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tabitemConponent',
  props: ['json'],
  data () {
    return {
      j: this.json
    }
  },
  created () {
    if (this.$route.path === '/home/') {
      if (this.json.path === '/home') {
        this.j.path = '/home/'
      }
    }
  },
  methods: {
    childchange () {
      this.$emit('childchange', this.json)
    }
  },
  computed: {
    type: function () {
      return this.json.icon
    }
  }
}
</script>

<style lang="scss" scoped>
.tabitem{
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 96px;
  height: 93px;
  border-radius: 4px;
  overflow: hidden;
  .icon{
    text-align: center;
    margin-top: 14px;
  }
  .fonttitle{
    margin-top: 10px;
    font-size:12px;
    color:#999999;
    text-align: center;
  }
  i {
    color: #999999;
  }
}
.active{
  background-color: #00A1FF;
  box-shadow: 0 4px 3px rgba(0, 161, 255, 0.3);
  position: relative;
  &::after{
    position: absolute;
    display: block;
    content: '123123 ';
    width: 3px;
    height: 78px;
    background-color: #00A1FF;
    top: 0;
    right: 0;
    bottom: 0;
  }
  i {
    color: #fff;
  }
  .fonttitle {
    color: #fff;
  }
}
</style>
