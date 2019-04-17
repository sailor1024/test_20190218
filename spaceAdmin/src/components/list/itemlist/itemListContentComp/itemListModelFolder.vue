<template>
  <div class="itemList-dialog-container" tabindex="-1" @keyup.esc="closeModal" @click.self="closeModal">
    <div class="itemList-dialog-box">
      <div class="itemList-dialog-body">
        <div class="itemList-dialog-content">
          <!-- <div class="dialog_body-close" @click="closeModal">
            <Icon type="close-round"></Icon>
          </div> -->
          <!-- title -->
          <!-- <h3 class="itemList-dialog-body-title">添加合作者到"{{inviteFolder.dir_name}}"</h3> -->
          <!-- tips -->
          <div class="itemList-dialog-tips">
            <div class="itemList-dialog-tips-icon">
              <!-- <Icon type="information-circled"></Icon> -->
              <i class="tips-alarm" @click="isShowWarn=true"></i>
            </div>
            <transition>
              <div class="itemList-dialog-tips-description" v-if="isShowWarn">
                <span>合作者必须添加到账户协作者页面（并接受邀请），然后才能将其添加到空间或文件夹<a href="javascript;" @click.prevent="toUserlist()">查看账户协作者</a></span>
                <Icon
                  @click="isShowWarn=false"
                  class="tips-btn"
                  type="close-round"></Icon>
              </div>
            </transition>
          </div>
          <!-- detail -->
          <div class="itemList-dialog-detail">
            <div class="itemList-dialog-detail-left">
              <div
                @click="slideType = 1"
                class="itemList-dialog-detail-item"
                :class="{'item-active': slideType === 1}">
                <i class="add__btn1"></i>
                <span>添加合作者</span>
              </div>
              <div
                @click="slideType = 2"
                class="itemList-dialog-detail-item"
                style="margin-top: 10px;"
                :class="{'item-active': slideType === 2}">
                <i class="add__btn2"></i>
                <span>现有合作者</span>
              </div>
              <!-- <div class="itemList-dialog-email">
                <h1>电子邮件地址</h1>
                <p>要为此空间提供私人访问权限，请输入账户协作者的电子邮件地址</p>
                <input v-focus v-model="email" type="text" placeholder="邮件地址" @keyup="keyup">
              </div> -->
              <!-- <div class="itemList-dialog-accessType">
                <h1>访问类型</h1>
                <div>
                  <RadioGroup v-model="accessType">
                    <Radio :label="1">可以查看</Radio>
                    <Radio :label="2">可以编辑</Radio>
                </RadioGroup>
                </div>
              </div> -->
            </div>
            <div class="itemList-dialog-detail-right">
              <!-- <div class="itemList-dialog-partner">
                <h1>目前的合作者</h1>
                <p>要查看这些项目目前与谁共享，请分别选择他们</p>
                <div class="itemList-dialog-shareTo">
                  <div
                    :class="{'itemList-dialog-shareItem':true,'active': activeIndex === index}"
                    v-for="(tmp,index) in dataMsg"
                    :key="index"
                    @click="handleChange(index, tmp)">
                      <p>{{tmp.user_name}}</p>
                      <p v-if="tmp.edit_type === 2">可以编辑</p>
                      <p v-else>可以查看</p>
                    </div>
                </div>
              </div> -->
              <div class="itemList-dialog-detail-item-content">
                <div v-if="slideType===1">
                  <p class="item-content__p">要为此空间提供私人访问权限，请输入账户协作者的电子邮件地址</p>
                  <input v-focus v-model="email" type="text" placeholder="邮件地址" @keyup="keyup">
                  <RadioGroup class="item-content__label" v-model="accessType">
                    <Radio :label="1">可以查看</Radio>
                    <Radio :label="2">可以编辑</Radio>
                  </RadioGroup>
                  <div class="itemList-dialog-btns">
                    <button class="c-button c-button__default" @click="closeModal">取消</button>
                    <button class="c-button c-button__primary" @click="ensure">确定</button>
                  </div>
                </div>
                <div v-else>
                  <ul class="itemList-dialog-shareTo">
                    <li
                      :class="{'itemList-dialog-shareItem':true,'active': activeIndex === index}"
                      v-for="(tmp,index) in dataMsg"
                      :key="index"
                      @click="handleChange(index, tmp)">
                        <span>{{tmp.user_name}}</span>
                        <span class="dialog-shareItem__right" v-if="tmp.edit_type === 2">可以编辑</span>
                        <span class="dialog-shareItem__right" v-else>可以查看</span>
                    </li>
                    <li v-if="!dataMsg.length" class="itemList-dialog-shareItem"><span>目前没有邀请合作者</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="itemList-dialog-btns">
          <Button style="background:#e1e1e1;color:#626262;width:84px;" size="large" @click.stop="closeModal()">取消</Button>
          <Button style="background:#2D8CF0;color:#fff;width:84px;" size="large" @click.stop="ensure()">确定</Button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import encrypt from '@/utils/encryption.js'
