<template>
  <div class="ele-upload-image">
    <!-- 上传组件 -->
    <el-upload
      :accept="accept"
      :action="action"
      :before-upload="handleBeforeUpload"
      :data="data"
      :disabled="uploading"
      :drag="Boolean(drag)"
      :headers="headers"
      :http-request="httpRequest"
      :limit="limit"
      :list-type="drag ? 'picture' : 'picture-card'"
      :multiple="multiple"
      :name="name"
      :auto-upload="autoUpload"
      :on-change="handleChange"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      :file-list="fileList"
      :style="{
        marginBottom: limit > 1 && computedValues.length ? '20px' : '0px',
      }"
      :withCredentials="withCredentials"
      ref="upload"
      v-if="!crop && !disabled"
      v-show="isShowUpload"
    >
      <div v-loading="uploading">
        <!-- drag显示 -->
        <template v-if="drag">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            {{ $t("common.dragUpload") }}
            <em>{{ $t("common.clickUpload") }}</em>
          </div>
        </template>

        <!-- 非drag -->
        <template v-else>
          <div
            :style="{
              width: size + 'px',
              height: size + 'px',
              lineHeight: size + 'px',
            }"
          >
            <i class="el-icon-plus"></i>
          </div>
        </template>
      </div>

      <!-- 公共 -->
      <div class="el-upload__tip" slot="tip" v-if="showTip">
        {{ $t("common.upload16") }}
        <b style="color: #f56c6c;">{{
            fileType.length ? fileType.join("/") : $t("common.upload14")
          }}</b>
        {{ $t("common.upload13") }}
        <template v-if="fileSize">
          {{ $t("common.upload15") }}
          <b style="color: #f56c6c;">{{ fileSize }}MB</b>
        </template>
        <template v-if="otherTip">
          {{ otherTip }}
        </template>
      </div>
    </el-upload>

    <div v-if="crop && !disabled">
      <div
        :style="{
          width: size + 'px',
          height: size + 'px',
          lineHeight: size + 'px',
        }"
        @click="isShowCrop = true"
        class="el-upload el-upload--picture-card"
        style="margin-bottom: 20px;"
        v-show="isShowUpload"
      >
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </div>

      <cropper
        :field="name"
        :headers="headers"
        :height="cropHeight"
        :noCircle="cropHeight !== cropWidth"
        :params="data"
        :url="action"
        :width="cropWidth"
        :withCredentials="withCredentials"
        @crop-success="handleCropSuccess"
        @crop-upload-fail="handleCropUploadError"
        @crop-upload-success="handleCropUploadSuccess"
        @src-file-set="handleSetFileSet"
        class="ele-upload-image--cropper"
        img-format="png"
        ref="cropper"
        v-if="isShowCrop"
        v-model="isShowCrop"
      ></cropper>
    </div>

    <!-- 图片列表 -->
    <ele-gallery
      :class="{ 'ele-disabled': disabled }"
      :lazy="lazy"
      :remove-fn="handleRemove"
      :size="size"
      :sliceSingle="true"
      :source="value"
      :thumbSuffix="thumbSuffix"
      :title="title"
    />
  </div>
</template>

<script>
import Cropper from "vue-image-crop-upload";
import EleGallery from "vue-ele-gallery";

