<template>
<div class="dialog_container">
  <div class="dialog_box">
    <div class="dialog_body">
      <div class="dialog_content">
        <!-- title -->
        <h3 class="dialog_body-title">分享</h3>
        <!-- detail -->
        <div class="dialog_body-detail">
          <div class="dialog-arround">
            <Tabs size="small" class="dialog_body-small" v-model="tabIndex">
                <Tab-pane class="dialog_body-tabs" :label="item.label" v-for="(item, index) in Tabpane" :key="index">
                  <div class="dialog_body-tabs-content">
                    <p>{{item.title}}</p>
                    <div class="dialog-search">
                      <div class="dialog-search-title">
                        <span :class="active === 0 ? 'active' : '' " @click="linkemit">{{item.link}}</span>
                        <span :class="active === 1 ? 'active' : '' " @click="Embedemit">{{item.Embed}}</span>
                      </div>
                      <!-- search -->
                      <div class="dialog-search-input">
                        <i-input :key="item.key" :value.sync="insetVal" placeholder="" v-model="insetVal"></i-input>
                        <!-- copy按钮 -->
                        <i-button class="Copybtn" type="primary" shape="circle" size="large" @click="success(true)" v-clipboard:copy="insetVal" v-clipboard:success="onCopy">{{item.copy}}</i-button>
                      </div>
                      <p style="margin-top: 5px;">{{copyTitle}}</p>
                    </div>
                    <!-- choose -->
                    <!-- <div class="dialog-tabs-choose">
                      <div class="dialog-choose-left">
                        <div class="dialog-choose-left-title">
                          <h3>VR Sharing</h3>
                          <Icon type="help-circled"></Icon>
                        </div>
                        <p>The account default is currently Enabled.</p>
                        <RadioGroup v-model="disabledGroupLeft">
                          <Radio label="Default">Default</Radio>
                          <Radio label="Enable">Enable</Radio>
                          <Radio label="Disable">Disable</Radio>
                        </RadioGroup>
                      </div>
                      <div class="dialog-choose-right">
                        <div class="dialog-choose-left-title">
                          <h3>Allow social sharing</h3>
                          <Icon type="help-circled"></Icon>
                        </div>
                        <p>The account default is currently Enabled.</p>
                        <RadioGroup v-model="disabledGroupRight">
                          <Radio label="Default">Default</Radio>
                          <Radio label="Enable">Enable</Radio>
                          <Radio label="Disable">Disable</Radio>
                        </RadioGroup>
                      </div>
                    </div> -->
                  </div>
                </Tab-pane>
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
  data () {
    return {
      disabledGroupLeft: 'Default',
      disabledGroupRight: 'Enable',
      // 建设tabs
      Tabpane: [
        {
          label: '商标',
          title: '包含所有公共信息',
          link: '链接',
          Embed: '嵌入',
          key: '商标',
          copy: '复制',
          copyTitle: '复制内容嵌入'
        },
        {
          label: '无商标',
          title: '包含所有公共信息',
          link: '链接',
          Embed: '嵌入',
          key: '无商标',
          copy: '复制',
          copyTitle: '复制内容嵌入'
        }
        // {
        //   label: 'MLS',
        //   title: '包含所有公共信息',
        //   link: '链接',
        //   Embed: '嵌入',
        //   key: 'MLS',
        //   copy: '复制',
        //   copyTitle: '复制内容嵌入'
        // },
        // {
        //   label: 'VR',
        //   title: '包含所有公共信息',
        //   link: '链接',
        //   Embed: '嵌入',
        //   key: 'VR',
        //   copy: '复制',
        //   copyTitle: '复制内容嵌入'
        // }
      ],
      // 用户输入的值
      insetVal: 'https://todo.kangyun3d.cn/' + this.$store.state.json.url,
      active: 0,
      tabIndex: 0,
      copyTitle: '复制链接进行分享'
    }
  },
  created () {
    // body
    document.body.setAttribute('class', 'bodyOf Pdd')
  },
  methods: {
    linkemit () {
      this.active = 0
      this.insetVal = 'https://todo.kangyun3d.cn/' + this.$store.state.json.url
    },
    Embedemit () {
      this.active = 1
      this.insetVal = '<iframe width=' + 853 + ' height=' + 480 + ' src=https://todo.kangyun3d.cn/' + this.$store.state.json.url + '  frameborder=0 allowfullscreen allow=vr></iframe>'
    },
    popClose: function (e) {
      this.$store.dispatch('shareTo', false)
      document.body.removeAttribute('class', 'bodyOf Pdd')
    },
    onCopy: function (e) {
      // 复制成功
    },
    success (nodesc) {
      this.$Notice.success({
        title: '复制成功'
      })
    }
  },
  watch: {
    active (newValue) {
      if (newValue === 0) {
        this.copyTitle = '复制链接进行分享'
      } else {
        this.copyTitle = '复制内容嵌入'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog_container {
  display: block;
  width: 100%;
  width: 100vw;
  height: 100%;
  height: 100vh;
  background-color: rgba(24,82,94,.7);
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
    position: relative;
    box-shadow: 0 7px 8px -4px rgba(0,0,0,.2), 0 13px 19px 2px rgba(0,0,0,.14), 0 5px 24px 4px rgba(0,0,0,.12);
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
          .dialog-arround {
            .dialog_body-tabs-content {
              padding:10px;
              box-sizing: border-box;
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
                    color:#7E7E7F;
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
                    padding-right:20px;
                    padding-left:12px;
                    cursor: pointer;
                    &.active {
                      color: #2d8cf0;
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
                    // background-color: #01B9CF;
                    // border-color:#01B9CF;
                    margin-left:10px;
                  }
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
