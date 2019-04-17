<template>
  <div class="cloundbox">
    <div>
      <span @click="fly" class="c-brumns__span">设置</span>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    fly () {
      this.$router.push({
        path: '/setting'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cloundbox{
  height:40px;
  background:rgba(255,255,255,1);

  span{
    display: block;
    float: left;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
  }
  span:nth-of-type(1){
    margin-left: 167px;
    width:55px;
    font-size:13px;
    color: #00a1ff;
    &:hover {
      color: rgba($color: #00a1ff, $alpha: .8)
    }
  }
  span:nth-of-type(2){
    width: 20px;
  }
  span:nth-of-type(3){
    width: 20px;
  }

}

</style>
