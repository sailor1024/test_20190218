webpackJsonp([6],{"39/R":function(t,e){},"3arO":function(t,e){},"7QNP":function(t,e){},H1pw:function(t,e){},MaQ2:function(t,e){},ZfMn:function(t,e){},abvC:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("header",[e("h4",[this._v("所有合作者")]),this._v(" "),e("p",{staticClass:"small-title"},[this._v(this._s(this.activeUser.length)+"名合作者")])])])},staticRenderFns:[]};var a=s("VU/8")({name:"userheader",props:["activeUser"]},i,!1,function(t){s("ljq/")},"data-v-559c234b",null).exports,n=s("L2qX"),o={name:"deleteInvite",props:{json:{type:Object,required:!0}},methods:{confirm:function(){var t=this;this.$http.post("index2/email/delete_invite",{email_invite_id:this.json.id}).then(function(e){200===e.data.code?(t.$Message.success("删除成功"),t.popClose(),t.$store.dispatch("isRouterReload",!0)):t.$Message.error(e.data.message)})},popClose:function(){this.$emit("closeModal")}},components:{kangyunModal:n.a}},r={render:function(){var t=this.$createElement,e=this._self._c||t;return e("kangyun-modal",{attrs:{isShowWarn:""},on:{closeModal:this.popClose,confirm:this.confirm}},[e("template",{slot:"title"},[this._v("\n    删除合作者\n  ")]),this._v(" "),e("template",{slot:"detail"},[e("p",[this._v("确定删除合作者"+this._s(this.json.decrypt_email)+"？")])])],2)},staticRenderFns:[]};var c={name:"userlistitem",props:["json","jsonIf"],data:function(){return{isShowInviteDelModal:!1}},methods:{detilfunc:function(){0===this.json.key&&this.$router.push({path:"/userMsg",query:{id:this.json.id}})},activation:function(t){this.$store.dispatch("activationIf",!0),this.$store.dispatch("activationMsg",t)},deleted:function(t){this.$store.dispatch("deleteCollaborator",!0),this.$store.dispatch("deleteCollaboratorMsg",t)},email:function(t){var e=this;this.$http.post("index2/email/again_send_invite",{email_invite_id:t.id}).then(function(t){200===t.data.code?e.$Message.success("邀请成功"):e.$Message.error(t.data.message)})},deleteInvete:function(){this.isShowInviteDelModal=!0}},components:{userInviteDelete:s("VU/8")(o,r,!1,function(t){s("auBW")},"data-v-4082a888",null).exports}},l={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("li",[s("div",{staticStyle:{cursor:"pointer"},on:{click:function(e){return e.stopPropagation(),t.detilfunc(e)}}},[s("div",{staticClass:"itembox"},[s("div",{staticClass:"leftbox"},[s("div",{staticClass:"leftcontent"},[s("div",{staticClass:"usericon"},[t.json.head_photo_url?s("i",{staticClass:"user__icon__i",style:{"background-image":"url("+t.json.head_photo_url+")"}}):s("i",{staticClass:"font_family icon-icon-test5"})])])]),t._v(" "),s("div",{staticClass:"rightbox"},[s("div",[t._v(t._s(t.json.lastname+t.json.firstname||t.json.decrypt_email))]),t._v(" "),s("div",[t._v(t._s(t.json.decrypt_email||"该用户没有设置邮箱"))]),t._v(" "),3!==t.json.user_type?s("div",[t._v("管理员")]):s("div",[t._v("合作者")])]),t._v(" "),0===t.json.key&&3!==t.$store.state.userInfo.user_type&&t.json.id!==t.$store.state.userInfo.id?s("div",{staticClass:"rightboxIcon"},[s("i",{staticClass:"font_family icon-weibiaoti544",staticStyle:{"font-size":"20px",color:"#d44444"},attrs:{title:"删除账户"},on:{click:function(e){e.stopPropagation(),t.deleted(t.json)}}})]):t._e(),t._v(" "),2===t.json.key&&3!==t.$store.state.userInfo.user_type?s("div",{staticClass:"rightboxIcon"},[s("i",{staticClass:"font_family icon-shuaxin",attrs:{title:"激活账户"},on:{click:function(e){e.stopPropagation(),t.activation(t.json.id)}}})]):t._e(),t._v(" "),1===t.json.key&&3!==t.$store.state.userInfo.user_type?s("div",{staticClass:"rightboxIcon"},[s("i",{staticClass:"font_family icon-email",attrs:{title:"邀请账户"},on:{click:function(e){e.stopPropagation(),t.email(t.json)}}})]):t._e(),t._v(" "),1===t.json.key?s("div",{staticClass:"rightboxIcon"},[3!==t.$store.state.userInfo.user_type?s("i",{staticClass:"font_family icon-weibiaoti544",staticStyle:{"font-size":"20px",color:"#495060"},on:{click:function(e){return e.stopPropagation(),t.deleteInvete(e)}}}):t._e()]):t._e()])]),t._v(" "),t.isShowInviteDelModal?s("user-invite-delete",{attrs:{json:t.json},on:{closeModal:function(e){t.isShowInviteDelModal=!1}}}):t._e()],1)},staticRenderFns:[]};var u=s("VU/8")(c,l,!1,function(t){s("H1pw")},"data-v-172ad4a1",null).exports,d=s("FkdV"),h={name:"pop",methods:{confirm:function(){var t=this;this.$http.post("index2/user/recover_user",{id:this.$store.state.activationMsg}).then(function(e){200===e.data.code?(t.$Message.success("激活成功"),t.popClose(),t.$store.dispatch("isRouterReload",!0)):t.$Message.error(e.data.message)})},popClose:function(){this.$store.dispatch("activationIf",!1)}},components:{kangyunModal:n.a}},f={render:function(){var t=this.$createElement,e=this._self._c||t;return e("kangyun-modal",{attrs:{submitText:"确定"},on:{closeModal:this.popClose,confirm:this.confirm}},[e("template",{slot:"title"},[this._v("\n    激活合作者\n  ")]),this._v(" "),e("template",{slot:"detail"},[e("p",{staticStyle:{padding:"0 48px"}},[this._v("如果此用户没有活动帐户，则会邀请他们创建一个帐户。如果他们这样做，他们将可以访问他们最初创建的项目和文件夹。您可以授予此用户访问文件夹或项目的权限。")])])],2)},staticRenderFns:[]};var v=s("VU/8")(h,f,!1,function(t){s("3arO")},"data-v-6038ce44",null).exports,p={name:"deleteUser",methods:{confirm:function(){var t=this;this.$http.post("index2/user/remove_user",{id:this.$store.state.deleteCollaboratorMsg.id}).then(function(e){200===e.data.code?(t.$Message.success("删除成功"),t.popClose(),t.$store.dispatch("isRouterReload",!0)):t.$Message.error(e.data.message)})},popClose:function(){this.$store.dispatch("deleteCollaborator",!1)}},components:{kangyunModal:n.a}},m={render:function(){var t=this.$createElement,e=this._self._c||t;return e("kangyun-modal",{attrs:{isShowWarn:""},on:{closeModal:this.popClose,confirm:this.confirm}},[e("template",{slot:"title"},[this._v("\n    删除合作者\n  ")]),this._v(" "),e("template",{slot:"detail"},[e("p",[this._v("确定删除合作者"+this._s(this.$store.state.deleteCollaboratorMsg.lastname)+this._s(this.$store.state.deleteCollaboratorMsg.firstname)+"？")])])],2)},staticRenderFns:[]};var _=s("VU/8")(p,m,!1,function(t){s("l0z8")},"data-v-053d456f",null).exports,g=s("44Gr"),$={name:"userlistConponent",props:["json"],data:function(){return{list:[],title:"",issoure:!1,activationIf:!1,deleteIf:!1,iconShow:parseInt(sessionStorage.getItem("key"))||0,selectType:2,ajaxObj:{0:"index2/user/reception",1:"index2/user/wait_reception",2:"index2/user/delete_reception"}}},computed:{deleteCollaborator:function(){return this.$store.state.deleteCollaborator},userTabsChange:function(){return this.$store.state.userTabs},activationIfChange:function(){return this.$store.state.activationIf},userid:function(){return this.$store.state.userInfo.id},phone:function(){return this.$store.state.userInfo.phone}},watch:{deleteCollaborator:function(t){this.deleteIf=t},userTabsChange:function(t){this.iconShow=parseInt(t),this.loadData()},activationIfChange:function(t){this.activationIf=!!t},selectType:function(t){this.loadData()}},created:function(){this.loadData()},methods:{requestUser:function(){var t=this;this.$http.post("index2/items/reception",{company_id:this.$store.state.userInfo.company_id}).then(function(e){var s=e.data;200===s.code&&(t.list=s.data,t.$store.dispatch("activeUser",s.data)),0===t.list.length&&(t.issoure=!0,t.title="")}).catch(function(){})},requestDelete:function(t){var e=this;this.title="数据加载中",0===t?this.requestUser():1===t?this.$http.post("/index/user/waitreception",{userid:this.$store.state.userInfo.id}).then(function(t){e.list=t.data.data,e.title=""}):this.$http.post("/index/user/deletebytime",{userid:this.$store.state.userInfo.id}).then(function(t){e.list=t.data.data,e.title=""})},loadData:function(){var t=this;this.title="数据加载中";var e={};e.company_id=this.$store.state.userInfo.company_id,e.user_type=this.$store.state.userInfo.user_type,e.type=this.selectType;var s=this.ajaxObj[this.iconShow];this.$http.post(s,e).then(function(e){if(200===e.data.code){var s=e.data.data;s.forEach(function(e){e.key=t.iconShow}),t.list=s,0===t.iconShow&&t.$store.dispatch("activeUser",t.list),0===t.list.length&&(t.issoure=!0),t.title=""}else t.$Message.error(e.data.message)})}},components:{userlistitem:u,usermenue:d.a,userlistActivation:v,userlistDelete:_,nosoureComponent:g.a}},y={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"userlistComp",class:3!==t.json?"":"active"},[s("usermenue",{on:{"select-type":function(e){t.selectType=arguments[0]}}}),t._v(" "),t._l(t.list,function(e,i){return s("userlistitem",{key:i,attrs:{json:e,jsonIf:t.iconShow}})}),t._v(" "),t.activationIf?s("userlistActivation"):t._e(),t._v(" "),t.deleteIf?s("userlistDelete"):t._e(),t._v(" "),t.list.length<=0?s("nosoureComponent",{attrs:{title:t.title}}):t._e()],2)},staticRenderFns:[]};var I=s("VU/8")($,y,!1,function(t){s("39/R")},"data-v-714f1442",null).exports,C=s("cWLO"),b={data:function(){return{JurisdictionList:[{value:3,label:"合作者"},{value:2,label:"管理员"}],Jurisdiction:"",active:!1,textarea:"",textareaLength:0,len:250,email:"",emailIf:!1,pop:!1,errorShow:!1,slideIf:!0,userInsetIf:!0,confirmArr:[],confirmIf:!0}},created:function(){var t=this;setTimeout(function(){for(var e=t.$store.state.activeUser,s=0;s<e.length;s++)t.confirmArr.push(e[s].email)},1500)},methods:{keyup:function(t){13===t.keyCode&&this.invite()},slide:function(){this.slideIf,this.slideIf=!this.slideIf,this.userInsetIf=!this.userInsetIf},clickPop:function(){this.pop=!0,this.errorShow=!1,this.focus()},blur:function(){if(document.getElementsByClassName("email")[0].classList.remove("activeError"),document.getElementsByClassName("fltText")[0].classList.remove("activeError"),this.errorShow=!1,this.active=!1,this.email){if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(this.email))return this.emailIf=!1,this.$Message.error("邮箱格式不正确"),!1;if(this.emailIf=!0,-1!==this.confirmArr.indexOf(this.email))return this.$Message.error("已邀请的协助者不能再邀请"),this.confirmIf=!1,!1;this.confirmIf=!0}else this.pop=!1},focus:function(){this.active=!0},chooseUser:function(t){this.Jurisdiction=t},invite:function(){var t=this;if(!this.email)return document.getElementsByClassName("email")[0].classList.add("activeError"),document.getElementsByClassName("fltText")[0].classList.add("activeError"),void(this.errorShow=!0);this.confirmIf?this.Jurisdiction?this.emailIf?this.$http.post("index2/email/send_invite",{company_id:this.$store.state.userInfo.company_id,user_id:this.$store.state.userInfo.id,invite_email:Object(C.a)(this.email.replace(/(^\s*)|(\s*$)/g,"")),invite_user_type:this.Jurisdiction,content:this.textarea.replace(/(^\s*)|(\s*$)/g,"")}).then(function(e){200===e.data.code?t.$Message.success("邀请成功"):t.$Message.error(e.data.message)}):this.$Message.error("邮箱格式不正确"):this.$Message.error("请选择邀请用户的类型"):this.$Message.error("已邀请的协助者不能再邀请")}},computed:{activeUser:function(){return this.$store.state.activeUser}},watch:{textarea:function(t){t.length>=250?this.textareaLength=250:this.textareaLength=t.length}}},x={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"userInvite"},[s("div",{staticClass:"user__b"},[t._m(0),t._v(" "),s("div",{class:["userInset",!0===t.userInsetIf?"active":""]},[s("div",{staticClass:"email",class:{active:t.active},on:{click:function(e){return e.stopPropagation(),t.clickPop(e)}}},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.email,expression:"email"}],attrs:{type:"email",autocomplete:"",name:"email"},domProps:{value:t.email},on:{focus:t.focus,blur:t.blur,keyup:t.keyup,input:function(e){e.target.composing||(t.email=e.target.value)}}}),t._v(" "),s("label",{staticClass:"fltText",class:{active:t.pop}},[t._v("电子邮件地址*")]),t._v(" "),t.errorShow?s("label",{staticClass:"bottomText"},[t._v("此项为必填项*")]):t._e()]),t._v(" "),s("div",{staticClass:"textArea"},[s("i-input",{attrs:{type:"textarea",maxlength:t.len,rows:3,placeholder:"邀请消息"},model:{value:t.textarea,callback:function(e){t.textarea=e},expression:"textarea"}}),t._v(" "),s("div",{staticClass:"size"},[s("p",[t._v(t._s(t.textareaLength)+"/250")])])],1),t._v(" "),s("div",{staticClass:"confirm"},[s("i-select",{staticClass:"Confirm-invite",staticStyle:{width:"200px"},model:{value:t.Jurisdiction,callback:function(e){t.Jurisdiction=e},expression:"Jurisdiction"}},t._l(t.JurisdictionList,function(e,i){return s("i-option",{key:i,attrs:{value:e.value}},[t._v("\n            "+t._s(e.label)+"\n          ")])}),1),t._v(" "),s("button",{staticClass:"c-button c-button__primary--radius",on:{click:t.invite}},[t._v("邀请")])],1)])])])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"userContent"},[e("p",[this._v("邀请合作者")])])}]};var k={data:function(){return{key:0}},created:function(){var t=sessionStorage.getItem("key");this.$data.key=parseInt(t)||0},methods:{click:function(t){this.$data.key=parseInt(t),sessionStorage.setItem("key",t),this.$store.dispatch("userTabs",t)}}},M={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"userlistTabs"}},[s("div",{staticClass:"left"},[s("button",{staticClass:"c-button c-button__primary--radius",class:0===t.key?"":"c-button--text",on:{click:function(e){t.click(0)}}},[t._v("活跃账户")]),t._v(" "),s("button",{staticClass:"c-button c-button__primary--radius",class:1===t.key?"":"c-button--text",on:{click:function(e){t.click(1)}}},[t._v("未激活")]),t._v(" "),s("button",{staticClass:"c-button c-button__primary--radius",class:2===t.key?"":"c-button--text",on:{click:function(e){t.click(2)}}},[t._v("已删除")])])])},staticRenderFns:[]};var j={created:function(){this.$data.administrator=this.$store.state.userInfo.user_type},data:function(){return{administrator:null}},computed:{activeUser:function(){return this.$store.state.activeUser}},name:"userlist",components:{userheader:a,userlistConponent:I,userlistInvite:s("VU/8")(b,x,!1,function(t){s("ZfMn")},"data-v-633e1ea1",null).exports,userlistTabs:s("VU/8")(k,M,!1,function(t){s("7QNP"),s("h9Wp")},"data-v-6024b4e3",null).exports}},w={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"userlistbox"},[s("div",{staticClass:"userlist",class:{active:3===t.administrator}},[s("userheader",{attrs:{activeUser:t.activeUser}}),t._v(" "),3!==t.administrator?s("userlistTabs"):t._e(),t._v(" "),s("userlistConponent",{attrs:{json:t.administrator}})],1),t._v(" "),3!==t.administrator?s("userlistInvite"):t._e()],1)},staticRenderFns:[]};var S=s("VU/8")(j,w,!1,function(t){s("MaQ2")},"data-v-02a87e22",null);e.default=S.exports},auBW:function(t,e){},h9Wp:function(t,e){},l0z8:function(t,e){},"ljq/":function(t,e){}});