<template>
  <div>
    <el-card style="margin: 30px 0"
      ><CategorySelect
        @getCategoryId="getCategoryId"
        :dis="!scene == 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <!-- 展示SPU的结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 20px 0"
          :disabled="isDisabled"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="spuName"
            label="SPU名称"
            width="width"
          ></el-table-column>
          <el-table-column
            prop="description"
            label="SPU描述"
            width="width"
          ></el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里的按钮将来用hintButton替换 -->
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SPU的sku"
                @click="addSku(row)"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="updateSpu(row, $index)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看SPU的全部sku列表"
                @click="handleSkuList(row)"
              ></HintButton>
              <el-dialog
                :title="`${spu.spuName}的sku列表`"
                :visible.sync="dialogTableVisible"
                :before-close="close"
              >
                <el-table :data="skuList" v-loading="loading">
                  <el-table-column
                    property="skuName"
                    label="名称"
                    width="150"
                  ></el-table-column>
                  <el-table-column property="price" label="价格" width="200">
                  </el-table-column>
                  <el-table-column
                    property="weight"
                    label="重量"
                  ></el-table-column>
                  <el-table-column label="默认图片">
                    <template slot-scope="{ row }">
                      <img
                        :src="row.skuDefaultImg"
                        alt=""
                        style="width: 100px; height: 100px"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </el-dialog>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除SPU"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :total="total"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev,pager,next,jumper,->,sizes,total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spuForm"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeScene="changeScene"
      ></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      //存储从子组件那里获取的id数据
      categoryId: {
        category1id: "",
        category2id: "",
        category3id: "",
      },
      //控制添加属性在三级分类有值之后才开始显示，这里true表示不显示
      isDisabled: true,
      page: 1, //分页器当前第几页
      limit: 3, //每一页多少个
      records: [], //spu列表的数据
      total: 0, //分页器一共需要展示的条数
      scene: 0, //0代表展示SPU列表数据  1代表添加SPU|修改SPU  2代表添加SKU
      dialogTableVisible: false, //对话框的显示
      spu: {},
      skuList: [], //存储的是sku列表的数据
      loading: false, //点开对话框的时候有加载效果
    };
  },
  //方法集合
  methods: {
    //点击分页器，第几页按钮的回调
    handleCurrentChange(pager) {
      //修改参数
      this.page = pager;
      //再发请求
      this.getSpuList();
    },
    //修改页面展示个数的时候
    handleSizeChange(limit) {
      //修改参数
      this.limit = limit;
      //再发请求
      this.getSpuList();
    },
    //三级联动的自定义事件，可以把子组件的相应的id传递给父组件
    getCategoryId({ categoryid, level }) {
      if (level === 1) {
        this.categoryId.category1id = categoryid;
        this.categoryId.category2id = "";
        this.categoryId.category3id = "";
      } else if (level === 2) {
        this.categoryId.category2id = categoryid;
        this.categoryId.category3id = "";
      } else {
        //代表三级分类的id有了
        this.categoryId.category3id = categoryid;
        // 那么就可以发送请求了
        this.getSpuList();
        //三级分类有值了之后，添加属性按钮可以点击了
        this.isDisabled = false;
      }
    },
    //获取SPU列表的操作方法
    async getSpuList() {
      const { page, limit } = this;
      const { category3id } = this.categoryId;
      try {
        //携带三个参数page第几页 limit每一页显示多少条数据  三级分类id
        let result = await this.$API.spu.reqSpuList(page, limit, category3id);
        this.total = result.data.total;
        this.records = result.data.records;
      } catch (error) {}
    },
    //添加SPU按钮的回调
    addSpu() {
      this.scene = 1;
      //通知子组件发请求--两个
      this.$refs.spuForm.addSpupdate(this.categoryId.category3id);
    },
    //修改某个Spu的回调
    updateSpu(row, index) {
      this.scene = 1;
      this.$refs.spuForm.initSpuData(row);
    },
    //自定义事件回调（spuForm）
    changeScene({ scene, flag }) {
      //切换场景
      this.scene = scene;
      //子组件通知父组件更换场景的，需要再次获取列表进行展示
      //由于添加和修改切换场景的时候，回到的页面不一样
      if (flag == "1") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    //删除spu按钮的回调
    async deleteSpu(row) {
      try {
        await this.$API.spu.reqDeletespu(row.id);
        this.$message.success("删除成功");
        if (this.records.length == 1) {
          this.page = this.page - 1;
        }
        this.getSpuList(this.page);
      } catch (error) {
        this.$message.error("删除失败");
      }
    },
    //添加sku按钮的回调
    addSku(row) {
      //切换场景为2
      this.scene = 2;
      //父组件调用子组件的方法，让子组件发请求 --- 3个
      this.$refs.sku.getData(
        this.categoryId.category1id,
        this.categoryId.category2id,
        row
      );
    },
    //查看sku列表的回调
    async handleSkuList(row) {
      //展示loading
      this.loading = true;
      //点击之后对话框可见
      this.dialogTableVisible = true;
      //保存spu的信息
      this.spu = row;
      //发请求
      let result = await this.$API.spu.reqSkuList(row.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    //关闭对话框的回调
    close(done) {
      //清楚skuList的数据
      this.skuList = [];
      //关闭对话框
      done();
    },
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
};
</script>
<style scoped></style>
