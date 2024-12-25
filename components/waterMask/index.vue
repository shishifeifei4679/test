<template>
  <div
    ref="waterMask"
    class="_waterMask"
    v-if="destroy"
    :style="{
      '--opacity': opacity,
      '--transform': transform,
      '--sizeW': getW(),
      '--sizeH': getH(),
      '--packW': packW,
      '--fontColor': fontColor,
      '--fontSize': fontSize,
    }"
  >
    <div class="pack" ref="packs" style="width: calc(100% + var(--sizeW) * 2);">
      <div
        :key="ite"
        v-for="ite in (length==120?lengthMax:length)"
        :class="align"
      >
        <img v-if="value[0]" :src="value[0]" alt="" />
        <div v-if="value[1]">{{ value[1] }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 受否禁用水印
    destroy: {
      type: Boolean,
      default: true,
    },
    length: {
      type: Number,
      default: 120,
    },
    // 整体透明度
    opacity: {
      type: Number,
      default: 0.5,
    },
    // 布局方式, left,左右结构,  top上下结构
    align: {
      type: String,
      default: "left",
    },
    // 旋转角度
    transform: {
      type: String,
      default: "10deg",
    },
    // 密度, mini,最密集, default默认, medium中等, big宽松
    size: {
      type: String,
      default: "default",
    },
    // 绑定的图片文字, 下表0   图片 下标1 文字
    value: {
      type: Array,
      default: () => ["", ""],
    },
    //字体大小
    fontSize: {
      type: String,
      default: "14px",
    },
    // 字体颜色
    fontColor: {
      type: String,
      default: "#60626652",
    },
    // 字体颜色
    packW: {
      type: String,
      default: "200%",
    },
  },
  watch: {
    size: {
      handler(val, old) {
        this.getLengthMax()
      },
      deep: true,
    },
  },
  data() {
    return {
      drawer: true,
      lengthMax: 200,
      sizeList: {
        veryMini: { width: 180, height: 100 }, //非常小
        mini: { width: 240, height: 140 }, //小
        default: { width: 300, height: 180 }, //默认
        medium: { width: 360, height: 200 }, //中等
        big: { width: 400, height: 260 }, //大
      },
    };
  },
  methods: {
    // getLength() {
    //   console.log(2222222, this.$refs.packs);
    //   if (this.size == "veryMini") {
    //     return 160 * 2 + 10 + 20;
    //   } else if (this.size == "mini") {
    //     return 96 * 2 + 10 + 40;
    //   } else if (this.size == "default") {
    //     return 60 * 2 + 10 + 80;
    //   } else if (this.size == "medium") {
    //     return 50 * 2 + 10 + 80;
    //   } else if (this.size == "big") {
    //     return 40 * 2 + 10 + 10;
    //   } else {
    //     return 120;
    //   }
    // },
    //手动销毁水印DOM
    removeMaskDiv() {
      document.getElementById(this.$refs.waterMask).removeChild(this.maskDiv);
    },
    getW() {
      // this.size="big"
      // if (this.align == "left") {
      // return this.sizeList[this.size].width + 100 + "px";
      // } else {
      return this.sizeList[this.size].width + "px";
      // }
    },
    getH() {
      // if (this.align == "top") {
      // return this.sizeList[this.size].height + 10 + "px";
      // } else {
      return this.sizeList[this.size].height + "px";
      // }
    },
    // 计算节点
    getLengthMax() {
      let { offsetHeight, offsetWidth } = this.$refs.packs;
      let { width, height } = this.sizeList[this.size];
      const col = Math.ceil(offsetWidth / width);
      const row = Math.ceil(offsetHeight / height);
      this.lengthMax = col * row;
    },
  },
  mounted() {
  this.getLengthMax()
  },
};
</script>
<style lang="scss" scoped>
._waterMask {
  top: 0px;
  position: absolute;
  z-index: 999999;
  width: var(--packW);
  height: 200%;
  overflow: hidden;
  pointer-events: none;

  .top {
    text-align: center;
  }
  .left {
    display: flex;
    align-items: center;
  }

  .pack {
    opacity: var(--opacity);
    position: absolute;
    top: -50%;
    left: 0;
    bottom: 0;
    right: 0;
    width: 150%;
    height: 150%;
    z-index: 999999;
    //  transform-origin: left;
    color: #fff;
    pointer-events: none;
    -webkit-transform: rotate(-40deg);
    transform: rotate(-40deg);
    & > div {
      pointer-events: none;
      -webkit-transform: rotate(var(--transform));
      transform: rotate(var(--transform));
      font-size: var(--fontSize);
      font-weight: 100;
      min-width: var(--sizeW);
      min-height: var(--sizeH);
      float: left;
      color: var(--fontColor);
    }
  }
}
</style>
