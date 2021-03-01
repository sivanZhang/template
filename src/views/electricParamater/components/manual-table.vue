<template>
  <div id="manualTable">
    <div class="el-btn-list">
      <div class="el-btn-list-main">
        <div class="el-btn-list-row">
          <el-row class="row-bg">
            <el-col :sm="7" class="col-bg">
              <!-- <div class="el-button" style="width:90%" @click="addTorque()">一个冲次扭矩因数数据</div> -->
              <el-button type="primary" class="button-style" @click="addTorque()">一个冲次扭矩因数数据</el-button>
            </el-col>
            <el-col :sm="7" class="col-bg">
              <!-- <div class="el-button" style="width:90%" @click="addDisplacement()">一个冲次位移数据</div> -->
              <el-button
                type="primary"
                class="button-style"
                @click="addDisplacement()"
              >一个冲次位移数据</el-button>
            </el-col>
            <el-col :sm="7" class="col-bg">
              <div class="icon-check">
                  <el-button
                  :disabled="showOnceActive" 
                   type="primary"
                  class="button-style"
                   @click="addMutipleActive(1)"
                  >一个冲次有功数据</el-button>
                  <div class="icon-position" v-if="!showOnceActive">
                     <img style="width:20px;height:20px" src="@/assets/check.png" />
                  </div>
              </div>
            </el-col>
          </el-row>
          <el-row class="row-bg">
            <el-col :sm="7" class="col-bg">
              <div class="icon-check">
                  <el-button
                    :disabled="showMutipleActive" 
                    type="primary"
                    class="button-style"
                    @click="addMutipleActive(2)"
                  >多个一个冲次叠加有功数据</el-button>
                  <div class="icon-position" v-if="!showMutipleActive">
                     <img style="width:20px;height:20px" src="@/assets/check.png" />
                 </div>
              </div>        
            </el-col>
            <el-col :sm="7" class="col-bg">
              <el-button 
              type="primary" 
              :disabled="showAdjustActive" 
              class="button-style" 
              @click="addAdjustActive()">调整有功数据</el-button>
            </el-col>
            <el-col :sm="7" class="col-bg">
              <el-button
                type="primary"
                :disabled="showActiveTorque"
                class="button-style"
                @click="addActiveTorque()"
              >调整有功扭矩计算</el-button>
            </el-col>
          </el-row>
          <el-row class="row-bg">
            <el-col :sm="7" class="col-bg">
              <el-button
                type="primary"
                :disabled="showBalanceTorque"
                class="button-style"
                @click="adjustBalanceTorque()"
              >一个冲次调整平衡扭矩计算</el-button>
            </el-col>
            <el-col :sm="7" class="col-bg">
              <el-button
                type="primary"
                :disabled="showBalanceActive"
                class="button-style"
                @click="adjustBalanceActive()"
              >调整平衡与调整有功扭矩叠加</el-button>
            </el-col>
            <el-col :sm="7" class="col-bg">
              <el-button
               v-loading="loading"
                type="primary"
                :disabled="showElectricParam"
                class="button-style"
                @click="changeElectricParam()"
              >叠加扭矩转换电参力</el-button>
            </el-col>
            <el-col :sm="3" class="col-bg">
              <el-button
                type="primary"
                class="button-style"
                @click="getAllData()"
              >全选</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-if="show_Linechart" style="height:300px;">
        <el-card shadow="never"  class="card-line">
          <div style="padding:0 280px">
            <LineChart ref="params-chart" style="width: 660px;" chart-id="params-chart" />
          </div>
          
        </el-card>
      </div>
    </div>
    <div class="table-list">
      <div class="table-list-main">
        <el-table
          :data="realdata"
          stripe
          :border="true"
          row-key="id"
          style="width: 100%;"
          highlight-current-row
          :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
          :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
        >
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <el-table-column prop="angle" width="100" label="角度" align="center"></el-table-column>
          <el-table-column prop="torque" label="扭矩因数" width="130" v-if="show_Torque" align="center"></el-table-column>
          <!-- <el-table-column label="备用" v-if="show_Torque" width="70" align="center"></el-table-column>
          <el-table-column label="备用" v-if="show_Torque" width="70" align="center"></el-table-column>
          <el-table-column label="备用" v-if="show_Torque" width="70" align="center"></el-table-column> -->
          <el-table-column prop="displacement"  width="80" label="位移" v-if="show_Displacement" align="center"></el-table-column>
          <el-table-column
            prop="mutipleActive"
            label="一次或多次叠加有功"
            v-if="show_MutipleActive"
            align="center"
            width="110"
          ></el-table-column>
          <!-- <el-table-column
          prop="signalActive"
          label="一个冲次有功数据"
          v-if="show_SignalActive"
          align="center"
          ></el-table-column>-->
          <el-table-column
            label="调整后有功"
             width="160"
            v-if="show_AdjustActive"
            align="center"
          >
          <template slot-scope="scope">
            <div class="cell-wellstatus">
                <div style="width:80px">{{scope.row.adjustActive}}</div>
                <div>
                  <el-tooltip content="上移" placement="top">
                    <div @click="activeEditUp(scope.$index, scope.row)">
                        <svg-icon icon-class="topArrow" />
                    </div>
                  </el-tooltip>
                  <el-tooltip content="下移" placement="top">
                    <div @click="activeEditDown(scope.$index, scope.row)">
                        <svg-icon icon-class="downArrow" />
                    </div>
                  </el-tooltip>
               </div>
            </div>
            
          </template>
          </el-table-column>
          <el-table-column
            prop="activeTorque"
            label="调整有功扭矩"
             width="200"
            v-if="show_ActiveTorque"
            align="center"
          ></el-table-column>
          <!-- <el-table-column prop="balanceTorque" width="200" label="平衡扭矩" align="center"></el-table-column> -->
          <!-- <el-table-column prop="addBalanceActive" v-if="show_addBalanceActive" width="130" label="平衡扭矩加调整有功扭矩力" align="center"></el-table-column> -->
          <el-table-column
            prop="adjustbalanceTorque"
            v-if="show_BalanceTorque"
            label="调整平衡扭矩"
             width="200"
            align="center"
          ></el-table-column>
          <el-table-column
          prop="balanceActive"
            v-if="show_BalanceActive"
            label="调整有功与平衡扭矩叠加"
             width="200"
            align="center"
          >
          <!-- <template slot-scope="scope">
            <div class="cell-wellstatus">
                <div style="width:100px" >{{scope.row.balanceActive}}</div>
                <div>
                   <div  @click="balanceActiveUp(scope.$index, scope.row)">
                      <svg-icon icon-class="topArrow" />
                   </div>
                   <div  @click="balanceActiveDown(scope.$index, scope.row)">
                      <svg-icon icon-class="downArrow" />
                   </div>
                </div>
            </div>
          </template> -->
               </el-table-column>
          <el-table-column
            prop="electricParam"
            v-if="show_ElectricParam"
            label="电参力"
             width="180"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
