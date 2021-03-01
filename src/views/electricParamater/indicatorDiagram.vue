<template>
  <div id="indicatorDiagram">
 
      <div class="indicator-title">
        <div class="title-text">多个历史载荷示功图曲线</div>
      </div>
  
    <div class="indicator-header">
      <el-card shadow="never">
        <el-row class="row-bg">
          <el-col :lg="5">
            井名：
            <el-select
              v-model="wellID"
              filterable
              style="width:140px;"
              placeholder="请选择"
              @change="getLoadParames(1)"
            >
              <el-option
                v-for="(item,index) of wellList"
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :lg="6">
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
              @change="getLoadParames(1)"
            ></el-date-picker>
          </el-col>
          <el-col :lg="4" class="col-bg">
            <div v-if="welltype == 0">油井类别：抽油机</div>
            <div v-if="welltype == 1">油井类别：螺杆泵</div>
          </el-col>
          <el-col :lg="3">
            点数：
            <el-select
              v-model="wellPoint"
              filterable
              style="width:80px;"
              placeholder="请选择"
              @change="getLoadParames(1)"
            >
              <el-option
                v-for="item in wellPointList"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :lg="5" class="explain">
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
            <!-- <adjusttypeTips /> -->
          </el-col>
          <!-- <el-col :lg="4" class="col-bg">叠加有功次数：{{addTimesValue}}</el-col> -->
        </el-row>
      </el-card>
    </div>
    <div style="margin:10px">
      <el-card shadow="never" v-loading="loading">
        <div class="chart">
          <LineChart
            ref="indicator_chart"
            style="width: 640px;"
            chart-id="indicator_chart"
          />
        </div>


        <div style="text-align:center;padding-bottom: -5px;position:relative;margin-top:-100px;">
            <el-button icon="el-icon-arrow-left" @click="leftmove" :disabled="showLeftarrow"></el-button>
            <el-button icon="el-icon-arrow-right" @click="rightmove" :disabled="showRightarrow"></el-button>        
            <span class="historyCount">历史数据个数：{{historyCount}}，当前第:{{num}}个</span>
            </div>
      </el-card>
      <!-- <el-card shadow="never" v-if="nodata==true">
        <div class="nodata">
           暂无数据
        </div>      
      </el-card>-->
    </div>
    <div style="margin-top:50px"></div>
  </div>
