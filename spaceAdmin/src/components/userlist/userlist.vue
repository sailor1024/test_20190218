<template>
  <div class="userlistbox">
    <div class="userlist" :class="{'active': administrator !== 3 ? false : true}">
      <userheader :activeUser="activeUser" />
      <userlistTabs v-if="administrator !== 3 ? true : false"/>
      <userlistConponent :json="administrator"/>
    </div>
    <!-- 引入用户邀请 -->
    <userlistInvite v-if="administrator !== 3 ? true : false"/>
  </div>
</template>

<script>
import userheader from './userheader'
import userlistConponent from './userlistConponent'
import userlistInvite from './userlistInvite'
import userlistTabs from './userlistTabs'
export default {
  created () {
    this.$data.administrator = this.$store.state.userInfo.user_type
  },
  data () {
    return {
      administrator: null
    }
  },
  computed: {
    activeUser: function () {
      return this.$store.state.activeUser
    }
  },
  name: 'userlist',
  components: {
    userheader,
    userlistConponent,
    userlistInvite,
    userlistTabs
  }
}
</script>

<style lang="scss" scoped>
.userlistbox {
  display: flex;
  justify-content: space-between;
}
.userlist{
  margin-left:165px;
  flex: 1;
  &.active {
    margin-right:174px;
  }
  margin-bottom: 50px;
}
@media screen and (max-width: 1100px){
  .userlist{
    margin-left:70px;
  }
}
</style>
