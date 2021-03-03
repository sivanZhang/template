<template>
  <!-- echarts二次封装 -->
  <div :class="className" ref="echart-el"></div>
</template>
<script>
import debounce from "lodash/debounce";
// 自定义echarts风格
const echarts = require("echarts");
export default {
  props: {
    // 给echarts的DOM绑定class，使父组件可以改变CSS属性
    className: {
      type: String
    },
    // 自定义echarts顶配置
    options: {
      type: Object,
      required: true
    },
    // echart内部有缓存,true=不缓存,false=缓存
    notMerge: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      $_resizeHandler: null,
      chartsIns: null
    };
  },
  watch: {
    options: {
      async handler() {
        await this.$nextTick();
        this.setOption();
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.initChart();
    this.$_resizeHandler = debounce(() => {
      if (this.chartsIns) {
        this.chartsIns.resize();
      }
    }, 100);
    this.$_initResizeEvent();
  },
  beforeDestroy() {
    this.$_destroyResizeEvent();
    if (this.chartsIns != null) {
      this.chartsIns.dispose();
    }
  },
  activated() {
    this.$_initResizeEvent();
  },
  deactivated() {
    this.$_destroyResizeEvent();
  },
  methods: {
    initChart() {
      if (this.chartsIns) return;
      this.chartsIns = echarts.init(this.$refs["echart-el"], "", {
        renderer: "svg"
      });
    },
    setOption() {
      let options = this.options;
      this.chartsIns.setOption(options, {
        notMerge: this.notMerge
      });
    },
    $_initResizeEvent() {
      window.addEventListener("resize", this.$_resizeHandler);
    },
    $_destroyResizeEvent() {
      window.removeEventListener("resize", this.$_resizeHandler);
    }
  }
};
</script>
