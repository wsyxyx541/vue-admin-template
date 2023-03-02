<template>
  <div>
    <!-- 搜索框 -->
    <el-input
      placeholder="请输入用户的名字"
      v-model="input3"
      class="input-with-select"
      maxlength="10"
      show-word-limit
    >
      <template slot="prepend">查询用户</template>
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
      <el-table-column prop="time" label="日期" width="150"> </el-table-column>
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
          <el-button
            v-if="row.isfreeze == 0"
            @click.native="freeze(row)"
            type="primary"
            size="mini"
          >
            冻结用户
          </el-button>
          <el-button
            v-if="row.isfreeze == 1"
            @click.native="noFreeze(row)"
            type="danger"
            size="mini"
          >
            解冻用户
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
      input3: "",
    };
  },
  mounted() {
    this.getAllUser();
  },
  methods: {
    // 搜索用户
    async serach() {
      if (this.input3 == "") {
        return this.$message.error({ message: "输入不能为空" });
      }
      let info = {
        name: this.input3,
        page: this.page,
        pageSize: this.pageSize,
      };
      const result = await this.$api.userlist.getUserByName(info);
      if (result.code == 200) {
        this.tableData = result.data;
      } else {
        this.$message.error({ message: result.message });
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getAllUser();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAllUser();
    },
    // 冻结用户
    async freeze(row) {
      let info = {
        id: row.id,
      };
      let result = await this.$api.userlist.freezeUser(info);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: result.message,
        });
        this.getAllUser();
      } else {
        this.$message({
          type: "error",
          message: result.message,
        });
      }
    },
    // 解冻用户
    async noFreeze(row) {
      let info = {
        id: row.id,
      };
      let result = await this.$api.userlist.noFreezeUser(info);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: result.message,
        });
        this.getAllUser();
      } else {
        this.$message({
          type: "error",
          message: result.message,
        });
      }
    },
    //

    // 获取所有用户的信息
    async getAllUser() {
      let info = {
        page: this.page,
        pageSize: this.pageSize,
      };
      let result = await this.$api.userlist.getUserList(info);
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
