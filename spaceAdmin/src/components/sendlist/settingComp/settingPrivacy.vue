<template>
  <div class="settingPrivacy">
    <Collapse v-model="value1"  @on-change="change">
        <Panel name="1">
            <div class="panel__label">云订阅协议</div>
            <div class="last">
              <i :class="[active === '1' ? 'icon-xiangshang' : 'icon-xiangxia']" class="font_family"></i>
            </div>
            <p slot="content" style="display:flex;flex-direction:column">
              <span style="padding-bottom:15px;">我们希望您确切了解我们的服务如何运作以及我们为何需要您的注册详细信息。</span>
              <a href="" style="text-decoration: underline">在这里阅读</a>
            </p>
        </Panel>
        <Panel name="2">
            <div class="panel__label">隐私政策</div>
             <div class="last">
              <i :class="[active === '2' ? 'icon-xiangshang' : 'icon-xiangxia']" class="font_family"></i>
            </div>
            <p slot="content" style="display:flex;flex-direction:column">
              <span style="padding-bottom:15px;">这描述了管理康云产品和服务的用户权限的权利和限制。</span>
              <a href="" style="text-decoration: underline">在这里阅读</a>
            </p>
        </Panel>
        <Panel name="3">
            <div class="panel__label">Cookie政策</div>
             <div class="last">
              <i :class="[active === '3' ? 'icon-xiangshang' : 'icon-xiangxia']" class="font_family"></i>
            </div>
            <p slot="content" style="display:flex;flex-direction:column">
              <span style="padding-bottom:15px;">此政策提供有关我们如何以及何时将Cookie用于这些目的的信息。</span>
              <a href="" style="text-decoration: underline; margin-bottom:15px">在这里阅读</a>
              <span style="margin-bottom:30px;">我同意选择<a href="">性能Cookie</a></span>
              <!-- <Button type="primary" class="btn">Primary</Button> -->
              <button class="c-button c-button__primary--radius btn">Primary</button>
            </p>
        </Panel>
    </Collapse>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value1: '',
      active: '0'
    }
  },
  methods: {
    change: function (data) {
      if (data[0] === undefined) {
        this.active = 0
      } else {
        this.active = data[0]
      }
    }
  }
}
</script>
<style lang="scss">
.settingPrivacy {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #fff;
  margin-left:20px;
  padding: 10px 0 54px;
  border-radius: 4px;
  box-sizing: border-box;
  .ivu-collapse {
    background-color: #fff;
    border: none;
    .ivu-collapse-item {
      margin-top: 43px;
      border: none;
      .ivu-collapse-header {
        cursor: pointer;
        color: #333333;
        font-size: 20px;
      }
      .ivu-collapse-content {
        padding: 0 51px 0 64px !important;
        span {
          color: #666666;
        }
        & > .ivu-collapse-content-box {
          padding-top: 25px;
          padding-bottom: 0;
        }
      }
      .ivu-collapse-header {
        height:auto !important;
        // padding: 21px 15px !important;
        padding: 0 51px 0 64px !important;
        .panel__label {
          font-size:18px;
          color: #333333;
          border-bottom: 1px solid rgba($color: #000000, $alpha: .1);
        }
      }
    }
  }

  .ivu-icon-arrow-right-b {
    padding-right:10px;
  }
}

.settingPrivacy .ivu-collapse .ivu-collapse-item:last-child .ivu-collapse-header {
  // border-bottom:2px solid #e7e7e7;
}
.settingPrivacy .ivu-collapse .ivu-collapse-item .ivu-collapse-content {
  // border-bottom:2px solid #e7e7e7;
}
.btn {
    color: #fff;
    border-color: transparent;
    border-radius: 0;
    border-radius: 9999px;
    min-width: 100px;
    letter-spacing: 0;
    align-self: flex-end;
}
.ivu-collapse-header {
  display: flex;
  align-items: center;
  .last {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid rgba($color: #000000, $alpha: .1);
  }
}
.titlePop {
  color: #CCCCCC;
  font-size: 16px;
  margin-right:22px;
}
.settingPrivacy__h3 {
  padding-top: 15px;
  padding-left: 20px;
  font-weight: normal;
  font-size:18px;
  color:rgba(51,51,51,1);
}
.settingPrivacy {
  .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header > i {
    display: none;
  }
}
</style>
