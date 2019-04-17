<template>
  <div >
    <pop v-if="popTo" :giveData="title" :shareShow="shareShow"></pop>
    <share v-if="shareTo"></share>
    <Row class="Yun-nav" type="flex">
      <Row class="Yun-nav-container" type="flex" :style="windowReide">
        <i-col span="15" order="1">
          <!-- <p class="Yun-space" @click="home">云空间</p> -->
          <p class="Yun-page">{{title.title}}</p>
        </i-col>
        <!-- <i-col span="10" order="2" v-if="true"></i-col> -->
        <i-col span="9" order="3">
          <div class="Yun-shareSpace">
             <div style="padding-right: 22px;">
                <div class="barbal Yun-space-Pos">
                    <div class="Yun-space-list">
                      <i class="font_family icon-icon-test10"  :class="[status === 1 ? 'shareActive' : '']" @click.stop="popShowHover"></i>
                      <span @click.stop="popShowHover">管理合作者</span>
                    </div>
                    <!-- 弹出框 -->
                    <div class="Yun-space-pop" v-if="popShow" @click.stop="stop">
                      <div
                        v-if="!inviteList.length"
                        @keyup.enter="sendemail">
                        <div class="Yun-space-pop-header">
                          <p class="Yun-space-pop-header-title">该项目暂无合作者，您可以通过邮箱进行邀请</p>
                          <div>
                            <Icon class="font_family icon-email"></Icon>
                            <div class="Yun-space-pop-input">
                              <i-input placeholder="请输入邮箱地址" value.sync="value" v-model="email"></i-input>
                            </div>
                            <!-- <Dropdown @on-click="selectfunc">
                              <a href="javascript:void(0)">
                                {{canView}}
                                <Icon type="arrow-down-b"></Icon>
                              </a>
                              <Dropdown-menu slot="list" class="yun-space-hover">
                                <Dropdown-item name="可以查看" key="canView">可以查看</Dropdown-item>
                                <Dropdown-item name="可以编辑" key="canEdit">可以编辑</Dropdown-item>
                              </Dropdown-menu>
                            </Dropdown> -->
                          </div>
                        </div>
                        <!-- <div class="inner" v-for="item in inviteList" :key='item.email'>
                          <Icon class="font_family icon-icon-test5"></Icon>
                          <div class="Yun-space-intived">
                            <div class="invite-name">{{item.user_name}}</div>
                            <div class="invite-email">{{item.email}}</div>
                          </div>
                          <Dropdown @on-click="sendItem(item, arguments[0])">
                            <a class="inner__a" href="javascript:void(0)">
                              {{item.optionName}}
                              <Icon type="arrow-down-b"></Icon>
                            </a>
                            <Dropdown-menu slot="list" class="yun-space-hover">
                              <Dropdown-item :name="1" :key="1">可以查看</Dropdown-item>
                              <Dropdown-item :name="2" :key="2">可以编辑</Dropdown-item>
                              <Dropdown-item :name="3" :key="3">删除用户</Dropdown-item>
                            </Dropdown-menu>
                          </Dropdown>
                        </div> -->
                        <RadioGroup v-model="editor">
                            <Radio :label="1">
                              <span class="radio__span">可以查看</span>
                            </Radio>
                            <Radio :label="2">
                              <span class="radio__span">可以编辑</span>
                            </Radio>
                        </RadioGroup>
                        <div class="Yun-space-invite">
                          <!-- <i-button @click="sendemail" type="ghost" shape="circle">邀请</i-button> -->
                          <button
                            @click="sendemail"
                            class="c-button c-button__primary--radius">邀请</button>
                        </div>
                      </div>
                      <div
                        v-else
                        @keyup.enter="sendItem">
                        <div class="Yun-space-pop-header">
                          <p class="Yun-space-pop-header-title">请选择该项目的合作者</p>
                          <div>
                            <i-select
                              class="Yun-space__select"
                              @on-change="choiceItem" v-model="userItemIndex">
                              <i-option
                                v-for="(item, index) in inviteList"
                                :key="index"
                                :value="index">{{item.user_name}}</i-option>
                            </i-select>
                          </div>
                        </div>
                        <RadioGroup v-model="userEditType">
                            <Radio :label="1">
                              <span class="radio__span">可以查看</span>
                            </Radio>
                            <Radio :label="2">
                              <span class="radio__span">可以编辑</span>
                            </Radio>
                            <Radio :label="3">
                              <span class="radio__span">删除用户</span>
                            </Radio>
                        </RadioGroup>
                        <div class="Yun-space-invite">
                          <!-- <i-button @click="sendemail" type="ghost" shape="circle">邀请</i-button> -->
                          <button
                            @click="sendItem"
                            class="c-button c-button__primary--radius">保存</button>
                        </div>
                      </div>
                    </div>
                </div>
                <div style="margin: 0 47px;" class="barbal">
                    <div class="Yun-space-list" @click="pop">
                      <!-- 可以查看，项目私密-->
                      <i class="font_family icon-icon-test8" style="color:#a9a9a9" v-if="shareShow === 0 && status === 1"></i>
                      <!-- 可以查看，项目公开 -->
                      <i class="font_family icon-icon-test8" style="color:#a9a9a9" v-else-if="shareShow === 1 && status === 1"></i>
                      <!-- 可以编辑，项目私密 -->
                      <i class="font_family icon-icon-test8" v-else-if="shareShow === 0 && status === 2"></i>
                      <!-- 超级管理员显示 -->
                      <i class="font_family icon-icon-test8"  v-else-if="shareShow === 0"></i>
                      <Icon type="unlocked" v-else></Icon>
                      <span v-if="shareShow === 0" style="white-space:nowrap">空间是私人的</span>
                      <span v-else>空间是公共的</span>
                    </div>
                </div>
                <div class="barbal">
                    <div class="Yun-space-list" @click="share">
                      <i class="font_family icon-icon-test14" :class="[shareShow === 0 ? 'shareActive' : '']"></i>
                      <span :class="[shareShow === 0 ? 'shareActive' : '']">分享</span>
                    </div>
                </div>
                <!-- <i-col span="6" class="Yun-space-More-pop">
                    <div class="Yun-space-list">
                      <i class="font_family icon-icon-test11-copy"></i>
                      <span>更多</span>
                    </div>
                    <div class="More-pop">
                      <p>no more</p>
                    </div>
                    <div class="More-pop">
                      <p>no more</p>
                    </div>
                </i-col> -->
            </div>
          </div>
        </i-col>
      </Row>
    </Row>
  </div>
