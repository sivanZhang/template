<template>
  <div id="realtimedata">
    <div class="realdata-title">
      <div class="title-text">实时数据曲线界面</div>
    </div>
    <div class="realdata-header">
      <el-card shadow="never">
        <el-row class="row-bg">
          <el-col :lg="5">
            井名&nbsp;:&nbsp;
            <el-select
              v-model="value"
              placeholder="请选择"
              style="width:130px;"
              @change="getWellDetails(value)"
              filterable
            >
              <el-option
                v-for="(item,index) of wellList"
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-col>
          <!-- <el-col :lg="5" class="col-bg">时间&nbsp;:&nbsp;{{wellDetail.time|dateTimeFormat}}</el-col> -->
          <el-col :lg="5" class="col-bg">
            <div v-if="wellDetail.well_type == 0">油井类别&nbsp;:&nbsp;抽油机</div>
            <div v-if="wellDetail.well_type == 1">油井类别&nbsp;:&nbsp;螺杆泵</div>
          </el-col>
          <el-col :lg="4">
            点数&nbsp;:&nbsp;
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
          <el-col :lg="3" v-if="datatype==0&&$store.state.login.userInfo.auth.manage_well">
            <el-button type="primary" @click="openDialog1()">添加145点位</el-button>
          </el-col>
          <el-col :lg="3" v-if="datatype==1&&$store.state.login.userInfo.auth.manage_well">
            <el-button type="primary" @click="openDialog()">添加200点位</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="realdata-chart">
      <el-row :gutter="15">
        <el-col :sm="12" style="margin-top: 0px;">
          <el-card shadow="never" body-style="padding-bottom:0px;padding-left:5px;">
            <div class="header-top">
              <div class="tap-time">
                <el-button
                  type="primary"
                  style=" border-radius: 20px;cursor:auto;width: 142px; 
                   height: 28px;"
                >{{this.eletime}}</el-button>
              </div>
              <div class="manual" v-if="this.manualType==1">
                <el-button type="danger" style=" border-radius: 20px;cursor:auto;">自动</el-button>
              </div>
              <div class="manual2" v-if="this.manualType==0">
                <el-button type="danger" style=" border-radius: 20px;cursor:auto;">手动</el-button>
                <el-button
                  type="danger"
                  @click="delManualData()"
                  v-if="$store.state.login.userInfo.auth.manage_well"
                >删除</el-button>
              </div>
            </div>
            <LineChart ref="ele-chart" chart-id="ele-chart" class="elechart" />
          </el-card>
        </el-col>
        <el-col :sm="12" style="margin-top:0px;">
          <el-card shadow="never" body-style="padding-bottom:0px;padding-left:5px;">
            <div class="header-top">
              <div class="tap-time">
                <el-button
                  type="primary"
                  style=" border-radius:20px;cursor:auto;width: 142px;
                  height: 28px;"
                >{{this.worktime}}</el-button>
              </div>
              <div class="manual" v-if="this.manual==1">
                <el-button type="danger" style=" border-radius: 20px;cursor:auto;">自动</el-button>
              </div>
              <div class="manual2" v-if="this.manual==0">
                <el-button type="danger" style=" border-radius: 20px;cursor:auto;">手动</el-button>
                <el-button
                  type="danger"
                  @click="delworkData()"
                  v-if="$store.state.login.userInfo.auth.manage_well"
                >删除</el-button>
              </div>
            </div>
            <LineChart ref="work_chart" chart-id="work_chart" class="elechart" />
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="realdata-header">
      <el-card shadow="never">
        <el-row :gutter="15">
          <el-col :sm="7">日电量：{{realDetail.power_consumption}} 千瓦时</el-col>
          <el-col :sm="7">日产液量：{{realDetail.output}} 吨</el-col>
          <el-col :sm="6">动液面：{{realDetail.level}} 米</el-col>
          <el-col :sm="4">系统效率：{{sysEfficiency}}%</el-col>
        </el-row>
        <el-row :gutter="15" style="margin-top:10px;" v-if="wellDetail.well_type == 0">
          <el-col :sm="7">平衡度：{{realDetail.balance}}</el-col>
          <el-col :sm="7">平衡调整量1：{{realDetail.adjustment1}} 米</el-col>
          <el-col :sm="6">平衡调整量2：{{realDetail.adjustment2}} 米</el-col>
        </el-row>
        <el-row :gutter="15" style="margin-top:10px;" v-if="wellDetail.well_type == 0">
          <el-col :sm="7">平衡调整量3：{{realDetail.adjustment3}} 米</el-col>
          <el-col :sm="7">平衡调整量4：{{realDetail.adjustment4}} 米</el-col>
          <el-col :sm="6">平衡调整量5：{{realDetail.adjustment5}} 米</el-col>
        </el-row>
      </el-card>
    </div>
    <div style="margin-top:50px"></div>
    <!-- 添加200点位数据 -->
    <el-dialog title="添加200点位" :visible.sync="dialogShow" width="520px" top="5vh">
      <el-form :model="addData" label-width="90px" ref="addData" :rules="rules">
        <el-form-item label="点位类型" prop="p_type" v-if="wellDetail.well_type == 0">
          <el-select v-model="addData.p_type"
          @change="currStationChange(200)" placeholder="请选择" style="width:200px;">
            <el-option
              v-for="item in typelist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="点位类型" prop="p_type" v-if="wellDetail.well_type == 1">
          <el-select v-model="addData.p_type"
          @change="currStationChange(200)" placeholder="请选择" style="width:200px;">
            <el-option
              v-for="item in typelist1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上报时间" prop="time" >
          <el-date-picker
            v-model="addData.time"
            type="datetime"
            placeholder="选择日期时间"
            style="width:200px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="点位数据" prop="p144_data">
          <el-input
            ref="200input"
            v-model="addData.p144_data"
            type="textarea"
            :rows="12"
            onkeyup="value=value.replace(/[\u4E00-\u9FA5]|[A-Za-z]/g,'')"
            placeholder="点位数据之间用英文逗号隔开"
          ></el-input>
        </el-form-item>

        <div class="btn">
          <!-- <el-button @click="cancel">取消</el-button> -->
          <router-link to="point-position" class="viewPoint"><el-link :underline="false" style="color:#0000FF;font-size:12px;">点位表格</el-link></router-link>
          <el-button type="primary" @click="submitForm('addData')">创建</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 添加145点位数据 -->
    <el-dialog title="添加145点位" 
      :visible.sync="dialogShow1" 
      width="520px" 
      top="5vh">
      <el-form :model="addP145Data" label-width="90px" ref="addP145Data" :rules="rules">
        <el-form-item label="点位类型" prop="p_type" v-if="wellDetail.well_type == 0">
          <el-select v-model="addP145Data.p_type"
          @change="currStationChange(145)"
           placeholder="请选择" style="width:200px;">
            <el-option
              v-for="item in typelist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              
            ></el-option>
          </el-select>
          <!-- <span class="btn-explain" @click="openExplain()" v-if="addP145Data.p_type == 4">
              说明:
              <svg-icon icon-class="wenhao" />
            </span> -->
        </el-form-item>
        <el-form-item label="点位类型" prop="p_type" v-if="wellDetail.well_type == 1">
          <el-select v-model="addP145Data.p_type"
          @change="currStationChange(145)" placeholder="请选择" style="width:200px;">
            <el-option
              v-for="item in typelist1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上报时间" prop="time" >
          <el-date-picker
            v-model="addP145Data.time"
            type="datetime"
            placeholder="选择日期时间"
            style="width:200px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="点位数据" prop="p144_data">
          <el-input
            ref="145input"
            v-model="addP145Data.p144_data"
            type="textarea"
            :rows="12"
            onkeyup="value=value.replace(/[\u4E00-\u9FA5]|[A-Za-z]/g,'')"
            placeholder="点位数据之间用英文逗号隔开"
          ></el-input>
        </el-form-item>

        <div class="btn">
          <router-link to="point-position" class="viewPoint"><el-link :underline="false" style="color:#0000FF;font-size:12px;">点位表格</el-link></router-link>
          <el-button type="primary" @click="submitData('addP145Data')">创建</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 添加提示（添加载荷力时显示） -->
     <el-dialog title="说明" :visible.sync="explainVisible" width="365px">
            <div style="font-size:14px">
              <div style="font-weight:bold;padding-bottom:5px">
                1&nbsp;载荷力添加之后，请添加与载荷力对应的位移
              </div>
              <div style="font-weight:bold">
                2&nbsp;位移的时间与载荷力的时间一致
              </div>
            </div>
          </el-dialog>
  </div>
