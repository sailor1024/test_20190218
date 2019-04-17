<template>
  <div class="tabthree">
    <!-- <div class="tabitem" @click="sendbmapfunc" data-type="1">
      <div class="itembox">
        <div class="imgbox">
          <div><img src="../../../assets/images/baidu.png" alt="" /></div>
        </div>
        <div class="title">发布至百度地图</div>
      </div>
    </div> -->
    <!-- <div class="tabitem" @click="sendfacfunc" data-type="2">
      <div class="itembox">
        <div class="imgbox">
          <div><img src="../../../assets/images/kangyun.png" alt="" /></div>
          <div class="domain">KANGYUN3D.COM</div>
        </div>
        <div class="title">发布至我们的官方网站进行分享</div>
      </div>
    </div> -->
    <div class="nothing">
      <div class="box">
        <div class="title">此功能尚未开放</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tabthrConponent',
  methods: {
    sendfunc (type) {
      this.$http.post('/index/index/send_bmap', {
        'id': this.$route.query.id,
        'type': type
      }).then((res) => {
        let data = res.data
        if (data.code === 1) {
          this.$Message.success('发布成功')
        } else {
          this.$Message.error('发布失败')
        }
      }).catch(() => {
      })
    },
    sendbmapfunc () {
      this.sendfunc(1)
    },
    sendfacfunc () {
      this.sendfunc(2)
    }
  }
}
</script>

<style lang="scss" scoped>
.tabthree{
  background-color: white;
  width: 100%;
  height: 80vh;
  padding: 48px 55px;
  display: flex;
  justify-content: center;
  .nothing{
    width: 50%;
    // position: absolute;
    height: 300px;
    // left: 0;
    // right: 0;
    // padding-left: auto;
    // text-align: center;
    // margin-left: auto;
    // margin-right: auto;
    .box{
    width: 100%;
    height: 100%;
    .title{
      text-align: center;
      font-size: 24px;
      line-height: 300px;
      }
    }
  }
  .tabitem{
    float: left;
    width: 50%;
    height: 300px;
    .itembox{
      width: 100%;
      height: 100%;
      border:2px solid rgba(241,241,241,1);
      .imgbox{
        height: 73px;
      }
      .domain{
        height: 20px;
        font-size: 20px;
        line-height: 20px;
        padding: 6px 0px 4px 0px;
        text-align: center;
        font-family:PingFangSC-Regular;
        color:rgba(32,32,32,1);
        letter-spacing:3px;
      }
      .title{
        text-align: center;
        font-size: 14px;
        margin-top: 40px;
      }
    }
  }
  .tabitem:nth-of-type(2n){
    padding-left: 40px;
    img{
      display: block;
      height: 43px;
      margin: 0 auto;
      margin-top: 73px;
    }
  }
  .tabitem:nth-of-type(2n+1){
    padding-right: 40px;
    img{
      display: block;
      width: 73px;
      margin: 0 auto;
      margin-top: 73px;
    }
  }
}
</style>
