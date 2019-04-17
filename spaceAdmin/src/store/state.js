const state = {
  name: 'hello vue',
  popTo: false,
  shareTo: false,
  createTo: false,
  stainumTo: false,
  showEditorTo: false,
  // 创建文件夹判断
  showCreateTo: false,
  showMoveCreateTo: false,
  // 文件夹重命名判断
  FolderRenameTo: false,
  // 文件夹重命名信息
  FolderRename: [],
  spaceReside: {},
  // 临时存的项目列表数组
  Lister: [],
  ListerMsg: '',
  // setting
  showComp: true,
  userInfo: {
    id: '',
    lastname: '',
    firstname: '',
    username: '',
    email: '',
    niname: ''
  }, // 用户信息
  json: {
    title: '',
    description: '',
    url: '',
    location: '',
    niname: '',
    create_time: '',
    update_time: '',
    id: ''
  }, // 项目详情信息
  statobj: {
    looknum: 0,
    lookplay: 0,
    lookuser: 0,
    list: []
  },
  checkAll: false, // 全选
  checkShow: [], // 单选显示移动
  showModal: false, // 列表页模态框
  stanum: 1,
  // 文件夹信息
  Folder: {},
  // 协作者tabs
  userTabs: 0,
  // 创建文件夹检测
  FolderJudgment: false,
  // 移动项目文件夹信息
  moveFolderProject: '',
  // 删除文件夹信息
  deleteFolder: false,
  // 被删除的文件夹信息
  deleteFolderMsg: [],
  // 文件夹删除确认信息
  deleteFolderIf: false,
  // 激活用户判断信息
  activationIf: false,
  activationMsg: '',
  // 选项切换
  settingChange: 0,
  // 活跃用户数量
  activeUser: '',
  // 删除空间
  deleteFileSpace: '',
  // 删除合作者
  deleteCollaborator: false,
  // 删除合作者信息
  deleteCollaboratorMsg: '',
  // 项目公开后刷新当前状态(私密)
  shareShowChange: 0,
  // 文件夹邀请功能
  ModelFolderInvite: '',
  // 文件夹移动
  FolderMove: '',
  // 刷新公共空间项目
  publicProject: '',
  // 编辑区弹出指示
  editorShow: false,
  // 重载路由
  isRouterReload: false,
  sendList: {
    selectType: 'time'
  },
  stailList: {
    selectType: 'time'
  },
  // 是否刷新IFrame组件
  isResetIframCom: false,
  token: '',
  folderEditType: null,
  pathList: []
}
export default state
