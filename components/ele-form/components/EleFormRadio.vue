<template>
  <el-radio-group
    :class="desc.class"
    :style="desc.style"
    v-bind="attrs"
    v-model="newValue"
    v-on="onEvents"
  >
    <el-radio
      :key="option.value"
      :label="option.value"
      v-bind="option.attrs"
      v-for="option of options"
    >{{option.text}}
        <el-tooltip
          effect="dark"
          v-if="option.note"
          :content="option.note"
          placement="top-start"
        >
          <i
            style="color:#b2b2b2"
            class="el-icon-question"
          ></i>
        </el-tooltip>
    </el-radio>
  </el-radio-group>
</template>

<script>
import formMixin from '../mixins/formMixin'
export default {
  name: 'EleFormRadio',
  mixins: [formMixin],
  data () {
    return {
      mockRule: 'radio',
      type: ['String', 'Number', 'Boolean'],
      newValue: this.value || null
    }
  }
}
</script>
