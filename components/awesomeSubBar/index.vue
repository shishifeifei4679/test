<template>
  <div class="containerBag">
    <div class="main-pack">
      <div class="platform-left" style="position: relative; overflow: hidden" :class="!isShowTopMenu ? 'platform-left-k' : 'platform-left-b'">
        <WaterMask
          v-if="sysData.resourceId == '-10'"
          :opacity="(sysData.alpha || 10) / 100"
          :align="getAlign(sysData.watermarkType)"
          :fontSize="`${sysData.fontSize}px`"
          :fontColor="sysData.color"
          class="width-100 h-100 left-water"
          packW="800px"
          :size="sysData.size"
          :value="[sysData.watermarkImage || '', sysData.wordContent || '']"
        ></WaterMask>
        <!-- 子系统菜单，如MES、WMS -->
        <div class="left-menu">
          <div class="left-icon" :style="{ width: $store.getters.checkedMenuModule == 1 ? '0' : '48px' }">
            <div class="menusList">
              <!-- 999{{ indexActive }} -->
              <div class="common" @click="handleJump(item, index)" :key="index" v-for="(item, index) in menus">
                <div
                  class="item"
                  :class="indexActive == index ? 'active' : ''"
                  :style="{
                    filter: !!!$store.getters.factoryCode && item.sysCode !== 'platform' ? 'grayscale(100%)' : ''
                  }"
                >
                  <el-image class="hover" style="width: 20px; height: 20px" :src="URL(item.icon, '_h')" fit="contain">
                    <div slot="error" class="image-slot" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                  <!--     class="def" -->
                  <el-image class="def" style="width: 20px; height: 20px" :src="URL(item.icon)" fit="contain">
                    <div slot="error" class="image-slot" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                  <p class="b-p" :title="item.shortName">
                    {{ item.shortName }}
                  </p>
                </div>
              </div>

              <div v-if="$store.getters.checkedMenuModule == 2" class="item icon-bk" @click="showTopMenu()">
                <img :class="!isShowTopMenu ? 'left' : 'right'" style="width: 20px; height: 20px" :src="require('@/assets/menu/left.png')" alt="" />
              </div>
            </div>
          </div>
        </div>
        <el-scrollbar class="scrollbar" :class="isShowTopMenu ? 'show-menu-none' : 'show-menu-b'" :style="{ 'min-width': $store.getters.checkedMenuModule == 1 ? '185px' : '0' }">
          <!-- <transition name="el-fade-in">
            <SearchMenu
              style="width: 120px; margin: 0 auto 5px;"
              v-if="$store.getters.isShowTopMenu"
            />
          </transition> -->

          <div class="show-menu" :style="{ 'min-width': $store.getters.checkedMenuModule == 1 ? '185px' : '0' }">
            <!-- <img
              class="recommend"
              :src="recommend"
              alt=""
              v-if="likeList.length != 0"
            /> -->

            <div class="left-top">
              <p>{{ twoTitle }}</p>
            </div>
            <!-- <menuItem
              v-for="menu in likeList"
              :key="menu.id"
              :menu="menu"
              class="likeMenu"
            >
            </menuItem> -->
            <menuItem v-for="menu in $store.getters.leftMenus" :key="menu.id" :menu="menu"> </menuItem>
          </div>
        </el-scrollbar>
      </div>
      <!-- :style="{ '--bkColor': bkColor }" -->
      <div class="platform-right" :class="isShowTopMenu ? 'platform-right-k ' : ''">
        <div class="fun-content">
          <topMenu @refresh="handleRefresh" />
          <WaterMask
            v-if="funData.resourceId"
            :opacity="(funData.alpha || 10) / 100"
            :align="getAlign(funData.watermarkType)"
            :fontSize="`${funData.fontSize}px`"
            :fontColor="funData.color"
            class="fun-waterMask"
            :size="funData.size||'default'"
            :packW="!isShowTopMenu ? 'calc(100vw - 137px)' : 'calc(100vw - 48px)'"
            :value="[funData.watermarkImage || '', funData.wordContent || '']"
          ></WaterMask>
          <el-scrollbar class="scrollbar-main" id="scrollbar-main" :key="key">
            <div class="platform-page" v-if="!showPage" :style="{ padding: noPadding10.includes($route.path) ? '0' : '10px' }">
              <div id="main-container" style="height: 100%"></div>
              <vue-page-transition name="fade-in-left">
                <keep-alive :include="$store.getters.keepAlive">
                  <router-view ref="sysPage" id="appPage" />
                </keep-alive>
              </vue-page-transition>
            </div>
            <div class="page" v-for="item in filterIfameList" :key="item.path" v-show="showIframe(item)">
              <iframe :src="getUrl(item)" name="topFrame" scrolling="auto" frameborder="0" class="topFrame"></iframe>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import menuItem from './menuItem'
