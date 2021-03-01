<template>
  <div id="suggestDiag">
    <div class="suggest-title">
      <div class="title-text">建议工况诊断查询界面</div>
    </div>
    <div class="suggest-header">
      <el-card shadow="never">
        <el-row>
          <el-col :lg="5">
            井名：
            <el-select 
              class="select" 
              v-model="wellId" 
              style="width:130px;"
              placeholder="请选择" 
              @change="getWellDetails()"
              filterable>
              <el-option
                v-for="(item,index) in wellList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <!-- <el-col :sm="6" :lg="6" class="col-bg">时间：{{wellDetail.changed_date|dateTimeFormat}}</el-col> -->
          <el-col :sm="6" :lg="6" class="col-bg">
            <div v-if="wellDetail.well_type == 0">油井类别：抽油机</div>
            <div v-if="wellDetail.well_type == 1">油井类别：螺杆泵</div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="suggest-container">
      <el-card shadow="never">
          <el-checkbox-group v-model="checkedTypes">
            <el-row class="row-bg">
              <el-checkbox 
                v-for="(item,index) of diagTypes" 
                :label="item" :key="index" 
                style="width:350px;margin-top:20px"
              >{{index+1}}. {{item}}</el-checkbox>
            </el-row>
          </el-checkbox-group>
      </el-card>
    </div>
    <div style="margin-top:50px"></div>
  </div>
</template>
<script>
import { ApiGetRealdata } from "@/api/realdata";
import { getWellDetail } from "@/api/welldetail";
import{ ApiGetWellList } from"@/api/wellList"
import { ApiDiagQuery } from "@/api/alarmManagement";
import dayjs from "dayjs";
export default {
  data() {
    return {
      wellId: "",
      wellList: [],
      wellDetail: [],
      id: "",
      checkedTypes: [], //已选择的诊断种类
      diagTypes:[],  //诊断种类名称
      indexType:[],  //诊断索引和种类
      diagBool: [],  //是否存在该诊断（true或者false）
      diagId: [],    //诊断种类Id
      welltype:0,    //油井类别
      belong:1       //查询诊断种类时发送给后端的油井类别
    };
  },
  methods: {
    getWellList() {
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
        let wellid = [];
        wellid = this.wellList.map(item => {
          return item.wellid;
        });
          this.wellId = wellid[0];
          this.getWellDetails();
      })*/
    },
    getWellDetails() {
      this.id = this.wellId;
      getWellDetail({wellid: this.id, welldetail: ""}).then(({ data }) => {
        this.wellDetail = data.msg;
        this.welltype = this.wellDetail.well_type
        if(this.welltype == 0){
          this.belong = 2
        }else{
          this.belong = 1
        }
        ApiDiagQuery({ id: this.wellId, belong:this.belong}).then(({ data }) => {
          let diagList = data.msg;
          this.diagTypes = []
          this.checkedTypes = []
          this.diagBool = []
          for (let i = 0; i < diagList.length; i++) {
            let object = {
              index:diagList[i][0],
              type:diagList[i][1]
            }
            this.indexType.push(object);
            this.diagTypes.push(diagList[i][1]);
            if(diagList[i][2] == true){
              this.checkedTypes.push(diagList[i][1]);
            }
            this.diagBool.push(diagList[i][2]);
            this.diagId.push(diagList[i][3]);
          }
        });
      });
    }
  },
  created() {
    this.getWellList();
  }
};
</script>
<style lang="scss">
#suggestDiag {
  height: 100%;
  font-size: 14px;
  .suggest-title {
    display: flex;
    justify-content: center;
    .title-text {
      font-weight: bold;
      font-size: 20px;
    }
  }
  .suggest-header {
    margin: 10px;
  }
  .suggest-container {
    margin: 10px;
  }
  .suggest-footer {
    margin-top: 180px;
  }
  .row-bg {
    margin-left: 15px;
    margin-top: 20px;
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