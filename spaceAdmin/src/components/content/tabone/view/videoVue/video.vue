<template>
  <!-- 使用menu组件 -->
  <div>
    <Content class="Video-content">
      <!-- <ul class="VideoList"> -->
        <!-- <li v-for="item in [1,1,1,1,1,1,1,1,1,1,1,1]" :key="item.id"> -->
          <!-- 视频播放 -->
          <!-- <div class="video"> -->
            <!-- <a href="./1php" alt="jump"></a> -->
            <!-- 播放按钮 -->
            <!-- <div class="video-play" @click="play"> -->
              <!-- <Icon type="play" size="20" color="#F2F2F2" style="margin-left:2px; margin-top:1px;"></Icon> -->
            <!-- </div> -->
            <!-- 下载按钮 -->
            <!-- <div class="video-dowload" @click.stop="download('img','this.$imgURL + this.json.src')"> -->
            <!-- <i class="font_family icon-icon-test21"></i> -->
            <!-- </div> -->
          <!-- </div> -->
          <!-- <p style="height:16px;"></p> -->
          <!-- 视频信息 -->
          <!-- <div class="videoMsg"> -->
            <!-- <span>视频介绍-480p MP4</span> -->
            <!-- <div class="videoFormat" v-if="true">MP4</div> -->
            <!-- <div class="videoFormat" v-else>GIF</div> -->
          <!-- </div> -->
        <!-- </li> -->
      <!-- </ul> -->
      <!-- 遮罩 -->
      <!-- <div class="overlay" v-if="playStart === 1"> -->
        <!-- <div class="top-close"> -->
          <!-- <div class="videoClose" @click="close"> -->
            <!-- <i class="font_family icon-guanbi" style="font-size: 150%;"></i> -->
          <!-- </div> -->
        <!-- </div> -->
        <!-- <div class="go-left"> -->
          <!-- <div class="back" @click="backtab"> -->
            <!-- <i class="font_family icon-fanhui" style="font-size: 300%;"></i> -->
          <!-- </div> -->
        <!-- </div> -->
        <!-- <div class="go-right"> -->
          <!-- <div class="next" @click="nexttab"> -->
            <!-- <i class="font_family icon-fanhui-copy" style="font-size: 300%;"></i> -->
          <!-- </div> -->
        <!-- </div> -->
          <!-- 视频弹窗 -->
        <!-- <div class="screen" v-if="playStart === 1"> -->
          <!-- <video id="Media"  controls class="screen-main" src="https://imgcache.qq.com/tencentvideo_v1/playerv3/TPout.swf?max_age=86400&v=20161117&vid=m0027rv8kp0&auto=0"></video> -->
        <!-- </div> -->
        <!-- <div class="video-name">这是视频名称</div> -->
      <!-- </div> -->
      <div class="nothing">
        <div class="box">
          <div class="title">此功能尚未开放</div>
        </div>
      </div>
    </Content>
  </div>
</template>

<script>
export default {
  name: 'videoConponent',
  data () {
    return {
      playStart: 0
    }
  },
  methods: {
    play () {
      this.playStart = 1
    },
    close () {
      this.playStart = 0
    },
    download (name, href) {
      var $a = document.createElement('a')
      $a.setAttribute('href', 'https://imgcache.qq.com/tencentvideo_v1/playerv3/TPout.swf?max_age=86400&v=20161117&vid=m0027rv8kp0&auto=0')
      $a.setAttribute('download', name)
      var evObj = document.createEvent('MouseEvents')
      evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null)
      $a.dispatchEvent(evObj)
    }
  }
}
</script>

<style lang="scss" scoped>
.nothing{
    width: 50%;
    // position: absolute;
    height: 300px;
    left: 0;
    right: 0;
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
* {
  list-style: none;
  padding:0;
  margin:0;
}
.screen {
position: absolute;
top: 20%;
bottom: 20%;
left: 20%;
right: 20%;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  z-index: 200;
  .top-close{
  height: 5%;
  width: 10%;
  position: fixed;
  top: 3%;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  color:#ffffff;
  .videoClose{
  position: absolute;
  top: 15px;
  height: 100%;
  width: 100%;
  text-align: center;
    }
  }
  .go-left{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    margin-top: auto;
    margin-bottom: auto;
    height: 50%;
    width: 8%;
    color: #ffffff;
    .back{
      position: absolute;
      width: 100%;
      text-align: center;
      top: 50%;
      bottom: 0;
      margin-top: -25px;
    }
  }
  .go-right{
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    margin-top: auto;
    margin-bottom: auto;
    color: #ffffff;
    height: 50%;
    width: 8%;
    .next{
      position: absolute;
      width: 100%;
      text-align: center;
      top: 50%;
      bottom: 0;
      margin-top: -25px;
    }
  }
  .video-name{
    height: 5%;
    width: 10%;
    position: fixed;
    bottom: 10%;
    left: 0;
    right: 0;
    margin-left: auto;
    text-align: center;
    margin-right: auto;
    color: #ffffff;
  }
}
.header-box{
  display: block;
  .screen-header {
    max-width: 100%;
    height: 30px;
    line-height: 30px;
    padding-left: 5px;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    font-size: 18px;
    flex: 1;
    text-overflow: ellipsis;
    display: block;
    text-shadow:#ffffff;
    background-color: #666;
    color: #ffffff
  }
}
.screen-main {
height: 100%;
width: 100%;
}
.Video-content {
  padding:41px 21px 0 21px;
  display: flex;
  justify-content: center;
}
.clearfix:after{
  content:".";
  display:block;
  height:0;
  clear:both;
  visibility:hidden
}
.VideoList {
  width:100%;
  height:100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  li {
    cursor: pointer;
    margin-bottom:12px;
    .video {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width:17.75vw;
      height:17.36vh;
      background-image: url(https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528534833140&di=d880e57c0f038527ab771a57f47b03aa&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F12%2F61%2F03%2F79i58PICgSc.jpg);
      background-repeat: no-repeat;
      background-position: center center;
      border-radius: 10px;
      &:hover a {
        background-color: rgba(98, 98, 98, 0.5);
      }
      &>a {
        position: absolute;
        top:0;
        left:0;
        display: block;
        width: 100%;
        height:100%;
        z-index: 0;
        border-radius: 10px;
      }
      .video-play {
        display: flex;
        justify-content: center;
        align-items: center;
        width:52px;
        height:52px;
        background:rgba(0,0,0,0.5);
        border-radius: 50%;
        cursor:pointer;
        z-index: 1;
      }
      .video-dowload {
        position: absolute;
        top:12px;
        right:11px;
        font-size:20px;
        color:#ffffff;
        z-index: 1;
      }
    }
    .videoMsg {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width:17.75vw;
      height:2.19vh;
      padding:0 5px;
      box-sizing: border-box;
      span {
        font-size:12px;
        font-family:PingFangSC-Regular;
        color:rgba(96,96,96,1);
        line-height:17px;
      }
      .videoFormat {
        width:38px;
        height:21px;
        background:rgba(73,74,74,1);
        border-radius:2px;
        font-size:12px;
        font-family:PingFangSC-Regular;
        color:rgba(255,255,255,1);
        line-height:21px;
        text-align:center;
      }
    }
  }
}
</style>
