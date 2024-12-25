<template>
  <div class="row-operation">
    <template v-for="(item, index) in sliceArray(0, rowBntNumber)">
      <span :key="index" v-show="isShow(item)">
        <el-button class="commonBtn" size="mini" plain :type="item.type" :class="item.class" @click.native.stop="handleOperate(item)" :disabled="isDisabled(item)" v-btnAuths="item.auth">
          {{ item.name }}
        </el-button>
      </span></template
    >
    <el-dropdown v-if="filterAuth.length > rowBntNumber" size="mini" trigger="click" @command="handleOperate">
      <span class="el-dropdown-link"  @click.stop>
        <i class="el-icon-more" style="color: #557cf8;"></i>
      </span>
      <el-dropdown-menu slot="dropdown" style="text-align: center; min-width: 90px; margin-top: 5px;">
        <el-dropdown-item
          v-for="(item, index) in sliceArray(rowBntNumber, filterAuth.length)"
          :key="item.handleName"
          :command="item"
          :divided="index != 0"
          :disabled="isDisabled(item)"
          v-btnAuths="item.auth"
          v-show="isShow(item)"
          >{{ item.name }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  name: 'rowOperation',
  props: {
    rowConfig: {
      type: Array,
      default: () => []
    },
    scope: Object,
    // 默认展示两个按钮
    rowBntNumber: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      filterAuth: [],
      defIndex: 2
    }
  },
  watch: {
    rowConfig: {
      handler(val) {
        const btnAuths = this.$store.getters.btnAuths || []
        this.filterAuth = val.filter((item) => !item.auth || btnAuths.includes(item.auth))
      },
      immediate: true,
      deep: true
    }

    // "scope.row": {
    //   handler(val) {
    //     console.log(1212, val);
    //   },
    //   immediate: true,
    //   deep: true,
    // },
  },
  computed: {
    sliceArray() {
      return function (start = 0, end) {
        return this.filterAuth.slice(start, end)
      }
    },
    // 按钮是否可点击
    isDisabled() {
      return function (item) {
        if (!item.disabled) return false
        const row = this.scope ? this.scope.row : {}
        const disabled = item.disabled(row)
        return disabled
      }
    },
    // 按钮是否隐藏显示
    isShow() {
      return function (item) {
        const btnAuths = this.$store.getters.btnAuths || []
        if (!item.auth || btnAuths.includes(item.auth)) {
          if (!item.show) return true
          const row = this.scope ? this.scope.row : {}
          const show = item.show(row)
          return show
        } else {
          return false
        }
      }
    },
    // 按钮是否隐藏显示
    isShowTop() {
      return function (item, index) {
        const btnAuths = this.$store.getters.btnAuths || []
        if (!item.auth || btnAuths.includes(item.auth)) {
          if (!item.show) return true
          const row = this.scope ? this.scope.row : {}
          const show = item.show(row)

          // if (!show && this.defIndex < 4) {
          //   this.defIndex = this.defIndex + 1;

          //   console.log(index, this.defIndex);
          // }
          return show
        } else {
          return false
        }
      }
    }
  },
  methods: {
    handleOperate(data) {
      this.$emit('rowOperate', { ...data, ...this.scope })
    }
  }
}
</script>
<style lang="scss" scoped>
.row-operation {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.commonBtn {
  padding: 2px 10px;
  font-size: 11px;
}
</style>