</template>

<script>
import pop from '@/components/common/header/headComp/pop'
import share from '@/components/common/header/headComp/share'
import encrypt from '@/utils/encryption.js'
import MD5 from 'md5'

export default {
  name: 'clounnavConponent',
  props: ['title'],
  data () {
    return {
      accessType: 1,
      popTo: this.$store.state.popTo,
      shareTo: this.$store.state.shareTo,
      windowReide: this.$store.state.spaceReside,
      canView: '可以查看',
      email: '',
      // 弹出框显示
      popShow: false,
      // 等于0 ==> 私密链接  1 ==> 公开链接
      shareShow: 0,
      // status 1=>可以查看 2=>可以编辑
      status: '',
      data: [],
      editor: 1,
      // 活性协作者
      list: [],
      inviteList: [],
      nameObj: {
        1: '可以查看',
        2: '可以编辑',
        3: '删除用户'
      },
      userEditType: 1,
      userItemIndex: 0
    }
  },
  components: {
    pop,
    share
  },
  created () {
    this.shareShow = this.$store.state.json.isshow_offica
    // 检测首次是否ipad端
    if (window.innerWidth === 768) {
      this.$data.windowReide = {
        padding: '0 100px'
      }
    }
    this.getData()
  },
  methods: {
    choiceItem (i) {
      this.userEditType = this.inviteList[i].edit_type
    },
    home: function () {
      this.$router.push({
        path: '/'
      })
    },
    stop: function () {},
    popShowHover () {
      if (this.status !== 2) {
        this.$Message.error('对不起，您暂时还不能邀请合作者')
        return
      }
      this.popShow = !this.popShow
      document.onclick = () => {
        this.popShow = false
      }
    },
    sendemail () {
      if (this.email) {
        // this.editor = 1
        // if (this.canView === '可以编辑') {
        //   this.editor = 2
        // }
        // if (this.list.indexOf(this.email) === -1) {
        //   this.$Message.error('对不起，只能邀请激活的协作者')
        //   return false
        // }
        this.$http.post('/index2/email/email', {
          'email': encrypt(this.email),
          'file_type': 2, // 文件夹1 或者项目2
          'userid': this.$store.state.userInfo.id,
          'type': this.editor,
          'item_id': this.$route.query.id
        }).then((res) => {
          if (res.data.code === 200) {
            this.$Message.success('邀请成功')
            this.getData()
          } else if (res.data.code === 401) {
            this.$Message.error('邀请失败，请重新邀请')
          } else {
            this.$Message.error(res.data.message)
          }
        })
      } else {
        this.$Message.error('请输入邮箱')
      }
    },
    pop: function () {
      if (this.status === 1) {
        this.$Message.error('对不起，您不能公开此项目')
        return false
      }
      if (this.shareShow === 0) {
        this.$data.popTo = true
        this.$store.state.popTo = true
      } else {
        this.popTo = true
        this.$store.state.popTo = true
      }
    },
    share: function () {
      if (this.shareShow) {
        this.$store.state.shareTo = true
        this.$data.shareTo = true
      }
    },
    selectfunc: function (name) {
      this.canView = name
    },
    getData () {
      this.$http.post('index2/index/invite_cooperator_list', {
        'item_dir': '',
        'project_id': this.$route.query.id
      }).then((res) => {
        let data = res.data
        if (data.code === 200) {
          data.data.forEach(item => {
            item.optionName = this.nameObj[item.edit_type]
          })
          this.inviteList = data.data
          if (this.inviteList.length) {
            this.userEditType = this.inviteList[0].edit_type
            this.userItemIndex = 0
          }
        }
      })
    },
    sendItem () {
      this.$http.post('index2/email/edit_invite_items', {
        dir_item_id: this.$route.query.id,
        email: MD5(this.inviteList[this.userItemIndex].email),
        type: this.userEditType,
        file_type: 2,
        edit_type: this.JsonMsg.edit_type
      }).then(res => {
        if (res.data.code === 200) {
          if (this.userEditType === 3) {
            this.getData()
          }
          this.$Message.success('修改成功')
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }
  },
  computed: {
    // 监听vuex中的popTo数据
    popToChange () {
      return this.$store.state.popTo
    },
    shareToChange () {
      return this.$store.state.shareTo
    },
    spaceReside () {
      return this.$store.state.spaceReside
    },
    json () {
      return this.$store.state.json.isshow_offica
    },
    shareShowChange () {
      return this.$store.state.shareShowChange
    },
    JsonMsg () {
      return this.$store.state.json
    }
  },
  watch: {
    json (newVal) {
      this.shareShow = newVal
    },
    popToChange (newVal, oldVal) {
      this.$data.popTo = newVal
    },
    shareToChange (newVal, oldVal) {
      this.$data.shareTo = newVal
    },
    spaceReside (newVal, oldVal) {
      this.$data.windowReide = newVal
    },
    shareShowChange (newVal) {
      this.shareShow = newVal
    },
    JsonMsg (newVal) {
      this.status = newVal.edit_type
    }
  }
}
</script>

<style lang="scss" scoped>
.shareActive {
  color:#a9a9a9 !important;
}
 .layout{
        border: 1px solid #d7dde4;
        background: #00A1FF;
    }
    .layout-logo{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        width:129px;
        height:100%;
        .layout-logo-container {
          margin-top:19px;
          img {
            display: block;
            width:129px;
            height:15px;
          }
        }
        .KY-logo {
          width:129px;
          height:15px;
          display: block;
          background: #fff;
          color:#333;
        }
        span {
          font-size:12px;
          // font-family: PingFangSC;
          font-weight:Regular;
          line-height:17px;
          color:rgba(255,255,255,1);
        }
    }
    .layout-nav{
      flex:1;
      justify-content: flex-start;
      margin-left:49px;
        li>i {
          width:21px;
          height:24px;
          font-size:20px;
          color:#fff;
        }
    }
    .container {
      width:100%;
      height:100%;
      padding:0 143px;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      .layout-user {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height:100%;
        i {
          color:#ffffff
        }
        .slide-content {
          width:13px;
          height:8px;
          overflow: hidden;
          position: relative;
          .slide {
            position: absolute;
            left:-3px;
            top:-30px;
            font-size:12px;
            padding-left:6px;
            color:#ffffff;
          }
        }
      }
    }
    .Yun-nav {
      width:100%;
      height:121px;
      background:rgba(255,255,255,1);
      box-shadow:0px 2px 2px 0px rgba(0,0,0,0.1);
      .Yun-nav-container {
        width:100%;
        height:100%;
        padding:0 155px;
        box-sizing:border-box;
        .Yun-space {
          width:42px;
          height:20px;
          font-size:14px;
          // font-family:PingFang-SC-Medium;
          color:rgba(169,169,170,1);
          line-height:20px;
          cursor: pointer;
        }
        .Yun-page {
          // width:38px;
          padding-top:48px;
          font-size:26px;
          // font-family:Helvetica;
          color:#00A1FF;
          font-weight: bold;
        }
        .Yun-shareSpace {
          height:100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .Yun-space-Pos {
            position: relative;
          }
          .Yun-space-pop {
            position: absolute;
            border-radius: 4px;
            width: 296px;
            top:60px;
            left:-116px;
            background: #fff;
            z-index: 50;
            box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.2);
            padding: 20px 20px 26px;
            // &::after {
            //   box-sizing: content-box;
            //   width: 0px;
            //   height: 0px;
            //   position: absolute;
            //   top: -18px;;
            //   right:176px;
            //   padding:0;
            //   border-bottom:9px solid #e0e0e0;
            //   border-top:9px solid transparent;
            //   border-left:9px solid transparent;
            //   border-right:9px solid transparent;
            //   display: block;
            //   content:'';
            //   z-index:10
            // }
            // &::before {
            //   box-sizing: content-box;
            //   width: 0px;
            //   height: 0px;
            //   position: absolute;
            //   top: -16px;;
            //   right:177px;
            //   padding:0;
            //   border-bottom:8px solid #FFFFFF;
            //   border-top:8px solid transparent;
            //   border-left:8px solid transparent;
            //   border-right:8px solid transparent;
            //   display: block;
            //   content:'';
            //   z-index: 12;
            // }
            & /deep/ .ivu-dropdown-item:not(:last-child) {
              border-bottom: 1px solid #efefef;
            }
            .inner {
              border-bottom:1px solid #efefef;
              display: flex;
              justify-content: space-around;
              -webkit-box-align: center;
              align-items: center;
              padding: 10px 15px;
              box-sizing: border-box;
              .font-box {
                width: 23%;
                .font-sty {
                  font-size: 12px;
                  color: #a9a9a9;
                }
              }
              .Yun-space-intived {
                width: 64%;
                .invite-name {
                  color: #333;
                  font-size: 12px;
                }
                .invite-email {
                  color: #a9a9a9;
                  font-size: 12px;
                  padding-top: 5px
                }
              }
              i {
                font-size: 16px;
                color: #a9a9a9;
                padding-right: 10px;
                flex: 1;
              }
            }
            .Yun-space-pop-header {
              border-bottom:1px solid #efefef;
              &>div {
                display: flex;
                justify-content: space-around;
                align-items: center;
                margin-top: 24px;
                box-sizing: border-box;
                .Yun-space-pop-input {
                  flex: 1;
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                }
                i {
                  font-size:16px;
                  color: #a9a9a9;
                }
                .ivu-dropdown-rel>a {
                  font-size:12px;
                  color:#a9a9a9;
                }
              }
            }
            .Yun-space-invite {
              position: absolute;
              right: 20px;
              bottom: 20px;
              // padding-top:60px;
              box-sizing:border-box;
              button {
                color:#fff;
                padding:11px 25px;
              }
            }
            .Yun-space-start {
              position: absolute;
              top:10px;
              left:43%;
              width:10px;
              height:10px;
              background: #ddd;
            }
          }
          .Yun-space-list {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            cursor: pointer;
            &:hover span {
              color:#00A1FF;
            }
            span {
              padding-top:10px;
              font-size:12px;
              // font-family:PingFangSC-Regular;
              color:rgba(169,169,170,1);
              line-height:17px;
            }
            i {
              color:#00A1FF;
              font-size:22px;
              display: block;
            }
          }
          .Yun-space-More-pop {
            position:relative;
            &:hover .More-pop {
              display:block;
            }
            .More-pop {
              position: absolute;
              display: none;
              width:130px;
              top:60px;
              left:-24px;
              background: #fff;
              z-index:1;
              box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
              cursor: pointer;
              &>p {
                font-size: 14px;
                color: #a9a9a9;
                text-align: center;
                padding:10px;
              }
              &::after {
                box-sizing: content-box;
                width: 0px;
                height: 0px;
                position: absolute;
                top: -18px;;
                right:56px;
                padding:0;
                border-bottom:9px solid #e0e0e0;
                border-top:9px solid transparent;
                border-left:9px solid transparent;
                border-right:9px solid transparent;
                display: block;
                content:'';
                z-index:10
              }
              &::before {
                box-sizing: content-box;
                width: 0px;
                height: 0px;
                position: absolute;
                top: -16px;;
                right:57px;
                padding:0;
                border-bottom:8px solid #FFFFFF;
                border-top:8px solid transparent;
                border-left:8px solid transparent;
                border-right:8px solid transparent;
                display: block;
                content:'';
                z-index: 12;
              }
            }
          }
        }
      }
    }
  .inner__a {
    font-size: 12px;
    color: #a9a9a9;
  }
.barbal {
  float: left;
}
.Yun-space-pop-header-title {
  color: #999999;
  font-size: 12px;
}
.radio__span {
  margin-left: 8px;
  font-size: 14px;
  color: #666666;
}
.Yun-space-pop /deep/  label {
  display: block;
  margin-top: 24px;
  &:first-child {
    margin-top: 17px;
  }
}
.Yun-space__select /deep/ {
  .ivu-select-selection {
    border-color: transparent;
    box-shadow: none !important;
  }
  .ivu-select-selected-value {
    color: #666666;
    padding-left: 12px;
    font-size: 14px;
    height: 36px;
    line-height: 36px;
  }
  .ivu-select-item {
    color: #666666;
    padding: 13px 0;
    padding-left: 12px;
    font-size: 14px !important;
  }
  .ivu-select-dropdown {
    margin-top: 0px;
  }
  .ivu-select-single .ivu-select-selection {
    height: 38px;
  }
  .ivu-select-item-selected {
    color: #00A1FF;
  }
}
</style>
