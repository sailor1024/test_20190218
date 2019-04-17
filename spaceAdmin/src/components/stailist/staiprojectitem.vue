<template>
  <div>
    <Row class="itembox">
      <Col class="item" span="11">
        <div class="content">
          <div class="left">
            <img @click="fly" :src="backimg">
          </div>
          <div class="right">
            <div @click="fly" :title="json.title">{{json.title}}</div>
            <p>{{desbute}}</p>
          </div>
        </div>
      </Col>
      <Col class="item__num" span="3">
        <div class="numspan">
          <span>{{json.days}}</span>
        </div>
      </Col>
      <Col class="item__num" span="3">
        <div class="numspan"><span>{{json.type_1}}</span></div>
      </Col>
      <Col class="item__num" span="3">
        <div class="numspan"><span>{{json.type_2}}</span></div>
      </Col>
      <Col class="item__num" span="3">
        <div class="numspan"><span>{{json.type_3}}</span></div>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'staiprojectitem',
  props: ['json'],
  computed: {
    desbute () {
      return '由' + this.json.last_name + this.json.first_name + '创建于' + this.format(this.json.create_time)
    },
    backimg () {
      let url = ''
      if (this.json.marker_image) {
        url = this.$imgURL + this.json.marker_image
      } else {
        url = this.$imgURL + '/assets/img/loading.gif'
      }
      // return {
      //   'backgroundImage': 'url(' + url + ')'
      // }
      return url
    },
    numday () {
      let time = Math.ceil(new Date().getTime() / 1000)
      let num = Math.ceil((time - this.json.create_time) / (24 * 60 * 60))
      return num
    }
  },
  methods: {
    preventFunc () {
      if (!this.json.marker_image) {
        const msg = this.$Message.loading({
          content: '项目正在构建...',
          duration: 0
        })
        setTimeout(msg, 2000)
        return false
      }
      return true
    },
    fly () {
      if (this.preventFunc()) {
        this.$router.push({
          path: '/home',
          query: {
            id: this.json.id
          }
        })
      }
    },
    format (time) {
      let date = new Date(time)
      let y = date.getFullYear() + ''
      let m = date.getMonth() + 1
      let d = date.getDate()
      m = m > 10 ? m : '0' + m
      d = d > 10 ? d : '' + d
      return y + '年' + m + '月' + d + '日'
    }
  }
}
</script>

<style lang="scss" scoped>
.itembox{
  &:hover {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  }
  transition: all 0.2s ease-in-out;
  margin: 0 10px 1px;
  // height: 116px;
  background-color: white;
  border-radius: 3px;
  // border-bottom:1px solid rgba(231,231,231,1);
  .item{
    padding: 14px 0 12px 16px;
    .content{
      display: flex;
      .left{
        width: 100px;
        height: 70px;
        // margin-left: 15px;
        // margin-top: 24px;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        background-color: #222;
        img {
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      }
      .right{
        overflow: hidden;
        flex: 1;
        margin-left: 16px;
        > div {
          font-size: 18px;
          color: #333;
          margin-top: 5px;
          cursor: pointer;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          line-height: 1.2;
        }
        h4{
          width: 100%;
          height:22px;
          font-size:18px;
          color:rgba(0,161,255,1);
          line-height:22px;
          margin-top: 28px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
        p{
          height:17px;
          font-size:12px;
          color: #999999;
          line-height:17px;
          margin-top: 32px;
        }
      }
    }
  }
  .item__num {
    margin-top: 50px;
    .numspan{
      text-align: center;
      span{
        display: inline-block;
        font-size:18px;
        color:#999;
      }
    }
  }
}
</style>
