<template>
  <div>
    <el-table :data="records" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="scope">
          <img
            :src="scope.row.skuDefaultImg"
            alt=""
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column prop="price" label="价格" width="80"> </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="scope">
          <el-button
            type="success"
            icon="el-icon-bottom"
            size="mini"
            v-if="scope.row.isSale == 0"
            @click="handelCancelSale(scope.row)"
          ></el-button>
          <el-button
            v-else
            icon="el-icon-top"
            size="mini"
            @click="handelOnSale(scope.row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit()"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="handelCheck(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes, total"
      :total="total"
      style="text-align: center"
    >
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="40%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }} 元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              type="success"
              v-for="tag in skuInfo.skuAttrValueList"
              :key="tag.id"
              style="margin-right: 10px"
              >{{ tag.attrId }}-{{ tag.valueId }}</el-tag
            >
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="400px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" alt="" style="height: 100%" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1, //代表当前第几页
      limit: 3, //代表当前页面有多少项
      records: [], //存储sku列表的数据
      total: 0, //存储分页器一共展示的数据
      skuInfo: {}, //存储sku信息的
      drawer: false, //抽屉显示
    };
  },
  //方法集合
  methods: {
    //获取sku列表的方法
    async getSkuList() {
      //解构出默认参数
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    //点击当前页
    handleCurrentChange(pager) {
      //修改参数
      this.page = pager;
      //再发请求
      this.getSkuList();
    },
    //修改页面tabel的项的数目
    handleSizeChange(limit) {
      //修改参数
      this.limit = limit;
      //再发请求
      this.getSkuList();
    },
    //下架
    async handelCancelSale(row) {
      //发请求
      let result = await this.$API.sku.reqCancelSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message.success("下架成功");
      } else {
        this.$message.error("下架失败");
      }
    },
    //上架
    async handelOnSale(row) {
      //发请求
      let result = await this.$API.sku.reqOnSale(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message.success("上架成功");
      } else {
        this.$message.error("上架失败");
      }
    },
    //编辑按钮
    edit() {
      this.$message.info("正在开发中");
    },
    //查看详情
    async handelCheck(row) {
      //展开抽屉
      this.drawer = true;
      //获取sku的数据
      let result = await this.$API.sku.reqSkuById(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getSkuList();
  },
};
</script>
<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}
</style>
