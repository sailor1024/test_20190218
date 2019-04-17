<template>
<div class="dialog_container EditorDialog">
  <div class="dialog_box">
    <div class="dialog_body">
      <div class="dialog_content">
        <!-- title -->
        <h3 class="dialog_body-title">编辑细节</h3>
        <!-- detail -->
        <div class="dialog_body-detail">
          <div class="dialog-arround">
            <Tabs size="small" class="dialog_body-small">
                <Tab-pane class="dialog_body-tabs" label="公开详情">
                  <div class="dialog_body-tabs-content clearfix">
                    <!-- <p>以下信息可能会根据您在Workshop中的可见性设置在3D Showcase中公开显示</p> -->
                    <!-- <span>请输入国际格式的非美国电话号码，以+开头</span> -->
                    <div class="name" v-for="(item, index) in nameMsg" :key="index">
                      <p class="name-one">{{item.name}}</p>
                      <p class="name-two">
                        <input type="text" :placeholder="item.Msg" @focus="focus" @blur="blur" v-model="item.Msg">
                      </p>
                    </div>
                  </div>
                  <div class="btn">
                    <i-button type="default" @click="popClose">取消</i-button>
                    <i-button type="info" @click="savedetail">保存</i-button>
                  </div>
                </Tab-pane>
                <Tab-pane class="dialog_body-tabs address" label="地址">
                  <div class="dialog_body-tabs-content clearfix">
                    <p>输入您的空间的完整的地址。你可以使用一下选项限制地址的公开可见性</p>
                    <div class="name" v-for="(item, index) in address" :key="index">
                      <p class="name-one">{{item.name}}</p>
                      <p class="name-two">
                        <input type="text" :placeholder="item.Msg" v-model="item.Msg" @focus="focus" @blur="blur">
                      </p>
                    </div>
                  </div>
                  <!-- 地址可见性 -->
                  <div class="address-view">
                    <div class="name-two">地址可见性</div>
                    <div class="address-content">
                      <RadioGroup v-model="accessType">
                          <Radio label="2">
                            <div>
                              <p>完整地址</p>
                              <!-- <p>慧友美宿</p> -->
                            </div>
                          </Radio>
                          <!-- <Radio label="1">
                             <div>
                              <p>城市，州，邮政编码，国家</p>
                              <p></p>
                            </div>
                          </Radio> -->
                          <Radio label="0">
                            <div>
                              <p>没有</p>
                            </div>
                          </Radio>
                      </RadioGroup>
                      <div class="address-one"></div>
                    </div>
                  </div>
                  <div class="btn">
                    <i-button type="default" @click="popClose">取消</i-button>
                    <i-button type="info" @click="savedetail">保存</i-button>
                  </div>
                </Tab-pane>
                <!-- <Tab-pane class="dialog_body-tabs detail" label="内部细节">
                  <div class="dialog_body-tabs-content clearfix">
                    <p>查看公共空间的人不会在3D Showcase中看到此信息。</p>
                    <div class="name" v-for="(item, index) in detail" :key="index">
                      <p class="name-one">{{item.name}}</p>
                      <p class="name-two">
                        <input type="text" :placeholder="item.Msg" @focus="focus" @blur="blur">
                      </p>
                    </div>
                  </div>
                  <div class="btn">
                    <i-button type="default" @click="popClose">取消</i-button>
                    <i-button type="info" @click="save">保存</i-button>
                  </div>
                </Tab-pane> -->
            </Tabs>
          </div>
        </div>
      </div>
      <!-- close btn-->
      <div class="dialog_body-close" @click="popClose">
        <Icon type="close-round"></Icon>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import '@/assets/css/iviewChange.css'
