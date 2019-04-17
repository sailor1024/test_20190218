import itemListFolderDelete from './list/itemlist/itemListContentComp/itemListFolderDelete.vue'
import itemListFolderRename from './list/itemlist/itemListContentComp/itemListFolderRename.vue'
import itemListModelFolder from './list/itemlist/itemListContentComp/itemListModelFolder.vue'
import itemListFolderMove from './list/itemlist/itemListContentComp/itemListFolderMove.vue'
import itemListFolderConfirm from './list/itemlist/itemListContentComp/itemListFolderConfirm'
export default (Vue) => {
  Vue.component('itemListFolderDelete', itemListFolderDelete)
  Vue.component('itemListFolderRename', itemListFolderRename)
  Vue.component('itemListModelFolder', itemListModelFolder)
  Vue.component('itemListFolderMove', itemListFolderMove)
  Vue.component('itemListFolderConfirm', itemListFolderConfirm)
}
