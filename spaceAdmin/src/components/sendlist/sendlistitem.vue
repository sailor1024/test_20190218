<template>
  <li>
    <div class="sendbox" @click.stop="gotodetilfunc">
      <div class="boxitem">
        <div class="left">
          <!-- <i :style="backimg"></i> -->
          <img :src="$imgURL + this.json.marker_image" alt="">
        </div>
        <div class="right">
          <div>{{json.title}}</div>
          <p>
            由{{this.json.last_name + this.json.first_name}}创建于{{this.json.create_time | desbute}}
          </p>
        </div>
        <div class="icon-suo">
          <Icon type="unlocked" @click.stop="pop" v-if="json.edit_type === 2"></Icon>
        </div>
      </div>
    </div>
    <pop v-if="popShow" @clickNone="none" :giveData="{title: json.title, id: json.id}" :shareShow="true"/>
  </li>
</template>

<script>
import pop from '../common/header/headComp/pop'
export default {
  data () {
    return {
      popShow: false
    }
  },
  props: ['json'],
  name: 'sendlistitem',
  components: {
    pop
  },
  computed: {
    backimg () {
      return {
        'backgroundImage': 'url(' + this.$imgURL + this.json.marker_image + ')'
      }
    }
  },
  methods: {
    gotodetilfunc () {
      this.$router.push({
        path: '/home',
        query: {
          id: this.json.id
        }
      })
    },
    pop () {
      this.$store.dispatch('popTo', false)
      this.popShow = true
    },
    none (data) {
      this.popShow = data
    },
    format (time) {
      let date = new Date(time * 1000)
      let y = date.getFullYear() + ''
      let m = date.getMonth() + 1
      let d = date.getDate()
      m = m > 10 ? m : '0' + m
      d = d > 10 ? d : '0' + d
      return y + '年' + m + '月' + d + '日'
    }
  },
  filters: {
    desbute (val) {
      let arr = new Date(val)
      let time
      time = arr.getFullYear() + '年' + (arr.getMonth() + 1) + '月' + arr.getDate() + '日'
      return time
    }
  }
}
</script>

<style lang="scss" scoped>
.sendbox{
  &:hover {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  }
  transition: all 0.2s ease-in-out;
  // height: 100px;
  border-top: 1px solid #E7E7E7;
  background-color: white;
  padding: 13px 24px 8px 16px;
  border-radius: 4px;
  .boxitem{
    display: flex;
    .left{
      width: 100px;
      img{
        display: block;
        width: 100px;
        height: 70px;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        background-color: #222;
      }
    }
    .right{
      flex: 1;
      margin-left: 15px;
      h4{
        height:25px;
        font-size:18px;
        color:#333333;
        margin-top: 12px;
      }
      p{
        font-size:12px;
        color:#999999;
        margin-top: 32px;
      }
      & > div {
        padding-top: 8px;
        font-size:18px;
        color: #333333;
      }
    }
    .icon-suo {
      display: flex;
      align-items: center;
      i {
        color: #0f2d3e;
        font-size:20px;
      }
    }
  }
}
</style>
