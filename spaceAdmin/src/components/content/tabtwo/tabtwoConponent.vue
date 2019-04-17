<template>
  <div class="content">
    <!-- <div class="submitbox" v-if="json.edit_type === 2">
      <a @click="savefunc">保存</a>
    </div> -->
    <Row
      :gutter="26"
      type="flex"
      align="middle"
      justify="start">
      <i-col
        class="x-col"
        :xs="24"
        :md="12">
        <div class="x-div">
          <span class="x-name">项目名称</span>
          <input
            v-model="titlestr"
            type="text"
            class="x-input">
        </div>
      </i-col>
      <i-col
        class="x-col"
        :xs="24"
        :md="12">
        <div class="x-div">
          <span class="x-name">提出者</span>
          <input
            v-model="json.detail_presenter"
            type="text"
            class="x-input">
        </div>
      </i-col>
      <i-col
        class="x-col"
        :xs="24"
        :md="8">
        <div class="x-div">
          <span class="x-name">户型</span>
          <input
            v-model="json.house_type"
            type="text"
            class="x-input">
        </div>
      </i-col>
      <i-col
        class="x-col"
        :xs="24"
        :md="8">
        <div class="x-div">
          <span class="x-name">面积</span>
          <input
            v-model="json.items_area"
            type="text"
            class="x-input">
        </div>
      </i-col>
      <i-col
        class="x-col"
        :xs="24"
        :md="8">
        <div class="x-div">
          <span class="x-name">朝向</span>
          <input
            v-model="json.items_orientation"
            type="text"
            class="x-input">
        </div>
      </i-col>
      <i-col
        class="x-col"
        :xs="24"
        :md="24">
        <div class="x-div">
          <span class="x-name">外部网站地址</span>
          <input
          v-model="detailLink"
          type="text"
          class="x-input">
        </div>
        <p class="x-p"><span class="x-name">例如：</span>https://examplewesite.com/homes/1a2b3c</p>
      </i-col>
      <i-col
        class="x-col"
        :xs="24"
        :md="24">
        <div class="x-div">
          <span class="x-name">简介</span>
          <input
          v-model="json.description"
          type="text"
          class="x-input">
        </div>
      </i-col>
      <i-col
        class="x-col"
        :xs="24"
        :md="12">
        <div class="x-div">
          <span class="x-name">联系人姓名</span>
          <input
          v-model="json.detail_username"
          type="text"
          class="x-input">
        </div>
      </i-col>
      <i-col
        class="x-col"
        :xs="24"
        :md="12">
        <div class="x-div">
          <span class="x-name">联系人电话</span>
          <input
          v-model="json.detail_phone"
          type="text"
          class="x-input">
        </div>
      </i-col>
      <i-col
        class="x-col"
        :xs="24"
        :md="12">
        <div class="x-div">
          <span class="x-name">联系人邮箱</span>
          <input
          v-model="json.detail_email"
          type="text"
          class="x-input">
        </div>
      </i-col>
    </Row>
    <!-- <div class="contentitem">
      <div class="headeritem">
        <h4>公共信息</h4>
        <p>根据您在工作台中的可见性设置，您填写的信</p>
      </div>
    </div>
    <div class="contentitem">
      <div class="namebox">
        <div class="lablename">项目名称</div>
        <input v-model="titlestr"/>
      </div>
    </div>
    <div class="contentitem">
      <div class="namebox">
        <div class="lablename">提出者</div>
        <input v-model="json.detail_presenter"/>
      </div>
    </div>
    <div class="contentitem">
      <div class="weburlbox">
        <div class="lablename">外部网站地址</div>
        <input placeholder="" v-model="detailLink"/>
        <p>例如：https://examplewesite.com/homes/1a2b3c</p>
      </div>
    </div>
    <div class="contentitem">
      <div class="namebox">
        <div class="lablename">联系人姓名</div>
        <input v-model="json.detail_username"/>
      </div>
    </div>
    <div class="contentitem">
      <div class="namebox">
        <div class="lablename">联系人电话</div>
        <input v-model="json.detail_phone"/>
      </div>
    </div>
    <div class="contentitem">
      <div class="namebox">
        <div class="lablename">联系人邮箱</div>
        <input v-model="json.detail_email"/>
      </div>
    </div>
    <div class="contentitem">
      <div class="namebox">
        <div class="lablename">简介</div>
        <input class="longinput" v-model="json.description"/>
      </div>
    </div> -->
    <div class="contentitem">
      <div class="namebox">
        <h4 class="lablename addlable">地址</h4>
        <p>请输入项目的完整地址。您可以通过以下选项限制公众对地址的可见性。</p>
      </div>
    </div>
    <Row
      :gutter="26"
      type="flex"
      align="middle"
      justify="start">
        <i-col
        class="x-col"
        :xs="24"
        :md="12">
        <div class="x-div">
          <span class="x-name">具体地址</span>
          <input
            v-model="json.location"
            type="text"
            class="x-input">
        </div>
      </i-col>
      </Row>
    <!-- <div class="contentitem">
      <div class="namebox">
        <div class="lablename">具体地址</div>
        <input class="longinput" v-model="json.location"/>
      </div>
    </div> -->
    <div class="addressboxset">
      <div class="lable">地址的可见性设置</div>
      <div>
        <RadioGroup v-model="select">
          <Radio label="1" class="radio">
            <span>所有地址信息全部可见</span>
          </Radio>
          <!-- <Radio label="2" class="radio">
            <span>仅国家，城市，邮编可见</span>
          </Radio> -->
          <Radio label="3" class="radio">
            <span>均不可见</span>
          </Radio>
        </RadioGroup>
      </div>
    </div>
    <div
      v-if="json.edit_type === 2"
      style="text-align: right;padding-right: 35px;">
      <button
        @click="savefunc"
        class="c-button c-button__primary--radius">保存</button>
    </div>
    <!-- <div class="seinfo">
      <div class="setitlebox">
        <h4>内部信息</h4>
        <p>在3D展示中其他用户仅能看到您所公开的部分，无法查看您的内部隐藏信息。</p>
      </div>
      <div class="timeinfo">
        <div class="timebox">
          <div class="timeitem">
            <span>创建日期</span>
            <span>{{cteateTime}}</span>
          </div>
          <div class="timeitem">
            <span>创建人</span>
            <span>{{this.$store.state.json.niname}}</span>
            </div>
          <div class="timeitem">
            <span>上次操作日期</span>
            <span>{{updateTime}}</span>
            </div>
          <div class="timeitem">
            <span>上次操作人</span>
            <span>{{this.$store.state.json.niname}}</span>
          </div>
        </div>
      </div>
      <div class="inputbox">
        <div class="boxitem">
          <div><input placeholder="内部 ID"/></div>
          <div><input placeholder="LM 清单ID"/></div>
        </div>
        <div class="boxitem">
          <div><input placeholder="LM 名称"/></div>
          <div><input placeholder="描述"/></div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'tabtwoConponent',
  data () {
    return {
      select: '1',
      titlestr: '',
      description: this.$store.state.json.description,
      location: this.$store.state.json.location,
      niname: this.$store.state.json.niname,
      modelurl: this.$store.state.json.url,
      cteateTime: this.fromat(this.$store.state.json.create_time),
      updateTime: this.fromat(this.$store.state.json.update_time),
      priid: this.$store.state.json.id,
      json: null,
      detailLink: ''
    }
  },
  created () {
    this.json = this.$store.state.json.title ? this.$store.state.json : JSON.parse(sessionStorage.getItem('jsonMsg'))
    this.titlestr = this.json.title
    this.description = this.$store.state.json.description
    this.location = this.$store.state.json.location
    this.niname = this.$store.state.json.niname
    this.modelurl = this.$store.state.json.url
    this.cteateTime = this.fromat(this.$store.state.json.create_time)
    this.updateTime = this.fromat(this.$store.state.json.update_time)
    this.priid = this.$store.state.json.id
    this.detailLink = this.json.detail_link
  },
  methods: {
    savefunc () {
      let reg = /^http(s)?:\/\/([-_a-zA-Z0-9]+\.)+[-_a-zA-Z0-9]+([-_a-zA-Z0-9./?%&=]*)?$/
      if (this.detailLink) {
        if (!reg.test(this.detailLink)) {
          this.$Message.error('网站地址格式输入有误')
          return false
        }
      }
      if (this.json.detail_phone) {
        if (!/^1\d{10}$/.test(this.json.detail_phone)) {
          this.$Message.error('手机格式输入有误')
          return false
        }
      }
      if (this.json.detail_email) {
        if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.json.detail_email)) {
          this.$Message.error('邮箱格式输入有误')
          return false
        }
      }
      this.$http.post('/index2/items/save_detil', {
        'title': this.titlestr,
        'detail_link': this.detailLink,
        'detail_username': this.json.detail_username,
        'location': this.json.location,
        'id': this.json.id,
        'detail_phone': this.json.detail_phone,
        'detail_email': this.json.detail_email,
        'detail_presenter': this.json.detail_presenter,
        'description': this.json.description,
        'items_orientation': this.json.items_orientation,
        'house_type': this.json.house_type,
        'items_area': this.json.items_area
      }).then((res) => {
        let data = res.data
        if (data.code === 200) {
          this.$Message.success('修改成功')
          this.soureupdate()
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch(() => {
      })
    },
    soureupdate () {
      let obj = {...this.json}
      obj.title = this.titlestr
      obj.detail_link = this.detailLink
      this.$store.dispatch('json', obj)
      sessionStorage.setItem('jsonMsg', JSON.stringify(obj))
    },
    fromat (time) {
      let date = new Date(time * 1000)
      let y = date.getFullYear() + ''
      let m = date.getMonth() + 1
      let d = date.getDate()
      m = m > 10 ? m : '0' + m
      d = d > 10 ? d : '0' + d
      y = y.slice(2)
      return y + '/' + m + '/' + d
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  padding: 34px 13%;
  position: relative;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 3px 0 #DFDFDF;
  overflow: hidden;
}
@media screen {

}
$abuttonH: 45px;
.submitbox{
  position: absolute;
  top: 26px;
  right: 1.5%;
  width:133px;
  height: $abuttonH;
  background:linear-gradient(180deg,rgba(70,187,255,1),rgba(0,161,255,1));
  border-radius:25px;
  a{
    display: block;
    height: $abuttonH;
    width: 133px;
    line-height: $abuttonH;
    text-align: center;
    color: white;
  }
}
.headeritem{
  h4{
    height:22px;
    font-size:16px;
    // font-family:PingFang-SC-Medium;
    color:rgba(32,32,32,1);
    line-height:22px;
  }
  p{
    height:17px;
    font-size:12px;
    // font-family:PingFangSC-Regular;
    color:rgba(169,169,170,1);
    line-height:17px;
    margin-top: 8px;
  }
}
.namebox{
  margin-top: 44px;
  .lablename{
    font-size:18px;
    color:#333333;
    font-weight: normal;
  }
  .addlable{
    width:320px;
    height:22px;
    font-size:16px;
    // font-family:PingFang-SC-Medium;
    color:rgba(32,32,32,1);
    line-height:22px;
  }
  input{
    margin-top: 9px;
    height: 20px;
    line-height: 20px;
    font-size: 17px;
    outline: none;
    border: none;
    display: block;
    width: 578px;
    font-size:14px;
    // font-family:PingFangSC-Regular;
    border-bottom: 1px solid rgba(231,231,231,1);
  }
  p{
    font-size:14px;
    // font-family:PingFangSC-Regular;
    color:#999999;
    margin-top: 14px;
  }
  .longinput{
    border-bottom: 1px solid rgba(231,231,231,1);
    width: 100%;
  }
}
.weburlbox{
   margin-top: 25px;
  .lablename{
    height:17px;
    font-size:12px;
    // font-family:PingFangSC-Regular;
    color:rgba(169,169,170,1);
    line-height:17px;
  }
  input{
    margin-top: 9px;
    height: 20px;
    line-height: 20px;
    font-size: 17px;
    outline: none;
    border: none;
    display: block;
    width: 578px;
    font-size:14px;
    // font-family:PingFangSC-Regular;
    // color:rgba(229,229,229,1);
    border-bottom: 1px solid rgba(231,231,231,1);
  }
  p{
    margin-top: 5px;
    width:277px;
    height:17px;
    font-size:12px;
    // font-family:PingFangSC-Regular;
    color:rgba(136,136,136,1);
    line-height:17px;
  }
}
.addressboxset{
  margin-top: 24px;
  .lable{
    font-size:14px;
    color:#999999;
  }
  .radio{
    display: inline-block;
    margin-top: 20px;
  }
  & /deep/ .ivu-radio-group {
    font-size: 14px;
    color: #999999;
  }
}
//内部信息
.seinfo{
  .setitlebox{
    h4{
      // width:64px;
      height:22px;
      font-size:16px;
      // font-family:PingFang-SC-Medium;
      color:rgba(32,32,32,1);
      line-height:22px;
    }
    p{
      width:412px;
      height:17px;
      font-size:12px;
      // font-family:PingFangSC-Regular;
      color:rgba(169,169,170,1);
      line-height:17px;
      margin-top: 6px;
    }
  }
  .timeinfo{
    margin-top: 23px;
    .timebox{
      display: flex;
      padding-right: 100px;
      .timeitem{
        flex: 1;
        span{
          display: block;
        }
        span:nth-of-type(1){
          height:17px;
          font-size:12px;
          // font-family:PingFangSC-Regular;
          color:rgba(169,169,170,1);
          line-height:17px;
        }
        span:nth-of-type(2){
          margin-top: 8px;
          height:17px;
          font-size:14px;
          // font-family:Helvetica-Bold;
          color:rgba(95,95,95,1);
          line-height:17px;
        }
      }
    }
  }
  .inputbox{
    width: 100%;
    .boxitem{
      display: flex;
      div{
        flex: 1;
        margin-left: 70px;
        input{
          height: 20px;
          line-height: 20px;
          font-size: 17px;
          outline: none;
          border: none;
          display: block;
          width:100%;
          // width: 578px;
          font-size:14px;
          // font-family:PingFangSC-Regular;
          // color:rgba(229,229,229,1);
          border-bottom: 1px solid rgba(231,231,231,1);
          margin-top: 47px;
        }
      }
      div:nth-child(2n+1) {
        margin-left:0;
      }
    }
  }
}
.x-col {
  margin-top: 30px;
}
.x-name {
  color: #999999;
  font-size: 14px;
  margin-right: 14px;
}
.x-div {
  display: flex;
  justify-content: center;
  align-items: center;
}
.x-input {
  flex: 1;
  outline: 0;
  border: 0;
  border-bottom: 1px solid #E0E0E0;
  font-size: 16px;
  color: #666666;
  line-height: 1.5;
  width: 100%;
  transition: all .3s ease-in-out;

  &:focus {
    border-color: #00A1FF;
  }
}
.x-p {
  margin-top: 11px;
  font-size: 14px;
  color: #666666;
}
</style>
