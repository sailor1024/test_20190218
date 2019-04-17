<template>
  <Dropdown class="menue" @on-click="select">
      <a style="color: rgba(98,98,98,1)" href="javascript:void(0)">
          {{choiceSelectName}}
          <Icon class="icon" type="arrow-down-b" color="#626262" size="16px"></Icon>
      </a>
      <DropdownMenu slot="list">
          <DropdownItem :name="1" class="slide">名称</DropdownItem>
          <DropdownItem :name="2" class="slide">创建日期</DropdownItem>
      </DropdownMenu>
  </Dropdown>
</template>

<script>
export default {
  name: 'usermenue',
  data () {
    return {
      selectObj: [
        { id: 1, name: '名称' },
        { id: 2, name: '创建日期' }
      ],
      selectId: 2
    }
  },
  computed: {
    choiceSelectName () {
      for (let i = 0, length = this.selectObj.length; i < length; i++) {
        if (this.selectObj[i].id === this.selectId) {
          return this.selectObj[i].name
        }
      }
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
  color: #666666;
  margin: 39px 0 20px 14px;
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
