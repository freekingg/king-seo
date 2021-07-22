<template>
  <div class="container">
    <el-row class="title" type="flex" justify="space-between">
      <el-col :span="8">分组列表信息</el-col>
      <el-col :span="8" class="text-right">
        <el-button-group>
          <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle">添加</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <div class="wrap">
      <el-table size="mini" v-loading="dataListLoading" :data="dataList" border>
        <el-table-column prop="title" label="名称" header-align="center" align="center" width="150" />
        <el-table-column label="域名数量" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="getDomainNum(scope.row.id)">获取</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="summary" label="备注" header-align="center" align="center" />
        <el-table-column prop="update_time" label="创建时间" header-align="center" align="center" />
        <el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="setConfig(scope.row.id, scope.row)">配置</el-button>
            <el-button type="success" size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
            <el-button type="danger" size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
    <config v-if="configVisible" ref="config" :data="currentRow" @refreshDataList="getDataList" />

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
import Category from '@/model/category'
import AddOrUpdate from './category-add-or-update.vue'
import Config from './category-config.vue'
import mixinViewModule from '@/common/mixin/view-module'
import { space2Array } from '../../common/utils'

export default {
  components: {
    AddOrUpdate,
    Config,
  },
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListIsPage: true,
        getDataListModel: Category.getCategorys,
        deleteDataModel: Category.delectCategory,
      },
      configVisible: false,
      // 查询条件
      dataForm: {},
      // 数据列表
      dataList: [],
      tags: [],
      currentRow: null,
    }
  },
  methods: {
    async getDomainNum(id) {
      const domains = await Category.getCategoryDomains(id)
      // 根据换行解析域名
      const oparray = space2Array(domains)
      const num = oparray.map(item => item.trim())
      this.$alert(`当前分组下共有: ${num.length} 个域名`, '标题名称', {
        confirmButtonText: '确定',
      })
    },
    matchTag(tag_ids) {
      return this.tags.filter(item => tag_ids.includes(`${item.id}`))
    },
    setConfig(id, row) {
      this.currentRow = row
      this.configVisible = true
      this.$nextTick(() => {
        this.$refs.config.init(id)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.el-tag {
  margin-bottom: 3px;
}
</style>
