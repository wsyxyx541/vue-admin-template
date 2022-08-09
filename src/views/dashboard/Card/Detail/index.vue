<template>
  <div>
    <div class="card-header">
      <span>{{ title }}</span>
      <i class="el-icon-info"></i>
    </div>
    <div class="card-content">{{ count }}</div>
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Detail",
  props: ["title", "count"],
  data() {
    return {};
  },
  //方法集合
  methods: {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  color: #d9d9d9;
}
.card-content {
  font-size: 30px;
  font-weight: 700;
  padding: 10px;
}
.card-charts {
  height: 50px;
}
.card-footer {
  border-top: 1px solid #eee;
  padding-top: 5px;
}
</style>