// import Sortable from "sortablejs";
import {
  getDisplacement,
  getTorque,
  getMutipleActive,
  postToStorage
} from "@/api/electricParamater";
import { ApiGetWellData} from "@/api/welldetail";
import { ApiGetRealdata, ApiGetElectdata } from "@/api/realdata";
import LineChart from "@/components/ECharts/LineMarker";
import dayjs from "dayjs";
export default {
  components: {
    LineChart
  },
  props: ["type", "wellid", "wellpoint", "addTimesValue","parameter","datePicker"],
  data() {
    return {
      realdata: [],
      // <-- 下面参数用于前端进行计算 -->
      torque:[],//扭矩因数值
      // activeData:[],//有功数据值
      activeDataList:[],//调整后有功数据值
      activeTorqueList:[],//调整有功扭矩值
      balanceTorqueList:[],//调整前平衡扭矩值
      addBalanceActiveList:[],//平衡扭矩值加调整有功扭矩力
      adjustBalTorqueList:[],//调整后平衡扭矩值
      balanceActiveList:[],//调整后平衡扭矩与有功力叠加

      show: false,
      show_Linechart: false,
       
      //<-- 按钮旁边的对勾图标-->
      showCheckOne:false,
      showCheckTwo:false,
      // <-- table的列是否用于展示-->
      show_Torque: false, //扭矩因数
      show_Displacement: false, //位移
      show_SignalActive: false, //一个冲次有功数据
      show_MutipleActive: false, //一个或多个冲次叠加有功数据
      show_AdjustActive: false, //调整有功数据
      show_ActiveTorque: false, //调整有功扭矩计算
      // show_addBalanceActive: false, //平衡扭矩加调整有功扭矩力
      show_BalanceTorque: false, //一个冲次调整平衡扭矩计算
      show_BalanceActive: false, //调整平衡与调整有功扭矩叠加
      show_ElectricParam: false, //叠加扭矩转换电参力

      // <-- 按钮是否禁止 -->
      showOnceActive:false,//一个冲次有功数据
      showMutipleActive:true,//多个一个冲次叠加有功数据
      showAdjustActive:true,//调整有功数据
      showActiveTorque: true,//调整有功扭矩计算
      showBalanceTorque:true,//一个冲次调整平衡扭矩计算
      showBalanceActive: true,//调整平衡与调整有功扭矩叠加
      showElectricParam: true,//叠加扭矩转换电参力

      // <-- 下面参数用于前端进行计算 -->
      mutipleActiveList: [], //获取一个或多个冲次叠加有功数据
      displacementList: [], //获取位移数据
      electricParamList: [], //获取电参力
      // <-- 判断扭矩因数和有功数据是否有值 -->
      noTorqueData:true,
      noActiveData:true,
      noDisplacement:true,
      // <-- 暂时前端先写固定的有功值，参考表格文档中的，以便测试-->
      activeData:[0.56,0.5315,0.5015,0.707,0.9435,1.181,1.4025,2.8475,3.7745,4.4495,5.1755,8.0365,10.8315,
      12.5105,13.123,14.749,18.1655,19.525,20.083,20.034,20.039,21.107,21.3085,21.2385,21.1355,21.119,21.0215,
      20.789,20.172,19.405,19.0555,18.619,17.401,16.1505,15.651,15.318,14.561,13.433,12.462,12.188,11.639,10.6115,
      9.732,9.1065,8.9355,8.351,7.3915,6.9345,6.8205,6.6395,6.29,6.0335,6.004,6.0275,5.9785,5.94,5.989,6.0805,
      6.172,6.2445,6.364,6.668,6.8105,6.926,7.1035,7.548,7.755,7.8775,8.0285,8.2385,8.518,8.5755,8.575,8.544,
      8.4895,8.479,8.3685,7.909,7.367,7.2475,7.0645,6.5105,5.6915,5.0895,4.947,4.447,3.1305,1.9495,1.5385,
      1.3615,0.4355,-0.37,-0.7945,-1.0125,-1.5365,-2.4335,-3.1055,-3.341,-3.3455,-3.5815,-3.6535,-3.156,-2.263,
      -1.504,-1.4345,1.517,5.376,7.0645,8.457,7.492,10.975,12.134,12.126,10.935,10.4665,10.5835,11.1835,10.844,
      10.2535,10.34,10.42,9.9865,8.978,7.5165,7.0845,7.066,6.4735,5.864,5.4015,5.3475,5.1155,4.228,3.3325,
      2.9765,2.915,2.2975,1.594,1.2405,1.1495,1.089,0.821,0.534,0.5215,0.575
      ],
      // <-- 角度 -->
      JD1:'',
      JD2:'',
      JDsub:'',
      angle145:[0,2.5,5,7.5,10,12.5,15,17.5,20,22.5,25,27.5,30,32.5,35,37.5,40,42.5,45,47.5,50,52.5,
             55,57.5,60,62.5,65,67.5,70,72.5,75,77.5,80,82.5,85,87.5,90,92.5,95,97.5,100,102.5,105,107.5,
             110,112.5,115,117.5,120,122.5,125,127.5,130,132.5,135,137.5,140,142.5,145,147.5,150,152.5,
             155,157.5,160,162.5,165,167.5,170,172.5,175,177.5,180,182.5,185,187.5,190,192.5,195,197.5,
             200,202.5,205,207.5,210,212.5,215,217.5,220,222.5,225,227.5,230,232.5,235,237.5,240,242.5,
             245,247.5,250,252.5,255,257.5,260,262.5,265,267.5,270,272.5,275,277.5,280,282.5,285,287.5,
             290,292.5,295,297.5,300,302.5,305,307.5,310,312.5,315,317.5,320,322.5,325,327.5,330,332.5,
             335,337.5,340,342.5,345,347.5,350,352.5,355,357.5,360
             ],
      angle200:[0,1.809045226,3.618090452,5.427135678,7.236180905,9.045226131,10.85427136,12.66331658,14.47236181,
      16.28140704,18.09045226,19.89949749,21.70854271,23.51758794,25.32663317,27.13567839,28.94472362,30.75376884,
      32.56281407,34.3718593,36.18090452,37.98994975,39.79899497,41.6080402,43.41708543,45.22613065,47.03517588,
      48.84422111,50.65326633,52.46231156,54.27135678,56.08040201,57.88944724,59.69849246,61.50753769,63.31658291,
      65.12562814,66.93467337,68.74371859,70.55276382,72.36180905,74.17085427,75.9798995,77.78894472,79.59798995,
      81.40703518,83.2160804,85.02512563,86.83417085,88.64321608,90.45226131,92.26130653,94.07035176,95.87939698,
      97.68844221,99.49748744,101.3065327,103.1155779,104.9246231,106.7336683,108.5427136,110.3517588,112.160804,
      113.9698492,115.7788945,117.5879397,119.3969849,121.2060302,123.0150754,124.8241206,126.6331658,128.4422111,
      130.2512563,132.0603015,133.8693467,135.678392,137.4874372,139.2964824,141.1055276,142.9145729,144.7236181,
      146.5326633,148.3417085,150.1507538,151.959799,153.7688442,155.5778894,157.3869347,159.1959799,161.0050251,
      162.8140704,164.6231156,166.4321608,168.241206,170.0502513,171.8592965,173.6683417,175.4773869,177.2864322,
      179.0954774,180.9045226,182.7135678,184.5226131,186.3316583,188.1407035,189.9497487,191.758794,193.5678392,
      195.3768844,197.1859296,198.9949749,200.8040201,202.6130653,204.4221106,206.2311558,208.040201,209.8492462,
      211.6582915,213.4673367,215.2763819,217.0854271,218.8944724,220.7035176,222.5125628,224.321608,226.1306533,
      227.9396985,229.7487437,231.5577889,233.3668342,235.1758794,236.9849246,238.7939698,240.6030151,242.4120603,
      244.2211055,246.0301508,247.839196,249.6482412,251.4572864,253.2663317,255.0753769,256.8844221,258.6934673,
      260.5025126,262.3115578,264.120603,265.9296482,267.7386935,269.5477387,271.3567839,273.1658291,274.9748744,
      276.7839196,278.5929648,280.4020101,282.2110553,284.0201005,285.8291457,287.638191,289.4472362,291.2562814,
      293.0653266,294.8743719,296.6834171,298.4924623,300.3015075,302.1105528,303.919598,305.7286432,307.5376884,
      309.3467337,311.1557789,312.9648241,314.7738693,316.5829146,318.3919598,320.201005,322.0100503,323.8190955,
      325.6281407,327.4371859,329.2462312,331.0552764,332.8643216,334.6733668,336.4824121,338.2914573,340.1005025,
      341.9095477,343.718593,345.5276382,347.3366834,349.1457286,350.9547739,352.7638191,354.5728643,356.3819095,
      358.1909548,360
      ],
      count:0,
      loading:false,
      AllData:false,
    };
  },
  created() {
    this.getAngle();
    // this.getBalanceTorque();
    // 保证每次刷新页面，叠加次数大于1时，激活多个一个有功数据按钮
    if(this.addTimesValue!=1){
      this.showOnceActive = true;
      this.showMutipleActive = false
    }else{
      this.showOnceActive = false;
      this.showMutipleActive = true
    }
  },
  watch:{
    wellid: {
      handler: function(newVal, oldVal) {
       if (newVal) {
         this.getAngle()
        //  this.getBalanceTorque();
        }
      }
    },
    wellpoint:{
      handler: function(newVal, oldVal) {
       if (newVal) {
         this.getAngle()
        //  this.getBalanceTorque();
       }
      }
    },
    addTimesValue:{
      handler: function(newVal, oldVal) {
        if(newVal){
          if (newVal != 1) {
             this.showOnceActive = true;
             this.showMutipleActive = false
            }else{
              this.showOnceActive = false;
             this.showMutipleActive = true
            }
            this.getAngle()
          }
          // 叠加次数改变时触发该事件
          this.addTimesChange()
        }
    }
  },
  methods: {
    // 一键展示所有数据（全选）
    getAllData(){
      this.AllData = true
      this.addTorque()//获取扭矩因数
      this.addDisplacement()//获取位移数据
      if(this.addTimesValue ==1){
        this.addMutipleActive(1)//获取一个有功数据
      }else{
        this.addMutipleActive(2)//获取多个一个有功数据
      }     
    },
    addTimesChange(){
      this.realdata.map((item,index)=>{
        // if(item.mutipleActive != undefined){
        //   console.log(index)
        // }
      })
    },
    // 手动调整有功数据，上移和下移
     activeEditUp(index, row) {
      //  console.log("点击上移。。。")
       let length = this.realdata.length
       let newData = this.activeDataList
       let adjustActive ={}
       let temp =newData[0]
       for(var i=0;i<length;i++){
          newData[i]=newData[i+1]
       }
       newData[length-2] =temp
       if(this.wellpoint ==145){
         newData[144] = newData[0]
       }else{
         newData[199] = newData[0]
       }
      // this.count++
        this.realdata.map((item, index) => {
        newData.map((t, k) => {
          if (index == k) {
            adjustActive = { adjustActive: t };
            Object.assign(item, adjustActive);
          }
        });
      });
      this.noShowColumnsTwo()
      let elecParames = []
       elecParames =this.$store.state.elecParame.elecParamesList
       this.realdata =elecParames
      },
    activeEditDown(index,row){
      // console.log("点击下移1111111111。")
      let length = this.realdata.length
       let newData = this.activeDataList
       for(var i=length-1;i>=0;i--){
          newData[i]=newData[i-1]
       }
       if(this.wellpoint ==145){
         newData[0] = newData[144]
       }else{
         newData[0] = newData[199]
       }
      this.realdata.map((item, index) => {
        newData.map((t, k) => {
          if (index == k) {
            let adjustActive = { adjustActive: t };
            Object.assign(item, adjustActive);
          }
        });
      });
      this.noShowColumnsTwo()
      let elecParames = []
       elecParames =this.$store.state.elecParame.elecParamesList
       this.realdata =elecParames
    },
    /*
    // 手动调整有功与平衡扭矩叠加，上移和下移
     balanceActiveUp(index, row) {
       let lenght = this.realdata.length
       let newData = this.balanceActiveList
       let temp = newData[0]
       for(var i=0;i<lenght;i++){
          newData[i]=newData[i+1]
       }
       if(this.wellpoint ==145){
         newData[144] = temp
       }else{
         newData[199] = temp
       }

         this.realdata.map((item, index) => {
        this.balanceActiveList.map((t, k) => {
          if (index == k) {
            let balanceActive = { balanceActive: t };
            Object.assign(item, balanceActive);
          }
        });
      });
      },
    balanceActiveDown(index,row){
      let lenght = this.realdata.length
       let newData = this.balanceActiveList
       let temp = newData[lenght-1]
       for(var i=lenght-1;i>=0;i--){
          newData[i]=newData[i-1]
       }
       if(this.wellpoint ==145){
         newData[0] = temp
       }else{
         newData[0] = temp
       }
        this.realdata.map((item, index) => {
        this.balanceActiveList.map((t, k) => {
          if (index == k) {
            let balanceActive = { balanceActive: t };
            Object.assign(item, balanceActive);
          }
        });
      });
    },
    */
   // 对数据进行圆滑处理
    sleek(params) {
        for(var i=0;i<params.length;i++){
          if(this.electricParamList[i+1]-this.electricParamList[i]>=1||this.electricParamList[i+1]-this.electricParamList[i]<=1){
            var average = (params[i+1]+params[i])/2
            params[i+1] = average
          }
        }
        return params
      },
    //获取位移与电参力示功图
    getEleChart() {
      /*this.parameter("父组件传回来的参数")
      */
      // 获取井名和井类型
      let wellName = "";
      let welltype=this.parameter[0].well_type;
      // 对x轴的值进行处理
      let displacementList = []//x轴的值
      let maxData =Math.max(...this.displacementList) //x轴展示的最大值
      // 对计算的电参叠加力进行圆滑处理
      let sleekCount =0
      for(var i=0;i<this.electricParamList.length;i++){
        // 目前对电参力平滑处理六次
        if(sleekCount<6){
          if(this.electricParamList[i+1]-this.electricParamList[i]>1||this.electricParamList[i+1]-this.electricParamList[i]<-1){
            this.electricParamList=this.sleek(this.electricParamList)
          }else{
            this.electricParamList[i] = this.electricParamList[i]
          }
        }
        sleekCount ++
      }
      let data = []    //自定义曲线图属性series中的data
      for(let i = 0;i < this.displacementList.length;i ++){
         data[i] = [this.displacementList[i],this.electricParamList[i]]
      }
      ApiGetRealdata({
        realdata: "",
        well_type: welltype, //后端接口返回
        pagenum: "100"
      }).then(res => {
        res.data.realdata.map((item, index) => {
          if (item.wellid == this.wellid) {
            wellName = item.name;
          }
        });
        let workInfo = {
          title: {
            text: "位移与电参力示功图" + wellName + "(井号）",
            left: "center"
          },
          grid: {
            left: "15%",
            right:"15%",
            height:190
          },
          tooltip: {
            trigger: "axis",
            confine:true,
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
              var tip = "";
              let value1 = params[0].value;
              let marker1 = params[0].marker;
              tip = params[0].axisValue +'<br />';
              tip = tip + marker1 +'位移:' + params[0].value[1] +'<br />'
                return tip;
            }
          },
          xAxis: {
            name:"位移",
            nameTextStyle: { fontSize: 16 },
            type: 'value',
            splitLine: { show: false },
            boundaryGap: false,
            triggerEvent: true, //为标签添加触发事件
            axisLabel: {
              fontSize: 14,
              formatter: (val) => {
                return val
              }
            },
          },
          yAxis: {
            type: "value",
            name: "电参力Kn",
            axisLabel: {
              fontSize: 16
            }
          },
          series: [{
            data: data,
            type: 'line',
            smooth:true,
            symbol:"none",
          }]
        };
        this.$nextTick(() => {
          this.$refs["params-chart"].initChart(workInfo);
        });
      });
    },
    // 获取角度
    getAngle(){
      if(this.wellpoint == 145){
        this.realdata =[];
        this.noShowColumns()
        this.angle145.map((t,k)=>{
          let angle = { angle: t };
          this.realdata.push(angle);
        })
      }else{
        this.realdata =[];
        this.noShowColumns()
        this.angle200.map((t,k)=>{
          let angle = { angle: t };
          this.realdata.push(angle);
        })
      }
    },
    //一个冲次扭矩因数数据
    addTorque() {
      function pointFormat(params) {
        if (params == 145) {
          return 0;
        } else {
          return 1;
        }
      }
      ApiGetWellData({
        id: this.wellid,
        p_type:5,
        data_type: pointFormat(this.wellpoint)
      }).then(({ data }) => {
        // if(data.status === 0){
          this.show_Torque = true;
          if (data.data_len != 0) {
            this.noTorqueData = false
            // 只有把“扭矩因数”跟“一个冲次有功”（“多个冲次有功”）都点击后，才可使用“调整后有功按钮”
            if( this.noTorqueData == false&&this.noActiveData == false){
              this.showAdjustActive = false;
            }
            this.torque = data.datas;
            if (this.realdata.length != 0) {
              this.realdata.map((item, index) => {
                data.datas.map((t, k) => {
                  if (index == k) {
                    let torgue = { torque: t };
                    Object.assign(item, torgue);
                  }
                });
              });
            } else {
              data.datas.map((t, k) => {
                let torgue = { torque: t };
                this.realdata.push(torgue);
              });
            }
          } else {
            this.show_Linechart = false;
            this.noTorqueData = true;
            this.$message.error("扭矩因数无数据，无法进行后续计算");
          }
        // }else{
        //   this.$message.error(data.msg);
        // }
      });  
    },
    //一个冲次位移数据
    addDisplacement() {
      function pointFormat(params) {
        if (params == 145) {
          return 0;
        } else {
          return 1;
        }
      }
      ApiGetWellData({
        id: this.wellid,
        p_type:1,
        data_type: pointFormat(this.wellpoint)
      }).then(({ data }) => {
            this.show_Displacement = true;
            // this.showDisplacement = true;
            // 只有把“位移数据”跟“调整后的电参力数据”都点击后，才能存入数据库中”
            if(this.show_Displacement == true&&this.show_BalanceActive == true){
              this.showElectricParam = false;
            }
            if (data.data_len != 0) {
              this.noDisplacement = false;
              this.show_Linechart = true;
              if (this.realdata.length != 0) {
                this.displacementList = data.datas;
                this.realdata.map((item, index) => {
                  data.datas.map((t, k) => {
                    if (index == k) {
                      let displacement = { displacement: t };
                      Object.assign(item, displacement);
                    }
                  });
                });
              } else {
                data.datas.map((t, k) => {
                  let displacement = { displacement: t };
                  this.realdata.push(displacement);
                });
              }
              this.getEleChart();
            } else {
              // console.log("否则隐藏调")
              this.noDisplacement = true;
              this.show_Linechart = false;
              // this.realdata = [];
              this.$message.error("位移无数据，无法进行后续计算");
            }
      });  
    },
    // 一个或多个冲次叠加有功数据
    addMutipleActive(type) {
      // /* 此方法是调用后端接口的
      function pointFormat(params) {
        if (params == 145) {
          return 0;
        } else {
          return 1;
        }
      }
      getMutipleActive({
        id: this.wellid,
        times: this.addTimesValue,
        data_type: pointFormat(this.wellpoint)
      }).then(({ data }) => {
        if(data.status == 0){
          this.show_MutipleActive = true;
          // 对选中图标是否展示做判断
          if(type == 1){
            this.showCheckOne = true;
            this.showCheckTwo = false;
          }else if(type ==2){
            this.showCheckOne = false;
            this.showCheckTwo = true;
          }
          if (data.msg.length != 0) {
            this.noActiveData =false;
              // 只有把“扭矩因数”跟“一个冲次有功”（“多个冲次有功”）都点击后，才可使用“调整后有功按钮”
            if(this.noTorqueData==false&&this.noActiveData==false){
              this.showAdjustActive = false;
            }
            this.activeData = data.msg;
            if(data.msg.length == 144){
              // 如果是144个点，就让有功数据的第一个值与最后一个值相等
              data.msg.push(data.msg[0])
            }else{
              // 如果是145个点，那就直接展示就可以
              //调整有功数据中，保持在144个点(删除数组中最后一个数)
              // 
            }
            if (this.realdata.length != 0) {
              this.realdata.map((item, index) => {
                data.msg.map((t, k) => {
                  if (index == k) {
                    let mutipleActive = { mutipleActive: t };
                    Object.assign(item, mutipleActive);
                  }
                });
              });
              
            } else {
              data.msg.map((t, k) => {
                let mutipleActive = { mutipleActive: t };
                this.realdata.push(mutipleActive);
              });
            }
            // 把此时的this.realdata存入仓库中
            this.$store.commit("elecParame/SET_ElecParame",this.realdata)
            if(this.AllData == true&&this.showAdjustActive == false){
                this.addAdjustActive()
              }
              // 保证调整有功数据刚开始只有144个值(因为145个值中最后一个值与第一个值是一样的)
              this.activeData.pop()
          } else {
            this.show_Linechart = false;
            this.noActiveData =true;
            // this.realdata = [];
            this.$message.error("有功无数据，无法进行后续计算");
          }
        }else{
            this.$message.error(data.msg);
          }
        
      });  
    },
    // 调整有功数据
    addAdjustActive() {
      // 找到扭矩因数从负到正时，绝对值最小的值
      // 值为adjustData，索引为adjustDataIndex
        let adjustDataList = [];
        let adjustDataIndexList = [];
        let adjustData = '';
        let adjustDataIndex = '';
        for(var i=0;i<this.torque.length;i++){
          if(this.torque[i]<0&&this.torque[i+1]>0){
            if(Math.abs(this.torque[i])>Math.abs(this.torque[i+1])){
              adjustDataList.push(this.torque[i+1])
              adjustDataIndexList.push(i+1)
            }else{
              adjustDataList.push(this.torque[i])
              adjustDataIndexList.push(i)
            } 
         }
        };
        adjustData = adjustDataList[0];
        adjustDataIndex = adjustDataIndexList[0]
        // console.log("扭矩因数，调整点："+adjustData)
        // console.log("扭矩因数索引值："+adjustDataIndex)
        /*-----------
         获取多个一个冲次叠加有功数据，需要移动位置的第一个点(按着递减规律，找绝对值最小的数)，
         值为activeData,索引为activeDataIndex
        -----------*/
        let activeDataIndex = '';
        let activeDataIndexList = [];
        let activeData = this.activeData;
        let length = this.activeData.length;
        for(var i=0;i<length;i++){
          if((Math.abs(activeData[i-1])-Math.abs(activeData[i]))>=0
          &&(Math.abs(activeData[i+1])-Math.abs(activeData[i]))>=0){
            // 判断出现这种情况：5，4，3，2，2，3从第二个2开始移动
            if((Math.abs(activeData[i-1])-Math.abs(activeData[i]))>=0
            &&(Math.abs(activeData[i+1])-Math.abs(activeData[i]))==0){
              activeDataIndexList.push(i+1)
            }else{
              activeDataIndexList.push(i)
            }
            
          }
        };
        activeDataIndex =activeDataIndexList[0]  
        // console.log("有功数据索引值："+activeDataIndex)

      //   /*----------对有功数据列进行移动,得到调整有功数据列
      //    若activeDataIndex大于adjustDataIndex，上移两者的差个数subData，
      //   若activeDataIndex小于adjustDataIndex，下移两者的差个数subData，
      //   ------------*/
        function reverse (arr,left,right){
          let mid = (left+right)/2;
          let temp = '';
          for(var i=0;i<=(mid-left);i++){
            temp = arr[left+i];
            arr[left+i] = arr[right-i];
            arr[right-i]=temp;
          }
          return arr;
        }
        let subData = activeDataIndex - adjustDataIndex
        let newactiveDataList =[]   
        if(subData>0){
          // 上移绝对值subData个位
          // activeData是有功数据的第'subData绝对值减一'个值,保证上移后，倒数第二个数等于该值
          let activeData =  this.activeData[Math.abs(subData)-1]
         reverse(this.activeData,0,length-1);
         reverse(this.activeData,0,length-1-Math.abs(subData));
         newactiveDataList=reverse(this.activeData,length-Math.abs(subData),length-1);
         newactiveDataList[length-1]=activeData
         newactiveDataList.push(newactiveDataList[0])
        }else{
          // // 下移subData个位
          reverse(activeData,0,length-1);
          reverse(activeData,0,Math.abs(subData)-1);
           newactiveDataList=reverse(activeData,Math.abs(subData),length-1);
          // newactiveDataList[0]=newactiveDataList[length-1]
          newactiveDataList.push(newactiveDataList[0])
        }
        this.show_AdjustActive =true
        this.showActiveTorque = false;
        this.activeDataList = newactiveDataList
        this.realdata.map((item, index) => {
        newactiveDataList.map((t, k) => {
          if (index == k) {
            let adjustActive = { adjustActive: t };
            Object.assign(item, adjustActive);
          }
        });
      });
      if(this.AllData == true&&this.showActiveTorque == false){
          this.addActiveTorque()
      }
    },
    // 调整有功扭矩计算
    addActiveTorque() {
      // let rush_times = this.parameter[0].impulse_times
      let rush_times =5.86
      // 获取后端返回的冲次
      function Computed(data) {
        return (30 * data) / (3.1415926 * rush_times);
      }
      let activeTorqueList = [];
      this.show_ActiveTorque = true;
      this.showBalanceTorque =false;
      this.activeDataList.map((item, index) => {
       activeTorqueList.push(Math.round(Computed(item) * 1000000000) / 1000000000);
      });
      this.activeTorqueList = activeTorqueList
      this.realdata.map((item, index) => {
        activeTorqueList.map((t, k) => {
          if (index == k) {
            let activeTorque = { activeTorque: t };
            Object.assign(item, activeTorque);
          }
        });
      });
      // this.show_addBalanceActive = true;
      // // 获取平衡扭矩加调整有功扭矩力
      // this.getAddBalanceActive();
      this.getBalanceTorque()
      if(this.AllData == true&&this.showBalanceTorque==false){
          this.adjustBalanceTorque()
      }
    },
    // 计算平衡扭矩
    /* 调整前平衡扭矩值 */
     getBalanceTorque(){
       // 偏置角后端返回
        let offset_angle = this.parameter[0].offset_angle
      //计算公式 67.17124=4个(平衡块尺寸*平衡块重量)+曲柄尺寸*(2*曲柄销重量+曲柄重量)
       let size_1_big=this.parameter[0].size_1_big_balance
       let size_2_big=this.parameter[0].size_2_big_balance
       let size_1_small=this.parameter[0].size_1_small_balance
       let size_2_small=this.parameter[0].size_2_small_balance
       let weight_1_big=this.parameter[0].weight_1_big_balance
       let weight_1_small=this.parameter[0].weight_1_small_balance
       let weight_2_big=this.parameter[0].weight_2_big_balance
       let weight_2_small=this.parameter[0].weight_2_small_balance
       let size_1_crank=this.parameter[0].size_1_crank
       let weight_1_crank=this.parameter[0].weight_1_crank
       let crank_pin_weight=this.parameter[0].crank_pin_weight
       let sum = (size_1_big*weight_1_big+size_2_big*weight_2_big+size_1_small*weight_1_small+size_2_small*weight_2_small)
       +size_1_crank*(2*crank_pin_weight+weight_1_crank)
       function Computed(data) {
        //  67.17124*SIN((J23-8)*3.1415926/180)
        // 此处还是用的67.17124，因为计算的值太大了
        return sum * Math.sin((data - offset_angle)*3.1415926/180);
      }
      let balanceTorqueList = []
      if(this.wellpoint == 145){
         balanceTorqueList = []
        this.angle145.map((item, index)=>{
          balanceTorqueList.push(Math.round(Computed(item) * 1000000000) / 1000000000);
        })
      }else{
         balanceTorqueList = []
        this.angle200.map((item, index)=>{
          balanceTorqueList.push(Math.round(Computed(item) * 1000000000) / 1000000000);
        })
      };
      this.balanceTorqueList = balanceTorqueList;
      // this.realdata.map((item, index) => {
      //   balanceTorqueList.map((t, k) => {
      //     if (index == k) {
      //       let balanceTorque = { balanceTorque: t };
      //       Object.assign(item, balanceTorque);
      //     }
      //   });
      // });
     },
    //  调整平衡扭矩前进行的两次调整计算
    twoAdjustBalanceTorque(){
      // //计算公式 67.17124=4个(平衡块尺寸*平衡块重量)+曲柄尺寸*(2*曲柄销重量+曲柄重量)
       let size_1_big=this.parameter[0].size_1_big_balance
       let size_2_big=this.parameter[0].size_2_big_balance
       let size_1_small=this.parameter[0].size_1_small_balance
       let size_2_small=this.parameter[0].size_2_small_balance
       let weight_1_big=this.parameter[0].weight_1_big_balance
       let weight_1_small=this.parameter[0].weight_1_small_balance
       let weight_2_big=this.parameter[0].weight_2_big_balance
       let weight_2_small=this.parameter[0].weight_2_small_balance
       let size_1_crank=this.parameter[0].size_1_crank
       let weight_1_crank=this.parameter[0].weight_1_crank
       let crank_pin_weight=this.parameter[0].crank_pin_weight
       let sum = (size_1_big*weight_1_big+size_2_big*weight_2_big+size_1_small*weight_1_small+size_2_small*weight_2_small)
       +size_1_crank*(2*crank_pin_weight+weight_1_crank)
      // let sum = 67.17124
      /*一、对扭矩因数进行定位:(第一次：最后一个负值处)，(第二次：第一个负值处) */
      // 找到第一个负值，值为firstTorque，索引为firstTorqueIndex
        let firstTorque = '';
        let firstTorqueIndex = '';
        for(var i=0;i<this.torque.length;i++){
          if(this.torque[i]<0&&this.torque[i+1]>0){
            firstTorque = this.torque[i];
            firstTorqueIndex = i
         }
        };
        // console.log("第一个值："+firstTorque)
        // console.log("第一个索引："+firstTorqueIndex)
        // 找到第二个负值，值为secondTorque，索引为secondTorqueIndex
        let secondTorque = '';
        let secondTorqueIndex = '';
        for(var i=firstTorqueIndex+1;i<this.torque.length;i++){
          if(this.torque[i]>0&&this.torque[i+1]<0){
            secondTorque = this.torque[i+1];
            secondTorqueIndex = i+1
         }
        };
        // console.log("第二个值："+secondTorque)
        // console.log("第二个索引："+secondTorqueIndex)

        /* 二、获取平衡扭矩加调整有功扭矩力 */
        // 上面已经调用了该方法，下面直接使用即可
        this.getAddBalanceActive();
        
      /* 三、计算角度1 JD1 */
      this.computedJD1(sum,firstTorque,firstTorqueIndex,this.addBalanceActiveList)
      /* 四、计算角度2 JD2 */
      this.computedJD2(sum,secondTorque,secondTorqueIndex,this.addBalanceActiveList)
      /* 五、计算两者角度差 */
      this.JDsub = (this.JD1 - this.JD2).toFixed(6)
      console.log("角度差："+this.JDsub)
      /* 六、第一个调整位置处的上下对称值 */
      this.symmetry(sum,firstTorqueIndex)
      /* 七、第一个调整位置(上下对称数后起)————第二个调整位置处(含)：数据值 */
      this.firstToSecond(sum,firstTorqueIndex,secondTorqueIndex)
      /* 八、第二个调整位置(不含）————终点：数据值 */
      this.secondToEnd(sum,secondTorqueIndex)
    },
    getAddBalanceActive(){
      // let addBalanceActiveList =[];
        let length = this.balanceTorqueList.length
        // console.log("扭矩因数："+this.torque)
        // console.log("调整前平衡扭矩："+this.balanceTorqueList)
        // console.log("调整有功扭矩："+this.activeTorqueList)
        function arrAdd(arrA,arrB,n,arrC) {
          let arrD = [];
          let i ='';
          for(i=0;i<n;i++){
            arrD[i]=Math.round(((arrA[i]+arrB[i])/arrC[i]) * 1000000000) / 1000000000
          }
          return arrD;
        }
        this.addBalanceActiveList = arrAdd(this.balanceTorqueList,this.activeTorqueList,length,this.torque)
        // console.log("叠加后的值："+this.addBalanceActiveList)
        this.realdata.map((item, index) => {
        this.addBalanceActiveList.map((t, k) => {
          if (index == k) {
            let addBalanceActive = { addBalanceActive: t };
            Object.assign(item, addBalanceActive);
          }
        });
      });
    },
    computedJD1(sum,firstTorque,firstTorqueIndex,addBalanceActiveList){
      /* 计算角度1 JD1 */
       function computed(angle,torque,active,w){
         var data1 = (w * torque-active)/sum
         var data2 = Math.asin(data1)
         var data3 = angle-data2 * 180/3.1415926
         return data3;
       }
      // 最后一个负值(第一个调整位置处)上数第4个（如果没有那么多，数到起始第一个）值加3
       let electParaData = '';
       if(firstTorqueIndex <4){
          electParaData = addBalanceActiveList[0]+3
       }else{
         electParaData = addBalanceActiveList[firstTorqueIndex-4+1]+3
       }
      //  console.log("第一次调整平衡扭矩位置的电参力："+electParaData)
      //  获取第一个扭矩因数位置处的角度值
      let angle = '';
      if(this.wellpoint == 145){
        angle=this.angle145[firstTorqueIndex]
      }else{
        angle=this.angle200[firstTorqueIndex]
      }
      // console.log("第一个调整点角度："+angle)
      // 获取第一个扭矩因数位置处的调整有功扭矩值
      let active = '';
      active = this.activeTorqueList[firstTorqueIndex]
      // console.log("第一个调整点调整有功扭矩值："+active)
      // 调用计算方法，得到JD1
      // this.JD1=computed(7.5,-0.067292397,0.866117956,24.31180731)
      this.JD1=computed(angle,firstTorque,active,electParaData)
      this.JD1 = this.JD1.toFixed(6)
      console.log("角度1："+this.JD1)
    },
    computedJD2(sum,secondTorque,secondTorqueIndex,addBalanceActiveList){
      /* 计算角度2 JD2 */
      // 67.17124*SIN((J80-JD2)*3.1415926/180)
      function computed(angle,torque,active,w){
         var data1 = (w * (torque)-(active))/sum
         var data2 = Math.asin(data1)
      //因为在第二个调整点，角度J80肯定大于JD2,所以(J80-JD2)*3.1415926/180)值必大于零
      //于是对data2做处理，绝对值加π
         if(data2 < 0){
           data2 =Math.PI +Math.abs(data2)
         }
         var data3 = angle-data2 * 180/3.1415926
         return data3;
       }
       // 获取第二个调整点(含最后一个负值)上数第6至8个的电参力值（平衡扭矩加调整有功扭矩力）相加除3
      let threeAddData = '';
      threeAddData = (addBalanceActiveList[secondTorqueIndex-5]
      +addBalanceActiveList[secondTorqueIndex-6]
      +addBalanceActiveList[secondTorqueIndex-7])/3
      // console.log("三个数叠加求平均值："+threeAddData)
      //  获取第二个扭矩因数位置处的角度值
      let angle = '';
      if(this.wellpoint == 145){
        angle=this.angle145[secondTorqueIndex]
      }else{
        angle=this.angle200[secondTorqueIndex]
      }
      // console.log("第二个调整点角度："+angle)
      // 获取第二个扭矩因数位置处的调整有功扭矩值
      let active = '';
      active = this.activeTorqueList[secondTorqueIndex]
      // console.log("第二个调整点调整有功扭矩值："+active)
      // this.JD2=computed(200,-0.000250622,12.00506299,36.17377454)
      this.JD2=computed(angle,secondTorque,active,threeAddData)
      this.JD2 = this.JD2.toFixed(6)
      console.log("角度2："+this.JD2)
    },
    symmetry(sum,firstTorqueIndex){
      // 67.17124*SIN((J22-9.65)*3.1415926/180)
      function computed(angle,JD1){
        var result = sum*Math.sin((angle-JD1)*3.1415926/180)
        return result;
      };
      // 获取基于第一个调整点（firstTorqueIndex）的上下对称数量，并计算这几个调整平衡扭矩值
      let symmetryIndexEnde = firstTorqueIndex*2
      if(this.wellpoint == 145){
         for(var i=0;i<=symmetryIndexEnde;i++){
            this.adjustBalTorqueList[i]=Math.round(computed(this.angle145[i],this.JD1) * 1000000000) / 1000000000
          }
      }else{
        for(var i=0;i<=symmetryIndexEnde;i++){
            this.adjustBalTorqueList[i]=Math.round(computed(this.angle200[i],this.JD1) * 1000000000) / 1000000000
          }
      }
    },
    firstToSecond(sum,firstTorqueIndex,secondTorqueIndex){
      // 67.17124*SIN((J97-9.65-0.04675*S97/74)*3.1415926/180)
      function computed(point,angle,JD1,JDsub,count){
         var result = sum*Math.sin((angle-JD1+(JDsub)*point/count)*3.1415926/180)
         return result
        
      };
      let start = firstTorqueIndex*2+1;
      let count = secondTorqueIndex - start + 1;
      let length = start+count;
      for(var i=start,j=0;i<length;i++){
          if(this.wellpoint == 145){
            ++j
            this.adjustBalTorqueList[i]=Math.round(computed(j,this.angle145[i],this.JD1,this.JDsub,count) * 1000000000) / 1000000000
          }else{
            ++j
            this.adjustBalTorqueList[i]=Math.round(computed(j,this.angle200[i],this.JD1,this.JDsub,count) * 1000000000) / 1000000000
          }
      }      
    },
    secondToEnd(sum,secondTorqueIndex){
      // 67.17124*SIN((J164-9.69675+0.04675*S164/64)*3.1415926/180)
      function computed(point,angle,JD2,JDsub,count){
         var result = sum*Math.sin((angle-JD2-(JDsub)*point/count)*3.1415926/180)
         return result
      };
      let start = secondTorqueIndex + 1
      let count = '';
      if(this.wellpoint == 145){
         count = 145 -start ;
         for(var i=start,j=0;i<145;i++){
             ++j
            this.adjustBalTorqueList[i]=Math.round(computed(j,this.angle145[i],this.JD2,this.JDsub,count) * 1000000000) / 1000000000
         }
      }else{
        count =200 -start;
        for(var i=start,j=0;i<200;i++){
             ++j
            this.adjustBalTorqueList[i]=Math.round(computed(j,this.angle200[i],this.JD2,this.JDsub,count) * 1000000000) / 1000000000
         }
      }
    },
    // 一个冲次调整平衡扭矩计算
    adjustBalanceTorque() {
      //调用两次调整平衡扭矩的计算方法，得到最终的值 this.adjustBalTorqueList;
      this.twoAdjustBalanceTorque();
      this.show_BalanceTorque = true;
      this.showBalanceActive = false;
      this.realdata.map((item, index) => {
        this.adjustBalTorqueList.map((t, k) => {
          if (index == k) {
            let adjustbalanceTorque = { adjustbalanceTorque: t };
            Object.assign(item, adjustbalanceTorque);
          }
        });
      });
      if(this.AllData == true&&this.showBalanceActive == false){
          this.adjustBalanceActive()
      }
    },
    //调整平衡与调整有功扭矩叠加
    adjustBalanceActive() {
      function Computed(a,b) {
        return a + b;
      }
      this.show_BalanceActive = true;
      // 只有把“位移数据”跟“调整后的电参力数据”都点击后，才能存入数据库中”
      if(this.noDisplacement ==false&&this.show_BalanceActive == true){
        this.showElectricParam = false;
      }else{
        this.$message.error("数据有误，无法进行后续计算");
      } 
      let length = this.activeTorqueList.length
      for(var i=0;i<length;i++){
        this.balanceActiveList[i]=Math.round(Computed(this.activeTorqueList[i],this.adjustBalTorqueList[i]) * 1000000000) / 1000000000
      }
      this.realdata.map((item, index) => {
        this.balanceActiveList.map((t, k) => {
          if (index == k) {
            let balanceActive = { balanceActive: t };
            Object.assign(item, balanceActive);
          }
        });
      });
      if(this.AllData == true&&this.showElectricParam == false){
          this.changeElectricParam()
      }
    },
    //叠加扭矩转换电参力
    changeElectricParam() {
      function Computed(data,torque) {
        return data/torque;
      }
      this.loading =true
      this.show_ElectricParam = true;
      this.show_Linechart = true;
      for(var i=0;i<this.realdata.length;i++){
        this.electricParamList[i]=Math.round(Computed(this.balanceActiveList[i],this.torque[i]) * 1000000000) / 1000000000
      }
      this.realdata.map((item, index) => {
        this.electricParamList.map((t, k) => {
          if (index == k) {
            let electricParam = { electricParam: t };
            Object.assign(item, electricParam);
          }
        });
      });
      function pointFormat(params) {
        if (params == 145) {
          return 0;
        } else {
          return 1;
        }
      }
      getMutipleActive({
        id: this.wellid,
        times: this.addTimesValue,
        data_type: pointFormat(this.wellpoint)
      }).then(({ data }) => {
        this.postToStorages(data.msg)
      })
      this.getEleChart();
    },
    // // 把数据存入数据库(叠加有功次数、叠加有功、调整有功、调整平衡扭矩、电参力存数据库)
    postToStorages(stacking_active){
      function timeDateFormat(date) {
        if (date) {
            date = date
            return dayjs(date).format('YYYY/MM/DD HH:mm')
          } else {
            return ''
          }
        }
      let data={
        point_number:this.wellpoint,
        well_id:this.wellid,
        data_src:0,
        stacking_number:this.addTimesValue,
        stacking_active:JSON.stringify(stacking_active).replace(/\[|]/g, ''),
        adjustment_active:JSON.stringify(this.activeDataList).replace(/\[|]/g, ''),
        adjustment_balance_torque:JSON.stringify(this.adjustBalTorqueList).replace(/\[|]/g, ''),
        adjustment_electrical_force:JSON.stringify(this.electricParamList).replace(/\[|]/g, ''),
        displacement:JSON.stringify(this.displacementList).replace(/\[|]|"|"/g, ''),
        stroke:this.parameter[0].stroke,
        start_date:timeDateFormat(this.datePicker[0])
      }
      if(this.adjustbalanceTorque){
        this.$message.error("存储失败");
      }else{
         postToStorage(data).then(({ data })=>{
        if (data.status === 0) {
          this.loading = false
          this.$message.success(data.msg);
        }else{
         this.loading = false
          this.$message.error(data.msg);
        }
      })
      }
    },
    // table的所有列和折线图都不展示
    noShowColumns(){
      this.showAdjustActive = true;
      this.showActiveTorque = true;
      this.showBalanceTorque = true;
      this.showBalanceActive = true;
      this.showElectricParam = true;
      // this.show =false;
      this.showCheckOne=false;
      this.showCheckTwo=false;
      this.show_Linechart = false;
      this.show_Torque= false;
      this.show_Displacement = false;
      this.show_SignalActive= false;
      this.show_MutipleActive= false;
      this.show_AdjustActive = false;
      this.show_ActiveTorque= false;
      this.show_BalanceTorque = false;
      this.show_BalanceActive= false;
      this.show_ElectricParam = false;
    },
    noShowColumnsTwo(){
      // <-- 按钮是否禁止 -->
      this.showBalanceTorque=true,//一个冲次调整平衡扭矩计算
      this.showBalanceActive=true,//调整平衡与调整有功扭矩叠加
      this.showElectricParam=true,//叠加扭矩转换电参力
      // 后面的列不展示
      this.show_ActiveTorque= false;
      this.show_BalanceTorque = false;
      this.show_BalanceActive= false;
      this.show_ElectricParam = false;
    }
  }
};
</script>
<style lang="scss" scoped>
#manualTable {
  .el-btn-list {
    margin: 0 30px;
  }
  .el-btn-list-main {
    border-left: 0.5px solid rgb(230, 230, 230);
    border-right: 0.5px solid rgb(230, 230, 230);
    border-bottom: 0.5px solid rgb(230, 230, 230);
  }
  .el-btn-list-row {
    margin: 0 30px 10px 30px;
    padding-top: 10px;
  }
  .row-bg {
    padding-bottom: 10px;
  }
  .col-bg {
    padding: 5px 2px 0 45px;
    .button-style {
      width: 90%;
      height: 43px;
    }
  }
  .icon-check{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon-position{
     width: 20px;
     height: 20px;
    }
  }
  .table-list {
    margin: 10px 30px;
  }
  .cell-wellstatus{
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>