webpackJsonp([30],{"0s+d":function(t,a){},"6tWv":function(t,a,s){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var n=s("mvHQ"),e=s.n(n),o=s("+CDu"),c=s("L6bb"),i=s.n(c),r={components:{textInput:o.a},data:function(){return{account:{p:"",svg:"",avatarUrl:""},password:""}},mounted:function(){},created:function(){if(this.$route.params.account)this.account=this.$route.params.account;else{var t=JSON.parse(localStorage.getItem("userList"));null==t&&this.$router.push("/account/login");var a=t[0];this.account=a}},methods:{toFindStep1:function(){this.$router.push({path:"/account/findStep1",name:"accountFindStep1",params:{account:this.account}})},accountSelect:function(){this.$router.push("/account/select")},loginfunc:function(){var t=this,a=this.account.p;""===this.password?this.$Message.error("请输入密码"):this.password.length<8?this.$Message.error("请输入至少8位数的密码"):this.password.length>16?this.$Message.error("请输入不超过16位数的密码"):this.$http.post("index2/login/user_login",{phone_email:i()(a),password:i()(this.password)},{isNeedToken:!1}).then(function(a){var s=a.data;if(200===s.code){for(var n=JSON.parse(localStorage.getItem("userList")),o=0;o<n.length;o++)if(t.account.p===n[o].p&&0!==o){n.splice(o,1),n.unshift(t.account),localStorage.setItem("userList",e()(n));break}var c=s.data;t.$store.dispatch("userInfo",c),t.$store.dispatch("setupCookies",c),t.$router.push({path:"/"})}else t.$Message.error(a.data.message)})}}},u={render:function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"account-login"},[s("h1",{staticClass:"account-title"},[t._v("\n    用户账号\n  ")]),t._v(" "),s("div",{staticClass:"login-accountname"},[s("div",{staticClass:"login-avatar"},[""===t.account.avatarUrl?s("div",{staticStyle:{background:"transparent"},domProps:{innerHTML:t._s(t.account.svg)}}):t._e(),t._v(" "),""!==t.account.avatarUrl?s("img",{attrs:{src:t.account.avatarUrl,alt:""}}):t._e()]),t._v(" "),s("input",{staticClass:"login-accountname-text",attrs:{type:"text",readonly:""},domProps:{value:t.account.p}}),t._v(" "),s("div",{staticClass:"login-accountname-btn"},[s("Button",{attrs:{shape:"circle",icon:"chevron-down"},on:{click:function(a){a.preventDefault(),t.accountSelect()}}})],1)]),t._v(" "),s("div",{staticClass:"login-passwd account-form",on:{keyup:function(a){return"button"in a||!t._k(a.keyCode,"enter",13,a.key,"Enter")?t.loginfunc(a):null}}},[s("text-input",{attrs:{label:"密码"}},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],staticClass:"cw-dc-input",attrs:{slot:"cw-input-0609",type:"password"},domProps:{value:t.password},on:{input:function(a){a.target.composing||(t.password=a.target.value)}},slot:"cw-input-0609"})])],1),t._v(" "),s("div",{staticClass:"account-utilities"},[s("div",{staticClass:"account-utilities-left"},[s("a",{attrs:{href:"javascript;"},on:{click:function(a){a.preventDefault(),t.toFindStep1()}}},[t._v("忘记密码？")])]),t._v(" "),s("div",{staticClass:"login-utilities-right"})]),t._v(" "),s("div",{staticClass:"btn-group"},[s("button",{staticClass:"c-button c-button__primary--radius",on:{click:function(a){a.stopPropagation(),t.loginfunc()}}},[t._v("登录")])])])},staticRenderFns:[]};var l=s("VU/8")(r,u,!1,function(t){s("0s+d")},"data-v-0743a988",null);a.default=l.exports}});