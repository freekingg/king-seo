<template>
  <div class="container">
    <el-row class="title" type="flex" justify="space-between">
      <el-col :span="8">收录信息</el-col>
      <el-col :span="8" class="text-right">
        <el-button-group>
          <el-button type="danger" :loading="syncLoading" icon="el-icon-picture-outline-round" @click="syncTemplate">一键查询</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <div class="wrap">
      <el-table size="mini" v-loading="dataListLoading" :data="dataList" border>
        <el-table-column prop="host" label="域名" header-align="center" align="center" width="150" />
        <el-table-column label="分类" prop="category.title" header-align="center" align="center"></el-table-column>
        <el-table-column label="收录数量" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text">0</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="update_time" label="创建时间" header-align="center" align="center" />
      </el-table>
    </div>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />

    <!-- 分页 -->
    <div class="pages">
      <el-pagination
        background
        slot="footer"
        :current-page="page"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import Domain from '@/model/domain'
import Template from '@/model/template'
import AddOrUpdate from './template-add-or-update.vue'
import mixinViewModule from '@/common/mixin/view-module'

export default {
  components: {
    AddOrUpdate,
  },
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListIsPage: true,
        getDataListModel: Domain.getDomains,
        deleteDataModel: Domain.delectDomain,
      },
      configVisible: false,
      syncLoading: false,
      // 查询条件
      dataForm: {},
      // 数据列表
      dataList: [],
      tags: [],
    }
  },
  created () {
    this.getDomains()
  },
  methods: {
    async getDomains(id) {
      const {list,total} = await Domain.getDomains()
      console.log(list)
    },
    matchTag(tag_ids) {
      return this.tags.filter(item => tag_ids.includes(`${item.id}`))
    },
    setConfig(id,row) {
      this.currentRow = row
      this.configVisible = true
      this.$nextTick(() => {
        this.$refs.config.init(id)
      })
    },
    async syncTemplate() {
     this.syncLoading = true
    //  await Template.syncTemplate()
     this.syncLoading = false
    //  this.getDataList()
    },
  },
}
</script>
<style lang="scss" scoped>
.el-tag {
  margin-bottom: 3px;
}
</style>
