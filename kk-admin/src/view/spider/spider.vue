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
            <el-input v-model="dataForm.name" placeholder="请输入蜘蛛名称" clearable />
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
          <el-form-item>
           <lin-date-picker @dateChange="handleDateChange" ref="searchDate" class="date"> </lin-date-picker>
          </el-form-item>

      </el-form>
      </el-col>

      <el-col :span="8" class="text-right">
        <el-button-group>
          <el-button type="primary" icon="el-icon-search" @click="getDataList">查询</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <!-- <div class="quantity-statistics">
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">今日访问量</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">11,590</div>
          </div>
        </div>
        <div class="quantity-icon"><img src="../../assets/image/about/icon.png" alt="" /></div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">总访问量</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">51,862</div>
          </div>
        </div>
        <div class="quantity-icon"><img src="../../assets/image/about/icon.png" alt="" /></div>
      </div>
    </div> -->
    <div class="wrap">
      <el-table size="mini" v-loading="dataListLoading" :data="dataList" border>
        <el-table-column prop="name" label="名字" header-align="center" align="center" />
        <el-table-column prop="ip" label="IP" header-align="center" align="center" />
        <el-table-column prop="country" label="地区" header-align="center" align="center" />
        <el-table-column prop="host" label="域名" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-link  type="primary">{{ scope.row.host }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路径" header-align="center" align="center" />
        <el-table-column prop="category_title" label="分组" header-align="center" align="center" />
        <el-table-column prop="type" label="类型" header-align="center" align="center" />
        <el-table-column prop="update_time" label="创建时间" header-align="center" align="center" />
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
import  Spider from '@/model/spider'
import LinDatePicker from '@/component/base/date-picker/lin-date-picker'
import AddOrUpdate from './spider-add-or-update'
import Config from './spider-config.vue'
import mixinViewModule from '@/common/mixin/view-module'

import { mapGetters } from 'vuex'

export default {
  components: {
    AddOrUpdate,
    Config,
    LinDatePicker
  },
  mixins: [mixinViewModule],
  async created() {
    // const statistics = await Spider.getStatistics()
    // this.tags = tags.list
  },
    computed: {
    ...mapGetters(['category'])
  },
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListIsPage: true,
        getDataListModel: Spider.getItems,
        deleteDataModel: Spider.delectItem,
      },
      configVisible: false,
      // 查询条件
      dataForm: {
        host:'',
        category_id:''
      },
      // 数据列表
      dataList: [],
      tags: [],
    }
  },
  methods: {
    handleDateChange(date) {
      this.searchDate = date
      this.dataForm.start = this.searchDate[0]
      this.dataForm.end = this.searchDate[1]

    },
    matchTag(tag_ids) {
      return this.tags.filter(item => tag_ids.includes(`${item.id}`))
    },
    setConfig(id) {
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
.quantity-statistics {
    display: flex;
    margin-top: 20px;
    height: 90px;
    padding: 0 20px;
    .quantity-item {
      display: flex;
      width: 23%;
      height: 100%;
      margin-right: 10px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 14px 0px rgba(243, 243, 243, 1);
      border-radius: 8px;
      .quantity-detail {
        flex: 1;
        .quantity-detail-box {
          margin: 12px 0 0 30px;
          .quantity-title {
            margin-bottom: 2px;
            height: 20px;
            line-height: 20px;
            color: #495468;
            font-size: 14px;
            font-weight: 400;
          }
          .quantity-border-line {
            width: 46px;
            height: 2px;
            background: rgba(73, 84, 104, 1);
          }
          .quantity {
            margin-top: 7px;
            height: 48px;
            font-size: 32px;
            color: rgba(73, 84, 104, 1);
            line-height: 38px;
            letter-spacing: 2px;
          }
        }
      }
      .quantity-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 90px;
        height: 100%;
        background: rgba(69, 119, 255, 0.1);
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        img {
          width: 28px;
          height: 33px;
        }
      }
    }
  }
</style>
