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
      label-width="120px"
    >
      <el-form-item prop="title" label="名称">
        <el-input v-model="dataForm.title" />
      </el-form-item>
      <el-form-item prop="url" label="网站域名">
        <el-input
          v-model="dataForm.url"
          :autosize="{ minRows: 2, maxRows: 5 }"
          type="textarea"
          placeholder="请输入域名网址,多网址换行，一行一个,不要加协议：https,http"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="targetDomain" label="镜像域名">
        <el-input v-model="dataForm.targetDomain" />
      </el-form-item>
      <el-form-item prop="summary" label="备注">
        <el-input
          size="medium"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8 }"
          placeholder="请输入简介"
          v-model="dataForm.summary"
        ></el-input>
      </el-form-item>
      <el-form-item prop="charge" label="发布">
        <el-switch v-model="dataForm.open" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
      <!-- <el-form-item prop="categorys" label="分类">
        <el-select v-model="dataForm.category_id" placeholder="请选择分类">
          <el-option v-for="item in categorys" :key="item.id" :label="item.title" :value="item.id"></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="dataFormSubmitHandle">确认</el-button>
    </template>
  </el-dialog>
</template>


<script>
import Config from '@/config'
import Website from '@/model/website'
import { space2Array, isUrl } from '../../common/utils'

export default {
  data() {
    const checkUrl = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('内容不能为空'))
      }

      if (!isUrl(value)) {
        return callback(new Error('网址格式不正确'))
      }
      callback()
    }

    return {
      Config,
      visible: false,
      dataForm: {
        id: '',
        title: '',
        url: '',
        targetDomain: '',
        summary: '',
        open: true,
      },
      dataRule: {
        title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入域名', trigger: 'blur' }],
        targetDomain: [{ validator: checkUrl, required: true, trigger: 'blur' }],
      },
      rules: {
        minWidth: 100,
        minHeight: 100,
        maxSize: 1,
      },
      loading: false,
    }
  },
  methods: {
    init() {
      this.visible = true
      this.$nextTick(async () => {
        this.$refs.dataForm.resetFields()
        this.dataForm.special_id = ''
        if (this.dataForm.id) {
          const info = await Website.getItem(this.dataForm.id)
          this.dataForm = info
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 表单提交
    async dataFormSubmitHandle() {
      this.$refs.dataForm.validate(async valid => {
        if (!valid) {
          return false
        }
        if (!this.dataForm.id) {
          // 根据换行解析域名
          const oparray = space2Array(this.dataForm.url)
          const domains = oparray.map(item => item.trim())
          this.dataForm.domain = domains

          console.log(this.dataForm)

          try {
            this.loading = true
            await Website.createItem(this.dataForm)
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              },
            })
            this.loading = false
          } catch (e) {
            this.loading = false
            console.log(e)
          }
        } else {
          try {
            this.loading = true
            // 根据换行解析域名
            const oparray = space2Array(this.dataForm.url)
            const domains = oparray.map(item => item.trim())
            this.dataForm.domain = domains

            await Website.editItem(this.dataForm.id, this.dataForm)
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              },
            })
            this.loading = false
          } catch (e) {
            this.loading = false
            console.log(e)
          }
        }
      })
    },
    handleSuccessImage(response, file, fileList) {
      console.log(response, file, fileList)
      this.dataForm.image = response[0].path
    },
    handleSuccessVideo(response, file, fileList) {
      console.log(response, file, fileList)
      this.dataForm.video = response[0].path
    },
  },
}
</script>
<style scope>
.el-radio.is-bordered + .el-radio.is-bordered {
  margin-left: 0;
  margin-bottom: 6px;
}
</style>
