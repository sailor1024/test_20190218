const mutations = {
  changeName (state, name) {
    state.name = name
  },
  // 弹框信息函数
  popTo (state, popTo) {
    state.popTo = popTo
  },
  shareTo (state, shareTo) {
    state.shareTo = shareTo
  },
  stainumTo (state, stainumTo) {
    state.stainumTo = stainumTo
  },
  createTo (state, createTo) {
    state.createTo = createTo
  },
  showEditorTo (state, showEditorTo) {
    state.showEditorTo = showEditorTo
  },
  showCreateTo (state, showCreateTo) {
    state.showCreateTo = showCreateTo
  },
  showMoveCreateTo (state, showMoveCreateTo) {
    state.showMoveCreateTo = showMoveCreateTo
  },
  FolderRenameTo (state, FolderRenameTo) {
    state.FolderRenameTo = FolderRenameTo
  },
  FolderRename (state, FolderRename) {
    state.FolderRename = FolderRename
  },
  userInfo (state, obj) {
    localStorage.setItem('userInfo', JSON.stringify(obj))
    state.userInfo = obj
  },
  json (state, obj) {
    state.json = obj
  },
  ListerMsg (state, obj) {
    state.ListerMsg = obj
  },
  showComp (state, obj) {
    state.showComp = obj
  },
  statobj (state, obj) {
    state.statobj = obj
  },
  // 全选
  checkAll (state, checkAll) {
    state.checkAll = checkAll
  },
  checkShow (state, checkShow) {
    state.checkShow.push(checkShow)
  },
  checkShowSplice (state, checkShowSplice) {
    state.checkShow.splice(checkShowSplice, 1)
  },
  checkShowSpace (state) {
    state.checkShow = []
  },
  //  列表页模态框
  showModal (state, showModal) {
    state.showModal = showModal
  },
  stanum (state, stanum) {
    state.stanum = stanum
  },
  // 文件夹信息
  Folder (state, Folder) {
    state.Folder = Folder
  },
  userTabs (state, userTabs) {
    state.userTabs = userTabs
  },
  FolderJudgment (state, FolderJudgment) {
    state.FolderJudgment = FolderJudgment
  },
  moveFolderProject (state, moveFolderProject) {
    state.moveFolderProject = moveFolderProject
  },
  deleteFolder (state, deleteFolder) {
    state.deleteFolder = deleteFolder
  },
  deleteFolderMsg (state, deleteFolderMsg) {
    state.deleteFolderMsg = deleteFolderMsg
  },
  deleteFolderIf (state, deleteFolderIf) {
    state.deleteFolderIf = deleteFolderIf
  },
  activationIf (state, activationIf) {
    state.activationIf = activationIf
  },
  activationMsg (state, activationMsg) {
    state.activationMsg = activationMsg
  },
  settingChange (state, settingChange) {
    state.settingChange = settingChange
  },
  activeUser (state, activeUser) {
    state.activeUser = activeUser
  },
  deleteFileSpace (state, deleteFileSpace) {
    state.deleteFileSpace = deleteFileSpace
  },
  deleteCollaborator (state, deleteCollaborator) {
    state.deleteCollaborator = deleteCollaborator
  },
  deleteCollaboratorMsg (state, deleteCollaboratorMsg) {
    state.deleteCollaboratorMsg = deleteCollaboratorMsg
  },
  shareShowChange (state, shareShowChange) {
    state.shareShowChange = shareShowChange
  },
  ModelFolderInvite (state, ModelFolderInvite) {
    state.ModelFolderInvite = ModelFolderInvite
  },
  FolderMove (state, FolderMove) {
    state.FolderMove = FolderMove
  },
  publicProject (state, publicProject) {
    state.publicProject = publicProject
  },
  editorShow (state, editorShow) {
    state.editorShow = editorShow
  },
  isRouterReload (state, isRouterReload) {
    state.isRouterReload = isRouterReload
  },
  updateSendListSelectType (state, type) {
    state.sendList.selectType = type
  },
  updateStailListSelectType (state, type) {
    state.stailList.selectType = type
  },
  resetiFramPage (state, bool) {
    state.isResetIframCom = bool
  },
  getCookie (state, str) {
    state.token = str
  },
  folderEditType (state, number) {
    state.folderEditType = number
  },
  pathList (state, list) {
    state.pathList = list
  }
}
export default mutations
