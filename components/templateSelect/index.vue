<!-- 模板选择 -->
<template>
  <div class="templateSelect-pack">
    <el-dialog :title="$i18n.t('common.templateSelectTitle')" :visible.sync="dialogVisible">
      <div class="centent">
        <el-row :gutter="20">
          <el-col :span="6" class="left">
            <el-card
              v-for="(ite, index) in imgList"
              :key="index"
              @click.native="handerItem(ite)"
              class="card"
              shadow="hover"
              :class="ite.active ? 'item-active-border' : ''"
            >
              <div class="item-active" v-show="ite.active || false">
                <p>{{ $i18n.t('common.selected') }}</p>
              </div>
              <el-image :src="ite.url" class="image" fit="cover" />
              <div>
                <span :title="ite.name">{{ ite.name }}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="18">
            <el-card class="card right" shadow="hover">
              <div
                class="item-max"
                :title="$i18n.t('common.templateSelectTip1')"
                @click.stop="
                  () => {
                    showViewer = true;
                  }
                "
              >
                <i class="el-icon-full-screen"></i>
              </div>
              <!--   :preview-src-list="[imgUrl]" -->
              <el-image
                v-if="imgUrl"
                :src="imgUrl"
                class="image"
                fit="scale-down"
              />

              <el-empty v-else :description="$i18n.t('common.templateSelectTip2')"></el-empty>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $i18n.t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handerOk()">{{ $i18n.t('common.ok') }}</el-button>
      </div>
    </el-dialog>
    <el-image-viewer
      :on-close="
        () => {
          showViewer = false;
        }
      "
      v-if="showViewer"
      :url-list="[imgUrl]"
      key="999"
    />
  </div>
</template>
<script>
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
//例如：import 《组件名称》 from '《组件路径》';
import { listByConfigRole } from "@/api/common.js";
export default {
  name: "",
  //import引入的组件需要注入到对象中才能使用
  components: { ElImageViewer },
  props: {
    value: {
      type: String | Number,
      default: "",
    },
    searchData: Object,
  },
  data() {
    //这里存放数据
    return {
      showViewer: false,
      dialogVisible: false,
      template: "",
      imgUrl: "",
      imgList: [
        // {
        //   name: "标签1",
        //   active: 0,
        //   code: 1,
        //   url:
        //     "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
        //   date: "2023/10/31 11:36",
        // },
      ],
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    searchData: {
      handler(val, old) {
        this.setAcive(this.value);
      },
      deep: true,
      immediate: true,
    },
  },
  //方法集合
  methods: {
    async initData() {
      let res = await listByConfigRole(this.searchData);
      let list = res.data.result.map((ite) => {
        ite["active"] = false;
        ite.name = ite.tempName;
        ite.code = ite.tempCode;
        ite.url = ite.tempThumb;
        return ite;
      });
      this.imgList = list;
      // this.imgUrl = list[0];
    },
    async setAcive(val) {
      await this.initData();
      this.imgUrl = "";
      this.$nextTick(() => {
        // console.log(1111, this.imgList)
        // console.log(222,val)
        this.imgList.map((ite) => {
          if (ite.code == val) {
            this.$set(ite, "active", true);
            this.imgUrl = ite.url;
          } else {
            this.$set(ite, "active", false);
          }
        });
      });
    },
    show() {
      this.dialogVisible = true;
    },
    handerItem(data) {
      this.imgList.map((ite) => {
        ite.active = false;
      });
      data.active = true;
      this.imgUrl = data.url;
    },
    handerOk() {
      let res = this.imgList.find((ite) => ite.active);
      if (res) {
        console.log('res-------', res, res.code)
        this.$emit("select", res);
        this.$emit("input", res.code);

        this.dialogVisible = false;
      } else {
        this.$message.warning($i18n.t('common.templateSelectTip3'));
      }
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
};
</script>
<style scoped lang="scss">
.templateSelect-pack {
  position: absolute;
  z-index: 99999;
  .left {
    height: 390px;
    overflow: auto;
    border-radius: 4px;
    border: 1px solid #dedede;
  }

  .right {
    height: 390px;
    overflow: auto;
    width: 100%;
    margin: 0px !important;
    .image {
      width: 100%;
      height: 390px !important;
    }
  }
  .centent {
    height: 100%;
    .image {
      width: 100%;
      min-height: 100px;
    }
    /deep/.el-card__body {
      position: relative;
    }
    .card {
      cursor: pointer;
      margin: 10px 0px;
      width: 100%;
      span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
        text-align: center;
      }

      .item-max {
        position: absolute;
        right: 20px;
        top: 20px;
        z-index: 99;
      }
    }
  }

  .item-active-border {
    border: 1px solid #cf1f1f;
    box-sizing: border-box;
  }
  .item-active {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
    width: 0;
    height: 0;
    border-left: 50px solid #cf1f1f;
    border-bottom: 50px solid transparent;
    p {
      position: absolute;
      /* display: block; */
      top: 5px;
      width: 35px;
      left: -50px;
      transform: rotate(-45deg);
      font-size: 14px;
      color: white;
    }
  }
  .dialog-footer {
    padding-top: 20px;
  }
}
</style>
<style>
.el-image-viewer__wrapper {
  z-index: 99999 !important;
}
</style>
