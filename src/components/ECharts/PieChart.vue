<template>
  <div :id="chartId" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
import resize from "./resize";

export default {
  mixins: [resize],
  props: {
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "150px"
    },
    chartId: {
      type: String,
      default: "chart",
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.chart = echarts.init(document.getElementById(this.chartId));
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
      this.chart.showLoading();
    },
    /**
     * 父组件直接调用该方法即可渲染，但是父组件必须在其 mounted() 钩子中调用
     *
     * @param {string} title 饼图的标题文字，非必传
     * @param {Array} chartData 饼图的数据，必传,具体格式为[{ name:'demo', value: 10 }]
     *
     */
    initChart(title = "", chartData = []) {
      let options = {
        title: {
          text: title,
          textStyle: {
            fontSize: 14
          },
          left: "center",
          top: 0
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data:['开井','关井']
        },
        series: [
          {
            name: "状态",
            type: "pie",
            data: chartData,
            radius: ['45%', '80%'],
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                }
            },
          }
        ]
      };
      this.chart.setOption(options);
      this.chart.hideLoading();
      this.chart.on("click", (params)=> {
        this.$emit('click-item',params)
      });
    }
  }
};
</script>
