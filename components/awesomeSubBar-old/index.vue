<template>
  <div style="background: #fff" class="containerBag">
    <div class="main-pack">
      <div class="left" v-if="!isMicro">
        <el-scrollbar class="scrollbar">
          <transition name="el-fade-in">
            <SearchMenu style="width: 120px; margin: 0 auto 5px" v-if="$store.getters.isShowTopMenu" />
          </transition>

          <div class="show-menu">
            <img class="recommend" :src="recommend" alt="" v-if="likeList.length != 0" />
            <menuItem v-for="menu in likeList" :key="menu.id" :menu="menu" class="likeMenu"> </menuItem>
            <menuItem v-for="menu in $store.getters.leftMenus" :key="menu.id" :menu="menu"> </menuItem>
          </div>
        </el-scrollbar>
      </div>
      <!-- :style="{ '--bkColor': bkColor }" -->
      <div class="right">
        <div>
          <el-scrollbar class="scrollbar-main" id="scrollbar-main">
            <div class="page" v-if="!showPage">
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
import menuItem from "./menuItem"
import topMenu from "./topMenu.vue"
import { resourceCommonly } from "@/api/login"
const recommend = require("@/assets/images/recommend.png")
import iframes from "@/router/iframe"
import SearchMenu from "@/components/searchMenu/index"

export default {
  name: "awesomeSubBar",
  components: {
    menuItem,
    topMenu,
    SearchMenu
  },
  data() {
    return {
      // bkColor: "#ffffff",
      likeList: [],
      recommend,
      iframes,
      // isMicro: process.env.VUE_APP_ISMICRO === 'true'
      isMicro: true
    }
  },
  computed: {
    filterIfameList() {
      const topmenus = this.$store.getters.topmenus
      const filterIfameList = iframes.filter((item) => topmenus.some((val) => val.path == item.path))
      return filterIfameList
    },
    showIframe() {
      return function (item) {
        if (!item) return false
        const path = this.$route.path
        return item.path === path
      }
    },
    getUrl() {
      return function (item) {
        const url = item.meta.url
        const token = this.$store.getters.token
        const pathUrl = url.includes("?") ? `${url}&token=${token}` : `${url}?token=${token}`

        return pathUrl
      }
    },
    showPage() {
      const path = this.$route.path
      return this.filterIfameList.some((val) => val.path == path)
    }
  },

  created() {
    this.resourceCommonly()
  },
  methods: {
    resourceCommonly() {
      resourceCommonly().then((res) => {
        res.data.result.forEach((val) => {
          val.name = val.resourceName
        })
        this.likeList = [
          {
            icon: "el-icon-star-on",
            name: $i18n.t("common.commonMenus"),
            children: res.data.result
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
$maxWidth: 135px;
$minWidth: 60px;
.containerBag {
  .flex-left {
    font-size: 22px;
    i {
      cursor: pointer;
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

.left {
  box-shadow: 5px 0 10px -5px rgba(0, 21, 41, 0.3);
  z-index: 1;
  /deep/i {
    margin-right: 5px;
    color: #7f99bc;
  }

  .scrollbar {
    background-color: $app-color-header;
  }
  .show-menu {
    animation: showMenu 0.5s;
    width: $maxWidth;
    position: relative;
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
.right {
  // TODO
  //width: calc(100vw - #{$maxWidth});
  //padding: 0 15px;
  width: 100%;
  box-sizing: border-box;
  background: #eff2fb;
  transition: width 0.5s;
}
.scrollbar {
  height: calc(100vh - 60px);
  box-sizing: border-box;
  background-color: #ffffff;
}
.scrollbar-main {
  width: 100%;
  height: calc(100vh - 112px);
  // padding-right: 10px;
  box-sizing: border-box;
  overflow-x: hidden;
}

/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}

.page {
  min-height: calc(100vh - 112px);
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  padding-bottom: 0;
  background-color: #ffffff;
  // background: var(--bkColor);
}
// .iframePage {
//   min-height: calc(100vh - 112px);
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
  border-bottom: 1px solid #22262d;
  border-top: 1px solid #22262d;
}
</style>
