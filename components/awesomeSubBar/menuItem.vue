<template>
  <div>
    <MenuPopover
      placement="right-start"
      trigger="hover"
      :visible-arrow="false"
      popper-class="menu-popover"
      v-if="menu['children']"
      v-model="visible"
      :open-delay="200"
      ref="popover"
    >
      <!-- 鼠标滑过的展示层 -->
      <div class="menu-pack" ref="menuPack">
        <!-- 没有子节点的一级菜单 -->
        <template v-for="item in getNoChildren(menu['children'])">
          <div
            v-if="item.visible === '1'"
            :key="item.id"
            class="menu-content"
            @click="handleRouter(item)"
            :title="item.name"
          >
            {{ item.name }}
          </div>
        </template>
        <!-- 有子节点/弹出层的一级菜单 -->
        <div v-for="(item, index) in getChildren(menu['children'])"
             :ref="'popover-item' + index"
             :key="item.id"
             style="margin: 5px;"
        >
          <div v-if="item.children && item.visible === '1'">
            <!-- 二级菜单标题 -->
            <div class="menu-list" :title="item.name">{{ item.name }}</div>
            <!-- 三级菜单 -->
            <template v-for="it in getMenu(item.children)">
              <div
                :key="it.id"
                v-if="it.visible === '1'"
                class="menu-content"
                @click="handleRouter(it)"
                :title="it.name"
              >
                {{ it.name }}
              </div>
            </template>
          </div>
        </div>
      </div>
      <!-- 一级菜单，运营中心显示图标，业务中心不显示 -->
      <div slot="reference" class="menu-name">
        <div class="new-menu-second">
          <template v-if="menu['icon'] && $store.getters.checkedMenuModule === 1">
            <!-- 一级菜单悬停后图标 -->
            <el-image
              class="hover"
              style="width: 16px; height: 16px; flex-shrink: 0;"
              :src="URL(menu.icon, '_h')"
              fit="contain">
              <div
                slot="error"
                class="image-slot"
                style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center"
              >
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <!-- 一级菜单初始化图标 -->
            <el-image
              class="def"
              style="width: 16px; height: 16px; flex-shrink: 0;"
              :src="URL(menu.icon)"
              fit="contain">
              <div
                slot="error"
                class="image-slot"
                style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center"
              >
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
          <p
            :style="{'padding-left': $store.getters.checkedMenuModule === 1 ? '10px' : '0'}"
            :title="menu['name']"
          >
            {{ menu.name }}
          </p>
        </div>
        <!-- 一级菜单右侧图标 -->
        <img
          class="def menu-icon"
          :src="require('@/assets/menu/right.png')"
          alt=""
        />
        <!-- 一级菜单悬停后右侧图标 -->
        <img
          class="hover menu-icon"
          :src="require('@/assets/menu/right_h.png')"
          alt=""
        />
      </div>
    </MenuPopover>
    <!-- 无下级菜单的一级菜单 -->
    <div
      class="menu-name"
      v-if="!menu.children && menu.visible === '1'"
      @click="handleRouter(menu)"
    >
      <div class="new-menu-second">
        <template v-if="menu.icon && $store.getters.checkedMenuModule === 1">
          <!-- 一级菜单悬停后图标 -->
          <el-image
            class="hover"
            style="width: 16px; height: 16px; flex-shrink: 0;"
            :src="URL(menu.icon, '_h')"
            fit="contain">
            <div
              slot="error"
              class="image-slot"
              style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center"
            >
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <!-- 一级菜单初始化图标 -->
          <el-image
            class="def"
            style="width: 16px; height: 16px; flex-shrink: 0;"
            :src="URL(menu.icon)"
            fit="contain"
          >
            <div
              slot="error"
              class="image-slot"
              style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center"
            >
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
        <p
          :style="{'padding-left': $store.getters.checkedMenuModule === 1 ? '10px' : '0'}"
          :title="menu.name"
        >
          {{ menu.name }}
        </p>
      </div>
      <!-- 一级菜单右侧图标 -->
      <img
        class="def menu-icon"
        :src="require('@/assets/menu/right.png')"
        alt=""
      />
      <!-- 一级菜单悬停后右侧图标 -->
      <img
        class="hover menu-icon"
        :src="require('@/assets/menu/right_h.png')"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import { resourceVisit } from "@/api/login";
