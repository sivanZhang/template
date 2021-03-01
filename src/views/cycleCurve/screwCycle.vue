<template>
  <div id="diagQuery">
    <div class="diag-title">
      <div class="title-text">螺杆泵周波曲线分析界面</div>
    </div>
    <div class="diag-header">
      <el-card shadow="never">
        <el-row>
          <el-col :sm="5" :lg="5" class="col-bg-1">
            井名：
            <el-select
              v-model="wellName"
              filterable
              placeholder="请选择井名"
              style="width:150px;"
              @change="getWellDetails()"
            >
              <el-option
                v-for="item of wellList"
                :label="item.name"
                :value="item.wellid"
                :key="item.wellid"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :sm="5" :lg="5" class="col-bg" v-if="this.date==''">处置时间：{{"未处置"}}</el-col>
          <el-col :sm="5" :lg="5" class="col-bg" v-else>处置时间：{{time|dateTimeFormat}}</el-col>
          <el-col :sm="4" :lg="4" class="col-bg">
            油井类别：
            <span v-if="wellDetail.well_type == 0">抽油机</span>
            <span v-if="wellDetail.well_type == 1">螺杆泵</span>
          </el-col>
          <el-col :sm="4" :lg="4" v-if="handleSign">
            点数：
            <el-select
              v-model="wellPoint"
              filterable
              style="width:85px;"
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
          </el-col>
          <el-col :sm="4" :lg="4" v-if="handleSign">
            调用类型：
            <el-select
              v-model="dataSrc"
              filterable
              style="width:86px;"
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
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="diag-container">
      <el-row :gutter="10">
        <el-col :lg="11" :sm="11">
          <el-row>
            <el-card shadow="never" style="height:610px">
              <div style="display:flex;margin:10px">
                <span style="width:80px">诊断种类：</span>
                <span v-if="firstEntry == true">{{alarmDetail.title}}</span>
                <span v-else>
                  <span v-if="diagTitle">{{diagTitle}}</span>
                  <span v-else>{{"无诊断"}}</span>
                </span>
              </div>
              <div style="margin:10px 10px">
                <span style="width:80px;margin-top:13px">处理方式:</span>
                <el-input style="top:10px" v-model="dealContent" type="textarea" :rows="6"/>
              </div>
              <el-row class="row-bg">诊断种类选择:</el-row>
              <el-row class="row-bg">
                <el-col :lg="9" :sm="9">
                  1.
                  <el-checkbox v-model="normalParam" label="参数正常" @change="click1"></el-checkbox>
                </el-col>
                <el-col :lg="9" :sm="9">
                  9.
                  <el-checkbox v-model="changePump" label="换泵" @change="click10"></el-checkbox>
                </el-col>
                <el-col :lg="6" :sm="6">
                  17.
                   <el-checkbox v-model="pumpOff" label="泵脱" @change="click20"></el-checkbox>
                </el-col>
              </el-row>
              <el-row class="row-bg">
                <el-col :lg="9" :sm="9">
                  2.
                  <el-checkbox v-model="highParam" @change="click2" :disabled="lowParam">
                    参数高调低为
                    <el-input
                      oninput="value=value.replace(/[^\d.]/g,'')"
                      style="width:60px"
                      v-model="low"
                    />
                  </el-checkbox>
                </el-col>
                <el-col :lg="9" :sm="9">
                  10.
                  <el-checkbox v-model="washWell" label="洗井" @change="click11"></el-checkbox>
                </el-col>
                <el-col :lg="6" :sm="6">
                  18.
                 <el-checkbox v-model="tooTight" label="盘根过紧" @change="click23"></el-checkbox>
                </el-col>
              </el-row>
              <el-row class="row-bg">
                <el-col :lg="9" :sm="9">
                  3.
                  <el-checkbox v-model="lowParam" @change="click3" :disabled="highParam">
                    参数低调高为
                    <el-input
                      oninput="value=value.replace(/[^\d.]/g,'')"
                      style="width:60px"
                      v-model="high"
                    />
                  </el-checkbox>
                </el-col>
                <el-col :lg="9" :sm="9">
                  11.
                  <el-checkbox v-model="changeMotor" label="换电机" @change="click13"></el-checkbox>
                </el-col>
                <el-col :lg="6" :sm="6">
                  19.
                  <el-checkbox v-model="withPump" label="连抽带喷" @change="click24"></el-checkbox>
                  
                </el-col>
              </el-row>
              <el-row class="row-bg">
                <el-col :lg="9" :sm="9">
                  4.
                  <el-checkbox v-model="changeBelt" label="换皮带" @change="click4"></el-checkbox>
                </el-col>
                <el-col :lg="9" :sm="9">
                  12.
                  <el-checkbox v-model="verifyWell" label="核实井况" @change="click14"></el-checkbox>
                </el-col>
                <el-col :lg="6" :sm="6">
                  20. 
                  <el-checkbox v-model="sand" label="油井出沙" @change="click25"></el-checkbox>
                </el-col>
              </el-row>
              <el-row class="row-bg">
                <el-col :lg="9" :sm="9">
                  5.
                  <el-checkbox v-model="changePole" label="换杆" @change="click5"></el-checkbox>
                </el-col>
                <el-col :lg="9" :sm="9">
                  13.
                  <el-checkbox v-model="shortFluid" label="供液不足" @change="click15"></el-checkbox>
                </el-col>
                <el-col :lg="6" :sm="6">
                  21. 
                  <el-checkbox v-model="changePipe" label="换油管" @change="click27"></el-checkbox>
                </el-col>
              </el-row>
              <el-row class="row-bg">
                <el-col :lg="9" :sm="9">
                  6.
                  <el-checkbox v-model="rodBreak" label="杆断" @change="click6"></el-checkbox>
                </el-col>
                <el-col :lg="9" :sm="9">
                  14.
                  <el-checkbox v-model="miss" label="漏失" @change="click16"></el-checkbox>
                </el-col>
                <el-col :lg="6" :sm="6">
                  22.
                  <el-checkbox v-model="changeModel" label="换泵型" @change="click28"></el-checkbox>
                </el-col>
              </el-row>
              <el-row class="row-bg">
                <el-col :lg="9" :sm="9">
                  7.
                  <el-checkbox v-model="brokenBelt" label="皮带断" @change="click7"></el-checkbox>
                </el-col>
                <el-col :lg="9" :sm="9">
                  15.
                  <el-checkbox v-model="wax" label="结蜡" @change="click17"></el-checkbox>
                </el-col>
                <el-col :lg="6" :sm="6">
                  
                  
                </el-col>
              </el-row>
              <el-row class="row-bg">
                <el-col :lg="9" :sm="9">
                  8.
                  <el-checkbox v-model="abrasion" label="磨损" @change="click8"></el-checkbox>
                </el-col>
                <el-col :lg="9" :sm="9">
                  16.
                  <el-checkbox v-model="stuckPump" label="卡泵" @change="click19"></el-checkbox>
                </el-col>
              </el-row>
              <el-col v-if="this.auth==true">
                <el-button class="buttonSave" style="" type="primary" @click="save()" :disabled="complete">确认存储</el-button>
                <!-- <el-button type="primary" style="width:160px" class="button_diagnose"  >螺杆泵周波曲线自动诊断</el-button> -->
              </el-col>
            </el-card>
          </el-row>
        </el-col>
        <el-col :lg="13" :sm="13">
          <el-card
            shadow="never"
            :body-style="{overflowY:'scroll',height:'550px'}"
            style="height:610px"
          >
            <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="历史曲线" name="first"></el-tab-pane>
              <el-tab-pane label="处置过程" name="second">
                <handleProcess ref="handleProcess"
                  :processList="processList" 
                  :auth="auth" 
                  :show="show"
                  @getHistoryAlarm="getHistoryAlarm"
                  @change="change"/>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
     <adjustDialog 
      :auth="auth" 
      :orderList="orderList" 
      :wellName="wellName"
      :number="number"
      :wellDetail="wellDetail"
      @getWellDetails="getWellDetails"
      @getOrderList="getOrderList"
      />
    </div>
    <div style="margin-top:50px"></div>
  </div>
