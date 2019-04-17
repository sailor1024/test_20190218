<template>
  <div class="userInset">
    <div class="userInset-header">
      <i class="userInset__icon"></i>
      <p>{{userInfo.company_name}}</p>
      <!-- <i-button type="info" @click="change">编辑</i-button> -->
      <button style="margin-top: 12px;" class="c-button c-button__primary--radius" @click="change">编辑</button>
    </div>
    <div class="name" v-for="(item, index) in nameMsg" :key="index">
      <p class="name-one">{{item.nameTitle}}</p>
      <p class="name-two">{{item.name}}</p>
    </div>
    <div class="userInset__avatar">
      <i :style="userInfoAvatar"></i>
    </div>
    <!-- forget -->
    <!-- <div class="forget">
      <h4>忘了我</h4>
      <div class="delete-user">
        <Icon type="close-circled"></Icon>
        <p>删除账户</p>
        <a href="">了解详情</a>
      </div>
    </div> -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      nameMsg: [
        {
          nameTitle: '姓',
          name: this.$store.state.userInfo.lastname
        },
        {
          nameTitle: '名字',
          name: this.$store.state.userInfo.firstname
        },
        {
          nameTitle: '标题',
          name: '空'
        },
        {
          nameTitle: '手机号',
          name: this.$store.state.userInfo.decrypt_phone
        },
        {
          nameTitle: '电子邮件地址',
          name: this.$store.state.userInfo.decrypt_email
        }
        // {
        //   nameTitle: '密码',
        //   name: '********'
        // }
      ]
    }
  },
  methods: {
    change: function () {
      this.$emit('changeComp', 'editor')
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    },
    userInfoAvatar () {
      if (!this.userInfo.head_photo_url) return ''
      return {'background-image': `url(${this.userInfo.head_photo_url})`}
    }
  }
}
</script>
<style scoped lang="scss">
.userInset {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #fff;
  margin-left:20px;
  padding: 0 20px 51px;
  box-sizing: border-box;
  border-radius: 4px;
  .userInset-header {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 0 12px 24px 4px;
    border-bottom:3px solid #F1F1F1;
    margin-bottom: 33px;
    p {
      margin-top: 21px;
      margin-left: 84px;
      color: #666666;
      font-size:18px;
    }
    button {
      padding: 11px 25px;
    }
  }
  .name {
    margin-top: 32px;
    margin-left: -20px;
    padding-left: 15.78%;
    .name-one {
      float: left;
      font-size:14px;
      padding-top: 2px;
      color:#333;
    }
    .name-two {
      float: left;
      font-size:16px;
      color: #666;
      // padding-top:8px;
      padding-left: 15px;
    }
  }
  .forget {
    width:100%;
    margin-top:100px;
    h4 {
      font-size: 20px;
      font-family: 'PingFangSC-Regular';
      color: #0f2d3e;
      font-weight: 800;
      padding-bottom:20px;
    }
    .delete-user {
      border:2px solid #E7E7E8;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding:20px;
      i {
        font-size:20px;
        color:#e0e0e0;
      }
      p {
        font-size:16px;
        font-weight: 700;
        color:#666364;
        padding-left:10px;
      }
      a {
        text-decoration: underline;
        font-size:14px;
        padding-left:10px;
      }
    }
  }
  .userInset__icon {
    position: absolute;
    display: inline-block;
    top: -20px;
    left: 4px;
    width: 64px;
    height: 64px;
    background: #00A1FF url('~@/assets/images/setting.png') no-repeat center;
    background-size: 32px;
    border-radius: 4px;
    box-shadow: 0 4px 3px 0 rgba($color: #00A1FF, $alpha: .3);
  }
  .userInset__avatar {
    position: absolute;
    top: 105px;
    right: 22.22%;
    i {
      display: inline-block;
      width: 150px;
      height: 150px;
      box-shadow: 0 4px 10px 0 rgba(0,0,0,.2);
      border-radius: 100px;
      background-size: cover;
      background-position: center;
    }
  }
}
</style>
