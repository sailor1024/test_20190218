<template>
    <div style="text-align:left;background:#fff;width:100%;position:relative;">
        <div class="cw-dc">
            <slot name="cw-input-0609"></slot>
            <label class="cw-dc-label">{{label}}</label>
            <div class="cw-dc-underline"></div>
        </div>
    </div>
</template>
<script>
export default {
  data: function () {
    return {}
  },
  props: ['label'],
  mounted: function () {
    //  所有组件中的输入框
    let inputs = document.querySelectorAll('.cw-dc-input')
    for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i]
      //  给每个组件绑定事件
      input.onfocus = function () {
        input.nextElementSibling.style.top = 0
        input.nextElementSibling.style.fontSize = 12 + 'px'
        input.nextElementSibling.style.color = '#00a1ff'
        input.nextElementSibling.nextElementSibling.style.width = '100%'
        input.nextElementSibling.nextElementSibling.style.left = 0
        input.nextElementSibling.nextElementSibling.style.borderWidth = '1.5px'
        input.nextElementSibling.nextElementSibling.style.borderColor = '#00a1ff'
      }
      input.onblur = function () {
        input.nextElementSibling.style.color = '#A9A9AA'
        input.nextElementSibling.nextElementSibling.style.width = 0
        input.nextElementSibling.nextElementSibling.style.left = '50%'
        input.nextElementSibling.nextElementSibling.style.borderWidth = 0
        input.nextElementSibling.nextElementSibling.style.borderColor = 'transparent'
        if (input.value !== '') {
          return false
        } else {
          input.nextElementSibling.style.top = 24 + 'px'
          input.nextElementSibling.style.fontSize = 16 + 'px'
        }
      }
    }
  },
  methods: {
  }
}
</script>
<style lang="scss">
// 组件容器
.cw-dc{
    display:block;
    height:auto;
    background:transparent;
    width:100%;
    position:relative;
    height:48px;
}
// 占位文本
.cw-dc-label{
    height:18px;
    line-height:18px;
    position:absolute;
    text-align:center;
    color:#A9A9AA;
    top:24px;
    z-index:1;
    font-size:16px;
    transition:all 0.3s;
}
// 输入框
.cw-dc-input{
    display:block;
    height:28px;
    width:100%;
    outline:none;
    font-size:16px;
    background-color:transparent;
    border: 0;
    border-bottom:1px solid transparent;
    border-bottom-color:rgba(169, 169, 170, 0.7);
    color:#212121;
    position:absolute;
    top:20px;
    z-index:2;
}
// 获得焦点才出现的下边框
.cw-dc-underline{
    display:block;
    height:0;
    width:0;
    border:0 solid #00a1ff;
    position:absolute;
    top:47px;
    left:50%;
    z-index:3;
    transition:width 0.3s,left 0.3s,border-color .3s;
}
</style>
