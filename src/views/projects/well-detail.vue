<template>
  <div id="detail">
    <el-row :gutter="20">
      <el-col :span="9" :sm="24" :lg="9">
        <div class="left">
          <el-row>
            <el-col :span="13">
              <img
                style="width: 170px; height: 173px"
                src="@/assets/well_logo.png"
              />
            </el-col>
            <el-col :span="9">
              <div>
                <el-row>
                  <div>
                    <label class="well_no">{{ wellDetail.name }}</label>
                    <span v-if="wellDetail.status == 0">
                      <svg-icon icon-class="wellon" />
                    </span>
                    <span v-if="wellDetail.status == 1">
                      <svg-icon icon-class="welloff" />
                    </span>
                  </div>
                  <div
                    v-if="wellDetail.well_type == 0"
                    style="margin-top: 10px"
                  >
                    井类别：抽油机
                  </div>
                  <div
                    v-if="wellDetail.well_type == 1"
                    style="margin-top: 10px"
                  >
                    井类别：螺杆泵
                  </div>
                  <div v-if="wellDetail.status == 0">
                    开机时间:{{ wellDetail.changed_time }}
                  </div>
                  <div v-if="wellDetail.status == 1">
                    关机时间:{{ wellDetail.changed_time }}
                  </div>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" style="margin-left: 20px">
              <div>产量(吨)：{{ realDataDetail.output }}</div>
              <div>频率(Hz)：{{ realDataDetail.frequency }}</div>
              <!-- <div>油温：{{realDataDetail.oil_temperature}}</div> -->

              <div>日耗电(千瓦时)：{{ realDataDetail.power_consumption }}</div>

              <div v-if="wellDetail.well_type == 0">
                平衡度：{{ realDataDetail.balance }}
              </div>
              <div>有功(千瓦)：{{ realDataDetail.active }}</div>
              <div>冲程(米)：{{ realDataDetail.stroke }}</div>
              <div>电机功率(Kw)：{{ wellDetail.motor_power || "-" }}</div>
              <div v-if="wellDetail.well_type == 0">
                平衡块数量：{{
                  wellDetail.balance_num
                    ? balance_nums[wellDetail.balance_num - 1]
                    : "-"
                }}
              </div>
              <div>
                泵径(mm)：{{
                  realDataDetail.pump_diameter
                    ? realDataDetail.pump_diameter
                    : "-"
                }}
              </div>
              <div>泵挂(m)：{{ wellDetail.pump_hang || "-" }}</div>
              <div>
                运行状态：{{ wellDetail.run_status === 0 ? "工频" : "变频" }}
              </div>

              <div v-if="wellDetail.well_type == 0">
                平衡块重量1(Kn)：{{
                  realDataDetail.weight_1_small_balance || "-"
                }}
              </div>
              <div v-if="wellDetail.well_type == 0">
                平衡块重量2(Kn)：{{
                  realDataDetail.weight_2_small_balance || "-"
                }}
              </div>
              <div v-if="wellDetail.well_type == 0">
                平衡块重量3(Kn)：{{
                  realDataDetail.weight_1_big_balance || "-"
                }}
              </div>
              <div v-if="wellDetail.well_type == 0">
                平衡块重量4(Kn)：{{
                  realDataDetail.weight_2_big_balance || "-"
                }}
              </div>

              <!-- <div>
                诊断情况：{{
                  realDataDetail.diagnosis ? realDataDetail.diagnosis : "-"
                }}
              </div> -->
              <div>
                曲柄尺寸1(m)：{{
                  realDataDetail.size_1_crank
                    ? realDataDetail.size_1_crank
                    : "-"
                }}
              </div>

              <div>
                数据更新时间：{{ realDataDetail.time | dateTimeFormat }}
              </div>
              <div>机型名称：{{ this.type_name || "-" }}</div>
            </el-col>
            <el-col :span="11">
              <div>动液面(米):{{ realDataDetail.level }}</div>
              <div v-if="wellDetail.well_type == 0">
                建议调整量1(米)：{{ realDataDetail.adjustment1 }}
              </div>
              <div v-if="wellDetail.well_type == 0">
                建议调整量2(米)：{{ realDataDetail.adjustment2 }}
              </div>
              <div v-if="wellDetail.well_type == 0">
                建议调整量3(米)：{{ realDataDetail.adjustment3 }}
              </div>
              <div v-if="wellDetail.well_type == 0">
                建议调整量4(米)：{{ realDataDetail.adjustment4 }}
              </div>
              <div v-if="wellDetail.well_type == 0">
                建议调整量5(米)：{{ realDataDetail.adjustment5 }}
              </div>

              <div>电流(安培)：{{ realDataDetail.electric_current }}</div>
              <div v-if="wellDetail.well_type == 0">
                冲次(次/分) ：{{ realDataDetail.rush_times }}
              </div>
              <div v-else>转速：{{ realDataDetail.rush_times }}</div>
              <div>沉没度：{{ realDataDetail.sunken }}</div>
              <div>
                电机类型：{{
                  realDataDetail.motor_type === 1 ? "永磁" : "异步"
                }}
              </div>
              <div>
                油管外径(mm)：{{
                  realDataDetail.tubing_outer_diameter
                    ? realDataDetail.tubing_outer_diameter
                    : "-"
                }}
              </div>

              <!-- <div>
                变频运行：{{
                  realDataDetail.frequency_conversion_operation
                    ? realDataDetail.frequency_conversion_operation
                    : "-"
                }}
              </div> -->
              <div v-if="wellDetail.well_type == 0">
                平衡块尺寸1(m)：{{
                  realDataDetail.size_1_big_balance
                    ? realDataDetail.size_1_big_balance
                    : "-"
                }}
              </div>
              <div v-if="wellDetail.well_type == 0">
                平衡块尺寸2(m)：{{
                  realDataDetail.size_2_big_balance
                    ? realDataDetail.size_2_big_balance
                    : "-"
                }}
              </div>
              <div v-if="wellDetail.well_type == 0">
                平衡块尺寸3(m):
                {{
                  realDataDetail.size_1_small_balance
                    ? realDataDetail.size_1_small_balance
                    : "-"
                }}
              </div>
              <div v-if="wellDetail.well_type == 0">
                平衡块尺寸4(m):
                {{
                  realDataDetail.size_2_small_balance
                    ? realDataDetail.size_2_small_balance
                    : "-"
                }}
              </div>
              <div>含水：{{ wellDetail.watery ? wellDetail.watery : "-" }}</div>

              <div>
                曲柄重量1(Kn)：{{
                  realDataDetail.weight_1_crank
                    ? realDataDetail.weight_1_crank
                    : "-"
                }}
              </div>

              <div v-if="wellDetail.well_type == 0">
                偏置角：{{
                  realDataDetail.offset_angle
                    ? realDataDetail.offset_angle
                    : "-"
                }}
              </div>
              <div>
                机型转向：
                <span v-if="this.turn == 0">
                  {{ this.turn | wellTurn }}
                </span>
                <span v-if="this.turn == 1">
                  {{ this.turn | wellTurn }}
                </span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="left">
          <BarChart
            ref="powermonth"
            chart-id="powermonth"
            style="width: 100%; height: 380px"
          />
          <BarChart
            ref="poweryear"
            chart-id="poweryear"
            style="width: 100%; height: 380px"
          />
        </div>
      </el-col>
      <el-col :span="15" :sm="24" :lg="15">
        <div class="right">
          <el-row>
            <div class="selectTime" style="margin-left: 10px">
              <span>时间范围</span>
              <el-date-picker
                style="width: 350px"
                v-model="time"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>
              <el-button
                @click="search()"
                icon="el-icon-search"
                style="height: 27.99px; margin-left: -5px"
                type="primary"
              />
              <!-- <a target="__blank" href="/p144/p144/?">点击查看更多点位数据</a> -->
              <!-- <router-link
            style="cursor: pointer;"
            :to="{name:'comprehensiveQuery',}"
              >点击查看更多点位数据</router-link>-->
            </div>
          </el-row>
          <el-row>
            <el-tabs v-model="activeName" style="margin-left: 10px">
              <el-tab-pane label="产量及液面历史曲线" name="lineHistory">
                <lineHistory ref="lineHistory" />
              </el-tab-pane>
              <el-tab-pane label="产量及液面历史表格" name="tableHistory">
                <tableHistory ref="tableHistory" />
              </el-tab-pane>
              <el-tab-pane label="开关井记录" name="recordHistory">
                <recordHistory ref="recordHistory" />
              </el-tab-pane>
              <!-- <el-tab-pane label="实测数据表格" name="relMeasure">
                <relMeasure ref="relMeasure" />
              </el-tab-pane> -->
            </el-tabs>
          </el-row>
          <el-row>
            <dataOperation
              ref="dataOperation"
              :wellDetail="wellDetail"
              :auth="auth"
              @getWellDetails="getWellDetails"
            />
          </el-row>
        </div>
      </el-col>
    </el-row>
    <div style="margin-top: 50px"></div>
  </div>
