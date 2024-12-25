<template>
  <div class="ele-upload-file" v-loading="loading">
    <el-upload
      :before-upload="handleBeforeUpload"
      :drag="false"
      :file-list="fileList"
      :limit="limit"
      :multiple="multiple"
      :on-change="handleChange"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      v-bind="$attrs"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      class="ele-upload-file-uploader"
      ref="upload"
      :headers="headers"
      v-if="!disabled"
    >
      <!-- 上传按钮 -->
      <el-button size="medium" type="primary">{{ btnText }}</el-button>
      <!-- 上传提示 -->
      <div class="el-upload__tip" slot="tip" v-if="showTip">
        {{ this.$t("common.upload2") }}
        <template v-if="fileSize">
          {{ this.$t("common.uploadSize") }}
          <b style="color: #f56c6c">{{ fileSize }}MB</b>
        </template>
        <template v-if="fileType">
          {{ this.$t("common.uploadType") }}
          <b style="color: #f56c6c">{{ fileType.join("/") }}</b>
        </template>
        {{ this.$t("common.upload3") }}
      </div>
    </el-upload>

    <!-- 列表 -->
    <ele-upload-list
      :disabled="disabled"
      :files="list"
      :isCanDelete="isCanDelete"
      :isCanDownload="isCanDownload"
      :isShowDeleteConfim="isShowDeleteConfim"
      :isShowSize="isShowSize"
      @remove="handleRemove"
    />
  </div>
</template>

<script>
import service from "@/axios/axios"
import { refreshToken } from "@/api/login"
import { logout } from "@/utils/judge"
import EleUploadList from "./EleUploadList"
export default {
  inheritAttrs: false,
  name: "EleUploadFile",
  components: {
    EleUploadList
  },
  props: {
    // 值
    value: [String, Object, Array],
    // 大小限制(MB)
    fileSize: Number,
    // 响应处理函数
    responseFn: Function,
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: Array,
    // 提示
    placeholder: String,
    // 是否禁用
    disabled: Boolean,
    // 是否显示文件大小
    isShowSize: {
      type: Boolean,
      default: true
    },
    // 是否显示下载
    isCanDownload: {
      type: Boolean,
      default: true
    },
    // 是否可删除
    isCanDelete: {
      type: Boolean,
      default: true
    },
    // 是否显示删除确认弹窗
    isShowDeleteConfim: {
      type: Boolean,
      default: true
    },
    // 是否可上传相同文件
    isCanUploadSame: {
      type: Boolean,
      default: true
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    },
    // 是否显示上传成功的提示
    isShowSuccessTip: {
      type: Boolean,
      default: true
    },
    // 是否支持多选文件
    // 同 element-ui upload 组件
    multiple: {
      type: Boolean,
      default: true
    },
    // 最大允许上传个数
    // 同 element-ui upload 组件
    limit: Number,
    // 删除前的操作
    // 同 element-ui upload 组件
    beforeRemove: Function
  },
  data() {
    return {
      fileList: [],
      loading: false,
      headers: {
        Satoken: this.$store.getters.token
      }
    }
  },
  computed: {
    // 按钮文本
    btnText() {
      if (this.placeholder) {
        return this.placeholder
      } else {
        if (this.multiple) {
          return this.$t("common.uploadFile")
        } else {
          return this.$t("common.uploadFileSingle")
        }
      }
    },
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize)
    },
    // 列表
    list() {
      let temp = 1
      if (this.value) {
        // 首先将值转为数组
        const list = Array.isArray(this.value) ? this.value : [this.value]
        // 然后将数组转为对象数组
        return list.map((item) => {
          if (typeof item === "string") {
            item = { name: item, url: item }
          }
          item.uid = item.uid || new Date().getTime() + temp++
          return item
        })
      } else {
        return []
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        this.fileList = this.list
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 文件改变
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    // 上传前校检格式和大小
    async handleBeforeUpload(file) {
      const response = await service.request({
        url: refreshToken,
        method: "get"
      })

      return new Promise((resolve, reject) => {
        if (response.data.code == 0) {
          if (!response.data.result) {
            logout()
          } else {
            const { headers = {} } = this.$attrs
            this.headers = {
              ...headers,
              Satoken: response.data.result
            }
            this.$store.commit("SET_TOKEN", response.data.result)
          }
        }
        // 校检文件类型
        if (this.fileType) {
          let fileExtension = ""
          if (file.name.lastIndexOf(".") > -1) {
            fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1)
          }
          const isTypeOk = this.fileType.some((type) => {
            console.log(file.type,fileExtension)
            if (file.type.indexOf(type) > -1) return true
            if (fileExtension && fileExtension.toLowerCase()==type.toLowerCase()) return true
            return false
          })
          if (!isTypeOk) {
            this.$message.error(`${this.$t("common.upload4")} ${this.fileType.join("/")} ${this.$t("common.upload5")}!`)
            return reject()
          }
        }

        // 校检文件大小
        if (this.fileSize) {
          const isLt = file.size / 1024 / 1024 < this.fileSize
          if (!isLt) {
            this.$message.error(`${this.$t("common.upload6")} ${this.fileSize} MB!`)
            return reject()
          }
        }

        // 校检相同文件
        if (!this.isCanUploadSame) {
          const isSame = this.list.some((item) => item.name + item.size === file.name + file.size)
          if (isSame) {
            this.$message.error(this.$t("common.upload7"))
            return reject()
          }
        }
        this.loading = true
        return resolve()
      })
    },
    // 文件个数超出
    handleExceed() {
      this.$message.error(`${this.$t("common.upload8")} ${this.limit} ${this.$t("common.upload9")}`)
    },
    // 上传失败
    handleUploadError(err) {
      this.loading = false
      this.$message.error(this.$t("common.upload10"))
      this.$emit("error", err)
    },
    // 上传成功回调
    handleUploadSuccess(response, file) {
      this.loading = false
      if (this.isShowSuccessTip) {
        this.$message.success(this.$t("common.upload11"))
      }
      if (this.responseFn) {
        response = this.responseFn(response, file, this.list)
      }
      if (this.multiple) {
        this.$emit("input", [...this.list, response])
      } else {
        this.$emit("input", response)
      }

      // 上传成功
      this.$emit("success", response, this.list)
    },
    handleRemove(index) {
      if (!this.beforeRemove) {
        this.doRemove(index)
      } else if (typeof this.beforeRemove === "function") {
        const before = this.beforeRemove(this.list[index], this.list)
        if (before && before.then) {
          before.then(
            () => {
              this.doRemove(index)
            },
            () => {}
          )
        } else if (before !== false) {
          this.doRemove(index)
        }
      }
    },
    // 删除
    doRemove(index) {
      this.$emit("remove", this.list[index], this.list)
      this.fileList.splice(index, 1)
      if (this.multiple) {
        const data = [...this.list]
        data.splice(index, 1)
        this.$emit("input", data || [])
      } else {
        this.$emit("input", null)
      }
    }
  },
  created() {
    this.fileList = this.list
  }
}
</script>

<style>
.ele-upload-file-uploader {
  margin-bottom: 5px;
}
</style>