export default {
  name: "EleUploadImage",
  props: {
    // 值
    value: {
      type: [String, Array],
      default() {
        return [];
      },
    },
    // 是否剪裁
    crop: {
      type: Boolean,
      default: false,
    },
    // 图片显示大小
    size: {
      type: Number,
      default: 150,
    },
    // 裁剪高度
    cropHeight: {
      type: Number,
    },
    // 裁剪宽度
    cropWidth: {
      type: Number,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
    },
    // 响应处理函数
    responseFn: Function,
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => [],
    },
    // 是否显示上传成功的提示
    isShowSuccessTip: {
      type: Boolean,
      default: false,
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
    // 缩略图后缀, 例如七牛云缩略图样式 (?imageView2/1/w/20/h/20)
    thumbSuffix: {
      type: String,
      default: "",
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true,
    },
    // 弹窗标题
    title: String,
    // 图片懒加载
    lazy: {
      type: Boolean,
      default: false,
    },
    // 上传地址 (同官网)
    action: {
      type: String,
      required: true,
    },
    // 设置上传的请求头部(同官网)
    headers: Object,
    // 文件个数显示(同官网)
    limit: Number,
    // 是否启用拖拽上传 (同官网)
    drag: {
      type: Boolean,
      default: false,
    },
    // 	支持发送 cookie 凭证信息 (同官网)
    withCredentials: {
      type: Boolean,
      default: false,
    },
    // 是否支持多选文件 (同官网)
    multiple: {
      type: Boolean,
      default: false,
    },
    // 上传时附带的额外参数(同官网)
    data: Object,
    // 上传的文件字段名 (同官网)
    name: {
      type: String,
      default: "file",
    },
    // 覆盖默认的上传行为，可以自定义上传的实现 (同官网)
    httpRequest: Function,
    // 接受上传的文件类型（thumbnail-mode 模式下此参数无效）(同官网)
    accept: String,
    // 删除前的操作
    beforeRemove: Function,
    disabled: {
      type: Boolean,
      default: false,
    },
    // 补充的其它提醒信息
    otherTip: {
      type: String,
      default: "",
    },
  },
  components: {
    Cropper,
    EleGallery,
  },
  data() {
    return {
      cropData: {},
      isShowCrop: false,
      uploading: false,
      fileList: [],
    };
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType.length || this.fileSize);
    },
    computedValues() {
      if (this.value) {
        if (typeof this.value === "string") {
          return [this.value];
        } else {
          return [...this.value];
        }
      } else {
        return [];
      }
    },
    isShowUpload() {
      if (this.limit > 1) {
        return true;
      } else {
        return this.computedValues.length === 0;
      }
    },
    successFiles() {
      return this.fileList.filter((file) => file.status === "success");
    },
  },
  watch: {
    isShowCrop(value) {
      if (value === false) {
        this.cropData = {};
      }
    },
    value(val = []) {
      // 多文件上传时，value传过来是格式是[ { src: '' } ]和fileList的格式[ url: '' ]不一样，需要转换
      // 如果不转换，会导致el-upload无法判断已上传文件的数量，limit失效
      if (Array.isArray(val) && val.length) {
        this.fileList = val.map(item => ({
          url: item.src || item.url,
          name: item.src || item.url,
          ...item
        }))
      } else if (typeof val === 'string' && val.length) {
        this.fileList = [{ name: val, url: val }];
      } else {
        this.fileList = [];
      }
    },
  },
  methods: {
    handleSetFileSet(fileName, fileType, fileSize) {
      const uid = this.cropData.uid || new Date().getTime();
      this.cropData = {
        name: fileName,
        percentage: 0,
        size: fileSize,
        type: fileType,
        status: "ready",
        uid: uid,
      };
    },
    handleCropSuccess(b64Data) {
      this.cropData.url = b64Data;
    },
    handleCropUploadError(status) {
      this.$message.error(this.$t("common.upload10"));
      this.$emit("error", status);
    },
    handleCropUploadSuccess(response) {
      this.cropData.status = "success";
      this.cropData.percentage = 100;
      this.cropData.response = response;
      const file = Object.assign({}, this.cropData);
      const index = this.fileList.findIndex((item) => item.uid === file.uid);
      if (index > -1) {
        this.fileList.splice(index, 1, file);
      } else {
        this.fileList.push(file);
      }
      this.handleUploadSuccess(response, file, this.fileList);
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      let isImg = false;
      if (this.fileType.length) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        isImg = this.fileType.some((type) => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
      } else {
        isImg = file.type.indexOf("image") > -1;
      }

      if (!isImg) {
        this.$message.error(
          `${this.$t("common.upload4")}${this.fileType.join("/")} ${this.$t(
            "common.upload5"
          )}`
        );
        return false;
      }

      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(
            `${this.$t("common.upload6")} ${this.fileSize} MB!`
          );
          return false;
        }
      }

      this.uploading = true;
      return true;
    },
    handleChange(file, fileList) {
      const _this = this;
      this.fileList = fileList;
      // this.val
      if (!this.autoUpload) {
        // debugger
        if (this.handleBeforeUpload(file.raw)) {
          let reader = new FileReader();
          reader.readAsDataURL(file.raw);
          reader.onload = function (e) {
            _this.$emit("input", e.target.result);
          };
        }
      }
      this.uploading = false;
    },
    // 文件个数超出
    handleExceed() {
      this.$message.error(
        `${this.$t("common.upload8")} ${this.limit} ${this.$t(
          "common.upload9"
        )}`
      );
    },
    // 上传失败
    handleUploadError(err) {
      this.uploading = false;
      this.$message.error(this.$t("common.upload10"));
      this.$emit("error", err);
    },
    // 上传成功回调
    handleUploadSuccess(response, file, fileList) {
      let url = response;
      this.uploading = false;
      if (this.isShowSuccessTip) {
        this.$message.success(this.$t("common.upload11"));
      }
      // 解决多文件上传时，一次性选择多个文件，只调一次onSuccess的bug
      // bug原因：onSuccess内给fileList赋值后，不再执行剩余的onSuccess
      // 解决方案：所有文件上传成功后，才触发赋值(emit)
      // 为兼容以前的写法，增加fileList参数
      // 多文件上传时，responseFn用法
      // (res, file, files, fileList) => {
      //   return fileList.map(item => ({
      //      src: item.src || item.response.result.path,
      //      title: item.title || item.response.result.object.split('/').pop(),
      //   }))
      // };
      if (fileList.every(item => item.status === 'success')) {
        if (this.responseFn) {
          url = this.responseFn(response, file, this.successFiles, fileList);
        }
        if (this.limit > 1) {
          if (Array.isArray(this.value)) {
            // 兼容以前的写法，对url返回的类型进行判断
            // 如果是数组，解构赋值，否则直接赋值
            if (Array.isArray(url)) {
              this.$emit("input", url);
            } else {
              this.$emit("input", [...this.value, url]);
            }
          } else {
            this.$emit("input", [url]);
          }
        } else {
          // 兼容以前的写法，返回一个对象
          if (typeof url === 'object' && url !== null) {
            this.$emit("input", url.src || '');
          } else {
            this.$emit("input", url);
          }
        }
      }
    },
    doRemove(index) {
      if (this.limit > 1) {
        const data = [...this.computedValues];
        data.splice(index, 1);
        this.$emit("input", data || []);
      } else {
        this.$emit("input", '');
      }
    },
    handleRemove(index) {
      if (!this.beforeRemove) {
        this.doRemove(index);
      } else if (typeof this.beforeRemove === "function") {
        const file = this.computedValues[index];
        // 判断一下有没有title属性，没有的话，取src最后一个/后的字符串
        let fileObj = {};
        if (typeof file === 'string') {
          fileObj = {
            title: file.split('/').pop(),
            src: file,
          };
        } else {
          fileObj = {
            ...file,
            title: file.title || file.src.split('/').pop(),
          };
        }
        const before = this.beforeRemove(fileObj, this.computedValues);
        if (before && before.then) {
          before.then(
            () => {
              this.doRemove(index);
            },
            () => {}
          );
        } else if (before !== false) {
          this.doRemove(index);
        }
      }
    },
  },
  mounted() {
    // 插入到body中, 避免弹出层被遮盖
    if (this.crop && this.$refs.cropper) {
      document.body.appendChild(this.$refs.cropper.$el);
    }
  },
};
</script>

<style>
.ele-upload-image {
  line-height: 1;
}
.ele-upload-image .el-loading-spinner {
  line-height: 1;
}
.ele-upload-image .el-icon-plus {
  vertical-align: middle;
}
.ele-upload-image .el-upload--picture-card {
  width: auto;
  height: auto;
  background: none;
  line-height: inherit;
}

/* 裁剪 */
.vue-image-crop-upload.ele-upload-image--cropper {
  z-index: 99;
}
.ele-upload-image--cropper .vicp-drop-area {
  background-color: #fbfdff !important;
}
.ele-upload-image--cropper .vicp-icon1-arrow {
  border-bottom-color: #909399 !important;
}
.ele-upload-image--cropper .vicp-icon1-body {
  background-color: #909399 !important;
}
.ele-upload-image--cropper .vicp-icon1-bottom {
  border-color: #909399 !important;
}
.ele-disabled .el-icon-delete {
  display: none;
}
</style>