export default {
  name: 'share',
  props: ['EditorProject'],
  data () {
    return {
      disabledGroupLeft: 'Default',
      disabledGroupRight: 'Enable',
      test: false,
      accessType: '2',
      // 建设tabs
      Tabpane: [
        {
          label: '公开详情',
          title: '以下信息可能会根据您在Workshop中的可见性设置在3D 平台中公开显示'
        },
        {
          label: '地址',
          title: '输入您的空间的完整的地址。你可以使用一下选项限制地址的公开可见性'
        }
      ],
      // 用户输入的值
      insetVal: '',
      detail: [
        {
          name: '内部ID'
        },
        {
          name: 'MLS名称'
        },
        {
          name: 'MLS列表ID'
        },
        {
          name: '描述'
        }
      ],
      address: [
        {
          name: '街道地址',
          Msg: this.EditorProject.location
        }
        // {
        //   name: '省',
        //   Msg: ''
        // },
        // {
        //   name: '城市/地区',
        //   Msg: ''
        // },
        // {
        //   name: '州/地区',
        //   Msg: ''
        // },
        // {
        //   name: '邮政编码',
        //   Msg: ''
        // },
        // {
        //   name: '国家',
        //   Msg: ''
        // }
      ],
      nameMsg: [
        {
          name: '名称',
          Msg: this.EditorProject.title
        },
        {
          name: '提出者',
          Msg: this.EditorProject.detail_presenter
        },
        {
          name: 'URL(通常是属性详细信息网页)',
          Msg: this.EditorProject.detail_link
        },
        {
          name: '简介',
          Msg: this.EditorProject.description
        },
        {
          name: '联系人姓名',
          Msg: this.EditorProject.detail_username
        },
        {
          name: '联系电话',
          Msg: this.EditorProject.detail_phone
        },
        {
          name: '联系电子邮件',
          Msg: this.EditorProject.detail_email
        }
      ]
    }
  },
  created () {
    // body
    document.body.setAttribute('class', 'bodyOf Pdd')
    this.$http.get('index/edit/getitemsaddress', {
      params: {
        itemid: this.EditorProject.id
      }
    }).then(res => {
      this.address[0].Msg = res.data.data[0].location
      this.address[1].Msg = res.data.data[0].Suite
      this.address[2].Msg = res.data.data[0].city
      this.address[3].Msg = res.data.data[0].provincial
      this.address[4].Msg = res.data.data[0].code
      this.address[5].Msg = res.data.data[0].country
      this.accessType = '' + res.data.data[0].statsu
    })
  },
  methods: {
    savedetail () {
      let reg = /^http(s)?:\/\/([-_a-zA-Z0-9]+\.)+[-_a-zA-Z0-9]+([-_a-zA-Z0-9./?%&=]*)?$/
      if (this.nameMsg[2].Msg) {
        if (!reg.test(this.nameMsg[2].Msg)) {
          this.$Message.error('网站地址格式输入有误')
          return false
        }
      }
      if (this.nameMsg[5].Msg) {
        if (!/^1\d{10}$/.test(this.nameMsg[5].Msg)) {
          this.$Message.error('手机格式输入有误')
          return false
        }
      }
      if (this.nameMsg[6].Msg) {
        if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.nameMsg[6].Msg)) {
          this.$Message.error('邮箱格式输入有误')
          return false
        }
      }
      // 循环数组
      this.$http.post('index2/items/save_detil', {
        // 项目id
        'id': this.EditorProject.id,
        // 提出者
        'detail_presenter': this.nameMsg[1].Msg,
        'title': this.nameMsg[0].Msg,
        // url
        'detail_link': this.nameMsg[2].Msg,
        // msg
        'description': this.nameMsg[3].Msg,
        // phone
        'detail_phone': this.nameMsg[5].Msg,
        // email
        'detail_email': this.nameMsg[6].Msg,
        'location': this.address[0].Msg
      }).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success('修改成功')
          this.$store.dispatch('isRouterReload', true)
          // 路由跳转
          this.$router.push({
            path: this.$route.fullPath
          })
          this.popClose()
        } else {
          this.$Message.error(res.data.message)
        }
        // 路由刷新
      })
    },
    // 地址接口
    saveaddress () {
      this.$http.post('index/edit/proeditaddress', {
        'projectid': this.EditorProject.id,
        'location': this.address[0].Msg,
        // 'Suite': this.address[1].Msg,
        // 'city': this.address[2].Msg,
        // 'provincial': this.address[3].Msg,
        // 'code': this.address[4].Msg,
        // 'country': this.address[5].Msg,
        'Suite': '',
        'city': '',
        'provincial': '',
        'code': '',
        'country': '',
        'statsu': this.accessType
      }).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success('修改成功')
          this.popClose()
          // 路由刷新
          this.$store.dispatch('isRouterReload', true)
          // 路由跳转
          this.$router.push({
            path: this.$route.fullPath
          })
        } else {
          this.$$Message.error('失败了，请重试!')
        }
      })
    },
    save () {
    },
    popClose: function (e) {
      this.$store.dispatch('showEditorTo', false)
      document.body.removeAttribute('class', 'bodyOf Pdd')
    },
    onCopy: function (e) {
      // 复制成功
    },
    success (nodesc) {
      this.$Notice.success({
        title: '复制成功'
      })
    },
    focus (e) {
      e.target.parentNode.style['border-bottom-color'] = 'rgb(0, 161, 255)'
      e.target.parentNode.previousElementSibling.style.color = '#2d8cf0'
    },
    blur (e) {
      e.target.parentNode.style['border-bottom-color'] = '#E8E8E8'
      e.target.parentNode.previousElementSibling.style.color = '#ADAFAF'
    }
  }
}
</script>
<style lang="scss">
.address {
  .address-view {
    margin-bottom:30px;
    .ivu-radio-group {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top:20px;
      .ivu-radio-wrapper {
        height:10vh;
        width:30%;
        text-overflow: ellipsis;
        border:1px solid #E7E8E8;
        padding-top:10px;
        padding-left:10px;
        box-sizing: border-box;
        color: #626262;
        display: flex;
        div {
          flex:1;
          width:50%;
          display: flex;
          flex-direction: column;
          text-overflow: hidden;
          p {
            width:100%;
            color: #626262;
            padding-top:2px;
            word-wrap:break-word;
            text-overflow:ellipsis;
            overflow:hidden;
          }
          p:first-child {
            padding-bottom:3px;
          }
        }
        .ivu-radio {
          margin-right:10px;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.clearfix:after{
  display: block;
  content:'';
  clear: both;
  height:0;
}
.dialog_container {
  display: block;
  width: 100%;
  width: 100vw;
  height: 100%;
  height: 100vh;
  background-color: rgba(24, 82, 94, .7);
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  .dialog_box {
    display: inline-block;
    border: 1px solid #ccc;
    text-align: left;
    vertical-align: middle;
    box-shadow: 0 7px 8px -4px rgba(0,0,0,.2), 0 13px 19px 2px rgba(0,0,0,.14), 0 5px 24px 4px rgba(0,0,0,.12);
    position: relative;
    .dialog_body {
      position: relative;
      width:34.7vw;
      min-width:258px;
      background-color: #fff;
      .dialog_body-choose {
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-start;
        align-items: center;
        width:100%;
        border-top:1px solid #a9a9a9;
        padding:20px 40px;
        button+button {
          margin-right:20px;
        }
        .ivu-btn-primary {
          background: #00B8CD;
          border-color: #00B8CD;
        }
      }
      .dialog_content {
        width: 100%;
        background: #fff;
        padding:30px 15px 15px 15px;
        box-sizing: border-box;
        .dialog_body-title {
          width:100%;
          height:auto;
          box-sizing: border-box;
          font-size:24px;
          color:#274A4B
        }
        .dialog_body-detail {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding:15px 0;
          .btn {
            width:100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            button {
              padding:8px 34px;
            }
            button:last-child {
              margin-left:15px;
              background: #2d8cf0
            }
          }
          .dialog-arround {
            .dialog_body-tabs-content {
              padding:10px;
              box-sizing: border-box;
              position: relative;
              margin-bottom: 60px;
              span {
                position: absolute;
                bottom: -10px;
                left:10px;
                font-size:12px;
                color:#ADAFAF;
              }
              // .name:nth-last-child(1) {
              //   width:50%;
              //   float: left;
              //   padding-left:20px;
              // }
              // .name:nth-last-child(2) {
              //   width:50%;
              //   float: left;
              // }
              .name {
                margin-top:0px;
                padding-top:20px;
                .name-one {
                  font-size:16px;
                  color:#626262;
                  transition: all .3s ease;
                }
                .name-two {
                  font-size:14px;
                  color: #666364;
                  padding-top:5px;
                  border-bottom:2px solid #E8E8E8;
                  padding-bottom:5px;
                  transition: all .3s ease;
                  input {
                    width:100%;
                    font-size:14px;
                    color:#666364;
                    border: none;
                    &:focus {
                      outline: none;
                    }
                  }
                }
              }
              p {
                font-size:14px;
                color: #7E7E7F;
                padding-bottom:10px;
              }
              .dialog-tabs-choose {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top:1px solid #e0e0e0;
                padding-top:20px;
                box-sizing: border-box;
                p {
                  font-size:14px;
                  color:#a9a9a9;
                  margin-top:5px;
                  margin-bottom:8px;
                }
                .dialog-choose-left-title {
                  display: flex;
                  align-items: center;
                  color:#a9a9a9;
                  h3 {
                    font-size:12px;
                    padding-right:10px;
                  }
                }
              }
              .dialog-search {
                display: flex;
                padding:15px;
                box-sizing: border-box;
                flex-direction: column;
                &>p {
                  font-size:12px;
                  color: #a9a9a9;
                  margin-top:2px;
                  padding-left:10px;
                  box-sizing: border-box;
                }
                .dialog-search-title {
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  padding-bottom: 10px;
                  span {
                    font-size :14px;
                    color:#a9a9a9;
                    padding-right:20  px;
                    padding-left:12px;
                    cursor: pointer;
                    &.active {
                      color: #00B8CD;
                      font-weight: 800;
                    }
                  }
                }
                .dialog-search-input {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  // padding: 5px 5px;
                  border-radius: 20px;
                  background: #fff;
                  border: 1px solid #e0e0e0;
                  .ivu-btn {
                    padding:10px 43px;
                    background-color: #01B9CF;
                    border-color:#01B9CF;
                    margin-left:10px;
                  }
                }
              }
            }
            .address {
              .dialog_body-tabs-content {
                margin-bottom:30px;
              }
              // .name:nth-last-child(1) {
              //   width:25%;
              //   float: left;
              //   padding-top:30px;
              // }
              // .name:nth-last-child(2) {
              //   width:25%;
              //   float: left;
              //   padding-right:20px;
              //   padding-top:30px;
              // }
              // .name:nth-last-child(3) {
              //   width:25%;
              //   float: left;
              //   padding-right:20px;
              //   padding-top:30px;
              // }
              // .name:nth-last-child(4) {
              //   width:25%;
              //   float: left;
              //   padding-top:30px;
              //   padding-right: 20px;
              // }
              .address-view {
                width:100%;
                height:20vh;
                .name-two {
                  font-size:14px;
                  color: #666364;
                  padding-top:5px;
                  padding-bottom:5px;
                  transition: all .3s ease;
                }
              }
            }
            .detail {
              .dialog_body-tabs-content {
                margin-bottom:166px;
                .name:nth-last-child(1) {
                  width:100%;
                  float: none;
                  padding-top:30px;
                  padding-left:0;
                }
                .name:nth-last-child(2) {
                  width:100%;
                  float: none;
                  padding-top:30px;
                }
              }
            }
          }
        }
      }
      .dialog_body-close {
        position: absolute;
        top:15px;
        right:15px;
        color:#274A4B;
        cursor:pointer;
      }
    }
  }
}
.dialog_container:after {
  display: inline-block;
  content: '';
  width: 0;
  height: 100%;
  vertical-align: middle;
}
</style>
