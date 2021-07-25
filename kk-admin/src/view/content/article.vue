<template>
  <div class="container">
    <el-row class="title" type="flex" justify="space-between">
      <el-col :span="8">文章列表</el-col>
      <el-col :span="8" class="text-right">
        <el-button-group>
          <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle">添加</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <div class="wrap">
      <el-table size="mini" v-loading="dataListLoading" :data="dataList" border>
        <el-table-column label="名称"  header-align="center" align="center" width="200">
          <template slot-scope="scope">
             <el-link type="primary" @click="preview(scope.row)">{{scope.row.title}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="category.title" label="分组" header-align="center" align="center" />
        <el-table-column prop="summary" label="备注" header-align="center" align="center" />
        <el-table-column prop="update_time" label="创建时间" header-align="center" align="center" />
        <el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
            <el-button type="warning" size="mini" @click="download(scope.row.id)">下载</el-button>
            <el-button type="danger" size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
            <!-- <el-button type="warning" size="mini" @click="setConfig(scope.row.id, scope.row)">配置</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="预览前200行"
      :visible.sync="dialogVisiblePreview"
      width="40%">
      <el-input type="textarea" readonly :autosize="{ minRows: 16, maxRows: 20 }" v-model="previewContent"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblePreview = false">关 闭</el-button>
      </span>
    </el-dialog>

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
import Article from '@/model/article'
import AddOrUpdate from './article-add-or-update.vue'
import Config from './category-config.vue'
import mixinViewModule from '@/common/mixin/view-module'

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
        getDataListModel: Article.getArticles,
        deleteDataModel: Article.delectArticle,
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
    async preview(row){
      let {path}= row
      const data = await Article.getPreview({path})
      this.previewContent = data.content
      this.dialogVisiblePreview = true
    },
    async download(id){
      const data = await Article.download(id)
      window.open(data)
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
