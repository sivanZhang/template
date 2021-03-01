<template>
  <div id="lineHistory">
    <LineChart ref="output_chart" chart-id="output_chart" />
    <LineChart ref="output_liquid" chart-id="output_liquid" />
    <LineChart ref="ele-chart" chart-id="ele-chart" />
  </div>
</template>

<script>
import dayjs from "dayjs";
import { ApiGetHistorydata ,ApiGetElectdata} from "@/api/realdata";
import LineChart from "@/components/ECharts/LineMarker";
export default {
  name: "lineHistory",
  components: {
    LineChart
  },
  watch: {},
  data() {
    return {
      lineHistoryData:[],
    };
  },
  methods: {
    //日产量折线图
    getOutputChart(wellid) {
      function dataFormat(dateVal) {
        return dayjs(dateVal).format("MM/DD");
      }
      ApiGetHistorydata({id:wellid,action:"line"}).then(res =>{
        let outputdata =[];
        let timedata =[];
        res.data.msg.forEach((item, index) => {
          outputdata.push(item.output);
         timedata.push(dataFormat(item.time));
          });      
      let customOption = {
        title: {
          text: "产量曲线图",
          textStyle: {
            fontSize: 20
          },
          // padding:[1,40,23,60],
          padding: [1, 18],
          left: "left",
          top: 0
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: []
        },
        xAxis: {
          name: "时间",
          nameTextStyle: { fontSize: 16 },
          type: "category",
          triggerEvent: true, //为标签添加触发事件
          axisLabel: {
            fontSize: 14
          },
          data:timedata
          // data: ["2019/02/11", "2019/02/15", "2019/02/17", "2019/02/18"]
        },
        yAxis: {
          type: "value",
          minInterval: 10,
          name: "吨",
          splitLine: { show: false },
          axisLabel: { fontSize: 14 },
          nameTextStyle: { fontSize: 16 }
        },
        series: {
          name: "产量",
          type: "line",
          barWidth: 20,
          data: outputdata,
          // data: [63, 10, 50, 30, 40, 50, 60, 60],
          itemStyle: {
            normal: {
              label: {
                show: false, //开启显示
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
      };
      this.$refs["output_chart"].initChart(customOption);
    })
    },
    //液面折线图
    getOutputLiquid(wellid) {
      function dataFormat(dateVal) {
        return dayjs(dateVal).format("MM/DD");
      }
      ApiGetHistorydata({id:wellid,action:"line"}).then(res =>{
        let leveldata =[];
        let timedata =[];
        res.data.msg.forEach((item, index) => {
          leveldata.push(item.level);
         timedata.push(dataFormat(item.time));
          }); 
      let customOption = {
        title: {
          text: "液面曲线图",
          textStyle: {
            fontSize: 20
          },
          // padding:[1,40,23,60],
          padding: [1, 18],
          left: "left",
          top: 0
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          nameTextStyle: { fontSize: 16 },
          name: "时间",
          boundaryGap: false,
          axisLabel: {
            fontSize: 14
          },
          data:timedata
        },
        yAxis: {
          type: "value",
          name: "米",
          axisLabel: { fontSize: 14 }
        },
        series: [
          {
            name: "液面",
            data: leveldata,
            type: "line",
            itemStyle: {
              normal: {
                label: {
                  show: false, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "black",
                    fontSize: 16
                  }
                }
              }
            },
            // areaStyle: {}
          }
        ]
      };
      this.$refs["output_liquid"].initChart(customOption);
      })
    },
    //电流曲线图
    getEleChart(wellid) {
      ApiGetElectdata({id:wellid,p_type:'3',json:''}).then(res =>{
        let P144data =res.data.datas;
        let time = res.data.time;
        let  x_list = []
           for (let i = 0 ; i < 145; i ++)
             x_list.push(i)
      let customOption = {
        title: {
          text: "电流曲线:"+time 
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          data: x_list,
          // data: [0,5, 10, 15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140],
        },
        yAxis: {
          type: "value",
          name: "安培",
          axisLabel: {
            fontSize: 14
          }
        },
        series: [
          {
            smooth: true,//光滑
            data: P144data,
            // data: [63, 10, 50, 30, 10, 50, 60, 60,45,25,48,12,47,36,45,15,25,44,2,5,25],
            type: "line",
            itemStyle: {
              normal: {
                label: {
                  show: false, //开启显示
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
      this.$refs["ele-chart"].initChart(customOption);
      })
    }
  },
  // mounted() {
  //   this.getOutputChart();
  //   this.getOutputLiquid();
  //   this.getEleChart();
  // }
};
</script>

<style>
</style>