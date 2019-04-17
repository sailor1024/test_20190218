<template>
  <div id="header">
    <Menu mode="horizontal" theme="dark" :active-key="2" style="background:#00A1FF" @on-select="changefunc">
      <div class="container" :style="windowReside">
        <!-- logo -->
        <div class="layout-logo" @click="homefunc">
          <div class="layout-logo-container">
            <img src="../../../../assets/images/logo.png" alt="">
            <span></span>
          </div>
          <span></span>
        </div>
        <div class="layout-nav">
          <Menu-item v-for="(item, index) in itemlist" class="nav" :key="index"  :name="item.name">
            <Tooltip :content="item.title" class="tooltip__item">
              <!-- <i class="font_family" :class="item.icon" :style="{color: item.isselect ? '#ffffff' : '#e0e0e0'}"></i> -->
              <i class="font_family" :class="item.icon" :style="{color: item.isselect ? '#ffffff' : 'rgba(255,255,255,.5)'}"></i>
            </Tooltip>
          </Menu-item>
        </div>
        <div class="layout-user">
          <i class="font_family icon-icon-test5"></i>
            <Dropdown @on-click="dropdownfunc" trigger="click">
              <a href="javascript:void(0)" style="font-size:14px;color:rgba(255,255,255,1);line-height: 15px;">
                {{this.$store.state.userInfo.lastname}}{{this.$store.state.userInfo.firstname}}
                <Icon class="layout_user__arrow" type="arrow-down-b"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name='userMsg' class="email-name">
                  <p>{{this.$store.state.userInfo.lastname}}{{this.$store.state.userInfo.firstname}}</p>
                  <span v-if="this.$store.state.userInfo.decrypt_email">{{this.$store.state.userInfo.decrypt_email}}</span>
                  <span v-else>请前往设置中完善邮箱信息</span>
                </DropdownItem>
                <DropdownItem class="Setting" name='setting'><Icon type="gear-b" color="rgb(0, 161, 255)" size="16"></Icon>设置</DropdownItem>
                <DropdownItem class="Out" name='layout'><Icon type="close-circled" color="rgb(0, 161, 255)" size="14"></Icon>退出</DropdownItem>
              </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </Menu>
  </div>
</template>
<script>
import uitly from '@/components/uitly/uitly.js'
import {removeCookie} from '@/utils/utils'
export default {
  name: 'headerConponent',
  data () {
    return {
      itemlist: [{
        icon: 'icon-icon-test3',
        title: '空间',
        isselect: true,
        path: '/',
        name: 'main'
      }, {
        icon: 'icon-icon-test4',
        title: '合作者',
        isselect: false,
        path: '/userlist',
        name: 'user-list'
      }, {
        icon: 'icon-icon-test1',
        title: '公共空间',
        isselect: false,
        path: '/sendlist',
        name: 'send-list'
      }, {
        icon: 'icon-icon-test2',
        title: '统计',
        isselect: false,
        path: 'stailist',
        name: 'stai-list'
      }],
      // 监听屏幕大小
      screenWidth: document.body.clientWidth,
      // 变化系数
      windowReside: {
        padding: '0 165px'
      }
    }
  },
  created () {
    if (window.innerWidth === 768) {
      this.$data.windowReside = {
        padding: '0 90px'
      }
    }
    let headlist = sessionStorage.getItem('headlist')
    if (headlist !== null) {
      this.itemlist = JSON.parse(headlist)
    }
  },
  watch: {
    screenWidth (newVal, oldVal) {
      this.screenWidth = newVal
      if (newVal <= 838) {
        this.$data.windowReside = {
          padding: '0 90px'
        }
        // 保存到vuex中(响应Yun-space布局)
        this.$store.state.spaceReside = {
          padding: '0 100px'
        }
      } else {
        this.$data.windowReside = {
          padding: '0 165px'
        }
        this.$store.state.spaceReside = {
          paddng: '0 158px'
        }
      }
    },
    '$route': {
      handler: function (newValue) {
        this.itemlist.forEach(item => {
          if (item.name === newValue.name) {
            for (let i = 0, j = this.itemlist.length; i < j; i++) {
              this.itemlist[i].isselect = false
            }
            item.isselect = true
          }
        })
        sessionStorage.setItem('headlist', JSON.stringify(this.itemlist))
      },
      immediate: true
    }
  },
  mounted () {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
  },
  methods: {
    changefunc (name) {
      let json
      this.itemlist.forEach(item => {
        item.isselect = false
        if (item.name === name) {
          item.isselect = true
          json = item
        }
      })
      sessionStorage.setItem('headlist', JSON.stringify(this.itemlist))
      this.$router.push({
        name: json.name
      })
      this.$store.dispatch('isRouterReload', true)
    },
    dropdownfunc (name) {
      switch (name) {
        case 'setting':
          this.setting()
          break
        case 'layout':
          this.layoutfunc()
          break
        default :
          break
      }
    },
    setting () {
      this.$router.push({
        path: '/setting'
      })
    },
    layoutfunc () {
      this.$http.post('index2/login/login_out', {
        _: this.$store.getters.token
      }).then(res => {
        if (res.data.code === 200) {
          uitly.removeCookie('name')
          localStorage.removeItem('userInfo')
          removeCookie()
          this.$router.push({
            path: '/account'
          })
        } else {
          this.$Message.error('退出失败！')
        }
      })
    },
    homefunc () {
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>
<style scoped lang="scss">
#header {
  position: relative;
  z-index: 1;
}
.layout{
    border: 1px solid #d7dde4;
    background: #00A1FF;
}
.layout-logo{
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  width:129px;
  height:100%;
  .layout-logo-container {
    margin-top:22px;
    img {
      display: block;
      width:129px;
      height:16px;
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
  margin-left:45px;
  &>li:hover .font_family {
    color:#f5f5f5 !important;
  }
    li>div>div>i {
      width:21px;
      height:24px;
      font-size:22px;
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
  // min-width: 768px;
  .layout-user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height:100%;
    .email-name {
      display: flex;
      flex-direction: column;
      align-content: center;
      border-bottom:1px solid #e0e0e0;
      padding: 20px 24px;

      p,span {
        // font-family: 'PingFangSC';
      }
      p {
        padding-bottom:5px;
        color: #666666;
      }
      span {
        color:#CCCCCC;
        // padding-bottom:10px;
      }
    }
    .Setting {
      color:rgb(0, 161, 255);
      padding: 14px 24px;
      border-bottom:1px solid #e0e0e0;
      display: flex;
      align-items: center;
      i {
        padding-right: 10px;
      }
    }
    .Out {
      color:rgb(0, 161, 255);
      padding: 14px 24px;
      i {
        padding-right: 10px;
      }
    }
    i.layout_user__arrow {
      color:#ffffff;
      font-size:22px;
      padding-left:38px;
      position: relative;
      top: 3px;
    }
    &>i:first-child {
      position: relative;
      top: -2px;
      color:#ffffff;
      font-size:22px;
      padding-right:36px;
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
.tooltip__item {
  /deep/
  .ivu-tooltip-popper {
    top:54px !important;
  }

  /deep/
  .ivu-tooltip-popper[x-placement^=bottom] .ivu-tooltip-arrow {
    display: none;
    border-bottom-color: rgba(70,76,91,.5);
  }

  /deep/
  .ivu-tooltip-inner {
    min-height: 25px;
    padding: 8px 16px;
    background-color: rgba($color: #00A1FF, $alpha: .3);
    box-shadow:0px 1px 3px 0px rgba(0,161,255,0.3);
    color: #FEFEFE;
  }
}
</style>
