<template>
  <div>
    <div class="manual-automatic-title">
      <div class="title-text">自动绘制电参数示功图显示界面</div>
    </div>
    <div class="manual-automatic-header">
      <el-card shadow="never">
        <el-row class="row-bg">
          <el-col :lg="4">
            井名：
            <el-select
              v-model="wellID"
              filterable
              style="width:130px;"
              placeholder="请选择"
              @change="getWellParamers()"
            >
              <el-option
                v-for="(item,index) of wellList"
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-col>
          <!-- <el-col :lg="5" class="col-bg">时间：{{time|dateTimeFormat}}</el-col> -->
          <el-col :lg="3" class="col-bg">
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
          <el-col :lg="5"  class="explain">
            <el-button type="primary" @click="alertWell(1)">自动处理  
              <i class="el-icon-success" v-show="automatic"></i>
            </el-button>
            <el-button type="primary" @click="alertWell(0)" style="margin-left:10px;">不自动处理   
              <i class="el-icon-success" v-show="unautomatic"></i>
            </el-button>
            <!-- <div class="btn-explain" @click="openExplain(1)">
              提示:
            <svg-icon icon-class="wenhao" />
            </div> -->
          </el-col>
          <!-- <el-col :lg="4" class="explain-Condition">
            <div class="btn-explain" @click="openExplain(2)">
              示功图绘制条件提示:
            <svg-icon icon-class="wenhao" />
            </div>
          </el-col> -->
        </el-row>
      </el-card>
    </div>
    <div class="manual-automatic-chart">
      <el-row :gutter="15">
        <el-col :lg="24">
          <el-card shadow="never">
            <el-col :lg="12">
              <div class="chart" v-loading="loadingElect">
                <LineChart ref="overlying_chart" style="width:640px" chart-id="overlying_chart" />
              </div>
            </el-col>
            <el-col :lg="12">
              <div class="chart" v-loading="loadingLoad">
                <LineChart ref="load_chart" style="width: 640px" chart-id="load_chart" />
              </div>
            </el-col>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 自动处理和不自动处理提示 -->
    <el-dialog title="提示" :visible.sync="handleVisible" width="365px">
      <div>
        <div class="explain-title">
          自动处理：
        </div>
        <div class="explain-content">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;处理2中自动绘制有功，存入处理4调整有功中。
        </div>
        <div class="explain-title">
          不自动处理：
        </div>
        <div class="explain-content">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          处理1后，处理1中各个点有功数据直接对应存入处理2及处理4调整有功中。
        </div>
      </div>
    </el-dialog>
    <!-- 示功图绘制条件提示 -->
    <el-dialog title="提示" :visible.sync="explainVisible" width="365px">
      <div>
        <div class="explain-title">
          示功图绘制条件：
        </div>
        <div>
          <div class="explain-content">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、井的状态需要是开井状态；
          </div>
          <div class="explain-content">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、需要有未绘制示功图的有功；
          </div>
          <div class="explain-content">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、扭矩因数不能为空；
          </div>
          <div class="explain-content">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4、需要有与有功对应的位移，有功和位移的时间差不能超过10分钟。
          </div>
          <div class="explain-content">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5、反馈数据有误时，会导致示功图绘制失败
            <div class="explain-content">（举例：有功全为零时，无法绘制示功图）。</div>
          </div>
        </div>
      </div>
    </el-dialog>
    <div style="margin-top:50px"></div>
  </div>
