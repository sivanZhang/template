<template>
  <div id="pumpUnit">
    <div class="pump-title">
      <div class="title-text">数据曲线诊断中抽油机界面</div>
    </div>
    <div class="pump-header">
      <el-card shadow="never">
        <el-row class="row-bg">
          <el-col :lg="5">
            井名：
            <el-select
              class="select"
              filterable
              style="width:130px;"
              v-model="wellId"
              placeholder="请选择"
              @change="getWellDetails()"
            >
              <el-option
                v-for="(item,index) of pumpList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
         
          <el-col :sm="6" :lg="6" class="col-bg" style="margin-left:-60px;margin-top:-2px">油井类别：抽油机</el-col>
          <el-col :lg="5" style="margin-left:-80px;">
            点数：
            <el-select
              v-model="datatype"
              placeholder="请选择点位数"
              @change="reGetElectdata()"
              style="width:80px;"
              filterable
            >
              <el-option label="145" :value="0"></el-option>
              <el-option label="200" :value="1"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="pump-chart">
      <el-row :gutter="15">
        <el-col :lg="12">
          <el-card shadow="never" body-style="padding-bottom:0px;padding-left:5px;">
            <LineChart ref="ele-chart" chart-id="ele-chart" />
          </el-card>
        </el-col>
        <el-col :lg="12">
          <el-card shadow="never" body-style="padding-bottom:0px;padding-left:5px;">
            <LineChart ref="work-chart" chart-id="work-chart" />
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="pump-footer">
      <el-row>
        <el-col>
          <!-- <el-button type="primary" @click="showImage" style="margin-left:10px" v-if="this.homeEntry == false">典型示功图曲线</el-button>
          <el-button type="primary" v-if="this.homeEntry == false">周波曲线自动诊断</el-button>-->
          <el-button type="primary" @click="historyLine">历史曲线</el-button>
          <el-button type="primary" @click="typeSumbit()" v-if="this.auth == true">诊断种类确定</el-button>
        </el-col>
      </el-row>
      <el-row v-if="diagSumbit"></el-row>
      <el-row v-else>
        <div class="type-card">
          <el-card shadow="never" :body-style="{overflowY:'scroll',height:'260px'}" style="height:320px">
            <template slot="header" type="flex">
              <span class="title">诊断种类选择：<span style="color:red">(注:反选不能使诊断消失)</span></span>
            </template>
            <diagTypeSel
              :checkedTypes="checkedTypes"
              :diagBool="diagBool"
              :diagId="diagId"
              :indexType="indexType"
              :welltype="welltype"
              :auth="auth"
              :id="id"
              @transferPass="transferPass"
              ></diagTypeSel>
          </el-card>
        </div>
        <div class="type-footer">
          <el-row>
            <el-col>
              <el-button
                v-if="this.auth==true"
                type="primary"
                style="margin-left:10px"
                @click="saveSubmit()"
                :disabled="multipleSelection == ''"
              >诊断存储确认</el-button>
            </el-col>
          </el-row>
        </div>
      </el-row>
    </div>
    <div style="margin-top:50px"></div>
    <div>
      <el-dialog title="示功图分析与典型示功图" :visible.sync="dialogVisible" width="700px" top="1vh">
        <div class="dialog-middle">
          <el-carousel :interval="5000" arrow="always" style="height:450px">
            <el-carousel-item v-for="(item,index) in imageList" :key="index" style="height:450px">
              <img style="width:650px;height:450px" :src="item.url" alt />
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-dialog>
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
              >确定</el-button>
            </el-col>
          </el-row>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { ApiGetElectdata, ApiGetRealdata } from "@/api/realdata";
