webpackJsonp([21],{Eh2X:function(t,c){},huM9:function(t,c,e){"use strict";Object.defineProperty(c,"__esModule",{value:!0});var s={data:function(){return{svg:null,accounts:[]}},methods:{toLogin:function(t){null!=t?this.$router.push({path:"/account/loginExists",name:"accountExists",params:{account:this.accounts[t]}}):this.$router.push({path:"/account",name:"accountLogin"})},removeCookie:function(){var t=this;this.$Modal.confirm({title:"请确认",content:"<p>确定清除账号信息？</p>",onOk:function(){localStorage.removeItem("userList"),t.$Message.success("清除成功");var c=JSON.parse(localStorage.getItem("userList"));t.accounts=c},onCancel:function(){}})}},created:function(){var t=JSON.parse(localStorage.getItem("userList"));this.accounts=t},mounted:function(){}},a={render:function(){var t=this,c=t.$createElement,e=t._self._c||c;return e("div",{staticClass:"account-select"},[e("h1",{staticClass:"account-title"},[t._v("\n    选择账号\n  ")]),t._v(" "),e("div",{staticClass:"account-select-box"},[e("ul",{staticClass:"account-select-list"},[t._l(t.accounts,function(c,s){return e("li",{key:s,staticClass:"account-select-item",on:{click:function(c){c.stopPropagation(),t.toLogin(s)}}},[e("div",{staticClass:"account-select-itemIns"},[e("div",{staticClass:"account-select-item-avatar"},[""===c.avatarUrl?e("div",{staticStyle:{background:"transparent"},domProps:{innerHTML:t._s(c.svg)}}):t._e(),t._v(" "),""!==c.avatarUrl?e("img",{attrs:{src:c.avatarUrl,alt:""}}):t._e()]),t._v(" "),e("div",{staticClass:"account-select-item-accountInfo"},[e("h1",[t._v("用户名称")]),t._v(" "),e("input",{attrs:{type:"text",readonly:""},domProps:{value:c.p}}),t._v(" "),e("i",[t._v("已退出")])])])])}),t._v(" "),e("li",{staticClass:"account-select-item account-select-item-other"},[e("div",{staticClass:"account-select-itemIns",on:{click:function(c){c.stopPropagation(),t.toLogin()}}},[t._m(0),t._v(" "),t._m(1)])])],2)]),t._v(" "),e("ul",{staticClass:"account-remove"},[e("li",{on:{click:function(c){t.removeCookie()}}},[e("p",[t._v("\n        清除账号信息\n      ")])])])])},staticRenderFns:[function(){var t=this.$createElement,c=this._self._c||t;return c("div",{staticClass:"account-select-item-avatar"},[c("i",{staticClass:"font_family icon-icon-test5",staticStyle:{"font-size":"36px","line-height":"36px"}})])},function(){var t=this.$createElement,c=this._self._c||t;return c("div",{staticClass:"account-select-item-accountInfo"},[c("h1",[this._v("使用其他账号")])])}]};var n=e("VU/8")(s,a,!1,function(t){e("Eh2X")},null,null);c.default=n.exports}});