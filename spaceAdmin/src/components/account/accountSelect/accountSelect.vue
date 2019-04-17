<style lang="scss">
.account-select{
  padding-top:16px;
  min-height:0;
  .account-title{
    font-size:24px;
    font-weight:400;
    line-height:1.3333333333;
    font-family: 'Google Sans',arial,sans-serif;
    color:#000;
  }
  //  选项容器样式
  .account-select-list{
    list-style:none;
    padding-top:32px;
    margin:auto -40px;
    .account-select-item{
      padding:8px 40px;
      //  选项样式
      .account-select-itemIns{
        display:flex;
        flex-direction:row;
        cursor:pointer;
        transition:all .3s;
        //  头像样式
        .account-select-item-avatar{
          flex:1;
          height:36px;
          div{
            width:36px;
            height:36px;
          }
          img{
            width:36px;
            height:36px;
            border-radius:50%;
          }
          svg{
            width:36px;
            height:36px;
            border-radius:50%;
            background:transparent;
          }
        }
        //  选项内文本样式
        .account-select-item-accountInfo{
          flex:5;
          >h1{
            display:block;
            height:20px;
            line-height:20px;
            font-size:16px;
            font-weight: 400;
          }
          >input{
            display:block;
            height:20px;
            line-height:20px;
            font-size:14px;
            border:none;
            outline:none;
            background:transparent;
          }
          >i{
            display:block;
            height:20px;
            line-height:20px;
            font-size:12px;
            color:#888;
          }
        }
      }
    }
    //  头像hover样式
    .account-select-item:hover{
      background-color:rgba(155,155,155,0.2);
    }
    //  使用其他账号登陆选项样式
    .account-select-item.account-select-item-other{
      height:56px;
      line-height:56px;
      .account-select-item-accountInfo{
        padding:8px 0;
      }
    }
  }
  //  底端移除账号按钮样式
  .account-remove{
    margin:10vh -40px 17px 0;
    list-style:none;
    padding-left:60px;
    >li{
      height:26px;
      >p{
        height:26px;
        line-height:26px;
        font-size:12px;
        padding-left:27px;
        margin-left:-27px;
        color:#000;
      }
      >p:hover{
       background-color:rgba(155,155,155,0.2);
      }
    }
    //  分割线
    >li:before{
      content:"";
      display:block;
      height:0;
      border:1px solid #d5d5d5;
      position:relative;
      top:-27px;
    }
  }
}
</style>

<template>
  <div class="account-select">
    <h1 class="account-title">
      选择账号
    </h1>
    <div class="account-select-box">
      <ul class="account-select-list">
      <!-- 已有账号条目 -->
      <li class="account-select-item" v-for="(item,index) in accounts" :key="index" @click.stop="toLogin(index)">
        <div class="account-select-itemIns">
          <div class="account-select-item-avatar">
           <div v-html="item.svg" style="background:transparent" v-if="item.avatarUrl===''"></div>
           <img :src="item.avatarUrl" alt="" v-if="item.avatarUrl!==''">
          </div>
          <div class="account-select-item-accountInfo">
            <h1>用户名称</h1>
            <input type="text" readonly :value="item.p">
            <i>已退出</i>
          </div>
        </div>
      </li>
      <!-- 最后一个li为使用其他账号登陆 -->
      <li class="account-select-item account-select-item-other">
        <div class="account-select-itemIns" @click.stop="toLogin()">
          <div class="account-select-item-avatar">
            <i class="font_family icon-icon-test5" style="font-size:36px;line-height:36px;"></i>
          </div>
          <div class="account-select-item-accountInfo">
            <h1>使用其他账号</h1>
          </div>
        </div>
      </li>
    </ul>
  </div>
    <ul class="account-remove">
      <li @click="removeCookie()">
        <p>
          清除账号信息
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      svg: null,
      accounts: []
    }
  },
  methods: {
    //  跳转到登陆页
    toLogin: function (index) {
      if (index != null) {
        //  跳转到使用已有账号登陆
        this.$router.push({
          path: '/account/loginExists',
          name: 'accountExists',
          params: {
            account: this.accounts[index]
          }
        })
      } else {
        //  跳转到新账号登陆
        this.$router.push({
          path: '/account',
          name: 'accountLogin'
        })
      }
    },
    //  移除账号
    removeCookie: function () {
      this.$Modal.confirm({
        title: '请确认',
        content: '<p>确定清除账号信息？</p>',
        onOk: () => {
          localStorage.removeItem('userList')
          this.$Message.success('清除成功')
          let accounts = JSON.parse(localStorage.getItem('userList'))
          this.accounts = accounts
        },
        onCancel: () => {
        }
      })
    }
  },
  created: function () {
    let accounts = JSON.parse(localStorage.getItem('userList'))
    this.accounts = accounts
  },
  mounted: function () {
  }
}
</script>