import { getWellDetail } from "@/api/welldetail";
import{ ApiGetWellList } from"@/api/wellList";
import {
  ApiTypeDeter,
  ApiAlarmAuth,
  ApiDiagQuery
} from "@/api/alarmManagement";
import LineChart from "@/components/ECharts/LineMarker";
import diagTypeSel from "./components/diagTypeSel";
export default {
  name: "pumpUnit",
  components: {
    LineChart,
    diagTypeSel
  },
  data() {
    return {
      etime:'',//电流曲线时间
      wtime:'',//有功曲线时间
      wellId: "",
      pumpList: [],
      wellDetail: [],
      diagSumbit: true,
      id: "",
      dialogVisible: false,
      history: false,
      datePicker: "",
      date: "",
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
      multipleSelection: [],
      index: "",
      auth: "",
      checkedTypes: [], //已选择的诊断种类
      indexType: [], //诊断索引和种类
      diagBool: [], //是否存在该诊断（true或者false）
      diagId: [], //诊断种类Id
      list: [],
      datatype: 0,
      number: 155,
      reset: false,
      P144data: [],
      time: "",
      x_list: [],
      p144data: [],
      length: 0,
      homeEntry: false,
      welltype:0,//油井类别(抽油机)
    };
  },
  methods: {
    //获取权限
    getAuth() {
      ApiAlarmAuth({ auth: "" }).then(({ data }) => {
        this.auth = data.msg.can_manage_ctlwarning;
      });
      if (this.$route.query.homeEntry) {
        this.homeEntry = true;
      } else {
        this.homeEntry = false;
      }
    },
    //获取井的列表
    getWellList() {
      ApiGetWellList({page:1,pagenum:100}).then(res=>{
          this.pumpList= res.data.msg.well_list;
          this.pumpList = this.pumpList.filter(item=>item.well_type !== 1);
          let wellid = this.pumpList.map(item => {
            return item.id;
          });
          if(this.pumpList.length !== 0){
            this.wellId = wellid[0];
            this.getWellDetails();
          }else{
            this.wellId = "";
          }
      });
      /*
      ApiGetRealdata({ realdata: "", well_type: 0, pagenum: 100 }).then(
        ({ data }) => {
          this.pumpList = data.realdata;
          let wellid = [];
          wellid = this.pumpList.map(item => {
            return item.wellid;
          });
          if (this.pumpList.length !== 0) {
            this.wellId = wellid[0];
            this.getWellDetails();
          } else {
            this.wellId = "";
          }
        }
      );*/
    },
    //获取井的详情
    getWellDetails() {
      this.id = this.wellId;
      getWellDetail({ wellid: this.id, welldetail: "" }).then(({ data }) => {
        this.wellDetail = data.msg;
        this.welltype = this.wellDetail.well_type
        if(this.welltype == 0){
          this.belong = 2
        }else{
          this.belong = 1
        }
      });
      this.save();
      this.getEleChart();
    },
    //获取电流曲线和有功曲线
    getEleChart() {
      //电流曲线
      ApiGetElectdata({
        id: this.id,
        p_type: "3",
        data_type: this.datatype
      }).then(({ data }) => {
        this.P144data = data.datas;

        this.time = data.time;
        if(typeof(this.time)==='undefined')
        {
          this.etime="";
        }
        else
        {
          this.etime=" ("+this.time+")";
        }
        this.x_list = [];
        if (this.reset == false) {
          if (data.data_type == 1) {
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
        for (let i = 1; i <= this.number; i++) {
          this.x_list.push(i);
        }
        // let array = []   //自定义一个二维数组，存储X轴和Y的值
        // if(JSON.stringify(data) == "{}"){ //判断data是否为空
        //   array = []
        // }else{
        //   for(let i = 0;i < this.x_list.length;i ++){
        //     array[i] = [this.x_list[i],this.P144data[i]]
        //   }
        // }
        if (this.datatype == 0) {
          this.splitLine1 = 144;
        } else {
          this.splitLine1 = 199;
        }
        let mydatatype = this.datatype;
        let times = 1;
        let eleInfo = {
          title: {
            text: "电流A"+this.etime
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
            boundaryGap: true,
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
            //     min:1,
            //  offset:4
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
        this.$nextTick(() => {
          this.$refs["ele-chart"].initChart(eleInfo);
        });
      });
      //有功曲线
      ApiGetElectdata({
        id: this.id,
        p_type: "2",
        data_type: this.datatype
      }).then(({ data }) => {
        this.P144data = data.datas;
        this.time = data.time;
        //判断时间是否为undefined
        if(typeof(this.time)==='undefined')
        {
          this.wtime="";
        }
        else
        {
          this.wtime=" ("+this.time+")";
        }
        this.x_list = [];
        if (this.reset == false) {
          if (data.data_type == 1) {
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
        for (let i = 1; i <= this.number; i++) {
          this.x_list.push(i);
        }
        // let array = []   //自定义一个二维数组，存储X轴和Y的值
        // if(JSON.stringify(data) == "{}"){ //判断data是否为空
        //   array = []
        // }else{
        //   for(let i = 0;i < this.x_list.length;i ++){
        //     array[i] = [this.x_list[i],this.P144data[i]]
        //   }
        // }
        if (this.datatype == 0) {
          this.splitLine1 = 144;
        } else {
          this.splitLine1 = 199;
        }
        let mydatatype = this.datatype;
        let times = 1;
        let workInfo = {
          title: {
            text: "有功Kw"+this.wtime
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
            data: this.x_list,
            type: "category",
            splitLine: { show: false },
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
            //    min:1,
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
        this.$nextTick(() => {
          this.$refs["work-chart"].initChart(workInfo);
        });
      });
    },
    //重新获取电流数据
    reGetElectdata() {
      this.reset = true;
      if (this.date == "") {
        this.getEleChart();
      } else {
        this.submitDate();
      }
    },
    //展示图片
    showImage() {
      this.dialogVisible = true;
    },
    //点击历史曲线按钮，选择时间
    historyLine() {
      // this.history = true;
      this.$router.push({
        name: "history-data",
        query: { id: this.wellId }
      });
    },
    //选择时间后展示历史曲线
    submitDate() {
      this.date = this.datePicker[0] + "-" + this.datePicker[1];
      //电流历史曲线
      ApiGetElectdata({
        id: this.id,
        p_type: "3",
        history: "",
        daterange: this.date
      }).then(({ data }) => {
        this.P144Data = data.msg.data;
        if (this.P144Data == "") {
          this.length = this.P144Data.length + 1;
        } else {
          this.length = this.P144Data.length;
        }
        if (this.reset == false) {
          if (data.data_type == 1) {
            this.datatype = 1;
            this.number = 210;
          } else {
            this.datatype = 0;
            this.number = 155;
          }
        } else {
          if (this.datatype == 0) {
            this.number = 155;
          } else {
            this.number = 210;
          }
        }
        let time = "";
        let x_list = [];
        let series = [];
        for (let j = 1; j <= this.number; j++) {
          x_list.push(j);
        }
        for (let i = 0; i < this.length; i++) {
          if (this.number == 155 && this.P144Data.length !== 0) {
            this.p144data = this.P144Data[i].datas;
            time = this.P144Data[i].time;
          } else {
            this.p144data = [];
            time = [];
          }
          let item = {
            name: time + "电流量",
            smooth: true, //光滑
            data: this.p144data,
            symbol: "none",
            type: "line"
          };
          series.push(item);
          let eleInfo = {
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
              name: "点数",
              data: x_list
            },
            yAxis: {
              type: "value",
              // name: "安培",
              axisLabel: {
                fontSize: 14
              }
            },
            series: series
          };
          this.$nextTick(() => {
            this.$refs["ele-chart"].initChart(eleInfo);
          });
        }
      });
      //有功历史曲线
      ApiGetElectdata({
        id: this.id,
        p_type: "2",
        history: "",
        daterange: this.date
      }).then(({ data }) => {
        this.P144Data = data.msg.data;
        if (this.P144Data == "") {
          this.length = this.P144Data.length + 1;
        } else {
          this.length = this.P144Data.length;
        }
        if (this.reset == false) {
          if (data.data_type == 1) {
            this.datatype = 1;
            this.number = 210;
          } else {
            this.datatype = 0;
            this.number = 155;
          }
        } else {
          if (this.datatype == 0) {
            this.number = 155;
          } else {
            this.number = 210;
          }
        }
        let time = "";
        let x_list = [];
        let series = [];
        for (let j = 1; j <= this.number; j++) {
          x_list.push(j);
        }
        for (let i = 0; i < this.length; i++) {
          if (this.number == 155 && this.P144Data.length !== 0) {
            this.p144data = this.P144Data[i].datas;
            time = this.P144Data[i].time;
          } else {
            this.p144data = [];
            time = [];
          }
          let item = {
            name: time + "有功",
            smooth: true, //光滑
            data: this.p144data,
            symbol: "none",
            type: "line"
          };
          series.push(item);
          let workInfo = {
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
              name: "点数",
              data: x_list
            },
            yAxis: {
              type: "value",
              // name: "有功",
              axisLabel: {
                fontSize: 14
              }
            },
            series: series
          };
          this.$nextTick(() => {
            this.$refs["work-chart"].initChart(workInfo);
          });
        }
      });
      this.history = false;
    },
    //诊断种类确定
    typeSumbit() {
      this.diagSumbit = false;
      this.save();
    },
    save() {
      ApiDiagQuery({ id: this.wellId,belong:this.belong}).then(({ data }) => {
        let diagList = data.msg;
        this.checkedTypes = [];
        this.diagBool = [];
        this.diagId = [];
        this.indexType = [];
        for (let i = 0; i < diagList.length; i++) {
          let object = {
            index: diagList[i][0],
            type: diagList[i][1]
          };
          this.indexType.push(object);
          if (diagList[i][2] == true) {
            this.checkedTypes.push(diagList[i][1]);
          }
          this.diagBool.push(diagList[i][2]);
          this.diagId.push(diagList[i][3]);
        }
        window.scrollTo(0, document.documentElement.clientHeight);
      });
    },
    //诊断存储确定
    saveSubmit() {
      const categories = this.multipleSelection.join(",");
      ApiTypeDeter({ well_id: this.id, categories: categories }).then(
        ({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.getWellDetails();
          } else {
            this.$message.error(data.msg);
          }
        }
      );
      this.multipleSelection = [];
      this.diagSumbit = true;
    },
    back() {
      this.diagSumbit = true;
    },
    transferPass(check,multiple){
      this.checkedTypes = check
      this.multipleSelection = multiple
    }
  },
  created() {
    this.getWellList();
  },
  mounted() {
    this.getAuth();
  },
  //该页面被激活时调用
  activated() {
    if (this.$route.query.homeEntry) {
      this.homeEntry = true;
    } else {
      this.homeEntry = false;
    }
  }
};
</script>
<style lang="scss">
#pumpUnit {
  font-size: 14px;
  .pump-title {
    display: flex;
    justify-content: center;
    .title-text {
      font-weight: bold;
      font-size: 20px;
    }
  }
  .pump-header {
    margin: 10px;
  }
  .pump-footer {
    margin-top: 20px;
  }
  .pump-chart {
    margin: 10px;
    .chart {
      height: 400px !important;
    }
  }
  .footer-row-bg {
    margin-left: 15px;
    margin-top: 20px;
  }
  .type-card {
    margin: 30px 10px;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: red;
    border-color: red;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: red;
  }
  .row-bg {
    margin-top: 5px;
    align-items: center;
  }
  .col-bg-1 {
    padding: 5px 2px 0 5px;
  }
  .col-bg {
    padding: 5px 2px 0 45px;
  }
  .el-button {
    width: 120px;
    height: 40px;
    margin-left: 10px;
  }
  .history-middle {
    margin: 10px 20px;
  }
  .datePicker {
    width: 250px;
  }
}
</style>