</template>

<script>
import BarChart from "@/components/ECharts/BarMarker";
import lineHistory from "./components/line-History/index";
import tableHistory from "./components/table-History/index";
import recordHistory from "./components/record-History/index";
import relMeasure from "./components/rel-measure/index";
import dataOperation from "./components/operation/index";
import dayjs from "dayjs";
import { ApiGetElectdata, ApiGetNewestRealdata } from "@/api/realdata";
import {
  getWellDetail,
  viewPowersMonth,
  getHistoryData,
} from "@/api/welldetail";

export default {
  components: {
    BarChart,
    lineHistory,
    tableHistory,
    recordHistory,
    // relMeasure,
    dataOperation,
  },
  data() {
    return {
      endtime: "",
      activeName: "lineHistory",
      wellDetail: [],
      realDataDetail: {},
      monthList: [],
      num: "",
      auth: "",
      balance_nums: [
        "4个大平衡块",
        "4个小平衡块",
        "2个大平衡块",
        "2个小平衡块",
        "2个大平衡块和2个小的平衡块",
        "没有平衡块",
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "自定义",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      lowerlimit: "",
      toplimit: "",
      well_type: "",
      time: {},
      turn: "", //油井转向
      type_name: "", //机型名称
    };
  },
  methods: {
    //月耗电量和年耗电量
    getPowerMonth() {
      viewPowersMonth({
        id: this.$route.params.id,
      }).then(({ data }) => {
        let month_power = [];
        let month_power_dates = [];
        // this.monthList = data.powers_month_list;
        data.powers_month_list.forEach((item) => {
          month_power.push(item.power);
          month_power_dates.push(item.month);
        });
        let years_power = [];
        let years_power_dates = [];
        // this.monthList = data.powers_month_list;
        data.powers_year_list.forEach((item) => {
          years_power.push(item.power);
          years_power_dates.push(item.year);
        });

        let powerMonthOption = {
          title: {
            text: "月耗电量",
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            data: month_power_dates,
          },
          yAxis: {
            type: "value",
            name: "千瓦时",
            axisLabel: {
              fontSize: 14,
            },
          },
          grid: {
            left: 50,
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
                      fontSize: 16,
                    },
                  },
                },
              },
            },
          ],
        };
        this.$refs["powermonth"].initChart(powerMonthOption);
        let powerYearOption = {
          title: {
            text: "年耗电量",
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            data: years_power_dates,
          },
          yAxis: {
            type: "value",
            name: "千瓦时",
            axisLabel: {
              fontSize: 14,
            },
          },
          grid: {
            left: 50,
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
                      fontSize: 16,
                    },
                  },
                },
              },
            },
          ],
        };
        this.$refs["poweryear"].initChart(powerYearOption);
      });
    },
    //搜索页面产量
    search(time) {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      this.$refs["lineHistory"].getOutputChart(
        this.$route.params.id,
        dataFormat(this.time[0]) + "-" + dataFormat(this.time[1])
      );
      this.$refs["lineHistory"].getEleChart(this.$route.params.id);
      this.$refs["tableHistory"].getHistoryData(
        this.$route.params.id,
        dataFormat(this.time[0]) + "-" + dataFormat(this.time[1])
      );
      this.$refs["recordHistory"].getRecordData(
        this.$route.params.id,
        dataFormat(this.time[0]) + "-" + dataFormat(this.time[1])
      );
    },
    //井的详情信息
    getWellDetails() {
      function timeDateFormat(date) {
        if (date) {
          date *= 1000;
          return dayjs(date).format("YYYY/MM/DD HH:mm:ss");
        } else {
          return "";
        }
      }
      getWellDetail({ wellid: this.$route.params.id, welldetail: "" }).then(
        ({ data }) => {
          this.wellDetail = data.msg;
          this.wellDetail.changed_time = timeDateFormat(data.msg.changed_time);
          this.num = this.wellDetail.number;
          this.lowerlimit = this.wellDetail.lowerlimit;
          this.toplimit = this.wellDetail.toplimit;
          this.well_type = this.wellDetail.well_type;
          this.turn = this.wellDetail.pumping_type.turn;
          this.type_name = this.wellDetail.pumping_type.type_name;
          this.auth = data.auth.order;
          this.$nextTick(() => {
            this.$refs["dataOperation"].number = this.num;
          });
          this.$nextTick(() => {
            this.$refs["dataOperation"].auth = this.auth;
          });
          this.$nextTick(() => {
            this.$refs["dataOperation"].lowerlimit = this.lowerlimit;
          });
          this.$nextTick(() => {
            this.$refs["dataOperation"].toplimit = this.toplimit;
          });
          this.$nextTick(() => {
            this.$refs["dataOperation"].well_type = this.well_type;
          });
        }
      );
      this.$nextTick(() => {
        this.$refs["lineHistory"].getOutputChart(this.$route.params.id);
      });
      this.$nextTick(() => {
        this.$refs["lineHistory"].getEleChart(this.$route.params.id);
      });
      this.$nextTick(() => {
        this.$refs["tableHistory"].getHistoryData(this.$route.params.id);
      });
      this.$nextTick(() => {
        this.$refs["recordHistory"].getRecordData(this.$route.params.id);
      });
      // this.$nextTick(() => {
      //   this.$refs["relMeasure"].getMeasureData(this.$route.params.id);
      // });
    },
    //获取最新的实时数据
    getNewEstRealData() {
      ApiGetNewestRealdata({ wellid: this.$route.params.id }).then((res) => {
        if (res.data.realdata.length) {
          this.realDataDetail = res.data.realdata[0];
        } else {
          this.realDataDetail = {};
        }
      });
    },
  },
  created() {
    this.getWellDetails();
    this.getNewEstRealData();
  },
  mounted() {
    this.getPowerMonth();
  },
};
</script>

<style lang="scss" scoped>
#detail {
  font-size: 12px;
  background-color: #f4f5f5;
  // height: calc(100vh - 84px);
  position: relative;
  .left {
    border: 1px solid rgba(0, 0, 0, 0.125);
    // height: 800px;
  }
  .right {
    border: 1px solid rgba(0, 0, 0, 0.125);
  }
}
.well_no {
  font-size: 17px;
  font-weight: 700;
}
div {
  font-size: 14px;
  margin-bottom: 0.5rem;
}
.selectTime {
  margin-top: 5px;
  margin-left: 5px;
}
</style>
