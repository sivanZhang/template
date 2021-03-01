<template>
  <div id="systemAlarm">
    <div class="alarm-title">
      <div class="title-text">系统告警界面</div>
    </div>
    <div class="alarm-header">
      <el-card shadow="never">
        <el-row>
          <el-col :lg="5">
            井名：
            <el-select class="select" v-model="wellId" style="width:130px;" filterable placeholder="请选择" @change="getWellDetails()">
              <el-option
                v-for="(item,index) in wellList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :sm="5" :lg="5" class="col-bg">时间：{{wellDetail.changed_date|dateTimeFormat}}</el-col>
          <el-col :sm="6" :lg="6" class="col-bg">
            <div v-if="wellDetail.well_type == 0">油井类别：抽油机</div>
            <div v-if="wellDetail.well_type == 1">油井类别：螺杆泵</div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="alarm-container">
      <el-card shadow="never" :body-style="{overflowY:'scroll',height:'340px'}" style="height:400px">
        <template slot="header" type="flex">
          <span class="title">诊断种类选择</span>
        </template>
        <div>
          <el-checkbox-group v-model="checkedTypes" @change="handleCheckedTypesChange">
            <el-row class="row-bg">
              <el-checkbox 
                v-for="(item,index) of diagTypes" 
                :label="item" :key="index" 
                style="width:350px;margin-top:20px"
              >{{index+1}}. {{item}}</el-checkbox>
            </el-row>
          </el-checkbox-group>
        </div>
      </el-card>
    </div>
    <div class="alarm-footer">
      <el-row>
        <el-col>
          <el-button type="primary" style="margin-left:10px" @click="saveSubmit()" v-if="auth">确认存储</el-button>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top:50px"></div>
  </div>
</template>
<script>
import { ApiGetRealdata } from "@/api/realdata";
import { getWellDetail } from "@/api/welldetail";
import{ ApiGetWellList } from"@/api/wellList"
import { ApiDiagQuery,ApiTypeDeter,ApiAlarmAuth} from "@/api/alarmManagement";
export default {
  data() {
    return {
      wellId: "",
      wellList: [],
      wellDetail: [],
      indexType:[],   //诊断索引和种类
      id:"",
      checkedTypes: [],   //已选择的诊断种类
      diagTypes:[],      //诊断种类名称
      multipleSelection: [],
      auth: "",
      welltype:0,    //油井类别
      belong:1       //查询诊断种类时发送给后端的油井类别
    };
  },
  methods: {
     //获取权限
    getAuth() {
      ApiAlarmAuth({ auth: "" }).then(({ data }) => {
        this.auth = data.msg.can_manage_ctlwarning;
      });
    },
    GetWellList(){
      ApiGetWellList({page:1,pagenum:100}).then(res=>{
          this.wellList= res.data.msg.well_list;
          let wellid = this.wellList.map(item => {
            return item.id;
          });
          this.wellId = wellid[0];
          this.getWellDetails();
      });
      /*
      ApiGetRealdata({ realdata: "", page: 1, pagenum: 100 }).then(({data}) => {
        this.wellList = data.realdata;
        let wellid = data.realdata.map(item => {
          return item.wellid;
        });
        this.wellId = wellid[0];
        this.getWellDetails();
      });*/
    },
    getWellDetails() {
      this.id = this.wellId;
      getWellDetail({ wellid: this.id, welldetail: ""}).then(({ data }) => {
        this.wellDetail = data.msg;
        this.welltype = this.wellDetail.well_type
        if(this.welltype == 0){
          this.belong = 2
        }else{
          this.belong = 1
        }
        this.save()
      });
    },
    save(){
      ApiDiagQuery({ id:this.wellId,belong:this.belong}).then(({ data }) => {
        this.arr = data.msg
        let diagList = data.msg
        this.diagTypes = []
        this.checkedTypes = []
        for(let i = 0;i < diagList.length;i++){
          let object ={
            index:diagList[i][0],
            type:diagList[i][1]
          }
          this.indexType.push(object)
          if (diagList[i][1] != '参数正常'){
              this.diagTypes.push(diagList[i][1])
              if(diagList[i][2] == true  ){
                this.checkedTypes.push(diagList[i][1])
              }
          } 
        }
      })
    },
    //诊断存储确定
    saveSubmit() {
      const categories = this.multipleSelection.join(",");
      ApiTypeDeter({ well_id: this.id, categories: categories }).then(
        ({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.getWellDetails()
          } else {
            this.$message.error(data.msg);
          }
        }
      );
    },
    //点击复选框
    handleCheckedTypesChange(value) {
      this.multipleSelection = []
      for(let i = 0; i < value.length; i++){
        for(let j = 0 ; j < this.indexType.length; j ++){
          if(value[i] == this.indexType[j].type){
            this.multipleSelection.push(this.indexType[j].index)
          }
        }
      }
    }
  },
  created() {
    this.getAuth();
    this.GetWellList()
  }
};
</script>
<style lang="scss">
#systemAlarm {
  height: 100%;
  font-size: 14px;
  .alarm-title {
    display: flex;
    justify-content: center;
    .title-text {
      font-weight: bold;
      font-size: 20px;
    }
  }
  .alarm-header {
    margin: 10px;
  }
  .alarm-container {
    margin: 10px;
  }
  .row-bg {
    margin-left: 15px;
  }
  .col-bg-1 {
    padding: 5px 0 0 10px;
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