import topMenu from './topMenu.vue'
import { resourceCommonly } from '@/api/login'
import { watermarkConfig } from '@/api/common.js'
const recommend = require('@/assets/images/recommend.png')
import iframes from '@/router/iframe'
import SearchMenu from '@/components/searchMenu/index'
import WaterMask from '@/components/waterMask'
// 水印的配置信息,只读
let WATERMAKDATA = {
  resourceRouteMap: {},
  watermarkList: [],
  systemWatermarkId: ''
}

export default {
  name: 'awesomeSubBar',
  components: {
    menuItem,
    topMenu,
    SearchMenu,
    WaterMask
  },
  data() {
    return {
      // bkColor: "#ffffff",
      likeList: [],
      recommend,
      // iframes,
      // isShowTopMenu,
      itemList: {},
      key: new Date().getTime(),
      // 系统级别水印
      sysData: {
        alpha: 10,
        watermarkType: '',
        fontSize: 12,
        color: '',
        watermarkImage: '',
        wordContent: ''
      },
      funData: {
        alpha: 10,
        watermarkType: '',
        fontSize: 12,
        color: '',
        watermarkImage: '',
        wordContent: ''
      },
      noPadding10: ['/component/general/index'] // 某些特殊页面不需要padding: 0 15px
    }
  },
  watch: {
    $route: {
      handler(val, old) {
        let { path } = val
        this.setwatermarkConfig(path, false)
      },
      deep: true
      // immediate: true,
    },
    // // 监听这个computed属性
    // checkedMenuModule(newVal, oldVal) {
    //   // 更新本地菜单模块缓存信息
    //   const moduleMenuInfo = sessionStorage.getItem('moduleMenuInfo') ? JSON.parse(sessionStorage.getItem('moduleMenuInfo')) : {}
    //   // 更新切换之前的原始路由地址path
    //   if (oldVal == 1) {
    //     moduleMenuInfo.module1TopMenuPath = this.$route.path
    //     moduleMenuInfo.module1TopMenuQuery = this.$route.query || {}
    //   } else if (oldVal == 2) {
    //     moduleMenuInfo.module2TopMenuPath = this.$route.path
    //     moduleMenuInfo.module2TopMenuQuery = this.$route.query
    //   }
    //   sessionStorage.setItem('moduleMenuInfo', JSON.stringify(moduleMenuInfo))
    // },
    menus(newVal, oldVal) {
      // 更新本地菜单模块缓存信息
      const moduleMenuInfo = sessionStorage.getItem('moduleMenuInfo') ? JSON.parse(sessionStorage.getItem('moduleMenuInfo')) : {}

      // 菜单变更之后，刷新点击效果，默认点击 当前模块的第一条
      // 切换菜单运营中心、业务中心模块后，topmenu的选中效果丢了，需要模拟点击
      if (this.$store.getters.checkedMenuModule == 1) {
        if (moduleMenuInfo.module1LeftMenuId) {
          // 当count变化时，这里的代码会被执行
          const list = JSON.parse(JSON.stringify(this.$store.getters.menus)).filter((item) => moduleMenuInfo.module1LeftMenuId == item.id)
          if (list && list.length > 0) {
            this.handleJump(list[0], moduleMenuInfo.module1LeftMenuIndex)
          } else {
            // 当count变化时，这里的代码会被执行 '1711684738028445698' == item.id
            const list2 = JSON.parse(JSON.stringify(this.$store.getters.menus)).filter((item) => item.sysCode == 'platform')
            if (list2 && list2.length > 0) {
              this.handleJump(list[0], 0)
            }
          }

          // 跳上次记录页面
          this.$nextTick(() => {
            this.$router.push({
              path: moduleMenuInfo.module1TopMenuPath,
              query: moduleMenuInfo.module1TopMenuQuery
            })
          })
        } else {
          // 当count变化时，这里的代码会被执行
          const list = JSON.parse(JSON.stringify(this.$store.getters.menus)).filter((item) => this.$store.getters.checkedMenuModule == item.menuModule)
          if (list && list.length > 0) {
            this.handleJump(list[0], 0)
          }

          if (this.$route.path != this.$store.getters.homePath) {
            // 跳对应的工作台首页
            this.$nextTick(() => {
              this.$router.push({
                path: this.$store.getters.homePath,
                query: {}
              })
            })
          }
        }
      } else if (this.$store.getters.checkedMenuModule == 2) {
        if (moduleMenuInfo.module2LeftMenuId) {
          // 当count变化时，这里的代码会被执行
          const list = JSON.parse(JSON.stringify(this.$store.getters.menus)).filter((item) => moduleMenuInfo.module2LeftMenuId == item.id)
          if (list && list.length > 0) {
            this.handleJump(list[0], moduleMenuInfo.module2LeftMenuIndex)
          } else {
            // 当count变化时，这里的代码会被执行 '1711684738028445698' == item.id
            const list2 = JSON.parse(JSON.stringify(this.$store.getters.menus)).filter((item) => item.sysCode != 'platform')
            if (list2 && list2.length > 0) {
              this.handleJump(list[0], 0)
            }
          }

          // 跳上次记录页面
          this.$nextTick(() => {
            this.$router.push({
              path: moduleMenuInfo.module2TopMenuPath,
              query: moduleMenuInfo.module2TopMenuQuery
            })
          })
        } else {
          // 当count变化时，这里的代码会被执行
          const list = JSON.parse(JSON.stringify(this.$store.getters.menus)).filter((item) => item.sysCode != 'platform')
          if (list && list.length > 0) {
            this.handleJump(list[0], 0)
          }

          if (this.$route.path != this.$store.getters.generalHomePath) {
            // 跳对应的工作台首页
            this.$nextTick(() => {
              this.$router.push({
                path: this.$store.getters.generalHomePath,
                query: {}
              })
            })
          }
        }
      }
    }
  },
  computed: {
    indexActive() {
      return this.$store.getters.indexActive
    },
    isShowTopMenu() {
      // 未分配工厂，业务中心不显示菜单，只显示系统(MES、WMS等)，运营中心正常显示
      if (!this.$store.getters.factoryCode && this.$store.getters.checkedMenuModule === 2) {
        return true
      }
      return this.$store.getters.isShowTopMenu
    },

    twoTitle() {
      return this.$store.getters.twoTitle.name || ''
    },
    filterIfameList() {
      const topmenus = this.$store.getters.topmenus
      const flattenRoutes = this.$store.getters.routersFolt
      const iframeRoutes = flattenRoutes.filter((item) => item.frame === 1 && item.openType === '0' && item.type === 'C' && /^(https?:\/\/)/.test(item.path.trim()))
      const filterIfameList = iframeRoutes.filter((item) =>
        topmenus.some((val) => {
          return val.path == item.component
        })
      )
      return filterIfameList
    },
    menus() {
      const list = JSON.parse(JSON.stringify(this.$store.getters.menus)).filter((item) => this.$store.getters.checkedMenuModule == item.menuModule)
      return list // this.$store.getters.menus
    },
    showIframe() {
      return function (item) {
        if (!item) return false
        const path = this.$route.path
        return item.component === path
      }
    },
    getUrl() {
      return function (item) {
        const url = item.path
        const token = this.$store.getters.token
        const pathUrl = url.includes('?') ? `${url}&token=${token}` : `${url}?token=${token}`
        return pathUrl
      }
    },
    showPage() {
      const path = this.$route.path
      return this.filterIfameList.some((val) => val.component == path)
    },
    // checkedMenuModule() {
    //   return this.$store.getters.checkedMenuModule // list;
    // }
  },
  created() {
    // this.resourceCommonly();
    this.watermarkConfig(() => {
      let { path } = this.$route
      this.setwatermarkConfig(path)
    })

    // 渲染左侧边菜单，刷新页面时会走这部分逻辑，登录、点击走上面监听
    const moduleMenuInfo = sessionStorage.getItem('moduleMenuInfo') ? JSON.parse(sessionStorage.getItem('moduleMenuInfo')) : {}
    const checkedMenuModule = sessionStorage.getItem('checkedMenuModule') ? sessionStorage.getItem('checkedMenuModule') : 1
    if (checkedMenuModule == 1) {
      if (moduleMenuInfo.module1LeftMenuId) {
        // 当count变化时，这里的代码会被执行
        const list = JSON.parse(JSON.stringify(this.$store.getters.menus)).filter((item) => moduleMenuInfo.module1LeftMenuId == item.id)
        if (list && list.length > 0) {
          this.handleJump(list[0], moduleMenuInfo.module1LeftMenuIndex)
        }

        // // 跳上次记录页面
        // this.$nextTick(() => {
        //   this.$router.push({
        //     path: moduleMenuInfo.module1TopMenuPath,
        //     query: moduleMenuInfo.module1TopMenuQuery
        //   })
        // })
      } else {
        // 当count变化时，这里的代码会被执行
        const list = JSON.parse(JSON.stringify(this.$store.getters.menus)).filter((item) => this.$store.getters.checkedMenuModule == item.menuModule)
        this.handleJump(list[0], 0)

        // if (this.$route.path != this.$store.getters.homePath) {
        //   // 跳对应的工作台首页
        //   this.$nextTick(() => {
        //     this.$router.push({
        //       path: this.$store.getters.homePath,
        //       query: {}
        //     })
        //   })
        // }
      }
    } else if (checkedMenuModule == 2) {
      if (moduleMenuInfo.module2LeftMenuId) {
        // 当count变化时，这里的代码会被执行
        const list = JSON.parse(JSON.stringify(this.$store.getters.menus)).filter((item) => moduleMenuInfo.module2LeftMenuId == item.id)
        if (list && list.length > 0) {
          this.handleJump(list[0], moduleMenuInfo.module2LeftMenuIndex)
        }

        // // 跳上次记录页面
        // this.$nextTick(() => {
        //   this.$router.push({
        //     path: moduleMenuInfo.module2TopMenuPath,
        //     query: moduleMenuInfo.module2TopMenuQuery
        //   })
        // })
      } else {
        // 当count变化时，这里的代码会被执行
        const list = JSON.parse(JSON.stringify(this.$store.getters.menus)).filter((item) => this.$store.getters.checkedMenuModule == item.menuModule)
        this.handleJump(list[0], moduleMenuInfo.module1LeftMenuIndex || 0)

        // if (this.$route.path != this.$store.getters.generalHomePath) {
        //   // 跳对应的工作台首页
        //   this.$nextTick(() => {
        //     this.$router.push({
        //       path:  this.$store.getters.generalHomePath,
        //       query: {}
        //     })
        //   })
        // }
      }
    }
  },
  methods: {
    //布局方式,对应转换
    getAlign(type) {
      if (type == 2) {
        return 'top'
      } else if (type == 3) {
        return 'left'
      } else {
        return 'center'
      }
    },
    // 左侧菜单点击跳转,
    // setfunWatermark(data) {
    //   this.setwatermarkConfig(data.path, false);
    // },
    //设置水印   path路由信息    all 是否查找并且渲染系统级别水印
    setwatermarkConfig(path, all = true) {
      const _this = this
      let { resourceRouteMap, watermarkList, systemWatermarkId } = WATERMAKDATA
      // 系统级别查找
      if (all) {
        setWatermark(systemWatermarkId, 'sysData')
      }
      let uuid = resourceRouteMap[path]
      // && uuid != systemWatermarkId
      if (uuid) {
        setWatermark(uuid, 'funData')
      } else {
        // this.funData = {}
           //如果没有查到的页面，用系统界别的水印
           setWatermark(systemWatermarkId, 'funData')
      }

      function setWatermark(id, key) {
        let data = watermarkList.find((ite) => ite.id == id)
        // 配置系统级别水印
        if (data) {
          let { alpha,size, resourceId, watermarkType, fontSize, color, watermarkImage, wordContent } = data
          _this[key] = {
            alpha,
            resourceId,
            watermarkType,
            fontSize,
            color,
            watermarkImage,
            wordContent,
            size
          }
        }
      }
    },
    //获取水印
    async watermarkConfig(callback) {
      let res = await watermarkConfig()
      let { resourceRouteMap = {}, watermarkList = [], systemWatermarkId } = res.data.result
      // 存储全部页面的水印信息
      WATERMAKDATA = {
        resourceRouteMap,
        watermarkList,
        systemWatermarkId
      }
      callback ? callback() : ''
    },
    showTopMenu() {
      this.$store.commit('SET_ISSHOWTOPMENU', !this.isShowTopMenu)
    },
    URL(iconName, str = '') {
      try {
        if (str) {
          iconName = iconName.slice(0, -4) + str + '.png';
        }
        iconName = (str ? 'catalog_icons_white/' : 'catalog_icons_blue/') + iconName;
        return require(`@/assets/${iconName}`);
      } catch (err) {
        return '';
      }
    },

    isLeft() {},

    // 上方点击,渲染左侧边
    handleJump(item, index) {
      // console.log('item方点击,渲染左侧边', item, index)

      if (!!!this.$store.getters.factoryCode && item.sysCode !== 'platform' && this.$store.getters.checkedMenuModule == 2) {
        this.$message.error('当前用户未分配工厂')
        return
      }
      this.itemList = item
      if ((item.path || '').includes('http')) {
        window.open(item.path)
      } else if (item.children.length == 0) {
        this.$message.error(this.$t('common.menuErr'))
      } else {
        this.$store.commit('SET_INDEXACTIVE', index)
        this.$store.commit('SET_LEFTMENUS', item.children)
        this.$store.commit('SET_TWOTITLE', item)
        // this.$store.commit("SET_ISSHOWTOPMENU", true);
        setTimeout(() => {
          this.$store.commit('SET_ISSHOWTOPMENU', false)
        }, 0)
      }

      // 更新本地菜单模块缓存信息
      const moduleMenuInfo = sessionStorage.getItem('moduleMenuInfo') ? JSON.parse(sessionStorage.getItem('moduleMenuInfo')) : {}
      // 更新切换之前的左侧菜单选中信息
      if (this.$store.getters.checkedMenuModule == 1) {
        moduleMenuInfo.module1LeftMenuId = item.id
        moduleMenuInfo.module1LeftMenuIndex = index
      } else if (this.$store.getters.checkedMenuModule == 2) {
        moduleMenuInfo.module2LeftMenuId = item.id
        moduleMenuInfo.module2LeftMenuIndex = index
      }
      sessionStorage.setItem('moduleMenuInfo', JSON.stringify(moduleMenuInfo))

      // this.mouseleave();
    },
    resourceCommonly() {
      resourceCommonly().then((res) => {
        res.data.result.forEach((val) => {
          val.name = val.resourceName
        })
        this.likeList = [
          {
            icon: 'el-icon-star-on',
            name: $i18n.t('common.commonMenus'),
            children: res.data.result
          }
        ]
      })
    },
    // 刷新本页
    handleRefresh() {
      this.key = new Date().getTime()
    }
  }
}
</script>
<style lang="scss" scoped>
$maxWidth: 185px;
$minWidth: 60px;

