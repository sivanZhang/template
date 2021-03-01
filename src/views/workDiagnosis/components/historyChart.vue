<template>
  <div id="indicatorDiagram">
    <div class="indicator-header">
        <el-row class="row-bg">
          <el-col :lg="10">
            时间：
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
              size="mini"
              @change="getWellParamers()"
            ></el-date-picker>
          </el-col>
          <el-col :lg="6">
            点数：
            <el-select
              v-model="wellPoint"
              filterable
              style="width:80px;"
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
          <el-col :lg="8">
            调用类型：
            <el-select
              v-model="dataSrc"
              filterable
              style="width:100px;"
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
    </div>
    <div style="margin:10px">
      <div v-loading="eleLoading">
        <div class="chart" style="height:380px">
          <LineChart
            ref="ele_chart"
            style="width: 600px;"
            chart-id="ele_chart"
          />
        </div>
        <div style="text-align:center;position:relative;padding-bottom:15px">
            <el-button icon="el-icon-arrow-left" @click="eleLeftmove" :disabled="eleShowLeftarrow"></el-button>
            <el-button icon="el-icon-arrow-right" @click="eleRightmove" :disabled="eleShowRightarrow"></el-button>
            <span class="historyCount">历史数据个数：{{eleHistoryCount}}，当前第:{{eleNum}}个</span>        
        </div>
      </div>
      <div v-loading="loadLoading">
        <div class="chart" style="height:380px">
          <LineChart
            ref="load_chart"
            style="width: 600px;"
            chart-id="load_chart"
          />
        </div>
        <div style="text-align:center;position:relative;">
            <el-button icon="el-icon-arrow-left" @click="loadLeftmove" :disabled="loadShowLeftarrow"></el-button>
            <el-button icon="el-icon-arrow-right" @click="loadRightmove" :disabled="loadShowRightarrow"></el-button>        
            <span class="historyCount">历史数据个数：{{loadHistoryCount}}，当前第:{{loadNum}}个</span>
            </div>
      </div>
    </div>
    <div style="margin-top:50px"></div>
  </div>
