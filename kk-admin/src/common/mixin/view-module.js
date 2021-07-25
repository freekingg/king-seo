// import qs from 'qs'

export default {
  data() {
    /* eslint-disable */
    return {
      // 设置属性
      mixinViewModuleOptions: {
        createdIsNeed: true, // 此页面是否在 进入 时，调用查询数据列表接口？
        getDataListModel: '', // 获取数据方法
        deleteDataModel: '', // 删除数据方法
        getDataListIsPage: false, // 数据列表接口，是否需要分页？
        deleteIsBatch: false, // 删除接口，是否需要批量？
        deleteIsBatchKey: 'id', // 删除接口，批量状态下由那个key进行标记操作？比如：pid，uid...
        exportURL: '' // 导出接口，API地址
      },
      // 默认属性
      dataForm: {}, // 查询条件
      dataList: [], // 数据列表
      sums: {}, // 汇总数据
      order: '', // 排序，asc／desc
      orderField: '', // 排序，字段
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      dataListLoading: false, // 数据列表，loading状态
      dataListSelections: [], // 数据列表，多选项
      addOrUpdateVisible: false // 新增／更新，弹窗visible状态
    }
  },
  created() {
    if (this.mixinViewModuleOptions.createdIsNeed) {
      this.getDataList()
    }
  },
  methods: {
    /** 表单校验 */
    validForm(form) {
      return new Promise((resolve, reject) => {
        this.$refs[form].validate(valid => {
          if (valid) {
            console.log('校验通过', valid)
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    },
    // 获取数据
    async getDataList(info = {}) {
      this.dataListLoading = true
      try {
        let res = await this.mixinViewModuleOptions.getDataListModel({
          order: this.order,
          orderField: this.orderField,
          page: this.page - 1,
          count: this.limit,
          ...this.dataForm,
          ...info
        })
        this.dataList = res.list ? res.list : res
        this.total = res.total
        this.sums = this.mixinViewModuleOptions.hasSums ? res.sum : {}
        // 同步请求参数page到分页组件page
        this.dataForm.page ? (this.page = this.dataForm.page) : ''
        this.renderTable = false
        setTimeout(() => {
          this.renderTable = true
        }, 500)
      } catch (error) {
        console.log(error);
        this.dataList = []
        this.total = 1
      } finally {
        this.dataListLoading = false
      }
    },
    // 多选
    dataListSelectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 排序
    dataListSortChangeHandle(data) {
      if (!data.order || !data.prop) {
        this.order = ''
        this.orderField = ''
        return false
      }
      this.order = data.order.replace(/ending$/, '')
      this.orderField = data.prop.replace(/([A-Z])/g, '_$1').toLowerCase()
      this.getDataList()
    },
    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      this.page = 1
      this.limit = val
      this.getDataList()
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.page = val
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle(id = '') {
      let filterId = typeof id === 'object' ? '' : id
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = filterId
        this.$refs.addOrUpdate.init()
      })
    },
    // 删除
    deleteHandle(id) {
      this.$confirm('请确认是否删除此数据?', '提示', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
      ).then(async () => {
        await this.mixinViewModuleOptions.deleteDataModel(id)
        this.$message({
          message: '数据已删除',
          type: 'success',
          duration: 500,
          onClose: () => {
            this.getDataList()
          }
        })
      })
    },
    // 导出
    exportHandle() {
      // const params = qs.stringify({
      //   // token: cookieGet('token'),
      //   ...this.dataForm,
      // })
      // window.location.href = `${window.SITE_CONFIG.apiURL}${
      //   this.mixinViewModuleOptions.exportURL
      //   }?${params}`
    }
  }
}