export default {
  props: ['id', 'inviteFolder'],
  data: function () {
    return {
      accessType: 1,
      activeIndex: null,
      dataMsg: [],
      email: '',
      list: [],
      slideType: 1,
      isShowWarn: true
    }
  },
  created () {
    // 请求该项目的活性合作者
    // this.$http.post('index/index/reception', {
    //   'userid': this.$store.state.userInfo.id,
    //   'phone': this.$store.state.userInfo.phone
    // }).then((res) => {
    //   let list = res.data.data
    //   for (let i = 0; i < list.length; i++) {
    //     this.$data.list.push(list[i].email)
    //   }
    // })
    this.$http.post('index2/index/invite_cooperator_list', {
      'item_dir': this.inviteFolder.id,
      'project_id': ''
    }).then((res) => {
      let data = res.data
      if (data.code === 200) {
        this.dataMsg = data.data
      }
    })
  },
  methods: {
    keyup (e) {
      if (e.keyCode === 13) {
        this.ensure()
      }
    },
    handleChange (index, tmp) {
      this.activeIndex = index
      this.email = tmp.email
      this.accessType = tmp.edit_type
    },
    closeModal () {
      this.$store.dispatch('ModelFolderInvite', false)
    },
    ensure () {
      if (this.email) {
        if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email)) {
          this.$Message.error('邮箱格式输入有误')
          return false
        } else {
          // 文件夹邀请
          this.$http.post('index2/email/email', {
            'email': encrypt(this.email),
            'file_type': 1, // 文件夹1 或者项目2
            'type': this.accessType,
            'item_id': this.inviteFolder.id,
            'edit_type': this.inviteFolder.edit_type
          }).then((res) => {
            if (res.data.code === 200) {
              this.$Message.success('邀请成功')
              this.closeModal()
            } else if (res.data.code === 401) {
              this.isShowWarn = true
              // this.$Message.error('邀请失败，请重新邀请')
            } else {
              this.$Message.error(res.data.message)
            }
          })
        }
      } else {
        this.$Message.error('请输入邮箱')
      }
    },
    toUserlist () {
      this.closeModal()
      this.$router.push('/userlist')
    }
  }
}
</script>

