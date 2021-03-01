<template>
  <div id="diagSubmit">
    <div class="submit-title">
      <div class="title-text">诊断种类确认界面</div>
    </div>
    <div class="submit-header">
      <el-card shadow="never">
        <el-row class="row-bg">
          <el-col :lg="5">
            井名：
            <el-select
              class="select"
              filterable
              v-model="wellId"
              style="width:130px;"
              placeholder="请选择"
              @change="getWellDetails()"
            >
              <el-option
                v-for="(item,index) of pumpList"
                :key="index"
                :label="item.name"
                :value="item.wellid"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :sm="6" :lg="6" class="col-bg">时间：{{time|dateTimeFormat}}</el-col>
          <el-col :sm="6" :lg="6" class="col-bg">
            <div v-if="wellDetail.well_type == 0">油井类别：抽油机</div>
            <div v-if="wellDetail.well_type == 1">油井类别：螺杆泵</div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="submit-footer">
      <el-row>
        <div class="type-card">
          <el-row :gutter="10">
            <el-col :lg="14" :sm="14">
              <el-card shadow="never" :body-style="{overflowY:'scroll',height:'340px'}" style="height:400px">
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
            </el-col>
            <el-col :lg="10" :sm="10">
              <el-card shadow="never" :body-style="{overflowY:'scroll',height:'340px'}" style="height:400px">
                <template slot="header" type="flex">
                  <span class="title">处置过程</span>
                </template>
                <handleProcess ref="handleProcess" 
                :processList="processList"
                :auth="auth" 
                :show="show"
                @getHistoryAlarm="getHistoryAlarm"/>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <div class="type-footer">
          <el-row>
            <el-col>
              <el-button v-if="this.auth==true" type="primary" style="margin-left:10px" @click="saveSubmit()" :disabled="multipleSelection == ''">诊断存储确认</el-button>
            </el-col>
          </el-row>
        </div>
      </el-row>
    </div>
    <div style="margin-top:50px"></div>
  </div>
</template>
<script>
import { ApiGetRealdata } from "@/api/realdata";
import { getWellDetail } from "@/api/welldetail";
import handleProcess from "@/views/components/handleProcess"
import diagTypeSel from "@/views/dataCurve/components/diagTypeSel"
import {
  ApiHistoryAlarm
} from "@/api/alarmManagement";
import {
  ApiTypeDeter,
  ApiAlarmAuth,
  ApiDiagQuery
} from "@/api/alarmManagement";
export default {
  name: "diagSubmit",
  components: {
    handleProcess,
    diagTypeSel
  },
  data() {
    return {
      wellId: "",
      pumpList: [],
      wellDetail: [],
      id: 0,
      date: "",
      multipleSelection: [],
      auth:false,
      checkedTypes: [], //已选择的诊断种类
      indexType:[],  //诊断索引和种类
      diagBool: [],  //是否存在该诊断（true或者false）
      diagId: [],    //诊断种类Id
      show:false,
      diagTitle:"",
      handleStatus:[],
      time:[],
      date:[],
      processList:[],
      welltype:0,
      belong:1  //查询诊断种类时发送给后端的油井类别
    };
  },
  methods: {
    //获取权限
    getAuth() {
      ApiAlarmAuth({ auth: "" }).then(({ data }) => {
        this.auth = data.msg.can_manage_ctlwarning;
      });
    },
    //获取井的列表
    getWellList() {
      ApiGetRealdata({ realdata: "", pagenum: 100 }).then(({ data }) => {
        this.pumpList = data.realdata;
        let wellid = [];
        wellid = this.pumpList.map(item => {
          return item.wellid;
        });
        this.wellId = wellid[0];
        this.getWellDetails();
      });
    },
    //获取井的详情
    getWellDetails() {
      this.arr4 = [];
      this.id = this.wellId;
      getWellDetail({wellid: this.id, welldetail: "" }).then(({ data }) => {
        this.wellDetail = data.msg;
        this.welltype = this.wellDetail.well_type
        if(this.welltype == 0){
          this.belong = 2
        }else{
          this.belong = 1
        }
        this.getHistoryAlarm(); //诊断确认调用处置过程这个子组件的获取历史告警的方法
        this.save()
      });
    },
    save() {
      ApiDiagQuery({ id: this.wellId,belong:this.belong}).then(({ data }) => {
        let diagList = data.msg;
        this.checkedTypes = []
        this.indexType = []
        this.diagBool = []
        this.diagId = []
        for (let i = 0; i < diagList.length; i++) {
          let object ={
            index:diagList[i][0],
            type:diagList[i][1]
          }
          this.indexType.push(object)
          if(diagList[i][2] == true){
            this.checkedTypes.push(diagList[i][1])
          }
          this.diagBool.push(diagList[i][2]);
          this.diagId.push(diagList[i][3]);
        }
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
    },
    //历史告警
    getHistoryAlarm() {
      this.diagTitle = "";
      let id = [];
      let title = [];
      let time = [];
      this.date = []
      this.handleStatus = [];
      ApiHistoryAlarm({
        id: this.wellId,
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
            if (this.handleStatus[i] == 0) {
              diagTitle.push(title[i]);
              this.diagTitle = String(diagTitle);
            }
          }
          this.warning_id = id[0];
        } else {
          this.warning_id = "";
        }
      });
    },
    transferPass(check,multiple){
      this.checkedTypes = check
      this.multipleSelection = multiple
      console.log(this.checkedTypes)
      console.log(this.multipleSelection)
    }
  },
  created() {
    this.getWellList();
  },
   mounted() {
    this.getAuth();
  },
};
</script>
<style lang="scss">
#diagSubmit {
  font-size: 14px;
  .submit-title {
    display: flex;
    justify-content: center;
    .title-text {
      font-weight: bold;
      font-size: 20px;
    }
  }
  .submit-header {
    margin: 10px;
  }
  .submit-footer {
    margin-top: 20px;
  }
  .footer-row-bg {
    margin-left: 15px;
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
}
</style>