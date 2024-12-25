<template>
  <el-tabs
    v-model="activeName"
    @tab-click="handleClick"
    type="border-card"
    class="primaryMenu"
  >
    <el-tab-pane
      v-for="(item, index) in menus"
      :label="item.name"
      :name="index.toString()"
      :key="index"
    >
      <div slot="label" class="tab-image">
        <el-image
          style="width: 30px; height: 30px;"
          :src="item.icon"
          fit="contain"
        >
          <div
            slot="error"
            class="image-slot"
            style="
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              background: $header-bkColor;
            "
          >
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <p>{{ item.name }}</p>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  name: "primaryMenu",
  data() {
    return {
      activeName: "0",
    };
  },
  computed: {
    menus() {
      return this.$store.getters.menus;
    },
  },
  created() {
    this.activeName = (this.$store.getters.indexActive || '0').toString();
  },
  methods: {
    URL(url) {
      try {
        console.log(url, "urlurl");
        let { pathname } = new URL(url);
        console.log(pathname, "pathnamepathname");
        return require(`@/assets${pathname}`);
      } catch (err) {
        return "";
      }
    },
    handleClick() {
      const item = this.menus[this.activeName];
      if ((item.path || "").includes("http")) {
        window.open(item.path);
      } else if (item.children.length == 0) {
        this.$message.error(this.$t("common.menuErr"));
      } else {
        this.$store.commit("SET_INDEXACTIVE", this.activeName);
        this.$store.commit("SET_LEFTMENUS", item.children);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.primaryMenu {
  background: transparent;
  border: none;
  box-shadow: none;
  width: 100%;
  /deep/ .el-tabs__content,
  /deep/ .el-tabs__active-bar {
    display: none;
  }
  /deep/ .el-tabs__item {
    color: $header-fontColor !important;
    font-size: 14px;
    height: 60px;
  }
  /deep/ .el-tabs__nav-next,
  /deep/.el-tabs__nav-prev {
    line-height: 60px;
    font-size: 12px;
    color: $header-fontColor;
  }
  /deep/ .el-tabs__header {
    background-color: transparent;
    border-bottom: none;
    margin: 0;
  }
  /deep/ .is-active {
    color: $header-fontColor-hover !important;
    background-color: $header-bkColor-hover !important;
    border-right-color: $header-bkColor-hover !important;
    border-left-color: $header-bkColor-hover !important;
  }
  .tab-image {
    margin-top: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    line-height: 20px;
    p {
      padding: 0;
      margin: 0;
    }
  }
  .tab-image-top {
    margin-top: 0px !important;
  }
}
</style>
