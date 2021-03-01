<template>
  <div id="detail">
    <div class="header">
      <el-image
        :src="
          TaskDetail.project.image
            ? $store.state.BASE_URL + TaskDetail.project.image
            : ''
        "
        fit="cover"
      />

      <div>
        <div class="label">项目名称：</div>
        <div class="label">所属资产：</div>
      </div>
      <div>
        <div class="values">{{ TaskDetail.project.name }}</div>
        <div class="values">{{ TaskDetail.asset.name ? TaskDetail.asset.name : "-" }}</div>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleTabClick($event)">
      <el-tab-pane label="任务详情" name="first">
        <tabTaskDtail ref="taskDtail" />
        <el-button class="creat-btn" type="primary" @click="handelClick">创建工程</el-button>
      </el-tab-pane>
      <el-tab-pane label="关联任务输出" name="seven">
        <linkTaskOutput ref="linkTaskOutput" />
      </el-tab-pane>
      <el-tab-pane label="执行记录" name="second">
        <tabLog :loglist="logList" :logs-loading="logsLoading" />
      </el-tab-pane>
      <el-tab-pane label="执行任务" name="third">
        <task-form
          :task-record.sync="taskRecord"
          :surplus_labor_hour="surplus_labor_hour"
          :create-loading="createLoading"
          @addRecord="addRecord"
          @cancel="cancel"
        />
      </el-tab-pane>
      <el-tab-pane label="提交审核" name="fourth">
        <tab-approve
          v-if="activeRow.task && activeRow.task.status === 2"
          ref="tab-approve"
          :row="activeRow"
          :task-id="taskRecord.task_id"
          :os="os"
        />
        <div
          v-else-if="activeRow.task.status === 3"
          style="display:flex;justify-content:center"
        >
          任务正在审核中
        </div>
        <div v-else style="display:flex;justify-content:center">
          任务状态未在进行中
        </div>
      </el-tab-pane>
      <el-tab-pane label="审批记录" name="fifth">
        <approve-log ref="taskApprovelog" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import QWebChannel from '../plugin/qwebchannel.js'
import { addTaskRecord, queryTask, getDirs } from '@/api/task'
import taskForm from '@/views/task/components/task-form'
import tabLog from '@/views/task/components/tab-log'
import tabApprove from '@/views/task/components/tab-approve'
import tabTaskDtail from '@/views/task/components/tab-task-detail'
import approveLog from '@/views/components/approve-log'
import linkTaskOutput from '@/views/task/components/tab-linkTaskOutput'
export default {
  name: 'Detail',
  components: {
    tabApprove,
    taskForm,
    tabLog,
    tabTaskDtail,
    approveLog,
    linkTaskOutput
  },
  props: [
    'logList',
    'detailLoading',
    'logsLoading',
    'taskRecord',
    'activeRow',
    'os'
  ],
  data() {
    return {
      activeName: 'first',
      surplus_labor_hour: null,
      createLoading: false,
      TaskDetail: {
        asset: {
          name: ''
        },
        project: { image: '' }
      },
      rules: {
        title: [
          {
            message: '请输入任务执行记录的标题',
            trigger: 'blur'
          }
        ],
        content: [
          {
            message: '请输入任务执行记录的内容',
            trigger: 'blur'
          }
        ],
        labor_hour: [{ message: '请输入任务执行的工时', trigger: 'blur' }]
      },
      rules2: {
        comment: [{ message: '请输入任务完成情况说明', trigger: 'blur' }]
      }
    }
  },
  watch: {
    activeName: {
      handler: function(newVal, oldVal) {
        if (newVal === 'fifth') {
          this.$refs['taskApprovelog'].getApproveLog(this.TaskDetail.id)
        }
      }
    }
  },
  mounted() {
    document.body.style.minWidth = 'auto'
  },
  methods: {
    handleTabClick(e) {
      if (e.name === 'fourth') {
        this.$refs['tab-approve'].getInitalPath()
      }
    },
    handelClick() {
      const self = this
      new QWebChannel(qt.webChannelTransport, function({ objects }) {
        var appManager = objects.app_manager
        getDirs({
          id: self.taskRecord.task_id,
          working: '',
          os: self.os
        }).then(({ data }) => {
          appManager.text = `path@${data.msg}@${self.taskRecord.task_id}`
          self.$refs['tab-approve'].getInitalPath()
        })
      })
    },
    getTaskDetail(id) {
      this.$refs['linkTaskOutput'].getlinkTaskOutput(id)
      queryTask({
        id: id
      })
        .then(({ data }) => {
          this.TaskDetail = {
            ...data.msg
          }
          this.surplus_labor_hour = data.msg.surplus_labor_hour
          // console.log(this.TaskDetail);
        })
        .catch(() => {})
      this.$nextTick(() => {
        this.$refs['taskDtail'].getDetail(id)
      })
    },
    addRecord() {
      this.createLoading = true

      addTaskRecord(this.taskRecord)
        .then(res => {
          if (res.data.status === 0) {
            this.$message.success(res.data.msg)
            // this.getMyTasks();
          } else {
            this.$message.warning(res.data.msg)
          }
          this.$emit('activename')
          this.createLoading = false
        })
        .catch(() => {
          this.createLoading = false
          this.$emit('activename')
        })
    },
    cancel() {
      this.isDialogShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.creat-btn{
    margin-top: 10px;
  }
.header {
  display: flex;
  margin-bottom: 15px;
  & > .el-image {
    width: 160px;
    height: 90px;
  }
  .label{
    margin: 0 15px 10px 30px;
  }
  .values{
    margin-bottom: 10px;
  }
}
</style>
