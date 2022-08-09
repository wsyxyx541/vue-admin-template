<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU的名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="item.tmName"
            :value="item.id"
            v-for="item in tradeMarkList"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <!-- 上传图片
      list-type:文件列表的类型
      on-preview：图片预览的时候会触发
      on-remove：图片删除的时候会触发
       -->
      <el-form-item label="SPU图片"
        ><el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleUpload"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" /> </el-dialog
      ></el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
          value=""
          v-model="attrIdandName"
        >
          <el-option
            :value="`${unselect.id}:${unselect.name}`"
            :label="unselect.name"
            v-for="unselect in unSelectSaleAttr"
            :key="unselect.id"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 10px"
          :disabled="!attrIdandName"
          @click="handleAdd"
          >添加销售属性
        </el-button>
        <el-table
          border
          style="width: 100%; margin-top: 10px"
          :data="spu.spuSaleAttrList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(row, index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >+添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteAttr($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrupdate">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //存储spu信息
      //初始化的时候是一个空对象
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu的名称
        spuName: "",
        //品牌的id
        tmId: 0,
        //搜集spu图片的信息
        spuImageList: [
          /* {
            id: 0,
            imgName: "",
            imgUrl: "",
            spuId: 0,
          }, */
        ],
        //平台属性与属性值的搜集
        spuSaleAttrList: [
          /*  {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "",
                saleAttrName: "",
                saleAttrValueName: "",
                spuId: 0,
              },
            ],
          }, */
        ],
      },
      //存放品牌的信息
      tradeMarkList: [],
      //存储spu图片的数据
      spuImageList: [],
      //存放销售属性的列表
      saleAttrList: [],
      attrIdandName: "",
    };
  },
  //计算属性
  computed: {
    //计算出还未选择的销售属性
    unSelectSaleAttr() {
      //整个销售平台属性一共三个：颜色、尺寸、版本
      return this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
    },
  },
  //方法集合
  methods: {
    //照片墙删除
    handleRemove(file, fileList) {
      //file代表的是删除的那张图片
      //fileList:删除之后照片墙剩余的其他图片的数组
      //收集照片墙图片的数据
      //对于已有的图片【图片中有name和url字段的，有这个字段是因为饿了么ui照片墙展示的时候需要这两个字段，是后面添加的】
      this.spuImageList = fileList;
    },
    //照片墙预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //照片墙上传
    handleUpload(res, file, fileList) {
      //收集照片墙的数据
      this.spuImageList = fileList;
    },
    //初始化SpuForm的数据
    async initSpuData(row) {
      //获取spu信息的数据
      let spuResult = await this.$API.spu.reqSpu(row.id);
      if (spuResult.code == 200) {
        //在修改spu的时候，需要向服务器发送请求，把服务器返回的的数据（对象）赋值给spu属性
        this.spu = spuResult.data;
      }
      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取Spu图片的数据
      let imageResult = await this.$API.spu.reqSpuImageList(row.id);
      if (imageResult.code == 200) {
        let listAttr = imageResult.data;
        //由于照片墙显示图片的数据需要数组，数组里面的元素要有name和url字段
        //需要将服务器返回的数据进行修改
        listAttr.forEach((element) => {
          element.name = element.imgName;
          element.url = element.imgUrl;
        });
        //把整理好的数据赋值给spuImageList
        this.spuImageList = listAttr;
      }
      //获取平台全部的销售属性
      let attrResult = await this.$API.spu.reqBaseAttrList();
      if (attrResult.code == 200) {
        this.saleAttrList = attrResult.data;
      }
    },
    //点击添加spu按钮发请求的函数
    async addSpupdate(id) {
      //添加spu的时候收集三级分类的id
      this.spu.category3Id = id;
      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取平台全部的销售属性
      let attrResult = await this.$API.spu.reqBaseAttrList();
      if (attrResult.code == 200) {
        this.saleAttrList = attrResult.data;
      }
    },
    //添加销售属性
    handleAdd() {
      //把收集到的销售属性数据分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdandName.split(":");
      //向spu对象spuSaleAttrList属性列表里面添加新的属性
      let newAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] };
      //添加新的销售属性
      this.spu.spuSaleAttrList.push(newAttr);
      //清空数据
      this.attrIdandName = "";
    },
    //属性的关闭回调
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    //点击添加属性按钮的回调
    showInput(row) {
      //点击销售属性值当中添加按钮的时候，需要有button变为input，通过当前销售属性的inputVisible控制
      //挂载在销售属性身上的响应式数据inputVisible，控制着button与input的切换
      this.$set(row, "inputVisible", true);
      //通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row, "inputValue", "");
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //失焦或者点击回车触发的回调
    handleInputConfirm(row) {
      //解构出销售属性当中的数据
      const { baseSaleAttrId, inputValue } = row;
      //新增的销售属性值不能为空
      if (inputValue.trim() == "") {
        this.$message.error("属性值不能为空");
        return;
      }
      //新增的销售属性不能重复
      if (
        row.spuSaleAttrValueList.some(
          (item) => item.saleAttrValueName == inputValue
        )
      ) {
        this.$message.error("属性值不能重复");
        return;
      }
      //新增的销售属性值
      let newAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      //新增
      row.spuSaleAttrValueList.push(newAttrValue);
      //修改inputVisible,切换到button
      row.inputVisible = false;
    },
    //删除属性
    deleteAttr(index) {
      this.spu.spuSaleAttrList.splice(index, 1);
    },
    //保存修改或保存添加的回调
    async addOrupdate() {
      //整理参数:需要整理照片墙的数据
      //携带参数，对于图片，需要携带imageName与imageUrl字段
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      //发请求
      let result = await this.$API.spu.reqAddorUpdate(this.spu);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "保存成功",
        });
        //通知父组件回到场景0
        this.$emit("changeScene", { scene: 0, flag: this.spu.id ? "1" : "2" });
        //清除数据
        Object.assign(this._data, this.$options.data());
      } else {
        this.$message.error("保存失败");
      }
    },
    //取消按钮的回调
    cancel() {
      this.$emit("changeScene", { scene: 0, flag: "" }),
        //清理数据
        //Object.assign:es6中新增的方法可以合并对象
        //组件实例this._data，可以操作data当中的响应式数据
        //this.$options 是配置对象，里面有data函数
        Object.assign(this._data, this.$options.data());
    },
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
};
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
