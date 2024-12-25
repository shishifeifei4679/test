<template>
  <div class="platform-horizontal-container">
    <div class="scroll-wrapper">
      <div class="switch-left" v-if="isShow">
        <i class="el-icon-arrow-left"></i>
      </div>
      <el-tabs
        v-model="routerIndex"
        type="card"
        ref="tabs"
        closable
        :class="{ paddingTabs: isShow }"
        @tab-remove="handleDelete(topmenus[$event], $event)"
        @tab-click="handleRouter(topmenus[routerIndex], routerIndex)"
      >
        <el-tab-pane v-for="(item, index) in topmenus" :key="index" :name="index.toString()" v-if="item.moduleMenu == $store.getters.checkedMenuModule">
          <span slot="label" :data-index="index" class="tab-btn" :class="{ hideCloseIcon: hideCloseIcon(item) }" v-contextmenu="(el) => contextmenus(el)"> {{ item.title }}</span>
        </el-tab-pane>
      </el-tabs>
      <div class="switch-right" v-if="isShow">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <!-- <div class="switch-right" @click="handleRight">
      <i class="el-icon-arrow-right"></i>
    </div> -->
  </div>
</template>

<script>
import { getDefaultRouter } from '@/utils/judge'
import qs from 'qs'
import { shareActions } from '@/actions'
import { checkUrl } from '../../api/common'
const sys = require('@/config.js')