</template>
<script>
import { ApiGetRealdata } from "@/api/realdata";
import { ApiGetWellList } from "@/api/wellList";
import {
  getWellDetail,
  ApiSysEfficiency,
  ApiAddData,
  ApiDelManualData
} from "@/api/welldetail";
import { ApiGetElectdata , ApiGetNewestRealdata} from "@/api/realdata";
import LineChart from "@/components/ECharts/LineMarker";
import { postToStorage } from "@/api/electricParamater";
import dayjs from "dayjs";
export default {
  components: {
    LineChart
  },
  data() {
    return {
      rules:{
        p_type:[
          {
            required: true,
            trigger: 'blur',
            message:'请输入点位类型' 
          }
        ],
        time:[
          {
            required:true,
            trigger:'blur',
            message:'请输入上报时间'
          }
        ],
        p144_data:[
          {
            required:true,
            trigger:'blur',
            message:'请输入点位数据'
          }
        ]
      },
      explainVisible:false,
      lineid: "",
      realdata: [],
      manualType: "",
      value: "",
      wellname: [],
      wellid: [],
      wellDetail: [],
      realDetail:{},
      wellList: [],
      id: "",
      list: [],
      datatype: 0,
      reset: false,
      sysEfficiency: [],
      dialogShow: false,
      dialogShow1: false,
      addData: {},
      addP145Data: {},
      eletime: "",
      worktime: "",
      P144data: [],
      typelist: [
        {
          value: "1",
          label: "位移"
        },
        {
          value: "2",
          label: "有功"
        },
        {
          value: "3",
          label: "电流 "
        },
        {
          value: "4",
          label: "载荷力"
        },
        {
          value: "5",
          label: "扭矩因数"
        },
        // {
        //   value: "6",
        //   label: "电参力"
        // }
      ],
      typelist1: [
        {
          value: "2",
          label: "有功"
        },
        {
          value: "3",
          label: "电流 "
        }
      ],
      manual: "",
      workid: "",
      x_list: [],
    };
  },
  mounted() {
    this.GetRealdata();
  },

  methods: {
    // 保证添加145/200点位时，点位类型选择不同时，对应的点位数据聚焦
    currStationChange(type){
      if(type == 145){
        this.$nextTick(()=>{ 
          this.$refs['145input'].focus()
        })
      }else{
        this.$nextTick(()=>{ 
          this.$refs['200input'].focus()
        })
      }
    },
    // 打开提示
    openExplain() {
      this.explainVisible = true;
    },
    openDialog() {
      this.dialogShow = true;
    },
    openDialog1() {
      this.dialogShow1 = true;
    },
    openEle_force() {
      this.dialogShowEle = true;
    },
    //添加145
    submitData(addP145Data) {
      this.$refs['addP145Data'].validate((valid)=>{
        if(valid){
              function dataFormat(dateVal) {
                return dayjs(dateVal).format("YYYYMMDDHHmmss");
              }
              const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              // setTimeout(() => {
              //   this.tableLoading = true
              // }, 300);
              if (this.addP145Data.p_type != 6) {
                  let params = {};
                  params = {
                    well_id: this.id,
                    p_type: this.addP145Data.p_type,
                    p144_data: this.addP145Data.p144_data,
                    time: dataFormat(this.addP145Data.time),
                    data_type: "0"
                  };

                  ApiAddData(params).then(({ data }) => {
                    if (data.status === 0) {
                      this.$message.success(data.msg);
                      // this.addP145Data = {}
                      this.addP145Data.p144_data = ""
                      this.reGetElectdata();
                      // this.dialogShow1 = false;
                      this.$refs['145input'].focus()
                    } else {
                      this.$message.error(data.msg);
                      this.reGetElectdata();
                    }
                    loading.close();
                  });
              } else if (this.addP145Data.p_type == 6) {
                    let params = {};
                    params = {
                        well_id: this.id,
                        data_src: "0",
                        point_number: "145",
                        adjustment_electrical_force: this.addP145Data.p144_data,
                        date: dataFormat(this.addP145Data.time),
                    };
                    postToStorage(params).then(({ data }) => {
                    if (data.status === 0) {
                        this.$message.success(data.msg);
                        this.dialogShow1 = false;
                    } else {
                        this.$message.error(data.msg);
                    }
                  });
            }
        }
      });
     
    },
    //添加200
    submitForm(addData) {
      this.$refs['addData'].validate((valid)=>{
        if(valid){
            function dataFormat(dateVal) {
              return dayjs(dateVal).format("YYYYMMDDHHmmss");
            }
            this.tableLoading = true
            this.tableLoadingText = "数据加载中..."
            if (this.addData.p_type != 6) {
                let params = {};
                params = {
                well_id: this.id,
                p_type: this.addData.p_type,
                p144_data: this.addData.p144_data,
                time: dataFormat(this.addData.time),
                data_type: "1"
              };

              ApiAddData(params).then(({ data }) => {
                if (data.status === 0) {
                    this.$message.success(data.msg);
                    this.reGetElectdata();
                    // this.addData = {}
                    this.addData.p144_data = ""
                    this.tableLoading = false;
                    // this.dialogShow = false;
                    this.$refs['200input'].focus()
                } else {
                    this.$message.error(data.msg);
                    this.reGetElectdata();
                }
              });
            } else if (this.addData.p_type == 6) {
                let params = {};
                params = {
                    well_id: this.id,
                    data_src: "0",
                    point_number: "200",
                    adjustment_electrical_force: this.addData.p144_data,
                    date: dataFormat(this.addData.time),
                };
                postToStorage(params).then(({ data }) => {
                    if (data.status === 0) {
                    this.$message.success(data.msg);
                    this.dialogShow1 = false;
                  } else {
                    this.$message.error(data.msg);
                  }
                });
            }
        }
      });
    },
    //删除手动添加的点位数据
    delManualData() {
      this.$confirm("确定要删除此条手动添加的点位数据？", "注意", {
        confirmButtonText: "删除",
        concelButtonText: "取消",
        type: "warning"
      }).then(() => {
        ApiDelManualData({
          method: "delete",
          id: this.lineid
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.reGetElectdata();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    delworkData() {
      this.$confirm("确定要删除此条手动添加的点位数据？", "注意", {
        confirmButtonText: "删除",
        concelButtonText: "取消",
        type: "warning"
      }).then(() => {
        ApiDelManualData({
          method: "delete",
          id: this.workid
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.reGetElectdata();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    getWellDetails() {
      this.id = this.value;
      getWellDetail({ wellid: this.id, welldetail: "" }).then(({ data }) => {
        this.wellDetail = data.msg;
        this.getNewestRealData();
        this.getEleChart();
        this.getSysEfficiency();
        // this.submitForm()
      });
    },
    getSysEfficiency() {
      ApiSysEfficiency({ wellid: this.id }).then(({ data }) => {
        this.sysEfficiency = data.msg;
      });
    },

    //获取最新的实时数据
    getNewestRealData(){
      ApiGetNewestRealdata({wellid:this.id}).then(res=>{
            if(res.data.realdata.length){
               this.realDetail = res.data.realdata[0];
            }else{
              this.realDetail = {};
            }
      });
    },
    //电流和有功曲线图
    getEleChart() {
      ApiGetElectdata({
        id: this.id,
        p_type: "3",
        // json: "",
        data_type: this.datatype
      }).then(res => {
        this.list = res.data;
        if (this.reset == false) {
          if (this.list.data_type == 1) {
            this.datatype = 1;
            this.number = 200;
          } else {
            this.datatype = 0;
            this.number = 145;
          }
        } else {
          if (this.datatype == 0) {
            this.number = 145;
          } else {
            this.number = 200;
          }
        }
        this.P144data = res.data.datas;
        this.eletime = res.data.time;
        this.manualType = res.data.manual;
        this.lineid = res.data.id;
        this.x_list = [];
        for (let i = 1; i <= this.number; i++) {
          this.x_list.push(i);
        }
        if (this.datatype == 0) {
          this.splitLine1 = 144;
        } else {
          this.splitLine1 = 199;
        }
        let mydatatype = this.datatype;
        let times = 1;
        let customOption = {
          title: {
            text: "电流A"
          },
          grid: {
            left: "6%"
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
                posY = 5;
              } else {
                //上边放得下
                posY = y - boxHeight;
              }
              return [posX, posY];
            }
          },
          xAxis: {
            type: "category",
            data: this.x_list,
            splitLine: { show: false },
            //  interval: this.interval,
            name: "点数",
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
                  if (value % 12 == 1) {
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

            //       min: 1
          },
          yAxis: {
            type: "value",
            // name: "安培",
            axisLabel: {
              fontSize: 14
            }
          },
          series: [
            {
              data: this.P144data,
              type: "line",
              smooth: true,
              symbol: "none",
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
                  }
                ]
              }
            }
          ]
        };
        this.$refs["ele-chart"].initChart(customOption);
      });
      ApiGetElectdata({
        id: this.id,
        p_type: "2",
        // json: "",
        data_type: this.datatype
      }).then(res => {
        if (this.reset == false) {
          if (res.data.data_type == 1) {
            this.datatype = 1;
            this.number = 200;
          } else {
            this.datatype = 0;
            this.number = 145;
          }
        } else {
          if (this.datatype == 0) {
            this.number = 145;
          } else {
            this.number = 200;
          }
        }
        this.P144data = res.data.datas;
        this.manual = res.data.manual;
        this.workid = res.data.id;
        this.worktime = res.data.time;

        this.x_list = [];
        for (let i = 1; i <= this.number; i++) {
          this.x_list.push(i);
        }
        if (this.datatype == 0) {
          this.splitLine1 = 144;
        } else {
          this.splitLine1 = 199;
        }
        let mydatatype = this.datatype;
        let times = 1;
        let customOption = {
          title: {
            text: "有功Kw"
          },
          grid: {
            left: "6%"
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
                posY = 5;
              } else {
                //上边放得下
                posY = y - boxHeight;
              }
              return [posX, posY];
            }
          },
          xAxis: {
            type: "category",
            splitLine: { show: false },
            data: this.x_list,
            name: "点数",
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
                  if (value % 12 == 1) {
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
            //  min: 1
          },
          yAxis: {
            type: "value",
            // name: "有功",
            axisLabel: {
              fontSize: 14
            }
          },
          series: [
            {
              data: this.P144data,
              type: "line",
              smooth: true,
              symbol: "none",
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
                  }
                ]
              }
            }
          ]
        };
        this.$refs["work_chart"].initChart(customOption);
      });
    },
    GetRealdata() {
      ApiGetWellList({ page: 1, pagenum: 100 }).then(res => {
        this.wellList = res.data.msg.well_list;
        this.wellid = res.data.msg.well_list.map(item => {
          return item.id;
        });
        
        this.value = this.wellid[0];
        this.getWellDetails();
      });
    },
    //重新获取电流数据
    reGetElectdata() {
      this.reset = true;
      this.getEleChart();
    }
  },
  created() {}
};
</script>
<style lang="scss" scoped>
#realtimedata {
  .header-top {
    position: relative;
    display: flex;
    // align-items: center;
    //  justify-content: center;
    margin-left: 80px;
    bottom: -25px;
    z-index: 100;
    height: 28px;
  }
  // background-color: #f4f5f5;
  .manual {
    //  margin-left: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 5px;
  }
  .manual2 {
    //  margin-left: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 5px;
  }
  .tap-time {
    display: flex;
  }
  .row-bg {
    align-items: center;
  }
  .col-bg {
    padding: 5px 2px 0 45px;
  }
  .btn {
    text-align: right;
  }
  .realdata-title {
    display: flex;
    justify-content: center;
    .title-text {
      font-weight: bold;
      font-size: 20px;
    }
  }
  .realdata-header {
    margin: 10px;
  }
  .realdata-chart {
    margin: 10px;
    .elechart {
      height: 350px !important;
      padding-top: 0px !important;
      // width: 570px !important;
    }
  }
  .chart-title {
    font-weight: bold;
  }
  .chart {
    padding-top: 10px;
  }
  .viewPoint {
    margin-left:10px;
    border-bottom:1px solid #0000FF;
  }
}
</style>