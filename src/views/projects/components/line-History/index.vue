<template>
  <div id="lineHistory">
    <LineChart ref="output_chart" chart-id="output_chart" />
    <LineChart ref="output_liquid" chart-id="output_liquid" />
    <LineChart ref="ele-chart" chart-id="ele-chart" />
  </div>
</template>

<script>
import LineChart from "@/components/ECharts/LineMarker";
import { getHistoryData } from "@/api/welldetail";
import { ApiGetElectdata} from "@/api/realdata";
import dayjs from "dayjs";
export default {
  name: "lineHistory",
  components: {
    LineChart
  },
  watch: {},
  data() {
    return {};
  },
  methods: {
    //搜索日产量折线图
    getOutputChart(id, date) {
     function dataFormat(params) {
        if (params) {
          params *= 1000;
          return dayjs(params).format("MM/DD");
        } else {
          return "";
        }
      }
      let lines = {};
      lines = {
        wellid: id,
        action: "line",
        daterange: date,
        welldetail:"",
      };
      getHistoryData(lines).then(({ data }) => {
        let output_list = [];
        let dates_list = [];
        let level = [];
        // this.monthList = data.powers_month_list;
        data.msg.forEach(item => {
          dates_list.push(dataFormat(item.time));
          output_list.push(item.output);
          level.push(item.level);
        });
        // dates_list.reverse()
        // output_list.reverse()
        // level.reverse()
        let Output = {
          title: {
            text: "日产量折线图",
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
            data: dates_list
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
            symbol:'none', 
            barWidth: 20,
            data: output_list,
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
        this.$refs["output_chart"].initChart(Output);
        let OutputLiquid = {
          title: {
            text: "液面折线图",
            textStyle: {
              fontSize: 20
            },
            // padding:[1,40,23,60],
            padding: [1, 18]
          },
          tooltip: {
            trigger: "axis"
          },
          xAxis: {
            type: "category",
            name: "时间",
            boundaryGap: false,
            data: dates_list
          },
          yAxis: {
            type: "value",
            name: "米",
            axisLabel: { fontSize: 14 }
          },
          series: [
            {
              name: "液面",
              data: level,
              symbol:'none', 
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
              areaStyle: {}
            }
          ]
        };
        this.$refs["output_liquid"].initChart(OutputLiquid);
      });
    },
    //电流曲线图
    getEleChart(wellid) {
      ApiGetElectdata({id:wellid,p_type:'3',json:''}).then(res =>{
        let array = []   //自定义一个二维数组，存储X轴和Y的值
        let time = ''//日期
        let P144data = []
        let  x_list = []
        if(JSON.stringify(res) == "{}"){ //判断data是否为空
          array = []
        }else{
          
          if(res.data.datas){
            P144data =res.data.datas;
            time = res.data.time;            
            for (let i = 1 ; i <= P144data.length; i++){
              x_list.push(i)
            }     
            for(let i = 0;i < x_list.length;i++){
              array[i] = [x_list[i],P144data[i]]
            }
          }
          
        }        
        let customOption = {
          title: {
            text: "电流曲线:"+time 
          },
          tooltip: {
            trigger: "axis",
            formatter:function(params){
                  var tip = "";
                  let value1 = params[0].value;
                  let marker1 = params[0].marker;
                  tip = params[0].axisValue +'<br />'
                  tip = tip + marker1+'电流:' + params[0].value[1]
                    return tip;
                }
          },
          xAxis: {
            type: "category",
            data: x_list,
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
              data: array,
              type: "line",
              symbol:'none', 
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
  mounted() {
    // this.getOutputChart();
    // this.getEleChart();
  }
};
</script>

<style>
</style>