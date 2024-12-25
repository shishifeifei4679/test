<template>
  <el-dialog
    :visible="visible"
    v-bind="computedProp"
    @close="cancel"
    :close-on-click-modal="false"
    custom-class="print-dialog"
  >
    <template v-slot:title>
      <el-button
        type="primary"
         style="position: relative; left: calc(100% - 100px); top: 3px;"
        :disabled="disabled"
        size="mini"
        @click="handerPrint()"
        >{{ $i18n.t("common.print") }}
      </el-button>
    </template>
    <div class="split-print" v-loading="loading">
      <template v-if="printData && printData.length">
        <div class="preview-container">
          <div id="preview_content_design"></div>
        </div>
      </template>
      <el-empty v-else :description="$i18n.t('splitPrint.msg1')"></el-empty>
    </div>
  </el-dialog>
</template>
<script>
import { getInfoByCode } from "@/api/common";
import request from "@/axios/request";
import url from "@/axios/url";
import { hiprint, disAutoConnect } from "vue-plugin-hiprint";
const { dataUrl } = url();
// 取消自动连接打印客户端
disAutoConnect();
export default {
  name: "print-dialog",
  props: {
    paramsData: {
      type: Object,
      default: () => {},
    },
    customType: {
      type: String,
      default: "",
    },
    customValueFn: {
      type: Function,
      default: () => {},
    },
    noTempCallBack: {
      type: Function | null,
      default: null,
    },
  },

  data() {
    return {
      loading: false,
      visible: false,
      defaultProp: {
        width: "85%",
        top: "15vh",
        title: "打印",
      },
      disabled: false,
      localStorageInfo: {}, //缓存的数据
      printData: [],
      printElementsObj: {},
      paper: {},
      apiUrl: {},
      hiprintTemplate: null,
    };
  },

  created() {
    this.getTemplateDetail();
    this.disabled = false;
  },
  activated() {
    this.getTemplateDetail();
  },
  computed: {
    computedProp() {
      return Object.assign({}, this.defaultProp, this.$options.propsData);
    },
  },
  methods: {
    confirm() {
      this.$emit("done", this.text);
    },
    cancel() {
      this.$emit("cancel");
    },
    // 打印
    async handerPrint() {
      let { businessBackUrl } = this.apiUrl;
      this.print();
      this.disabled = true;
      try {
        businessBackUrl
          ? await request({
              url: `${dataUrl}${businessBackUrl}`,
              method: "post",
              data: this.localStorageInfo,
            })
          : "";
      } catch (error) {
        this.$message.error(this.$i18n.t("splitPrint.msg2"));
      }
    },
    async getTemplateDetail(row) {
      const splitPrintStr = this.$options.propsData.printData;
      if (splitPrintStr) {
        this.localStorageInfo = splitPrintStr;
        this.localStorageInfo.useType = "pc";
        this.loading = true;
        try {
          let res = await getInfoByCode({
            tempCode: this.localStorageInfo.barcodePrintTempCode,
          });
          let { tempContent, apiPath, businessBackUrl } = res.data.result;

          this.apiUrl = { apiPath, businessBackUrl };
          if (tempContent) {
            const { elements, paper } = JSON.parse(tempContent);
            this.initData(elements, paper, apiPath);
          } else {
            this.$message.error(this.$i18n.t("splitPrint.msg3"));
          }
        } catch (error) {
          this.loading = false
        }
      }
    },
    initData(elements, paper, apiPath) {
      console.log(apiPath, "apiPathapiPathapiPath");
      if (!apiPath) {
        this.$message.error(this.$i18n.t("splitPrint.msg4"));
        return;
      }
      request({
        url: `${dataUrl}${apiPath}`,
        method: "post",
        data: this.localStorageInfo,
      }).then((respones) => {
        let res = { data: respones.data.result };
        const dataArray = Array.isArray(res.data) ? res.data : [res.data];
        this.printData = dataArray;
        this.printElementsObj = elements;
        this.paper = paper;
        this.hiprintTemplate = new hiprint.PrintTemplate({
          template: elements,
        });
        this.showContent();
      }).finally(()=>{
        this.loading = false
      });
    },
    showContent() {
      setTimeout(() => {
        $("#preview_content_design").html(
          this.hiprintTemplate.getHtml(this.printData)
        );
      }, 500);
    },
    print() {
      this.hiprintTemplate.print(
        this.printData,
        {},
        {
          callback: () => {
            console.log("callback");
            this.waitShowPrinter = false;
          },
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.print-content {
  border: solid 1px red;
  .content {
    border: 1px solid #ccc;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
  }
}

.btn {
  width: 100%;
  .btn-pack {
    display: flex;
    justify-content: end;
    width: 100%;
    button {
      margin-left: 20px;
    }
  }
}
.split-print {
  width: 100%;
  position: relative;

  .preview-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    #preview_content_design {
      border: solid 1px #eee;
      /* 不同模板 间隙 */
      .hiprint-printTemplate {
        background: #fff;
        border-bottom: 10px solid #ccc;
      }

      /* 批量打印 间隙 */
      .hiprint-printTemplate .hiprint-printPanel:not(:last-of-type) {
        border-bottom: 5px solid #ccc;
      }

      /* 分页纸张 间隙 */
      .hiprint-printPaper {
        // border-bottom: 10px solid #ccc;
      }
    }
  }
}
</style>
