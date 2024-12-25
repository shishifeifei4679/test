<template>
  <div
    class="ele-form-search"
    :style="style"
    v-if="Object.keys(formConfig).length > 0"
  >
    <!-- 查询表单 -->
    <ele-form v-bind="selfFormConfig" v-model="formData" v-on="$listeners" :key="time">
      <template v-slot:form-btn>
        <el-button
          @click="$emit('handleSearch')"
          type="primary"
          icon="el-icon-search"
          >{{$t('common.search')}}</el-button
        >
        <el-button @click="handleReset" icon="el-icon-refresh">{{$t('common.reset')}}</el-button>
        <!-- el-icon-arrow-up -->
        <el-button type="text" v-show="isShow" @click="handleOpenOrdown">
          {{ openOrdown ? $t('common.packUp') : $t('common.expand') }}
          <i
            :class="[openOrdown ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"
          ></i
        ></el-button>
      </template>
    </ele-form>
  </div>
</template>
<script>
const BASEHEIGHR = 48
export default {
  name: 'ele-form-search',
  props: {
    formConfig: {
      type: Object,
      default: () => ({})
    },

    // 初始化时form的值
    initForm: Object
  },
  watch: {
    initForm: {
      handler (val) {
        if (!val) return
        this.formData = JSON.parse(JSON.stringify(val))
      },
      immediate: true,
      deep: true
    },
    formConfig: {
      handler (val) {
        this.getFormConfig(val)
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      time:1,
      formData: {},
      isShow: false,
      selfFormConfig: {},
      openOrdown: false
    }
  },
  computed: {
    style () {
      return {
        overflow: 'hidden',
        height: this.openOrdown
          ? `${this.getRows * BASEHEIGHR}px`
          : `${BASEHEIGHR}px`,
        transition: 'height 0.5s'
      }
    },
    getRows () {
      const { formDesc = {}, column = 4 } = this.formConfig
      const length = Object.keys(formDesc).length + 1
      const rows = Math.ceil(length / column)
      return rows
    }
  },
  methods: {
    handleReset() {
      this.time = Date.now();
      this.formData = {}
      this.$emit('handleReset')
    },
    handleOpenOrdown () {
      this.openOrdown = !this.openOrdown
      setTimeout(() => {
        this.getFormConfig(this.formConfig)
      }, 300)
    },
    getFormConfig (val) {
      const { formDesc = {}, column = 4, ...reset } = val
      const rows = this.getRows
      if (rows > 1 && !this.openOrdown) {
        this.isShow = true
        const entries = Object.entries(formDesc)
        const beforeThreeItems = entries.slice(0, column - 1)
        this.selfFormConfig = {
          formDesc: Object.fromEntries(beforeThreeItems),
          ...reset
        }
      } else {
        this.selfFormConfig = val
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ele-form-search {
  transition: height 0.5s;
  height: 38px;
}
</style>
