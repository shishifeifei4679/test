<template>
  <div class="section-name">
    <div class="name-left">
      <div class="dot" :style="{ 'background-color': desc.attrs?.color || '#0F9E5E' }"></div>
      <div class="title">{{desc.title}}</div>
      <div class="sub-title">{{desc['sub-title']}}</div>
    </div>
    <div class="name-right" v-if="desc.slots && desc.slots.right">
      <extend-slot :render="desc.slots.right" />
    </div>
  </div>
</template>

<script>
import formMixin from "../mixins/formMixin";

export default {
  name: "EleFormSectionName",
  mixins: [formMixin],
  data() {
    return {
      mockRule: "@string",
      type: ["String", "Number"],
    };
  },
};
</script>

<style lang="scss" scoped>
.section-name {
  overflow: hidden;
  //height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .name-left {
    display: flex;
    align-items: center;
    // 前缀
    .dot {
      //background-color: #0F9E5E;
      width: 6px;
      height: 16px;
      margin-right: 8px;
      border-radius: 1px;
    }
    // 标题
    .title {
      font-size: 16px;
      font-weight: bolder;
      margin-right: 10px;
    }
    // 副标题
    .sub-title {
      font-size: 13px;
    }
  }
  .name-right {

  }
}
</style>
