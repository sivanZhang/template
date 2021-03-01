<template>
  <div id="tablerecord">
    <!-- 开关井记录 -->
    <el-table
      :data="recorddata"
      stripe
      :border="true"
      style="width: 100%;"
      :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
      :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
    >
      <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
      <el-table-column prop="name" label="井名" width="100px" align="center"></el-table-column>
      <el-table-column prop="status" label="开/关井" :formatter="Status" width="100px" align="center"></el-table-column>
      <el-table-column label="变更时间" width="150px" align="center">
        <template slot-scope="scope">{{scope.row.changed_time|dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column prop="time" label="持续时间" width="150px" align="center"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { ApiGetHistorydata } from "@/api/realdata";
export default {
    data(){
        return{
          recorddata:[],
        }
    },
    methods:{
     getRecordData(wellid){
         ApiGetHistorydata({id:wellid}).then(res =>{
            //  console.log(res)
            this.recorddata = res.data.msg;
         })
     },
     // 运行状态格式化显示
    Status: function(row, column) {
      switch (row.status) {
        case 0:
          return "开井";
          break;
        case 1:
          return "关井";
          break;
        case 2:
          return "设备已被移除";
          break;
      }
    }
    }

}
</script>