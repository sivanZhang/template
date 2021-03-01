<template>
  <!-- 练习生成绩单 -->
  <div id="reportCard">
    <div style="padding-bottom:10px">
      <el-row>
        <el-col :span="24" align="right">
          <el-button
            icon="el-icon-upload2"
            type="success"
            @click="targetUpload"
            :disabled="ButtontDisabled"
          >导出</el-button>
          <el-button type="primary" @click="refreshRecord()">刷新成绩单</el-button>
          <!-- <span class="btn-explain" @click="openExplain()">
            使用帮助:
            <svg-icon icon-class="wenhao" />
          </span> -->
        </el-col>
      </el-row>
    </div>
    <ElRow :gutter="15">
      <ElCol :span="14">
        <el-card>
          <el-tabs v-model="activeName1" @tab-click="tabclick">
            <el-tab-pane label="按权重排名" name="tab3" lazy>
              <el-table
                :data="LinkList.slice((currentPage4-1)*pageSize4,currentPage4*pageSize4)"
                :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0,minHeight:'50px'}"
                style="width:100%"
                highlight-current-row
                @expand-change="expandShow"
              >
                <!-- <el-table-column type="index" :index="indexLinkList"></el-table-column> -->
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <LinkRecordTable ref="LinkRecordTable" v-if="props.row.link_id" />
                    <label for v-else>此环节暂无成绩表</label>
                  </template>
                </el-table-column>
                <el-table-column prop="link_dept" label="工种名称"></el-table-column>
                <el-table-column prop="link_content" label="环节内容"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      icon="el-icon-upload2"
                      type="success"
                      @click="openAlongRecord(scope.row.link_id)"
                    >导出</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="block" style="text-align: right">
                <el-pagination
                  @size-change="handleSizeChange4"
                  @current-change="handleCurrentChange4"
                  :current-page="currentPage4"
                  :page-sizes="pageSizeList"
                  :page-size="pageSize4"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="LinkList.length"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="按任务打分成绩排名" name="tab4" :disabled="disabledtab3" lazy>
              <div>
                <el-table
                  :data="TaskRecord.slice((currentPage2-1)*pageSize2,currentPage2*pageSize2)"
                  :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0,minHeight:'50px'}"
                  style="width:100%"
                  highlight-current-row
                  default-expand-all
                >
                  <el-table-column prop="rank" label="排名">
                    <template slot-scope="scope">{{scope.row.rank}}</template>
                  </el-table-column>
                  <el-table-column prop="executor_name" label="学员"></el-table-column>
                  <el-table-column prop="asset__name" label="镜头号"></el-table-column>
                  <el-table-column prop="score" label="成绩"></el-table-column>
                  <el-table-column prop="suggestion" label="修改意见"></el-table-column>
                  <el-table-column prop="submit_time" label="任务提交时间">
                    <template slot-scope="scope">{{scope.row.submit_time|dateTimeFormat}}</template>
                  </el-table-column>
                  <el-table-column prop="asset__remark" label="备注"></el-table-column>
                </el-table>
                <div class="block" style="text-align: right">
                  <el-pagination
                    @size-change="handleSizeChange2"
                    @current-change="handleCurrentChange2"
                    :current-page="currentPage2"
                    :page-sizes="pageSizeList"
                    :page-size="pageSize2"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="TaskRecord.length"
                  ></el-pagination>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </ElCol>
      <ElCol :span="10">
        <el-card>
          <el-tabs v-model="activeName">
            <el-tab-pane label="按考勤时间排名" name="tab1" lazy>
              <el-table
                :data="AttendanceRecord.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0,minHeight:'50px'}"
                style="width:100%"
                highlight-current-row
                default-expand-all
              >
                <el-table-column prop="rank" label="排名">
                  <template slot-scope="scope">{{scope.row.rank}}</template>
                </el-table-column>
                <el-table-column prop="username" label="练习生"></el-table-column>
                <el-table-column prop="user_normal_count" label="考勤正常(次)" width="60"></el-table-column>
                <el-table-column prop="user_come_late_count" label="迟到(次)" width="50"></el-table-column>
                <el-table-column prop="user_leave_early_count" label="早退(次)" width="50"></el-table-column>
                <el-table-column prop="user_dutyoff_count" label="旷课(次)" width="50"></el-table-column>
                <el-table-column prop="duty_off_count" label="合计(次)" width="90"></el-table-column>
              </el-table>
              <div class="block" style="text-align: center">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="pageSizeList"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="AttendanceRecord.length"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="按审批通过的任务提交时间排名" name="tab2" lazy>
              <div>
                <el-table
                  :data="ApproveTimeRecord.slice((currentPage3-1)*pageSize3,currentPage3*pageSize3)"
                  :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0,minHeight:'50px'}"
                  style="width:100%"
                  highlight-current-row
                  default-expand-all
                >
                  <el-table-column type="index" :index="indexApproveTime"></el-table-column>
                  <el-table-column prop="username" label="练习生"></el-table-column>
                  <el-table-column prop="average_rank" label="平均成绩"></el-table-column>
                </el-table>
                <div class="block" style="text-align: right">
                  <el-pagination
                    @size-change="handleSizeChange3"
                    @current-change="handleCurrentChange3"
                    :current-page="currentPage3"
                    :page-sizes="pageSizeList"
                    :page-size="pageSize3"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="ApproveTimeRecord.length"
                  ></el-pagination>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </ElCol>
    </ElRow>
    <el-dialog title="注意事项" :visible.sync="SaveDialogVisible" width="365px">
      <div class="attention-body">
        <div class="attention-top">
          <h3>刷新成绩单：</h3>
          <div style="padding-top:2px">点击“刷新成绩单”按钮，可以实时获取最新成绩单数据</div>
          <h3 style="padding-top:3px">加权重后的总成绩：</h3>
          <div style="padding-top:2px">
            <h4>总成绩值为正数：</h4>说明实训效果总体较好，绝对值越大，排名越靠前
            <h4>总成绩值为负数：</h4>说明实训效果总体较差，绝对值越大，排名越靠后
            <h3 style="padding-top:3px">导出：</h3>导出的是当前环节中，按“任务打分成绩排名”的成绩单
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 导出 -->
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
import {
  getTaskRecord,
  getApproveTimeRecord,
  getAttendanceRecord,
  getWeightRecord,
  getProjectLinks,
  refreshRecord
} from "@/api/training";
import LinkRecordTable from "./LinkRecordTable";
export default {
  name: "reportCard",
  components: {
    LinkRecordTable
  },
  data() {
    return {
      currentPage: 1,
      pageSize:10,
      currentPage2: 1,
      pageSize2: 20,
      currentPage3: 1,
      pageSize3: 20,
      currentPage4: 1,
      pageSize4: 20,
      pageSizeList: [10, 30, 50, 100],
      userInfo: this.$store.state.login.userInfo,
      LinkList: [],
      disabledtab3: true,
      activeName: "tab1",
      activeName1: "tab3",
      ApproveTimeRecord: [],
      TaskRecord: [],
      AttendanceRecord: [],
      SaveDialogVisible: false,
      uploadVisible: false,
      ButtontDisabled: true,
      link_id: null,
      path: null
    };
  },
  created() {
    this.getProjectLinkList();
    this.getAttendanceRecord();
    this.getApproveTimeRecord();
  },
  methods: {
    // 成绩单任务导出dialog
    targetUpload() {
      const data = {
        link_id: this.link_id,
        print: "null"
      };
      getTaskRecord(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.uploadVisible = true;
            this.path = data.path;
          }
        })
        .catch(err => {
          this.$message.error(data.msg);
        });
    },
    // 导出Excel
    download() {
      const data = this.$store.state.BASE_URL + this.path;
      window.location.href = data;
      this.uploadVisible = false;
    },
    uploadExcel() {
      this.uploadVisible = false;
    },
    //打开使用帮助
    openExplain() {
      this.SaveDialogVisible = true;
    },
    //刷新成绩单
    refreshRecord() {
      refreshRecord({ project_id: this.$route.params.id }).then(({ data }) => {
        this.$message.success(data.msg);
      });
    },
    //是否提交作业格式化显示
    submitionFormat: function(row, column) {
      switch (row.submition) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    },
    //不显示单独的成绩单页面
    tabclick(val) {
      if (val.index == 0) {
        this.disabledtab3 = true;
        this.ButtontDisabled = true;
      }
    },
    //展示项目下面的环节
    getProjectLinkList() {
      getProjectLinks({ project_link: this.$route.params.id }).then(
        ({ data }) => {
          this.LinkList = [...data.msg];
        }
      );
    },
    //展示单独的成绩单
    openAlongRecord(item) {
      this.link_id = item;
      this.activeName1 = "tab4";
      this.disabledtab3 = false;
      this.ButtontDisabled = false;
      // this.getAttendanceRecord(item);
      // this.getApproveTimeRecord(item);
      this.getTaskRecord(item);
    },
    //展示环节的成绩单
    expandShow(row, expandedRows) {
      if (Object.keys(expandedRows).length) {
        if (expandedRows.length != 0) {
          this.$nextTick(() => {
            this.$refs["LinkRecordTable"].getWeightRecords(row.link_id);
          });
        }
      }
    },
    //按考勤时间
    getAttendanceRecord() {
      getAttendanceRecord({ project_id: this.$route.params.id }).then(
        ({ data }) => {
          this.AttendanceRecord = [...data.msg];
        }
      );
    },
    //按任务打分成绩
    getTaskRecord(link_id) {
      getTaskRecord({ link_id: link_id }).then(({ data }) => {
        this.TaskRecord = [...data.msg];
      });
    },
    //按审批通过的任务提交时间
    getApproveTimeRecord() {
      getApproveTimeRecord({ project_id: this.$route.params.id }).then(
        ({ data }) => {
          this.ApproveTimeRecord = [...data.msg];
        }
      );
    },
    //分页,按权重排名时的
    handleSizeChange4(val) {
      this.pageSize4 = val;
    },
    handleCurrentChange4(currentPage) {
      this.currentPage4 = currentPage;
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexLinkList(index) {
      return (this.currentPage4 - 1) * this.pageSize4 + index + 1;
    },
    //分页,按考勤时间排名
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    // //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    // indexAttendance(index) {
    //   return (this.currentPage - 1) * this.pageSize + index + 1;
    // },
    //分页按任务打分成绩排名
    handleSizeChange2(val) {
      this.pageSize2 = val;
    },
    handleCurrentChange2(currentPage) {
      this.currentPage2 = currentPage;
    },
    // //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    // indexMethod2(index) {
    //   return (this.currentPage2 - 1) * this.pageSize2 + index + 1;
    // },
    //分页按审批通过的任务提交时间
    handleSizeChange3(val) {
      this.pageSize3 = val;
    },
    handleCurrentChange3(currentPage) {
      this.currentPage3 = currentPage;
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexApproveTime(index) {
      return (this.currentPage3 - 1) * this.pageSize3 + index + 1;
    }
  }
};
</script>
<style lang="scss">
#reportCard {
  .button-Refresh {
    padding-top: 5px;
  }
  .btn-explain {
    padding-left: 10px;
    font-size: 12px;
    color: #808080;
    cursor: pointer;
  }
  .attention-body {
    padding: 0px 5px 20px;
    .attention-top {
      font-size: 12px;
    }
  }
}
.el-table__expanded-cell {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  padding-right: 0px !important;
  padding-left: 30px !important;
}
</style>