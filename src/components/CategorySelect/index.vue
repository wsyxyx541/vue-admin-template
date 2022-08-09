<template>
  <div>
    <!-- 
        :inline:代表的是行内表单，行内表单就是一行可以有多个表单元素
     -->
    <el-form :inline="true" class="demo-form-inline" :model="itemForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="itemForm.category1id"
          @change="handlerchange"
          :disabled="dis"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="item in list1"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="itemForm.category2id"
          @change="handlerchange2"
          :disabled="dis"
        >
          <el-option
            :label="item2.name"
            :value="item2.id"
            v-for="item2 in list2"
            :key="item2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="itemForm.category3id"
          @change="handlerchange3"
          :disabled="dis"
        >
          <el-option
            :label="item3.name"
            :value="item3.id"
            v-for="item3 in list3"
            :key="item3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["dis"],
  data() {
    return {
      //一级分类的数据
      list1: [],
      //二级分类的数据
      list2: [],
      //三级分类的数据
      list3: [],
      //搜集相应的一级、二级、三级分类的id
      itemForm: {
        category1id: "",
        category2id: "",
        category3id: "",
      },
    };
  },
  //方法集合
  methods: {
    //获取一级分类数据的方法
    async getCatgory1List() {
      let result = await this.$API.attr.reqCategoryList();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    //获取二级分类数据的方法
    async getCatgory1List2() {
      let id = this.itemForm.category1id;
      //将id通过自定义事件传给父亲
      this.$emit("getCategoryId", { categoryid: id, level: 1 });
      let result = await this.$API.attr.reqCategoryList2(id);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    //获取三级分类的数据的方法
    async getCatgory1List3() {
      let id = this.itemForm.category2id;
      //将id通过自定义事件传给父亲
      this.$emit("getCategoryId", { categoryid: id, level: 2 });
      let result = await this.$API.attr.reqCategoryList3(id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    //当一级分类的值发生改变的时候触发
    handlerchange() {
      //清除数据
      this.itemForm.category2id = "";
      this.itemForm.category3id = "";
      this.list2 = [];
      this.list3 = [];
      //获取二级分类的数据
      this.getCatgory1List2();
    },
    //当二级分类的值发生改变的时候触发
    handlerchange2() {
      //清除数据
      this.itemForm.category3id = "";
      this.list3 = [];
      //获取三级分类的数据
      this.getCatgory1List3();
    },
    //当三级分类的值发生改变的时候触发
    handlerchange3() {
      let id = this.itemForm.category3id;
      //将id通过自定义事件传给父亲
      this.$emit("getCategoryId", { categoryid: id, level: 3 });
    },
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  // 当组件挂载完毕，向服务器发送请求，获取相应一级分类的数据
  mounted() {
    this.getCatgory1List();
  },
};
</script>
<style scoped></style>
