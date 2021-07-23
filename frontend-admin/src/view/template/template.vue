<template>
  <div class="container">
    <el-row class="title" type="flex" justify="space-between">
      <el-col :span="8">分组列表信息</el-col>
      <el-col :span="8" class="text-right">
        <el-button-group>
          <!-- <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle">添加</el-button> -->
          <el-button type="danger" :loading="syncLoading" icon="el-icon-picture-outline-round" @click="syncTemplate">同步文件夹中模板数据</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <div class="wrap">
      <el-table size="mini" v-loading="dataListLoading" :data="dataList" border>
        <el-table-column prop="name" label="名称" header-align="center" align="center" width="150" />
        <el-table-column label="路径" prop="path" header-align="center" align="center"></el-table-column>
        <el-table-column prop="summary" label="备注" header-align="center" align="center" />
        <el-table-column prop="update_time" label="创建时间" header-align="center" align="center" />
        <el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="success"  size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
            <el-button type="danger" disabled size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
            <!-- <el-button type="warning" size="mini" @click="setConfig(scope.row.id,scope.row)">配置</el-button> -->
          </template>
        </el-table-column>
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
        getDataListModel: Template.getTemplates,
        deleteDataModel: Template.delectTemplate,
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
  methods: {
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
     await Template.syncTemplate()
     this.syncLoading = false
     this.getDataList()
    },
  },
}
</script>
<style lang="scss" scoped>
.el-tag {
  margin-bottom: 3px;
}
</style>
