<template>
  <div>
    <el-input
      placeholder="请输入要查询的留言"
      v-model="input3"
      class="input-with-select"
      maxlength="10"
      show-word-limit
    >
      <template slot="prepend">查询留言</template>
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="serach"
      ></el-button>
    </el-input>

    <el-table
      :data="tableData"
      style="width: 100%; margin: 20px auto"
      border
      stripe
    >
      <el-table-column prop="time" label="日期" width="160"> </el-table-column>
      <el-table-column
        prop="content"
        label="留言内容"
        width="700"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="操作" width="auto">
        <template slot-scope="{ row }">
          <el-button
            @click.native="showComment(row)"
            type="primary"
            size="mini"
          >
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

    <el-dialog title="文章留言" :visible.sync="dialogTableVisible">
      <el-avatar :size="50" :src="Url"></el-avatar>
      <h1 style="display: inline-block; margin-left: 20px">{{ name }}</h1>
      <span style="margin-left: 20px; display: block; line-height: 80px">{{
        content
      }}</span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      name: "",
      Url: "",
      input3: "",
      title: "",
      dialogTableVisible: false,
      content: "",
      direction: "rtl",
      tableData: [],
      page: 1,
      pageSize: 3,
      total: 0,
    };
  },
  mounted() {
    this.getCommentList();
  },
  methods: {
    // 检查非法留言
    async serach() {
      let info = {
        page: this.page,
        pageSize: this.pageSize,
        key: this.input3,
      };
      let result = await this.$api.comment.checkIllegality(info);
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

    handleCurrentChange(val) {
      this.page = val;
      this.getCommentList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getCommentList();
    },
    // 展示未审查的评论
    showComment(row) {
      this.dialogTableVisible = true;
      this.content = row.content;
      this.Url = row.img;
      this.name = row.name;
    },
    // 通过
    pass(row) {
      this.$confirm("即将审核通过留言, 是否继续?", "提示", {
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
          let info = { commentid: row.id };
          let result = await this.$api.comment.isCheckPass(info);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: result.message,
            });
            this.getCommentList();
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
    // 不通过
    noPass(row) {
      this.$confirm("即将审核不通过留言, 是否继续?", "提示", {
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
          let info = { commentid: row.id };
          let result = await this.$api.comment.isCheckNoPass(info);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: result.message,
            });
            this.getCommentList();
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
      /* const h = this.$createElement;
      this.$msgbox({
        title: "消息",
        message: h("p", null, [
          h("span", null, "内容可以是 "),

          h("i", { style: "color: teal" }, "VNode"),

          h("input", null, this.inputValue),
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 3000);
          } else {
            done();
          }
        },
      }).then((action) => {
        this.$message({
          type: "info",

          message: "action: " + action,
        });
      }); */
    },
    // 获取未审查的评论
    async getCommentList() {
      let info = {
        page: this.page,
        pageSize: this.pageSize,
      };
      let result = await this.$api.comment.getCommentList(info);
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
  },
};
</script>
<style scoped>
.el-input {
  width: 400px;
}
</style>
