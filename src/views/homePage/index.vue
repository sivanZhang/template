<script>
import Chart from "@/components/ECharts/PieChart";
import LineChart from "@/components/ECharts/LineMarker";
import BarChart from "@/components/ECharts/BarMarker";
import BaiduMap from "@/components/ECharts/BaiduMap";
import { ApiGetHomedata } from "@/api/homeData";
import { ApiGetRealdata } from "@/api/realdata";
export default {
  name: "HomePage",
  components: {
    Chart,
    BarChart,
    LineChart,
    BaiduMap
  },
  data() {
    return {
      days: 1,
      dynamic: 1,
      openCount: "",
      stopCount: "",
      openPercentage: 0,
      total: "",
      wellId: [],
      id: 0
    };
  },
  methods: {
    homeData(days) {
      let data = { days: days };
      ApiGetHomedata(data).then(res => {
        let chartData = res.data;
        let wellName = [];
        let output = [];
        let level = [];
        this.openCount = chartData.open_count;
        this.stopCount = chartData.stop_count;
        this.openPercentage = Math.round(chartData.open_percentage);
        this.total = chartData.total;
        chartData.results.forEach(item => {
          wellName.push(item.well.name);
          output.push(item.output);
          level.push(item.level);
          this.wellId.push(item.well.id);
        });
        let chart = [
          {
            name: "开井",
            value: res.data.open_count
          },
          {
            name: "关井",
            value: res.data.stop_count
          }
        ];
        this.$nextTick(() => {
          this.$refs["well-status"].initChart("", chart);
        });
        let option1 = {
          title: {
            text: "产液量 TOP20",
            textStyle: {
              //---主标题内容样式
              color: "#000",
              fontSize: 20
              // height:"50px"
            },
            padding: [20, 18] //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          grid: {
            left: "3%",
            top: "20%",
            height: 300,
            containLabel: true
          },
          legend: {
            data: []
          },
          xAxis: [
            {
              name: "井号",
              nameTextStyle: { fontSize: 16 },
              type: "category",
              triggerEvent: true,
              data: wellName,
              // nameGap :15,
              axisLabel: {
                //---坐标轴 标签
                fontSize: 14,
                show: true, //---是否显示
                inside: false, //---是否朝内
                interval: 0,
                rotate: 45,
                margin: 5 //---刻度标签与轴线之间的距离
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "吨",
              splitLine: { show: false },
              axisLabel: {
                fontSize: 14
              },
              nameTextStyle: { fontSize: 16 }
            }
          ],
          series: [
            {
              name: "产液",
              type: "bar",
              barWidth: 20,
              barMaxWidth: 30,
              barCategoryGap: "30%",
              barGap: "0%",
              data: output,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: "top", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "black",
                      fontSize: 10
                    }
                  }
                }
              }
            }
          ]
        };
        let option2 = {
          title: {
            text: "液面高度",
            textStyle: {
              //---主标题内容样式
              color: "#000",
              fontSize: 20
              // height:"50px"
            },
            padding: [20, 18] //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          legend: {
            data: []
          },
          grid: {
            left: "3%",
            bottom: "18%",
            height: 300,
            containLabel: true
          },
          xAxis: {
            name: "井号",
            type: "category",
            nameTextStyle: { fontSize: 16 },
            data: wellName,
            axisLabel: {
              fontSize: 14,
              show: true, //---是否显示
              inside: false, //---是否朝内
              interval: 0,
              rotate: 45,
              margin: 5
            }
          },
          yAxis: {
            type: "value",
            name: "米",
            splitLine: { show: false },
            axisLabel: {
              fontSize: 14
            },
            nameTextStyle: { fontSize: 16 }
          },
          series: [
            {
              name: "液面高度",
              type: "bar",
              barWidth: 20,
              smooth: true,
              barMaxWidth: 30,
              barCategoryGap: "30%",
              barGap: "0%",
              data: level,
              itemStyle: {
                normal: {
                  label: {
                    // show: true, //开启显示
                    // position: "top", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "black",
                      fontSize: 10
                    }
                  }
                }
              }
            }
          ]
        };
        this.$refs["ouput"].initChart(option1);
        this.$refs["level"].initChart(option2);
      });
    },
    chart_reload(days) {
      this.dynamic = days;
      switch (days) {
        case 1:
          this.homeData(1);
          break;
        case 7:
          this.homeData(7);
          break;
        case 30:
          this.homeData(30);
          break;
        case 90:
          this.homeData(90);
          break;
        case 180:
          this.homeData(180);
          break;
        case 365:
          this.homeData(365);
          break;
      }
    },
    handleClickChart(params) {
      this.wellid = this.wellId[params.dataIndex];
      this.$router.push({
        name: "well-detail",
        params: { id: this.wellid },
        query: { type: params.pro_type }
      });
    }
  },
  created() {
    this.homeData(1);
  }
};
</script>
<template>
  <div id="home-page" ref="drawer-parent">
    <el-row :gutter="5">
      <el-col :sm="12" :lg="6">
        <el-col :sm="24">
          <el-row class="home-header-card" :sm="24" :lg="24">
            <router-link :to="{name:'realtime-data'}">
              <el-card shadow="always" class="home-header-item1">
                <div class="text-light">实时数据曲线</div>
                <img class="realDataImage" src="@/assets/realdata.png" alt />
              </el-card>
            </router-link>
          </el-row>
          <el-row class="home-header-card" :sm="24" :lg="24">
            <el-card shadow="always">
              <router-link :to="{name:'electricParamater'}">
                <div style="display:flex">
                  <img
                    style="width: 74px;height: 74px;margin-top:10px"
                    src="@/assets/electric.png"
                    alt
                  />
                  <div style="margin-left:20px;margin-top:40px">
                    <div class="prompt-text">电参数示功图</div>
                  </div>
                </div>
              </router-link>
            </el-card>
          </el-row>
          <el-row class="home-header-card" :sm="24" :lg="24">
            <el-card shadow="always">
              <router-link :to="{name:'systemAlarm'}">
                <div style="display:flex">
                  <img style="width: 76px;height: 74px;margin-top:10px" src="@/assets/warn.png" alt />
                  <div style="margin-left:20px;margin-top:40px">
                    <div class="prompt-text">系统警告</div>
                  </div>
                </div>
              </router-link>
            </el-card>
          </el-row>
        </el-col>
      </el-col>
      <el-col :sm="12" :lg="6">
        <el-col :sm="24">
          <el-row class="home-header-card" :sm="24" :lg="24">
              <router-link :to="{name:'history-data'}">
            <el-card class="home-header-item2" shadow="always">
              <div class="text-light">历史数据曲线</div>
                <img class="queryImage" src="@/assets/query.png" alt />
            </el-card>
               </router-link>
          </el-row>
          <el-row class="home-header-card" :sm="24" :lg="24">
            <el-card shadow="always">
              <router-link :to="{name:'suggestDiag'}">
                <div style="display:flex">
                  <img style="width: 80px;height: 82px;margin-top:10px" src="@/assets/work.jpg" alt />
                  <div class="prompt-text" style="margin-left:20px;margin-top:40px">建议工况诊断查询</div>
                </div>
              </router-link>
            </el-card>
          </el-row>
          <el-row class="home-header-card" :sm="24" :lg="24">
            <el-card shadow="always">
              <div style="display:flex">
                <img style="width: 76px;height: 74px;margin-top:10px" src="@/assets/output.jpg" alt />
                <div class="prompt-text" style="margin-left:20px;margin-top:40px">局域网数据传输</div>
              </div>
            </el-card>
          </el-row>
        </el-col>
      </el-col>
      <el-col :sm="12" :lg="6">
        <el-col :sm="24">
          <el-row class="home-header-card" :sm="24" :lg="24">
             <router-link :to="{name:'dataCurve'}">
            <el-card shadow="always" class="home-header-item3">
              <div class="text-light">数据曲线诊断</div>
                <img class="queryImage" src="@/assets/warning.png" alt />
            </el-card>
             </router-link>
          </el-row>
          <el-row class="home-header-card" :sm="24" :lg="24">
            <el-card
              shadow="always"
              style="height: 140px;"
              v-if="$store.state.login.userInfo.auth.manage_role"
            >
              <router-link :to="{name:'diagQuery'}">
                <div style="display:flex">
                  <img
                    style="width: 62px;height: 62px;margin-top:20px;margin-left:10px"
                    src="@/assets/deal.png"
                    alt
                  />
                  <div class="prompt-text" style="margin-left:20px;margin-top:40px">诊断查询处理</div>
                </div>
              </router-link>
            </el-card>
            <el-card shadow="always" style="height: 140px;" v-else>
              <el-tooltip effect="dark" content="没有权限" placement="top">
                <div style="display:flex">
                  <img
                    style="width: 62px;height: 62px;margin-top:20px;margin-left:10px"
                    src="@/assets/nodeal.png"
                    alt
                  />
                  <div
                    class="prompt-text"
                    style="margin-left:25px;margin-top:40px;color:gray"
                  >诊断查询处理</div>
                </div>
              </el-tooltip>
            </el-card>
          </el-row>
          <el-row class="home-header-card" :sm="24" :lg="24">
            <el-card shadow="always" style="height: 140px;">
              <router-link :to="{name:'pumpCycle'}">
                <div style="display:flex">
                  <img style="width: 82px;height: 78px;margin-top:10px" src="@/assets/info.jpg" alt />
                  <div class="prompt-text" style="margin-left:20px;margin-top:40px;">周波曲线分析</div>
                </div>
              </router-link>
            </el-card>
          </el-row>
        </el-col>
      </el-col>
      <el-col :sm="12" :lg="6">
        <el-col :sm="24">
          <el-row :sm="24" :lg="24">
            <el-card shadow="always" style="height:450px">
              <chart style="margin-top:50px" ref="well-status" chart-id="well-status" />
              <div
                class="prompt-text"
              >开井：{{this.openCount}} 关井：{{this.stopCount}} 总计：{{this.stopCount+this.openCount}}</div>
              <el-progress
                style="margin-top:30px"
                color="#28a745"
                :stroke-width="10"
                :percentage="openPercentage"
              ></el-progress>
            </el-card>
          </el-row>
          <!-- <el-row style="height:15px"></el-row>
          <el-row :sm="24" :lg="24">
            <el-card shadow="always">
              <div>
                <div class="prompt-text">告警</div>
                <strong style="color:black;font-size:15px">29 已处理 (40%)</strong>
                <el-progress
                  style="margin-top:10px"
                  color="#28a745"
                  :stroke-width="10"
                  :percentage="20"
                ></el-progress>
              </div>
              <div style="margin-top:10px">
                <div class="prompt-text">工况诊断</div>
                <strong style="color:black;font-size:15px">24 已完成 (20%)</strong>
                <el-progress
                  style="margin-top:10px"
                  color="#28a745"
                  :stroke-width="10"
                  :percentage="20"
                ></el-progress>
              </div>
            </el-card>
          </el-row>-->
        </el-col>
      </el-col>
    </el-row>
    <el-row class="home-header" style="margin:5px 3px">
      <!-- <el-col :lg="24" :sm="24"> -->
      <el-card shadow="always">
        <div class="btn-group" data-toggle="buttons" aria-label="First group">
          <div class="btn" :class="{colorChange:1 == dynamic}" @click="chart_reload(1)">
            <input type="radio" name="options" id="option1" />今天
          </div>
          <div class="btn" :class="{colorChange:7 == dynamic}" @click="chart_reload(7)">
            <input type="radio" name="options" id="option2" />近一周
          </div>
          <div class="btn" :class="{colorChange:30 == dynamic}" @click="chart_reload(30)">
            <input type="radio" name="options" id="option3" />近一月
          </div>
          <div class="btn" :class="{colorChange:90 == dynamic}" @click="chart_reload(90)">
            <input type="radio" name="options" id="option4" />近三月
          </div>
          <div class="btn" :class="{colorChange:180 == dynamic}" @click="chart_reload(180)">
            <input type="radio" name="options" id="option6" />近半年
          </div>
          <div class="btn" :class="{colorChange:365 == dynamic}" @click="chart_reload(365)">
            <input type="radio" name="options" id="option5" />近一年
          </div>
        </div>
        <el-col :lg="12">
          <BarChart @click-item="handleClickChart" ref="ouput" chart-id="output" />
        </el-col>
        <el-col :lg="12">
          <LineChart @click-item="handleClickChart" ref="level" chart-id="level" />
        </el-col>
      </el-card>
      <!-- </el-col> -->
      <!-- <el-col :lg="12">
        <el-card shadow="always">
          <BarChart
            @click-item="handleClickChart"
            ref="level"
            style="margin-top:50px"
            chart-id="level"
          />
        </el-card>
      </el-col>-->
    </el-row>
    <div style="margin-top:50px"></div>
  </div>