</template>
<script>
import { ApiGetRealdata, ApiGetElectdata } from "@/api/realdata";
import { getWellDetail } from "@/api/welldetail";
import{ ApiGetWellList } from"@/api/wellList";
import { getFromStorage } from "@/api/electricParamater";
import LineChart from "@/components/ECharts/LineMarker";
import dayjs from "dayjs";
import green from '../../assets/green.png'
import adjusttypeTips from "./components/adjusttype-tips";
export default {
  data() {
    return {
      time:'',
      loading: false,
      type: this.$route.query.type,
      wellList: [],
      num: 0,
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
      historyCount: "0",
      dataSrc: "1", //手动还是自动存入数据库的
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
      showLeftarrow: false, //左边箭头可用
      showRightarrow: true, //右边箭头禁用
      max:"" ,   //曲线图横轴显示的最大刻度值
      // count: 0
      //  maxinterval:'',
      page:1,
      datacount:0,//
    };
  },
  components: {
    LineChart,
    adjusttypeTips
  },
  created() {
    this.loading = true;
    this.GetRealdata();
    var list = this.getDateRange(new Date(), 30, true);
    this.datePicker = [list[0], list[1]];
  },
  mounted() {},
  watch:{
     datacount:{
       handler: function(newVal, oldVal) {
        // 如何载荷力列表的数据比总条数少，就需要再继续请求下一页
         if(newVal<this.historyCount){
              this.page++
              this.getLoadParames(this.page)
          }else{
            this.page = 1
          }
       }
     }
  },
  methods: {
    getWellDataSrc() {
      this.checkDataSrcTime++;
      this.page = 1
      this.getLoadParames(1);
      this.loading = true;
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
    //获取油井列表
    GetRealdata() {
      ApiGetWellList({page:1,pagenum:100}).then(res=>{
          this.wellList= res.data.msg.well_list;
          this.wellList = this.wellList.filter(item=>item.well_type !== 1);
          let wellid = this.wellList.map(item => {
            return item.id;
          });
          this.wellID = wellid[0];
            if(this.wellID){
              this.getWellDetails()
              // 先获取第一页（20条）载荷力数据，此时page=1
              this.getLoadParames(1)
            }
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
         
      });*/
    },
    // 获取井的详细信息(油井类别)
    getWellDetails() {
      getWellDetail({ wellid: this.wellID, welldetail: ""}).then(({ data }) => {
        this.welltype = data.msg.well_type;
      });
    },
    // 对电参叠加力进行左右移动
    // 图表进行移动(箭头左移，右移)
    leftmove() {
      this.num--;
        /* ############# 对载荷力进行左右平移 ############*/
        this.showRightarrow = false;
        let lenleft = this.historyCount - this.num;
        let dataList = this.loadList
        dataList = dataList.slice(lenleft,this.historyCount)
        // // 左移一个值的话，相当于删除数组的第一条值
        // 判断当前为第几条数据（若大于1，还可左移，<=1，就不可左移)
        if (this.num >= 1) {
          this.showRightarrow = false;
          this.showLoadCharts(dataList)  
          if(this.num == 1){
            this.showLeftarrow = true;
          }
        } else {
          this.showLeftarrow = true;
          this.showRightarrow = false;
        }
      
    },
    rightmove() {
      this.num++;
      // 右移：类似于对数组添加一个(日期由远及近)值
        /*#############  对载荷力进行左右平移  ############*/
        // 右移了多少条数据
        let lenRight = this.historyCount - this.num;
        let dataList = this.loadList
        dataList = dataList.slice(lenRight)
        if(this.num <= this.historyCount){
          this.showLeftarrow = false;
         this.showLoadChartsright(dataList);
          if(this.num == this.historyCount){
            this.showRightarrow = true;
          }
        }else{
          this.showRightarrow = true;
          this.showLeftarrow = false;
        }
      
    },
    
    // 获取载荷力曲线图
    getLoadParames(page) {
      let data = {};
      // if(this.dataSrc != ''){
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
              id: this.wellID,
              p_type: "4",
              data_type: data_type,
              history: "",
              daterange: this.datePicker[0] + "-" + this.datePicker[1],
              page:page
            };
          } else {
            // 获取载荷力和位移值
            data = {
              id: this.wellID,
              p_type: "4",
              data_type: data_type,
              history: "",
              daterange: this.datePicker[0] + "-" + this.datePicker[1],
              manual:dataSrc,
              page:page
            };
          }
        ApiGetElectdata(data).then(({ data }) => {
          // 对x轴的值进行处理
          if (data.msg.totalcount != 0) {
            this.historyCount = data.msg.totalcount;
            this.num = this.historyCount;
            if(page ==1){
              this.loadList = data.msg.data;
            }else{
              this.loadList = this.loadList.concat(data.msg.data);
            }  
            this.datacount = this.loadList.length 
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
            this.showRightarrow = true;
            this.showLeftarrow = false;
            this.showLoadCharts(this.loadList)  
          } else {
            // console.log("没有值2：")
            this.loading = false;
            // 箭头展示
            this.showRightarrow = true;
            this.showLeftarrow = true;
            this.historyCount = 0;
            this.num = 0;
            let displacement = [];
            // this.time="";
            let loadList = []
            let max = 0
            this.showLoadCharts(loadList)  
          }
        });
      // }else{
      //   let loadList = []
      //   this.showLoadCharts(loadList)
        
      // }
      
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
            // let value1 = params[0].value;
            // let marker1 = params[0].marker;
            // tip = params[0].axisValue +'<br />'
            // if (params.length == 2||params.length == 3){
            //   let value2 = params[1].value;
            //   let marker2 = params[1].marker;
            //   if(params[0].value[0] == params[1].value[0]){
            //     tip = tip + marker1 +'上载荷力:' + params[1].value[1] +'<br />'
            //       + marker2 + '下载荷力:' + params[1].value[1];
            //   }else{
            //     tip = tip + marker1 +'上载荷力:' + params[0].value[1] +'<br />'
            //       + marker2 + '下载荷力:' + params[1].value[1];
            //   }
            // }else{
            //       if (params[0].dataIndex <= maxIndex)
            //           tip = tip + marker1 +'上载荷力:' + params[0].value[1] +'<br />'
            //       else{
            //           tip = tip + marker1 +'下载荷力:' + params[0].value[1] +'<br />'
            //       }
            //   }
            // if(value1 == ""){
            //   return ""
            // }else{
            //   return tip;
            // }
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
        this.loading = false;
        this.$refs["indicator_chart"].initChart(customOption);
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
        this.loading = false;
        this.$refs["indicator_chart"].initChart(customOption);
      });
    },
  }
};
</script>
<style lang="scss" scoped>
#indicatorDiagram {
  .indicator-title {
    display: flex;
    justify-content: center;
    .title-text {
      font-weight: bold;
      font-size: 20px;
    }
  }
  .indicator-header {
    margin: 10px;
  }
  .chart {
    // margin: 10px;
    margin-left: 12%;
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
    position: relative;
    left: 20px;
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
  .explain{
    display: flex;
    align-items: center;
  }
}
</style>