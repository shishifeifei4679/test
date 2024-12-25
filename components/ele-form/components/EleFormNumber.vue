<template>
  <el-input-number
    :class="desc.class"
    :style="desc.style"
    v-bind="attrs"
    v-model="newValue"
    v-on="desc.on"
    @input="handleChange"
  />
</template>

<script>
import formMixin from "../mixins/formMixin";
import { isUnDef } from "../tools/utils";

export default {
  name: "EleFormNumber",
  mixins: [formMixin],
  props: {
    value: {
      type: [Number, String],
      default: null,
    },
    // 是否允许为空
    isAllowNull: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mockRule: "@integer(-100, 100)",
    };
  },
  methods: {
    handleChange(val) {
      // if (val === 0 && isUnDef(this.value)) return;
      // 如果为空，则传null给父组件
      // 这样，只需要在父组件中循环formData，将null进一步处理就可以
      const value = this.desc.isAllowNull ? (val === undefined ? null : val) : val;
      this.$emit("input", value);
    },
    // 初始化数据
    handleValueChanged(value) {
      if (this.desc.displayFormatter) {
        value = this.desc.displayFormatter(value);
      }

      if (this.checkType(value)) {
        if (this.customInit) {
          value = this.customInit(value);
        }
        // 如果number框设置允许为空，当传入null时，设置为undefined(number框不接受null，undefined会显示为空)
        this.newValue = this.desc.isAllowNull ? (value === null ? undefined : value) : value;
      }
    },
  },
};
</script>
