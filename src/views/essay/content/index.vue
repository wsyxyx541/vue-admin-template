<template>
  <div>
    <el-input
      placeholder="请输入要查询的文章"
      v-model="input3"
      class="input-with-select"
      maxlength="10"
      show-word-limit
    >
      <template slot="prepend">查询文章</template>
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="serach"
      ></el-button>
    </el-input>
    <!--  -->
    <el-table
      :data="tableData"
      style="width: 100%; margin: 20px auto"
      border
      stripe
    >
      <el-table-column prop="time" label="日期" width="160"> </el-table-column>
      <el-table-column
        prop="title"
        label="文章标题"
        width="200"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="content"
        label="文章内容"
        width="300"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="img" label="文章封面图片" width="250">
        <template slot-scope="{ row }">
          <img
            v-if="row.image != 'null'"
            :src="row.image"
            alt=""
            style="width: 100px; height: 100px"
          />
          <span v-else>用户没有上传封面</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="auto">
        <template slot-scope="{ row }">
          <el-button @click.native="showEssay(row)" type="primary" size="mini">
            点击查看
          </el-button>
          <el-button @click.native="pass(row)" type="success" size="mini">
            审核通过
          </el-button>
          <el-button @click.native="noPass(row)" type="danger" size="mini">
            审核不通过
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器  @current-change="handleCurrentChange"
    -->
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="pageSize"
      layout="  prev, pager, next, jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer
      size="90%"
      :wrapperClosable="false"
      :title="title"
      :visible.sync="drawer"
      :direction="direction"
      custom-class="demo-drawer"
      ref="drawer"
    >
      <div class="el-drawer__body">
        <div class="demo-drawer__content">
          <div
            v-highlight
            v-html="content"
            class="overflowAuto markdown-body"
          ></div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import "github-markdown-css/github-markdown-light.css";
const marked = require("marked");
export default {
  name: "",
  data() {
    return {
      input3: "",
      title: "",
      drawer: false,
      loading: false,
      content: "",
      direction: "rtl",
      tableData: [],
      page: 1,
      pageSize: 3,
      total: 0,
    };
  },
  mounted() {
    this.getUnCheckedEssays();
  },
  methods: {
    async serach() {
      let info = {
        page: this.page,
        pageSize: this.pageSize,
        key: this.input3,
      };
      let result = await this.$api.content.getNewEssays(info);
      if (result.code == 200) {
        this.tableData = result.data;
        this.total = result.total;
      } else {
        this.$message({
          type: "error",
          message: result.message,
        });
      }
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.page = val;
      this.getUnCheckedEssays();
    },
    // 改变条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUnCheckedEssays();
    },
    // 审核通过
    pass(row) {
      this.$confirm("即将审核通过这篇文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 1000);
          } else {
            done();
          }
        },
      })
        .then(async () => {
          let info = { essayid: row.id };
          let result = await this.$api.content.checkRight(info);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: result.message,
            });
            this.getUnCheckedEssays();
          } else {
            this.$message({
              type: "error",
              message: result.message,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消通过",
          });
        });
    },
    // 审核没有通过
    noPass(row) {
      this.$confirm("即将不同意通过这篇文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 1000);
          } else {
            done();
          }
        },
      })
        .then(async () => {
          let info = { essayid: row.id };
          let result = await this.$api.content.checkNoRight(info);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: result.message,
            });
            this.getUnCheckedEssays();
          } else {
            this.$message({
              type: "error",
              message: result.message,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消不通过",
          });
        });
    },
    // 获取未审核的文章
    async getUnCheckedEssays() {
      let info = {
        page: this.page,
        pageSize: this.pageSize,
      };
      let result = await this.$api.content.getNewEssays(info);
      if (result.code == 200) {
        this.tableData = result.data;
        this.total = result.total;
      } else {
        this.$message({
          type: "error",
          message: result.message,
        });
      }
    },
    // 展示选中的文章
    async showEssay(row) {
      let result = await this.$api.content.getContent(row);
      if (result.code == 200) {
        this.content = marked.parse(result.data.content);
      } else {
        this.$message({
          type: "error",
          message: result.message,
        });
      }
      this.drawer = true;
      this.title = row.title;
    },
    // 抽屉的回调
    handleClose(done) {
      if (this.loading) {
        return;
      }
      this.$confirm("确定要提交表单吗？")
        .then((_) => {
          this.loading = true;
          this.timer = setTimeout(() => {
            done();
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false;
            }, 400);
          }, 2000);
        })
        .catch((_) => {});
    },
    cancelForm() {
      this.loading = false;
      this.drawer = false;
      clearTimeout(this.timer);
    },
  },
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 400px;
}
.el-drawer__body {
  flex: 1;
  overflow: auto;
}
.demo-drawer__content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.overflowAuto {
  padding: 30px;
  padding-top: 0;
  padding-bottom: 80px;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  height: 100%;
}
.overflowAuto::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
.overflowAuto::-webkit-scrollbar-thumb {
  background: rgb(224, 214, 235);
}
</style>
