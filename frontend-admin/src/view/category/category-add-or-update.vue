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
import Config from '@/config'
import Category from '@/model/category'

export default {
  data() {
    return {
      Config,
      visible: false,
      dataForm: {
        id: '',
        title: '',
        summary: '',
      },
      dataRule: {
        title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        info: [],
      },
      loading: false,
    }
  },

  methods: {
    init() {
      this.visible = true
      this.$nextTick(async () => {
        this.$refs.dataForm.resetFields()

        if (this.dataForm.id) {
          const info = await Category.getCategory(this.dataForm.id)
          this.dataForm = info
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$refs.groupPermissions.getGroupPermissions()
    },
    // 表单提交
    async dataFormSubmitHandle() {
      this.$refs.dataForm.validate(async valid => {
        if (!valid) {
          // this.$message.error('请将信息填写完整')
          return false
        }

        if (!this.dataForm.id) {
          try {
            this.loading = true
            await Category.createCategory(this.dataForm)
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
            await Category.editCategory(this.dataForm.id, this.dataForm)
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