</template>
<script>
import { ApiGetRealdata, ApiGetElectdata } from "@/api/realdata";
import { getWellDetail } from "@/api/welldetail";
import { getFromStorage } from "@/api/electricParamater";
import LineChart from "@/components/ECharts/LineMarker";
import dayjs from "dayjs";
import green from '../../../assets/green.png'
export default {
  data() {
    return {
      eTime:"",//电参力
      eleLoading: false,
      loadLoading: false,
      type: this.$route.query.type,
      wellList: [],
      eleNum: 0,
      loadNum:0,
      wellID: "",
      wellPoint: "145",
      welltype: 0, //油井类别，暂为螺杆泵 ,全部：-1 , 0 # 抽油机, 1 # 螺杆泵
      wellPointList: [{ value: "145" }, { value: "200" }],
      dataSrcList: [
        { value: "0", label: "手动" },
        { value: "1", label: "自动" }
      ],
      dataList: [],
      electricParamList: [], //修正后的电参力，后端获取
      displacementList: [], //位移数据
      // time: "",
      loadList: [],
      datePicker: "",
      eleHistoryCount: "0",
      loadHistoryCount:"0",
      dataSrc: "", //手动还是自动存入数据库的
      checkDataSrcTime: 0,
      addTimesValue: "",
      // nodata:false,
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
      // 电参数平移时用的参数
      xAxisdataList: [], //X轴的数值
      ytopElecPramList: [], //y轴上半部分值
      ybottomElecPramList: [], //y轴下半部分值
      // moveLength: 0, //图表左移后剩的数组长度

      // 用于storage中存储后端返回的电参力值
      elecTopParames: [],
      elecBottomParames: [],
      // 载荷力平移时用的参数
      ytopLoadList: [], //y轴上半部分值
      ybottomLoadList: [], //y轴下半部分值
      moveLoadLength: 0, //图表左移后剩的数组长度
      loadTopParames: [],
      loadBottomParames: [],
      // 两者公用的值
      eleShowLeftarrow: false, //电参力左边箭头可用
      loadShowLeftarrow:false, //载荷力左边箭头可用
      eleShowRightarrow: true, //电参力右边箭头禁用
      loadShowRightarrow:true, //载荷力右边箭头禁用
      max:""  ,  //曲线图横轴显示的最大刻度值
      // count: 0
      maxinterval:'',
    };
  },
  props:["wellName"],
  components: {
    LineChart
  },
  watch: {
    
  },
  created() {
    this.eleLoading = true;
    this.loadLoading = true;
    var list = this.getDateRange(new Date(), 30, true);
    this.datePicker = [list[0], list[1]];
  },
  mounted() {},
  methods: {
    // 时间戳格式化为 YYYY/MM/DD HH:mm:ss
    timeFormat(date){
      if(date){
        date*=1000;
        return dayjs(date).format('YYYY/MM/DD HH:mm:ss');
      }else{
        return '';
      }
    },
    getWellDataSrc() {
      this.checkDataSrcTime++;
      this.getWellParamers();
      this.eleLoading = true;
      this.loadLoading = true
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
    // 对电参叠加力进行左右移动
    // 图表进行移动(箭头左移，右移)
    eleLeftmove() {
      this.eleNum--;
        /* ############# 对电参力进行左右平移 ############## */
        this.eleShowRightarrow = false;
        // 左移了多少条数据
        let lenleft = this.eleHistoryCount - this.eleNum;
        // 左移一个值的话，相当于删除数组的第一条值（最新的值）
        let dataList = this.dataList
        dataList = dataList.slice(lenleft,this.eleHistoryCount)
        // 判断当前为第几条数据（若大于1，还可左移，<=1，就不可左移)
        if (this.eleNum >= 1) {
          this.eleShowRightarrow = false;
          this.showCharts(dataList);
          if(this.eleNum == 1){
            this.eleShowLeftarrow = true;
          }
        } else {
          this.eleShowLeftarrow = true;
          this.eleShowRightarrow = false;
        }
     //    } 
    },
    eleRightmove() {
      this.eleNum++;
      // 右移：类似于对数组添加一个(日期由远及近)值
      // 从仓库中获取到后端返回的所有Y轴值
         //   if (this.type == 1) {
        /*############ 对电参力进行左右平移 #############*/
        // // 从storage中取出存储的所有Y轴（电参力）的值
        // let storeTopParames = this.$store.state.elecParame.elecTopParames;
        // let storeBottomParames = this.$store.state.elecParame.elecBottomParames;
        // 右移了多少条数据
        let lenRight = this.eleHistoryCount - this.eleNum;
        if(this.eleNum <= this.eleHistoryCount){
          let dataList = this.dataList
          dataList = dataList.slice(lenRight)
          this.showChartsrigth(dataList);
          // this.elecTopParames = storeTopParames.slice(lenRight);
          // this.elecBottomParames = storeBottomParames.slice(lenRight);
          this.eleShowLeftarrow = false;
          // this.showChartsrigth(this.xAxisdataList,this.elecTopParames,this.elecBottomParames,this.max);
          // this.eTime=" ("+this.timeFormat(this.dataList[this.eleNum-1].date)+")";
          if(this.eleNum == this.eleHistoryCount){
            this.eleShowRightarrow = true;
          }
        }else{
          this.eleShowRightarrow = true;
          this.eleShowLeftarrow = false;
        }
        //   } 
    },
    loadLeftmove(){
      this.loadNum--;
      // this.time=this.loadList[this.loadNum-1].time;//时间随着曲线的改变而改变
        /* ############# 对载荷力进行左右平移 ############*/
        this.loadShowRightarrow = false;
        // 把仓库中保存的载荷力值拿出来
        // let storeTopParames = this.$store.state.elecParame.loadTopParames;
        // let storeBottomParames = this.$store.state.elecParame.loadBottomParames;
        // 左移了多少条数据
        // console.log("总共多少条数据："+this.loadHistoryCount)
        // console.log("当前是第几条数据："+this.loadNum)
        let lenleft = this.loadHistoryCount - this.loadNum;
        // 左移一个值的话，相当于删除数组的第一条值
        let dataList = this.loadList
        dataList = dataList.slice(lenleft,this.loadHistoryCount)
        // 判断当前为第几条数据（若大于1，还可左移，<=1，就不可左移)
        if (this.loadNum >= 1) {
          this.loadShowRightarrow = false;
          this.showLoadCharts(dataList);
          if(this.loadNum == 1){
            this.loadShowLeftarrow = true;
          }
        } else {
          this.loadShowLeftarrow = true;
          this.loadShowRightarrow = false;
        }
    },
    loadRightmove(){
       this.loadNum++;
      // 右移：类似于对数组添加一个(日期由远及近)值
        // 右移了多少条数据
        let lenRight = this.loadHistoryCount - this.loadNum;
        let dataList = this.loadList
        dataList = dataList.slice(lenRight)
        if(this.loadNum <= this.loadHistoryCount){
          this.loadShowLeftarrow = false;
          this.showLoadChartsright(dataList);
          if(this.loadNum == this.loadHistoryCount){
            this.loadShowRightarrow = true;
          }
        }else{
          this.loadShowRightarrow = true;
          this.loadShowLeftarrow = false;
        } 
    },
    getWellParamers() {
      
     // 选择不同井号，再调用两个图表，绘制图表
    //  调用电参力曲线图
      this.getParamers();
      // 调用载荷力曲线图
      this.getLoadParames()
    },
    
    //获取调用电参力数据
    getParamers() {
      // 调后端接口，获取电参数值和位移值
      let data = {};
      /* ##########
        判断：是否是第一次调接口（第一次的话，从后端获取data_src：‘类型为手动还是自动的’，
        后面调接口，需要传data_src：‘用户自己搜索,选择的’）
       ##########*/
      if (this.checkDataSrcTime == 0) {
        data = {
          well_id: this.wellName,
          point_number: this.wellPoint,
          daterange: this.datePicker[0] + "-" + this.datePicker[1]
        };
      } else {
        let dataSrc = "";
        if (this.dataSrc == "手动" || this.dataSrc == 0) {
          dataSrc = 0;
        } else if (this.dataSrc == "自动" || this.dataSrc == 1) {
          dataSrc = 1;
        }
        data = {
          well_id: this.wellName,
          point_number: this.wellPoint,
          data_src: dataSrc,
          daterange: this.datePicker[0] + "-" + this.datePicker[1]
        };
      }
      getFromStorage(data).then(({ data }) => {
        if (data.status == 0) {
          if (data.msg.length != 0) {
            this.dataList = data.msg;//电参力的值
                this.eleHistoryCount = this.dataList.length;
                this.eleNum = this.eleHistoryCount;
                if (this.checkDataSrcTime != 0) {
                  if (data.msg[0].data_src == 0 || this.dataSrc == 0) {
                    this.dataSrc = "手动";
                  } else if (data.msg[0].data_src == 1 || this.dataSrc == 1) {
                    this.dataSrc = "自动";
                  }
                }else{
                  this.dataSrc = "";
                }
                
                 this.eleShowRightarrow = true;
                 if(this.eleNum==1)
                 {
                    this.eleShowLeftarrow = true;
                 }
                 else
                 {
                   this.eleShowLeftarrow = false;
                 }
              //获取调用电参力位移数据（后续对数据进行处理，展示到echarts中）
              this.showCharts(this.dataList);
          } else {
            this.eTime="";
            // console.log("没有值：")
            //此处电参力的值和位移值都为空，所以历史电参力和历史载荷力的总数都设为0,左右箭头也不可以使用
              this.eleShowRightarrow = true;
              this.eleShowLeftarrow = true;
              this.eleHistoryCount = 0;
              this.eleNum = 0;
              let dataList = [];
              //获取调用电参力位移数据
              this.showCharts(dataList);
        //    } 
          }
        } else {
          // this.$message.error(data.msg);
        }
      });
    },
    // 左移展示电参叠加力图表
    showCharts(dataList) {
      let eleData = dataList.length !=0 ?dataList[0].adjustment_electrical_force:[]
      let displacement = dataList.length !=0 ?dataList[0].displacement:[]
      let maxData = Math.max(...displacement); //x轴展示的最大值
      let maxIndex = ''
      for(var i=0;i<displacement.length;i++){
        if(displacement[i] == maxData){
          maxIndex = i
        }
      }
      let max = ""   //设置横坐标显示的最大值     
      if (displacement != undefined && dataList != undefined) {
        /**算法解释：为了调整横轴最大刻度值的格式，对程序进行分割处理。
        先找一下最大位移值，实际数据放入相应位置不改变。
        如果最大位移值大于1则加0.5,如果最大位移值小于1则加0.2。
        对处理后的数据进行四舍五入处理，然后设置该值为横坐标显示的最大刻度值**/
        if(maxData > 1){
          max = (maxData + 0.5).toFixed(0) 
        }else{
          max = (maxData + 0.2).toFixed(0)
        }
        // displacement.push(maxData+0.2);
      }
        this.maxinterval=max/5;  //把x轴分成5段
      // this.max = max
      let data = []    //自定义曲线图属性series中的data
      for(let i = 0;i < displacement.length;i ++){
        data[i] = [displacement[i],eleData[i]]
      }
      let time = dataList.length !=0 ?" ("+this.timeFormat(dataList[0].date)+")":'';
      var _green = 'image://' + green
      let customOption = {
        title: {
          text: "电参力Kn"+time,
          textStyle: {
            fontSize: 20
          },
          padding: [1, 5],
          left: "left",
          top: 10
        },
        grid: {
          left: "5%",
          right: "10%",
          height:265
        },
        tooltip: {
          trigger: "item",
          confine: true,
          position: function(point, params, dom, rect, size) { //解决提示框遮挡问题
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
          formatter:function(params){
            // console.log(params)
            var tip = "";
            let value1 = params.value;
            let marker1 = params.marker;
            tip = params.value[0] +'<br />';
             tip = tip + marker1 +'电参力:' + params.value[1] +'<br />'
            if(value1 == ""){
              return ""
            }else{
              return tip;
            }
          }
        },
        xAxis: {
          name:"位移",
          nameTextStyle: { fontSize: 16 },
          type: 'value',
          splitLine: { show: false },
          boundaryGap: false,
          triggerEvent: true, //为标签添加触发事件
           interval:this.maxinterval,
          axisLabel: {
            fontSize: 14,
            formatter: (val) => {
              return val
            }
          },
          max:max
        },
        yAxis: {
          type: "value",
          minInterval: 10,
          splitLine: { show: false },
          axisLabel: { fontSize: 14 },
          nameTextStyle: { fontSize: 16 }
        },
        series: [{
          data: data,
          type: 'line',
          smooth:true,
          symbolSize:'2',
          symbol:_green,
        }]
      };
      this.$nextTick(() => {
        this.eleLoading = false;
        this.$refs["ele_chart"].initChart(customOption);
      });
    },
    // 右移展示电参力
     showChartsrigth(dataList) {
      let eleData = dataList.length !=0 ?dataList[0].adjustment_electrical_force:[]
      let displacement = dataList.length !=0 ?dataList[0].displacement:[]
      let maxData = Math.max(...displacement); //x轴展示的最大值
      let max = ""   //设置横坐标显示的最大值     
      let maxIndex = ''
      for(var i=0;i<displacement.length;i++){
        if(displacement[i] == maxData){
          maxIndex = i
        }
      }
      if (displacement != undefined && dataList != undefined) {
        /**算法解释：为了调整横轴最大刻度值的格式，对程序进行分割处理。
        先找一下最大位移值，实际数据放入相应位置不改变。
        如果最大位移值大于1则加0.5,如果最大位移值小于1则加0.2。
        对处理后的数据进行四舍五入处理，然后设置该值为横坐标显示的最大刻度值**/
        if(maxData > 1){
          max = (maxData + 0.5).toFixed(0) 
        }else{
          max = (maxData + 0.2).toFixed(0)
        }
        // displacement.push(maxData+0.2);
      }
        this.maxinterval=max/5;  //把x轴分成5段
      let data = []    //自定义曲线图属性series中的data
      let time = dataList.length !=0 ?" ("+this.timeFormat(dataList[0].date)+")":'';
      for(let i = 0;i < displacement.length;i ++){
        data[i] = [displacement[i],eleData[i]]
      }
      var _green = 'image://' + green
      let customOption = {
        title: {
          text: "电参力Kn"+time,
          textStyle: {
            fontSize: 20
          },
          padding: [1, 5],
          left: "left",
          top: 10
        },
        grid: {
          left: "5%",
          right: "10%",
          height:265
        },
        tooltip: {
          trigger: "item",
          confine: true,
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
              posY = 5;
            } else {
              //上边放得下
              posY = y - boxHeight;
            }
            return [posX, posY];
          },
          formatter:function(params){
            var tip = "";
            let value1 = params.value;
            let marker1 = params.marker;
            tip = params.value[0] +'<br />';
             tip = tip + marker1 +'电参力:' + params.value[1] +'<br />'
            if(value1 == ""){
              return ""
            }else{
              return tip;
            }
          }
        },
        xAxis: {
          name: "位移",
          nameTextStyle: { fontSize: 16 },
          type: 'value',
          splitLine: { show: false },
          triggerEvent: true, //为标签添加触发事件
           interval:this.maxinterval,
          axisLabel: {
            fontSize: 14,
            formatter: (val) => {
              return val
            }
          },
          boundaryGap: false,
          max:max
        },
        yAxis: {
          type: "value",
          minInterval: 10,
          splitLine: { show: false },
          axisLabel: { fontSize: 14 },
          nameTextStyle: { fontSize: 16 }
        },
        series: [{
          data: data,
          type: 'line',
          smooth:true,
          symbolSize:'2',
          symbol:_green,
        }]
      };
      this.$nextTick(() => {
        this.eleLoading = false;
        this.$refs["ele_chart"].initChart(customOption);
      });
    },
    // 获取载荷力数据
   // 获取载荷力曲线图
    getLoadParames() {
      let data = {};
      let data_type = "";
      if (this.wellPoint == 145) {
        data_type = 0;
      } else {
        data_type = 1;
      }
      //0表示手动，1表示自动
      let dataSrc = "";
      if (this.dataSrc == "手动" || this.dataSrc == 0) {
        dataSrc = 0;
      } else if (this.dataSrc == "自动" || this.dataSrc == 1) {
        dataSrc = 1;
      }
      if (this.checkDataSrcTime == 0) {
            data = {
              id: this.wellName,
              p_type: "4",
              data_type: data_type,
              history: "",
              daterange: this.datePicker[0] + "-" + this.datePicker[1],
            };
          } else {
            // 获取载荷力和位移值
            data = {
              id: this.wellName,
              p_type: "4",
              data_type: data_type,
              history: "",
              daterange: this.datePicker[0] + "-" + this.datePicker[1],
              manual:dataSrc
            };
      }
      ApiGetElectdata(data).then(({ data }) => {
        // 对x轴的值进行处理
        if (data.msg.totalcount != 0) {
          this.loadHistoryCount = data.msg.totalcount;
          this.loadNum = this.loadHistoryCount;
          this.loadList = data.msg.data;
          if (this.checkDataSrcTime != 0) {
              if (data.msg.data[0].data_src == 0 || this.dataSrc == 0) {
                this.dataSrc = "手动";
              } else if (data.msg.data[0].data_src == 1 || this.dataSrc == 1) {
                this.dataSrc = "自动";
              }
            }else{
              this.dataSrc = "";
            }
          // this.time=" ("+this.loadList[0].time+")";
          // 箭头展示
          this.loadShowRightarrow = true;
          this.loadShowLeftarrow = false;
          this.showLoadCharts(this.loadList)  
        } else {
        
          // console.log("没有值2：")
          this.loadLoading = false;
          // 箭头展示
          this.loadShowRightarrow = true;
          this.loadShowLeftarrow = true;
          this.loadHistoryCount = 0;
          this.loadNum = 0;
          let displacement = [];
          // this.time="";
          let loadList = []
          let max = 0
          this.showLoadCharts(loadList)  
        }
      });
    },
    // 左移展示载荷力图表
    showLoadCharts(dataList) {
      let loadData = dataList.length !=0 ?dataList[0].datas:[]
      let displacementList = dataList.length !=0 ?dataList[0].displacement:[]
      let maxData = Math.max(...displacementList); //x轴展示的最大值
      let max = ""   //设置横坐标显示的最大值
      let maxIndex = ''
      for(var i=0;i<displacementList.length;i++){
        if(displacementList[i] == maxData){
          maxIndex = i
        }
      }
      let maxinterval = ''
      if (displacementList != undefined) {
        /**算法解释：为了调整横轴最大刻度值的格式，对程序进行分割处理。
        先找一下最大位移值，实际数据放入相应位置不改变。
        如果最大位移值大于1则加0.5,如果最大位移值小于1则加0.2。
        对处理后的数据进行四舍五入处理，然后设置该值为横坐标显示的最大刻度值**/
        if(maxData > 1){
          max = (maxData + 0.5).toFixed(0) 
        }else{
          max = (maxData + 0.2).toFixed(0)
        }
        // this.max = max
        maxinterval=max/5;  //把x轴分成5段
      }
      let time = dataList.length !=0 ? " ("+dataList[0].time+")":'';
      let data = []    //自定义曲线图属性series中的data
      for(let i = 0;i < displacementList.length;i ++){
        data[i] = [displacementList[i],loadData[i]]
      }
      var _green = 'image://' + green
      let customOption = {
        title: {
          text: "载荷力Kn"+time,
          textStyle: {
            fontSize: 20
          },
          padding: [1, 5],
          left: "left",
          top: 10
        },
        grid: {
          left: "5%",
          right: "10%",
          height:265
        },
        tooltip: {
          trigger: "item",
          confine: true,
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
              posY = 5;
            } else {
              //上边放得下
              posY = y - boxHeight;
            }
            return [posX, posY];
          },
          formatter:function(params){
            var tip = "";
            let value1 = params.value;
            let marker1 = params.marker;
            tip = params.value[0] +'<br />';
             tip = tip + marker1 +'载荷力:' + params.value[1] +'<br />'
            if(value1 == ""){
              return ""
            }else{
              return tip;
            }
          }
        },
        xAxis: {
          name: "位移",
          nameTextStyle: { fontSize: 16 },
          type: 'value',
          splitLine: { show: false },
          triggerEvent: true, //为标签添加触发事件
          interval:maxinterval,
          axisLabel: {
            fontSize: 14,
            formatter: (val) => {
              return val
            }
          },
          boundaryGap: false,
          max:max
        },
        yAxis: {
          type: "value",
          minInterval: 10,
          splitLine: { show: false },
          axisLabel: { fontSize: 14 },
          nameTextStyle: { fontSize: 16 }
        },
        series: [{
          data: data,
          type: 'line',
          smooth:true,
          symbolSize:'2',
          symbol:_green,
        } ]
      };
      this.$nextTick(() => {
         this.loadLoading = false;
        this.$refs["load_chart"].initChart(customOption);
      });
    },
    // 右移展示载荷力
    showLoadChartsright(dataList) {
      let loadData = dataList.length !=0 ?dataList[0].datas:[]
      let displacementList = dataList.length !=0 ?dataList[0].displacement:[]
      let maxData = Math.max(...displacementList); //x轴展示的最大值
      let max = ""   //设置横坐标显示的最大值
      let maxIndex = ''
      for(var i=0;i<displacementList.length;i++){
        if(displacementList[i] == maxData){
          maxIndex = i
        }
      }
      let maxinterval = ''
      if (displacementList != undefined) {
        /**算法解释：为了调整横轴最大刻度值的格式，对程序进行分割处理。
        先找一下最大位移值，实际数据放入相应位置不改变。
        如果最大位移值大于1则加0.5,如果最大位移值小于1则加0.2。
        对处理后的数据进行四舍五入处理，然后设置该值为横坐标显示的最大刻度值**/
        if(maxData > 1){
          max = (maxData + 0.5).toFixed(0) 
        }else{
          max = (maxData + 0.2).toFixed(0)
        }
        // this.max = max
        maxinterval=max/5;  //把x轴分成5段
      }
      let time = dataList.length !=0 ? " ("+dataList[0].time+")":'';
      let data = []    //自定义曲线图属性series中的data
      for(let i = 0;i < displacementList.length;i ++){
        data[i] = [displacementList[i],loadData[i]]
      }
      var _green = 'image://' + green
      let customOption = {
        title: {
          text: "载荷力Kn"+time,
          textStyle: {
            fontSize: 20
          },
          padding: [1, 5],
          left: "left",
          top: 10
        },
        grid: {
          left: "5%",
          right: "10%",
          height:265
        },
        tooltip: {
          trigger: "item",
          confine: true,
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
              posY = 5;
            } else {
              //上边放得下
              posY = y - boxHeight;
            }
            return [posX, posY];
          },
          formatter:function(params){
            var tip = "";
            let value1 = params.value;
            let marker1 = params.marker;
            tip = params.value[0] +'<br />';
             tip = tip + marker1 +'载荷力:' + params.value[1] +'<br />'
            if(value1 == ""){
              return ""
            }else{
              return tip;
            }
          }
        },
        xAxis: {
          name: "位移",
          nameTextStyle: { fontSize: 16 },
          type: 'value',
          splitLine: { show: false },
          triggerEvent: true, //为标签添加触发事件
            interval:maxinterval,
          axisLabel: {
            fontSize: 14,
            formatter: (val) => {
              return val
            }
          },
          boundaryGap: false,
          max:max
        },
        yAxis: {
          type: "value",
          minInterval: 10,
          splitLine: { show: false },
          axisLabel: { fontSize: 14 },
          nameTextStyle: { fontSize: 16 }
        },
        series: [{
          data: data,
          type: 'line',
          smooth:true,
          symbolSize:'2',
          symbol:_green,
        }]
      };
      this.$nextTick(() => {
        this.loadLoading = false;
        this.$refs["load_chart"].initChart(customOption);
      });
    },
  }
};
</script>
<style lang="scss" scoped>
#indicatorDiagram {
  .indicator-header {
    margin: 10px;
  }
  .arrowchange {
    margin-right: 35%;
  }
  .nodata {
    display: flex;
    justify-content: center;
  }
  .row-bg {
    align-items: center;
  }
  .col-bg {
    padding: 5px 2px 0 45px;
  }
  .datePicker {
    width: 210px;
  }
  .historyCount {
    padding-left: 5px;
  }
  .arrowchange {
    position: absolute;
    display: flex;
    right: 200px;
    bottom: 50px;
  }
  .arrowleft {
    padding-right: 20px;
  }
  .img {
    width: 30px;
    height: 30px;
  }
}
</style>