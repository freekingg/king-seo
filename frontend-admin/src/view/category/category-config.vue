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
            <!-- <el-button type="primary" @click="submitLinks">提交</el-button> -->
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="替换管理">
        <el-form :model="dataFormReplace" :rules="dataRule" ref="dataFormReplace" label-width="100px">
          <el-form-item label="H标签替换">
            <el-switch v-model="dataFormReplace.htagReplace"></el-switch>
          </el-form-item>
          <el-form-item label="H标签链接">
            <el-switch v-model="dataFormReplace.htagLink"></el-switch>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitReplaceForm">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="全局代码">
        <el-form :model="globalForm" :rules="dataRule" ref="globalForm" label-width="80px">
          <el-form-item label="代码" prop="globalJs">
            <el-input
              v-model="globalForm.globalJs"
              :autosize="{ minRows: 15, maxRows: 15 }"
              type="textarea"
              placeholder="请输入js代码"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <code>
              可插入任意js代码,如统计代码，等等...(注意需要放在script标签内)
            </code>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitGlobalForm">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
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
import Domain from '@/model/domain'
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

    const checkJs = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('内容不能为空'))
      }

      let t = /<script.*?>([\s\S]+?)<\/script>/img

      if (!t.test(value)) {
        return callback(new Error('内容格式不正确,代码要写在script标签里面'))
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
        htagReplace: false,
        htagLink: false
      },
      dataFormLink: {
        content: '',
      },
      globalForm: {
        globalJs: '',
      },
      dataRule: {
        url: [{ required: true, message: '请输入域名', trigger: 'blur' }],
        globalJs: [{ validator: checkJs,required: true, trigger: 'blur' }],
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
          // 获取域名
          const {list,total} = await Domain.getCategoryDomains(this.id)
         let urls = ''
         list.map(item=>{
            urls += `${item.host}\n`
          })
          this.dataFormDomain.url = urls
          this.globalForm.globalJs = this.data.globalJs;
          this.dataFormReplace.htagReplace = this.data.htagReplace;
          this.dataFormReplace.htagLink = this.data.htagLink;
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    async submitReplaceForm(){
      if (this.id) {
       try {
            this.loading = true
            await Category.editCategory(this.id, {...this.data,...this.dataFormReplace,})
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 500,
            })
            this.$emit('refreshDataList')
          } catch (e) {
            this.loading = false
            console.log(e)
          }
        }
    },
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
          const domains = oparray.map((item,index) => {
            return {
              host: item.trim(),
              category_id: this.id
            }
          })
          this.dataFormDomain.domain = domains
          this.dataFormDomain.id = this.id

          try {
            this.loading = true
            await Domain.createDomains(this.dataFormDomain)
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
    async submitGlobalForm() {
      this.$refs.globalForm.validate(async valid => {
        if (!valid) {
          return false
        }

        try {
            this.loading = true
            await Category.editCategory(this.id, {...this.data,...this.globalForm})
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 500,
            })
            this.$emit('refreshDataList')
          } catch (e) {
            this.loading = false
            console.log(e)
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
