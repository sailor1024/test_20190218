<template>
  <div class="content">
    <div class="leftcontent">
      <div class="title">最近更新时间：{{timer | formatDate('yyyy/MM/dd')}}</div>
    </div>
    <div class="rightcontent">
      <div class="itembox">
        <div class="item-mark">
          <Icon class="icon clear" type="help-circled" color="#E7E7E7"></Icon>
        </div>
        <div class="item-titbox">
          <div class="itemicon">
            <Icon class="item_icon--i" type="calendar" size="38"></Icon>
          </div>
          <div class="itemtitle">
            <div>浏览</div>
            <div>永久</div>
          </div>
        </div>
        <div class="item-value">
          <div>{{looknum}}</div>
        </div>
      </div>
      <div class="itembox">
        <div class="item-mark">
          <Icon class="icon clear" type="help-circled" color="#E7E7E7"></Icon>
        </div>
        <div class="item-titbox">
          <div class="itemicon">
            <Icon class="item_icon--i" type="connection-bars" size="38"></Icon>
          </div>
          <div class="itemtitle">
            <div>访问</div>
            <div>永久</div>
          </div>
        </div>
        <div class="item-value">
          <div>{{lookplay}}</div>
        </div>
      </div>
      <div class="itembox">
        <div class="item-mark">
          <Icon class="icon clear" type="help-circled" color="#E7E7E7"></Icon>
        </div>
        <div class="item-titbox">
          <div class="itemicon">
            <Icon class="item_icon--i" type="android-people" size="38"></Icon>
          </div>
          <div class="itemtitle">
            <div>特殊访客</div>
            <div>永久</div>
          </div>
        </div>
        <div class="item-value">
          <div>{{lookuser}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tabfouConponent',
  data () {
    return {
      'looknum': 0,
      'lookuser': 0,
      'lookplay': 0,
      timer: new Date().getTime()
    }
  },
  created () {
    this.$http.post('index2/statistics/singleitem', {
      'items_id': this.$route.query.id
    }).then((res) => {
      let data = res.data
      if (data.code === 200) {
        this.looknum = data.data.type_1
        this.lookuser = data.data.type_3
        this.lookplay = data.data.type_2
        // let timestap = new Date()
        // let year = '' + timestap.getFullYear()
        // year = year.substr(2)
        // let month = timestap.getMonth() + 1
        // month = timestap.getMonth() + 1 < 10 ? '0' + month : month
        // let date = timestap.getDate()
        // date = timestap.getDate() < 10 ? '0' + date : date
        // this.timer = year + '/' + month + '/' + date
      } else {
        this.$Message.error(res.data.message)
      }
    }).catch(() => {
    })
  }
}
</script>

<style lang="scss" scoped>
.content{
  border-radius: 4px;
  box-shadow: 0 2px 3px 0 #DFDFDF;
  padding: 26px 37px 0 21px;
  display: flex;
  flex-direction: column;
  height: 80vh;
  background-color: white;
}
.leftcontent{
  margin-right: 25px;
  .title{
    font-size:16px;
    color: #333333;
    line-height:20px;
  }
}
.rightcontent{
  margin-top: 81px;
  flex: 1;
  display: flex;
  .itembox:nth-of-type(2){
    margin-left: 24px;
  }
  .itembox:nth-of-type(3){
    margin-left: 24px;
  }
  .itembox{
    position: relative;
    flex: 1;
    height: 187px;
    border-radius: 6px;
    box-shadow: 0 3px 3px 0 rgba(204,204,204,0.3);
    .item-mark{
      height: 30px;
      .icon{
        float: right;
        margin-right: 20px;
        margin-top: 10px;
      }
    }
    .item-titbox{
      padding-left: 30px;
      .itemicon{
        display: inline-block;
        height: 40px;
        vertical-align: top;
      }
      .itemtitle{
        position: absolute;
        left: 122px;
        top: 4px;
        margin-left: 10px;
        div:nth-of-type(1){
          height:20px;
          font-size:14px;
          color:rgba(136,136,136,1);
          line-height:20px;
        }
        div:nth-of-type(2){
          height:17px;
          font-size:12px;
          color:rgba(169,169,170,1);
          line-height:17px;
        }
      }
    }
    .item-value{
      div{
        margin-top: 6px;
        font-size: 60px;
        color: #00A1FF;
        text-align: center;
      }
    }
  }
}
@media screen and (max-width: 1100px){
  .content{
    padding: 29px 12px;
    .title{
      width: 100px;
    }
  }
  .rightcontent{
    .itemtitle{
        display: inline-block;
        height: 40px;
        margin-left: 10px;
        div:nth-of-type(1){
          height:20px;
          font-size:14px;
          color:rgba(136,136,136,1);
          line-height:20px;
          // max-width: 30px;
          // overflow: hidden;
        }
        div:nth-of-type(2){
          height:17px;
          font-size:12px;
          color:rgba(169,169,170,1);
          line-height:17px;
        }
      }
  }
}
.item_icon--i {
  position: absolute;
  top: -20px;
  left: 20px;
  background-color: #00A1FF;
  width: 86px;
  height: 87px;
  box-shadow: 0 3px 3px 0 rgba($color: #00A1FF, $alpha: 0.3);
  border-radius: 4px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
