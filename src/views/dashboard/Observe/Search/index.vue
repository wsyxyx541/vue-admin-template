<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <div class="search-header">
          <span>线上热门搜索</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="12">
            <lineCharts></lineCharts>
          </el-col>
          <el-col :span="12">
            <lineCharts></lineCharts>
          </el-col>
        </el-row>
      </div>
      <!-- 表格 -->
      <el-table
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        border
      >
        <el-table-column label="排名" width="180" type="index">
        </el-table-column>
        <el-table-column label="搜索关键字" width="180"> </el-table-column>
        <el-table-column label="用户数" sortable> </el-table-column>
        <el-table-column label="周涨幅" sortable> </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination small layout="->,prev, pager, next" :total="50">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import lineCharts from "./lineCharts";
export default {
  name: "Search",
  data() {
    return {};
  },
  components: {
    lineCharts,
  },
  //方法集合
  methods: {
    formatter(row, column) {
      return row.address;
    },
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
};
</script>
<style lang="css" scoped>
/* 深度选择器 */
div >>> .el-card__header {
  border-bottom: 1px solid #eee;
}
.search-header {
  display: flex;
  justify-content: space-between;
}
</style>
