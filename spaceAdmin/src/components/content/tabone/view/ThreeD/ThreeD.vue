<template>
  <div id="ThreeD">
    <!-- 使用menu组件 -->
    <div class="ThreeMenu">
      <!-- 触发按钮开始 -->
      <div class="view-btn">
        <Dropdown trigger="hover">
          <a href="javascript:void(0)" class="view-btn-Msg">
              3D展示窗口
              <Icon type="arrow-down-b" style="font-size:16px; padding-left:5px;"></Icon>
          </a>
          <DropdownMenu slot="list">
              <DropdownItem>3Dview</DropdownItem>
              <DropdownItem>3Dview</DropdownItem>
              <DropdownItem>3Dview</DropdownItem>
              <DropdownItem>3Dview</DropdownItem>
              <DropdownItem>3Dview</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <!-- 测试版btn -->
        <div class="flexCenter">
          <div class="testBtn">测试版可用</div>
        </div>
        <!-- 视图操作窗口切换按钮 -->
        <Button type="ghost" shape="circle" icon="edit" class="editBtn">视图操作窗口</Button>
      </div>
    </div>
    <!-- 3d视图开始 -->
    <div class="View3D">
      <!-- 视频列表显示 -->
      <div class="ViewMsg">1-1</div>
      <!-- 播放按钮 -->
      <div class="View3D-playBtn">
        <Icon type="play"></Icon>
      </div>
      <!-- logo -->
      <div class="ViewLogo">
        <img src="../../assets/images/logo.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThreeD'
}
</script>

<style lang="scss" scoped>
#ThreeD {
  max-width:81%;
  max-height:935px;
  margin:0 auto;
  background:#ffffff;
  .ThreeMenu {
    position: relative;
    max-width:100%;
    height:57px;
    padding: 0 16px;
    box-sizing: border-box;
    background:#ffffff;
    .view-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height:100%;
      .view-btn-Msg {
        font-size:14px;
        font-family:PingFang-SC-Medium;
        color:rgba(98,98,98,1);
        line-height:20px;
      }
      .flexCenter {
        flex:1;
        display: flex;
        .testBtn {
          width:6.5%;
          height:23px;
          background:rgba(255,214,85,1);
          border-radius:2px;
          font-size:10px;
          font-family:PingFang-SC-Medium;
          color:rgba(255,255,255,1);
          line-height:23px;
          text-align:center;
          margin-left:15px;
        }
      }
      .editBtn {
        width:140px;
        height:34px;
        padding:0 !important;
        font-size:14px;
        font-family:PingFangSC-Regular;
        background:rgba(240,240,240,1);
        color:rgba(32,32,32,1);
        line-height:20px;
      }
    }
  }
  .View3D {
    position: relative;
    height:848px;
    background: #333;
    padding:0 16px;
    overflow: hidden;
    .View3D-playBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      margin-top:204px;
      width:83px;
      height:83px;
      border:3px solid rgba(255,255,255,1);
      border-radius:50%;
      cursor:pointer;
      i {
        font-size:30px;
        color:#ffffff;
        margin-left:5px;
      }
    }
    .ViewMsg {
      width:58px;
      height:50px;
      margin:0 auto;
      margin-top:164px;
      font-size:36px;
      font-family:PingFangSC-Regular;
      color:rgba(255,255,255,1);
      line-height:50px;
    }
    .ViewLogo {
      img {
        display: block;
        width:129px;
        height:15px;
        margin: 0 auto;
        margin-top:229px;
      }
    }
  }
}
</style>
