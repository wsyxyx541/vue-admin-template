<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
//引入echarts
import * as echarts from "echarts";
export default {
  name: "progressCharts",
  data() {
    return {};
  },
  //方法集合
  methods: {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    //配置数据
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        //最小值与最大值的设置
        min: 0,
        max: 100,
      },
      yAxis: {
        //隐藏y轴
        show: false,
        //均分
        type: "category",
      },
      series: [
        {
          //图标的形式--柱状图bar
          type: "bar",
          data: [78],
          barWidth: 10,
          color: "yellowgreen",
          //背景颜色
          showBackground: true,
          backgroundStyle: {
            color: "rgba(228, 226, 226, 1)",
          },
          label: {
            show: true,
            formatter: "|",
            position: "right",
            color: "rgba(188, 184, 184, 1)",
          },
        },
      ],
      //布局的调试
      grid: {
        letf: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      //鼠标移动可以查看到柱状图上的数据
      tooltip: {},
    });
  },
};
</script>
<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
