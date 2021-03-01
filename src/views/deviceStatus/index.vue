<template>
  <div id="deviceStatus">
    <div class="content" style="padding-bottom: 10px;">
      <el-row class="row-bg" type="flex" align="middle">
        <div>井名:</div>
        <el-col :span="4">
          <el-input v-model="wellNumber"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" class="button" @click="searchDeviceStatus()">点击查询</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="devicedata"
      stripe
      :border="true"
      style="width: 100%;"
      :max-height="tableHeight"
      :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
      :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400}"
    >
      <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
      <el-table-column label="井" width="120" prop="well" align="center">
        <!-- <template slot-scope="scope">
          <router-link
            style="cursor: pointer;"
            :to="{name:'well-detail',params:{id:scope.row.wellid},query:{type:scope.row.pro_type}}"
          >{{scope.row.name}}</router-link>
        </template>-->
      </el-table-column>
      <el-table-column prop="dev_ip" label="现场设备IP" align="center"></el-table-column>
      <el-table-column  label="DTU连接状态" align="center">
        <template slot-scope="scope">
           <div v-if="scope.row.dtu_status==0">
             {{scope.row.dtu_status|dtuStatus}}
             <svg-icon icon-class="wellconnecton" />
           </div>
           <div v-if="scope.row.dtu_status==1">
             {{scope.row.dtu_status|dtuStatus}}
              <svg-icon icon-class="wellconnectoff" />
           </div>
         </template>
      </el-table-column>
      <el-table-column label="DTU状态变更时间" width="160" align="center">
        <template slot-scope="scope">{{scope.row.dtu_changed_time|dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column  label="现场设备状态" align="center"  width="130">
          <template slot-scope="scope">
           <div v-if="scope.row.dev_status==0" class="cell-wellstatus">
             {{scope.row.dev_status|wellStatus}}
             <!-- <img src="@/assets/on.png"/> -->
             <svg-icon icon-class="wellon" />
           </div>
           <div v-if="scope.row.dev_status==1" class="cell-wellstatus">
             {{scope.row.dev_status|wellStatus}}
             <!-- <img src="@/assets/off.png"/> -->
              <svg-icon icon-class="welloff" />
           </div>
         </template>
      </el-table-column>
      <el-table-column label="现场设备状态变更时间" width="200" align="center">
        <template slot-scope="scope">{{scope.row.dev_changed_time|dateTimeFormat}}</template>
      </el-table-column>
    </el-table>
    <div style="margin-top:50px"></div>
  </div>
</template>
<script>
import { ApigetDeviceStatus } from "@/api/deviceStatus";
export default {
  data() {
    return {
      devicedata: [],
      wellNumber: null,
      clientHeight:"",
      tableHeight:0
    };
  },
  methods: {
    getDeviceStatus() {
      ApigetDeviceStatus().then(({ data }) => {
        this.devicedata = data.msg;
      });
    },
    searchDeviceStatus(){
      ApigetDeviceStatus({wellno:this.wellNumber}).then(({ data })=>{
          this.devicedata = data.msg;
      })
    },
    // // dtu状态格式化显示
    // dtuStatus: function(row, column) {
    //   switch (row.dtu_status) {
    //     case 0:
    //       return "连接";
    //       break;
    //     case 1:
    //       return "未连接";
    //       break;
    //   }
    // }
  },
  created() {
    this.getDeviceStatus();
    this.clientHeight =   `${document.documentElement.clientHeight}`          //document.body.clientWidth;
    this.tableHeight = this.clientHeight - 270
  }
};
</script>
<style lang="scss" >
#deviceStatus{
  font-size: 12px;
  background-color: #f4f5f5;
  .button{
    padding-left: 5px;
    height:27.99px
  }
  .col-bg {
    padding: 5px 2px 0 5px;
  }
  .DTUconnect{
    padding-left:3px
  }
//   .cell-wellstatus{
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     img{
//       padding-left: 5px;
//     }
//   }
}
