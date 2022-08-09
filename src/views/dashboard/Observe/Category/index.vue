<template>
  <div>
    <el-card>
      <div slot="header">
        <div class="category-header">
          <span style="padding-top: 5px">销售额类别占比</span>
          <el-radio-group size="mini" v-model="value">
            <el-radio-button label="全部渠道"></el-radio-button>
            <el-radio-button label="线上"></el-radio-button>
            <el-radio-button label="门店"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div>
        <div class="charts" ref="charts"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
//引入echarts
import * as echarts from "echarts";
export default {
  name: "Category",
  data() {
    return {
      value: "全部渠道",
    };
  },
  //方法集合
  methods: {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    //初始化echarts实例
    let myChart = echarts.init(this.$refs.charts);
    //配置数据
    myChart.setOption({
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
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    });
    myChart.on("mouseover", function (params) {
      // 控制台打印数据的名称
      const { name, value } = params.data;
      myChart.setOption({
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
/* 深度选择器 */
div >>> .el-card__header {
  border-bottom: 1px solid #eee;
  padding: 13.2px 20px;
}
.category-header {
  display: flex;
  justify-content: space-between;
}
.charts {
  width: 100%;
  height: 254.4px;
}
</style>
