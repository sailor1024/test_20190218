webpackJsonp([5],{"1Li+":function(t,e){},"7RKz":function(t,e){},"KPV+":function(t,e){},"OR/n":function(t,e){},XOmH:function(t,e){},eqJc:function(t,e,s){"use strict";var i={name:"editComponent",data:function(){return{isupload:!1}},created:function(){var t=this;window.onmessage=function(e){var s=e.data;t.datafunc(s)}},destroyed:function(){window.onmessage=null},methods:{clickStop:function(){this.parentcolsefunc()},parentcolsefunc:function(){this.$emit("parentcolsefunc","close")},datafunc:function(t){switch(t){case"sendsuc":this.$Notice.success({title:"发布成功"});break;case"deleteImage":this.$Notice.success({title:"删除成功"});break;case"setInitial":this.$Notice.success({title:"设置初始图片成功"});break;case"setInitialagain":this.$Notice.success({title:"请勿重复设置初始图片"});break;case"savesuccess":this.$Notice.success({title:"保存成功"});break;case"nodesbute":this.$Notice.info({title:"请输入描述"});break;case"nofile":this.$Notice.info({title:"请选择文件资源"});break;case"uploading":this.isupload=!0;break;case"uploadsuccess":this.isupload=!1,this.$Notice.success({title:"文件资源上传成功"});break;case"uploadfail":this.isupload=!1,this.$Notice.warning({title:"文件资源上传失败,请重试"});break;case"Screenshot":this.isupload=!1,this.$Notice.success({title:"截屏成功"});break;case"startRuler":this.$Notice.info({title:"开始测量"});break;case"endRuler":this.$Notice.info({title:"停止测量"});break;case"CannotPlay":this.$Notice.warning({title:"无法开启此按钮，请先截图"});break;case"NotAbbreviated":this.$Notice.warning({title:"无法开启此按钮，请先截图"})}}},computed:{src:function(){return localStorage.getItem("editurl")+"&_="+this.$store.state.userInfo.token}}},a={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"box"},[t.isupload?s("div",{staticClass:"demo-spin-container"},[s("Spin",{attrs:{fix:""}},[s("Icon",{staticClass:"demo-spin-icon-load",attrs:{type:"load-c",size:"18"}}),t._v(" "),s("div",[t._v("资源上传中...")])],1)],1):t._e(),t._v(" "),s("a",{staticClass:"colsebtn",on:{click:function(e){return e.stopPropagation(),t.parentcolsefunc(e)}}},[s("Icon",{staticStyle:{"margin-top":"10px"},attrs:{color:"#fff",size:"24",type:"close-circled"}})],1),t._v(" "),s("div",{staticClass:"iframe",on:{click:function(e){return e.stopPropagation(),e.preventDefault(),t.clickStop(e)}}},[s("iframe",{ref:"iframe",attrs:{name:"htmliframe",src:t.src}})])])},staticRenderFns:[]};var n=s("VU/8")(i,a,!1,function(t){s("nOYA")},"data-v-7a0b7bff",null);e.a=n.exports},gph7:function(t,e){},lO7g:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("mvHQ"),a=s.n(i),n=s("bZyw"),o=s("lxim"),c=s("L2qX"),r=(s("ACn3"),{name:"share",components:{kangyunModal:c.a},data:function(){return{disabledGroupLeft:"Default",disabledGroupRight:"Enable",Tabpane:[{label:"商标",title:"包含所有公共信息",link:"链接",Embed:"嵌入",key:"商标",copy:"复制",copyTitle:"复制内容嵌入"},{label:"无商标",title:"包含所有公共信息",link:"链接",Embed:"嵌入",key:"无商标",copy:"复制",copyTitle:"复制内容嵌入"}],insetVal:"https://todo.kangyun3d.cn/"+this.$store.state.json.url,active:0,tabIndex:0,copyTitle:"复制链接进行分享"}},methods:{emmet:function(t){0===t?(this.active=0,this.insetVal="https://todo.kangyun3d.cn/"+this.$store.state.json.url):1===t&&(this.active=1,this.insetVal="<iframe width=853 height=480 src=https://todo.kangyun3d.cn/"+this.$store.state.json.url+"  frameborder=0 allowfullscreen allow=vr></iframe>")},linkemit:function(){this.active=0,this.insetVal="https://todo.kangyun3d.cn/"+this.$store.state.json.url},Embedemit:function(){this.active=1,this.insetVal="<iframe width=853 height=480 src=https://todo.kangyun3d.cn/"+this.$store.state.json.url+"  frameborder=0 allowfullscreen allow=vr></iframe>"},popClose:function(t){this.$store.dispatch("shareTo",!1)},onCopy:function(t){},success:function(t){this.$Notice.success({title:"复制成功"})}},watch:{active:function(t){this.copyTitle=0===t?"复制链接进行分享":"复制内容嵌入"}}}),l={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("kangyun-modal",{attrs:{isShowCloseBtn:"",modalWidth:631},on:{closeModal:t.popClose}},[s("div",{staticClass:"box-content"},[s("h3",{staticClass:"box-title"},[t._v("分享")]),t._v(" "),s("div",{staticClass:"box-btn",staticStyle:{"padding-left":"7px"}},[s("button",{staticClass:"c-button c-button__primary--radius",class:{"c-button--text":0!==t.tabIndex},on:{click:function(e){t.tabIndex=0}}},[t._v("商标")]),t._v(" "),s("button",{staticClass:"c-button c-button__primary--radius",class:{"c-button--text":1!==t.tabIndex},on:{click:function(e){t.tabIndex=1}}},[t._v("无商标")])]),t._v(" "),s("transition",{attrs:{mode:"out-in"}},t._l(t.Tabpane,function(e,i){return t.tabIndex===i?s("div",{key:i,staticClass:"dialog_body-tabs"},[s("div",{staticClass:"dialog_body-tabs-content"},[s("p",[t._v(t._s(e.title))]),t._v(" "),s("div",{staticClass:"dialog-search"},[s("RadioGroup",{staticStyle:{"padding-left":"14px"},on:{"on-change":t.emmet},model:{value:t.active,callback:function(e){t.active=e},expression:"active"}},[s("Radio",{attrs:{label:0}},[s("span",{staticClass:"address-span",class:0===t.active?"active":""},[t._v(t._s(e.link))])]),t._v(" "),s("Radio",{attrs:{label:1}},[s("span",{staticClass:"address-span",class:1===t.active?"active":""},[t._v(t._s(e.Embed))])])],1),t._v(" "),s("div",{staticClass:"dialog-search-input box-btn"},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.insetVal,expression:"insetVal"}],attrs:{type:"text"},domProps:{value:t.insetVal},on:{input:function(e){e.target.composing||(t.insetVal=e.target.value)}}}),t._v(" "),s("button",{directives:[{name:"clipboard",rawName:"v-clipboard:copy",value:t.insetVal,expression:"insetVal",arg:"copy"},{name:"clipboard",rawName:"v-clipboard:success",value:t.onCopy,expression:"onCopy",arg:"success"}],staticClass:"c-button c-button__primary--radius",staticStyle:{"margin-left":"20px"},on:{click:function(e){t.success(!0)}}},[t._v(t._s(e.copy))])]),t._v(" "),s("p",{staticStyle:{color:"#CCCCCC","margin-left":"12px","margin-top":"13px","font-size":"12px"}},[t._v(t._s(t.copyTitle))])],1)])]):t._e()}),0)],1)])},staticRenderFns:[]};var u=s("VU/8")(r,l,!1,function(t){s("XOmH")},"data-v-d6eac710",null).exports,d=s("cWLO"),p=s("L6bb"),h=s.n(p),v={name:"clounnavConponent",props:["title"],data:function(){return{accessType:1,popTo:this.$store.state.popTo,shareTo:this.$store.state.shareTo,windowReide:this.$store.state.spaceReside,canView:"可以查看",email:"",popShow:!1,shareShow:0,status:"",data:[],editor:1,list:[],inviteList:[],nameObj:{1:"可以查看",2:"可以编辑",3:"删除用户"},userEditType:1,userItemIndex:0}},components:{pop:o.a,share:u},created:function(){this.shareShow=this.$store.state.json.isshow_offica,768===window.innerWidth&&(this.$data.windowReide={padding:"0 100px"}),this.getData()},methods:{choiceItem:function(t){this.userEditType=this.inviteList[t].edit_type},home:function(){this.$router.push({path:"/"})},stop:function(){},popShowHover:function(){var t=this;2===this.status?(this.popShow=!this.popShow,document.onclick=function(){t.popShow=!1}):this.$Message.error("对不起，您暂时还不能邀请合作者")},sendemail:function(){var t=this;this.email?this.$http.post("/index2/email/email",{email:Object(d.a)(this.email),file_type:2,userid:this.$store.state.userInfo.id,type:this.editor,item_id:this.$route.query.id}).then(function(e){200===e.data.code?(t.$Message.success("邀请成功"),t.getData()):401===e.data.code?t.$Message.error("邀请失败，请重新邀请"):t.$Message.error(e.data.message)}):this.$Message.error("请输入邮箱")},pop:function(){if(1===this.status)return this.$Message.error("对不起，您不能公开此项目"),!1;0===this.shareShow?(this.$data.popTo=!0,this.$store.state.popTo=!0):(this.popTo=!0,this.$store.state.popTo=!0)},share:function(){this.shareShow&&(this.$store.state.shareTo=!0,this.$data.shareTo=!0)},selectfunc:function(t){this.canView=t},getData:function(){var t=this;this.$http.post("index2/index/invite_cooperator_list",{item_dir:"",project_id:this.$route.query.id}).then(function(e){var s=e.data;200===s.code&&(s.data.forEach(function(e){e.optionName=t.nameObj[e.edit_type]}),t.inviteList=s.data,t.inviteList.length&&(t.userEditType=t.inviteList[0].edit_type,t.userItemIndex=0))})},sendItem:function(){var t=this;this.$http.post("index2/email/edit_invite_items",{dir_item_id:this.$route.query.id,email:h()(this.inviteList[this.userItemIndex].email),type:this.userEditType,file_type:2,edit_type:this.JsonMsg.edit_type}).then(function(e){200===e.data.code?(3===t.userEditType&&t.getData(),t.$Message.success("修改成功")):t.$Message.error(e.data.message)})}},computed:{popToChange:function(){return this.$store.state.popTo},shareToChange:function(){return this.$store.state.shareTo},spaceReside:function(){return this.$store.state.spaceReside},json:function(){return this.$store.state.json.isshow_offica},shareShowChange:function(){return this.$store.state.shareShowChange},JsonMsg:function(){return this.$store.state.json}},watch:{json:function(t){this.shareShow=t},popToChange:function(t,e){this.$data.popTo=t},shareToChange:function(t,e){this.$data.shareTo=t},spaceReside:function(t,e){this.$data.windowReide=t},shareShowChange:function(t){this.shareShow=t},JsonMsg:function(t){this.status=t.edit_type}}},f={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[t.popTo?s("pop",{attrs:{giveData:t.title,shareShow:t.shareShow}}):t._e(),t._v(" "),t.shareTo?s("share"):t._e(),t._v(" "),s("Row",{staticClass:"Yun-nav",attrs:{type:"flex"}},[s("Row",{staticClass:"Yun-nav-container",style:t.windowReide,attrs:{type:"flex"}},[s("i-col",{attrs:{span:"15",order:"1"}},[s("p",{staticClass:"Yun-page"},[t._v(t._s(t.title.title))])]),t._v(" "),s("i-col",{attrs:{span:"9",order:"3"}},[s("div",{staticClass:"Yun-shareSpace"},[s("div",{staticStyle:{"padding-right":"22px"}},[s("div",{staticClass:"barbal Yun-space-Pos"},[s("div",{staticClass:"Yun-space-list"},[s("i",{staticClass:"font_family icon-icon-test10",class:[1===t.status?"shareActive":""],on:{click:function(e){return e.stopPropagation(),t.popShowHover(e)}}}),t._v(" "),s("span",{on:{click:function(e){return e.stopPropagation(),t.popShowHover(e)}}},[t._v("管理合作者")])]),t._v(" "),t.popShow?s("div",{staticClass:"Yun-space-pop",on:{click:function(e){return e.stopPropagation(),t.stop(e)}}},[t.inviteList.length?s("div",{on:{keyup:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?t.sendItem(e):null}}},[s("div",{staticClass:"Yun-space-pop-header"},[s("p",{staticClass:"Yun-space-pop-header-title"},[t._v("请选择该项目的合作者")]),t._v(" "),s("div",[s("i-select",{staticClass:"Yun-space__select",on:{"on-change":t.choiceItem},model:{value:t.userItemIndex,callback:function(e){t.userItemIndex=e},expression:"userItemIndex"}},t._l(t.inviteList,function(e,i){return s("i-option",{key:i,attrs:{value:i}},[t._v(t._s(e.user_name))])}),1)],1)]),t._v(" "),s("RadioGroup",{model:{value:t.userEditType,callback:function(e){t.userEditType=e},expression:"userEditType"}},[s("Radio",{attrs:{label:1}},[s("span",{staticClass:"radio__span"},[t._v("可以查看")])]),t._v(" "),s("Radio",{attrs:{label:2}},[s("span",{staticClass:"radio__span"},[t._v("可以编辑")])]),t._v(" "),s("Radio",{attrs:{label:3}},[s("span",{staticClass:"radio__span"},[t._v("删除用户")])])],1),t._v(" "),s("div",{staticClass:"Yun-space-invite"},[s("button",{staticClass:"c-button c-button__primary--radius",on:{click:t.sendItem}},[t._v("保存")])])],1):s("div",{on:{keyup:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?t.sendemail(e):null}}},[s("div",{staticClass:"Yun-space-pop-header"},[s("p",{staticClass:"Yun-space-pop-header-title"},[t._v("该项目暂无合作者，您可以通过邮箱进行邀请")]),t._v(" "),s("div",[s("Icon",{staticClass:"font_family icon-email"}),t._v(" "),s("div",{staticClass:"Yun-space-pop-input"},[s("i-input",{attrs:{placeholder:"请输入邮箱地址","value.sync":"value"},model:{value:t.email,callback:function(e){t.email=e},expression:"email"}})],1)],1)]),t._v(" "),s("RadioGroup",{model:{value:t.editor,callback:function(e){t.editor=e},expression:"editor"}},[s("Radio",{attrs:{label:1}},[s("span",{staticClass:"radio__span"},[t._v("可以查看")])]),t._v(" "),s("Radio",{attrs:{label:2}},[s("span",{staticClass:"radio__span"},[t._v("可以编辑")])])],1),t._v(" "),s("div",{staticClass:"Yun-space-invite"},[s("button",{staticClass:"c-button c-button__primary--radius",on:{click:t.sendemail}},[t._v("邀请")])])],1)]):t._e()]),t._v(" "),s("div",{staticClass:"barbal",staticStyle:{margin:"0 47px"}},[s("div",{staticClass:"Yun-space-list",on:{click:t.pop}},[0===t.shareShow&&1===t.status?s("i",{staticClass:"font_family icon-icon-test8",staticStyle:{color:"#a9a9a9"}}):1===t.shareShow&&1===t.status?s("i",{staticClass:"font_family icon-icon-test8",staticStyle:{color:"#a9a9a9"}}):0===t.shareShow&&2===t.status?s("i",{staticClass:"font_family icon-icon-test8"}):0===t.shareShow?s("i",{staticClass:"font_family icon-icon-test8"}):s("Icon",{attrs:{type:"unlocked"}}),t._v(" "),0===t.shareShow?s("span",{staticStyle:{"white-space":"nowrap"}},[t._v("空间是私人的")]):s("span",[t._v("空间是公共的")])],1)]),t._v(" "),s("div",{staticClass:"barbal"},[s("div",{staticClass:"Yun-space-list",on:{click:t.share}},[s("i",{staticClass:"font_family icon-icon-test14",class:[0===t.shareShow?"shareActive":""]}),t._v(" "),s("span",{class:[0===t.shareShow?"shareActive":""]},[t._v("分享")])])])])])])],1)],1)],1)},staticRenderFns:[]};var m={name:"Header",props:["title"],components:{clounnavConponent:s("VU/8")(v,f,!1,function(t){s("sOUy")},"data-v-439ef0f2",null).exports,headerConponent:n.a}},_={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"header"}},[e("headerConponent"),this._v(" "),e("clounnavConponent",{attrs:{title:this.title}})],1)},staticRenderFns:[]};var b=s("VU/8")(m,_,!1,function(t){s("gph7")},"data-v-33a49e2d",null).exports,y={name:"tabBarConponent",props:["json"],data:function(){return{isedit:!1,path:2}},created:function(){this.path=2},computed:{pathJson:function(){return this.$route.path}},watch:{pathJson:function(t){2===this.$store.state.json.edit_type&&(this.path="/home"===t||"/home/"===t?2:1)}},methods:{gotofunc:function(){document.body.style.height="100vh",document.body.style["overflow-y"]="hidden",this.isedit=!0},colsefunc:function(){document.body.style.height="unset",document.body.style["overflow-y"]="auto",this.isedit=!1,this.$store.dispatch("resetiFramPage",!0)},selectfunc:function(t){console.log(t),this.$router.push({name:t,query:{id:this.$route.query.id}})}},components:{editConponent:s("eqJc").a}},g={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"tabBar"}},[s("div",{staticClass:"editbtn"},[2===t.$store.state.json.edit_type?s("button",{staticClass:"c-button c-button__primary--radius",staticStyle:{padding:"11px 25px"},on:{click:t.gotofunc}},[t._v("编辑")]):t._e()]),t._v(" "),s("div",{staticStyle:{"margin-bottom":"24px"}},[s("button",{staticClass:"c-button c-button__primary--radius",class:{"c-button--text":"tabone"!==t.$route.name},on:{click:function(e){t.selectfunc("tabone")}}},[t._v("媒体")]),t._v(" "),s("button",{staticClass:"c-button c-button__primary--radius",class:{"c-button--text":"tabtwo"!==t.$route.name},on:{click:function(e){t.selectfunc("tabtwo")}}},[t._v("详细信息")]),t._v(" "),s("button",{staticClass:"c-button c-button__primary--radius",class:{"c-button--text":"tabfou"!==t.$route.name},on:{click:function(e){t.selectfunc("tabfou")}}},[t._v("数据统计")])]),t._v(" "),s("router-view",{attrs:{json:t.json}}),t._v(" "),t.isedit?s("editConponent",{on:{parentcolsefunc:t.colsefunc}}):t._e()],1)},staticRenderFns:[]};var C={name:"mainConponent",props:["json"],components:{tabBarConponent:s("VU/8")(y,g,!1,function(t){s("1Li+")},null,null).exports}},$={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"main"}},[e("div",{attrs:{id:"content"}},[e("tabBarConponent",{attrs:{json:this.json}})],1)])},staticRenderFns:[]};var w={name:"Home",data:function(){return{value:""}},computed:{titlestr:function(){return this.json.title?{title:this.json.title,id:this.json.id}:""},json:function(){return this.$store.state.json}},created:function(){var t=this;this.$http.post("index2/items/space_detil",{id:this.$route.query.id}).then(function(e){var s=e.data;if(200===s.code){t.$store.dispatch("json",s.data),sessionStorage.setItem("jsonMsg",a()(s.data)),t.getModelJson(t.json.dirname);var i=t.$route.query.id,n=t.$imgURL+t.json.edit_url+"&tn="+t.json.dirname+"&itemid="+i+"&t="+(new Date).getTime();localStorage.setItem("editurl",n)}else t.$message.error("出错了,请重试")})},methods:{getModelJson:function(t){var e=this,s=window.location.origin+"/edit/path/"+t+"/model.json";this.$http.get(s).then(function(t){}).catch(function(s){return console.log(s),e.postCopyJson(t),!1})},postCopyJson:function(t){this.$http.get("index/upload/start_copy?dirname="+t,{}).then(function(t){})}},components:{Header:b,mainConponent:s("VU/8")(C,$,!1,function(t){s("KPV+")},"data-v-2791c452",null).exports}},x={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"home"}},[e("Header",{staticClass:"header",attrs:{title:this.titlestr}}),this._v(" "),e("mainConponent",{staticClass:"maincontent",attrs:{json:this.json}})],1)},staticRenderFns:[]};var k=s("VU/8")(w,x,!1,function(t){s("7RKz")},"data-v-5eedac94",null);e.default=k.exports},lxim:function(t,e,s){"use strict";var i={name:"pop",props:["giveData","shareShow"],methods:{confirm:function(){var t=this,e=this.shareShow?0:1;this.$http.post("/index2/items/edit_isshow",{id:this.giveData.id,isshow_offica:e}).then(function(s){200===s.data.code?(t.$store.dispatch("shareShowChange",e),1===e?t.$Message.success("公开成功"):t.$Message.success("空间私密成功"),t.$store.dispatch("isRouterReload",!0),t.popClose()):t.$Message.error(s.data.message)})},popClose:function(){this.$store.dispatch("popTo",!1),this.$emit("clickNone",!1)}},components:{kangyunModal:s("L2qX").a}},a={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("kangyun-modal",{attrs:{submitText:"确认"},on:{closeModal:t.popClose,confirm:t.confirm}},[s("template",{slot:"title"},[0===t.shareShow?[t._v("公开展示")]:t._e(),t._v(" "),[t._v("仅自己可以看")]],2),t._v(" "),s("template",{slot:"detail"},[0===t.shareShow?s("p",{staticStyle:{padding:"0 60px 0 45px"}},[t._v(t._s(t.giveData.title)+"为了让其他人查看你的空间，我们将公开您的空间")]):s("p",{staticStyle:{padding:"0 60px 0 45px"}},[t._v(t._s(t.giveData.title)+"此空间仅供您和您的协作者使用。任何链接或嵌入的空间将不再有效。")])])],2)},staticRenderFns:[]};var n=s("VU/8")(i,a,!1,function(t){s("OR/n")},null,null);e.a=n.exports},nOYA:function(t,e){},sOUy:function(t,e){}});