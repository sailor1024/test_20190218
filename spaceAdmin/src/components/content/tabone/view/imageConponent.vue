<template>
  <div>
    <!-- 批量操作栏 -->
    <div class="all-control" v-show="this.list.length !== 0">
      <span class="slectednum">已选择 {{num}} 个</span>
      <span class="all-icon">
        <span v-show="this.chooseList.length === 0" class="choose-font">选择</span>
        <span class="icon-sty">
          <span class="all-download" v-show="this.chooseList.length !== 0" @click="forUrl">
             <i class="font_family icon-xiazai" style="font-size: 135%; color: rgb(169, 169, 170);"></i>
          </span>
          <span v-show="this.chooseList.length !== 0">
             <i v-if="$store.state.json.edit_type === 2" class="font_family icon-weibiaoti544" style="font-size: 141%; color: rgb(169, 169, 170);" @click.stop="allPop"></i>
          </span>
          <span @click.stop="selectAll">
            <i class="font_family icon-weigouxuan" style="font-size: 133%; color: rgb(169, 169, 170);" v-if="chooseImg === 0"></i>
            <i class="font_family icon-choosehandle" style="font-size: 142  %; color: rgb(169, 169, 170);" v-if="chooseImg === 1"></i>
          </span>
        </span>
      </span>
    </div>
    <imgPop v-if="popShow" @clickNone="none" @clickConfirm="popSure" @clickCancel="cancelParent" :srcList="srcList" :imgId="imgId"></imgPop>
    <imgConponent style="margin-right: 21px;" v-if="$store.state.json.edit_type === 2" class="inlineblock" />
    <imgitemConponent
      v-for="(num, index) in list"
      :key="index"
      :index="index"
      :json="num"
      class="inlineblock"
      :chooseImg="chooseImg"
      ref="child"
      :force="isForce"
      :list="list"
      @deleteFather="deleted(index)"
      @totalImgParent="totalNum"
      @chooseSrc="selectDownload"
      @cancelSrc="cancelDownload"/>
    <!-- @changeFather="(type) => {
      ((index, type) => {
        changeIt(index, type)
      })(index, type) -->
    <!-- <imgitemConponent v-for="(num, index) in list" :key="index" :json="num" class="inlineblock"/> -->
  </div>
</template>

<script>
import imgConponent from './imgVue/img'
import imgitemConponent from './imgVue/imgitemConponent'
import imgPop from '@/components/content/tabone/view/imgpopConponent.vue'
import DownClass from '@/utils/DownClass.js'

let _ = require('lodash')
export default {
  props: ['editurl'],
  name: 'imageConponent',
  data () {
    return {
      'list': [],
      'chooseImg': 0,
      // 被选中的集合
      'chooseList': [],
      'num': 0,
      popShow: false,
      'srcList': [],
      idArr: [],
      imgId: null,
      isForce: false
    }
  },
  created () {
    this.loadData()
  },
  watch: {
    chooseList: {
      handler (newChooseList, oldChooseList) {
        this.num = this.chooseList.length
      },
      deep: true
    }
  },
  methods: {
    loadData () {
      return new Promise((resolve, reject) => {
        this.$http.post('index2/items/getJson', {
          // 'itemid': this.$route.query.id
          path: this.$store.state.json.dirname || JSON.parse(sessionStorage.getItem('jsonMsg')).dirname
        }).then((res) => {
          if (res.data.data.length) {
            res.data.data.forEach(item => {
              item.name = item.timer
            })
          }
          this.list = res.data.data
          resolve(res)
        })
        // this.$http.post('index/index/imglist', {
        //   'itemid': this.$route.query.id
        // }).then((res) => {
        //   this.list = res.data.data
        //   resolve(res)
        // })
      })
    },
    totalNum (value) {
      var chooseNum = value
      if (chooseNum === 0) {
        this.chooseList.splice(this.chooseList.index, 1)
      } else {
        this.chooseList.push(chooseNum)
      }
      return chooseNum
    },
    deleted (index) {
      this.list.splice(index, 1)
    },
    popFunc (value) {
      let i = null
      let popOneId = value
      this.list.forEach((item, index, self) => {
        if (item.id === popOneId) {
          i = index
          self.splice(i, 1)
        }
      })
    },
    allPop (index) {
      this.popShow = true
    },
    none (data) {
      this.popShow = false
    },
    cancelParent () {
      this.popShow = false
    },
    popSure () {
      this.popShow = false
      this.loadData().then(res => {
        this.chooseImg = 0
        this.chooseList = []
        this.idArr = []
        this.imgId = null
        this.num = 0
        this.srcList = []
        this.isForce = !this.isForce
      })
      let popOneId
      for (let i = 0; i < this.idArr.length; i++) {
        popOneId = this.idArr[i]
        this.popFunc(popOneId)
      }
    },
    // 下载图片
    download (name, href) {
      var $a = document.createElement('a')
      $a.setAttribute('href', href)
      $a.setAttribute('download', name)
      // var evObj = document.createEvent('MouseEvents')
      // evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null)
      // $a.dispatchEvent(evObj)
      $a.dispatchEvent(new MouseEvent('click', {}))
    },
    // 全部下载图片
    forUrl () {
      // let imgUrl
      // let imgName
      const arr = [...this.srcList]
      arr.forEach(item => {
        item.lock = false
        item.blob = null
      })
      console.log(arr)
      const downloadTool = new DownClass(arr)
      downloadTool.toZip('imagesBar')
      // for (let i = 0; i < this.srcList.length; i++) {
      //   imgUrl = this.srcList[i].src
      //   imgName = this.srcList[i].id
      //   this.download(imgName, imgUrl)
      // }
    },
    // 勾选的图片
    selectDownload (src, id, name) {
      var imgSrc = src
      this.imgId = id
      this.srcList.push({
        id: this.imgId,
        src: imgSrc,
        fullName: name
      })
      this.srcList = _.uniq(this.srcList)
      for (let i = 0; i < this.srcList.length; i++) {
        this.idArr.push(this.srcList[i].id)
      }
      this.idArr = _.uniq(this.idArr)
    },
    // 取消勾选
    cancelDownload (id) {
      let i = null
      let srcId = id
      this.srcList.forEach(function (value, index) {
        if (value.id === srcId) {
          i = index
        }
        return i
      })
      this.srcList.splice(i, 1)
      return this.srcList
    },
    selectAll () {
      if (this.chooseImg === 0) {
        this.chooseImg = 1
        this.chooseList.length = this.list.length
        this.num = this.chooseList.length
        for (let i = 0; i < this.list.length; i++) {
          this.idArr.push(this.list[i].id)
          this.srcList.push({
            id: this.list[i].id,
            fullName: this.list[i].name,
            src: this.list[i].src
          })
        }
        this.idArr = _.uniq(this.idArr)
        this.srcList = _.uniq(this.srcList)
      } else {
        this.chooseImg = 0
        this.num = 0
        this.chooseList = []
        this.idArr = []
        this.srcList = []
      }
    }
  },
  components: {
    imgConponent,
    imgitemConponent,
    imgPop
  }
}
</script>

<style lang="scss" scoped>
.all-control{
  position: relative;
  .slectednum{
    color: #333;
    font-size: 18px;
  }
  .all-icon{
    float: right;
    .choose-font{
      color: #666666;
      font-size: 14px;
      position: relative;
      top: -3px;
      margin-right: 18px;
    }
    .icon-sty{
      span {
        cursor: pointer;
      }
    }
  }
}
.inlineblock{
  display: inline-block;
  vertical-align: top;
  margin: 24px 33px 0px 0;
}
</style>
