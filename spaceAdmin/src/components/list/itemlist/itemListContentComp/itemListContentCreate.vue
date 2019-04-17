<template>
  <kangyun-modal
    :modalWidth="620"
    @submit="confirm"
    @closeModal="popClose">
    <!-- <template slot="title">
      <span v-if="MoveProjectMsg.dir_name">移动文件夹</span>
      <span v-else>多个文件移动</span>
    </template>
    <template slot="detail">
      <p v-if="MoveProjectMsg.title">{{MoveProjectMsg.title}}</p>
      <p v-if="!MoveProjectMsg.title && FolderItems.length">移动{{FolderItems.length}}个文件夹</p>
      <p v-if="!MoveProjectMsg.title && projectItems.length">移动{{projectItems.length}}个项目</p>
      <p v-if="MoveProjectMsg.title">Created {{EditorCreate.addtime}}<a href="">{{EditorCreate.niname}}</a></p>
      <div class="Folder">
        <Tree
          :empty-text="treeText"
          :data="baseData"
          @on-select-change="choose"
          :render="renderContent"></Tree>
      </div>
    </template> -->
    <div class="move__box">
      <div class="box__title">
        <span v-if="MoveProjectMsg.dir_name">移动文件夹</span>
        <span v-else>多个文件移动</span>
      </div>
      <div class="box__content">
        <p class="box__tip" v-if="MoveProjectMsg.title">{{MoveProjectMsg.title}}</p>
        <span class="box__tip" v-if="!MoveProjectMsg.title && FolderItems.length">移动{{FolderItems.length}}个文件夹</span>
        <span class="box__tip" v-if="!MoveProjectMsg.title && projectItems.length">移动{{projectItems.length}}个项目</span>
        <!-- <p class="box__tip" v-if="MoveProjectMsg.title">Created {{EditorCreate.addtime}}<a href="">{{EditorCreate.niname}}</a></p> -->
        <div class="box__tree">
          <Tree
          :empty-text="treeText"
          :data="baseData"
          @on-select-change="choose"
          :render="renderContent"></Tree>
        </div>
      </div>
      <!-- comfrim -->
      <div class="box__btn">
          <button v-focus class="c-button c-button__default" @click="popClose">取消</button>
          <button class="c-button c-button__primary" @click="confirm">确定</button>
      </div>
    </div>
  </kangyun-modal>
</template>