.containerBag {
  background: #ffffff;
.left-water{
  /deep/.pack{
    left: -50% !important
  }
}
  #appPage {
    height: 100%;
    overflow: auto;
  }
  .left-menu {
    background: $app-color-header;
    .left-icon {
      transition: all 0.5s;
    }
    ::-webkit-scrollbar {
      width: 0px;
      transition: all 1s;
    }
  }
  .left-menu:hover {
    .left-icon {
      transition: all 0.5s;
      box-shadow: 5px 5px 30px #afaeae;
    }
    ::-webkit-scrollbar {
      width: 1px;
    }
  }
  .flex-left {
    font-size: 22px;

    i {
      cursor: pointer;
    }
  }
  .platform-left-k {
    width: $maxWidth;
    transition: all 0.5s;
  }
  .platform-left-b {
    width: 48px;
    transition: all 0.5s;
  }
  // .right {
  //   transform: rotate(180deg);
  //   transition: all 0.5s;
  // }

  // .left {
  //   transform: rotate(0deg);
  //   transition: all 0.5s;
  // }
  .menusList {
    height: calc(100vh - 54px - 50px);
    .active {
      background: $header-bkColor-hover;
      .b-p {
        color: $header-fontColor-hover !important;
      }

      .def {
        display: none !important;
      }
      .hover {
        display: block !important;
      }
    }
    .item {
      cursor: pointer;
      padding: 10px 0;

      display: flex;
      flex-direction: column;
      align-items: center;
      .b-p {
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 500;
        color: $header-bkColor-hover;
        padding-top: 5px;
        text-align: center;
        width: 45px;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .def {
        display: block;
      }
      .hover {
        display: none;
      }
    }

    .item:hover .b-p {
      color: $header-fontColor-hover;
    }

    .item:hover .def {
      display: none;
    }
    .item:hover .hover {
      display: block;
    }
    .item:hover {
      background: $header-bkColor-hover;
    }
  }
  .show-flex-left {
    width: 100%;
    text-align: right;
    background-color: rgba(235, 232, 232, 0.867);

    & > i {
      padding-right: 20px;
    }
  }

  .hid-flex-left {
    text-align: center;
  }

  .main-pack {
    display: flex;
    width: 100%;
    background-color: white;
  }

  .disp-none {
    display: none;
  }

  .icon-pack {
    font-weight: 500;
    padding-right: 10px;
  }

  /deep/.el-menu-item.is-active {
    background: $menu-active-background;
    box-sizing: border-box;
  }

  /deep/.el-menu-item {
    height: 52px;
    line-height: 52px;
  }

  /deep/.el-menu {
    border-right-width: 0px;
  }
}

