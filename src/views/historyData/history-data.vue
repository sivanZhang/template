<template>
  <div id="historydata">
    <div class="data-title">
      <div class="title-text">历史数据曲线</div>
    </div>
    <div class="data-header">
      <el-card shadow="never">
        <el-row class="row-bg">
          <el-col :lg="4">
            井名&nbsp;:&nbsp;
            <el-select
              v-model="value"
              placeholder="请选择"
              style="width:130px;"
              @change="getWellDetails(value)"
              filterable
            >
              <!-- <el-option
                v-for="(item,index) of wellList"
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>-->
              <el-option
                v-for="(item, index) of wellList"
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :lg="6" class="col-bg" v-if="datePicker == ''"
            >起止日期&nbsp;:&nbsp;{{ time0 }}-{{ time1 }}</el-col
          >
          <el-col :lg="6" class="col-bg" v-else>时间范围：{{ date }}</el-col>
          <el-col :lg="3" class="col-bg">
            <el-button
              type="primary"
              @click="historyLine"
              style="margin-top:-10px;"
              >时间范围查询</el-button
            >
          </el-col>
          <el-col :lg="5" class="col-bg">
            <div v-if="wellDetail.well_type == 0">
              油井类别&nbsp;:&nbsp;抽油机
            </div>
            <div v-if="wellDetail.well_type == 1">
              油井类别&nbsp;:&nbsp;螺杆泵
            </div>
          </el-col>
          <el-col :lg="5">
            点数：
            <el-select
              v-model="datatype"
              placeholder="请选择点位数"
              @change="reGetElectdata()"
              filterable
              style="width:80px;"
            >
              <el-option label="145" :value="0"></el-option>
              <el-option label="200" :value="1"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <!-- 日电量 -->
    <div class="data-chart">
      <el-row :gutter="15" class="elchart">
        <el-card shadow="never" body-style="padding:0px;">
          <div class="chart">
            <LineChart
              ref="output_ele"
              chart-id="output_ele"
              style="height: 350px; "
            />
            <div class="dailylength">
              历史数据个数:{{ this.power_consuptionLength }}
            </div>
          </div>
        </el-card>
      </el-row>
    </div>
    <!-- 日产液量 -->
    <div class="data-chart">
      <el-row :gutter="15" class="elchart">
        <el-card shadow="never" body-style="padding:0px;">
          <div class="chart">
            <LineChart
              ref="output_chart"
              chart-id="output_chart"
              style="height: 350px; "
            />
            <div class="dailylength">历史数据个数:{{ this.totalLength }}</div>
          </div>
        </el-card>
      </el-row>
    </div>
    <!-- 平衡度 -->
    <div class="data-chart" v-if="wellDetail.well_type == 0">
      <el-row :gutter="15" class="elchart">
        <el-card shadow="never" body-style="padding:0px;">
          <div class="chart">
            <LineChart
              ref="balance_chart"
              chart-id="balance_chart"
              style="height: 350px; "
            />
            <div class="dailylength">历史数据个数:{{ this.balanceLength }}</div>
          </div>
        </el-card>
      </el-row>
    </div>
    <!-- 动液面 -->
    <div class="data-chart">
      <el-row :gutter="15" class="elchart">
        <el-card shadow="never" body-style="padding:0px;">
          <div class="chart">
            <LineChart
              ref="output_liquid"
              chart-id="output_liquid"
              style="height: 350px; "
            />
            <div class="dailylength">历史数据个数:{{ this.levelLength }}</div>
          </div>
        </el-card>
      </el-row>
    </div>
    <!-- 电流 -->
    <div class="data-chart">
      <el-row :gutter="15" class="elchart">
        <el-card shadow="never" body-style="padding:0px;">
          <div class="chart">
            <LineChart
              ref="ele-chart"
              chart-id="ele-chart"
              style="height: 350px; "
            />

            <div style="text-align:center;">
              <el-button
                icon="el-icon-arrow-left"
                @click="leftLine"
                :disabled="leftDisabled"
              ></el-button>
              <el-button
                icon="el-icon-arrow-right"
                @click="rightLine"
                :disabled="rightDisabled"
              ></el-button>
              <span class="dailylength" style="margin-left:20px"
                >历史数据个数:{{ elelength }}</span
              >
              <span
                class="dailylength"
                style="margin-left:20px"
                v-show="currentDiasbled"
              >
                当前展示第{{ this.start_index + 1 }}({{ eletime[0] }})、
                {{ this.start_index + 2 }}({{ eletime[1] }})、
                {{ this.start_index + 3 }}({{ eletime[2] }})组数据</span
              >
            </div>
          </div>
        </el-card>
      </el-row>
    </div>
    <!-- 有功 -->
    <div class="data-chart">
      <el-row :gutter="15" class="elchart">
        <el-card shadow="never" body-style="padding:0px;">
          <LineChart
            ref="work_chart"
            chart-id="work_chart"
            style="height: 350px;"
          />
          <div style="text-align:center;">
            <el-button
              icon="el-icon-arrow-left"
              @click="leftWorkLine"
              :disabled="leftWorkDis"
            ></el-button>
            <el-button
              icon="el-icon-arrow-right"
              @click="rightWorkLine"
              :disabled="rightWorkDis"
            ></el-button>
            <span class="dailylength" style="margin-left:20px;"
              >历史数据个数:{{ worklength }}</span
            >
            <span
              class="dailylength"
              style="margin-left:20px"
              v-show="currentDiasbled1"
            >
              当前展示第{{ this.start_index1 + 1 }}({{ worktime[0] }})、
              {{ this.start_index1 + 2 }}({{ worktime[1] }})、
              {{ this.start_index1 + 3 }}({{ worktime[2] }})组数据</span
            >
          </div>
        </el-card>
      </el-row>
    </div>
    <!-- 开关井记录 -->
    <div class="data-chart">
      <el-card shadow="never" body-style="padding-bottom:0px;padding-left:0px;">
        <div style="text-align:center">
          <span style="font-size:16px;">是否参与所有井时率计算：</span>
          <el-button type="primary" @click="alertWell(1)"
            >是
            <i class="el-icon-success" v-if="is_allow_all_hourlyrate === 1"></i>
          </el-button>
          <el-button type="primary" @click="alertWell(0)"
            >否
            <i class="el-icon-success" v-if="is_allow_all_hourlyrate === 0"></i>
          </el-button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span style="font-size:16px;"
            >单井时率={{ this.timeRate }} &nbsp;&nbsp;&nbsp;&nbsp;所有井时率={{
              this.allTimesRate
            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
          <svg-icon icon-class="jian"></svg-icon>关井
          <svg-icon icon-class="onstatus"></svg-icon>开井
        </div>
        <LineChart
          ref="record-chart"
          chart-id="record-chart"
          style="height: 300px;"
        />
      </el-card>
    </div>
    <!-- 运行状态 -->
    <div class="data-chart">
      <el-row :gutter="15" class="elchart">
        <el-card
          shadow="never"
          body-style="padding-bottom:0px;padding-left:0px;"
        >
          <div style="margin-left:860px;margin-bottom: -30px; ">
            <svg-icon icon-class="jian"></svg-icon>变频
            <svg-icon icon-class="onstatus"></svg-icon>工频
          </div>
          <LineChart
            ref="runStatus-chart"
            chart-id="runStatus-chart"
            style="height: 300px;"
          />
        </el-card>
      </el-row>
    </div>
    <!-- 油井运行诊断状态 -->
    <div class="data-chart">
      <el-row :gutter="15" class="elchart">
        <el-card shadow="never" body-style="padding:0px;">
          <div class="chart">
            <LineChart
              ref="alarm_chart"
              chart-id="alarm_chart"
              style="height: 300px;"
            />
          </div>
        </el-card>
      </el-row>
    </div>
    <!-- 功率因数 -->
    <div class="data-chart">
      <el-row :gutter="15" class="elchart">
        <el-card shadow="never" body-style="padding:0px;">
          <div class="chart">
            <LineChart
              ref="power_factor"
              chart-id="power_factor"
              style="height: 350px; "
            />
            <div class="dailylength">
              历史数据个数:{{ this.power_factorLength }}
            </div>
          </div>
        </el-card>
      </el-row>
    </div>
    <!-- 沉默度 -->
    <div class="data-chart">
      <el-row :gutter="15" class="elchart">
        <el-card shadow="never" body-style="padding:0px;">
          <div class="chart">
            <LineChart
              ref="final_settle"
              chart-id="final_settle"
              style="height: 350px; "
            />
            <div class="dailylength">
              历史数据个数:{{ this.submergenceLength }}
            </div>
          </div>
        </el-card>
      </el-row>
    </div>
    <!-- 系统效率 -->
    <div class="data-chart">
      <el-row :gutter="15" class="elchart">
        <el-card shadow="never" body-style="padding:0px;">
          <div class="chart">
            <LineChart
              ref="system_efficiency"
              chart-id="system_efficiency"
              style="height: 350px; "
            />
            <div class="dailylength">历史数据个数:{{ sysEfflength }}</div>
          </div>
        </el-card>
      </el-row>
    </div>
    <div style="margin-top:50px"></div>
    <el-dialog title="时间选择" :visible.sync="history" width="400px" top="5vh">
      <div class="history-middle">
        <el-row>
          <el-col :lg="4" :sm="4">时间:</el-col>
          <el-col :lg="20" :sm="20">
            <el-date-picker
              class="datePicker"
              v-model="datePicker"
              align="right"
              type="daterange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :picker-options="pickerOptions"
              value-format="yyyy/MM/dd"
            ></el-date-picker>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="16">
            <el-button
              type="primary"
              style="width:60px;height:30px;margin-top:30px;"
              @click="submitDate"
              >确定</el-button
            >
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ApiGetWellList, ApiAlterWell } from "@/api/wellList";
import {
  getWellDetail,
  ApiviewDailyData,
  ApiGetWellRecord,
  ApiAllTimesRate,
  ApiTimeRate,
  ApiSystEfficiency,
  ApiRunstatus
} from "@/api/welldetail";
import { ApiGetElectdata, ApiGetRealdata } from "@/api/realdata";
import LineChart from "@/components/ECharts/LineMarker";
import { ApiDiagQuery } from "@/api/alarmManagement";
import dayjs from "dayjs";
// 判断折现是否断开
const IS_BREAK = function(src) {
  return src.some(e => e == null);
};
export default {
  components: {
    LineChart
  },
  data() {
    return {
      currentDiasbled: false, //控制电流当前第几组数据的显示和隐藏
      currentDiasbled1: false, //控制有功当前第几组数据的显示和隐藏
      is_allow_all_hourlyrate: 1,
      time0: "",
      time1: "",
      date0: "",
      recorddata: [],
      wellList: [],
      value: "",
      wellname: [],
      wellid: [],
      wellDetail: [],
      realdata: [],
      id: "",
      list: [],
      datatype: 0,
      reset: false,
      allTimesRate: [],
      timeRate: [],
      dailyDatalength: [],
      elelength: [],
      worklength: [],
      history: false,
      datePicker: "",
      date: "",
      temp: [],
      tempWork: [],
      x_list1: [],
      P144data: [],
      start_index: "",
      end_index: "",
      time: [],
      leftDisabled: false,
      rightDisabled: true,
      leftWorkDis: false,
      rightWorkDis: true,
      P144Workdata: [],
      start_index1: "",
      end_index1: "",
      templen: "",
      sysEfflength: [],
      interval: 11,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              // const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, start]);
            }
          },
          {
            text: "最近7日",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近30日",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      splitLine1: "", //分隔线1
      splitLine2: "", //分隔线2
      splitLine3: "", //分隔线3
      number0: "",
      min: "",
      power_consuptionLength: "", //日电量
      totalLength: "", //日产液量
      levelLength: "", //动液面
      balanceLength: "", //平衡度
      power_factorLength: "", //功率因数
      submergenceLength: "", //沉没度
      e_current_page: 1,
      w_current_page: 1,
      // 电流接口数据的时间
      eletime: [],
      // 有功接口数据的时间
      worktime: []
    };
  },
  mounted() {
    this.GetWellLists();
  },

  methods: {
    //重新获取电流数据
    reGetElectdata() {
      this.reset = true;
      // this.getEleChart();
      this.getWork();
      this.getEleWork();
    },
    getWellDetails() {
      this.id = this.value;
      getWellDetail({ wellid: this.id, welldetail: "" }).then(({ data }) => {
        this.wellDetail = data.msg;
        this.is_allow_all_hourlyrate = data.msg.is_allow_all_hourlyrate;
        this.getDailytChart();
        // this.getEleChart();
        this.getRecordData();
        this.getalarmChart();
        this.getEleWork();
        this.getWork();
        //   this.getAllTimesRate();
        this.getTimeRate();
        this.getSysEfficiency();
        this.getRunStatus();
      });
    },
    getAllTimesRate() {
      ApiAllTimesRate({}).then(({ data }) => {
        this.allTimesRate = data.msg + "%";
      });
    },
    getTimeRate() {
      ApiTimeRate({ id: this.id, time_rate: "" }).then(({ data }) => {
        this.timeRate = data.msg + "%";
      });
    },
    alertWell(val) {
      let wellparams = {
        well_id: this.value,
        is_allow_all_hourlyrate: val
      };
      this.is_allow_all_hourlyrate = val;
      ApiAlterWell(wellparams).then(({ data }) => {
        //修改成功
        if (data.status === 0) {
          this.getTimeRate();
          this.getAllTimesRate();
        } else {
          //修改失败
          this.$message.error(data.msg);
        }
      });
    },
    //获取近30天时间的函数
    getDateRange(dateNow, intervalDays, bolPastTime) {
      let oneDayTime = 24 * 60 * 60 * 1000;
      let list = [];
      let lastDay;
      if (bolPastTime == true) {
        lastDay = new Date(dateNow.getTime() - intervalDays * oneDayTime);
        list.push(this.formateDate(lastDay));
        list.push(this.formateDate(dateNow));
      } else {
        lastDay = new Date(dateNow.getTime() + intervalDays * oneDayTime);
        list.push(this.formateDate(dateNow));
        list.push(this.formateDate(lastDay));
      }
      return list;
    },
    //格式化时间
    formateDate(time) {
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return year + "/" + month + "/" + day + "";
    },
    //电流左移
    leftLine() {
      this.rightDisabled = false;
      this.temp = [];
      this.eletime = [];
      this.x_list1 = [];
      let width = 3;
      this.start_index += 1;
      this.end_index = this.start_index + width;
      if (this.end_index % 20 === 0) {
        this.e_current_page += 1;
        this.getEleWork();
      }
      let array_datas = [];
      for (let i = this.start_index; i < this.end_index; i++) {
        // if (this.P144data.length != 0) {
        //   if (this.P144data[i].datas.length < 145) {
        //     this.P144data[i].datas.push(null);
        //   }
        // }
        array_datas.push(this.P144data[i]);
      }
      if (array_datas[0] !== undefined) {
        array_datas.forEach(t => {
          this.temp = this.temp.concat(t.datas);
          this.eletime = this.eletime.concat(t.time);
        });
      }
      if (this.end_index <= this.elelength) {
        this.rightDisabled = false;
        this.getEleChart();
        if (this.end_index == this.elelength) {
          this.leftDisabled = true;
        }
      } else {
        this.leftDisabled = true;
        this.rightDisabled = false;
      }
    },
    //有功右移
    leftWorkLine() {
      this.x_list1 = [];
      this.tempWork = [];
      this.worktime = [];
      let width = 3;
      this.start_index1 += 1;
      this.end_index1 = this.start_index1 + width;
      if (this.end_index1 % 20 === 0) {
        this.w_current_page += 1;
        this.getWork();
      }
      let array_datas = [];
      for (let i = this.start_index1; i < this.end_index1; i++) {
        array_datas.push(this.P144Workdata[i]);
      }
      if (array_datas[0] !== undefined) {
        array_datas.forEach(t => {
          this.tempWork = this.tempWork.concat(t.datas);
          this.worktime = this.worktime.concat(t.time);
        });
      }
      if (this.end_index1 <= this.worklength) {
        this.getWorkChart();
        this.rightWorkDis = false;

        if (this.end_index1 == this.worklength) {
          this.leftWorkDis = true;
        }
      } else {
        this.leftWorkDis = true;
        this.rightWorkDis = false;
      }
    },
    //电流右移
    rightLine() {
      this.temp = [];
      this.eletime = [];
      this.x_list1 = [];
      let width = 3;
      this.start_index -= 1;
      this.end_index = this.start_index + width;
      let array_datas = [];
      for (let i = this.start_index; i < this.end_index; i++) {
        array_datas.push(this.P144data[i]);
      }
      if (array_datas[0] !== undefined) {
        array_datas.forEach(t => {
          this.temp = this.temp.concat(t.datas);
          this.eletime = this.eletime.concat(t.time);
        });
      }
      if (this.start_index >= 0) {
        this.leftDisabled = false;
        this.getEleChart();
        if (this.start_index == 0) {
          this.rightDisabled = true;
        }
      } else {
        this.rightDisabled = true;
        this.leftDisabled = false;
      }
    },
    //有功左移
    rightWorkLine() {
      this.tempWork = [];
      this.worktime = [];
      this.x_list1 = [];
      let width = 3;
      this.start_index1 -= 1;
      this.end_index1 = this.start_index1 + width;
      let array_datas = [];
      for (let i = this.start_index1; i < this.end_index1; i++) {
        array_datas.push(this.P144Workdata[i]);
      }
      if (array_datas[0] !== undefined) {
        array_datas.forEach(t => {
          this.tempWork = this.tempWork.concat(t.datas);
          this.worktime = this.worktime.concat(t.time);
        });
      }
      if (this.start_index1 >= 0) {
        this.getWorkChart();
        this.leftWorkDis = false;
        if (this.start_index1 == 0) {
          this.rightWorkDis = true;
        }
      } else {
        this.rightWorkDis = true;
        this.leftWorkDis = false;
      }
    },
    //电流初始化时
    getEleWork() {
      let eleparams = {};
      if (this.date == "") {
        eleparams = {
          id: this.id,
          history: "",
          p_type: "3",
          data_type: this.datatype,
          daterange: this.date0
        };
      } else {
        eleparams = {
          id: this.id,
          history: "",
          p_type: "3",
          daterange: this.date,
          data_type: this.datatype
        };
      }
      if (this.e_current_page > 1) {
        eleparams.page = this.e_current_page;
      }
      this.eletime = [];
      ApiGetElectdata(eleparams).then(res => {
        this.elelength = res.data.msg.totalcount;
        if (this.elelength == 0) {
          this.currentDiasbled = false; //当电流历史数据为0时，隐藏电流的当前第几组数据
        } else {
          this.currentDiasbled = true; //当电流历史数据不为0时，显示电流的当前第几组数据
        }
        if (this.reset == false) {
          if (res.data.data_type == 1) {
            this.interval = 19;
            this.number = 199;
            this.number1 = 210;
          } else {
            this.interval = 11;
            this.datatype = 0;
            this.number = 144;
            this.number1 = 154;
          }
        } else {
          if (this.datatype == 0) {
            this.interval = 11;
            this.number = 144;
            this.number1 = 154;
          } else {
            this.interval = 19;
            this.number = 199;
            this.number1 = 210;
          }
        }
        this.list = res.data.msg.data[0];
        if (this.e_current_page === 1) {
          this.P144data = res.data.msg.data;
          let width = 3;
          this.start_index = 0;
          this.end_index = this.start_index + width;
        }
        if (this.e_current_page > 1) {
          this.P144data = [...this.P144data, ...res.data.msg.data];
        }
        let array_datas = [];
        if (this.P144data.length > 0) {
          for (let i = this.start_index; i < this.end_index; i++) {
            array_datas.push(this.P144data[i]);
          }
          if (array_datas[2] == undefined) {
            array_datas.pop();
          }
          if (array_datas[1] == undefined) {
            array_datas.pop();
          }
          if (array_datas[0] !== undefined) {
            array_datas.forEach(t => {
              this.temp = this.temp.concat(t.datas);
              this.eletime = this.eletime.concat(t.time);
            });
          }
        } else {
          this.temp = [];
          this.eletime = [];
        }
        this.getEleChart();
        if (this.elelength > 3) {
          this.leftDisabled = false;
          this.rightDisabled = true;
        } else if (this.elelength <= 3) {
          this.leftDisabled = true;
          this.rightDisabled = true;
        }
      });
    },
    //有功初始化时
    getWork() {
      let workparams = {};
      if (this.date == "") {
        workparams = {
          id: this.id,
          history: "",
          p_type: "2",
          data_type: this.datatype,
          daterange: this.date0
        };
      } else {
        workparams = {
          id: this.id,
          history: "",
          p_type: "2",
          daterange: this.date,
          data_type: this.datatype
        };
      }
      if (this.w_current_page > 1) {
        workparams.page = this.w_current_page;
      }
      this.worktime = [];
      ApiGetElectdata(workparams).then(res => {
        this.worklength = res.data.msg.totalcount;
        if (this.worklength == 0) {
          this.currentDiasbled1 = false; //当有功历史数据为0时，隐藏有功的当前第几组数据
        } else {
          this.currentDiasbled1 = true; //当有功历史数据不为0时，显示有功的当前第几组数据
        }
        if (this.reset == false) {
          if (res.data.data_type == 1) {
            this.interval = 19;
            this.datatype = 1;
            this.number = 199;
            this.number1 = 210;
          } else {
            this.interval = 11;
            this.datatype = 0;
            this.number = 144;
            //  this.number0 = 145;
            this.number1 = 154;
          }
        } else {
          if (this.datatype == 0) {
            this.number = 144;
            this.number1 = 154;
            this.interval = 11;
          } else {
            this.number = 199;
            this.number1 = 210;
            this.interval = 19;
          }
        }
        this.list = res.data.msg.data[0];

        if (this.w_current_page === 1) {
          this.P144Workdata = res.data.msg.data;
          let width1 = 3;

          this.start_index1 = 0;

          this.end_index1 = this.start_index1 + width1;
        }
        if (this.w_current_page > 1) {
          this.P144Workdata = [...this.P144Workdata, ...res.data.msg.data];
        }
        let array_datas1 = [];
        if (this.P144Workdata.length > 0) {
          for (let i = this.start_index1; i < this.end_index1; i++) {
            array_datas1.push(this.P144Workdata[i]);
          }
          if (array_datas1[2] == undefined) {
            array_datas1.pop();
          }
          if (array_datas1[1] == undefined) {
            array_datas1.pop();
          }
          if (array_datas1[0] !== undefined) {
            array_datas1.forEach(t => {
              this.tempWork = this.tempWork.concat(t.datas);
              this.worktime = this.worktime.concat(t.time);
            });
          }
        } else {
          this.tempWork = [];
          this.worktime = [];
        }
        this.getWorkChart();
        if (this.worklength > 3) {
          this.leftWorkDis = false;
          this.rightWorkDis = true;
        } else if (this.worklength <= 0) {
          this.leftWorkDis = true;
          this.rightWorkDis = true;
        }
      });
    },
    //搜索日产量折线图
    getDailytChart() {
      //  function dataFormat(params) {
      //     if (params) {
      //       params *= 1000;
      //       return dayjs(params).format("MM/DD");
      //     } else {
      //       return "";
      //     }
      //   }
      let dailyparams = {};
      if (this.date == "") {
        dailyparams = {
          id: this.id,
          daily: "",
          daterange: this.date0
        };
      } else {
        dailyparams = {
          id: this.id,
          daily: "",
          daterange: this.date
        };
      }
      ApiviewDailyData(dailyparams).then(({ data }) => {
        this.dailyDatalength = data.msg.length;
        let power_consuption = [];
        let dates_list = [];
        let level = [];
        let balance = [];
        let total = [];
        let power_factor = [];
        let submergence = [];
        // this.monthList = data.powers_month_list;

        console.log(data.msg, "data.msg");
        data.msg.forEach(item => {
          dates_list.push(item.date);
          power_consuption.push(item.power_consuption);
          level.push(item.level);
          balance.push(item.balance);
          total.push(item.total);
          power_factor.push(item.power_factor);
          submergence.push(item.submergence);
        });
        this.power_consuptionLength = power_consuption.length; //日电量
        this.totalLength = total.length; //日产液量
        this.levelLength = level.length; //动液面
        this.balanceLength = balance.length; //平衡度
        this.power_factorLength = power_factor.length; //功率因数
        this.submergenceLength = submergence.length; //沉没度
        //日电量的数据真实长度
        for (let i = 0; i < power_consuption.length; i++) {
          if (power_consuption[i] == null) {
            this.power_consuptionLength--;
          }
        }
        //日产液量的数据真实长度
        for (let i = 0; i < total.length; i++) {
          if (total[i] == null) {
            this.totalLength--;
          }
        }
        //动液面的数据真实长度
        for (let i = 0; i < level.length; i++) {
          if (level[i] == null) {
            this.levelLength--;
          }
        }
        //平衡度的数据真实长度
        for (let i = 0; i < balance.length; i++) {
          if (balance[i] == null) {
            this.balanceLength--;
          }
        }
        //功率因数的数据真实长度
        for (let i = 0; i < power_factor.length; i++) {
          if (power_factor[i] == null) {
            this.power_factorLength--;
          }
        }
        //沉没度的数据真实长度
        for (let i = 0; i < submergence.length; i++) {
          if (submergence[i] == null) {
            this.submergenceLength--;
          }
        }
        let powerConsuption = {
          title: {
            text: "日电量",
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
            boundaryGap: false,
            triggerEvent: true, //为标签添加触发事件
            axisLabel: {
              fontSize: 14
            },
            data: dates_list
          },
          dataZoom: [
            {
              type: "slider", //图表下方的伸缩条
              show: true, //是否显示
              realtime: true, //拖动时，是否实时更新系列的视图
              start: 0, //伸缩条开始位置（1-100），可以随时更改
              end: 100 //伸缩条结束位置（1-100），可以随时更改
            }
          ],
          yAxis: {
            type: "value",
            minInterval: 10,
            name: "千瓦时",
            splitLine: { show: false },
            axisLabel: { fontSize: 14 },
            nameTextStyle: { fontSize: 16 }
          },
          series: {
            name: "电量",
            type: "line",
            symbol: IS_BREAK(power_consuption) ? "roundRect" : "none",
            silent: true,
            barWidth: 20,
            data: power_consuption,
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
        console.log(powerConsuption, "powerConsuption", power_consuption);
        this.$refs["output_ele"].initChart(powerConsuption);

        let outputOption = {
          title: {
            text: "日产液量",
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
            boundaryGap: false,
            triggerEvent: true, //为标签添加触发事件
            axisLabel: {
              fontSize: 14
            },
            data: dates_list
          },
          dataZoom: [
            {
              type: "slider", //图表下方的伸缩条
              show: true, //是否显示
              realtime: true, //拖动时，是否实时更新系列的视图
              start: 0, //伸缩条开始位置（1-100），可以随时更改
              end: 100 //伸缩条结束位置（1-100），可以随时更改
            }
          ],
          yAxis: {
            type: "value",
            minInterval: 10,
            name: "吨",
            splitLine: { show: false },
            axisLabel: { fontSize: 14 },
            nameTextStyle: { fontSize: 16 }
          },
          series: {
            name: "日产液量",
            type: "line",
            symbol: IS_BREAK(total) ? "roundRect" : "none",
            barWidth: 20,
            data: total,
            connectNulls: false,
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
        this.$refs["output_chart"].initChart(outputOption);
        let OutputLiquid = {
          title: {
            text: "动液面",
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
            name: "时间",
            nameTextStyle: { fontSize: 16 },
            type: "category",
            triggerEvent: true, //为标签添加触发事件
            axisLabel: {
              fontSize: 14
            },
            boundaryGap: false,
            data: dates_list
          },
          yAxis: {
            type: "value",
            name: "米",
            axisLabel: { fontSize: 14 },
            nameTextStyle: { fontSize: 16 }
          },
          dataZoom: [
            {
              type: "slider", //图表下方的伸缩条
              show: true, //是否显示
              realtime: true, //拖动时，是否实时更新系列的视图
              start: 0, //伸缩条开始位置（1-100），可以随时更改
              end: 100 //伸缩条结束位置（1-100），可以随时更改
            }
          ],
          series: [
            {
              name: "液面",
              symbol: IS_BREAK(level) ? "roundRect" : "none",
              data: level,
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
              // areaStyle: {}
            }
          ]
        };
        this.$refs["output_liquid"].initChart(OutputLiquid);
        let balanceOption = {
          title: {
            text: "平衡度 ",
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
            boundaryGap: false,
            triggerEvent: true, //为标签添加触发事件
            axisLabel: {
              fontSize: 14
            },
            data: dates_list
          },
          dataZoom: [
            {
              type: "slider", //图表下方的伸缩条
              show: true, //是否显示
              realtime: true, //拖动时，是否实时更新系列的视图
              start: 0, //伸缩条开始位置（1-100），可以随时更改
              end: 100 //伸缩条结束位置（1-100），可以随时更改
            }
          ],
          yAxis: {
            type: "value",
            minInterval: 0.3,
            name: "",
            splitLine: { show: false },
            axisLabel: { fontSize: 14 },
            nameTextStyle: { fontSize: 16 }
          },
          series: {
            name: "平衡度",
            type: "line",
            symbol: IS_BREAK(balance) ? "roundRect" : "none",
            barWidth: 20,
            data: balance,
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
        if (this.wellDetail.well_type == 0) {
          this.$refs["balance_chart"].initChart(balanceOption);
        }
        //功率因数
        let powerFacOption = {
          title: {
            text: "功率因数",
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
            boundaryGap: false,
            triggerEvent: true, //为标签添加触发事件
            axisLabel: {
              fontSize: 14
            },
            data: dates_list
          },
          dataZoom: [
            {
              type: "slider", //图表下方的伸缩条
              show: true, //是否显示
              realtime: true, //拖动时，是否实时更新系列的视图
              start: 0, //伸缩条开始位置（1-100），可以随时更改
              end: 100 //伸缩条结束位置（1-100），可以随时更改
            }
          ],
          yAxis: {
            type: "value",
            minInterval: 1,
            //   name: "千瓦时",
            splitLine: { show: false },
            axisLabel: { fontSize: 14 },
            nameTextStyle: { fontSize: 16 }
          },
          series: {
            name: "功率因数",
            type: "line",
            symbol: IS_BREAK(power_factor) ? "roundRect" : "none",
            barWidth: 20,
            data: power_factor,
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
        this.$refs["power_factor"].initChart(powerFacOption);
        //沉没度
        let finalSetOption = {
          title: {
            text: "沉没度",
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
            boundaryGap: false,
            triggerEvent: true, //为标签添加触发事件
            axisLabel: {
              fontSize: 14
            },
            data: dates_list
          },
          dataZoom: [
            {
              type: "slider", //图表下方的伸缩条
              show: true, //是否显示
              realtime: true, //拖动时，是否实时更新系列的视图
              start: 0, //伸缩条开始位置（1-100），可以随时更改
              end: 100 //伸缩条结束位置（1-100），可以随时更改
            }
          ],
          yAxis: {
            type: "value",
            minInterval: 10,
            //  name: "千瓦时",
            splitLine: { show: false },
            axisLabel: { fontSize: 14 },
            nameTextStyle: { fontSize: 16 }
          },
          series: {
            name: "沉没度",
            type: "line",
            symbol: IS_BREAK(submergence) ? "roundRect" : "none",
            barWidth: 20,
            data: submergence,
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
        this.$refs["final_settle"].initChart(finalSetOption);
      });
    },

    //系统效率
    getSysEfficiency() {
      function dataFormat(params) {
        if (params) {
          params *= 1000;
          return dayjs(params).format("YYYY/MM/DD HH:mm:ss");
        } else {
          return "";
        }
      }
      let params = {};
      if (this.date == "") {
        params = {
          well_id: this.id,
          daterange: this.date0
        };
      } else {
        params = {
          well_id: this.id,
          daterange: this.date
        };
      }
      ApiSystEfficiency(params).then(({ data }) => {
        this.sysEfflength = data.msg.length;

        let xy = [];
        data.msg.forEach(item => {
          xy.push([dataFormat(item.time), item.system_efficency]);
        });

        // console.log(xy)
        let sysEffOption = {
          title: {
            text: "系统效率",
            textStyle: {
              fontSize: 20
            },
            // padding:[1,40,23,60],
            padding: [1, 18],
            left: "left",
            top: 0
          },
          tooltip: {
            trigger: "axis",
            formatter: function(params) {
              let marker = params[0].marker;
              var res = params[0].data[0];
              var relVal =
                marker + res + "<br/>" + "效率：" + params[0].data[1] + "%";
              return relVal;
            }
          },
          legend: {
            data: []
          },
          xAxis: {
            name: "时间",
            nameTextStyle: { fontSize: 16 },
            type: "time",
            boundaryGap: false,
            triggerEvent: true, //为标签添加触发事件
            nameLocation: "start",
            inverse: true,
            splitLine: {
              show: false
            },

            axisLabel: {
              fontSize: 14,
              formatter: function(value) {
                //在这里写你需要的时间格式
                function addZero(i) {
                  if (i < 10) {
                    i = "0" + i;
                  }
                  return i;
                }

                var t_date = new Date(value);
                return (
                  [
                    t_date.getFullYear(),
                    t_date.getMonth() + 1,
                    t_date.getDate()
                  ].join("-") +
                  " " +
                  [
                    addZero(t_date.getHours()),
                    addZero(t_date.getMinutes())
                  ].join(":")
                );
              }
            }
            //   data: dates_list
          },
          dataZoom: [
            {
              type: "slider", //图表下方的伸缩条
              show: true, //是否显示
              realtime: true, //拖动时，是否实时更新系列的视图
              start: 0, //伸缩条开始位置（1-100），可以随时更改
              end: 100 //伸缩条结束位置（1-100），可以随时更改
            }
          ],
          yAxis: {
            axisLabel: {
              show: true,
              interval: "auto",
              formatter: "{value}%",
              textStyle: {
                fontSize: 14
              }
            },
            type: "value",
            minInterval: 10,
            // name: "千瓦时",
            splitLine: { show: false },
            // axisLabel: { fontSize: 14 },
            nameTextStyle: { fontSize: 16 }
          },
          series: {
            name: "效率",
            type: "line",
            symbol: "none",
            barWidth: 20,
            data: xy,
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
        this.$refs["system_efficiency"].initChart(sysEffOption);
      });
    },
    //电流曲线图
    getEleChart() {
      this.x_list1 = [];
      let x_list = [];
      let x_list1 = [];
      let x_list2 = [];
      if (this.datatype == 0) {
        for (let i = 1; i <= this.number + 1; i++) {
          x_list.push(i);
        }
        for (let i = 1; i <= this.number + 1; i++) {
          x_list1.push(i);
        }
        for (let i = 1; i <= this.number1 + 1; i++) {
          x_list2.push(i);
        }
      } else if (this.datatype == 1) {
        for (let i = 1; i <= this.number + 1; i++) {
          x_list.push(i);
        }

        for (let i = 1; i <= this.number + 1; i++) {
          x_list1.push(i);
        }
        for (let i = 1; i <= this.number1 + 1; i++) {
          x_list2.push(i);
        }
      }
      this.x_list1 = x_list.concat(x_list1).concat(x_list2);
      if (this.datatype == 0) {
        this.splitLine1 = 144;
        this.splitLine2 = 289;
        this.splitLine3 = 434;
      } else {
        this.splitLine1 = 199;
        this.splitLine2 = 399;
        this.splitLine3 = 599;
      }
      let value = ""; //存储将坐标点转换为数字格式后的坐标点
      let mydatatype = this.datatype;
      let times = 1;
      let customOption = {
        title: {
          text: "电流A"
        },
        tooltip: {
          trigger: "axis",
          position: function(point, params, dom, rect, size) {
            //其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize
            var x = point[0]; //
            var y = point[1];
            var viewWidth = size.viewSize[0];
            var viewHeight = size.viewSize[1];
            var boxWidth = size.contentSize[0];
            var boxHeight = size.contentSize[1];
            var posX = 0; //x坐标位置
            var posY = 0; //y坐标位置
            if (x < boxWidth) {
              //左边放不开
              posX = x + 10;
            } else {
              //左边放的下
              posX = x - boxWidth;
            }
            if (y < boxHeight) {
              //上边放不开
              posY = 0;
            } else {
              //上边放得下
              posY = y - boxHeight;
            }
            return [posX, posY];
          }
        },
        xAxis: {
          type: "category",
          data: this.x_list1,
          name: "点数",
          //    min:1,
          nameTextStyle: { fontSize: 16 },
          boundaryGap: false,
          axisLabel: {
            interval: 0,
            fontSize: 13,
            formatter: function(value, index) {
              if (times == 1 && (value == 1 || value == "1")) {
                return 1;
              }
              times += 1;
              var intvalue = parseInt(value);
              if (mydatatype == 0) {
                // 145
                if (value != 1 && value % 12 == 1) {
                  return value;
                }
              }
              if (mydatatype == 1) {
                // 200
                if (value % 20 == 0) {
                  return value;
                }
              }
            }
          }
        },
        yAxis: {
          type: "value",
          name: "安培",
          nameTextStyle: { fontSize: 16 }
        },
        // series: arr
        series: [
          {
            name: "电流量",
            symbol: "none",
            smooth: true, //光滑
            data: this.temp,
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
            markLine: {
              symbol: "none", //去掉警戒线最后面的箭头
              silent: true, //鼠标悬停事件  true没有，false有
              data: [
                {
                  lineStyle: {
                    //警戒线的样式  ，虚实  颜色
                    type: "solid",
                    color: "graylight"
                  },
                  xAxis: this.splitLine1
                },
                {
                  lineStyle: {
                    //警戒线的样式  ，虚实  颜色
                    type: "solid",
                    color: "graylight"
                  },
                  xAxis: this.splitLine2
                },
                {
                  lineStyle: {
                    //警戒线的样式  ，虚实  颜色
                    type: "solid",
                    color: "graylight"
                  },
                  xAxis: this.splitLine3
                }
              ]
            }
          }
        ]
      };
      this.$nextTick(() => {
        this.$refs["ele-chart"].initChart(customOption);
      });
      this.temp = [];
    },
    //有功曲线图
    getWorkChart() {
      this.x_list1 = [];
      let x_list = [];
      let x_list1 = [];
      let x_list2 = [];
      if (this.datatype == 0) {
        for (let i = 1; i <= this.number + 1; i++) {
          x_list.push(i);
        }

        for (let i = 1; i <= this.number + 1; i++) {
          x_list1.push(i);
        }

        for (let i = 1; i <= this.number1 + 1; i++) {
          x_list2.push(i);
        }
      } else if (this.datatype == 1) {
        for (let i = 1; i <= this.number + 1; i++) {
          x_list.push(i);
        }

        for (let i = 1; i <= this.number + 1; i++) {
          x_list1.push(i);
        }
        //   x_list1.unshift('');

        // let xy= {name:"全部",code:  -1}
        //  x_list1.push('');
        for (let i = 1; i <= this.number1 + 1; i++) {
          x_list2.push(i);
        }
      }
      this.x_list1 = x_list.concat(x_list1).concat(x_list2);

      if (this.datatype == 0) {
        this.splitLine1 = 144;
        this.splitLine2 = 289;
        this.splitLine3 = 434;
      } else {
        this.splitLine1 = 199;
        this.splitLine2 = 399;
        this.splitLine3 = 599;
      }
      let mydatatype = this.datatype;
      let times = 1;
      let customOption1 = {
        title: {
          text: " 有功kw"
        },
        tooltip: {
          trigger: "axis",
          position: function(point, params, dom, rect, size) {
            //其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize
            var x = point[0]; //
            var y = point[1];
            var viewWidth = size.viewSize[0];
            var viewHeight = size.viewSize[1];
            var boxWidth = size.contentSize[0];
            var boxHeight = size.contentSize[1];
            var posX = 0; //x坐标位置
            var posY = 0; //y坐标位置
            if (x < boxWidth) {
              //左边放不开
              posX = x + 10;
            } else {
              //左边放的下
              posX = x - boxWidth;
            }
            if (y < boxHeight) {
              //上边放不开
              posY = 0;
            } else {
              //上边放得下
              posY = y - boxHeight;
            }
            return [posX, posY];
          }
        },
        xAxis: {
          type: "category",
          data: this.x_list1,
          name: "点数",
          nameTextStyle: { fontSize: 16 },
          boundaryGap: false,
          //     min:this.min,
          axisLabel: {
            interval: 0,
            fontSize: 13,
            formatter: function(value, index) {
              if (times == 1 && (value == 1 || value == "1")) {
                return 1;
              }
              times += 1;
              var intvalue = parseInt(value);
              if (mydatatype == 0) {
                // 145
                if (value != 1 && value % 12 == 1) {
                  return value;
                }
              }
              if (mydatatype == 1) {
                // 200
                if (value % 20 == 0) {
                  return value;
                }
              }
            }
          }
        },
        yAxis: {
          type: "value",
          name: "千瓦",
          nameTextStyle: { fontSize: 16 }
          // axisLabel: {
          //   fontSize: 14
          // }
        },
        series: [
          {
            name: "有功",
            symbol: "none",
            smooth: true, //光滑
            data: this.tempWork,
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
            markLine: {
              symbol: "none", //去掉警戒线最后面的箭头
              silent: true, //鼠标悬停事件  true没有，false有
              data: [
                {
                  lineStyle: {
                    //警戒线的样式  ，虚实  颜色
                    type: "solid",
                    color: "graylight"
                  },
                  xAxis: this.splitLine1
                },
                {
                  lineStyle: {
                    //警戒线的样式  ，虚实  颜色
                    type: "solid",
                    color: "graylight"
                  },
                  xAxis: this.splitLine2
                },
                {
                  lineStyle: {
                    //警戒线的样式  ，虚实  颜色
                    type: "solid",
                    color: "graylight"
                  },
                  xAxis: this.splitLine3
                }
              ]
            }
          }
        ]
      };
      this.$refs["work_chart"].initChart(customOption1);
      this.tempWork = [];
    },
    //开关井
    getRecordData() {
      let recordparams = {};
      if (this.date == "") {
        recordparams = {
          id: this.id,
          daterange: this.date0
        };
      } else {
        recordparams = {
          id: this.id,
          daterange: this.date
        };
      }
      ApiGetWellRecord(recordparams).then(res => {
        function timeDateFormat(date) {
          if (date) {
            date = date;
            return dayjs(date).format("YYYY/MM/DD HH:mm:ss");
          } else {
            return "";
          }
        }
        let nowdate = new Date();
        let xy = [];
        if (res.data[0]) {
          // 判断后端返回的最新一条数据是不是当天的数据，
          // 如不是，则把当前的日期添上，其对应的y轴值为数组的第一个值
          var time = new Date(res.data[0].time);
          if (
            time.getFullYear() == nowdate.getFullYear() &&
            time.getMonth() == nowdate.getMonth() &&
            time.getDate() == nowdate.getDate()
          ) {
            //
          } else {
            var newdata = {
              wellid: res.data[0].wellid,
              status: res.data[0].status,
              name: res.data[0].name,
              last: res.data[0].last,
              time: new Date().getTime()
            };
            res.data.unshift(newdata);
          }
        }
        res.data.forEach((item, index) => {
          xy.push([timeDateFormat(item.time), item.status + 5]);
        });
        let recordOption = {
          title: {
            text: "开关井记录 ",
            textStyle: {
              fontSize: 20
            },
            // padding:[1,40,23,60],
            padding: [1, 18],
            left: "left",
            top: 0
          },
          tooltip: {
            trigger: "axis",
            formatter: function(params) {
              let marker = params[0].marker;
              var res = params[0].name;
              var texts = "";
              if (params[0].value[1] == 5) {
                texts = "开井";
              } else if (params[0].value[1] == 6) {
                texts = "关井";
              }
              res = res + texts;

              var relVal = marker + res + params[0].value[0] + "<br/>";
              return relVal;
            }
          },
          legend: {
            data: []
          },
          xAxis: {
            name: "时间",
            nameTextStyle: { fontSize: 16 },
            type: "time",
            nameLocation: "start",
            inverse: true,
            boundaryGap: false,
            splitLine: {
              show: false
            },

            triggerEvent: true, //为标签添加触发事件
            // axisLabel: {
            //   fontSize: 14
            // },
            axisLabel: {
              interale: 0,
              fontSize: 14,
              // rotate: -30,

              formatter: function(value) {
                function addZero(i) {
                  if (i < 10) {
                    i = "0" + i;
                  }
                  return i;
                }

                var t_date = new Date(value);
                return (
                  [
                    t_date.getFullYear(),
                    t_date.getMonth() + 1,
                    t_date.getDate()
                  ].join("-") +
                  " " +
                  [
                    addZero(t_date.getHours()),
                    addZero(t_date.getMinutes())
                  ].join(":")
                );
              }
            }

            // data: dates_list
          },
          dataZoom: [
            {
              type: "slider", //图表下方的伸缩条
              show: true, //是否显示
              realtime: true, //拖动时，是否实时更新系列的视图
              start: 0, //伸缩条开始位置（1-100），可以随时更改
              end: 100, //伸缩条结束位置（1-100），可以随时更改
              filterMode: "empty"
            }
          ],

          yAxis: {
            type: "value",
            minInterval: 5,
            name: "",
            splitLine: { show: false },
            axisLabel: {
              // formatter: function(value) {
              //   var texts = [];
              //   if (value == 0) {
              //     texts.push("0");
              //   } else if (value <= 1) {
              //     texts.push("");
              //   } else if (value <= 2) {
              //     texts.push("");
              //   } else if (value <= 3) {
              //     texts.push("");
              //   } else if (value <= 4) {
              //     texts.push("");
              //   } else if (value <= 5) {
              //     texts.push("开井");
              //   } else if (value <= 6) {
              //     texts.push("关井");
              //   }
              //   return texts;
              // },
              fontSize: 14
            },
            nameTextStyle: { fontSize: 16 }
          },
          visualMap: {
            show: false,
            type: "piecewise",
            // seriesIndex: 2, //控制series 对应的区域
            pieces: [
              {
                gte: 5.94,
                color: "#fb060f"
              },
              {
                gt: 0,
                lte: 5.03,
                color: "green"
              }
            ]
          },

          series: [
            {
              // name: "状态",
              step: "start",
              symbol: IS_BREAK(xy) ? "roundRect" : "none",
              type: "line",
              barWidth: 20,
              data: xy,
              itemStyle: {
                normal: {
                  label: {
                    show: false, //开启显示
                    position: "top", //在上方显示

                    textStyle: {
                      //数值样式
                      // color: "red",
                      fontSize: 16
                    }
                  }
                }
              }
            }
          ]
        };
        this.$refs["record-chart"].initChart(recordOption);
      });
    },
    //运行状态
    getRunStatus() {
      let recordparams = {};
      if (this.date == "") {
        recordparams = {
          id: this.id,
          daterange: this.date0,
          runstatus: ""
        };
      } else {
        recordparams = {
          id: this.id,
          daterange: this.date,
          runstatus: ""
        };
      }
      ApiRunstatus(recordparams).then(res => {
        function timeDateFormat(date) {
          if (date) {
            date = date;
            return dayjs(date).format("YYYY/MM/DD HH:mm");
          } else {
            return "";
          }
        }
        let nowdate = new Date();
        let xy = [];
        if (res.data[0]) {
          // 判断后端返回的最新一条数据是不是当天的数据，
          // 如不是，则把当前的日期添上，其对应的y轴值为数组的第一个值
          var time = new Date(res.data[0].time);
          if (
            time.getFullYear() == nowdate.getFullYear() &&
            time.getMonth() == nowdate.getMonth() &&
            time.getDate() == nowdate.getDate()
          ) {
          } else {
            var newdata = {
              last: res.data[0].last,
              wellid: res.data[0].wellid,
              status: res.data[0].status,
              name: res.data[0].name,
              time: new Date().getTime()
            };
            res.data.unshift(newdata);
          }
        }
        res.data.forEach(item => {
          xy.push([timeDateFormat(item.time), item.status + 2]);
        });
        let runStatusOption = {
          title: {
            text: "运行状态 ",
            textStyle: {
              fontSize: 20
            },
            // padding:[1,40,23,60],
            padding: [1, 18],
            left: "left",
            top: 0
          },
          tooltip: {
            trigger: "axis",
            formatter: function(params) {
              let marker = params[0].marker;
              var res = params[0].name;
              var texts = "";
              if (params[0].value[1] == 5) {
                texts = "工频";
              } else if (params[0].value[1] == 6) {
                texts = "变频";
              }
              res = res + texts;

              var relVal = marker + res + params[0].value[0] + "<br/>";
              return relVal;
            }
          },
          legend: {
            data: []
          },
          xAxis: {
            name: "时间",
            nameTextStyle: { fontSize: 16 },
            type: "time",
            nameLocation: "start",
            boundaryGap: false,
            inverse: true,
            splitLine: {
              show: false
            },

            triggerEvent: true, //为标签添加触发事件
            // axisLabel: {
            //   fontSize: 14
            // },
            axisLabel: {
              interale: 0,
              fontSize: 14,
              // rotate: -30,
              formatter: function(value) {
                //在这里写你需要的时间格式
                function addZero(i) {
                  if (i < 10) {
                    i = "0" + i;
                  }
                  return i;
                }

                var t_date = new Date(value);
                return (
                  [
                    t_date.getFullYear(),
                    t_date.getMonth() + 1,
                    t_date.getDate()
                  ].join("-") +
                  " " +
                  [
                    addZero(t_date.getHours()),
                    addZero(t_date.getMinutes())
                  ].join(":")
                );
              }
            }

            // data: dates_list
          },
          dataZoom: [
            {
              type: "slider", //图表下方的伸缩条
              show: true, //是否显示
              realtime: true, //拖动时，是否实时更新系列的视图
              start: 0, //伸缩条开始位置（1-100），可以随时更改
              end: 100 //伸缩条结束位置（1-100），可以随时更改
            }
          ],

          yAxis: {
            type: "value",
            minInterval: 5,
            name: "",
            splitLine: { show: false },
            axisLabel: {
              // formatter: function(value) {
              //   var texts = [];
              //   if (value == 0) {
              //     texts.push("0");
              //   } else if (value <= 1) {
              //     texts.push("");
              //   } else if (value <= 2) {
              //     texts.push("");
              //   } else if (value <= 3) {
              //     texts.push("");
              //   } else if (value <= 4) {
              //     texts.push("");
              //   } else if (value <= 5) {
              //     texts.push("开井");
              //   } else if (value <= 6) {
              //     texts.push("关井");
              //   }
              //   return texts;
              // },
              fontSize: 14
            },
            nameTextStyle: { fontSize: 16 }
          },
          visualMap: {
            show: false,
            type: "piecewise",
            // seriesIndex: 2, //控制series 对应的区域
            pieces: [
              {
                gt: 5.94,
                color: "#fb060f"
              },
              {
                gt: 0,
                lte: 5.03,
                color: "green"
              }
            ]
          },

          series: [
            {
              // name: "状态",
              step: "start",
              symbol: IS_BREAK(xy) ? "roundRect" : "none",
              type: "line",
              barWidth: 20,
              data: xy,
              itemStyle: {
                normal: {
                  label: {
                    show: false, //开启显示
                    position: "top", //在上方显示

                    textStyle: {
                      //数值样式
                      // color: "red",
                      fontSize: 16
                    }
                  }
                }
              }
            }
          ]
        };
        this.$refs["runStatus-chart"].initChart(runStatusOption);
      });
    },
    //油井运行诊断状态
    getalarmChart() {
      let alarmparams = {};
      if (this.date == "") {
        alarmparams = {
          id: this.id,
          history: "",
          daterange: this.date0
        };
      } else {
        alarmparams = {
          id: this.id,
          daterange: this.date,
          history: ""
        };
      }
      function dataFormat(params) {
        if (params) {
          params *= 1000;
          return dayjs(params).format("YYYY/MM/DD HH:mm:ss");
        } else {
          return "";
        }
      }
      ApiDiagQuery(alarmparams).then(res => {
        let name_list = [];
        res.data.msg.forEach(item => {
          // dates_list.push(item.dates);
          name_list.push(item.name);
        });
        let templists = [];
        let date_temp = res.data.msg;

        date_temp.forEach(item => {
          templists.push(item.dates);
        });

        let out_array = [];
        templists.forEach(item => {
          let obj = {};
          let out1_array = [];
          item.forEach(ite => {
            let inner_array = [];
            let time_stamp = ite[0]; //时间戳
            let temp = ite[1]; //时间戳后面的字符

            // 下面将时间戳转换为字符串
            let time_str = dataFormat(time_stamp);
            inner_array.push(time_str);
            inner_array.push(temp);
            out1_array.push(inner_array);
            let index = templists.indexOf(item);
            obj["name"] = name_list[index];
            obj["dates"] = out1_array;
          });
          out_array.push(obj);
        });
        const arr = out_array.map(t => {
          return {
            name: t.name,
            smooth: true, //光滑
            symbol: IS_BREAK(t.dates) ? "roundRect" : "none",
            data: t.dates,
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
          };
        });
        let recordOption = {
          title: {
            text: "油井运行诊断状态：",
            textStyle: {
              fontSize: 20
            },
            // padding:[1,40,23,60],
            padding: [1, 18],
            left: "left",
            top: 0
          },
          tooltip: {
            trigger: "axis",
            formatter: function(params) {
              // console.log(params);

              let tips = "";
              params.forEach(element => {
                var relVal = "";
                let marker = element.marker;
                relVal =
                  marker + element.seriesName + element.value[0] + "<br/>";
                tips += relVal;
              });
              return tips;
            }
          },
          legend: {
            x: "500px",
            y: "15px",
            icon: "line",
            data: name_list
          },
          xAxis: {
            name: "时间",
            nameTextStyle: { fontSize: 16 },
            type: "time",
            nameLocation: "start",
            boundaryGap: false,
            inverse: true,
            splitLine: {
              show: false
            },
            triggerEvent: true, //为标签添加触发事件
            axisLabel: {
              fontSize: 14,
              formatter: function(value) {
                //在这里写你需要的时间格式
                function addZero(i) {
                  if (i < 10) {
                    i = "0" + i;
                  }
                  return i;
                }

                var t_date = new Date(value);
                return (
                  [
                    t_date.getFullYear(),
                    t_date.getMonth() + 1,
                    t_date.getDate()
                  ].join("-") +
                  " " +
                  [
                    addZero(t_date.getHours()),
                    addZero(t_date.getMinutes())
                  ].join(":")
                );
              }
            }

            // data: dates_lists
          },
          dataZoom: [
            {
              type: "slider", //图表下方的伸缩条
              show: true, //是否显示
              realtime: true, //拖动时，是否实时更新系列的视图
              start: 0, //伸缩条开始位置（1-100），可以随时更改
              end: 100 //伸缩条结束位置（1-100），可以随时更改
            }
          ],
          yAxis: {
            type: "value",
            minInterval: 2,
            name: "",
            splitLine: { show: false },
            axisLabel: { fontSize: 14 },
            nameTextStyle: { fontSize: 16 }
          },
          series: arr
        };
        this.$refs["alarm_chart"].initChart(recordOption);
      });
    },
    historyLine() {
      this.history = true;
    },
    submitDate() {
      this.date = this.datePicker[0] + "-" + this.datePicker[1];
      this.getDailytChart();
      // this.getEleChart();
      this.getRecordData();
      this.getalarmChart();
      this.getEleWork();
      this.getWork();
      this.getSysEfficiency();
      this.getRunStatus();
      this.history = false;
    },

    GetWellLists() {
      ApiGetWellList({ page: 1, pagenum: 100 }).then(res => {
        this.wellList = res.data.msg.well_list;
        this.wellid = res.data.msg.well_list.map(item => {
          return item.id;
        });
        /*
      ApiGetRealdata({ realdata: "", page: 1, pagenum: 100 }).then(res => {
        this.realdata = res.data.realdata;
        this.wellid = res.data.realdata.map(item => {
          return item.wellid;
        });
      */
        if (this.$route.query.id) {
          this.value = this.$route.query.id;
        } else {
          this.value = this.wellid[0];
        }
        this.getWellDetails();
      });
    }
  },

  created() {
    this.getAllTimesRate();

    var date = new Date();
    var list = this.getDateRange(date, 30, true);
    this.time0 = list[0];
    this.time1 = list[1];
    this.date0 = this.time0 + "-" + this.time1;
  }
};
</script>
<style lang="scss" scoped>
#historydata {
  // background-color: #f4f5f5;
  .row-bg {
    align-items: center;
  }
  .col-bg {
    padding: 5px 2px 0 45px;
  }
  .data-title {
    display: flex;
    justify-content: center;
    .title-text {
      font-weight: bold;
      font-size: 20px;
    }
  }
  .data-header {
    margin: 10px;
  }
  .data-chart {
    margin: 10px;
    .elchart {
      margin-left: 0px !important;
      margin-right: 0px !important;
    }
  }
  .dailylength {
    text-align: center;
    // margin-top: -20px;
    //margin-right: 15px;
    font-size: 16px;
  }
  .onwell {
    width: 40px;
    height: 25px;
    margin-top: 50px;
    vertical-align: -0.5em;
  }
  .offwell {
    width: 40px;
    height: 25px;
    vertical-align: -0.5em;
  }
  .svg-icon[data-v-c8a70580] {
    vertical-align: -0.3em;
    font-size: 25px;
  }
  .iconclass {
    margin-left: -100px;
    font-size: 1px;
    color: #3a3d44;
  }
  .chart-title {
    font-weight: bold;
  }
  .history-middle {
    margin: 10px 20px;
  }
  .datePicker {
    width: 250px;
  }

  .chart {
    padding-top: 10px;
  }
}
</style>
