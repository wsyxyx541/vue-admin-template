<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="SKU价格(元)"
          v-model="skuInfo.price"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input
          placeholder="SKU重量(千克)"
          v-model="skuInfo.weight"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="规格描述"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdandValue">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select
              placeholder="请选择"
              v-model="saleAttr.saleAttrIdandValueId"
            >
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          border
          style="width: 100%"
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="prop" width="width" type="selection">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="scope">
              <img
                :src="scope.row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="scope">
              <el-button
                type="primary"
                v-if="scope.row.isDefault == 0"
                @click="changeDefault(scope.row)"
                >设置默认</el-button
              >
              <el-button type="success" v-else @click="cancelDefault(scope.row)"
                >默认</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSkuInfo">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      //存储图片信息的
      spuImageList: [],
      //存储销售属性的
      spuSaleAttrList: [],
      //存储平台属性的数据
      attrInfoList: [],
      //存储sku数据的字段
      skuInfo: {
        //第一类的数据：是父组件给的
        category3Id: "",
        spuId: 0,
        tmId: 0,
        //第二类的数据：需要通过数据v-model双向绑定
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类：需要自己写代码
        skuDefaultImg: "",
        skuImageList: [
          /* {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            isDefault: "string",
            skuId: 0,
            spuImgId: 0,
          }, */
        ],
        //平台属性
        skuAttrValueList: [
          {
            attrId: 0,
            valueId: 0,
          },
        ],
        //销售属性列表数据
        skuSaleAttrValueList: [
          /*  {
            id: 0,
            saleAttrId: 0,
            saleAttrName: "string",
            saleAttrValueId: 0,
            saleAttrValueName: "string",
            skuId: 0,
            spuId: 0,
          }, */
        ],
      },
      //父组件传过来的数据
      spu: {},
      //收集图片的数据字段:但是需要注意，收集的数据目前缺少isDefault字段，将来提交给服务器数据的时候，需要整理参数
      imageList: [],
    };
  },
  //方法集合
  methods: {
    //获取数据的回调
    async getData(category1id, category2id, row) {
      //收集父组件给予的数据
      this.skuInfo.category3Id = row.category3Id;
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId;
      this.spu = row;
      //获取图片的数据
      let resultImg = await this.$API.spu.reqSpuImageList1(row.id);
      if (resultImg.code == 200) {
        let List = resultImg.data;
        List.forEach((element) => {
          element.isDefault = 0;
        });
        this.spuImageList = List;
      }
      //获取销售属性的数据
      let resultSale = await this.$API.spu.reqSpuSaleAttrList(row.id);
      if (resultSale.code == 200) {
        this.spuSaleAttrList = resultSale.data;
      }
      //获取平台属性的数据
      let resultInfo = await this.$API.spu.reqAttrinfoList(
        category1id,
        category2id,
        row.id
      );
      if (resultInfo.code == 200) {
        this.attrInfoList = resultInfo.data;
      }
    },
    //取消按钮的回调
    cancel() {
      this.$emit("changeScene", { scene: 0, flag: "" });
      //清理数据
      //Object.assign:es6中新增的方法可以合并对象
      //组件实例this._data，可以操作data当中的响应式数据
      //this.$options 是配置对象，里面有data函数
      Object.assign(this._data, this.$options.data());
    },
    //table表格复选框按钮的事件
    handleSelectionChange(selection) {
      //获取到用户选中图片信息的数据，但是要注意，当前收集的数据当中，缺少isDefault字段
      this.imageList = selection;
    },
    //设置默认按钮的排他操作
    changeDefault(row) {
      //图片列表的数据的isDefault字段变为0
      this.spuImageList.forEach((ele) => {
        ele.isDefault = 0;
      });
      //点击的图片的变为1
      row.isDefault = 1;
      //收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //点击默认按钮取消默认
    cancelDefault(row) {
      row.isDefault = 0;
      //默认图片的地址置为空
      this.skuInfo.skuDefaultImg = "";
    },
    //保存按钮的回调
    async saveSkuInfo() {
      //整理数据
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;

      //将整理好的参数赋值给skuInfo.skuAttrValueList
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdandValue) {
          const [attId, valueId] = item.attrIdandValue.split(":");
          prev.push({ attId, valueId });
        }
        return prev;
      }, []);

      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdandValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.saleAttrIdandValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);

      //整理图片的数据
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgUrl: item.imgUrl,
          imgName: item.imgName,
          isDefault: item.isDefault,
          spuImgId: item.Id,
        };
      });
      //发请求
      let result = await this.$API.spu.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message.success("保存成功");
        this.$emit("changeScene", { scene: 0, flag: "" });
      } else {
        this.$message.error("保存失败");
      }
    },
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
};
</script>
<style scoped></style>
