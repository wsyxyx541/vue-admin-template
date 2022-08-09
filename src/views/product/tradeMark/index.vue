<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
    >
      添加
    </el-button>
    <!-- 表格组件
    data:表格组件将来展示的数据 --- 数组类型
    element ui 当中的table组件是以一列一列展示的 -->
    <el-table border :data="list">
      <el-table-column
        label="序号"
        align="center"
        width="100px"
        type="index"
      ></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌logo">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTrademark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 30px; text-align: center"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[5, 6, 7, 8]"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- 对话框
    :visible.sync 控制对话框显示与隐藏用的
    -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单
     :model="form" 动态搜集表单数据,搜集到那个对象的身上，将来表单验证也需要这个属性

     Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
     并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
     -->
      <el-form :model="tmForm" style="width: 80%" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!--             
            :on-success="handleAvatarSuccess" 图片上传成功之后的回调
            可以检测到图片上传成功，当照片成功上传会执行一次
            :before-upload="beforeAvatarUpload" 图片上传之前之后的回调
            可以在上传图片之前会执行一次  
            注意这里不能使用v-model，因为不是表单元素
            action：设置图片上传的地址
            -->

          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrupdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--   -->
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      //代表的是分页器第几页
      page: 1,
      //代表当前页展示数据条数
      limit: 5,
      //总共数据条数
      total: 0,
      //列表展示的数据
      list: [],
      //控制对话框的显示，默认不显示
      dialogFormVisible: false,
      //收集品牌的信息
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      //表单验证规则
      rules: {
        //品牌名称的验证规则
        /* required:表示必须要校验字段（表单前面的名称通常会带一个星号） message：提示信息  trigger（触发方式）：用户行为设置（事件的设置blur失焦、change变化） */
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          //品牌名称的长度最小是2，最长是10，触发方式是文本内容发生变化
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        //品牌logo的验证规则
        logoUrl: [{ required: true, message: "请选择品牌的图片" }],
      },
    };
  },
  //方法集合
  methods: {
    async getPageList() {
      //解构出参数
      const { page, limit } = this;
      //获取品牌列表的接口
      //当你向服务器发送请求的时候服务器要带参数
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        //分别是展示数据的总条数与列表展示的数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    //点击页面的时候页面跳转
    handleCurrentChange(pager) {
      //修改参数
      this.page = pager;
      //再发请求
      this.getPageList();
    },
    //修改页面个数的时候
    handleSizeChange(limit) {
      //修改参数
      this.limit = limit;
      //再发请求
      this.getPageList();
    },
    //点击添加品牌按钮，显示对话框
    showDialog() {
      this.dialogFormVisible = true;
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //修改某一个品牌
    //row是当前品牌的一个对象
    updateTrademark(row) {
      this.dialogFormVisible = true;
      //将已有的信息展示给对话框
      this.tmForm = Object.assign(this.tmForm, row);
    },
    //删除一个品牌
    deleteTradeMark(row) {
      //弹框
      this.$confirm(`是否删除${row.tmName}品牌?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //当用户点击确认按钮的时候会触发
          //向服务器发送请求
          let result = await this.$API.trademark.reqDelteTradeMark(row.id);
          if (result.code == 200) {
            //如果删除成功
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //如果删除当前页的最后一个选项。那么他获取的数据，应该是上一页的数据
            if (this.list.length == 1) {
              this.page = this.page - 1;
            }
            //再次请求品牌列表的数据
            this.getPageList();
          }
        })
        .catch(() => {
          //当用户点击取消按钮的时候会触发
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //图片上传成功
    handleAvatarSuccess(res, file) {
      //res是上传成功之后，返回给前端的数据
      //file上传成功之后，服务器返回前端的数据
      this.tmForm.logoUrl = res.data;
    },
    //图片上传之前,判断上传图片的问题
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //添加按钮，添加品牌或者修改品牌
    addOrupdateTradeMark() {
      //当全部验证的字段通过，再去书写业务逻辑
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          //发请求（添加品牌或者修改品牌）
          let result = await this.$API.trademark.reqAddorUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            //弹出信息：添加品牌成功、修改品牌成功
            this.$message({
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            //添加或者修改品牌成功之后，需要再次获取品牌列表进行展示
            this.getPageList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  //组件挂载完毕发请求
  mounted() {
    //获取列表数据的方法
    this.getPageList();
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