</template>
<script>
import {
  getWellDetail,
  ApiCreateOrder,
  ApiGetOrders,
  ApiDeleteOrder
} from "@/api/welldetail";
import {
  ApiAlarmHandle,
  ApiAlarmDirHand,
  ApiAlarmDeta,
  ApiHistoryAlarm
} from "@/api/alarmManagement";
import { ApiGetWellList } from "@/api/wellList";
import { ApiGetElectdata, ApiGetRealdata } from "@/api/realdata";
import { getFromStorage } from "@/api/electricParamater";
import dayjs from "dayjs";
import LineChart from "@/components/ECharts/LineMarker";
import adjustDialog from "@/components/AdjustInstruct/adjustDialog";
import handleProcess from "@/views/components/handleProcess"
export default {
  data() {
    return {
      wellPoint: 145,
      wellPointList: [{ value: "145" }, { value: "200" }],
      dataSrc: "自动", //手动还是自动存入数据库的
      dataSrcList: [
        { value: "0", label: "手动" },
        { value: "1", label: "自动" }
      ],
      checkDataSrcTime: 0,
      loadingElect: false,
      loadingLoad: false,
      electricParamList: [], //修正后的电参力，后端获取
      displacementList: [], //位移数据
      addTimesValue: "",
      showAddTime: true, //是否展示叠加次数
      time: "",
      explainVisible: false,
      wellList: [],
      processList: [],
      //判断右边选项卡是否显示处置过程：显示处置过程handle为true,
      //显示典型示功图为false.默认展示典型示功图
      alarmDetail: [],
      unhandledAlarm: [], //未处置告警种类
      wellDetail: [],
      dealContent: "",
      auth: "",
      dialogVisible: false,
      imageList: [
        {
          name: "1",
          url: require("@/assets/pump_images/image1.png")
        },
        {
          name: "2",
          url: require("@/assets/pump_images/image2.png")
        },
        {
          name: "3",
          url: require("@/assets/pump_images/image3.png")
        },
        {
          name: "4",
          url: require("@/assets/pump_images/image4.png")
        },
        {
          name: "5",
          url: require("@/assets/pump_images/image5.png")
        },
        {
          name: "6",
          url: require("@/assets/pump_images/image6.png")
        }
      ],
      rules: {},
      value: "",
      number: "",
      normalParam: false,
      changePump: false,
      stuckPump: false,
      highParam: false,
      low: "",
      washWell: false,
      pumpOff: false,
      lowParam: false,
      high: "",
      balance: false,
      pumpstroke: false,
      changeBelt: false,
      changeMotor: false,
      tooFast: false,
      changePole: false,
      verifyWell: false,
      tooTight: false,
      rodBreak: false,
      shortFluid: false,
      withPump: false,
      brokenBelt: false,
      miss: false,
      sand: false,
      abrasion: false,
      wax: false,
      wellhead: false,
      gasBlock: false,
      unbalance: false,
      changePipe: false,
      changeModel: false,
      checkList: [],
      date: [],
      time: "",
     // wellId: 0,
      warningId: 0, 
      warnid: 0, //往后端发送的告警id
      complete: false, //判断是否已保存处置
      param1: false,
      param2: false,
      orderList: [],
      wellName: "",
      warning_id: "",
      diagId:"",  //左边选项卡显示的诊断种类的Id
      diagTitle: "", //左边选项卡显示井的处置种类
      firstEntry: false, //判断是否为首次进入该界面，
      handleStatus: [], //判断井的状态是否已处置
      activeName: "second",
      handleSign: false,
      show:true, //处置过程中是否展示‘立即处置’按钮
      current:false,  //是否点击了右边选项卡中的'立即处置'按钮
      typeTitle:""    //点击了右边选项卡中的‘立即处置’按钮之后左边选项卡中显示的诊断种类
    };
  },
  components: {
    LineChart,
    adjustDialog,
    handleProcess
  },
  watch: {
    low: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          let index = this.checkList.indexOf("参数高调低为" + oldVal);
          if (this.highParam == true) {
            this.checkList.splice(index, 1);
            this.checkList.push("参数高调低为" + newVal);
          }
          this.dealContent = String(this.checkList);
        } else {
          let index = this.checkList.indexOf("参数高调低为" + oldVal);
          if (this.highParam == true) {
            this.checkList.splice(index, 1);
            this.checkList.push("参数高调低为" + this.low);
          }
          this.dealContent = String(this.checkList);
        }
      }
    },
    high: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          let index = this.checkList.indexOf("参数低调高为" + oldVal);
          if (this.lowParam == true) {
            this.checkList.splice(index, 1);
            this.checkList.push("参数低调高为" + newVal);
          }
          this.dealContent = String(this.checkList);
        } else {
          let index = this.checkList.indexOf("参数低调高为" + oldVal);
          if (this.lowParam == true) {
            this.checkList.splice(index, 1);
            this.checkList.push("参数低调高为" + this.high);
          }
          this.dealContent = String(this.checkList);
        }
      }
    },
        wellName: {
      handler: function(newVal, oldVal) {
        if (newVal){
          if(oldVal == "" && this.$route.query.warnId){
            this.firstEntry = true;
            if (this.$route.query.warnName == "皮带断") {
              this.changeBelt = true;
              this.index7 = this.checkList.push("换皮带");
            }
            if (this.$route.query.warnName == "结蜡") {
              this.washWell = true;
              this.checkList.push("洗井");
            }
            if (this.$route.query.warnName == "参数高") {
              this.highParam = true;
              this.param1 = true;
              this.checkList.push("参数高调低为" + this.low);
            }
            if (this.$route.query.warnName == "参数低") {
              this.lowParam = true;
              this.param2 = true;
              this.checkList.push("参数低调高为" + this.high);
            }
            if (this.$route.query.warnName == "杆断") {
              this.changePole = true;
              this.checkList.push("换杆");
            }
            if (this.$route.query.warnName == "漏失") {
              this.verifyWell = true;
              this.checkList.push("核实井况");
            }
            this.dealContent = String(this.checkList);
            ApiAlarmDeta({ warningid: this.$route.query.warnId }).then(
              ({ data }) => {
                this.alarmDetail = data.msg;
              }
            )
          }else{
            this.firstEntry = false;
          }
        } 
      }
    }
  },
  methods: {
    openExplain() {
      this.explainVisible = true;
    },
    //获取指令列表
    getOrderList() {
      ApiGetOrders({ wellid: this.wellName }).then(res => {
        this.orderList = res.data.msg;
      });
    },
    //获取所有井列表
    GetwellList() {
      ApiGetRealdata({ realdata: "", well_type: 1, pagenum: 100 }).then(
        ({ data }) => {
          let wellid = [];
          this.wellList = data.realdata;
          wellid = this.wellList.map(item => {
            return item.wellid;
          });
          if (this.wellList.length !== 0) {
            if (this.$route.query.wellId) {
              this.wellName = this.$route.query.wellId;
            } else {
              this.wellName = wellid[0];
            }
            this.getWellDetails();
          } else {
            this.wellName = "";
          }
        }
      );
    },
    //获取井的详情
    getWellDetails() {
      getWellDetail({ id: this.wellName, json: "" }).then(({ data }) => {
        this.wellDetail = data.well;
        this.number = data.well.number;
        this.auth = data.auth.order;
        this.getHistoryAlarm();
        this.getOrderList();
        if (this.$route.query.warnId) {
          this.getAlarmDetail();
        }
      });
    },
    handleClick(tab) {
      if (tab.name == "first") {
        this.$router.push({
          name: "history-data",
          query: { id: this.wellName }
        });
        this.handleSign = true;
      } else {
        this.handleSign = false;
      }
    },
    //告警详情
    getAlarmDetail() {
      this.checkList = []
      this.dealContent = ""
      this.changeBelt = false
      this.washWell = false
      this.highParam = false
      this.low = ""
      this.lowParam = false
      this.high = ""
      this.changePole = false
      this.verifyWell = false
      if (this.diagTitle == "皮带断") {
        this.changeBelt = true;
        this.index7 = this.checkList.push("换皮带");
      }
      if (this.diagTitle == "结蜡") {
        this.washWell = true;
        this.checkList.push("洗井");
      }
      if (this.diagTitle == "参数高") {
        this.highParam = true;
        this.param1 = true;
        this.checkList.push("参数高调低为" + this.low);
      }
      if (this.diagTitle == "参数低") {
        this.lowParam = true;
        this.param2 = true;
        this.checkList.push("参数低调高为" + this.high);
      }
      if (this.diagTitle == "杆断") {
        this.changePole = true;
        this.checkList.push("换杆");
      }
      if (this.diagTitle == "漏失") {
        this.verifyWell = true;
        this.checkList.push("核实井况");
      }
      this.dealContent = String(this.checkList);
      if(this.diagId !== ""){
        ApiAlarmDeta({ warningid: this.diagId }).then(
          ({ data }) => {
            this.alarmDetail = data.msg;
          }
        );
      }
    },
    //子组件改变父组件中的值
    change(current,typeTitle,complete,changeBelt,
      washWell,highParam,low,lowParam,high,param1,param2,
      changePole,verifyWell,checkList,dealContent,warningId){
      this.current = current
      this.typeTitle = typeTitle
      this.complete = complete
      this.changeBelt = changeBelt
      this.washWell = washWell
      this.highParam = highParam
      this.low = low
      this.lowParam = lowParam
      this.high = high
      this.param1 = param1
      this.param2 = param2
      this.changePole = changePole
      this.verifyWell = verifyWell
      this.checkList = checkList
      this.dealContent =dealContent
      this.warningId = warningId
    },
    //历史告警
    getHistoryAlarm() {
      this.diagTitle = "";
      this.diagId = ""
      this.date = []
      let id = [];
      let title = [];
      let time = [];
      this.handleStatus = [];
      ApiHistoryAlarm({
        id: this.wellName,
        history: "",
        list: ""
      }).then(({ data }) => {
        this.processList = data.msg;
        if (this.processList.length !== 0) {
          this.processList.map(item => {
            id.push(item.id);
            title.push(item.title);
            time.push(item.date_handled);
            this.handleStatus.push(item.status);
          });
          for (let i = 0; i < time.length; i++) {
            if (time[i] !== null) {
              this.date.push(time[i]);
            }
          }
          let date = this.date.sort(function(a, b) {
            return b - a;
          });
          this.time = date[0];
          for (let i = 0; i < this.handleStatus.length; i++) {
            let diagTitle = [];
            let diagId = []
            if (this.handleStatus[i] == 0) {
              diagTitle.push(title[i]);
              diagId.push(id[i])
              this.diagTitle = String(diagTitle[0]);
              this.diagId = diagId[0]
            }
          }
          this.warning_id = id[0];
          if(this.firstEntry == false){  //如果不是首次进入该页面
            this.getAlarmDetail()
          }
        } else {
          this.warning_id = "";
        }
      });
    },
    //确认存储
    save() {
      /* 如果不存在新增的告警，此处0为新增，1为忽略
      2为关闭，3为误报，4为已处置
      则调用无告警的直接处置接口*/
      if (this.handleStatus.length == 0 || this.handleStatus.indexOf(0) == -1) {  
        //无告警直接处置
        ApiAlarmDirHand({
          well_id: this.wellName,
          method: "put",
          process: this.dealContent
        }).then(({ data }) => {
          if (data.status == 0) {
            this.complete = true;
            this.$message.success(data.msg);
            this.getHistoryAlarm();
            this.checkList = [],
            this.dealContent = "",
            this.normalParam = false,
            this.changePump = false,
            this.highParam = false,
            this.low = "",
            this.washWell = false,
            this.lowParam = false,
            this.high = "",
            this.balance = false,
            this.changeBelt = false,
            this.changeMotor = false,
            this.changePole = false,
            this.verifyWell = false;
          } else {
            this.$message.error(data.msg);
          }
          this.complete=false;
        });
      } else {
        if (this.current == false ) {
          if(this.firstEntry == true){
            this.id = this.$route.query.warnId;
          }else{
            this.id = this.diagId
          }
        } else {
          this.id = this. warningId;
        }
        //有告警处置
        ApiAlarmHandle({
          warning_id: this.id,
          method: "put",
          process: this.dealContent
        }).then(({ data }) => {
          if (data.status == 0) {
            this.complete = true;
            this.$message.success(data.msg);
            this.getHistoryAlarm();
            this.checkList = [],
            this.dealContent = "",
            this.normalParam = false,
            this.changePump = false,
            this.highParam = false,
            this.low = "",
            this.washWell = false,
            this.lowParam = false,
            this.high = "",
            this.balance = false,
            this.changeBelt = false,
            this.changeMotor = false,
            this.changePole = false,
            this.verifyWell = false;
          } else {
            this.$message.error(data.msg);
          }
          this.complete=false;
        });
      }
    },
    showImage() {
      this.dialogVisible = true;
    },
    //参数正常
    click1() {
      let index = this.checkList.indexOf("参数正常");
      if (this.normalParam == true) {
        this.checkList.push("参数正常");
      } else if (this.normalParam == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //换泵
    click10() {
      let index = this.checkList.indexOf("换泵");
      if (this.changePump == true) {
        this.checkList.push("换泵");
      } else if (this.changePump == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //卡泵
    click19() {
      let index = this.checkList.indexOf("卡泵");
      if (this.stuckPump == true) {
        this.checkList.push("卡泵");
      } else if (this.stuckPump == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //调低参数
    click2() {
      let index = this.checkList.indexOf("参数高调低为" + this.low);
      if (this.highParam == true) {
        this.checkList.push("参数高调低为" + this.low);
      } else if (this.highParam == false && index > -1) {
        this.low = "";
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //洗井
    click11() {
      let index = this.checkList.indexOf("洗井");
      if (this.washWell == true) {
        this.checkList.push("洗井");
      } else if (this.washWell == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //泵脱
    click20() {
      let index = this.checkList.indexOf("泵脱");
      if (this.pumpOff == true) {
        this.checkList.push("泵脱");
      } else if (this.pumpOff == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //调高参数
    click3() {
      if (this.high == "") {
        this.param2 = true;
      }
      let index = this.checkList.indexOf("参数低调高为" + this.high);
      if (this.lowParam == true) {
        this.checkList.push("参数低调高为" + this.high);
      } else if (this.lowParam == false && index > -1) {
        this.high = "";
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //调平衡
    click12() {
      let index = this.checkList.indexOf("调平衡");
      if (this.balance == true) {
        this.checkList.push("调平衡");
      } else if (this.balance == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //泵击液
    click21() {
      let index = this.checkList.indexOf("泵击液");
      if (this.pumpstroke == true) {
        this.checkList.push("泵击液");
      } else if (this.pumpstroke == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //换皮带
    click4() {
      let index = this.checkList.indexOf("换皮带");
      if (this.changeBelt == true) {
        this.checkList.push("换皮带");
      } else if (this.changeBelt == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //换电机
    click13() {
      let index = this.checkList.indexOf("换电机");
      if (this.changeMotor == true) {
        this.checkList.push("换电机");
      } else if (this.changeMotor == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //冲次过快
    click22() {
      let index = this.checkList.indexOf("冲次过快");
      if (this.tooFast == true) {
        this.checkList.push("冲次过快");
      } else if (this.tooFast == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //换杆
    click5() {
      let index = this.checkList.indexOf("换杆");
      if (this.changePole == true) {
        this.checkList.push("换杆");
      } else if (this.changePole == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //核实井况
    click14() {
      let index = this.checkList.indexOf("核实井况");
      if (this.verifyWell == true) {
        this.checkList.push("核实井况");
      } else if (this.verifyWell == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //盘根过紧
    click23() {
      let index = this.checkList.indexOf("盘根过紧");
      if (this.tooTight == true) {
        this.checkList.push("盘根过紧");
      } else if (this.tooTight == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //杆断
    click6() {
      let index = this.checkList.indexOf("杆断");
      if (this.rodBreak == true) {
        this.checkList.push("杆断");
      } else if (this.rodBreak == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //供液不足
    click15() {
      let index = this.checkList.indexOf("供液不足");
      if (this.shortFluid == true) {
        this.checkList.push("供液不足");
      } else if (this.shortFluid == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //连抽带喷
    click24() {
      let index = this.checkList.indexOf("连抽带喷");
      if (this.withPump == true) {
        this.checkList.push("连抽带喷");
      } else if (this.withPump == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //皮带断
    click7() {
      let index = this.checkList.indexOf("皮带断");
      if (this.brokenBelt == true) {
        this.checkList.push("皮带断");
      } else if (this.brokenBelt == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //漏失
    click16() {
      let index = this.checkList.indexOf("漏失");
      if (this.miss == true) {
        this.checkList.push("漏失");
      } else if (this.miss == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //油井出沙
    click25() {
      let index = this.checkList.indexOf("油井出沙");
      if (this.sand == true) {
        this.checkList.push("油井出沙");
      } else if (this.sand == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //磨损
    click8() {
      let index = this.checkList.indexOf("磨损");
      if (this.abrasion == true) {
        this.checkList.push("磨损");
      } else if (this.abrasion == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //结蜡
    click17() {
      let index = this.checkList.indexOf("结蜡");
      if (this.wax == true) {
        this.checkList.push("结蜡");
      } else if (this.wax == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //上碰井口
    click26() {
      let index = this.checkList.indexOf("上碰井口");
      if (this.wellhead == true) {
        this.checkList.push("上碰井口");
      } else if (this.wellhead == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //气堵
    click9() {
      let index = this.checkList.indexOf("气堵");
      if (this.gasBlock == true) {
        this.checkList.push("气堵");
      } else if (this.gasBlock == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //不平衡
    click18() {
      let index = this.checkList.indexOf("不平衡");
      if (this.unbalance == true) {
        this.checkList.push("不平衡");
      } else if (this.unbalance == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //换油管
    click27() {
      let index = this.checkList.indexOf("换油管");
      if (this.changePipe == true) {
        this.checkList.push("换油管");
      } else if (this.changePipe == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //换泵型
    click28() {
      let index = this.checkList.indexOf("换泵型");
      if (this.changeModel == true) {
        this.checkList.push("换泵型");
      } else if (this.changeModel == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    }
  },
  mounted() {
    this.GetwellList();
  }
};
</script>
<style lang="scss" scoped>
#diagQuery {
  height: 100%;
  font-size: 14px;
  .btn-explain {
    padding-left: 10px;
    font-size: 12px;
    color: #808080;
    cursor: pointer;
  }
  .diag-title {
    display: flex;
    justify-content: center;
    .title-text {
      font-weight: bold;
      font-size: 20px;
    }
  }
  .border {
    border: 1px solid #d3d6d5;
    width: 600px;
    height: 50px;
    padding: 3px;
    border-radius: 5px;
  }
  .diag-header {
    margin: 10px;
  }
  .diag-container {
    margin: 10px;
  }
  .row-bg {
    margin-left: 10px;
    margin-top: 20px;
  }
  .title {
    margin-top: 10px;
    font-size: 17px;
    font-weight: bold;
  }
  .col-bg-1 {
    padding: 5px 2px 0 10px;
  }
  .col-bg {
    padding: 5px 2px 0 45px;
  }
  // .el-button {
  //   width: 110px;
  //   height: 40px;
  //   margin-left: 10px;
  //   margin-top: 20px;
  // }
  // .butn {
  //   text-align: right;
  //   margin-top: 30px;
  // }
  .process-item {
    margin-top: 5px;
  }
  .chart {
    height: 360px;
  }

@media screen and (min-width:1024px){
  .buttonSave{
    position:absolute;
    bottom:10px;
    left:0px;
  }
   .button_diagnose{
    position:absolute;
    bottom:10px;
    left:120px;
  }
}

@media screen and (max-width:1023px){
   .buttonSave{
    margin:20px 0px 0px -20px;
  }
}

  .buttonSave, .button_diagnose {
      width: 110px;
      height: 37px;
    }
}
</style>