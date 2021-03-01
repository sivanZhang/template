<template>
  <div>
    <el-card shadow="never">
      <el-row>
        <el-col :span="20">
          <el-cascader
            v-model="deptIds"
            placeholder="输入搜索工种"
            :options="selectList"
            :props="{ multiple: true,checkStrictly: true,expandTrigger: 'hover'}"
            filterable
            clearable
          ></el-cascader>
          <el-select v-model="userIds" placeholder="请选择" filterable multiple clearable>
            <el-option
              v-for="item in UserList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <el-button type="primary" @click="getSearchKpi()" :loading="searchLoading">查询</el-button>
          <!-- 筛选 -->
          <el-button @click="getTasks()" style="margin-left: 15px" type="primary" size="mini">重置</el-button>
          <!-- <span
            class="btn-explain"
            @click="openExplain()"
          >
            使用帮助:
            <svg-icon icon-class="wenhao" />
          </span> -->
        </el-col>
        <el-col :span="4" class="text-right">
          <el-button icon="el-icon-upload2" type="success" @click="targetUpload">导出</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-table
      v-loading="searchLoading"
      :data="kpiList"
      :tree-props="{children: 'sub'}"
      :row-key="row=>(row.id + 20000)"
      :stripe="true"
      :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
      style="margin-top:15px;width:100%"
      highlight-current-row
      border
      default-expand-all
    >
      <el-table-column prop="member_name" label="制作人员"></el-table-column>
      <el-table-column prop="client_total_asset" label="完成镜头数量 (客户通过的)" width="110"></el-table-column>
      <el-table-column prop="level" label="难度">
        <template slot-scope="scope">{{scope.row.level|Level }}</template>
      </el-table-column>
      <el-table-column prop="client_total_frame" label="总帧数"></el-table-column>
      <el-table-column prop="client_total_modify" label="修改次数"></el-table-column>
      <el-table-column prop="inner_total_asset" label="内审通过的镜头数量"></el-table-column>
      <el-table-column prop="inner_total_frame" label="总帧数"></el-table-column>
      <el-table-column prop="inner_total_overtime" label="加班工时"></el-table-column>
      <el-table-column prop="kpi" label="平均单帧制作时长（小时）" width="250px"></el-table-column>
    </el-table>
    <!-- 超前与滞后说明 -->
    <el-dialog title="注意事项" :visible.sync="dialogVisible" width="365px">
      <div class="notice-matter">
        <div style="font-size:12px">默认查询的是本月1号至今天的kpi</div>
      </div>
    </el-dialog>
    <!-- KPI导出 -->
    <el-dialog title="Excel文件导出" :visible.sync="uploadVisible" width="400px" hieght="300px">
      <el-row>
        <el-col :span="6">
          <span>excel文件</span>
        </el-col>
        <el-col :span="18">
          <span @click="download" style="cursor:pointer;color:#2d8cf0">{{"点击下载"}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadExcel">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { searchKpi } from "@/api/statistics";
import { mapState } from "vuex";

import dayjs from "dayjs";
import DeptListMixin from "@/utils/dept-list-mixins";
export default {
  mixins: [DeptListMixin],
  data() {
    return {
      searchLoading:false,
      dateRange: [],
      kpiList: [],
      deptIds:[],
      userIds:[],
      uploadVisible: false,
      dialogVisible: false,
      selectList: [],
      searchList: {},
      path: null,
    };
  },

  computed: {
    ...mapState("admin", ["DeptList", "UserList"]) //DeptUsers是根据登录账号得来的
  },
  methods: {
    //默认说明
    openExplain() {
      this.dialogVisible = true;
    },
    //重置
    getTasks() {
      this.dateRange = []
      this.deptIds=[]
      this.userIds=[]
      this.getSearchKpi()
    },
    //kpi列表导出
    targetUpload() {
      this.uploadVisible = true;
      let data = this.$_returnParams()
      data = {
        ...data,
        print: "null"
      };
      searchKpi(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.uploadVisible = true;
            this.path = data.path;
            this.searchList = {}
          }
        })
        .catch(err => {
          this.$message.error(data.msg);
          this.searchList = {}
        });
    },
    //导出Excel
    download() {
      let data = this.$store.state.BASE_URL + this.path;
      window.location.href = data;
      this.uploadVisible = false;
    },
    uploadExcel() {
      this.uploadVisible = false;
    },
    //筛选
    getSearchKpi() {
      let params = this.$_returnParams()
      this.$_searchKpi(params)
    },
    $_returnParams(){
      let data1 = {
        dept_id:this.deptIds.length?this.deptIds.join():null,
        user_id:this.userIds.length?this.userIds.join():null,
        start_date: this.dateRange.length
          ? dayjs(this.dateRange[0]).format("YYYY/MM/DD")
          : null,
        end_date: this.dateRange.length
          ? dayjs(this.dateRange[1]).format("YYYY/MM/DD")
          : null
      };
      let data2 = {};
      Object.keys(data1).forEach(t => {
        if (data1[t]) {
          data2 = {...data2,[t]:data1[t]}
        }
      })
      return data2
    },

    //获取kpi列表
    $_searchKpi(data) {
      this.kpiList = [];
      this.searchLoading = true
      searchKpi(data).then(({ data }) => {
        if (data.status == 0) {
          [...data.msg].map((item, index) => {
            this.kpiList.push({
              id: index + 1,
              inner_total_asset: item.inner.inner_total_asset,
              inner_total_frame: item.inner.inner_total_frame,
              level: Number(-1),
              inner_total_overtime: item.inner.inner_total_overtime,
              member_name: item.member_name,
              client_total_asset: item.outer.client_total_asset,
              client_total_frame: item.outer.client_total_frame,
              client_total_modify: item.outer.client_total_modify,
              kpi:
                item.inner.inner_total_frame /
                (22 * 8 + item.inner.inner_total_overtime),
              sub: []
            });
          });
          [...data.msg].map((item, index) => {
            const keys1 = Object.keys(item.inner);

            const keys2 = Object.keys(item.outer);

            for (let i = 0; i < keys1.length - 4; i++) {
              for (let j = 0; j < keys2.length - 4; j++) {
                if (i === j) {
                  this.kpiList[index].sub.push({
                    id: keys1[i] + 1000,
                    inner_total_asset: item.inner[keys1[i]].inner_total_asset,
                    inner_total_frame: item.inner[keys1[i]].inner_total_frame,
                    level: Number(keys1[i]),
                    inner_total_overtime:
                      item.inner[keys1[i]].inner_total_overtime,
                    member_name: "",
                    client_total_asset: item.outer[keys2[i]].client_total_asset,
                    client_total_frame: item.outer[keys2[i]].client_total_frame,
                    client_total_modify:
                      item.outer[keys2[i]].client_total_modify,
                    kpi:
                      item.inner[keys1[i]].inner_total_frame /
                      (22 * 8 + item.inner[keys1[i]].inner_total_overtime),
                    sub: []
                  });
                }
              }
            }
          });
          //
        } else {
          this.$message.error(data.msg);
        }
      }).finally(()=>{
        this.searchLoading = false
      })
    }
  },
  async created() {
    this.getSearchKpi();
  }
};
</script>
<style lang='scss' scoped>
.text-right {
  text-align: right;
}
.btn-explain{
        padding-left:10px;
        font-size:12px;
        color:#808080;
        cursor: pointer;
      }
  .notice-matter {
  padding-left: 5px;
  padding-bottom: 20px;
  padding-right: 5px;
}
</style>