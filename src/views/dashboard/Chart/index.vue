<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0">
      <div slot="header">
        <div class="data-header">
          <span>网站数据一览</span>
        </div>
      </div>
      <div>
        <div class="charts" ref="charts"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
var _ = require("lodash");
//引入echarts
import * as echarts from "echarts";
export default {
  name: "Sale",
  props: ["dataList"],
  data() {
    return {
      mycharts: null,
    };
  },

  computed: {
    dataList1() {
      let info = _.cloneDeep(this.dataList);
      return info;
    },
  },
  //监听属性
  watch: {
    // 监视title
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    let _this = this;
    this.mycharts = echarts.init(this.$refs.charts);
    this.mycharts.setOption({
      title: {
        left: "center",
        top: "center",
        textStyle: {
          fontSize: 10,
        },
        subtextStyle: {
          fontSize: 10,
        },
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },
          labelLine: {
            show: true,
          },
          data: this.dataList1,
        },
      ],
    });

    this.mycharts.on("mouseover", function (params) {
      // 控制台打印数据的名称
      const { name, value } = params.data;
      _this.mycharts.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
  },
};
</script>
<style scoped>
.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.charts {
  width: 100%;
  height: 600px;
}
</style>
