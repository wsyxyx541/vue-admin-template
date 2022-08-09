<template>
  <div>
    <el-card style="margin: 50px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :dis="!isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 20px 0"
          :disabled="isDisabled"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格：展示平台属性 -->
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="180">
          </el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="item in row.attrValueList"
                :key="item.id"
                style="margin: 0 10px"
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm
                confirm-button-text="好的"
                cancel-button-text="不用了"
                icon="el-icon-info"
                icon-color="red"
                :title="`确定删除${row.attrName}吗？`"
                @onConfirm="deleteAttr(row.attrId)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性或者修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" class="demo-form-inline" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          border
          style="width: 100%; margin: 20px 0"
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里的结构需要用到span和input来回的切换 -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                confirm-button-text="好的"
                cancel-button-text="不用了"
                icon="el-icon-info"
                icon-color="red"
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          :disabled="attrInfo.attrValueList.length < 1"
          @click="Save"
          >Save</el-button
        >
        <el-button @click="isShowTable = true">Cancel</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      //存储从子组件那里获取的id数据
      categoryId: {
        category1id: "",
        category2id: "",
        category3id: "",
      },
      //获取请求来的平台属性数据
      attrList: [],
      //这个属性是控制table列表的显示与隐藏的
      isShowTable: true,
      //控制添加属性在三级分类有值之后才开始显示，这里true表示不显示
      isDisabled: true,
      //搜集新增属性|修改属性使用的
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      },
    };
  },
  //方法集合
  methods: {
    //自定义事件的回调
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
        this.getAttrList();
        //三级分类有值了之后，添加属性按钮可以点击了
        this.isDisabled = false;
      }
    },
    //获取平台属性的数据
    async getAttrList() {
      let { category1id, category2id, category3id } = this.categoryId;
      let result = await this.$API.attr.reqAttrList(
        category1id,
        category2id,
        category3id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //添加属性值的回调
    addAttrValue() {
      //向属性值的数组里面添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        /* 这里的flag能被vue检测到的原因是，数组的替换与变更是能被vue检测到的，push这里是变更，所以这里的
        flag是一个响应式数据 */
        flag: true, //flag属性值：给每一个属性添加一个标记flag，用户切换查看模式与编辑模式，好处，每一个属性可以控制自己的模式的切换
      });
      //新增一个属性的时候自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //添加属性按钮的回调
    addAttr() {
      //点击添加属性之后，上面的分类就不能再动了

      //点击后会隐藏原来的表格
      this.isShowTable = false;
      //清除数据
      //搜集分类的id
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [],
        categoryId: this.categoryId.category3id, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      };
    },
    //修改某一个属性
    updateAttr(row) {
      //点击之后隐藏原来的表格
      this.isShowTable = false;
      //由于数据结构当中存在对象里面套数组，数组里面套对象，因此需要使用深拷贝来解决修改之后，不上传表格数据还是发生改变的情况
      //深拷贝和浅拷贝出现的频率很高，切记达到手写深拷贝和浅拷贝
      this.attrInfo = cloneDeep(row);
      //在修改某一个属性的时候，将相应的属性值元素加上flag这个标记
      this.attrInfo.attrValueList.forEach((item) => {
        //不能这样写，因为这样添加的flag不会是响应式数据，如果这样写了，只会发生变化，但是视图却不会发生改变
        // item.flag = false;
        //因为vue无法探测到普通新增的属性，所以vue给出了一个$set方法来新增响应式数据
        this.$set(item, "flag", false);
      });
    },
    //失去焦点的事件---切换为查看模式，展示span
    toLook(row) {
      if (row.valueName.trim() != "") {
        let isRepeat = this.attrInfo.attrValueList.some((item) => {
          //需要将row将数组里面判断的时候去除
          if (row !== item) {
            return row.valueName == item.valueName;
          }
        });
        if (isRepeat) {
          this.$message.error("输入属性值重复，请重新输入");
        } else {
          row.flag = false;
        }
      } else {
        this.$message.error("输入不能为空");
      }
    },
    //点击span，变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      //需要注意：点击span的时候，切换为input变为编辑模式，但是需要注意，对于浏览器而言，页面重绘和重排是需要时间的
      //点击span的时候，重绘重排一个input它是需要耗费时间，因此我们不可能一点击span立马获取到input
      //所以这里我们就要用到$nextTick，当节点渲染完成之后，再执行
      this.$nextTick(() => {
        //获取相应的表单元素实现聚焦
        this.$refs[index].focus();
      });
    },
    //气泡确认框的删除属性值
    //最新版本的饿了么ui点击确认的触发事件和脚手架使用的版本是不一致的，
    deleteAttrValue(index) {
      //当前删除属性值的操作是不需要发请求的，点击保存的时候会一并发送出去
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //保存，进行添加属性和修改属性的数据保存
    async Save() {
      /* 整理参数：
      如果用户添加了很多属性值，且属性值为空的不应该提交给服务器
      提交给服务器的时候不应该出现flag字段 */
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          //过滤掉属性值不为空的
          if (item.valueName != "") {
            //删除掉flag属性
            delete item.flag;
            return true;
          }
        }
      );
      try {
        //发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        //切换到展示表格
        this.isShowTable = true;
        this.$message({
          type: "success",
          message: "保存成功",
        });
        //保存成功以后需要再次获取平台属性进行展示
        this.getAttrList();
      } catch (error) {}
    },
    //删除请求来的表格属性
    //这里的删除不行是因为，如果是自己添加的数据，根本就没有attrId，但是如果是提供的数据，又删不了
    //而且网络请求返回的是undefined，说明这个接口很有可能是个假的
    async deleteAttr(attrId) {
      try {
        //发请求
        await this.$API.attr.reqDeleteAttr(attrId);
        //成功了之后
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.getAttrList();
      } catch (error) {}
    },
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
};
</script>
<style scoped></style>
