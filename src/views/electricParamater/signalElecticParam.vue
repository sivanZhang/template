<template>
  <div id="signalElecticParam">
    <div class="signal-title">
      <div class="title-text">单独调用电参及载荷示功图曲线界面</div>
    </div>
    <div class="signal-header">
      <el-card shadow="never">
        <el-form :inline="true" class="search-form">
          <el-form-item label="井名：">
            <el-select
              v-model="wellID"
              filterable
              style="width: 130px"
              placeholder="请选择"
              @change="getWellParamers()"
            >
              <el-option
                v-for="(item, index) of wellList"
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="油井类别：">
            {{ welltype == 0 ? "抽油机" : "螺杆泵" }}
          </el-form-item>
          <el-form-item label="点数：">
            <el-select
              v-model="wellPoint"
              filterable
              placeholder="请选择"
              @change="getWellParamers()"
            >
              <el-option
                v-for="item in wellPointList"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="调用类型：">
            <el-select
              v-model="dataSrc"
              filterable
              style="width: 86px"
              placeholder="请选择"
              @change="getWellDataSrc()"
            >
              <el-option
                v-for="item in dataSrcList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <!-- <adjusttypeTips /> -->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="openEle_force()"
              >添加电参力数据</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div class="signal-chart">
      <el-row :gutter="15">
        <el-col :lg="12">
          <el-card shadow="never">
            <el-card shadow="never">
              <div class="chart-title">调用电参力位移数据后如下图</div>
            </el-card>
            <div class="chart" v-loading="loadingElect">
              <LineChart
                ref="overlying_chart"
                chart-id="overlying_chart"
                style="width: 640px"
              />
            </div>
          </el-card>
        </el-col>
        <el-col :lg="12">
          <el-card shadow="never">
            <el-card shadow="never">
              <div class="chart-title">调用载荷位移数据如下图</div>
            </el-card>
            <div class="chart" v-loading="loadingLoad">
              <LineChart
                ref="load_chart"
                chart-id="load_chart"
                style="width: 640px"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 50px"></div>
    <!-- 添加电参力数据 -->
    <el-dialog
      title="添加电参力数据"
      :visible.sync="dialogShowEle"
      width="520px"
      top="5vh"
    >
      <el-form
        :model="addEleData"
        label-width="100px"
        ref="addEleData"
        :rules="rules"
      >
        <el-form-item label="点位数据类型" prop="point_number">
          <el-select
            v-model="addEleData.point_number"
            @change="currStationChange"
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option
              v-for="item in point_number"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上报时间" prop="time">
          <el-date-picker
            v-model="addEleData.time"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 200px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="电参力" prop="adjustment_electrical_force">
          <el-input
            ref="electinput"
            v-model="addEleData.adjustment_electrical_force"
            type="textarea"
            :rows="12"
            onkeyup="value=value.replace(/[\u4E00-\u9FA5]|[A-Za-z]/g,'')"
            placeholder="点位数据之间用英文逗号隔开"
          ></el-input>
        </el-form-item>
        <el-form-item label="位移点位数据" prop="displacement">
          <el-input
            v-model="addEleData.displacement"
            type="textarea"
            :rows="12"
            onkeyup="value=value.replace(/[\u4E00-\u9FA5]|[A-Za-z]/g,'')"
            placeholder="点位数据之间用英文逗号隔开"
          ></el-input>
        </el-form-item>
        <div class="btn">
          <!-- <el-button @click="cancel">取消</el-button> -->
          <router-link to="work-chart" class="workChart"
            ><el-link :underline="false" style="color: #0000ff; font-size: 12px"
              >功图表格</el-link
            ></router-link
          >
          <el-button type="primary" @click="submitEleForm('addEleData')"
            >创建</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import LineChart from "@/components/ECharts/LineMarker";