</template>
<style lang="scss">
#home-page {
  font-size: 16px;
  background-color: #f4f5f5;
  min-height: 100vh;
  position: relative;
  @mixin scrollStyle {
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 6px;
      cursor: pointer;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 0px;
      box-shadow: inset 0 0 0 #fff;
      background: rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 0 #fff;
      border-radius: 0;
      background: #fff;
    }
  }
  $border: 1px solid #dcdfe6;
  $linkColor: #2d8cf0;
  .el-card__body {
    @include scrollStyle;
  }
  .home-header {
    margin-bottom: 15px;
    .el-card {
      height: 480px;
    }
    .btn-group {
      display: flex;
      font-size: 15px;
      margin-bottom: 15px;
      .btn {
        border: 1px solid #212529;
        padding: 8px 15px;
        height: 35px;
        margin-left: 8px;
      }
      .colorChange {
        background: #262d37;
        color: #fff;
      }
    }
    .right {
      height: 70%;
      .prompt-text {
        display: flex;
        color: #6c757d;
        font-size: 15px;
      }
      .left-item {
        .el-card {
          height: 240px;
        }
      }
      .right-item {
        .el-card {
          height: 140px;
        }
      }
    }
  }
  .img-data {
    width: 74px;
    height: 74px;
    margin-top: 10px;
    margin-left: 40px;
  }
  .home-header-item2 {
    height: 140px;
    .queryImage {
      width: 290px;
      height: 50px;
      margin-top: 30px;
    }
  }
  .home-header-item3 {
    background: #ffc107;
    height: 140px;
    .queryImage {
      width: 290px;
      height: 50px;
      margin-top: 30px;
    }
  }
  .text-light {
    color: #f8f9fa;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  }
  .home-header-card {
    margin-bottom: 15px;
    .el-card {
      height: 140px;
    }
    .home-header-item1 {
      background: #63c2de;
    }
    .home-header-item2 {
      background: #20a8d8;
    }
    .home-header-item3 {
      background: #ffc107;
    }
    .home-header-item4 {
      background: #f86c6b;
    }
    .realDataImage {
      width: 290px;
      height: 60px;
      margin-top: 20px;
    }
    .warnImage {
      width: 300px;
      height: 60px;
      margin-top: 28px;
    }
    .statisticsImage {
      width: 290px;
      height: 60px;
      margin-top: 28px;
    }
  }
  .card-header {
    font-size: 14px;
    font-weight: 600;
  }
  .well {
    font-size: 30px;
    color: #101010;
    text-align: center;
    display: block;
    margin-top: 60px;
  }
}
</style>
