<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%; margin: 20px auto"
      border
      stripe
    >
      <el-table-column
        prop="name"
        label="名字"
        width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="50"> </el-table-column>
      <el-table-column prop="age" label="年龄" width="50"> </el-table-column>
      <el-table-column
        prop="telephone"
        label="电话"
        width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="desc"
        label="描述"
        width="130"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="job"
        label="工作"
        width="150"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="mailbox"
        label="邮箱"
        width="150"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="img" label="用户头像" width="150">
        <template slot-scope="{ row }">
          <img
            v-if="row.img != 'null'"
            :src="row.img"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="auto">
        <template slot-scope="{ row }">
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
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      tableData: [],
      page: 1,
      pageSize: 3,
      total: 0,
    };
  },
  mounted() {
    this.getIscheckUser();
  },
  methods: {
    // 通过审核
    pass(row) {
      this.$confirm("即将审核通过该用户信息, 是否继续?", "提示", {
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
          let info = { id: row.id };
          let result = await this.$api.userlist.pass(info);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: result.message,
            });
            this.getIscheckUser();
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
    // 不通过审核
    noPass(row) {
      this.$confirm("即将审核不通过该用户信息, 是否继续?", "提示", {
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
          let info = { id: row.id };
          let result = await this.$api.userlist.noPass(info);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: result.message,
            });
            this.getIscheckUser();
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
    handleCurrentChange(val) {
      this.page = val;
      this.getAllUser();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAllUser();
    },
    // 获取待审核的用户信息列表
    async getIscheckUser() {
      let info = {
        page: this.page,
        pageSize: this.pageSize,
      };
      let result = await this.$api.userlist.getIscheckUser(info);
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
<style scoped></style>