import { routerPush } from "@/utils/judge";
import MenuPopover from "./menuPopver";

export default {
  name: "menuItem",
  components: {
    MenuPopover
  },
  data() {
    return {
      visible: false,
    };
  },
  props: {
    menu: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    getMenu() {
      return function (children) {
        return children ? children : [];
      };
    },
    getNoChildren() {
      return function (menus = []) {
        return menus.filter(val => !val.children);
      };
    },
    getChildren() {
      return function (menus = []) {
        return menus.filter(val => val.children);
      };
    },
  },
  methods: {
    getUrl() {
      return function (item) {
        const url = item.path
        const token = this.$store.getters.token
        const pathUrl = url.includes('?') ? `${url}&token=${token}` : `${url}?token=${token}`
        return pathUrl;
      }
    },
    URL(iconName, str = '') {
      try {
        if (str) {
          iconName = iconName.slice(0, -4) + str + '.png';
        }
        iconName = (str ? 'catalog_icons_white/' : 'catalog_icons_blue/') + iconName;
        return require(`@/assets/${iconName}`);
      } catch (err) {
        return ''
      }
    },
    handleRouter(item) {
      resourceVisit(item.id);
      this.visible = false;
      this.$emit("clickItem",item.path)
      routerPush(item.path, "", item);
    },
    // 计算弹出层菜单的宽度，取弹性布局下最右侧元素的right坐标，减去最左侧元素的left坐标，获得弹出层的宽度
    // 也就是取所有行最大宽度作为弹出层的宽度
    computeWidth() {
      let leftArr = [], rightArr = [];
      Object.keys(this.$refs).forEach((key, index) => {
        if (key.includes('popover-item')) {
          const { left, right } = this.$refs[key][0].getBoundingClientRect();
          leftArr.push(left);
          rightArr.push(right);
        }
      })
      // 判断是否有滚动条，有滚动条则加上滚动条宽度10
      const { scrollHeight = 0, clientHeight = 0 } = this.$refs['menuPack'];
      let gapWidth = scrollHeight > clientHeight ? 30 : 20;
      return `${Math.ceil(Math.max(...rightArr) - Math.min(...leftArr) + gapWidth)}px`;
    }
  },
};
</script>

<style lang="scss" scoped>
$menuWidth: 140px;
.menu-pack {
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  max-width: calc(100vw - 500px);
  max-height: calc(100vh - 200px);
}
// 一级菜单
.menu-name {
  width: 100%;
  height: 46px;
  color: $header-fontColor;
  font-size: 14px;
  line-height: 46px;
  cursor: pointer;
  padding: 0px 10px;
  box-sizing: border-box;
  // font-weight: bolder;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .def {
    display: block;
  }

  .new-menu-second {
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
  .hover {
    display: none;
  }
}
.menu-name:hover .hover {
  display: block;
}
.menu-name:hover .def {
  display: none;
}
.menu-name:hover {
  background: $header-bkColor-hover;
  color: $header-fontColor-hover;
  i {
    color: $header-fontColor-hover;
  }
}
// 二级菜单，弹出层的标题
.menu-list {
  min-width: $menuWidth;
  // color: $header-fontColor;
  color: #5a6f82;
  text-align: left;
  font-size: 14px;
  line-height: 35px;
  background:$app-color-header;//rgba(247, 250, 252, 1);
  padding-left: 15px;
  padding-right: 15px;
  position: relative;
  font-weight: bolder;
  word-break: keep-all;
  white-space: nowrap;
}
.menu-list::before {
  content: "";
  position: absolute;
  left: 5px;
  top: 10px;
  background: $header-bkColor-hover;
  width: 6px;
  height: 14px;
  border-radius: 3px;
}
// 三级菜单/叶子节点
.menu-content {
  //width: $menuWidth;
  width: auto;
  min-height: 35px;
  color: $header-fontColor;
  text-align: left;
  font-size: 14px;
  line-height: 35px;
  // background: #252d3e;
  cursor: pointer;
  padding-left: 15px;
  padding-right: 10px;
  box-sizing: border-box;
}
.menu-content:hover {
  background: $header-bkColor-hover; //#2f394e;//左侧 侧边栏鼠标移入二级菜单展示页 hover颜色  by bing
  color: var(--header-fontColor-hover);
}
.menu-icon {
  width: 20px;
  height: 20px;
}
</style>