.platform-left {
  box-shadow: 5px 0 10px -5px rgba(0, 21, 41, 0.3);
  z-index: 1;
  position: relative;
  overflow: hidden;
  width: $maxWidth;
  display: flex;
  /deep/ i {
    margin-right: 5px;
    color: $header-fontColor;
  }
  .left-icon {
    width: 48px;
    overflow: auto;
    background: $app-color-header;
    position: relative;
    height: calc(100vh - 54px - 50px);
    z-index: 99;

    .icon-bk {
      position: fixed;
      bottom: 0px;
      height: 20px; // 20px;
      width: 48px;
      text-align: center;
      background: $app-color-header;
      padding-bottom: 20px;
      transition: all 0.5s;
      & > img {
        transition: all 0.5s;
      }

      .right {
        transform: rotate(180deg);
      }

      .left {
        transform: rotate(0deg);
      }
    }

    .icon-bk:hover {
      background: $app-color-header;
    }
  }
  .scrollbar {
    background-color: $app-color-header;
    display: flex;
  }
  .show-menu-none {
    width: 0px !important;
    transition: all 0.5s;
    transform: translateX(-137px) !important;
    overflow: hidden;
  }

  .show-menu-b {
    // width: 0px !important;
    transition: all 0.5s;
    width: calc(#{$maxWidth} - 48px);
    transform: translateX(0px);
    overflow: hidden;
  }
  .show-menu {
    // animation: showMenu 0.5s;
    width: calc(#{$maxWidth} - 48px);
    position: relative;
    .left-top {
      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      text-align: center;
      height: 48px;
      display: flex;
      color: #5a6f82;
      align-items: center;
      justify-content: center;
    }
    .recommend {
      position: absolute;
      width: 15px;
      object-fit: contain;
      right: 0px;
      top: 0px;
    }
  }

  @keyframes showMenu {
    from {
      width: $minWidth;
    }

    to {
      width: $maxWidth;
    }
  }
}

.platform-right-k {
  width: calc(100vw - #{$maxWidth} + 137px) !important;
}
.platform-right {
  width: calc(100vw - #{$maxWidth});
  padding: 0 15px;
  box-sizing: border-box;
  background: #eff2fb;
  transition: width 0.5s;
  .fun-content {
    position: relative;
    overflow: hidden;
    width: initial;
    .fun-waterMask {
      position: absolute !important;
    }
  }
}

.scrollbar {
  height: calc(100vh - 60px);
  box-sizing: border-box;
  background-color: #ffffff;
}

.scrollbar-main {
  width: 100%;
  // height: calc(100vh - 112px - 56px);
  height: calc(100vh - 102px);
  // padding-right: 10px;
  box-sizing: border-box;
  overflow-x: hidden;
}

/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}

.platform-page {
  // min-height: calc(100vh - 112px - 56px);
  min-height: calc(100vh - 112px);
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  padding-bottom: 0;
  background-color: #ffffff;
  // background: var(--bkColor);
}

// .iframePage {
//   min-height: calc(100vh - 112px - 56px);
//   padding: 10px;
//   padding-right: 0;
//   box-sizing: border-box;
//   overflow: hidden;
//   background: #ffffff;
// }
.topFrame {
  width: 100%;
  height: calc(100vh - 140px);
  //   overflow: auto;
}
</style>
<style lang="scss">
.likeMenu {
  border-bottom: 1px solid $header-bkColor-hover;
  border-top: 1px solid $header-bkColor-hover;
}
</style>
