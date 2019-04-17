<template>
  <kangyun-modal
    isShowCloseBtn
    @closeModal="popClose"
    :modalWidth="631">
    <div class="box-content">
      <h3 class="box-title">分享</h3>
      <div class="box-btn" style="padding-left: 7px;">
        <button
          @click="tabIndex=0"
          :class="{'c-button--text': tabIndex!==0}"
          class="c-button c-button__primary--radius">商标</button>
        <button
          @click="tabIndex=1"
          :class="{'c-button--text': tabIndex!==1}"
          class="c-button c-button__primary--radius">无商标</button>
      </div>
      <transition mode="out-in">
        <div
          v-if="tabIndex===index"
          class="dialog_body-tabs"
          v-for="(item, index) in Tabpane"
          :key="index">
          <div class="dialog_body-tabs-content">
            <p>{{item.title}}</p>
            <div class="dialog-search">
              <!-- <div class="dialog-search-title">
                <span :class="active === 0 ? 'active' : '' " @click="linkemit">{{item.link}}</span>
                <span :class="active === 1 ? 'active' : '' " @click="Embedemit">{{item.Embed}}</span>
              </div> -->
              <RadioGroup style="padding-left: 14px;" v-model="active" @on-change="emmet">
                <Radio :label="0">
                  <span
                    :class="active === 0 ? 'active' : '' "
                    class="address-span">{{item.link}}</span>
                </Radio>
                <Radio :label="1">
                  <span
                    :class="active === 1 ? 'active' : '' "
                    class="address-span">{{item.Embed}}</span>
                </Radio>
            </RadioGroup>
              <!-- search -->
              <div class="dialog-search-input box-btn">
                <!-- <i-input :key="item.key" :value.sync="insetVal" placeholder="" v-model="insetVal"></i-input> -->
                <input type="text" v-model="insetVal">
                <!-- copy按钮 -->
                <!-- <i-button class="Copybtn" type="primary" shape="circle" size="large" @click="success(true)" v-clipboard:copy="insetVal" v-clipboard:success="onCopy">{{item.copy}}</i-button> -->
                <button style="margin-left: 20px;" class="c-button c-button__primary--radius" @click="success(true)" v-clipboard:copy="insetVal" v-clipboard:success="onCopy">{{item.copy}}</button>
              </div>
              <p style="color:#CCCCCC;margin-left: 12px;margin-top: 13px; font-size: 12px;">{{copyTitle}}</p>
            </div>
          </div>
        </div>
      </transition>
      <!-- <div style="text-align: center; margin-top: 33px;">
        <button v-focus class="c-button c-button__default" @click="popClose">取消</button>
      </div> -->
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
  methods: {
    emmet (item) {
      if (item === 0) {
        this.active = 0
        this.insetVal = 'https://todo.kangyun3d.cn/' + this.$store.state.json.url
      } else if (item === 1) {
        this.active = 1
        this.insetVal = '<iframe width=' + 853 + ' height=' + 480 + ' src=https://todo.kangyun3d.cn/' + this.$store.state.json.url + '  frameborder=0 allowfullscreen allow=vr></iframe>'
      }
    },
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
  .box-content {
    padding: 25px 24px 54px;
  }
  .box-title {
    font-size: 18px;
    color: #666666;
    margin-bottom: 30px;
    font-weight: normal;
  }
  .dialog_body-tabs-content > p {
    margin-top: 26px;
    padding-left: 12px;
    margin-bottom: 20px;
    font-size: 12px;
    color: #999999;
  }
  .dialog-search-title {
    margin-bottom: 10px;
    span {
      font-size :14px;
      color:#a9a9a9;
      padding-right:20px;
      padding-left:12px;
      cursor: pointer;
      &.active {
        color: #00A1FF;
        font-weight: 800;
      }
    }
  }
  .dialog-search-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding: 5px 5px;
    background: #fff;
    padding-right: 57px;
    padding-left: 17px;
    .ivu-btn {
      padding:10px 43px;
      // background-color: #01B9CF;
      // border-color:#01B9CF;
      margin-left:10px;
    }
    input {
      font-size: 14px;
      height: 38px;
      line-height: 38px;
      color: #666666;
      width: 100%;
      padding: 0;
      outline: 0;
      border: 0;
      border-bottom: 1px solid #666666;
      transition: all .3s ease-in-out;
      &:focus {
        border-color: #00A1FF;
      }
    }
  }
.v-enter-active, .v-leave-to {
  transition: opacity .2s ease-in-out;
}
.v-enter, .v-leave-to {
  opacity: 0;
}
.address-span {
  margin-left: 12px;
  margin-right: 31px;
  &.active {
    color: #00A1FF;
  }
}
.box-btn {
  button {
    font-size: 14px;
    padding: 11px 23px;
  }
}
</style>
