<template>
  <div class="container">
    <el-row class="title" type="flex" justify="space-between">
      <el-col :span="8">以下为已缓存网站</el-col>
      <!-- <el-col :span="8" class="text-right">
        <el-button-group>
          <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle">添加</el-button>
        </el-button-group>
      </el-col> -->
    </el-row>
    <div class="wrap">
      <el-table size="mini" v-loading="dataListLoading" :data="dataList" border>
        <el-table-column prop="host" label="域名" header-align="center" align="center" width="150">
          <template slot-scope="scope">
             <el-link :href="'http://'+scope.row.host" target="_blank" type="primary">{{scope.row.host}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" header-align="center" align="center" />
        <el-table-column prop="keywords" label="关键字" header-align="center" align="center" />
        <el-table-column prop="template" label="模板" header-align="center" align="center" />
        <el-table-column prop="update_time" label="创建时间" header-align="center" align="center" />
        <el-table-column label="操作" fixed="right" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteHandle(scope.row.id)">清除</el-button>
            <!-- <el-button type="warning" size="mini" @click="setConfig(scope.row.id)">配置</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
    <config v-if="configVisible" ref="config" @refreshDataList="getDataList" />

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
import Website from '@/model/website'
import AddOrUpdate from './website-add-or-update'
import Config from './website-config.vue'
import mixinViewModule from '@/common/mixin/view-module'

export default {
  components: {
    AddOrUpdate,
    Config
  },
  mixins: [mixinViewModule],
  async created() {
    // const tags = await Tag.getTags()
    // this.tags = tags.list
  },
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListIsPage: true,
        getDataListModel: Website.getItems,
        deleteDataModel: Website.delectItem,
      },
      configVisible: false,
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
    setConfig(id) {
      this.configVisible = true
      this.$nextTick(() => {
        this.$refs.config.init(id)
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.el-tag {
  margin-bottom: 3px;
}
</style>
