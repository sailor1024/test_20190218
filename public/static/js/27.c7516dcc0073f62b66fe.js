webpackJsonp([27],{beX5:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=s("mvHQ"),o=s.n(i),r=s("quVf"),n=s("rmv/"),a=s("qUAm"),h=s("8ii8"),c=s("44Gr"),l=s("+i2e"),d=s("aaV0"),u=s("0Ejo"),g=s("9PDp"),p=s("Wd8q"),f={name:"itemList",computed:{deleteFileSpace:function(){return this.$store.state.deleteFileSpace},isShow:function(){return this.$store.state.showModal},showEditorTo:function(){return this.$store.state.showEditorTo},showCreateTo:function(){return this.$store.state.showCreateTo},ListerMsgChange:function(){return this.$store.state.ListerMsg},FolderJudgment:function(){return this.$store.state.FolderJudgment},somePage:function(){return this.searchPages.page+this.sourcePage.page},isShowFloder:function(){return!(!this.isShowSearchPage||1!==this.searchPages.page)||!(!this.issoure||!this.isShowSourcePage||1!==this.sourcePage.page)}},data:function(){return{isShowLoading:!1,searchText:"",list:this.$store.state.Lister,type:2,issoure:!0,asignarr:[],checkItems:0,checkAll:!1,countnum:0,inviteIf:!1,inviteProject:"",EditorProjectIf:!1,EditorProject:"",showCreateIf:!1,EditorCreate:"",CreateFolderMsg:[],FolderRenameIf:!1,showDeleteFileIf:!1,showDeleteFileMsg:"",isShowSearchPage:!1,isShowSourcePage:!0,searchPages:{page:1,count:0,pageSize:10},sourcePage:{page:1,pageSize:10},selectProjectArr:[],selectFolderArr:[]}},watch:{deleteFileSpace:function(e){this.showDeleteFileIf=e.isShow,this.showDeleteFileMsg=e.json},ListerMsgChange:function(e){this.CreateFolderMsg.push(e)},isShow:function(e){this.inviteIf=e.isShow,this.inviteProject=e.json},showEditorTo:function(e){this.EditorProjectIf=e.isShow,this.EditorProject=e.json},showCreateTo:function(e){this.showCreateIf=e.isShow,this.EditorCreate=e.json},FolderJudgment:function(e){this.loadsoure()}},methods:{checkAllAction:function(){this.checkAll=!this.checkAll},transformProjectItem:function(e){var t=this.selectProjectArr.map(function(e){return e.id}).indexOf(e.id);t>-1?this.selectProjectArr.splice(t,1):this.selectProjectArr.push(e)},transformFolderItem:function(e){var t=this.selectFolderArr.map(function(e){return e.id}).indexOf(e.id);t>-1?this.selectFolderArr.splice(t,1):this.selectFolderArr.push(e)},changevalue:function(e){this.checkAll=!1,this.type=e,this.sourcePage.page=1,this.loadsoure(e)},sourechange:function(e){this.checkAll=!1,this.sourcePage.page=e,this.loadsoure(this.type,e)},loadSearch:function(e){this.checkAll=!1,this.searchPages.page=e,this.searchfunc()},reloadfunc:function(e,t){if(this.checkAll=!1,this.searchPages.page=1,this.searchPages.keyWords=e,this.searchPages.type=t,e)this.isShowSearchPage=!0,this.isShowSourcePage=!1,this.searchfunc();else{this.isShowSearchPage=!1,this.isShowSourcePage=!0;var s=this.asignarr;this.list=s,0!==s.length?this.issoure=!0:this.issoure=!1}},searchfunc:function(e,t,s){var i=this;this.$http.post("/index/index/search",{key:this.searchPages.keyWords,userid:this.$store.state.userInfo.id,type:this.searchPages.type,phone:this.$store.state.userInfo.phone,page:this.searchPages.page}).then(function(e){var t=e.data;1===t.code?(i.list=t.data.list,i.searchPages.count=t.data.count):(i.isShowSearchPage=!1,i.$Message.warning("没有找到呢"))}).catch(function(){})},loadsoure:function(e){var t=this,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;this.$http.post("index2/index/space_list",{user_type:this.$store.state.userInfo.user_type,company_id:this.$store.state.userInfo.company_id,user_id:this.$store.state.userInfo.id,dir_father_id:0,items_dir_id:0,page:s,limit_num:10,type:this.type}).then(function(e){t.isShowLoading=!1;var s=e.data;if(200===s.code){t.list=s.data.items.data,t.asignarr=s.data.items.data,t.CreateFolderMsg=s.data.dir.data,t.$store.dispatch("moveFolderProject",s.data.dir.data),t.$store.dispatch("folderEditType",s.data.edit_type);var i=e.data.data.all_path;i.shift(),t.$store.dispatch("pathList",i),t.countnum=s.data.count,window.scrollTo(0,0)}else t.$Message.error(e.data.message);0===t.list.length&&0===t.CreateFolderMsg.length&&(t.issoure=!1)})},loadNameSort:function(e){var t=this,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;this.$http.post("/index/index/nameSort",{userid:this.$store.state.userInfo.id,type:e,page:s,phone:this.$store.state.userInfo.phone}).then(function(e){var s=e.data;1===s.code?(t.list=s.data.list,t.asignarr=s.data.list,t.countnum=s.data.count):t.$Message.error("出错了,请重试"),0===t.list.length&&(t.issoure=!1)})},GetFolder:function(){var e=this;this.$http.post("index/file/filelist",{userId:this.$store.state.userInfo.id,phone:this.$store.state.userInfo.phone}).then(function(t){t.data.data.length>0?(e.CreateFolderMsg=t.data.data,e.$store.dispatch("moveFolderProject",t.data.data),e.getUserFolder()):e.getUserFolder()})},getUserFolder:function(){var e=this;this.$http.post("index/file/sonfilelist",{id:this.$store.state.userInfo.id}).then(function(t){""!==t.data&&setTimeout(function(){for(var s=t.data.data,i=0;i<s.length;i++)e.CreateFolderMsg.push(s[i])},100)})}},created:function(){this.isShowLoading=!0,this.loadsoure(this.type),localStorage.setItem("FolderJsonOnce",o()(0))},destroyed:function(){this.$store.dispatch("showModal",!1)},components:{itemListTitle:r.a,itemListSubtitle:h.a,itemListContent:n.a,itemListPage:a.a,nosoureComponent:c.a,itemListModal:l.a,itemListContentEditor:d.a,itemListContentCreate:u.a,itemListFolder:g.a,itemListdeletaFile:p.a}},m=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"itemList"},[e.isShowLoading?s("Spin",{attrs:{fix:""}}):e._e(),e._v(" "),e.inviteIf?s("item-list-modal",{attrs:{inviteProject:e.inviteProject}}):e._e(),e._v(" "),s("item-list-title",{on:{childchange:e.reloadfunc}}),e._v(" "),e.issoure?s("item-list-subtitle",{attrs:{originalityData:{files:e.CreateFolderMsg,projects:e.list},isCheckAll:e.checkAll,folderItems:e.selectFolderArr,projectItems:e.selectProjectArr},on:{childchange:e.changevalue,changeCheckStatus:e.checkAllAction,changeShowContentCreate:function(t){e.showCreateIf=arguments[0]}}}):e._e(),e._v(" "),e._l(e.CreateFolderMsg,function(t,i){return s("itemListFolder",{key:i+"a",attrs:{page:e.somePage,isCheckAll:e.checkAll,json:t},on:{putInfo:e.transformFolderItem,getThisInfo:function(t){e.EditorCreate=arguments[0]},changeShowContentCreate:function(t){e.showCreateIf=arguments[0]}}})}),e._v(" "),e._l(e.list,function(t,i){return s("item-list-content",{key:i,attrs:{page:e.somePage,isCheckAll:e.checkAll,json:t},on:{putInfo:e.transformProjectItem,changeShowContentCreate:function(t){e.showCreateIf=arguments[0]},getThisInfo:function(t){e.EditorCreate=arguments[0]}}})}),e._v(" "),e.issoure&&e.isShowSourcePage?s("item-list-page",{attrs:{pageSize:e.sourcePage.pageSize,current:e.sourcePage.page,count:e.countnum},on:{pagechange:e.sourechange}}):e._e(),e._v(" "),e.isShowSearchPage?s("item-list-page",{attrs:{count:e.searchPages.count},on:{pagechange:e.loadSearch}}):e._e(),e._v(" "),e.issoure?e._e():s("nosoureComponent"),e._v(" "),e.EditorProjectIf?s("itemListContentEditor",{attrs:{EditorProject:e.EditorProject}}):e._e(),e._v(" "),e.showCreateIf?s("itemListContentCreate",{attrs:{projectItems:e.selectProjectArr,FolderItems:e.selectFolderArr},on:{changeShowContentCreate:function(t){e.showCreateIf=arguments[0]}}}):e._e(),e._v(" "),e.showDeleteFileIf?s("itemListdeletaFile",{attrs:{showDeleteFileMsg:e.showDeleteFileMsg}}):e._e()],2)};m._withStripped=!0;var A={render:m,staticRenderFns:[]},C=A;var P=!1;var w=s("VU/8")(f,C,!1,function(e){P||s("rVNz")},null,null);w.options.__file="src/components/list/itemlist/ItemList.vue";t.default=w.exports},rVNz:function(e,t,s){var i=s("uiRc");"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);s("rjj0")("72ecbc9c",i,!1,{})},uiRc:function(e,t,s){(e.exports=s("FZ+f")(!0)).push([e.i,"\n.itemList {\n  position: relative;\n  margin: 0 165px;\n  padding-bottom: 60px;\n}\n.itemList > .itemList-contentBox:nth-last-child(2) .ivu-card {\n    border: 1px solid #dddee1;\n}\n.nosoure {\n  width: 300px;\n  height: 100px;\n  line-height: 100px;\n  font-size: 14px;\n  text-align: center;\n  margin: 0 auto;\n}\n","",{version:3,sources:["C:/Users/Administrator/Desktop/spaceAdmin/spaceAdmin/src/components/list/itemlist/ItemList.vue"],names:[],mappings:";AACA;EACE,mBAAmB;EACnB,gBAAgB;EAChB,qBAAqB;CACtB;AACD;IACI,0BAA0B;CAC7B;AACD;EACE,aAAa;EACb,cAAc;EACd,mBAAmB;EACnB,gBAAgB;EAChB,mBAAmB;EACnB,eAAe;CAChB",file:"ItemList.vue",sourcesContent:["\n.itemList {\n  position: relative;\n  margin: 0 165px;\n  padding-bottom: 60px;\n}\n.itemList > .itemList-contentBox:nth-last-child(2) .ivu-card {\n    border: 1px solid #dddee1;\n}\n.nosoure {\n  width: 300px;\n  height: 100px;\n  line-height: 100px;\n  font-size: 14px;\n  text-align: center;\n  margin: 0 auto;\n}\n"],sourceRoot:""}])}});