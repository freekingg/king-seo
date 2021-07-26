<template>
  <div class="container">
    <el-row class="title container-header" type="flex">
      <!-- <el-col :span="4">以下为已缓存网站</el-col> -->
      <el-col :span="20">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.host" placeholder="请输入域名" clearable />
          </el-form-item>
          <el-form-item>
           <el-select v-model="dataForm.category_id" placeholder="请选择分组" clearable>
            <el-option
              v-for="item in category"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
          </el-form-item>
      </el-form>
      </el-col>

      <el-col :span="8" class="text-right">
        <el-button-group>
          <el-button type="primary" icon="el-icon-search" @click="getDataList">查询</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <div class="wrap">
      <el-table size="mini" v-loading="dataListLoading" :data="dataList" border>
        <el-table-column label="名称" prop="title"  header-align="center" align="center" width="300">
        </el-table-column>
        <el-table-column prop="category.title" label="分组" header-align="center" align="center" width="100" />
        <el-table-column label="地址" header-align="center" align="center" width="250">
          <template slot-scope="scope">
             <el-link :href="'http://' + scope.row.host+scope.row.path" target="_blank" type="primary">{{ scope.row.host }}{{ scope.row.path }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="update_time" label="创建时间" header-align="center" align="center" />
        <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
    <!-- <config v-if="configVisible" ref="config" :data="currentRow" @refreshDataList="getDataList" /> -->

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
import { mapGetters } from 'vuex'
import Post from '@/model/post'
// import Config from './website-config.vue'
import AddOrUpdate from './article-add-or-update.vue'

import mixinViewModule from '@/common/mixin/view-module'

export default {
  components: {
    AddOrUpdate,
    // Config,
  },
  mixins: [mixinViewModule],
    computed: {
    ...mapGetters(['category'])
  },
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListIsPage: true,
        getDataListModel: Post.getPosts,
        deleteDataModel: Post.delectPost,
      },
      previewContent:'',
      dialogVisiblePreview: false,
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
