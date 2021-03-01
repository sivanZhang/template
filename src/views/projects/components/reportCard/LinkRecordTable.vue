<template>
    <div>
      <el-table
        :data="LinkRecordList"
        :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0,minHeight:'50px'}"
        style="width:100%"
        highlight-current-row
        default-expand-all
        :default-sort = "{prop: 'date'||'task_score'||'attendance_count'||'submition_time', order: 'descending'}"
      >
        <el-table-column prop="rank" label="加权排名" width="40" ></el-table-column>
        <el-table-column prop="executor_name" label="练习生"></el-table-column>
        <el-table-column prop="score" label="加权成绩" sortable></el-table-column>
        <el-table-column prop="task_score" label="任务成绩" width="90" sortable></el-table-column>
        <el-table-column prop="attendance_count" label="迟到早退(次)" sortable></el-table-column>
        <el-table-column prop="submition_time" label="任务提交时间"   sortable>
          <template slot-scope="scope">{{scope.row.submition_time|dateTimeFormat}}</template>
        </el-table-column>
        <el-table-column prop="submition_rank" label="提交时间排名" width="50" ></el-table-column>
      </el-table> 
    </div>
</template>
<script>
import {
  getWeightRecord,
} from "@/api/training";
export default {
    data(){
        return {
          LinkRecordList:[],
        }
    },
    created(){

    },
    methods:{
      getWeightRecords(link_id){
        getWeightRecord({link_id:link_id}).then(({ data })=>{
          this.LinkRecordList = [...data.msg]
        })
      }
    }
}
</script>