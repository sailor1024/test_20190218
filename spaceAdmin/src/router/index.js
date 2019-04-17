import Vue from 'vue'
import Router from 'vue-router'
import echarts from './echarts'
import {getCookie} from '@/utils/utils'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/account',
      component: function (resolve) {
        require.ensure([], function () {
          resolve(require('@/components/account/account'))
        })
      },
      children: [
        {
          path: '/',
          name: 'accountDef',
          component: function (resolve) {
            require.ensure([], function () {
              resolve(require('@/components/account/accountLogin/accountLoginNew'))
            })
          }
        },
        {
          path: '/account/login',
          name: 'accountLogin',
          component: function (resolve) {
            require.ensure([], function () {
              resolve(require('@/components/account/accountLogin/accountLoginNew'))
            })
          }
        },
        {
          path: '/account/accountFinsh',
          name: 'accountFinsh',
          component: function (resolve) {
            require.ensure([], function () {
              resolve(require('@/components/account/accountRegister/accountFinsh'))
            })
          }
        },
        {
          path: '/account/loginExists',
          name: 'accountExists',
          component: function (resolve) {
            require.ensure([], function () {
              resolve(require('@/components/account/accountLogin/accountLoginExists'))
            })
          }
        },
        {
          path: '/account/select',
          name: 'accountSelect',
          component: function (resolve) {
            require.ensure([], function () {
              resolve(require('@/components/account/accountSelect/accountSelect'))
            })
          }
        },
        {
          path: '/account/findStep1',
          name: 'accountFindStep1',
          component: function (resolve) {
            require.ensure([], function () {
              resolve(require('@/components/account/accountFind/accountFindStep1'))
            })
          }
        },
        {
          path: '/account/findStep2',
          name: 'accountFindStep2',
          component: function (resolve) {
            require.ensure([], function () {
              resolve(require('@/components/account/accountFind/accountFindStep2'))
            })
          }
        },
        {
          path: '/account/register',
          name: 'accountRegister',
          component: function (resolve) {
            require.ensure([], function () {
              resolve(require('@/components/account/accountRegister/accountRegister'))
            })
          }
        },
        {
          path: '/account/registration',
          name: 'accountRegistration',
          component: function (resolve) {
            require.ensure([], function () {
              resolve(require('@/components/registration/registration'))
            })
          }
        }
      ]
    },
    {
      path: '',
      name: 'listConponent',
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('@/components/list/listConponent'))
        })
      },
      children: [
        {
          path: '/',
          name: 'main',
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('@/components/list/itemlist/ItemList'))
            })
          }
        },
        {
          path: '/userlist',
          name: 'user-list',
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('@/components/userlist/userlist'))
            })
          }
        },
        {
          path: '/userMsg',
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('@/components/userlist/userMsg'))
            })
          }
        },
        {
          path: '/stailist',
          name: 'stai-list',
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('@/components/stailist/stailist'))
            })
          }
        },
        {
          path: '/sendlist',
          name: 'send-list',
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('@/components/sendlist/sendlist'))
            })
          }
        },
        {
          path: '/folder/:id',
          name: 'folder',
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('@/components/list/itemlist/itemListContentComp/itemListFolderContent'))
            })
          }
        },
        {
          path: '/itemSearch',
          name: 'search',
          props: true,
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('@/components/list/itemlist/ItemSearch'))
            })
          }
        }
      ]
    },
    {
      path: '/setting',
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('@/components/sendlist/setting'))
        })
      }
    },
    {
      path: '/home',
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('@/components/Home'))
        })
      },
      children: [
        {
          path: '',
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('@/components/content/tabone/taboneConponent'))
            })
          },
          children: [
            {
              path: '',
              name: 'tabone',
              component: function (resolve) {
                require.ensure([], function (require) {
                  resolve(require('@/components/content/tabone/view/frameConponent'))
                })
              }
            },
            {
              path: 'image',
              name: 'tabone',
              component: function (resolve) {
                require.ensure([], function (require) {
                  resolve(require('@/components/content/tabone/view/imageConponent'))
                })
              }
            },
            {
              path: 'video',
              name: 'tabone',
              component: function (resolve) {
                require.ensure([], function (require) {
                  resolve(require('@/components/content/tabone/view/videoConponent'))
                })
              }
            },
            {
              path: 'view',
              name: 'tabone',
              component: function (resolve) {
                require.ensure([], function (require) {
                  resolve(require('@/components/content/tabone/view/viewConponent'))
                })
              }
            },
            {
              path: 'download',
              name: 'tabone',
              component: function (resolve) {
                require.ensure([], function (require) {
                  resolve(require('@/components/content/tabone/view/downloadConponent'))
                })
              }
            }
          ]
        },
        {
          path: '/tabtwo',
          name: 'tabtwo',
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('@/components/content/tabtwo/tabtwoConponent'))
            })
          }
        },
        {
          path: '/tabthr',
          name: 'tabthr',
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('@/components/content/tabthr/tabthrConponent'))
            })
          }
        },
        {
          path: '/tabfou',
          name: 'tabfou',
          component: function (resolve) {
            require.ensure([], function (require) {
              resolve(require('@/components/content/tabfou/tabfouConponent'))
            })
          }
        }
      ]
    },
    // 空页面
    {
      path: '/embed',
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('@/components/embed'))
        })
      }
    },
    {
      path: '/embedBack',
      component: function (resolve) {
        require.ensure([], function (require) {
          resolve(require('@/components/embedBack'))
        })
      }
    },
    ...echarts
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/account/registration' || to.path === '/account' || to.path === '/account/register' || to.path === '/account/loginExists' || to.path === '/account/select' || to.path === '/account/login' || to.path === '/account/findStep1' || to.path === '/account/findStep2' || to.path === '/account/accountFinsh') {
    next()
  } else {
    // let userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (getCookie('token')) {
    // if (userInfo) {
      next()
    } else {
      next({ path: '/account' })
    }
  }
})

export default router