export default {
  name: 'topMenu',
  components: {},
  data() {
    return {
      routerIndex: '0',
      isShow: true
    }
  },
  computed: {
    lange() {
      return this.$store.getters.language
    },
    topmenus() {
      this.getRouterIndex()
      return this.$store.getters.topmenus // 需要监听的数据
    },
    defTopmenus() {
      return getDefaultRouter(this.$store.getters.menus)
    },
    hideCloseIcon() {
      return function (item) {
        return item.path === this.$store.getters.homePath || item.path == this.$store.getters.generalHomePath
      }
    }
    // checkedMenuModule() {
    //   return this.$store.getters.checkedMenuModule // list;
    // },
  },
  watch: {
    topmenus: {
      handler(val) {
        this.listenerResize()
      },
      immediate: true,
      deep: true
    }
    // // 监听这个computed属性
    // checkedMenuModule(newVal, oldVal) {
    //   let topMainMenus = sessionStorage.getItem('topMainMenus') ? JSON.parse(sessionStorage.getItem('topMainMenus')) : []
    //   let topMainMenus1 = sessionStorage.getItem('topMainMenus1') ? JSON.parse(sessionStorage.getItem('topMainMenus1')) : []
    //   let topMainMenus2 = sessionStorage.getItem('topMainMenus2') ? JSON.parse(sessionStorage.getItem('topMainMenus2')) : []
    //   let newMenus = []
    //   // 当count变化时，这里的代码会被执行
    //   if (oldVal == 1) {
    //     sessionStorage.setItem('topMainMenus1', JSON.stringify(topMainMenus))
    //   } else if (oldVal == 2) {
    //     sessionStorage.setItem('topMainMenus2', JSON.stringify(topMainMenus))
    //   }

    //   if (newVal == 1) {
    //     newMenus = topMainMenus1
    //   } else if (newVal == 2) {
    //     newMenus = topMainMenus2
    //   }
    //   this.$store.commit("SET_TOPMENUS", newMenus);
    //   // this.changeKeepAlive(newMenus);
    // }
  },
  mounted() {
    window.addEventListener('resize', this.listenerResize, true)
    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.listenerResize)
    })
  },
  methods: {
    getRouterName(item) {
      if (this.lange == 'en') {
        return item.name && $i18n.t('router')[item.name] ? $i18n.t('router')[item.name] : item.title
      } else {
        return item.title
      }
    },
    listenerResize() {
      setTimeout(() => {
        const scrollable = this.$refs.tabs.$refs.nav.scrollable
        this.isShow = scrollable ? false : true
      }, 20)
    },
    contextmenus(el) {
      // 通过el.dataset来获取动态的值
      const list = this.$store.getters.topmenus
      const _this = this
      const index = el.dataset.index
      const defList = [
        {
          text: this.$t('common.closeL'),
          action: () => {
            _this.setTopMenus(1, index)
          },
          icon: 'el-icon-back'
        },
        {
          text: this.$t('common.closeR'),
          icon: 'el-icon-right',
          action: () => {
            _this.setTopMenus(2, index)
          }
        },
        {
          text: this.$t('common.closeO'),
          icon: 'el-icon-close',
          action: () => {
            _this.setTopMenus(3, index)
          }
        },
        {
          text: this.$t('common.closeA'),
          icon: 'el-icon-error',
          action: () => {
            _this.setTopMenus(4, index)
          }
        }
      ]
      const refreshBtn = {
        text: this.$t('common.refreshCurrent'),
        icon: 'el-icon-refresh',
        action: () => {
          _this.refresh(index)
        }
      }
      // 你可以在这里通过 return null 来禁用右键菜单
      // return null
      let result = []
      if (list.length == 1) {
        // 只有一个
        result = [defList[3]]
      } else if (index == 0) {
        result = [defList[1], defList[2], defList[3]]
      } else if (list.length == Number(index) + 1) {
        result = [defList[0], defList[2], defList[3]]
      } else {
        result = defList
      }
      // 当前激活的tab选项卡在topMenu中的位置
      // 只有当前激活的tab选项卡才显示【刷新本页】菜单
      const currentIndex = list.findIndex((item) => item.pathname === window.location.pathname)
      if (index && parseInt(index) === currentIndex) {
        return [...result, refreshBtn]
      }
      return result
    },

    /**
     * @description top menu面包屑页签操作
     * @param {index} 这里包含运营中心、业务中心两个菜单模块的所有 topmenu，其中不属于当前菜单模块的topmenu被隐藏了
     */
    setTopMenus(type, index) {
      // console.log('type, index', type, index)
      const list = JSON.parse(JSON.stringify(this.$store.getters.topmenus))
      const checkedObj = JSON.parse(JSON.stringify(list))[index]
      // console.log('top menu面包屑页签操作11111111', list, type, index, list.slice(index), this.$route, checkedObj, this.$route.path, checkedObj.path)

      if (type == 1) {
        // 关闭左侧
        // 过滤出当前选中节点以及右侧数据  + 当前节点左侧数据中不属于当前菜单模块的需要保留
        const listFilter = []
        list.forEach((item, listIndex) => {
          if (listIndex < index && item.moduleMenu != this.$store.getters.checkedMenuModule) {
            listFilter.push(item)
          } else if (listIndex >= index) {
            listFilter.push(item)
          }
        })

        const data = this.filterIndexPage(listFilter)
        this.$store.commit('SET_TOPMENUS', data)
        this.changeKeepAlive(data)

        // 如果点击时的topmenu也就是index对应的值，不是当前打开的topmenu需要跳转过去
        if (this.$route.path != checkedObj.path) {
          let isHandleRouter = true
          let handleRouterItem = {}
          let handleRouterIndex = {}

          data.forEach((item, newIndex) => {
            if (item.path == this.$route.path) {
              isHandleRouter = false
            }
            if (item.path == checkedObj.path) {
              handleRouterItem = item
              handleRouterIndex = newIndex
            }
          })

          if (isHandleRouter) {
            this.handleRouter(handleRouterItem, handleRouterIndex)
          }
        }
      } else if (type == 2) {
        // 关闭右侧
        // 过滤出当前选中节点以及左侧侧数据  + 当前节点右侧侧数据中不属于当前菜单模块的需要保留
        const listFilter = []
        list.forEach((item, listIndex) => {
          if (listIndex <= index) {
            listFilter.push(item)
          } else if (listIndex > index && item.moduleMenu != this.$store.getters.checkedMenuModule) {
            listFilter.push(item)
          }
        })

        const data = this.filterIndexPage(listFilter)
        this.$store.commit('SET_TOPMENUS', data)
        this.changeKeepAlive(data)

        // 如果点击时的topmenu也就是index对应的值，不是当前打开的topmenu需要跳转过去
        if (this.$route.path != checkedObj.path) {
          let isHandleRouter = true
          let handleRouterItem = {}
          let handleRouterIndex = {}

          data.forEach((item, newIndex) => {
            if (item.path == this.$route.path) {
              isHandleRouter = false
            }
            if (item.path == checkedObj.path) {
              handleRouterItem = item
              handleRouterIndex = newIndex
            }
          })

          if (isHandleRouter) {
            this.handleRouter(handleRouterItem, handleRouterIndex)
          }
        }
      } else if (type == 3) {
        // 关闭其他
        // 过滤出当前选中节点以及不属于当前菜单模块的需要保留
        const listFilter = []
        list.forEach((item, listIndex) => {
          if (listIndex == index || item.moduleMenu != this.$store.getters.checkedMenuModule) {
            listFilter.push(item)
          }
        })

        const data = this.filterIndexPage(listFilter)
        this.$store.commit('SET_TOPMENUS', data)
        this.changeKeepAlive(data)

        // 如果点击时的topmenu也就是index对应的值，不是当前打开的topmenu需要跳转过去
        if (this.$route.path != checkedObj.path) {
          let isHandleRouter = true
          let handleRouterItem = {}
          let handleRouterIndex = {}

          data.forEach((item, newIndex) => {
            if (item.path == this.$route.path) {
              isHandleRouter = false
            }
            if (item.path == checkedObj.path) {
              handleRouterItem = item
              handleRouterIndex = newIndex
            }
          })

          if (isHandleRouter) {
            this.handleRouter(handleRouterItem, handleRouterIndex)
          }
        }
      } else if (type == 4) {
        // 关闭全部
        // 不属于当前菜单模块的需要保留
        const listFilter = []
        list.forEach((item, listIndex) => {
          // console.log('item.moduleMenu != this.$store.getters.checkedMenuModule', item.moduleMenu, this.$store.getters.checkedMenuModule)
          if (item.moduleMenu != this.$store.getters.checkedMenuModule) {
            listFilter.push(item)
          }
        })
        // console.log(111111, listFilter)
        const data = this.filterIndexPage(listFilter)
        // console.log('data22222', data)
        this.$store.commit('SET_TOPMENUS', data)
        this.$store.commit('CLEAR_KEEPALIVE')
        // console.log('data33333', data)
        this.handleRouter(data[0], 0)
      }
    },
    // 刷新本页
    refresh() {
      // platform的直接使用父组件刷新
      const moduleName = window.location.pathname.split('/')
      if (moduleName?.[2] === 'platform') {
        this.$emit('refresh', true)
      } else {
        shareActions.setGlobalState({ ['refreshKey']: new Date().getTime() })
      }
    },
    getRouterIndex() {
      const { meta, query } = this.$route
      if (meta.iframe) {
        const index = this.$store.getters.topmenus.findIndex((item) => item.query.url === query.url)
        this.routerIndex = `${index}`
      } else {
        const index = this.$store.getters.topmenus.findIndex((item) => item.path === this.$route.path)
        this.routerIndex = `${index}`
      }
    },
    handleRouter(item, index) {
      // console.log('item, index------handleRouter', item, index)
      this.routerIndex = `${index}`
      const params = qs.stringify(item.query)
      params ? this.$router.push(`${item.path}?${params}`) : this.$router.push(item.path)
    },

    // 标签右侧关闭、删除
    handleDelete(item, index) {
      // console.log('item, index11111', item, index)

      let menuModuleIndex = 0
      const tomMenuCopy = JSON.parse(JSON.stringify(this.topmenus))
      tomMenuCopy.filter(item => item.moduleMenu == this.$store.getters.checkedMenuModule).forEach((child, childIndex) => {
          if (this.$route.path == child.path) {
            menuModuleIndex = childIndex
          }
      })
      // console.log('item, index------handleDelete', item, index, tomMenuCopy, this.$store.getters.checkedMenuModule, this.topmenus)
      this.$store.commit('SET_DELETE', item.name)
      const currentPath = this.$route.path
      // console.log('currentPath22222', currentPath, item.path, currentPath == item.path)
      this.$store.commit('SET_DELTOPMENUS', item)
      //如果关闭的tab正在使用 关闭时需要跳转他左边的一个,左边没有的话调跳转右边的，左右都没有不做跳转
      if (currentPath == item.path) {
        // console.log('000000',  this.topmenus)
        let menuModuleList = []
        this.topmenus.map((child, childIndex) => {
          if (child.moduleMenu == this.$store.getters.checkedMenuModule) {
            menuModuleList.push(child)
          }
        })

        // console.log('menuModuleList00000000', menuModuleList, menuModuleIndex)
        // menuModuleList.forEach(child => {
        //   if (currentPath == child.path) {
        //     menuModuleIndex = childIndex
        //   }
        // })

        // console.log('menuModuleIndex--menuModuleList121212', menuModuleList, menuModuleIndex)

        // 如果关闭之后没有标签了，就跳转对应的模块首页
        if (menuModuleList.length === 0 || menuModuleIndex == 0) {
          // console.log(11111111111)
          if (this.$store.getters.checkedMenuModule == 1) {
            // 跳对应的首页
            this.$nextTick(() => {
              this.$router.push({
                path: this.$store.getters.homePath,
                query: {}
              })
            })
          } else {
            // 跳对应的首页
            this.$nextTick(() => {
              this.$router.push({
                path: this.$store.getters.generalHomePath,
                query: {}
              })
            })
          }
        } else {

          // if (index == 0) {
          //   const futurepath = this.topmenus[index]
          //   this.handleRouter(futurepath, index)
          // } else {
            // 不是第一个页签。也就是不是首页的话，关闭当前路由之后跳转左面的一个
            const data = menuModuleList[menuModuleIndex - 1]
            // console.log('data2222222222', menuModuleList, menuModuleIndex - 1, data)
            this.handleRouter(data, menuModuleIndex - 1)
          // }
        }
      }
    },
    //清除缓存
    changeKeepAlive(data = []) {
      this.$store.commit('CLEAR_KEEPALIVE')
      data.forEach((item) => {
        const { noAddMenu, noKeepAlive, name } = item
        if (!noAddMenu && !noKeepAlive) this.$store.commit('SET_ALIVE', name) // keepAlive 是否缓存的字段
      })
    },
    filterIndexPage(data = []) {
      const list = this.$store.getters.topmenus
      // console.log('list3333232323', list, data)

      // 运营中心首页
      const homePage = list.find((val) => val.path == this.$store.getters.homePath)
      const isExectHomePage = data.some((val) => val.path == this.$store.getters.homePath)

      // console.log('this.$store.getters.generalHomePath', this.$store.getters.homePath, homePage, isExectHomePage)

      // 业务中心首页
      const generalHomePage = list.find((val) => val.path == this.$store.getters.generalHomePath)
      const isExectGeneralHomePage = data.some((val) => val.path == this.$store.getters.generalHomePath)

      // console.log('isExectGeneralHomePage', this.$store.getters.generalHomePath, isExectGeneralHomePage, generalHomePage)

      let returnList = isExectHomePage ? data : (homePage !== undefined ? [homePage, ...data] : [...data])
      if (!isExectGeneralHomePage && generalHomePage !== undefined) {
        returnList.unshift(generalHomePage)
      }

      // console.log('returnList1212121212', returnList)

      return returnList
    }
  }
}
</script>
<style lang="scss" scoped>
$height: 52px;
.platform-horizontal-container {
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;

  .switch-left,
  .switch-right {
    width: 20px;
    height: $height;
    line-height: $height;
    box-sizing: border-box;
    font-size: 15px;
    color: #8c8c8c;
    cursor: pointer;
    position: absolute;
    z-index: 3;
  }
  .switch-left {
    left: 0px;
  }
  .switch-right {
    top: 0;
    right: 0px;
  }
  .scroll-wrapper {
    position: relative;
    width: 100%;
    height: $height;
    overflow: hidden;
  }
  .paddingTabs {
    padding: 0 20px;
    box-sizing: border-box;
  }
  .tab-btn::before {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 4px;
  }
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item,
  /deep/.el-tabs--card > .el-tabs__header,
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav,
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item .is-active {
    border: none;
  }
  /deep/.el-tabs__nav {
    z-index: 0;
  }
  /deep/ .el-tabs__header {
    margin: 0;
    border: 0;
  }
  /deep/ .el-tabs {
    margin-top: 10px;
  }
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
    background: #fff;
    padding: 0px 20px;
    border: 1px solid #ffffff;
    margin: 0 2.5px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #333333;
    position: relative;
    vertical-align: middle;
    overflow: hidden;
    box-shadow: none;
  }
  /deep/ .el-tabs--card > .el-tabs__header .is-active {
    color: $header-bkColor-hover;
    padding: 0px 20px !important;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid $header-bkColor-hover;
  }
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item:hover {
    color: $header-bkColor-hover;
    padding: 0px 20px;
  }

  /deep/.el-tabs__nav-next,
  /deep/.el-tabs__nav-prev {
    position: absolute;
    cursor: pointer;
    line-height: 32px;
    color: #8c8c8c;
  }
  /deep/ .el-tabs__content {
    display: none;
  }
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item .el-icon-close {
    width: 14px;
    height: 14px;
  }
}
</style>
<style>
.platform-horizontal-container .hideCloseIcon + .el-icon-close {
  display: none;
}
</style>
