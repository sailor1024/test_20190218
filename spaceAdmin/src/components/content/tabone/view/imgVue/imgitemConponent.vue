<template>
  <div>
    <div class="imgbox">
      <div class="imgdiv" :style="imgsrc" @click="openImg">
        <div class="iconimg">
          <!-- 图片未选择为0，图片选中为1 -->
          <!-- <div class="imgSlect">
            <div class="imgSlectSon">
              <div class="imgSlectGrandson">
                <i class="icon-style font_family icon-weigouxuan" @click.stop="select" v-if="childChoose === 0" @click="uploadSrc"></i>
                <i class="icon-style font_family icon-choosehandle" @click.stop="select" v-if="childChoose === 1" @click="deleteSrc"></i>
              </div>
            </div>
          </div> -->
          <div class="rightbox">
            <div class="imgSlectSon">
              <div class="imgSlectGrandson fr" style="float: right;">
                <i class="icon-style font_family icon-weigouxuan pointer" @click.stop="select" v-if="childChoose === 0" @click="uploadSrc"></i>
                <i class="icon-style font_family icon-choosehandle pointer" @click.stop="select" v-if="childChoose === 1" @click="deleteSrc"></i>
              </div>
            </div>
            <!-- <div class="imgDownloadFather">
              <div class="imgDownload" @click.stop="download('img','this.json.src')">
                <i class="icon-style font_family icon-xiazai"></i>
              </div>
            </div>
            <div class="imgRemoveFather">
              <div class="imgRemove" @click.stop="deleteIt">
                <i class="icon-style font_family icon-weibiaoti544"></i>
              </div>
            </div> -->
          </div>
        </div>
          <!-- <a class="abox"></a> -->
      </div>
      <imgpop v-if="popShow" @clickNone="none" @clickOneConfirm="popParent" @clickCancel="cancelParent" :imgData="imgData"></imgpop>
    </div>
    <div class="desbutebox">
      <div class="name" :title="json.timer">{{this.json.timer}}</div>
      <!-- <div class="type">FTP</div> -->
    </div>
    <!-- 遮罩 -->
    <div class="overlay" v-if="showImg === 1">
      <div class="top-close">
        <div class="videoClose" @click="close">
          <i class="font_family icon-guanbi pointer" style="font-size: 150%;"></i>
        </div>
      </div>
      <div class="go-left">
        <div class="back">
          <i class="font_family icon-fanhui pointer" style="font-size: 300%;" @click="goLeft"></i>
        </div>
      </div>
      <div class="go-right">
        <div class="next">
          <i class="font_family icon-fanhui-copy pointer" style="font-size: 300%;" @click="goRight"></i>
        </div>
      </div>
    <!-- 图片弹窗 -->
      <div class="screen" v-if="showImg === 1">
        <div class="screen__num">
          {{currentImgIndex + 1}}/{{list.length}}
        </div>
        <img :src="this.list[currentImgIndex].src" alt="img" style="width: 100%; height: auto;">
      </div>
      <div class="video-name">{{this.list[currentImgIndex].name}}</div>
    </div>
  </div>
</template>

<script>
import imgpop from '@/components/content/tabone/view/imgpopConponent.vue'
export default {
  props: ['json', 'chooseImg', 'force', 'index', 'list'],
  name: 'imgitemConponent',
  components: {
    imgpop
  },
  data () {
    return {
      showImg: 0,
      childChoose: 0,
      choosenStaus: 0,
      popShow: false,
      imgData: this.json.src,
      imgId: this.json.id,
      currentImgIndex: this.index

    }
  },
  computed: {
    imgsrc () {
      if (this.json) {
        return {
          'backgroundImage': 'url(' + this.json.src + ')'
        }
      } else {
        return {}
      }
    }
  },
  watch: {
    chooseImg (newValue) {
      this.childChoose = newValue
    },
    force (newValue) {
      this.childChoose = 0
    }
  },
  methods: {
    select () {
      if (this.childChoose === 0) {
        this.childChoose = 1
        this.choosenStaus = 1
      } else {
        this.childChoose = 0
        this.choosenStaus = 0
      }
      this.$emit('totalImgParent', this.choosenStaus)
    },
    uploadSrc () {
      // 图片路径以及id
      this.$emit('chooseSrc', this.imgData, this.json.id, this.json.name)
    },
    deleteSrc () {
      this.$emit('cancelSrc', this.json.id)
    },
    // abc () {
    //   if (this.chooseNum === 0) {
    //     this.chooseImg = 0
    //   } else {
    //     this.chooseImg = 1
    //   }
    // },
    cancelParent () {
      this.popShow = false
    },
    popParent () {
      this.popShow = false
      this.$emit('deleteFather')
    },
    deleteIt () {
      this.popShow = true
    },
    none (data) {
      this.popShow = false
    },
    download (name, href) {
      var $a = document.createElement('a')
      $a.setAttribute('href', this.json.src)
      $a.setAttribute('download', name)
      var evObj = document.createEvent('MouseEvents')
      evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null)
      $a.dispatchEvent(evObj)
    },
    openImg () {
      this.showImg = 1
    },
    close () {
      this.showImg = 0
    },
    goLeft () {
      if (this.currentImgIndex < 1) {
        return false
      }
      this.currentImgIndex--
    },
    goRight () {
      if (this.currentImgIndex < this.list.length - 1) {
        this.currentImgIndex++
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$imageW:166px;
.icon-style {
  color: white;
  font-size: 20px;
}
.imgbox{
  width: $imageW;
  height: $imageW;
  .imgdiv{
    width: $imageW;
    height: $imageW;
    overflow: hidden;
    border-radius: 10px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    a{
      display: block;
      width: $imageW;
      height: $imageW;
      position: relative;
      z-index: 10;
    }
    a:hover{
      background-color: rgba($color: #626262, $alpha: 0.5);
    }
    .iconimg{
      // width: 100%;
      height: 20%;
      width: 100%;
      position: relative;
      margin-top: 5%;
      .imgSlect{
      height: 100%;
      width: 40%;
      position: absolute;
      left: 5%;
      .imgSlectSon{
        position: relative;
        .imgSlectGrandson{
          position: absolute;
          left: 0%;
        }
      }
      }
      .rightbox{
      height: 100%;
      width: 55%;
      position: absolute;
      left: 40%;
      .imgDownloadFather{
        position: relative;
        .imgDownload{
          position: absolute;
          right: 30%;
        }
       }
       .imgRemoveFather{
        position: relative;
        .imgRemove{
          position: absolute;
          right: 0%;
        }
       }
      }
    }
  }
}

.desbutebox{
    width: 166px;
    height: 40px;
    display: flex;
    justify-content: center;
    .name{
      // width: 92px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #666666;
      line-height: 40px;
      // text-indent: 0.5em;
      font-size: 12px;
      text-align: center;
    }
    .type{
      width: 32px;
      text-align: center;
      background: #4a4a4a;
      color: #fff;
      padding: 2px 6px;
      border-radius: 2px;
      font-size: 10px;
      align-self: center;
      margin-bottom: 3px;
      margin-right: 5px;
      font-weight: 600;
      white-space: nowrap;
    }
  }
.screen {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
.pointer {
  cursor: pointer;
}

.screen__num {
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 18px;
  color: white;
  top: -25px;
}
</style>
