<template>
  <li>
    <div @click.stop="detilfunc" style="cursor: pointer;">
      <div class="itembox">
        <div class="leftbox">
          <div class="leftcontent">
            <div class="usericon">
              <!-- <img src="https://ss0.baidu.com/73F1bjeh1BF3odCf/it/u=2224926405,2223186990&fm=85&s=3C2357347370739430C914C7030010B8" /> -->
              <i v-if="!json.head_photo_url" class="font_family icon-icon-test5"></i>
              <i v-else class="user__icon__i" :style="{'background-image': `url(${json.head_photo_url})`}"></i>
            </div>
          </div>
        </div>
        <div class="rightbox">
          <div>{{json.lastname + json.firstname || json.decrypt_email}}</div>
          <div>{{json.decrypt_email || '该用户没有设置邮箱'}}</div>
          <!-- <div v-if="json.user_type === 1">超级管理员</div> -->
          <div v-if="json.user_type !== 3">管理员</div>
          <div v-else>合作者</div>
        </div>
        <!-- icon delete -->
        <div class="rightboxIcon"
          v-if="json.key === 0 && ($store.state.userInfo.user_type !== 3 && json.id !== $store.state.userInfo.id)">
          <i class="font_family icon-weibiaoti544" title="删除账户" @click.stop="deleted(json)" style="font-size:20px;color:#d44444"></i>
        </div>
        <!-- icon  activation -->
        <div class="rightboxIcon"  v-if="json.key === 2 && $store.state.userInfo.user_type !== 3">
          <i class="font_family icon-shuaxin" title="激活账户" @click.stop="activation(json.id)"></i>
        </div>
        <!-- icon  email -->
        <div class="rightboxIcon" v-if="json.key === 1 && $store.state.userInfo.user_type !== 3">
          <i class="font_family icon-email" title="邀请账户"  @click.stop="email(json)"></i>
        </div>
        <!-- icon delete -->
        <div class="rightboxIcon" v-if="json.key === 1">
          <i class="font_family icon-weibiaoti544"  @click.stop="deleteInvete" style="font-size:20px;color:#495060" v-if="$store.state.userInfo.user_type !== 3"></i>
        </div>
      </div>
    </div>
    <user-invite-delete
      :json="json"
      @closeModal="isShowInviteDelModal=false"
      v-if="isShowInviteDelModal"></user-invite-delete>
  </li>
</template>

<script>
import userInviteDelete from './userInviteDelete'
export default {
  name: 'userlistitem',
  props: ['json', 'jsonIf'],
  data () {
    return {
      isShowInviteDelModal: false
    }
  },
  methods: {
    detilfunc () {
      if (this.json.key !== 0) {
        return
      }
      this.$router.push({
        path: '/userMsg',
        query: {
          'id': this.json.id
        }
      })
    },
    activation (data) {
      // 激活协作者
      this.$store.dispatch('activationIf', true)
      // 传递id信息
      this.$store.dispatch('activationMsg', data)
    },
    deleted: function (data) {
      // 删除合作者
      this.$store.dispatch('deleteCollaborator', true)
      this.$store.dispatch('deleteCollaboratorMsg', data)
    },
    email: function (data) {
      // 邀请合作者
      this.$http.post('index2/email/again_send_invite', {
        'email_invite_id': data.id
      }).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success('邀请成功')
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    deleteInvete () {
      this.isShowInviteDelModal = true
    }
  },
  components: {
    userInviteDelete
  }
}
</script>

<style lang="scss" scoped>
li {
  cursor: auto;
}
$liheight:100px;
.itembox{
  height: $liheight;
  display: flex;
  background-color: white;
  // border-top: 1px solid #E7E7E7;
  margin-top: 1px;
  border-radius: 4px;
  &:hover {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  }
  transition: all 0.2s ease-in-out;
  .leftbox{
    width: 109px;
    .leftcontent{
      line-height: $liheight;
      height: $liheight;
      overflow: hidden;
      .usericon{
        // overflow: hidden;
        box-sizing: border-box;
        width: 60px;
        height: 60px;
        margin: 0 auto;
        margin-top: 25px;
        border-radius: 27px;
        display: flex;
        align-items: center;
        justify-content: center;
        i {
          font-size:60px;
        }
        img{
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        .user__icon__i {
          display: inline-block;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
      }
    }
  }
  .rightbox{
    flex: 1;
    div:nth-of-type(1){
      height:22px;
      font-size:18px;
      // font-family:Helvetica;
      color:#333333;
      margin-top: 20px;
    }
    div:nth-of-type(2){
      font-size:14px;
      // font-family:PingFangSC-Regular;
      color:#666666;
      margin-top: 9px;
    }
    div:nth-of-type(3){
      font-size:12px;
      // font-family:PingFangSC-Regular;
      color:#CCCCCC;
      margin-top: 12px;
    }
  }
  .rightboxIcon {
    height:100%;
    display: flex;
    align-items: center;
    padding-right: 10px;
  }
  .rightboxIcon:last-child {
    padding-right: 20PX;
  }
}
</style>