import adjusttypeTips from "./components/adjusttype-tips";
import { ApiGetRealdata, ApiGetElectdata } from "@/api/realdata";
import { ApiGetWellList } from "@/api/wellList";
import { getFromStorage, postToStorage } from "@/api/electricParamater";
import { getWellDetail } from "@/api/welldetail";
import dayjs from "dayjs";
import green from "../../assets/green.png";
export default {
  components: {
    LineChart,
    adjusttypeTips,
  },
  data() {
    return {
      rules: {
        point_number: [
          {
            required: true,
            trigger: "blur",
            message: "请输入点位类型",
          },
        ],
        time: [
          {
            required: true,
            trigger: "blur",
            message: "请输入上报时间",
          },
        ],
        adjustment_electrical_force: [
          {
            required: true,
            trigger: "blur",
            message: "请输入电参力",
          },
        ],
        displacement: [
          {
            required: true,
            trigger: "blur",
            message: "请输入位移点数据",
          },
        ],
      },
      loadingElect: false,
      loadingLoad: false,
      wellList: [],
      wellID: "",
      wellPoint: "145",
      welltype: "", //油井类别，暂为螺杆泵 ,全部：-1 , 0 # 抽油机, 1 # 螺杆泵
      wellPointList: [{ value: "145" }, { value: "200" }],
      dataSrcList: [
        { value: "0", label: "手动" },
        { value: "1", label: "自动" },
      ],
      electricParamList: [], //修正后的电参力，后端获取
      displacementList: [], //位移数据
      eletime: "", //电参力的时间
      loadtime: "", //载荷力时间
      loadList: [],
      dataSrc: "1", //手动还是自动存入数据库的
      addTimesValue: "",
      checkDataSrcTime: 0,
      showAddTime: true, //是否展示叠加次数
      dialogShowEle: false,
      addEleData: {},
      point_number: [
        {
          value: "0",
          label: "145",
        },
        {
          value: "3",
          label: "200 ",
        },
      ],
    };
  },
  mounted() {},
  created() {
    this.GetRealdata();
  },
  watch: {
    wellID: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.getWellParamers();
        }
      },
    },
    wellpoint: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.getWellParamers();
        }
      },
    },
  },
  methods: {
    // 时间戳格式化为 YYYY/MM/DD HH:mm:ss
    timeFormat(date) {
      if (date) {
        date *= 1000;
        return dayjs(date).format("YYYY/MM/DD HH:mm:ss");
      } else {
        return "";
      }
    },
    openEle_force() {
      this.dialogShowEle = true;
    },
    // 保证添加点位类型选择不同时，对应的电参力数据聚焦
    currStationChange(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs["electinput"].focus();
        });
      }
    },
    submitEleForm(addEleData) {
      this.$refs["addEleData"].validate((valid) => {
        if (valid) {
          function dataFormat(dateVal) {
            return dayjs(dateVal).format("YYYYMMDDHHmmss");
          }
          let params = {};
          params = {
            well_id: this.wellID,
            data_src: "0",
            point_number: this.addEleData.point_number,
            adjustment_electrical_force: this.addEleData
              .adjustment_electrical_force,
            date: dataFormat(this.addEleData.time),
            displacement: this.addEleData.displacement,
          };
          postToStorage(params).then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.addEleData.adjustment_electrical_force = "";
              this.addEleData.displacement = "";
              this.$refs["electinput"].focus();
              // this.dialogShowEle = false;
              this.getWellParamers();
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    getWellDataSrc() {
      this.checkDataSrcTime++;
      this.loadingElect = true;
      this.loadingLoad = true;
      this.getWellParamers();
    },
    //获取油井列表
    GetRealdata() {
      ApiGetWellList({ page: 1, pagenum: 100 }).then((res) => {
        this.wellList = res.data.msg.well_list;
        this.wellList = this.wellList.filter((item) => item.well_type !== 1);
        let wellid = this.wellList.map((item) => {
          return item.id;
        });
        this.wellID = wellid[0];
      });
      /*
      ApiGetRealdata({
        realdata: "",
        pagenum: "100"
      }).then(({ data }) => {
        this.wellList = data.realdata;
        this.wellList=this.wellList.filter(item=>item.welltype!=="螺杆泵");//去掉螺杆泵的井号
        let wellid = this.wellList.map(item => {
          return item.wellid;
        });
        this.wellID = wellid[0];
     //   this.getWellDetails()
      //   this.getWellParamers();
        
      });*/
    },
    // 获取井的详细信息
    getWellDetails() {
      getWellDetail({ wellid: this.wellID, welldetail: "" }).then(
        ({ data }) => {
          this.welltype = data.msg.well_type;
        }
      );
    },
    // 选择不同井号，再调用两个图表，绘制图表
    getWellParamers() {
      this.getWellDetails();
      this.getParamers();
    },
    getParamers() {
      let data = {};
      // if(this.checkDataSrcTime == 0){
      //     data = {
      //        well_id: this.wellID,
      //        point_number: this.wellPoint
      //      };
      // }else{
      let dataSrc = "";
      if (this.dataSrc == "手动" || this.dataSrc == 0) {
        dataSrc = 0;
      } else if (this.dataSrc == "自动" || this.dataSrc == 1) {
        dataSrc = 1;
      }
      data = {
        well_id: this.wellID,
        point_number: this.wellPoint,
        data_src: dataSrc,
      };
      // }
      // 调后端接口，获取电参数值和位移值
      getFromStorage(data).then(({ data }) => {
        if (data.status == 0) {
          if (data.msg != null) {
            this.electricParamList = data.msg.adjustment_electrical_force;
            this.displacementList = data.msg.displacement;
            // this.time = data.msg.date
            this.eletime = "(" + this.timeFormat(data.msg.date) + ")"; //'yyyy/mm/dd hh:mm:ss';
            // this.dataSrc = data.msg.data_src
            if (data.msg.data_src == 0 || this.dataSrc == 0) {
              this.dataSrc = "手动";
            } else if (data.msg.data_src == 1 || this.dataSrc == 1) {
              this.dataSrc = "自动";
            }
            this.addTimesValue = data.msg.stacking_number;
            if (this.addTimesValue == null) {
              this.showAddTime = false;
            } else {
              this.showAddTime = true;
            }
            //获取载荷力
            this.getLoad();

            //获取调用电参力位移数据
            this.getStorage(this.displacementList, this.electricParamList);
          } else {
            this.electricParamList = [];
            this.displacementList = [];
            //获取载荷力

            this.getLoad();
            //获取调用电参力位移数据
            this.getStorage(this.displacementList, this.electricParamList);
            this.eletime = "";
          }
        } else {
          // this.$message.error(data.msg);
        }
      });
    },
    getStorage(displacementList, electricParamList) {
      let maxData = Math.max(...displacementList); //x轴展示的最大值
      let max = "";
      /**算法解释：为了调整横轴最大刻度值的格式，对程序进行分割处理。
      先找一下最大位移值，实际数据放入相应位置不改变。
      如果最大位移值大于1则加0.5,如果最大位移值小于1则加0.2。
      对处理后的数据进行四舍五入处理，然后设置该值为横坐标显示的最大刻度值**/
      if (maxData > 1) {
        max = (maxData + 0.5).toFixed(0);
      } else {
        max = (maxData + 0.2).toFixed(0);
      }
      let maxIndex = "";
      for (var i = 0; i < displacementList.length; i++) {
        if (displacementList[i] == maxData) {
          maxIndex = i;
        }
      }
      let maxinterval = max / 5; //把x轴分成5段
      let data = []; //自定义曲线图属性series中的data
      let arr = [];
      for (let i = 0; i < displacementList.length; i++) {
        arr[i] = [displacementList[i], electricParamList[i]];
      }
      data = arr;
      var _green = "image://" + green;
      let customOption = {
        title: {
          text: "电参力Kn" + this.eletime,
          textStyle: {
            fontSize: 20,
          },
          padding: [1, 5],
          left: "left",
          top: 10,
        },
        grid: {
          left: "5%",
          right: "15%",
          height: 265,
        },
        xAxis: {
          name: "位移",
          nameTextStyle: { fontSize: 16 },
          type: "value",
          splitLine: { show: false },
          boundaryGap: false,
          triggerEvent: true, //为标签添加触发事件
          interval: maxinterval,
          axisLabel: {
            fontSize: 14,
            formatter: (val) => {
              return val;
            },
          },
          max: max,
        },
        yAxis: {
          type: "value",
          splitLine: { show: false },
          axisLabel: { fontSize: 14 },
          nameTextStyle: { fontSize: 16 },
        },
        series: [
          {
            data: data,
            type: "line",
            smooth: true,
            symbolSize: "2",
            symbol: _green,
          },
        ],
        tooltip: {
          trigger: "item",
          confine: true,
          position: function (point, params, dom, rect, size) {
            //解决提示框遮挡问题
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
              posY = 5;
            } else {
              //上边放得下
              posY = y - boxHeight;
            }
            return [posX, posY];
          },
          formatter: function (params) {
            var tip = "";
            let value1 = params.value;
            let marker1 = params.marker;
            tip = params.value[0] + "<br />";
            tip = tip + marker1 + "电参力:" + params.value[1] + "<br />";
            if (value1 == "") {
              return "";
            } else {
              return tip;
            }
          },
        },
      };
      this.$nextTick(() => {
        this.loadingElect = false;
        this.$refs["overlying_chart"].initChart(customOption);
      });
    },
    getLoad() {
      // 对Y轴值进行处理
      let data_type = "";
      if (this.wellPoint == 145) {
        data_type = 0;
      } else {
        data_type = 1;
      }
      let manual = "";
      if (this.dataSrc == "手动" || this.dataSrc == 0) {
        manual = 0;
      } else if (this.dataSrc == "自动" || this.dataSrc == 1) {
        manual = 1;
      }
      let data = {
        id: this.wellID,
        p_type: "4",
        data_type: data_type,
        manual: manual,
      };
      ApiGetElectdata(data).then(({ data }) => {
        let displacementList = [];
        if (JSON.stringify(data) != "{}") {
          this.loadList = data.datas;
          displacementList = data.displacement;
          this.loadtime = "(" + data.time + ")"; //'yyyy/mm/dd hh:mm:ss';
        } else {
          this.loadtime = " ";
        }
        //  // 对x轴的值进行处理
        let maxData = Math.max(...displacementList); //x轴展示的最大值
        let max = ""; //设置横坐标显示的最大值
        /**算法解释：为了调整横轴最大刻度值的格式，对程序进行分割处理。
        先找一下最大位移值，实际数据放入相应位置不改变。
        如果最大位移值大于1则加0.5,如果最大位移值小于1则加0.2。
        对处理后的数据进行四舍五入处理，然后设置该值为横坐标显示的最大刻度值**/
        if (maxData > 1) {
          max = (maxData + 0.5).toFixed(0);
        } else {
          max = (maxData + 0.2).toFixed(0);
        }
        let maxinterval = max / 5; //把x轴分成5段
        let Data = []; //自定义曲线图属性series中的data
        let maxIndex = "";
        for (let i = 0; i < displacementList.length; i++) {
          Data[i] = [displacementList[i], this.loadList[i]];
          if (displacementList[i] == maxData) {
            maxIndex = i;
          }
        }
        var _green = "image://" + green;
        let customOption = {
          title: {
            text: "载荷力Kn" + this.loadtime,
            textStyle: {
              fontSize: 20,
            },
            // padding:[1,40,23,60],
            padding: [1, 5],
            left: "left",
            top: 10,
          },
          grid: {
            left: "5%",
            right: "15%",
            height: 265,
          },
          tooltip: {
            trigger: "item",
            confine: true,
            position: function (point, params, dom, rect, size) {
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
                posY = 5;
              } else {
                //上边放得下
                posY = y - boxHeight;
              }
              return [posX, posY];
            },
            formatter: function (params) {
              var tip = "";
              let value1 = params.value;
              let marker1 = params.marker;
              tip = params.value[0] + "<br />";
              tip = tip + marker1 + "载荷力:" + params.value[1] + "<br />";
              if (value1 == "") {
                return "";
              } else {
                return tip;
              }
            },
          },
          xAxis: {
            name: "位移",
            nameTextStyle: { fontSize: 16 },
            type: "value",
            splitLine: { show: false },
            triggerEvent: true, //为标签添加触发事件
            interval: maxinterval,
            axisLabel: {
              fontSize: 14,
              formatter: (val) => {
                return val;
              },
            },
            boundaryGap: false,
            max: max,
          },
          yAxis: {
            type: "value",
            minInterval: 10,
            splitLine: { show: false },
            axisLabel: { fontSize: 14 },
            nameTextStyle: { fontSize: 16 },
          },
          series: [
            {
              data: Data,
              type: "line",
              smooth: true,
              symbolSize: "2",
              symbol: _green,
            },
          ],
        };
        this.$nextTick(() => {
          this.loadingLoad = false;
          this.$refs["load_chart"].initChart(customOption);
        });
      });
    },
  },
};
</script>
<style lang="scss">
#signalElecticParam {
  .search-form {
    .el-form-item--mini.el-form-item {
      margin-right: 24px;
      margin-bottom: 0;
      .el-form-item__label {
        padding-right: 4px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
#signalElecticParam {
  .btn {
    text-align: right;
  }
  .col-bg-1 {
    padding: 5px 2px 0 5px;
  }
  .signal-title {
    display: flex;
    justify-content: center;
    .title-text {
      font-weight: bold;
      font-size: 20px;
    }
  }
  .signal-header {
    margin: 10px;
  }
  .signal-chart {
    margin: 10px;
  }
  .chart-title {
    font-weight: bold;
  }
  .chart {
    padding-top: 5px;
    height: 400px;
  }
  .workChart {
    margin-right: 10px;
    border-bottom: 1px solid #0000ff;
  }
}
</style>