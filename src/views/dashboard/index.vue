<template>
  <div class="dashboard-container">
    <h1>欢迎管理员</h1>
    <div class="dashboard-text">name: {{ name }}</div>
    <el-calendar v-model="value"> </el-calendar>
    <Chart v-if="flag" :dataList="dataList"></Chart>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Chart from "./Chart";
export default {
  name: "Dashboard",
  data() {
    return {
      value: new Date(),
      dataList: [],
      flag: false,
    };
  },
  components: { Chart },
  computed: {
    ...mapGetters(["name"]),
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 获取图表的数据
    async getData() {
      let result = await this.$api.userlist.getData();
      this.dataList = result.data;
      this.flag = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
    color: #304156;
  }
}
</style>
