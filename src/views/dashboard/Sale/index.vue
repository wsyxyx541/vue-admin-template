<template>
  <div>
    <el-card style="margin: 10px 0px">
      <div slot="header" class="clearfix">
        <!-- v-model="activeName" @tab-click="handleClick" -->
        <!-- 头部左侧内容 -->
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visite"></el-tab-pane>
        </el-tabs>
        <!-- 头部右侧内容 -->
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <!--  v-model="value1" -->
          <el-date-picker
            v-model="value1"
            class="date"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            size="mini"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>
      <el-row :gutter="10">
        <el-col :span="16">
          <!-- 容器  -->
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="8">
          <div class="right1">
            <h3>门店{{ title }}排名</h3>
            <ul>
              <li>
                <span class="index">1</span>
                <span>肯德基</span>
                <span class="value">123456</span>
              </li>
              <li>
                <span class="index">1</span>
                <span>肯德基</span>
                <span class="value">123456</span>
              </li>
              <li>
                <span class="index">1</span>
                <span>肯德基</span>
                <span class="value">123456</span>
              </li>
              <li>
                <span class="index">1</span>
                <span>肯德基</span>
                <span class="value">123456</span>
              </li>
              <li>
                <span class="index">1</span>
                <span>肯德基</span>
                <span class="value">123456</span>
              </li>
              <li>
                <span class="index">1</span>
                <span>肯德基</span>
                <span class="value">123456</span>
              </li>
              <li>
                <span class="index">1</span>
                <span>肯德基</span>
                <span class="value">123456</span>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
//引入echarts
import * as echarts from "echarts";
//引入dayjs
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "Sale",
  props: ["list"],
  data() {
    return {
      activeName: "sale",
      lineCharts: null,
      //收集日历的数据
      value1: [],
    };
  },
  //方法集合
  methods: {
    //本天
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.value1 = [day, day];
    },
    //本周
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.value1 = [start, end];
    },
    //本月
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.value1 = [start, end];
    },
    //本年
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.value1 = [start, end];
    },
  },
  computed: {
    ...mapState("home", ["list"]),
    //计算属性--标题
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
  },
  //监听属性
  watch: {
    title() {
      //重新修图标配置的数据
      //图表的数据可以再次修改，如果有新的值，新的值会覆盖原来的值，没有覆盖到的，依旧是原来的值
      this.lineCharts.setOption({
        title: {
          text: this.title,
        },
        xAxis: [
          {
            data:
              this.title == "销售额"
                ? this.list.orderFullYearAxis
                : this.list.userFullYearAxis,
          },
        ],
        series: [
          {
            data:
              this.title == "销售额"
                ? this.list.orderFullYear
                : this.list.userFullYear,
          },
        ],
      });
    },
    list() {
      this.lineCharts.setOption({
        xAxis: [
          {
            data: this.list.orderFullYearAxis,
          },
        ],
        series: [
          {
            data: this.list.orderFullYear,
          },
        ],
      });
    },
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    //初始化echarts实例
    this.lineCharts = echarts.init(this.$refs.charts);
    //配置数据
    this.lineCharts.setOption({
      title: {
        text: this.title,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
        },
      ],
    });
  },
};
</script>
<style scoped>
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.right span {
  margin: 0 10px;
  font-size: 14px;
}
.date {
  width: 330px;
  margin: 0 20px;
}
.charts {
  width: 100%;
  height: 300px;
}
.right1 h3 {
  margin: 0;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li {
  height: 8%;
  margin: 12px 0;
}
.index {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: black;
  text-align: center;
  margin-right: 30px;
}
li:nth-child(-n + 3) .index {
  background-color: black;
  color: white;
}
.value {
  float: right;
}
</style>
