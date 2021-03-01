
 <!-- 部门kpi -->
 <template>
  <div>
    <el-cascader
      v-model="deptIds"
      placeholder="输入搜索工种"
      :options="selectList"
      :props="{ multiple: true,checkStrictly: true,expandTrigger: 'hover'}"
      filterable
      clearable
    ></el-cascader>
    <el-button class="inp-label" type="primary" @click="searchList()" :loading="tableLoading">查询</el-button>
    <el-button type="primary" @click="resetParams()">重置</el-button>
    <el-table
      :data="workTime"
      :tree-props="{ children: 'son' }"
      :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
      style="margin-top:10px;width:100%"
      :stripe="true"
      highlight-current-row
      default-expand-all
      v-loading="tableLoading"
      row-key="dept_user_count"
    >
      <el-table-column prop="dept_name" label="部门"></el-table-column>
      <el-table-column prop="dept_user_count" label="人员数量"></el-table-column>
      <el-table-column prop="total_work_time" label="本月总工时(小时)"></el-table-column>
      <el-table-column prop="total_allocation_time" label="本月已分配工时(小时)"></el-table-column>
      <el-table-column prop="total_free_time" label="本月空闲工时(小时)"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getDepartmentTime } from "@/api/statistics";
import dayjs from "dayjs";
import DeptListMixin from "@/utils/dept-list-mixins";
export default {
  mixins: [DeptListMixin],
  data() {
    return {
      tableLoading:false,
      deptIds:[],
      workTime: [],
      work_days: 21.75,
      work_time: 8,
    };
  },
  methods: {
    //重置
    resetParams() {
      this.deptIds=[]
      this.work_days= 21.75
      this.work_time= 8
    },
    // 根据筛选条件搜索
    searchList() {
     let params = null
      if (this.deptIds.length) {
        let idList = []
        idList = this.deptIds.map(i=>{
          return i[i.length-1]
        })
        params = {...params,dept_id:idList.join()}
      }
      // 暂时隐藏工时参数
      /* params = {
          ...params,
          work_days:this.work_days,
          work_time:this.work_time
        } */
      this.tableLoading = true
      getDepartmentTime(params).then(({ data }) => {
        this.workTime = data.msg;
      }).finally(()=>{
        this.tableLoading = false
      })
    }
  },
  async created() {
    this.searchList();
  }
};
</script>

<style scoped>
.inp-label{
  margin-left: 10px;
}
</style>