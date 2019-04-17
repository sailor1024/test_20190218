<style lang="scss">
$form-theme-color:#00b8ce;
.loginMain{
  //容器布局
  height:100vh;
  width:90%;
  margin:0 auto;
  .loginMain-md{
    width:100%;
    height:100%;
    margin:0 auto;
    padding-left:0;
    padding-right:0;
    .loginMain-md-container{
      width:90%;
      height:100%;
      margin:0 auto;
      display:table;
      .loginMain-md-vertical{
        display:table-cell;
        vertical-align:middle;
        .loginMain-md-row{
          width:100%;
          height:auto;
          display:flex;
          flex-wrap:wrap;
          justify-content:center;
          //左侧文字
          .loginMain-md-title{
            display:none;
            width:100%;
            height:auto;
            padding-left:16px;
            padding-right:16px;
            .loginMain-md-title-text{
              margin:44px 0;
              font-size:2em;
              color:#fff;
            }
          }
          //右侧登陆框
          .loginMain-md-form{
            width:100%;
            height:380px;
            .loginMain-md-form-ins{
              height:100%;
              width:100%;
              margin:0 auto;
              border:1px solid rgba(255,255,255,.6);
              padding:12px 24px;
              background:rgba(0,0,0,.4);
              .loginMain-signInText{
                display:block;
                height:72px;
                line-height:72px;
                text-align:center;
                font-size:27px;
                color:#fff;
                border-bottom:1px solid rgba(255,255,255,.6);
                margin-bottom:24px;
              }
              //label颜色
              .ivu-form .ivu-form-item-label{
                color:$form-theme-color;
              }
              .ivu-form .ivu-form-item-label{
                padding:0;
              }
              //input-item下边距
              .ivu-form-item{
                margin-bottom:8px;
              }
              //输入框样式
              .ivu-input{
                border:2px solid transparent;
                border-bottom-color:#fff;
                border-radius:0;
                background:transparent;
                color:#fff;
                transition:all .3s cubic-bezier(.55,0,.55,.2);
                height:auto;
                padding:0;
                margin-top:5px;
                margin-bottom:5px;
              }
              .ivu-input:focus{
                border-bottom-color: $form-theme-color;
                box-shadow: 0 0 0 0 ;
              }
              //checkbox样式
              .ivu-checkbox-checked .ivu-checkbox-inner{
                background:$form-theme-color;
                border-color:$form-theme-color;
              }
              .ivu-checkbox+span, .ivu-checkbox-wrapper+span{
                color:$form-theme-color;
              }
              //错误提示
              .loginMain-errMsg{
                display:block;
                height:16px;
                line-height:16px;
                color:#d44444;
                font-size:12px
              }
            }
            //记住我
            .loginMain-utilities{
              margin-bottom:18px;
            }
            .loginMain-troubleLogin{
              font-size:12px;
              color:$form-theme-color;
            }
            //登陆按钮
            .ivu-btn{
              color:#fff;
              border:none;
              border-radius: 0;
              background:$form-theme-color;
            }
            .ivu-btn:hover{
              color:#fff;
              background:$form-theme-color;
            }
          }
        }
      }
    }
  }
}
//小于600px文字消失
@media(min-width:600px){
  .loginMain-md{
    width:85%;
    padding-left:16px;
    padding-right:16px;
  }
  .loginMain-md-title{
    display:block !important;
  }
}
//到达992px换行
@media(min-width:992px){
  .loginMain-md-title{
    width:50% !important;
  }
  .loginMain-md-form{
    width:50% !important;
  }
}
//1280px最终样式固定
@media(min-width:1280px){
  .loginMain-md-title{
    max-width:525px;
  }
  .loginMain-md-title-text{
    font-size:38px;
  }
  .loginMain-md-form{
    width:50%;
    max-width:525px;
    .loginMain-md-form-ins{
      max-width:318px;
      margin:0 auto;
    }
  }
}
</style>

<template>
  <main class="loginMain">
    <div class="loginMain-md">
      <div class="loginMain-md-container">
        <div class="loginMain-md-vertical">
          <div class="loginMain-md-row">
            <div class="loginMain-md-title">
              <h1 class="loginMain-md-title-text">
                We make it possible to experience interior Spaces in new ways.
              </h1>
            </div>
            <div class="loginMain-md-form">
              <form class="loginMain-md-form-ins">
                <h2 class="loginMain-signInText">Please Sign In</h2>
                <div class="loginMain-loginFn">
                  <div class="loginMain-loginInput">
                    <i-form labal-position="top">
                      <Form-item label="Email address">
                        <i-input v-model="username" type="text"></i-input>
                        <p class="loginMain-errMsg">错误信息</p>
                      </Form-item>
                      <Form-item label="Password">
                        <i-input v-model="password" type="password"></i-input>
                        <p class="loginMain-errMsg">错误信息2</p>
                      </Form-item>
                    </i-form>
                  </div>
                  <div class="loginMain-utilities">
                    <Row>
                      <i-col span="12">
                        <div class="loginMain-remberMe">
                          <Checkbox>
                            <span>Rember me</span>
                          </Checkbox>
                        </div>
                      </i-col>
                      <i-col span="12" style="text-align:right;">
                        <a href="javascript;" class="loginMain-troubleLogin">Trouble login?</a>
                      </i-col>
                    </Row>
                  </div>
                </div>
                <Button @click="loginfunc" long size="large">Sign In</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import encrypt from '@/utils/encryption.js'
export default {
  data: function () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    loginfunc: function () {
      if (this.username.length === '') {
        this.$Message.error('请输入用户名')
      } else if (this.password.length === '') {
        this.$Message.error('请输入密码')
      } else {
        this.$http.post('index/User/user_login', {
          'phone': encrypt(this.username),
          'password': encrypt(this.password)
        }, {
          isNeedToken: false
        }).then((res) => {
          let data = res.data
          if (data.code === 1) {
            let obj = data.data
            this.$store.dispatch('userInfo', obj)
            this.$store.dispatch('setupCookies', this.userMsg)
            this.$router.push({
              path: '/'
            })
          } else {
            this.$Message.error('出错了,请重试')
          }
        }).catch((err) => {
        })
      }
    }
  }
}
</script>
