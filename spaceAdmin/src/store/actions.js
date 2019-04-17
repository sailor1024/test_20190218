import {setCookie} from '@/utils/utils'

const actions = {
  changeName (content, name) {
    content.commit('changeName', name)
  },
  popTo (content, popTo) {
    content.commit('popTo', popTo)
  },
  shareTo (content, shareTo) {
    content.commit('shareTo', shareTo)
  },
  createTo (content, createTo) {
    content.commit('createTo', createTo)
  },
  showEditorTo (content, showEditorTo) {
    content.commit('showEditorTo', showEditorTo)
  },
  showCreateTo (content, showCreateTo) {
    content.commit('showCreateTo', showCreateTo)
  },
  showMoveCreateTo (content, showMoveCreateTo) {
    content.commit('showMoveCreateTo', showMoveCreateTo)
  },
  stainumTo (content, stainumTo) {
    content.commit('stainumTo', stainumTo)
  },
  FolderRenameTo (content, FolderRenameTo) {
    content.commit('FolderRenameTo', FolderRenameTo)
  },
  FolderRename (content, FolderRename) {
    content.commit('FolderRename', FolderRename)
  },
  userInfo (content, obj) {
    content.commit('userInfo', obj)
  },
  json (content, obj) {
    content.commit('json', obj)
  },
  statobj (content, obj) {
    content.commit('statobj', obj)
  },
  ListerMsg (content, obj) {
    content.commit('ListerMsg', obj)
  },
  showComp (content, obj) {
    content.commit('showComp', obj)
  },
  userList (content, obj) {
    content.commit('userList', obj)
  },
  checkAll (content, checkAll) {
    content.commit('checkAll', checkAll)
  },
  checkShow (content, checkShow) {
    content.commit('checkShow', checkShow)
  },
  checkShowSplice (content, checkShowSplice) {
    content.commit('checkShowSplice', checkShowSplice)
  },
  showModal (content, showModal) {
    content.commit('showModal', showModal)
  },
  stanum (content, stanum) {
    content.commit('stanum', stanum)
  },
  // 文件夹信息
  Folder (content, Folder) {
    content.commit('Folder', Folder)
  },
  userTabs (content, userTabs) {
    content.commit('userTabs', userTabs)
  },
  FolderJudgment (content, FolderJudgment) {
    content.commit('FolderJudgment', FolderJudgment)
  },
  moveFolderProject (content, moveFolderProject) {
    content.commit('moveFolderProject', moveFolderProject)
  },
  deleteFolder (content, deleteFolder) {
    content.commit('deleteFolder', deleteFolder)
  },
  deleteFolderMsg (content, deleteFolderMsg) {
    content.commit('deleteFolderMsg', deleteFolderMsg)
  },
  deleteFolderIf (content, deleteFolderIf) {
    content.commit('deleteFolderIf', deleteFolderIf)
  },
  activationIf (content, activationIf) {
    content.commit('activationIf', activationIf)
  },
  activationMsg (content, activationMsg) {
    content.commit('activationMsg', activationMsg)
  },
  settingChange (content, settingChange) {
    content.commit('settingChange', settingChange)
  },
  activeUser (content, activeUser) {
    content.commit('activeUser', activeUser)
  },
  deleteFileSpace (content, deleteFileSpace) {
    content.commit('deleteFileSpace', deleteFileSpace)
  },
  deleteCollaborator (content, deleteCollaborator) {
    content.commit('deleteCollaborator', deleteCollaborator)
  },
  deleteCollaboratorMsg (content, deleteCollaboratorMsg) {
    content.commit('deleteCollaboratorMsg', deleteCollaboratorMsg)
  },
  shareShowChange (content, shareShowChange) {
    content.commit('shareShowChange', shareShowChange)
  },
  ModelFolderInvite (content, ModelFolderInvite) {
    content.commit('ModelFolderInvite', ModelFolderInvite)
  },
  FolderMove (content, FolderMove) {
    content.commit('FolderMove', FolderMove)
  },
  publicProject (content, publicProject) {
    content.commit('publicProject', publicProject)
  },
  editorShow (content, editorShow) {
    content.commit('editorShow', editorShow)
  },
  isRouterReload (content, isRouterReload) {
    content.commit('isRouterReload', isRouterReload)
  },
  updateSendListSelectType (context, type) {
    context.commit('updateSendListSelectType', type)
  },
  updateStailListSelectType (context, type) {
    context.commit('updateStailListSelectType', type)
  },
  resetiFramPage (context, bool) {
    context.commit('resetiFramPage', bool)
  },
  setupCookies (context, uniq) {
    const t = 1000 * 60 * 60 * 3
    setCookie('token', uniq.token, t)
    context.commit('getCookie', uniq.token)
  },
  folderEditType (context, number) {
    context.commit('folderEditType', number)
  },
  pathList (context, list) {
    context.commit('pathList', list)
  }
}
export default actions
