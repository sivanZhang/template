<template>
  <div>
    <el-row>
      <el-col :span="4">
        <font style="font-size:12px;">制作要求:</font>
      </el-col>
      <el-col :span="19" style="font-size:12px;">{{ taskdetail }}</el-col>
    </el-row>
    <div style="text-align: right;">
      <el-checkbox
        v-model="status_finish"
        style="margin-bottom:10px;"
        size="small"
        border
      >确认满足制作要求</el-checkbox>
    </div>
    <el-form :model="formInline" label-position="left" label-width="100px">
      <el-form-item label="成果路径:">
        <el-input
          v-model="formInline.path"
          clearable
          :placeholder="pathPlugin?'':'请输入成果文件路径...'"
          style="margin-left:-18px;"
        />
      </el-form-item>
      <el-form-item class="text-right">
        <el-button type="primary" class="btn" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { taskApprove, getTaskDetail, getDirs } from '@/api/task'
import QWebChannel from '@/views/myTask/plugin/qwebchannel.js'
export default {
  name: 'MyTaskApprove',
  props: {
    row: {
      default: null,
      type: Object
    },
    pathPlugin: Boolean,
    taskId: Number,
    os: String
  }, // ['row', 'pathPlugin', 'taskId', 'os']
  data() {
    return {
      status_finish: false,
      taskdetail: [],
      formInline: {
        dept_id: this.row.task.dept.id,
        task_id: this.row.task.id,
        path: ''
      }
    }
  },
  watch: {
    row: {
      deep: true,
      immediate: true,
      handler: function(newVal, oldVal) {
        const dept = newVal.task.dept
        const task = newVal.task
        this.formInline.dept_id = dept.id
        this.formInline.task_id = task.id
        this.getInitalPath()
      }
    }
  },
  methods: {
    getInitalPath() {
      const self = this
      this.formInline.path = ''
      new QWebChannel(qt.webChannelTransport, function({ objects }) {
        var appManager = objects.app_manager
        appManager.text = 'approve@getpath'
        appManager.textChanged.connect(function(approve_path) {
          if (approve_path) {
            self.formInline.path = approve_path
          }
        })
      })
    },
    getMakeQequire(task_id) {
      getTaskDetail({ id: task_id }).then(({ data }) => {
        if (data.status === 0) {
          this.taskdetail = data.msg.content
        }
      })
    },
    // 表单提交，提交审核
    submitForm() {
      if (!this.status_finish) {
        this.$alert('请勾选确认满足制作要求', '提示', {
          confirmButtonText: '确定'
        })
      } else {
        taskApprove(this.formInline)
          .then(res => {
            if (res.data.status === 0) {
              // 提交审核成功
              this.$message.success(res.data.msg)
              this.$emit('refresh')
              this.formInline.path = ''
              this.$emit('getRow')
              this.status_finish = false
            } else {
              this.$message.warning(res.data.msg)
              this.formInline.path = ''
              this.$emit('getRow')
              this.status_finish = false
            }
          })
      }
      //  this.status_finish=false;
    }
  }
}
</script>
<style lang="scss" scoped>
// .text-right {
//   text-align: right;
//   margin-left: 50px;
// }
.btn {
    margin-right: 18px;
}
.el-checkbox.is-bordered {
    border: 1px solid white;
    margin-right: 18px;
    padding-right: 0px;
}
</style>
