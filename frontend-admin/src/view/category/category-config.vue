<template>
  <el-dialog :visible.sync="visible" title="配置" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-tabs type="border-card">

      <!-- 域名管理 -->
      <el-tab-pane label="域名管理">
        <el-form :model="dataFormDomain" :rules="dataRule" ref="dataFormDomain" label-width="80px">
          <el-form-item prop="url" label="域名">
            <el-input
              v-model="dataFormDomain.url"
              :autosize="{ minRows: 16, maxRows: 16 }"
              type="textarea"
              placeholder="请输入域名网址,多网址换行，一行一个,不要加协议和www"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitDomains">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 外互链 -->
      <el-tab-pane label="友情链接">
        <el-form :model="dataFormLink" ref="dataFormLink" label-width="80px">
          <el-form-item label="友情链接">
            <el-input
              v-model="dataFormLink.content"
              :autosize="{ minRows: 8, maxRows: 8 }"
              type="textarea"
              :disabled="true"
              placeholder="权重站|关键词|权重站|关键词|权重站|关键词|权重站"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="目前固定">
            <code>
              权重站|关键词|权重站|关键词|权重站|关键词|权重站
            </code>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitLinks">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="替换管理">
        <el-form :model="dataFormReplace" :rules="dataRule" ref="dataFormReplace" label-width="100px">
          <el-form-item  label="H标签替换">
            <el-checkbox-group v-model="dataFormReplace.type">
              <el-checkbox label="H1标签" name="H1"></el-checkbox>
              <el-checkbox label="H2标签" name="H2"></el-checkbox>
              <el-checkbox label="H3标签" name="H3"></el-checkbox>
              <el-checkbox label="H4标签" name="H4"></el-checkbox>
            </el-checkbox-group>
            <p>（将模板中的H标签，h1...h5替换成栏目库文字并自动加上对应的关键字）</p>
          </el-form-item>
          <el-form-item label="H标签链接">
              <el-switch v-model="dataFormReplace.delivery"></el-switch>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitDomains">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
    </el-tabs>

    <!-- <template slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="dataFormSubmitHandle">确认</el-button>
    </template> -->
  </el-dialog>
</template>

<script>
import Config from '@/config'
import Category from '@/model/category'
import { space2Array, isUrl } from '../../common/utils'

export default {
  props: {
    data: {
      type: Object,
    },
  },
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
      id: '',
      dataFormDomain: {
        id: '',
        url: '',
      },
      dataFormReplace: {
        type: ''
      },
      dataFormLink: {
        content: '',
      },
      dataRule: {
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
    init(id) {
      this.id = id
      this.visible = true
      this.$nextTick(async () => {
        this.$refs.dataFormDomain.resetFields()
        if (this.id) {
          const domains = await Category.getCategoryDomains(this.id)
          this.dataFormDomain.url = domains.trim() || ''
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    submitLinks(){},
    // 添加域名
    async submitDomains() {
      this.$refs.dataFormDomain.validate(async valid => {
        if (!valid) {
          return false
        }
        if (this.id) {
          this.loading = true
          // 根据换行解析域名
          const oparray = space2Array(this.dataFormDomain.url)
          const domains = oparray.map(item => item.trim())
          this.dataFormDomain.domain = domains
          this.dataFormDomain.id = this.id

          try {
            this.loading = true
            await Category.createDomains(this.dataFormDomain)
            this.$message({
              message: '添加域名成功',
              type: 'success',
            })
            this.loading = false
          } catch (e) {
            this.loading = false
            console.log(e)
          }
        }
      })
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
