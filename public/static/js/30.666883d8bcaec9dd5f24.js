webpackJsonp([30],{"/pIV":function(t,e,a){var i=a("MRug");"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);a("rjj0")("55983e0f",i,!1,{})},MRug:function(t,e,a){(t.exports=a("FZ+f")(!0)).push([t.i,"\n.account-register[data-v-10abc7e4] {\n  padding-top: 16px;\n}\n.account-register .ivu-form-item-error-tip[data-v-10abc7e4] {\n    padding-top: 0;\n}\n.account-register .register-accountname[data-v-10abc7e4] {\n    min-height: 24px;\n    padding-top: 32px;\n}\n.account-register .register-passwd .ivu-btn[data-v-10abc7e4] {\n    border: none;\n    background: #fff;\n}\n.account-register .register-passwd .ivu-btn[data-v-10abc7e4]:hover {\n    color: #000;\n}\n.account-register .register-passwd .ivu-btn[data-v-10abc7e4]:focus {\n    -webkit-box-shadow: 0 0 0 0px rgba(45, 140, 240, 0.2);\n            box-shadow: 0 0 0 0px rgba(45, 140, 240, 0.2);\n}\n.account-register .register-passwd .register-passwd-tips[data-v-10abc7e4] {\n    font-size: 12px;\n    height: 24px;\n    line-height: 24px;\n}\n.account-register .account-title[data-v-10abc7e4] {\n    font-size: 24px;\n    font-weight: 400;\n    line-height: 1.3333333333;\n    font-family: 'Google Sans',arial,sans-serif;\n    color: #000;\n}\n.account-register .register-phone[data-v-10abc7e4] {\n    width: 100%;\n}\n.account-register .account-utilities[data-v-10abc7e4] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between;\n    margin-top: 32px;\n}\n.account-register .account-utilities .account-utilities-left[data-v-10abc7e4] {\n      text-align: left;\n}\n.account-register .account-utilities .account-utilities-left a[data-v-10abc7e4] {\n        font-size: 14px;\n}\n.account-register .account-utilities .account-utilities-right[data-v-10abc7e4] {\n      text-align: right;\n}\n","",{version:3,sources:["C:/Users/Administrator/Desktop/spaceAdmin/src/components/account/accountRegister/accountFinsh.vue"],names:[],mappings:";AACA;EACE,kBAAkB;CACnB;AACD;IACI,eAAe;CAClB;AACD;IACI,iBAAiB;IACjB,kBAAkB;CACrB;AACD;IACI,aAAa;IACb,iBAAiB;CACpB;AACD;IACI,YAAY;CACf;AACD;IACI,sDAAsD;YAC9C,8CAA8C;CACzD;AACD;IACI,gBAAgB;IAChB,aAAa;IACb,kBAAkB;CACrB;AACD;IACI,gBAAgB;IAChB,iBAAiB;IACjB,0BAA0B;IAC1B,4CAA4C;IAC5C,YAAY;CACf;AACD;IACI,YAAY;CACf;AACD;IACI,qBAAqB;IACrB,qBAAqB;IACrB,cAAc;IACd,0BAA0B;QACtB,uBAAuB;YACnB,+BAA+B;IACvC,iBAAiB;CACpB;AACD;MACM,iBAAiB;CACtB;AACD;QACQ,gBAAgB;CACvB;AACD;MACM,kBAAkB;CACvB",file:"accountFinsh.vue",sourcesContent:["\n.account-register[data-v-10abc7e4] {\n  padding-top: 16px;\n}\n.account-register .ivu-form-item-error-tip[data-v-10abc7e4] {\n    padding-top: 0;\n}\n.account-register .register-accountname[data-v-10abc7e4] {\n    min-height: 24px;\n    padding-top: 32px;\n}\n.account-register .register-passwd .ivu-btn[data-v-10abc7e4] {\n    border: none;\n    background: #fff;\n}\n.account-register .register-passwd .ivu-btn[data-v-10abc7e4]:hover {\n    color: #000;\n}\n.account-register .register-passwd .ivu-btn[data-v-10abc7e4]:focus {\n    -webkit-box-shadow: 0 0 0 0px rgba(45, 140, 240, 0.2);\n            box-shadow: 0 0 0 0px rgba(45, 140, 240, 0.2);\n}\n.account-register .register-passwd .register-passwd-tips[data-v-10abc7e4] {\n    font-size: 12px;\n    height: 24px;\n    line-height: 24px;\n}\n.account-register .account-title[data-v-10abc7e4] {\n    font-size: 24px;\n    font-weight: 400;\n    line-height: 1.3333333333;\n    font-family: 'Google Sans',arial,sans-serif;\n    color: #000;\n}\n.account-register .register-phone[data-v-10abc7e4] {\n    width: 100%;\n}\n.account-register .account-utilities[data-v-10abc7e4] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between;\n    margin-top: 32px;\n}\n.account-register .account-utilities .account-utilities-left[data-v-10abc7e4] {\n      text-align: left;\n}\n.account-register .account-utilities .account-utilities-left a[data-v-10abc7e4] {\n        font-size: 14px;\n}\n.account-register .account-utilities .account-utilities-right[data-v-10abc7e4] {\n      text-align: right;\n}\n"],sourceRoot:""}])},RAil:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("+CDu"),n=a("cWLO"),s={name:"accountFinsh",components:{textInput:i.a},data:function(){return{eye_isDisable:!1,lastname:"",famailname:"",upwd:"",cpwd:"",email:""}},created:function(){var t=this;this.email=this.getQueryString("email"),this.email||this.$router.push({path:"/account"}),this.$http.post("",{email:this.email}).then(function(e){if(!e.data.data.code)return!1;t.$router.push({path:"/account"})})},methods:{getQueryString:function(t){var e=location.hash.split("?")[1];if(e){var a=e.replace("email=","");return unescape(a)}return!1},eyeDisable:function(){this.eye_isDisable?this.eye_isDisable=!1:this.eye_isDisable=!0},registerfunc:function(){var t=this;if(""===this.lastname)return this.$Message.error("请输入名字"),!1;if(""===this.famailname)return this.$Message.error("请输入姓氏"),!1;if(""===this.upwd)return this.$Message.error("请输入密码"),!1;if(""===this.cpwd)return this.$Message.error("请重复密码"),!1;var e=/^([\u4e00-\u9fa5]{1,4})$|^([a-zA-Z]{1,32})$/;if(!e.test(this.lastname)||!e.test(this.famailname))return this.$Message.error("姓名格式不正确"),!1;var a=/^[\w@0-9]{8,16}$/;return a.test(this.upwd)&&a.test(this.cpwd)?this.upwd.length<8?(this.$Message.error("请输入至少8位数的密码"),!1):this.upwd.length>16?(this.$Message.error("请输入不超过16位数的密码"),!1):this.upwd!==this.cpwd?(this.$Message.error("两次输入密码不一致"),!1):void this.$http.post("index/user/active_user",{lastname:this.lastname,famailname:this.famailname,email:Object(n.a)(this.email),password:Object(n.a)(this.upwd),active:!0}).then(function(e){var a=e.data;1===a.code?(t.$Message.success("激活成功"),t.$store.dispatch("userInfo",a.data),t.$router.push({path:"/"})):0===a.code?t.$Message.error("出错啦，请重试"):3===a.code&&(t.$Notice.info({title:"您已经激活了,请直接登录"}),setTimeout(function(){t.$router.push({path:"/account"})},2e3))}):(this.$Message.error("密码格式不正确"),!1)}}},c=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"account-registerBox"},[a("div",{staticClass:"account-register"},[a("h1",{staticClass:"account-title"},[t._v("\n    激活你的账号\n  ")]),t._v(" "),a("div",{staticClass:"register-accountname account-form"},[a("div",{staticStyle:{display:"flex"}},[a("text-input",{staticStyle:{"margin-right":"8px"},attrs:{label:"姓氏"}},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.lastname,expression:"lastname"}],staticClass:"cw-dc-input",attrs:{slot:"cw-input-0609",type:"text"},domProps:{value:t.lastname},on:{input:function(e){e.target.composing||(t.lastname=e.target.value)}},slot:"cw-input-0609"})]),t._v(" "),a("text-input",{staticStyle:{"margin-left":"8px"},attrs:{label:"名字"}},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.famailname,expression:"famailname"}],staticClass:"cw-dc-input",attrs:{slot:"cw-input-0609",type:"text"},domProps:{value:t.famailname},on:{input:function(e){e.target.composing||(t.famailname=e.target.value)}},slot:"cw-input-0609"})])],1)]),t._v(" "),a("div",{staticClass:"register-passwd account-form"},[a("div",{staticStyle:{display:"flex"}},[a("text-input",{staticStyle:{flex:"4","margin-right":"8px"},attrs:{label:"输入密码"}},["checkbox"==(t.eye_isDisable?"text":"password")?a("input",{directives:[{name:"model",rawName:"v-model",value:t.upwd,expression:"upwd"}],staticClass:"cw-dc-input",attrs:{slot:"cw-input-0609",type:"checkbox"},domProps:{checked:Array.isArray(t.upwd)?t._i(t.upwd,null)>-1:t.upwd},on:{change:function(e){var a=t.upwd,i=e.target,n=!!i.checked;if(Array.isArray(a)){var s=t._i(a,null);i.checked?s<0&&(t.upwd=a.concat([null])):s>-1&&(t.upwd=a.slice(0,s).concat(a.slice(s+1)))}else t.upwd=n}},slot:"cw-input-0609"}):"radio"==(t.eye_isDisable?"text":"password")?a("input",{directives:[{name:"model",rawName:"v-model",value:t.upwd,expression:"upwd"}],staticClass:"cw-dc-input",attrs:{slot:"cw-input-0609",type:"radio"},domProps:{checked:t._q(t.upwd,null)},on:{change:function(e){t.upwd=null}},slot:"cw-input-0609"}):a("input",{directives:[{name:"model",rawName:"v-model",value:t.upwd,expression:"upwd"}],staticClass:"cw-dc-input",attrs:{slot:"cw-input-0609",type:t.eye_isDisable?"text":"password"},domProps:{value:t.upwd},on:{input:function(e){e.target.composing||(t.upwd=e.target.value)}},slot:"cw-input-0609"})]),t._v(" "),a("text-input",{staticStyle:{flex:"4","margin-left":"8px"},attrs:{label:"重复密码"}},["checkbox"==(t.eye_isDisable?"text":"password")?a("input",{directives:[{name:"model",rawName:"v-model",value:t.cpwd,expression:"cpwd"}],staticClass:"cw-dc-input",attrs:{slot:"cw-input-0609",type:"checkbox"},domProps:{checked:Array.isArray(t.cpwd)?t._i(t.cpwd,null)>-1:t.cpwd},on:{change:function(e){var a=t.cpwd,i=e.target,n=!!i.checked;if(Array.isArray(a)){var s=t._i(a,null);i.checked?s<0&&(t.cpwd=a.concat([null])):s>-1&&(t.cpwd=a.slice(0,s).concat(a.slice(s+1)))}else t.cpwd=n}},slot:"cw-input-0609"}):"radio"==(t.eye_isDisable?"text":"password")?a("input",{directives:[{name:"model",rawName:"v-model",value:t.cpwd,expression:"cpwd"}],staticClass:"cw-dc-input",attrs:{slot:"cw-input-0609",type:"radio"},domProps:{checked:t._q(t.cpwd,null)},on:{change:function(e){t.cpwd=null}},slot:"cw-input-0609"}):a("input",{directives:[{name:"model",rawName:"v-model",value:t.cpwd,expression:"cpwd"}],staticClass:"cw-dc-input",attrs:{slot:"cw-input-0609",type:t.eye_isDisable?"text":"password"},domProps:{value:t.cpwd},on:{input:function(e){e.target.composing||(t.cpwd=e.target.value)}},slot:"cw-input-0609"})]),t._v(" "),a("Button",{staticStyle:{flex:"1",width:"48px",height:"48px",position:"relative"},attrs:{shape:"circle",icon:t.eye_isDisable?"eye":"eye-disabled"},on:{click:t.eyeDisable}})],1),t._v(" "),a("div",{staticClass:"register-passwd-tips"},[t._v(" 使用 8 个或更多字符（字母、数字和符号的组合）")])]),t._v(" "),a("div",{staticClass:"account-utilities"},[t._m(0),t._v(" "),a("div",{staticClass:"account-utilities-right"},[a("Button",{attrs:{type:"primary",size:"large"},on:{click:function(e){e.stopPropagation(),t.registerfunc()}}},[t._v("激活")])],1)])])])};c._withStripped=!0;var r={render:c,staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"account-utilities-left"},[e("a",{attrs:{href:"javascript;"}})])}]},o=r;var u=!1;var l=a("VU/8")(s,o,!1,function(t){u||a("/pIV")},"data-v-10abc7e4",null);l.options.__file="src/components/account/accountRegister/accountFinsh.vue";e.default=l.exports}});