</template>
<script>
import { getAddMutipleActive } from "@/api/electricParamater";
import { ApiGetRealdata, ApiGetElectdata } from "@/api/realdata";
import { ApiGetWellList } from "@/api/wellList";
import { getFromStorage } from "@/api/electricParamater";
import { getWellDetail } from "@/api/welldetail";
import { ApiAlterWell } from "@/api/wellList";
import LineChart from "@/components/ECharts/LineMarker";
import adjusttypeTips from "./components/adjusttype-tips";
import green from '../../assets/green.png'
import dayjs from "dayjs";
export default {
  components: {
    LineChart,
    adjusttypeTips
  },
  data() {
    return {
      explainVisible: false,
      handleVisible:false,
      automatic:true,
      unautomatic:false,
      loadingElect: false,
      loadingLoad:false,
      wellList: [],
      wellID: "",
      wellPoint: "145",
      welltype: 0, //油井类别，暂为螺杆泵 ,全部：-1 , 0 # 抽油机, 1 # 螺杆泵
      addTimesValue: "", //叠加有功次数
      // addTimesList: [],
      wellPointList: [{ value: "145" }, { value: "200" }],
      dataSrcList: [
        { value: "0", label: "手动" },
        { value: "1", label: "自动" }
      ],
      electricParamList: [], //修正后的电参力，后端获取
      displacementList: [], //位移数据
      eletime: "",//电参力的时间
      loadtime: "",//载荷力时间
      loadList: [],
      dataSrc: "1", //手动还是自动存入数据库的
      checkDataSrcTime: 0, //判断是一次还是多次叠加有功
      showAddTime: true //是否展示叠加次数
    };
  },
  watch: {
    wellID: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.getWellParamers();
        }
      }
    },
    wellpoint: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.getWellParamers();
        }
      }
    }
    // addTimesValue: {
    //   handler: function(newVal, oldVal) {
    //     if (newVal) {
    //       this.getWellParamers();
    //     }
    //   }
    // },
  },
  mounted() {
    // this.getOverLying();
    // this.getLoad();
  },
  created() {
    this.GetRealdata();
  },
  methods: {
    // 打开提示
    openExplain(type) {
      switch(type){
        case 1:
          this.handleVisible=true
          break;        
        case 2:
          this.explainVisible=true
          break;
      }
    },
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
      this.loadingElect = true;
      this.loadingLoad = true;
      this.getWellParamers();
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
        //  this.getWellDetails()
        // this.AddMutipleActive();
        // this.getWellParamers();
      });*/
    },
    // 获取井的详细信息
    getWellDetails() {
      getWellDetail({ wellid: this.wellID, welldetail: "" }).then(({ data }) => {
        this.welltype = data.msg.well_type;
        if(data.msg.auto === 0){
          this.automatic = false;
          this.unautomatic = true;
        }
        if(data.msg.auto === 1){
          this.automatic = true;
          this.unautomatic = false;
        }
      });
    },
    // // 获取最高可叠加次数以及叠加起止日期
    // AddMutipleActive() {
    //   getAddMutipleActive({ id: this.wellID }).then(({ data }) => {
    //     for (var i = 1; i <= data.msg.times; i++) {
    //       this.addTimesList.push({ value: i });
    //     }
    //   });
    // },
    // 调用展示两个图表
    //修改井的auto
    alertWell(auto) {
      let wellparams = {};
      wellparams = {
        well_id:this.wellID,
        auto:auto
      };
      ApiAlterWell(wellparams).then(({ data })=>{
        //修改成功
        if(data.status === 0){
          this.getWellDetails();
        }else{//修改失败
          this.$message.error(data.msg);
        }
      })
    },
    getWellParamers() {
      this.getWellDetails();
      this.getParamers();
    },
    getParamers() {
      let data = {};
      // console.log("data_src:"+this.dataSrc)
      if (this.checkDataSrcTime == 0) {
        data = {
          well_id: this.wellID,
          point_number: this.wellPoint
        };
      } else {
        let dataSrc = "";
        if (this.dataSrc == "手动" || this.dataSrc == 0) {
          dataSrc = 0;
        } else if (this.dataSrc == "自动" || this.dataSrc == 1) {
          dataSrc = 1;
        }
        data = {
          well_id: this.wellID,
          point_number: this.wellPoint,
          data_src: dataSrc
        };
      }
      // 调后端接口，获取电参数值和位移值
      getFromStorage(data).then(({ data }) => {
        if (data.status == 0) {
          if (data.msg != null) {
            this.addTimesValue = data.msg.stacking_number;
            if (this.addTimesValue == null) {
              this.showAddTime = false;
            } else {
              this.showAddTime = true;
            }
            this.electricParamList = data.msg.adjustment_electrical_force;
            this.displacementList = data.msg.displacement;
            this.eletime = "("+this.timeFormat(data.msg.date)+")"; //'yyyy/mm/dd hh:mm:ss';
            if (data.msg.data_src == 0 || this.dataSrc == 0) {
              this.dataSrc = "手动";
            } else if (data.msg.data_src == 1 || this.dataSrc == 1) {
              this.dataSrc = "自动";
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
          this.$message.error(data.msg);
        }
      });
    },
    //获取调用电参力位移数据
    getStorage(displacementList, electricParamList) {
      // 对x轴的值进行处理
      let maxData = Math.max(...displacementList); //x轴展示的最大值
      let max = ""   //设置横坐标显示的最大值
      /**算法解释：为了调整横轴最大刻度值的格式，对程序进行分割处理。
      先找一下最大位移值，实际数据放入相应位置不改变。
      如果最大位移值大于1则加0.5,如果最大位移值小于1则加0.2。
      对处理后的数据进行四舍五入处理，然后设置该值为横坐标显示的最大刻度值**/
      if(maxData > 1){
        max = (maxData + 0.5).toFixed(0) 
      }else{
        max = (maxData + 0.2).toFixed(0)
      }
      let maxIndex = ''
      for(var i=0;i<displacementList.length;i++){
        if(displacementList[i] == maxData){
          maxIndex = i
        }
      }
      let maxinterval=max/5;  //把x轴分成5段
      let data = []; //自定义曲线图属性series中的data
      for (let i = 0; i < displacementList.length; i++) {
        data[i] = [displacementList[i], electricParamList[i]];
      }
      var _green = 'image://' + green
      let customOption = {
        title: {
          text: "电参力Kn"+this.eletime,
          textStyle: {
            fontSize: 20
          },
          // padding:[1,40,23,60],
          padding: [1, 5],
          left: "left",
          top: 10
        },
        grid: {
          left: "5%",
          right: "10%",
          height: 265
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
          formatter: function(params) {
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
          type: "value",
          splitLine: { show: false },
          boundaryGap: false,
         interval:maxinterval,
          triggerEvent: true, //为标签添加触发事件
          axisLabel: {
            fontSize: 14,
            formatter: val => {
              return val;
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
        series: [
          {
            data: data,
            type: "line",
            smooth: true,
            symbolSize:'2',
            symbol:_green,
          }
        ]
      };
      this.$nextTick(() => {
        this.loadingElect = false;
        this.$refs["overlying_chart"].initChart(customOption);
      });
    },
    // 获取载荷力曲线图
    getLoad() {
      // 获取Y轴的值
      let data_type = "";
      if (this.wellPoint == 145) {
        data_type = 0;
      } else {
        data_type = 1;
      }
      let manual = ''
      if(this.dataSrc == '手动'||this.dataSrc == 0){
          manual = 0
      }else if(this.dataSrc == '自动'||this.dataSrc == 1){
        manual =1
      }
      let data = {
        id: this.wellID,
        p_type: "4",
        data_type: data_type,
        manual:manual
      };
      ApiGetElectdata(data).then(({ data }) => {
        let displacementList = []
        if (data.datas) {
          this.loadList = data.datas;
          displacementList = data.displacement
          this.loadtime = "("+data.time+")"; //'yyyy/mm/dd hh:mm:ss';
        }else{
          this.loadtime = " "; 
        }
        // 对x轴的值进行处理
        let maxData = Math.max(...displacementList); //x轴展示的最大值
        let max = ""   //设置横坐标显示的最大值
        // let maxIndex = ""   //设置横坐标显示的最大值的索引
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
        }
          let   maxinterval=max/5;  //把x轴分成5段
        let Data = []; //自定义曲线图属性series中的data
        let maxIndex = ''
        for (let i = 0; i < displacementList.length; i++) {
          Data[i] = [displacementList[i], this.loadList[i]];
          if(displacementList[i] == maxData){
            maxIndex = i
          }
        }
        var _green = 'image://' + green
        let customOption = {
          title: {
            text: "载荷力Kn"+this.loadtime,
            textStyle: {
              fontSize: 20
            },
            // padding:[1,40,23,60],
            padding: [1, 5],
            left: "left",
            top: 10
          },
          grid: {
            left: "6%",
            right: "10%",
            height: 265
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
            formatter: function(params) {
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
            type: "value",
            splitLine: { show: false },
            triggerEvent: true, //为标签添加触发事件
             interval:maxinterval,
            axisLabel: {
              fontSize: 14,
              formatter: val => {
                return val;
              }
            },
            boundaryGap: false,
            max:max
          },
          yAxis: {
            type: "value",
            minInterval: 10,
            //   name: "吨",
            splitLine: { show: false },
            axisLabel: { fontSize: 14 },
            nameTextStyle: { fontSize: 16 }
          },
          series: [
            {
              data: Data,
              type: "line",
              smooth: true,
              symbolSize:'2',
              symbol:_green,
            }
          ]
        };
        this.$nextTick(() => {
          this.loadingLoad = false;
          this.$refs["load_chart"].initChart(customOption);
      });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.manual-automatic-title {
  display: flex;
  justify-content: center;
  .title-text {
    font-weight: bold;
    font-size: 20px;
  }
}
.manual-automatic-header {
  margin: 10px;
}
.manual-automatic-chart {
  margin: 10px;
}
.chart-title {
  font-weight: bold;
}
.chart {
  padding-top: 5px;
  height: 370px;
  margin-left: 1%;
}
.row-bg {
  align-items: center;
}
.col-bg {
  padding: 5px 2px 0 0;
}
.explain,.explain-Condition{
  display: flex;
  align-items: center;
}
.explain-Condition{
  margin-top: 6px;
}
.btn-explain {
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-size: 12px;
  color: #808080;
  cursor: pointer;
}
.explain-title{
  font-weight:bold;
  font-size: 15px;
}
.explain-content{
  font-size: 14px;
  margin: 2px;
}
</style>