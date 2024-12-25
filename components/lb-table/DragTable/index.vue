<template>
  <div class="drag-table">
    <el-table
      ref="dragTable"
      v-bind="$attrs"
      v-on="$listeners"
      :data="tableData"
      :tree-props="treeProps"
    >
      <template v-if="column && column.length">
        <lb-column
          v-bind="$attrs"
          v-for="(item, index) in column"
          :key="`${index + (item.prop || item.type)}`"
          :column="item"
        >
        </lb-column>
      </template>

      <slot v-else></slot>
    </el-table>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import { applyDrag } from "../utils";
import LbColumn from "../lb-column";
export default {
  props: {
    column: Array,
    data: Array,
    dragHandle: {
      type: String,
      default: "",
    },
    treeProps: {
      type: Object,
      default: () => {
        return {
          children: "children",
          hasChildren: "hasChildren",
        };
      },
    },
  },
  components: {
    LbColumn,
  },
  data() {
    return {
      tableData: [],
      activeRows: [],
      tableKey: 0,
    };
  },
  methods: {
    getUuiD(randomLength) {
      return Number(
        Math.random().toString().substr(2, randomLength) + Date.now()
      ).toString(36);
    },
    // 初始化列拖拽
    rowDrop() {
      const el = this.$refs.dragTable.$el.querySelector(
        ".el-table__body-wrapper tbody"
      );
      if (!el) {
        return;
      }
      const _this = this;
      this.sortable = Sortable.create(el, {
        animation: 180,
        delay: 0,
        handle: this.dragHandle,
        // ghostClass: "sortable-ghost", // drop placeholder的css类名
        // chosenClass: "sortable-chosen", // 被选中项的css 类名
        // dragClass: "sortable-drag", // 正在被拖拽中的css类名
        onMove({ dragged, related }) {
          _this.$set(_this, "activeRows", _this.treeToTile(_this.tableData)); // 把树形的结构转为列表再进行拖拽
        },
        onEnd({ oldIndex, newIndex }) {
          const oprater = {
            removedIndex: oldIndex,
            addedIndex: newIndex,
          };

          // 交换新旧位置的leval
          const leval = _this.activeRows[newIndex]["leval"];
          _this.activeRows[newIndex]["leval"] =
            _this.activeRows[oldIndex]["leval"];
          _this.activeRows[oldIndex]["leval"] = leval;

          // 交换新旧位置的fieldDataType
          const fieldDataType = _this.activeRows[newIndex]["fieldDataType"];
          _this.activeRows[newIndex]["fieldDataType"] =
            _this.activeRows[oldIndex]["fieldDataType"];
          _this.activeRows[oldIndex]["fieldDataType"] = fieldDataType;

          _this.activeRows = applyDrag(_this.activeRows, oprater);
          _this.$emit("tableDataChange", _this.tileToTree());
        },
      });
    },
    clearSelection() {
      this.$refs.dragTable.clearSelection();
    },
    toggleRowSelection(row, selected) {
      this.$refs.dragTable.toggleRowSelection(row, selected);
    },
    toggleAllSelection() {
      this.$refs.dragTable.toggleAllSelection();
    },
    toggleRowExpansion(row, expanded) {
      this.$refs.dragTable.toggleRowExpansion(row, expanded);
    },
    setCurrentRow(row) {
      this.$refs.dragTable.setCurrentRow(row);
    },
    clearSort() {
      this.$refs.dragTable.clearSort();
    },
    clearFilter(columnKey) {
      this.$refs.dragTable.clearFilter(columnKey);
    },
    doLayout() {
      this.$nextTick(() => {
        this.$refs.dragTable && this.$refs.dragTable.doLayout();
      });
    },
    sort(prop, order) {
      this.$refs.dragTable.sort(prop, order);
    },

    sortMenuData() {
      let res = [];
      this.activeRows.forEach((r) => {
        if (r.leval === 1) {
          let itemIdx = this.tableData.findIndex((t) => t.id === r.id);
          if (itemIdx > -1) {
            res.push({ ...this.tableData[itemIdx] });
          }
        }
      });
      this.tableData = res;
      this.tableKey = Math.random(); //狠狠的刷新dom
      this.rowDrop(); // 再把拖拽的功能塞入
    },

    // 将树数据转化为平铺数据
    treeToTile(treeData) {
      const childKey = this.treeProps.children || "children";
      const arr = [];
      const expanded = (data) => {
        if (data && data.length > 0) {
          data
            .filter((d) => d)
            .forEach((e) => {
              arr.push(e);
              expanded(e[childKey] || []);
            });
        }
      };
      expanded(treeData);
      return arr.map((x) => {
        return { ...x, [this.treeProps.children]: [] };
      });
    },

    // 将平铺数据根据leval字段转化为树数据
    tileToTree() {
      const childKey = this.treeProps.children || "children";
      const arr = [];
      let i = 0;
      while (this.activeRows[i]) {
        const item = this.activeRows[i];
        if (item && item.leval === 1) {
          arr.push({
            ...item,
            parentId: -1,
            parentName: "",
            [childKey]: [],
          });
        } else {
          let index = arr.findLastIndex((elem) => elem.leval == 1);
          const pArr = arr[index];
          pArr[childKey].push({
            ...item,
            parentId: pArr.id,
            parentName: pArr.field,
          });
        }
        i++;
      }
      return arr;
    },
  },
  watch: {
    data(val) {
      this.tableData = val || [];
      this.rowDrop();
    },
  },
};
</script>
<style lang="scss">
.drag-table {
}
</style>