<style lang="scss">
.itemList-dialog-container{
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
  .itemList-dialog-box{
    display: inline-block;
    text-align: left;
    vertical-align: middle;
    position: relative;
    top:280px;
    width:41%;
    min-width:601.5px;
    background-color: #fff;
    box-shadow:0px 1px 3px 0px rgba($color: #ccc, $alpha: .3);
    border-radius: 4px;
    .itemList-dialog-body{
      position: relative;
      // width:49%;
      padding: 0 30px 26px 0;
      // 主要内用
      .itemList-dialog-content{
        width: 100%;
        box-sizing: border-box;
        // 主标题
        .itemList-dialog-body-title{
          width:100%;
          height:auto;
          box-sizing: border-box;
          font-size:26px;
          color:#274A4B
        }
        // 提示
        .itemList-dialog-tips{
          position: relative;
          height: 80px;
          padding-left: 33px;
          .tips-alarm {
            top: 21px;
            left: 15px;
            position: absolute;
            display: inline-block;
            background-image: url('~@/assets/images/alarm.png');
            background-size: cover;
            width: 38px;
            height: 38px;
            z-index: 10;
            cursor: pointer;
          }
          .itemList-dialog-tips-description{
            position: relative;
            display: inline-block;
            background-color: #00A1FF;
            border-radius: 4px;
            padding: 22px 83px 18px 65px;
            span {
              display: inline-block;
              width: 420px;
              color: #fff;
              font-size:14px;
              line-height: 20px;
            }
            a{
              color: #fff;
              font-size: 14px;
              font-weight: 700;
              margin-left: 8px;
            }
            .tips-btn {
              position: absolute;
              color: #fff;
              font-size: 10px;
              right: 13px;
              top: 35px;
              cursor: pointer;
            }
          }
        }
        // 邮箱，访问类型，目前合作者等
        .itemList-dialog-detail{
          display:flex;
          justify-content: start;
          padding-left: 20px;
          margin-top: 30px;
          .itemList-dialog-detail-left{
            padding-right:15px;
            // border-right:1px solid rgba(193, 193, 193, 0.4);
            // display:flex;
            // flex-direction:column;
            // justify-content: space-between;
            .itemList-dialog-email{
              h1{
                font-size:18px;
                font-weight:bold;
                color:#274A4B;
                line-height: 1.5;
              }
              p{
                margin-top:12px;
                font-size:12px;
                line-height:1.5;
              }
              input{
                border:2px solid transparent;
                outline:none;
                margin-top:24px;
                font-size:14px;
                padding-top:3px;
                padding-bottom:3px;
                color:#626262;
                transition:all 0.3s;
                width:100%;
              }
              input:focus{
                border-bottom-color:#2D8CF0;
              }
              input::-webkit-input-placeholder{
                color:#c1c1c1;
              }
            }
            .itemList-dialog-accessType{
              margin-bottom:24px;
              h1{
                font-size:18px;
                font-weight:bold;
                color:#274A4B
              }
              >div{
                margin-top:12px;
                font-size:12px;
              }
            }
          }
          .itemList-dialog-detail-right{
            flex: 1;
            padding-left:15px;
            overflow: hidden;
            .itemList-dialog-partner{
              h1{
                font-size:18px;
                font-weight:bold;
                color:#274A4B;
                line-height: 1.5;
              }
              p{
                margin-top:12px;
                font-size:12px;
                margin-bottom:12px;
                line-height:1.5;
              }
              .itemList-dialog-shareTo{
                border:1px solid rgba(193, 193, 193, 0.4);
                height:170px;
                overflow-y:scroll;
                .itemList-dialog-shareItem{
                  display: flex;
                  justify-content: space-between;
                  height:24px;
                  line-height:24px;
                  max-width:calc(34.7*0.4vw);
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  align-items: center;
                  overflow: hidden;
                  cursor: pointer;
                  padding-left:10px;
                  padding-right: 10px;
                  box-sizing:border-box;
                  &:hover {
                    background-color: rgba(45, 140, 240, .6);
                    color:#fff;
                  }
                }
                .itemList-dialog-shareItem.active{
                  height:24px;
                  background-color: rgb(45, 140, 240);
                  color: #fff;
                }
              }
            }
          }
        }
      }
      .itemList-dialog-btns{
        margin-top:30px;
      }
    }
  }
  //覆盖框架按钮样式
  .ivu-btn:focus{
    box-shadow:0 0 0 0 #000;
  }
  .ivu-btn{
    border:none;
  }
  //覆盖框架radio样式
  .ivu-radio-checked:hover .ivu-radio-inner{
    border-color:#2D8CF0;
  }
  .ivu-radio-inner:after{
    background-color:#2D8CF0;
  }
  .ivu-radio-checked .ivu-radio-inner{
    border-color:#2D8CF0;
  }
  .itemList-dialog-detail-item {
    width: 228px;
    border-radius: 4px;
    background: #fff;
    padding: 20px 0 16px 0;
    text-align: center;
    color: #666;
    transition: all 0.2s ease-in-out;
    user-select: none;
    cursor: pointer;
    i {
      display: inline-block;
      width: 32px;
      height: 32px;
      background-size: cover;
    }
    i.add__btn1 {
      background-image: url('~@/assets/images/user_new.png');
    }
    i.add__btn2 {
      background-image: url('~@/assets/images/user_list_v1.png');
    }
    span {
      display: block;
      font-size: 12px;
      margin-top: 23px;
    }
  }
  .itemList-dialog-detail-item.item-active {
    background-color: #00A1FF;
    box-shadow: 0 4px 3px 0 rgba($color: #00A1FF, $alpha: .3);
    color: #fff;

    i.add__btn1 {
      background-image: url('~@/assets/images/user_new_v1.png');
    }
    i.add__btn2 {
      background-image: url('~@/assets/images/user_list.png');
    }
  }
  .itemList-dialog-detail-item-content {
    color: #666;

    .item-content__p {
      font-size: 14px;
      line-height: 20px;
    }
    input {
      border:2px solid transparent;
      outline:none;
      margin-top:39px;
      font-size:14px;
      line-height: 20px;
      color:#626262;
      transition:all 0.3s ease-in-out;
      width:100%;
    }
    input:focus{
      border-bottom-color:#2D8CF0;
    }
    input::-webkit-input-placeholder{
      color:#c1c1c1;
    }
    .item-content__label {
      margin-top: 43px;
    }
  }
  .itemList-dialog-shareTo {
    height: 225px;
    overflow: auto;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #666;
      font-size: 14px;
      line-height: 44px;
      border-bottom: 1px solid #DDDDDD;
      cursor: default;
    }
  }
}
.v-enter-active, .v-leave-to {
  transition: opacity .2s ease-in-out;
}
.v-enter, .v-leave-to {
  opacity: 0;
}
</style>
