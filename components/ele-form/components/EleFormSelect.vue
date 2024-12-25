<template>
  <el-select
    :class="desc.class"
    :style="desc.style"
    class="ele-form-full-line"
    ref="ele-select"
    v-bind="attrs"
    v-model="newValue"
    :loading="loading"
    :filterable="attrs.filterable === false ? false : true"
    :remote-method="remoteMethod ? changeOptions : null"
    v-on="onEvents"
    @change="changeHandler"
  >
    <template v-for="(render, key) of slots" v-slot:[key]>
      <extend-slot
        :data="{
          options: desc.options
        }"
        :key="key"
        :render="render"
      />
    </template>
    <el-option
      :key="desc.optionsKey === 'index' ? index : option.value"
      :label="option.text"
      :value="option.value"
      v-bind="option.attrs"
      v-for="(option, index) in options"
    ></el-option>
  </el-select>
</template>

<script>
import formMixin from '../mixins/formMixin'

export default {
  name: 'EleFormSelect',
  mixins: [formMixin],
  inject: ['EleForm'],
  props: {
    field: String
  },
  data() {
    return {
      loading: false,
      mockRule: 'radio',
      type: ['Boolean', 'Number', 'String', 'Array']
    }
  },
  computed: {
    remoteMethod() {
      return this.attrs['remote-method'] || this.attrs.remoteMethod
    },
    defaultAttrs() {
      return {
        placeholder: this.t('ele-form.select') + this.desc._label
      }
    }
  },
  methods: {
    // 单独处理change事件，把key，和value都返回
    changeHandler(val) {
      const item = this.options.find((item) => item.value === val)
      if (this.onEvents.oldOnChange) {
        this.onEvents.oldOnChange(val || '', item || { text: '', value: '' })
      }
    },
    changeOptions(q) {
      if (this.remoteMethod) {
        this.loading = true
        this.remoteMethod(q, (options) => {
          this.loading = false
          this.$set(this.EleForm.formDescData[this.field], '_options', options)
          this.EleForm.formDescData[this.field].isRestValByOptions = false
          this.EleForm.changeOptions(options, this.field)
        })
      }
    }
  },
  mounted() {
    if (this.remoteMethod && this.newValue) {
      this.changeOptions(this.newValue)
    }
  }
}
</script>
