<template>
  <div id="my-audit" ref="drawer-parent">
    <el-card class="custom-card" shadow="never">
      <div class="inputs-warp">
        <div>
          <label class="input-label">项目:</label>
          <el-select
            v-model="searchParams.project_ids"
            clearable
            placeholder="请选择"
            multiple
            @visible-change="queryProjects"
            filterable
            class="select"
          >
            <el-option
              v-for="item in ProjectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div>
          <label class="input-label">优先级:</label>
          <el-select
            v-model="searchParams.prioritys"
            clearable
            placeholder="请选择"
            multiple
            filterable
            class="priority select"
            style="width:120px;"
          >
            <el-option
              v-for="item in prioritysLevelList"
              :key="item.value"
              :label="item.label"
              :value="item.value" 
            ></el-option>
          </el-select>
        </div>
        <div>
          <label class="input-label">执行人:</label>
          <el-select
            v-model="searchParams.executor_ids"
            clearable
            placeholder="请选择"
            multiple
            filterable
            style="width:120px;"
          >
            <el-option
              v-for="item in UserList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div>
          <label class="input-label">镜头号:</label>
          <el-input placeholder="请输入内容" v-model="searchParams.asset_name" clearable />
        </div>
        <div>
          <label class="input-label">任务名:</label>
          <el-input placeholder="请输入内容" v-model="searchParams.task_name" clearable class="taskname"/>
        </div>
        <div>
          <label class="input-label">任务内容:</label>
          <el-input placeholder="请输入内容" v-model="searchParams.task_content" clearable />
        </div>
        <el-button-group>
          <el-button type="primary" @click="queryMyTasks">查询</el-button>
          <el-button @click="resetMyTasks">重置</el-button>
        </el-button-group>
      </div>
    </el-card>
    <el-button
      icon="el-icon-video-camera-solid"
      type="success"
      @click="approve"
      class="pan-btn green-btn"
    >任务审核</el-button>
    <el-table
      style="margin-top:20px;width:100%"
      v-loading="tableLoading"
      :data="AuditList"
      :header-cell-style="{background:'#F5F7FA'}"
      highlight-current-row
      @select="taskSelect"
      @select-all="taskSelect"
      :cell-style="cellStyle"
      border
    >
      <el-table-column type="selection" width="30" align="center"></el-table-column>
      <el-table-column label="所属项目"   class-name="links">
        <template slot-scope="scope">
          <router-link
            :to="{name:'project-detail',params:{id:scope.row.project.id},query:{type:scope.row.project.pro_type}}"
          >{{scope.row.project.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="asset_name" label="镜头号"  width="120px;">
        <template slot-scope="scope">
          <div @click="taskBoardRightShow(scope.row.task.id)">{{scope.row.project.name}}</div>
        </template>
      </el-table-column>

      <el-table-column label="镜头缩略图" width="180px">
        <template slot-scope="scope">
          <el-image
            :src="$store.state.BASE_URL+scope.row.asset_image"
            style="width: 180px;height: 100px;cursor: pointer; display:block;"
            :preview-src-list="[$store.state.BASE_URL+scope.row.asset_image]"
          >
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <el-image :src="$store.state.BASE_URL+'images/appfile/1573029716.780075picture.png'"></el-image>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="asset_episode" label="集数" width="120px;" >
         <template slot-scope="scope">
          <div @click="taskBoardRightShow(scope.row.task.id)">{{scope.row.asset_episode}}</div>
        </template>
      </el-table-column>
       <el-table-column prop="asset_session" label="场次" width="120px;" >
         <template slot-scope="scope">
          <div @click="taskBoardRightShow(scope.row.task.id)">{{scope.row.asset_session}}</div>
        </template>
      </el-table-column>  
      <el-table-column prop="task.content" label="任务内容" width="120px;" >
         <template slot-scope="scope">
          <div @click="taskBoardRightShow(scope.row.task.id)">{{scope.row.task.content}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="end_date" label="截止日期" width="70px">
        <template slot-scope="scope">{{scope.row.task.end_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="task.task_executors" label="执行人" width="70px">
        <template slot-scope="scope">
          <div v-for="(item,index) of scope.row.task.task_executors" :key="index"  @click="taskBoardRightShow(scope.row.task.id)">{{item.user_name}}</div>
        </template>
      </el-table-column>
       
      <el-table-column label="优先级" prop="priority" width="45px">
        <template slot-scope="scope"> 
          <div @click="taskBoardRightShow(scope.row.task.id)">{{scope.row.task.priority|taskPriority}}</div> 
        </template>
      </el-table-column>
      <el-table-column label="开始日期" width="70px">
        <template slot-scope="scope">{{scope.row.task.start_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="task.total_hour" label="预设(h)" :render-header="renderheader" width="50px"></el-table-column>
      <el-table-column label="提交日期" width="70px">
        <template slot-scope="scope">{{scope.row.task.create_time|dateFormat}}</template>
      </el-table-column>
      <el-table-column label="任务ID" prop="task.id" class-name="links" width="50px">
        <template slot-scope="scope">
          <div @click="taskBoardRightShow(scope.row.task.id)">{{scope.row.task.id}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="task.name" label="任务名称"  ></el-table-column>
      <el-table-column prop="task.dept.name" label="工种" width="60px"></el-table-column>
      <!-- <el-table-column label="任务ID" class-name="links" prop="id" width="105px" sortable="custom">
          <template slot-scope="scope">
            <span @click="showDrawer(scope.row)">{{scope.row.id}}</span>
          </template>
      </el-table-column>-->
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
        <el-tab-pane label="快捷审批" lazy>
          <el-divider>提交内网审批</el-divider>
          <el-row type="flex">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6}"
              placeholder="请输入审批意见"
              v-model="form_obj.suggestion"
              clearable
            ></el-input>
          </el-row>
          <el-radio-group v-model.number="form_obj.approve_result" style="margin: 15px 0" @change="approveStatusChange()">
            <el-radio :label="0" che>拒绝</el-radio>
            <el-radio :label="1">同意</el-radio>
          </el-radio-group>
          <div v-if="pro_type !== 0">
             <el-checkbox v-model="form_obj.status" :disabled="approve_refused">标记为已完成</el-checkbox>
              <!-- <span
                    @click="openExplain()"
                     class="btn-explain"
                  >
                    使用帮助:
                    <svg-icon icon-class="wenhao" />
                  </span> -->
          </div>
          <template v-if="pro_type === 0">
            <el-row type="flex" align="middle">
              <el-col :span="5">审核评分</el-col>
              <el-col :span="19" align="left">
                <el-input-number v-model="form_obj.score" :min="0" :max="100" :step="10"></el-input-number>
              </el-col>
            </el-row>
          </template>
          
          <div>
            <el-checkbox v-model="checked" v-if="pro_type === 1" :disabled="approve_refused" style="margin-top:5px">是否提交客户审批</el-checkbox>
          </div>
          <el-input
            v-if="checked"
            type="textarea"
            v-model="out_suggestion"
            ref="outer-input"
            placeholder="提交客户审批的说明"
            style="margin-top:10px"
          ></el-input>
          <el-input
            v-if="checked"
            v-model="out_path"
            ref="outer-path"
            placeholder="请输入提交客户审批的路径"
            style="margin-top:5px"
          ></el-input>
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
     <!-- 标记已完成说明 -->
    <el-dialog title="注意事项" :visible.sync="dialogVisible" width="365px">
      <div class="notice-matter">
        <div style="font-size:12px">如果勾选“标记为已完成”，任务会标记为“已完成”，无需下一级审批。</div>
      </div>
    </el-dialog>
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
import { postApprove, getApproveDetail } from "@/api/video";
import taskForm from "@/views/task/components/task-form";
import tabLog from "@/views/task/components/tab-log";
import tabTaskDtail from "@/views/task/components/tab-task-detail";
import approveLog from "@/views/components/approve-log";
import thumbtackMixin from "@/utils/thumbtack-mixin";
import { getApprove } from "@/api/video";
export default {
  name:'undetermined-approve',
  mixins: [thumbtackMixin],
  components: {
    taskForm,
    tabLog,
    tabTaskDtail,
    approveLog
  },
  data() {
    return {
      // 查询参数
      searchParams: {},
      // 列表结果是全部还是搜索结果
      isSearch: false,
      // 我的审批列表根据条件搜索后的结果
      prioritysLevelList: [
        {
          label: "低级",
          value: 0
        },
        {
          label: "中级",
          value: 1
        },
        {
          label: "高级",
          value: 2
        }
      ],
       dialogVisible: false,
      // AuditList:[],
      SearchResult: [],
      out_suggestion: "",
      checked: false, 
        
      submitLoading: false,
      form_obj: {},
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
      out_path: null,
      approve_refused : true, // 拒绝的时候，已完成和是否提交客户审批都不可用
    };
  },
  computed: {
    UserList() {
      return this.$store.state.admin.UserList;
    },
    ProjectList() {
      return this.$store.state.project.ProjectList;
    },
    //{Array} 我的审批列表数据
    AuditList() {
      // 如果是在搜索，使用搜索结果，否则使用store中缓存的数据
      if (this.isSearch) {
        return this.SearchResult;
      } else {
        return this.$store.state.approve.AuditList;
      }
    }
    
  },
  methods: {
     openExplain() {
      this.dialogVisible = true;
    },
    // 审核状态变化
    approveStatusChange(){
        //审核状态变为拒绝时，disable“标记为已完成”以及“提交客户审批”的按钮 
        if (this.form_obj.approve_result === 0){ 
            this.approve_refused = true;
        }
        else{
           this.approve_refused = false;
        }
    },
    // 获取所有项目
    queryProjects(selectionType) {
      // 下拉框显示时
      if (selectionType && !this.ProjectList) {
        this.$store.dispatch("project/get_Projects");
      }
      }, 
    
    //状态
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.property == "priority") {
        switch (row.task.priority) {
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
    //表格中选中任务
    taskSelect(selection) {
      this.SelectionList = [...selection];
      // console.log("shenhe");
      // console.log(this.SelectionList);
    },
    //审批
    approve() {
      if (this.SelectionList.length) {
        this.$store.commit("video/SET_SELECTION", this.SelectionList);
        this.$router.push({ name: "check-video" });
      } else {
        this.$message.warning("请选择审核的任务");
      }
    },
    //是否显示任务板右侧
    taskBoardRightShow(id) {
      this.isDrawerShow = true;
      this.TaskRecord = Object.assign(
        {},
        {
          task_id: id,
          type: 0
        }
      );
      this.logsLoading = true;
      queryTaskRecord({
        task_id: id
      })
        .then(({ data }) => {
          this.LogList = [...data.msg];
          this.logsLoading = false;
        })
        .catch(() => {
          this.logsLoading = false;
        });
      this.detailLoading = true;
      this.$refs["taskDetail"].getDetail(id);
      queryTask({
        id: id
      })
        .then(({ data }) => {
          // this.TaskDetail = {
          //   ...data.msg
          // };
          this.pro_type = data.msg.project.pro_type;
          this.detailLoading = false;
        })
        .catch(() => {
          this.detailLoading = false;
        });

      getApproveDetail({ task_id: [id] }).then(({ data }) => {
        this.path = [...data.msg].filter(item => {
          if (item.task.id === id) return item;
        })[0].path;
        if (!this.path) {
          this.path = "-";
        }
      });
      this.form_obj = Object.assign(
        {},
        {
          suggestion: "",
          approve_result: 0,
          task_id: id,
          status: false,
        }
      );
    
      this.$refs["approvelogs"].getApproveLog(id);
    },
    submitApprove() {
      this.submitLoading = true;
      if (this.checked) {
        //添加提交外网审核字段
        this.form_obj = {
          ...this.form_obj,
          click: "",
          out_suggestion: this.out_suggestion,
          path: this.out_path
        };
      }
        if (this.form_obj.status==false) {
        delete this.form_obj.status;
      }
      // console.log("11111");
      // console.log(this.form_obj);
      postApprove(this.form_obj)
        .then(res => {
          if (res.data.status === 0) {
            this.getMyTasks();
            this.isDrawerShow = false;
            this.$message.success(res.data.msg);
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },
    //http获取‘我的任务’
    getMyTasks() {
      this.tableLoading = true;
      this.$store.dispatch("approve/get_Approve").finally(() => {
        this.tableLoading = false;
      });
    },
    queryMyTasks() {
      this.isSearch = true;
      this.tableLoading = true;
      const params = { ...this.searchParams };
      // 值为数组的属性转换为带","的字符串
      function propFormat(prop) {
        if (prop in params && prop.length) {
          params[prop] = params[prop].join();
        } else {
          delete params[prop];
        }
      }
      propFormat("project_ids");
      propFormat("prioritys");
      propFormat("executor_ids");
      Object.entries(params).forEach(t => {
        if (!t[1]) {
          delete params[t[0]];
        }
      });
      getApprove(params)
        .then(({ data }) => {
          this.SearchResult = [...data.msg];
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    resetMyTasks() {
      this.searchParams = {};
      this.isSearch = false;
    }
    //添加任务执行记录
    /* addRecord() {
      this.createLoading = true;
      addTaskRecord(this.TaskRecord)
        .then(res => {
          if (res.data.status === 0) {
            this.$message.success(res.data.msg);
            this.getMyTasks();
          } else {
            this.$message.warning(res.data.msg);
          }
          this.isDialogShow = false;
          this.createLoading = false;
        })
        .catch(err => {
          this.createLoading = false;
        });
    },
    cancel() {
      this.isDialogShow = false;
    } */
  },
  mounted() {
    this.getMyTasks();
    
  }
};
</script>
<style lang="scss">
#my-audit {
  .custom-card {
    margin-bottom: 15px;
  } 
  .inputs-warp {
        display: flex;
        flex-flow: row wrap;
        align-items: flex-end;
        justify-content: space-between;
        & > * {
            margin-bottom: 10px;
        }
        .input-label {
            width: 70px;
            display: block;
            font-weight: 100;
            font-size: 12px;
            margin-bottom: 4px;
            & + * {
                width: 200px;
            }
        }
    }
  .links {
    cursor: pointer;
    color: #2d8cf0;
  }
  .el-card {
    border-radius: 0px;
  }
}
.el-table--mini th{
  padding: 12px 0;
}

.el-table--mini td {
  padding: 0;
}
.cell{
  padding-left:0px !important;
  padding-right:0px !important;
  text-align: center;
}
.el-image{
  display:block !important;
}
 .btn-explain{
        padding-left:30px;
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