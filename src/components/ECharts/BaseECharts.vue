<template>
  <div :id="chartId" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from "echarts";
import resize from "./resize";
export default {
  name: "base-echarts",
  mixins:[resize],
  props: {
    chartId: {
      type: String,
      default: "echart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "320px"
    }
  },
  data() {
    return {
      chart: null,
      hasData: true
    };
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    // 父组件调用,开启加载动画
    openLoading() {
      this.chart.showLoading()
    },
    /**
     * 父组件直接调用该方法即可渲染，但是父组件必须在其 mounted() 钩子中调用
     *
     * @param {Object} option echarts配置
     *
     */
    initChart(cuntomOption) {
      this.chart = echarts.init(document.getElementById(this.chartId));
      this.chart.setOption({...cuntomOption });
      this.chart.hideLoading()
    }
  }
};
</script>
<style lang="scss" scoped>/* 
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
} */
</style>