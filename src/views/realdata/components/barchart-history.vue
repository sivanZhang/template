<template>
  <div class="left">
    <BarChart ref="powermonth" chart-id="powermonth" style="width:100%;height:380px;" />
    <BarChart ref="poweryear" chart-id="poweryear" style="width:100%;height:380px;" />
  </div>
</template>
<script>
import BarChart from "@/components/ECharts/BarMarker";
import { viewPowersMonth } from "@/api/welldetail";
export default {
  components: {
    BarChart
  },
  data() {
    return {};
  },
  methods: {
    // 父组件直接通过$refs[组件ref值].getPowerMonth(well的id)即可请求列表，切换筛选时自动调用的
    //月耗电量和年耗电量
    getPowerMonth(wellid) {
      viewPowersMonth({
        id: wellid
      }).then(({ data }) => {
        let month_power = [];
        let month_power_dates = [];
        data.powers_month_list.forEach(item => {
          month_power.push(item.power);
          month_power_dates.push(item.month);
        });
        let years_power = [];
        let years_power_dates = [];
        data.powers_year_list.forEach(item => {
          years_power.push(item.power);
          years_power_dates.push(item.year);
        });

        let powerMonthOption = {
          title: {
            text: "月耗电量"
          },
          tooltip: {
            trigger: "axis"
          },
          xAxis: {
            type: "category",
            data: month_power_dates
          },
          yAxis: {
            type: "value",
            name: "千瓦时",
            axisLabel: {
              fontSize: 14
            }
          },
          grid: {
            left: 50
          },
          series: [
            {
              data: month_power,
              type: "bar",
              barWidth: 20,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: "top", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "black",
                      fontSize: 16
                    }
                  }
                }
              }
            }
          ]
        };
        this.$refs["powermonth"].initChart(powerMonthOption);
        let powerYearOption = {
          title: {
            text: "年耗电量"
          },
          tooltip: {
            trigger: "axis"
          },
          xAxis: {
            type: "category",
            data: years_power_dates
          },
          yAxis: {
            type: "value",
            name: "千瓦时",
            axisLabel: {
              fontSize: 14
            }
          },
          grid: {
            left: 50
          },
          series: [
            {
              data: years_power,
              type: "bar",
              barWidth: 20,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: "top", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "black",
                      fontSize: 16
                    }
                  }
                }
              }
            }
          ]
        };
        this.$refs["poweryear"].initChart(powerYearOption);
      });
    }
  },
  // created() {
  //   this.getPowerMonth();
  // }
};
</script>