<script>
import kangyunModal from '@/components/common/modal/kangyunModal'
export default {
  name: 'createProject',
  data () {
    return {
      baseData: [],
      // MoveProjectMsg: this.EditorCreate ? this.EditorCreate : this.checkShowChange,
      MoveProjectMsg: this.EditorCreate,
      // 建设用户选中的文件夹信息
      chooseFolder: {},
      treeText: ''
    }
  },
  // props: ['EditorCreate', 'checkShowChange', 'FolderItems', 'projectItems'],
  props: {
    EditorCreate: {
      type: Object,
      default: () => (
        {
          title: ''
        }
      )
    },
    checkShowChange: Boolean,
    FolderItems: {
      type: Array,
      default: () => []
    },
    projectItems: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    isBtnDisabled () {
      return !this.chooseFolder.id
    }
  },
  components: {kangyunModal},
  created () {
    // let json = this.$store.state.moveFolderProject
    // let children = []
    // 设置当前显示的文件夹信息
    /* for (let i = 0; i < json.length; i++) {
      if (!json[i].children) {
        children.push({
          expand: false,
          title: json[i].name,
          // 自定义文件夹id属性
          id: json[i].id,
          children: []
        })
      } else {
        let arr = []
        for (let y = 0; y < json[i].children.length; y++) {
          arr.push({
            title: json[i].children[y][0].name,
            id: json[i].children[y][0].id
          })
        }
        children.push({
          expand: false,
          title: json[i].name,
          // 自定义文件夹id属性
          id: json[i].id,
          children: arr
        })
      }
      this.baseData = children
    } */
    this.loadFileTree()
  },
  methods: {
    // 选择树形控件值
    choose: function (data) {
      // 获取选中的文件夹id
      this.chooseFolder = data
    },
    popClose: function () {
      // this.$store.dispatch('showCreateTo', false)
      // this.$store.dispatch('showMoveCreateTo', false)
      this.$emit('changeShowContentCreate', false)
    },
    loadFileTree () {
      this.treeText = '加载文件夹中...'
      this.$http.post('index2/file/get_dir_list', {
        user_type: this.$store.state.userInfo.user_type,
        company_id: this.$store.state.userInfo.company_id,
        user_id: this.$store.state.userInfo.id
      }).then(res => {
        const temObj = {}
        const result = []
        const resArr = res.data.data
        resArr.push({path: '/', name: '所有项目', id: '0', pid: '-1'})
        resArr.forEach(item => {
          const id = item.id
          item.title = item.name
          item.selected = false
          item.expand = false
          temObj[id] = item
        })

        const temFileArr = this.FolderItems.map(element => {
          return element.id
        })

        for (let i = 0; i < resArr.length; i++) {
          const pid = resArr[i].pid
          // 文件夹移动，本身不显示
          if (temFileArr.indexOf(resArr[i].id) > -1) {
            continue
          }
          // 选中当前文件夹
          if (localStorage.getItem('FolderJsonOnce') === String(resArr[i].id)) {
            resArr[i].expand = true
            resArr[i].selected = true
            this.choose(resArr[i])
          }
          // 组织成树状
          if (temObj[pid]) {
            if (!temObj[pid].children) {
              temObj[pid].children = []
            }
            temObj[pid].children.push(resArr[i])
          } else {
            result.push(resArr[i])
          }
        }
        this.baseData = result
        if (!this.baseData.length) {
          this.treeText = '暂无可选择文件夹'
        }
      })
    },
    renderContent (h, {root, node, data}) {
      const DomO = h('span', {
        class: {
          'ivu-tree-title-selected': data.selected
        },
        style: {
          display: 'inline-block'
        },
        on: {
          click: () => {
            root.forEach(element => {
              element.node.selected = false
            })
            data.selected = true
            this.choose(data)
          }
        }
      }, [
        h('span', [
          h('Icon', {
            props: {
              type: 'ios-folder-outline'
            },
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.title)
        ])
      ])

      return DomO
    },
    confirm () {
      const folderArr = this.FolderItems.map(element => {
        return element.id
      })
      const projectArr = this.projectItems.map(element => {
        return element.id
      })
      const _this = this
      async function a () {
        if (projectArr.length) {
          const res1 = await _this.$http.post('index2/items/mv_items', {
            dir_id: _this.chooseFolder.id,
            id: JSON.stringify(projectArr)
          })
          if (res1.data.code !== 200) {
            _this.$Message.error('移动项目' + res1.data.message)
            return
          }
        }
        if (folderArr.length) {
          const res2 = await _this.$http.post('index2/file/movedir', {
            dir_id: _this.chooseFolder.id,
            id: JSON.stringify(folderArr)
          })
          if (res2.data.code !== 200) {
            _this.$Message.error('移动文件夹' + res2.data.message)
          } else {
            _this.$Message.success('移动成功')
          }
        }
        _this.popClose()
        // 路由刷新
        _this.$store.dispatch('isRouterReload', true)
      }
      a()
    }
  }
}
</script>

<style lang="scss" scoped>
.move__box {
  padding: 24px 32px 0 25px;
  .box__title {
    font-size: 26px;
    color: #666666;
    font-weight: bold;
  }
  .box__tip {
    display: inline-block;
    color: #666666;
    font-size: 18px;
    margin-top: 33px;
  }
  .box__tree {
    height: 395px;
    overflow: auto;
    margin-bottom: 46px;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background-color: #00A1FF;
    }
  }
  .box__btn {
    text-align: center;
    padding-bottom: 24px;
  }

  & /deep/ .ivu-tree-children {
    font-size: 14px;
  }
  & /deep/ .ivu-icon-ios-folder-outline {
    margin-right: 13px !important;
  }
  & /deep/ .ivu-tree ul li {
    margin-top: 32px;
    cursor: default;
  }
  & /deep/ .ivu-tree-empty {
    padding-top: 10px;
  }
}

</style>
