<template>
  <el-dialog
    :title="title"
    :visible="previewVisible"
    :width="width"
    @close="close"
    class="ele-form-dialog-preview-img"
  >
    <div class="preview-layout">
      <div class="list-container">
        <div
          class="item"
          :class="{ active: index === key }"
          v-for="(item, key) in list"
          :key="key"
          @click="itemClick(key)"
        >
          <el-image
            style="width: 100%; height: 100%"
            :src="item"
            fit="contain"
          ></el-image>
        </div>
      </div>
      <div class="preview-container">
        <el-image
          style="width: 100%; height: 100%"
          :src="list[index]"
          fit="contain"
        ></el-image>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { list } from "@/api/tool/share";

export default {
  model: {
    prop: "previewVisible",
    event: "update:previewVisible",
  },
  props: {
    previewVisible: {
      type: Boolean,
      default: false,
    },
    // 弹框标题
    title: {
      type: String,
      default: "图片预览",
    },
    list: {
      type: Array,
      default: () => [],
    },
    // 弹窗标题
    width: {
      type: String,
      default: "80%",
    },
  },
  watch: {
    previewVisible(val) {
      if (val) {
        this.index = 0;
      }
    },
  },

  data() {
    return {
      index: 0,
    };
  },
  mounted() {},
  methods: {
    itemClick(index) {
      this.index = index;
    },
    close() {
      this.$emit("update:previewVisible", false);
    },
  },
};
</script>

<style lang="scss">
.ele-form-dialog-preview-img .el-dialog__body {
  height: 80vh;
  max-height: 80vh;
  padding: 10px 20px;
  .preview-layout {
    display: flex;
    height: 100%;
  }
  .list-container {
    width: 150px;
    height: 100%;
    overflow-y: auto;
    padding: 20px 0;
    margin-right: 10px;
    .item {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      width: 130px;
      height: 130px;
      box-sizing: border-box;
      &.active {
        border: solid 1px rgb(233, 48, 48);
      }
    }
  }
  .preview-container {
    border-left: solid 1px #999;
    background-color: #f5f7fa;
    padding: 10px 20px;
    flex: 1;
  }
}
</style>
