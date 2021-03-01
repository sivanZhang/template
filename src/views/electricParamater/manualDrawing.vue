<template>
  <div id="manualDrawing">
    <div v-if="type==1">
      <div class="manual-title">
        <div class="title-text">手动绘制电参数示功图界面</div>
      </div>
    </div>
    <div v-if="type ==2">
      <div class="manual-title">
        <div class="title-text">自动绘制电参数示功图界面</div>
      </div>
    </div>
    <!-- <electricParames
      ref="electricParames"
      :type="type"
      @getWellId="getWellId"
      @getTimesValue="getTimesValue"
      @getWellPoint="getWellPoint"
    /> -->
     <div>
    <!-- <div class="el-header">
      <el-row class="row-bg">
        <el-col :sm="2" class="col-bg">密码2：</el-col>
        <el-col :sm="3">
          <el-input placeholder="请输入密码" v-model="input" show-password></el-input>
        </el-col>
        <el-col :sm="2" class="col-bg">
          <div v-if="type==1">手动：</div>
          <div v-if="type==2">自动：</div>
        </el-col>
        <el-col :sm="3">
          <el-input v-model="input"></el-input>
        </el-col>
        <el-col :sm="2" class="col-bg">操作者：</el-col>
        <el-col :sm="3">
          <el-input v-model="input"></el-input>
        </el-col>
      </el-row>
    </div>-->
    <div class="body-main">
      <div class="el-body">
        <div class="body-header">
          <div class="body-header-row">
            <el-row class="row-bg-top">
              <el-col :lg="5">
                井名&nbsp;:&nbsp;
                <el-select
                  v-model="wellid"
                  filterable
                  style="width:150px;"
                  placeholder="请选择"
                  @change="getWellParamers(1)"
                >
                  <el-option
                    v-for="(item,index) of wellList"
                    :label="item.name"
                    :value="item.wellid"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :lg="9" >时间：
                <el-date-picker
                    class="datePicker"
                    v-model="datePicker"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
              </el-col>
              <!-- <el-col
                :lg="8"
                class="col-bg"
              >时间&nbsp;:&nbsp;{{startdate|dateTimeFormat}}&nbsp;&nbsp;至&nbsp;&nbsp;{{enddate|dateTimeFormat}}</el-col> -->
              <el-col :lg="4" class="col-bg">
                <div v-if="welltype == 0">油井类别&nbsp;:&nbsp;抽油机</div>
                <div v-if="welltype == 1">油井类别&nbsp;:&nbsp;螺杆泵</div>
              </el-col>
              <el-col :lg="4">
                点数&nbsp;:
                <el-select
                  v-model="wellpoint"
                  filterable
                  style="width:80px;"
                  placeholder="请选择"
                  @change="getWellParamers(2)"
                >
                  <el-option
                    v-for="item in wellPointList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="body-middle">
          <div class="body-middle-row">
            <el-row class="row-bg">
              <el-col :lg="4" class="col-bg">
                <div>机型&nbsp;:&nbsp;{{wellDetail.motor_type}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <!-- 目前前端先写死，因为后端没返回值 -->
                <div>顺时针运行</div>
                <!-- <div v-if="wellDetail.run_status==1">顺时针运行</div>
                <div v-if="wellDetail.run_status==0">逆时针运行</div> -->
              </el-col>

              <el-col :lg="5" class="col-bg">
                <div>大平衡块数&nbsp;:&nbsp;{{wellDetail.num_big_balance}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <div>小平衡块数&nbsp;:&nbsp;{{wellDetail.num_small_balance}}</div>
              </el-col>
            </el-row>
            <el-row class="row-bg">
              <el-col :lg="7" class="col-bg">
                <div>大平衡块尺寸1(m)&nbsp;:&nbsp;{{wellDetail.size_1_big_balance}}</div>
              </el-col>
              <el-col :lg="7" class="col-bg">
                <div>大平衡块尺寸2(m)&nbsp;:&nbsp;{{wellDetail.size_2_big_balance}}</div>
              </el-col>
              <el-col :lg="7" class="col-bg">
                <div>小平衡块尺寸1(m)&nbsp;:&nbsp;{{wellDetail.size_1_small_balance}}</div>
              </el-col>
            </el-row>
            <el-row class="row-bg">
              <el-col :lg="7" class="col-bg">
                <div>小平衡块尺寸2(m)&nbsp;:&nbsp;{{wellDetail.size_2_small_balance}}</div>
              </el-col>
              <el-col :lg="7" class="col-bg">
                <div>曲柄尺寸(m)&nbsp;:&nbsp;{{wellDetail.size_1_crank}}</div>
              </el-col>
              <el-col :lg="7" class="col-bg">
                <div>大平衡块重量(Kn)&nbsp;:&nbsp;{{wellDetail.weight_1_big_balance}}</div>
              </el-col>
            </el-row>
            <el-row class="row-bg">
              <el-col :lg="4" class="col-bg">
                <div>小平衡块重量(Kn)&nbsp;:&nbsp;{{wellDetail.weight_1_small_balance}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <div>曲柄重量(Kn)&nbsp;:&nbsp;{{wellDetail.weight_1_crank}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <div>曲柄销重量(Kn)&nbsp;:{{wellDetail.crank_pin_weight}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <div>偏置角&nbsp;:&nbsp;{{wellDetail.offset_angle}}</div>
              </el-col>
            </el-row>
            <el-row class="row-bg">
              <el-col :lg="4" class="col-bg">
                <div>冲程(米)&nbsp;:&nbsp;{{wellDetail.stroke}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <div>冲次(次/分)&nbsp;:&nbsp;{{wellDetail.rush_times}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                叠加有功次数&nbsp;:
                <el-select
                  v-model="addTimesValue"
                  placeholder="请选择"
                  style="width:80px;"
                  filterable
                  @change="getWellParamers(3)"
                >
                  <el-option
                    v-for="item in addTimesList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :sm="4" class="col-bg">
                <div>结构不平衡重(Kn)&nbsp;:&nbsp;&nbsp;</div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
    <div v-if="type==1">
      <manualTable
        ref="manualTable"
        :type="type"
        :wellid="wellid"
        :addTimesValue="addTimesValue"
        :wellpoint="wellpoint"
        :parameter='parameter'
        :datePicker='datePicker'
      />
    </div>
    <div v-if="type==2">
      <automaticTable
        ref="automaticTable"
        :type="type"
        :wellid="wellid"
        :addTimesValue="addTimesValue"
        :wellpoint="wellpoint"
        :parameter='parameter'
        :datePicker='datePicker'
      />
    </div>
    <div style="margin-top:50px"></div>
  </div>
  
</template>
<script>
// import electricParames from "./components/electric-parames";
import manualTable from "./components/manual-table";
import automaticTable from "./components/automatic-table";
import { ApiGetRealdata } from "@/api/realdata";
import { getAddMutipleActive } from "@/api/electricParamater";
import { getWellDetail } from "@/api/welldetail";
import dayjs from "dayjs";
export default {
  data() {
    return {
      type: this.$route.query.type,
      parameter:[],
      wellList: [],
      wellid: "",
      wellpoint: "145",
      startdate: "",
      enddate: "",
      welltype: '', //油井类别，暂为螺杆泵 ,全部：-1 , 0 # 抽油机, 1 # 螺杆泵
      input: "",
      addTimesValue: "1", //叠加有功次数
      wellPointList: [{ value: "145" }, { value: "200" }],
      addTimesList: [],
      wellDetail: [],
      datePicker: [new Date(new Date().setHours(0, 0, 0, 0)).getTime(), new Date().getTime()],
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },

    };
  },
  components: {
    // electricParames,
    manualTable,
    automaticTable
  },
  created() {
    this.GetRealdata();
  //   function timeDateFormat(date) {
  //     if (date) {
  //   date = date
  //   return dayjs(date).format('YYYY/MM/DD HH:mm')
  // } else {
  //   return ''
  // }
  //   }
  //   console.log("3333333333333")
  //   console.log(timeDateFormat(this.datePicker[0]))
  //   console.log(timeDateFormat(this.datePicker[1]))
  },
  methods: {
    
    // 获取井号的列表
    GetRealdata() {
      ApiGetRealdata({
        realdata: "",
        pagenum: "100"
      }).then(({ data }) => {
        if(data.realdata.length !=0){
          this.wellList = data.realdata;
          this.wellList=this.wellList.filter(item=>item.welltype!=="螺杆泵");//去掉螺杆泵的井号
          let wellid = this.wellList.map(item => {
            return item.wellid;
          });
          this.wellid = wellid[0];
          this.getWellParamers();
          this.AddMutipleActive();
          this.getWellDetails();
        }
      });
    },
    // 获取井的详细信息
    getWellDetails(){
      getWellDetail({ wellid: this.wellid, welldetail: ""}).then(({ data })=>{
        this.wellDetail = data.msg;
        this.welltype = data.msg.well_type;
        this.parameter.push(data.msg)
      })
       
    },
    // 获取最高可叠加次数以及叠加起止日期
    AddMutipleActive() {
      getAddMutipleActive({ id: this.wellid }).then(({ data }) => {
        this.startdate = data.msg.startdate;
        this.enddate = data.msg.enddate;
        // this.addTimesValue = data.msg.times
        for (var i = 1; i <= data.msg.times; i++) {
          this.addTimesList.push({ value: i });
        }
      });
    },
    getWellParamers(type) {
      //选择井号
      if (type == 1) {
        this.getWellDetails();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#manualDrawing {
  .manual-title {
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
    .title-text {
      font-weight: bold;
      font-size: 20px;
    }
  }
  .el-header {
  margin-top: 10px;
  padding: 0;
}
.body-main {
  margin: 0 30px;
}
.body-header {
  border: 0.5px solid rgb(230, 230, 230);
}
.body-middle {
  border-left: 0.5px solid rgb(230, 230, 230);
  border-right: 0.5px solid rgb(230, 230, 230);
  border-bottom: 0.5px solid rgb(230, 230, 230);
}
.body-header-row {
  margin: 10px 20px;
}
.body-middle-row {
  margin: 0 30px 10px 30px;
  padding-top: 10px;
}
.row-bg-top {
    align-items: center;
    padding: 10px;
}
.row-bg {
  padding-bottom: 10px;
}
.col-bg {
  padding: 5px 0 0 0;
}
.datePicker{
    width: 330px;
  }

}
</style>