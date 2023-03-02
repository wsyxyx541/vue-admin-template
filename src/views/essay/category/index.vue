<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px"
      @click="add"
    >
      添加分类
    </el-button>
    <!-- :data="data" -->
    <el-table style="width: 100%" border :data="categoryList">
      <el-table-column type="index" label="序号" width="80px">
      </el-table-column>
      <el-table-column prop="name" label="分类名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click.native="update(row)"
          >
            修改
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click.native="deleteitem(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="dialogFormVisible"
      :show-close="false"
    >
      <!-- 表单  -->
      <el-form :model="form" style="width: 70%" :rules="rules" ref="ruleForm">
        <el-form-item label="分类名称" label-width="100px" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click.native="SureAdd"> 确 定 </el-button>
      </div>
    </el-dialog>
    <!-- 分页器
    @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
     -->
    <!-- <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="1"
      :page-sizes="[10, 20, 50]"
      :page-size="3"
      layout="  prev, pager, next, jumper,->,sizes,total"
      :total="90"
    >
    </el-pagination> -->
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      categoryList: [],
      // 对话框显示与隐藏
      dialogFormVisible: false,
      // 表单元素
      form: {
        name: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 1 到 8个字符", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.getCategoryList();
  },
  methods: {
    // 取消
    cancel() {
      this.dialogFormVisible = false;
      this.form = { name: "" };
    },
    // 删除分类
    deleteitem(row) {
      this.$confirm("是否删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          console.log(row);
          let result = await this.$api.category.reqCategoryDelete(row);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: result.message,
            });
            this.getCategoryList();
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
            message: "已取消删除",
          });
        });
    },
    // 修改分类
    update(row) {
      this.dialogFormVisible = true;
      // 浅拷备
      this.form = { ...row };
    },
    // 点击添加分类
    add() {
      this.dialogFormVisible = true;
    },
    // 添加分类的接口||修改分类的接口
    SureAdd() {
      this.dialogFormVisible = false;
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          // 添加分类
          if (this.form.id == undefined) {
            const result = await this.$api.category.reqCategoryAdd(this.form);
            if (result.code == 200) {
              this.$message({
                message: result.message,
                type: "success",
              });
              this.getCategoryList();
            } else {
              this.$message({
                message: result.message,
                type: "error",
              });
            }
          }
          // 修改分类
          else {
            let result = await this.$api.category.reqCategoryUpdate(this.form);
            if (result.code == 200) {
              this.$message({
                message: result.message,
                type: "success",
              });
              this.getCategoryList();
            } else {
              this.$message({
                message: result.message,
                type: "error",
              });
            }
          }
        } else {
          this.$message({
            message: "输入不符合规范,请重新填写",
            type: "error",
          });
          return false;
        }
      });

      this.form = { name: "" };
    },
    // 获取分类的数据
    async getCategoryList() {
      let result = await this.$api.category.reqCategoryList();
      if (result.code == 200) {
        this.categoryList = result.data;
      } else {
        this.$message({
          message: result.message,
          type: "error",
        });
      }
    },
  },
};
</script>
<style scoped></style>
