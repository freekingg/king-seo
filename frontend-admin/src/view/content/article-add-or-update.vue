<template>
  <el-dialog
    :visible.sync="visible"
    :title="!dataForm.id ? '添加' : '修改'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmitHandle"
      label-width="120px"
    >
      <el-form-item prop="title" label="名称">
        <el-input v-model="dataForm.title" />
      </el-form-item>
      <el-form-item prop="category_id" label="分组">
        <el-select v-model="dataForm.category_id" placeholder="请选择分组">
          <el-option v-for="item in categorys" :key="item.id" :label="item.title" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文件" prop="category_id">
        <el-upload
          ref="uploadFile"
          class="upload"
          :action="Config.baseURL + 'cms/file'"
          :headers="headers"
           accept="text/plain"
          :auto-upload="false"
          :on-success="handleSuccess"
          :on-error="handleError"
          :multiple="false"
          :limit="1"
          :file-list="fileList"
        >
          <el-button slot="trigger" size="small" type="success">选取文件</el-button>
          <el-button size="small" style="margin-left: 10px" type="primary" @click="submitUpload"
            >上传到服务器</el-button
          >
        </el-upload>
      </el-form-item>
      <el-form-item prop="summary" label="简介">
        <el-input
          size="medium"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 8 }"
          placeholder="请输入简介"
          v-model="dataForm.summary"
        ></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle">确认</el-button>
    </template>
  </el-dialog>
</template>


<script>
import { mapActions } from 'vuex'
import Config from '@/config'
import Category from '@/model/category'
import Article from '@/model/article'
import { getToken } from '@/lin/util/token'

export default {
  ...mapActions(['loginOut']),
  data() {
    return {
      Config,
      visible: false,
      dataForm: {
        id: '',
        title: '',
        summary: '',
        path: '',
        category_id: '',
      },
      categorys: [],
      fileList: [],
      dataRule: {
        title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        path: [{ required: true, message: '请上传文件', trigger: 'blur' }],
        category_id: [{ required: true, message: '请选择分组', trigger: 'blur' }],
      },
      loading: false,
      headers: {
        Authorization: getToken('access_token'),
      },
    }
  },

  methods: {
    init() {
      this.visible = true
      this.$nextTick(async () => {
        this.$refs.dataForm.resetFields()

        // 获取分组
        const categorys = await Category.getCategorys()
        this.categorys = categorys.list

        if (this.dataForm.id) {
          const info = await Article.getArticle(this.dataForm.id)
          this.dataForm = info
          this.fileList = [{
            name: info.path,
            url: info.path
          }]
        } else {
          this.$refs.uploadFile.clearFiles()
        }
      })
    },
    async getUploadValue(name) {
      const value = await this.$refs[name].getValue()
      return value
    },
    handleSuccess(response) {
      this.dataForm.path = response[0].path
      this.$message({
        message: '上传成功',
        type: 'success',
        duration: 500,
      })
    },
    handleError() {
      const that = this
      this.$message({
        message: 'token状态过期',
        type: 'error',
        duration: 500,
        onClose: () => {
          that.loginOut()
        },
      })
    },
    submitUpload() {
      this.$refs.uploadFile.submit()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$refs.groupPermissions.getGroupPermissions()
    },
    // 表单提交
    async dataFormSubmitHandle() {
      this.$refs.dataForm.validate(async valid => {
        if (!valid) {
          return false
        }

        if (!this.dataForm.id) {
          try {
            this.loading = true
            await Article.createArticle(this.dataForm)
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              },
            })
          } catch (e) {
            this.loading = false
            console.log(e)
          }
        } else {
          try {
            this.loading = true
            await Article.editArticle(this.dataForm.id, this.dataForm)
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              },
            })
          } catch (e) {
            this.loading = false
            console.log(e)
          }
        }
      })
    },
  },
}
</script>
