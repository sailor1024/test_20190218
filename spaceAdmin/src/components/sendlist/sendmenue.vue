<template>
  <Dropdown class="menue" @on-click="select" trigger="click">
      <a style="color: rgb(98, 98, 98)" href="javascript:void(0)">
          {{choiceSelectName}}
          <Icon class="icon" type="arrow-down-b" color="rgb(98, 98, 98)" size="16px"></Icon>
      </a>
      <DropdownMenu slot="list">
          <DropdownItem name="time" class="slide">创建日期</DropdownItem>
          <DropdownItem name="name" class="slide">名称</DropdownItem>
      </DropdownMenu>
  </Dropdown>
</template>

<script>
export default {
  name: 'sendmenue',
  data () {
    return {
      selectObj: [
        { id: 'name', name: '名称' },
        { id: 'time', name: '创建日期' }
      ]
    }
  },
  computed: {
    choiceSelectName () {
      for (let i = 0, length = this.selectObj.length; i < length; i++) {
        if (this.selectObj[i].id === this.selectType) {
          return this.selectObj[i].name
        }
      }
    },
    selectType () {
      return this.$store.state.sendList.selectType
    }
  },
  methods: {
    select: function (name) {
      this.selectId = name
      this.$emit('select-type', name)
    }
  }
}
</script>

<style lang="scss" scoped>
.menue{
  font-size:14px;
  font-family:PingFangSC-Regular;
  color:rgba(98,98,98,1);
  margin-left: 14px;
  padding: 8px 0px 20px 0px;
  a{
    .icon{
      transform: rotate(180deg);
    }
  }
  a:hover{
    transform: rotate(0deg);
  }
  .slide {
    border-bottom:1px solid #e0e0e0 !important;
  }
  .slide:hover {
    color: rgb(0, 161, 255)
  }
  .slide:last-child {
    border-bottom:0 !important;
  }
}
</style>
