<template>
  <div>
    <el-popover
      placement="right-start"
      trigger="hover"
      :visible-arrow="false"
      popper-class="popperClass"
      v-if="menu.children"
      v-model="visible"
      :open-delay="200"
    >
      <!-- 鼠标滑过的展示层 -->
      <div class="menuPack">
        <div>
          <div
            v-for="item in getNoChildren(menu.children)"
            :key="item.id"
            class="menuContent"
            @click="handleRouter(item)"
          >
            {{ item.name }}
          </div>
        </div>

        <div v-for="item in getChildren(menu.children)" :key="item.id">
          <div v-if="item.children">
            <div class="menulist">{{ item.name }}</div>
            <div
              v-for="c in getMenu(item.children)"
              :key="c.id"
              class="menuContent"
              @click="handleRouter(c)"
            >
              {{ c.name }}
            </div>
          </div>
        </div>
      </div>
      <div slot="reference" class="menuName">
        <i :class="menu.icon ? menu.icon : 'el-icon-setting'"></i>
        {{ menu.name }}
      </div>
    </el-popover>
    <div class="menuName" v-else @click="handleRouter(menu)">
      <i :class="menu.icon ? menu.icon : 'el-icon-setting'"></i>
      {{ menu.name }}
    </div>
  </div>
</template>

<script>
import { resourceVisit } from "@/api/login";
import { routerPush } from "@/utils/judge";
export default {
  name: "menuItem",
  data() {
    return {
      visible: false,
    };
  },
  props: {
    menu: {
      type: Object,
      default: () => ({}),
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
        let data = menus.filter((val) => !val.children);
        return data;
      };
    },
    getChildren() {
      return function (menus = []) {
        let data = menus.filter((val) => val.children);
        return data;
      };
    },
  },
  methods: {
    handleRouter(item) {
      resourceVisit(item.id);
      this.visible = false;
      routerPush(item.path, "", item);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$menuWidth: 140px;
.menuPack {
  display: flex;
}
.menuName {
  width: 100%;
  height: 46px;
  color: #7191b0;
  font-size: 14px;
  line-height: 46px;
  cursor: pointer;
  padding-left: 10px;
  box-sizing: border-box;
  font-weight: bolder;
  overflow: hidden;
}
.menuContent {
  width: $menuWidth;
  min-height: 35px;
  color: #7191b0;
  text-align: left;
  font-size: 14px;
  line-height: 35px;
  background: #252d3e;
  cursor: pointer;
  padding-left: 15px;
  font-weight: bolder;
}
.menuContent:hover {
  background: #2f394e;
  color: #ffffff;
}
.menuName:hover {
  background: #252d3e;
  color: #ffffff;
  i {
    color: #ffffff;
  }
}
.menulist {
  width: $menuWidth;
  color: #7191b0;
  text-align: left;
  font-size: 14px;
  line-height: 35px;
  background: #252d3e;
  padding-left: 15px;
  position: relative;
  font-weight: bolder;
}
.menulist::before {
  content: "";
  position: absolute;
  left: 5px;
  top: 10px;
  background: #2377da;
  width: 6px;
  height: 14px;
  border-radius: 3px;
}
</style>
