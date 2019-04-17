<template>
  <kangyun-modal :styleObject="modalStyle" @closeModal="popClose">
    <div class="box-content">
      <h3 class="box-title">编辑细节</h3>
      <div class="box-content__container">
        <button
          :class="{'c-button--text': showType!=='detail'}"
          @click="showType='detail'"
          class="c-button c-button__primary--radius">公开详情</button>
        <button
          :class="{'c-button--text': showType!=='address'}"
          @click="showType='address'"
          class="c-button c-button__primary--radius">地址</button>
      </div>
      <transition mode="out-in">
        <div v-if="showType==='detail'" key="detail">
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
            <!-- <i-button type="default" @click="popClose">取消</i-button> -->
            <!-- <i-button type="info" @click="savedetail">保存</i-button> -->
            <button
              class="c-button c-button__default"
              @click="popClose">取消</button>
            <button
              class="c-button c-button__primary"
              @click="savedetail">保存</button>
          </div>
        </div>
        <div v-else key="address">
          <div class="dialog_body-tabs-content clearfix">
            <p class="dialog_body-tabs-content__descript">输入您的空间的完整的地址。你可以使用一下选项限制地址的公开可见性</p>
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
                    <span class="address-span">完整地址</span>
                  </Radio>
                  <!-- <Radio label="1">
                      <div>
                      <p>城市，州，邮政编码，国家</p>
                      <p></p>
                    </div>
                  </Radio> -->
                  <Radio label="0">
                    <span class="address-span">没有</span>
                  </Radio>
              </RadioGroup>
              <div class="address-one"></div>
            </div>
          </div>
          <div class="btn">
            <!-- <i-button type="default" @click="popClose">取消</i-button> -->
            <!-- <i-button type="info" @click="savedetail">保存</i-button> -->
            <button
              class="c-button c-button__default"
              @click="popClose">取消</button>
            <button
              class="c-button c-button__primary"
              @click="savedetail">保存</button>
          </div>
        </div>
      </transition>
    </div>
  </kangyun-modal>
</template>

<script>
import kangyunModal from '@/components/common/modal/kangyunModal'
import '@/assets/css/iviewChange.css'
export default {
  name: 'share',
  components: {
    kangyunModal
  },
  props: ['EditorProject'],
  data () {
    return {
      showType: 'detail',
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
      ],
      modalStyle: {
        width: '49vw',
        'min-width': '487px'
      }
    }
  },
  created () {
    // body
    // document.body.setAttribute('class', 'bodyOf Pdd')
    // this.$http.get('index/edit/getitemsaddress', {
    //   params: {
    //     itemid: this.EditorProject.id
    //   }
    // }).then(res => {
    //   this.address[0].Msg = res.data.data[0].location
    //   this.address[1].Msg = res.data.data[0].Suite
    //   this.address[2].Msg = res.data.data[0].city
    //   this.address[3].Msg = res.data.data[0].provincial
    //   this.address[4].Msg = res.data.data[0].code
    //   this.address[5].Msg = res.data.data[0].country
    //   this.accessType = '' + res.data.data[0].statsu
    // })
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
        'location': this.address[0].Msg,
        'items_orientation': '',
        'house_type': '',
        'items_area': ''
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
      // document.body.removeAttribute('class', 'bodyOf Pdd')
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
      // e.target.parentNode.style['border-bottom-color'] = 'rgb(0, 161, 255)'
      // e.target.parentNode.previousElementSibling.style.color = '#2d8cf0'
    },
    blur (e) {
      // e.target.parentNode.style['border-bottom-color'] = '#E8E8E8'
      // e.target.parentNode.previousElementSibling.style.color = '#ADAFAF'
    }
  }
}
</script>
<style lang="scss" scoped>
.box-content {
    padding: 24px 24px;
    transition: height 1s ease-in-out;
  }
  .box-title {
    font-size: 26px;
    color: #666666;
    margin-bottom: 40px;
  }
  .name {
    margin-top:0px;
    padding-top: 32px;
    .name-one {
      color: #666666;
      font-size: 16px;
      margin-right: 14px;
      transition: all .3s ease;
      padding-bottom: 11px;
    }
    .name-two {
      // font-size:14px;
      // color: #666364;
      // padding-top:5px;
      // border-bottom:2px solid #E8E8E8;
      // padding-bottom:5px;
      // transition: all .3s ease;
      input {
        outline: 0;
        border: 0;
        border-bottom: 1px solid #E0E0E0;
        font-size: 14px;
        color: #7D7D7D;
        line-height: 1.5;
        width: 100%;
        transition: all .3s ease-in-out;
        &:focus {
          border-color: #00A1FF;
        }
      }
    }
  }
  .btn {
    text-align: center;
    margin-top: 24px;
  }
  .dialog_body-tabs-content__descript {
    margin-top: 32px;
    font-size: 16px;
    color: #666666;
  }
  .address-view {
    .name-two {
      margin-top: 33px;
      margin-bottom: 25px;
      color: #666;
      font-size: 16px;
      margin-right: 14px;
      transition: all .3s ease;
      padding-bottom: 10px;
    }
    .address-span {
      color: #999999;
      font-size: 14px;
      margin: 0 47px 0 14px;
    }
  }
.box-content__container {
  margin-bottom: 6px;
}
.v-enter-active, .v-leave-to {
  transition: opacity .2s ease-in-out;
}
.v-enter, .v-leave-to {
  opacity: 0;
}
.edite-dialog_body {
  width: 50%;
}
</style>
