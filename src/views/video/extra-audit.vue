<!-- 提交外网审批 -->
<template>
  <div id="extra-audit" ref="drawer-parent">
    <el-table
      v-loading="tableLoading"
      :data="extraList"
      style="margin-top:20px;width:100%"
      highlight-current-row
      :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
      :cell-style="cellStyle"
    >
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column label="所属项目" width="80px">
        <template slot-scope="scope">
          <router-link
            :to="{name:'project-detail',params:{id:scope.row.project.id},query:{type:scope.row.project.pro_type}}"
          >{{scope.row.project.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="镜头缩略图"  width="180px">
        <template slot-scope="scope">
          <el-image
            :src="$store.state.BASE_URL+scope.row.asset_image"
            style="width: 180px; height: 100px;cursor: pointer; display:block;"
            :preview-src-list="[$store.state.BASE_URL+scope.row.asset_image]"
          >
            <div slot="placeholder" class="image-slot">
                加载中
                <span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <el-image
                  :src="$store.state.BASE_URL+'images/appfile/1573029716.780075picture.png'"
                ></el-image>
              </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="asset_name" label="镜头号" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column label="反馈截图"  width="120px">
        <template slot-scope="scope">
          <el-image
            :src="$store.state.BASE_URL+scope.row.project.image"
            style="width: 180px; height: 100px;cursor: pointer; display:block;"
            :preview-src-list="[$store.state.BASE_URL+scope.row.project.image]"
          >
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture" style="color:#909399"></i>
            </div>
          </el-image>
        </template>
      </el-table-column> -->
      <el-table-column prop="task.content" label="任务内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="end_date" label="截止日期" width="120px">
        <template slot-scope="scope">{{scope.row.task.end_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="task.task_executors" label="任务执行人" width="120px">
        <template slot-scope="scope">
          <div v-for="(item,index) of scope.row.task.task_executors" :key="index">{{item.user_name}}</div>
        </template>
      </el-table-column>
      <el-table-column width="30px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="任务状态：暂停" placement="top">
            <el-card
              v-if="scope.row.task.status === 0"
              :style="{width:'10px',backgroundColor:'#F9ce8c',border:'0px'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：未开始" placement="top">
            <el-card
              v-if="scope.row.task.status === 1"
              :style="{width:'10px',backgroundColor:'#59e0e8',border:'0px'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：进行中" placement="top">
            <el-card
              v-if="scope.row.task.status === 2"
              :style="{width:'10px',backgroundColor:'#589BAD',border:'0px'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：审核中" placement="top">
            <el-card
              v-if="scope.row.task.status === 3"
              :style="{width:'10px',backgroundColor:'#2D5637',border:'0px'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：完成" placement="top">
            <el-card
              v-if="scope.row.task.status === 4"
              :style="{width:'10px',backgroundColor:'#2f5c85',border:'0px'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：超时" placement="top">
            <el-card
              v-if="scope.row.task.status === 5"
              :style="{width:'10px',backgroundColor:'#C64b2b',border:'0px'}"
            ></el-card>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="任务状态">
        <template slot-scope="scope">{{scope.row.task.status|taskStatus}}</template>
      </el-table-column>
      <el-table-column label="优先级" align="center">
        <template slot-scope="scope">{{scope.row.task.priority|taskPriority}}</template>
      </el-table-column>
      <el-table-column label="开始日期" width="120px">
        <template slot-scope="scope">{{scope.row.task.start_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="task.total_hour" label="预设时间（小时）" width="150px"></el-table-column>
      <el-table-column label="提交日期" width="120px">
        <template slot-scope="scope">{{scope.row.task.create_time|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="task.id" label="任务ID" align="center" class-name="links">
        <template slot-scope="scope">
          <div @click="taskBoardRightShow(scope.row)">{{scope.row.task.id}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="task.name" label="任务名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="user.username" label="提交人"></el-table-column>
      <el-table-column prop="task.dept.name" label="工种"></el-table-column>
    </el-table>

    <Drawer
      scrollable
      v-model="isDrawerShow"
      width="512px"
      :inner="isInner"
      :mask-style="{backgroundColor: 'transparent'}"
      :transfer="false"
      draggable
    >
      <el-tabs>
        <el-tab-pane label="任务详情" lazy>
          <tabTaskDtail ref="taskDetail" :detailLoading="detailLoading" :path="path" />
        </el-tab-pane>
        <el-tab-pane label="审批记录">
          <approve-log ref="approvelogs" />
        </el-tab-pane>
        <el-tab-pane label="客户审批" lazy>
          <el-divider>提交外网审批</el-divider>
          <template v-if="pro_type === 0">
            <el-row type="flex" align="middle">
              <el-col :span="5">审核评分</el-col>
              <el-col :span="19" align="left">
                <el-input-number v-model="form_obj.score" :min="0" :max="100" :step="10"></el-input-number>
              </el-col>
            </el-row>
          </template>
          <el-row style="margin-top:10px">
            <el-col :span="5">审批说明</el-col>
            <el-col :span="19">
              <el-input
                type="textarea"
                v-model="out_suggestion"
                ref="outer-input"
                placeholder="请输入提交客户审批的说明"
              ></el-input>
            </el-col>
          </el-row>
          <el-row style="margin-top:10px">
            <el-col :span="5">审批路径</el-col>
            <el-col :span="19">
              <el-input v-model="path" ref="outer-path" placeholder="请输入审批路径"></el-input>
            </el-col>
          </el-row>
          <div style="margin-top:10px">
            <el-button type="primary" :loading="submitLoading" @click="submitApprove">提交</el-button>
          </div>
          <!-- {{form_obj}} -->
        </el-tab-pane>
        <el-tab-pane label="执行记录" lazy>
          <tabLog :loglist="LogList" :logsLoading="logsLoading" />
        </el-tab-pane>
      </el-tabs>
    </Drawer>
  </div>
</template>

<script>
import {
  queryMyTask,
  addTaskRecord,
  putTaskRecord,
  queryTaskRecord,
  queryTask
} from "@/api/task";
import {
  getExtraApproveList,
  submitExtra,
  getApprove,
  postApprove,
  getApproveDetail
} from "@/api/video";
import taskForm from "@/views/task/components/task-form";
import tabLog from "@/views/task/components/tab-log";
import tabTaskDtail from "@/views/task/components/tab-task-detail";
import approveLog from "@/views/components/approve-log";
import thumbtackMixin from "@/utils/thumbtack-mixin";
export default {
  mixins: [thumbtackMixin],
  components: {
    taskForm,
    tabLog,
    tabTaskDtail,
    approveLog
  },
  name: "extra-audit",
  data() {
    return {
      extraList: [],
      out_suggestion: "",
      submitLoading: false,
      isDrawerShow: false,
      TaskRecord: {},
      detailLoading: false,
      logsLoading: false,
      createLoading: false,
      LogList: [],
      TaskDetail: {},
      SelectionList: [],
      path: null,
      pro_type: null,
      tableLoading: false,
      form_obj: {}
    };
  },
  watch: {},
  methods: {
    //状态
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.property == "priority") {
        switch (row.priority) {
          case 2:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      } else if (column.property == "grade") {
        switch (row.grade) {
          case 2:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      }
    
    },
    async getApproveList() {
      this.tableLoading = true;
      await getExtraApproveList()
        .then(({ data }) => {
          this.extraList = [...data.msg];
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    //是否显示任务板右侧
    // taskBoardRightShow(id) {
    //   this.isDrawerShow = true;
    //   this.TaskRecord = Object.assign(
    //     {},
    //     {
    //       task_id: id,
    //       type: 0
    //     }
    //   );
    //   this.logsLoading = true;
    //   queryTaskRecord({
    //     task_id: id
    //   })
    //     .then(({ data }) => {
    //       this.LogList = [...data.msg];
    //       this.logsLoading = false;
    //     })
    //     .catch(() => {
    //       this.logsLoading = false;
    //     });
    //   this.detailLoading = true;
    //   this.$refs["taskDetail"].getDetail(id);
    //   queryTask({
    //     id: id
    //   })
    //     .then(({ data }) => {
    //       this.TaskDetail = {
    //         ...data.msg
    //       };
    //       this.pro_type = data.msg.project.pro_type;
    //       this.detailLoading = false;
    //     })
    //     .catch(() => {
    //       this.detailLoading = false;
    //     });
    // },
    //是否显示任务板右侧
    taskBoardRightShow(row) {
      this.isDrawerShow = true;
      this.TaskRecord = Object.assign(
        {},
        {
          task_id: row.task.id,
          type: 0
        }
      );
      this.logsLoading = true;
      queryTaskRecord({
        task_id: row.task.id
      })
        .then(({ data }) => {
          this.LogList = [...data.msg];
          this.logsLoading = false;
        })
        .catch(() => {
          this.logsLoading = false;
        });
      this.detailLoading = true;
      queryTask({
        id: row.task.id
      })
        .then(({ data }) => {
          this.TaskDetail = {
            ...data.msg
          };
          this.pro_type = data.msg.project.pro_type;
          this.detailLoading = false;
        })
        .catch(() => {
          this.detailLoading = false;
        });
      this.form_obj = Object.assign(
        {},
        {
          approve_id: row.approve_id
        }
      );
      this.$refs["approvelogs"].getApproveLog(row.task.id);
    },
    submitApprove() {
      this.submitLoading = true;

      //添加提交外网审核字段
      this.form_obj = {
        ...this.form_obj,
        suggestion: this.out_suggestion,
        path: this.path,
        
      };
      // console.log(this.form_obj);
      submitExtra(this.form_obj)
        .then(res => {
          if (res.data.status === 0) {
            this.extraList = [];
            this.getApproveList();
            this.isDrawerShow = false;
            this.$message.success(res.data.msg);
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .finally(() => {
          this.submitLoading = false;
        });
    }
  },
  created() {
    this.getApproveList();
  }
};
</script>
<style lang='scss' >
.el-table--mini th, .el-table--mini td {
    padding: 12px 0;
}
</style>