<template>
  <div style="width:100%;height:100%;min-width:526px;padding:10px">
    <div id="notice-header" style="border-bottom:1px soild #999999">
      <el-row>
        <el-col :span="4">
          <svg-icon icon-class="people2" style="width:50px;height:50px;" />
        </el-col>
        <el-col :span="13">
          <el-row style="font-size:20px">{{ loginMessage.msg }}</el-row>
          <el-row style="padding-top:10px">
            <el-col :span="3" align="left">邮箱：</el-col>
            <el-col :span="21">{{ loginMessage.email }}</el-col>
          </el-row>
          <el-row style="padding-top:10px">
            <el-col :span="3" align="left">工种：</el-col>
            <el-col :span="21">
              <el-col
                v-for="(item,index) of loginMessage.dept"
                :key="index"
                :span="5"
                align="left"
              >{{ item.name }}</el-col>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="7" align="center" style="margin-top:50px">
          <el-button type="primary" @click="getTaskList()">刷新任务列表</el-button>
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="我的任务" name="first">
        <el-row style="padding-bottom:10px">
          <el-col style="text-align:right">
            <div style="display:flex;justify-content:flex-end">
              <el-select
                v-model="colSel"
                placeholder="请选择"
                style="width:130px"
                filterable
                size="mini"
              >
                <el-option
                  v-for="item in columnSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-input
                v-if="colShow"
                v-model="keyword"
                placeholder="输入关键字搜索"
                size="mini"
                style="width:240px"
                @keyup.enter.native="getMyTask()"
              />
              <el-select
                v-if="colSel === 'status'"
                v-model="colSel2"
                placeholder="请选择"
                style="width:300px;margin-top:1px"
                multiple
                filterable
                size="mini"
              >
                <el-option
                  v-for="item in columnSelect2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <div v-if="colSel === 'start_date' || colSel === 'end_date'">
                <el-date-picker
                  v-model="timeSelection"
                  type="date"
                  placeholder="选择日期"
                  size="mini"
                  style="width:130px"
                />
                <span style="text-align:center;padding-top:3px">至</span>
                <el-date-picker
                  v-model="timeSelection2"
                  type="date"
                  placeholder="选择日期"
                  size="mini"
                  style="width:130px"
                />
              </div>
              <el-button type="primary" style="margin-left:5px" @click="getMyTask()">查询</el-button>
              <el-button type="primary" @click="reMyTask()">重置</el-button>
            </div>
          </el-col>
        </el-row>
        <el-table
          ref="assetTable"
          v-loading="tableLoading"
          :data="MyTask.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          border
          :stripe="true"
          :row-style="{'font-size':'13px'}"
          :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
          highlight-current-row
          row-class-name="hover"
          style="width: 100%;"
          @row-dblclick="openTaskDetail($event)"
        >
          <el-table-column prop="project.name" label="项目" align="center" />
          <el-table-column prop="asset.name" label="镜头号/资产" align="center" />
          <el-table-column label="缩略图" width="180px" align="center">
            <template slot-scope="scope">
              <el-image
                :src="$store.state.BASE_URL+scope.row.asset.image"
                style="width: 160px;height: 90px;cursor: pointer; display:block;"
                fit="cover"
                :preview-src-list="[$store.state.BASE_URL+scope.row.asset.image]"
              >
                <div slot="placeholder" class="image-slot">
                  加载中
                  <span class="dot">...</span>
                </div>
                <div slot="error" class="image-slot">
                  <el-image
                    :src="$store.state.BASE_URL+'images/appfile/1573029716.780075picture.png'"
                  />
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="task.name" label="任务" align="center" />
          <el-table-column label="起止日期" align="center">
            <el-table-column label="开始日期" align="left" width="90px">
              <template slot-scope="scope">{{ scope.row.task.start_date|dateFormat }}</template>
            </el-table-column>
            <el-table-column label="结束日期" align="left" width="90px">
              <template slot-scope="scope">{{ scope.row.task.end_date|dateFormat }}</template>
            </el-table-column>
          </el-table-column>
          <!-- <el-table-column label="状态" align="center" width="80">
            <template slot-scope="scope">{{ scope.row.task.status|taskStatus }}</template>
          </el-table-column>-->
          <el-table-column width="30px">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="任务状态：暂停" placement="top">
                <el-card
                  v-if="scope.row.task.status === 0"
                  :style="{width:'10px',backgroundColor:'#F9ce8c',border:'0px',padding: '25px 5px'}"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="任务状态：未开始" placement="top">
                <el-card
                  v-if="scope.row.task.status === 1"
                  :style="{width:'10px',backgroundColor:'#59e0e8',border:'0px',padding: '25px 5px'}"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="任务状态：进行中" placement="top">
                <el-card
                  v-if="scope.row.task.status === 2"
                  :style="{width:'10px',backgroundColor:'#589BAD',border:'0px',padding: '25px 5px'}"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="任务状态：审核中" placement="top">
                <el-card
                  v-if="scope.row.task.status === 3"
                  :style="{width:'10px',backgroundColor:'#2D5637',border:'0px',padding: '25px 5px'}"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="任务状态：完成" placement="top">
                <el-card
                  v-if="scope.row.task.status === 4"
                  :style="{width:'10px',backgroundColor:'#2f5c85',border:'0px',padding: '25px 5px'}"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="任务状态：超时" placement="top">
                <el-card
                  v-if="scope.row.task.status === 5"
                  :style="{width:'10px',backgroundColor:'#C64b2b',border:'0px',padding: '25px 5px'}"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="任务状态/进度" prop="status" width="180px" align="center">
            <template slot-scope="scope">
              {{ scope.row.task.status|taskStatus }}
              <el-progress
                v-if="scope.row.task.status != 3 && scope.row.task.status != 4"
                :stroke-width="12"
                :percentage="scope.row.task.schedule"
              />
              <div v-if="scope.row.task.status == 3">{{ scope.row.task.statements }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-tooltip content="打开任务" placement="top">
                <el-button
                  icon="el-icon-top-right"
                  type="text"
                  style="color:blue"
                  @click="openTaskDetail(scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="text-align: right">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="pageSizeList"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="MyTask.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="任务详情" name="second" disabled lazy>
        <detail
          ref="Detail"
          :log-list="LogList"
          :detail-loading="detailLoading"
          :logs-loading="logsLoading"
          :task-record="TaskRecord"
          :active-row="activeRow"
          @activename="activename"
          :os="os"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  queryMyTask,
  addTaskRecord,
  putTaskRecord,
  queryTaskRecord,
  queryTask,
  getStatusTaskList
} from '@/api/task'
import detail from './components/detail'
import approveLog from '@/views/components/approve-log'
import QWebChannel from './plugin/qwebchannel.js'
export default {
  name: 'MyTaskPlug',
  components: {
    detail,
    approveLog
  },
  data() {
    return {
      appManager: null,
      value1: false,
      id: this.$store.state.login.userInfo.id,
      activeName: 'first',
      loginMessage: this.$store.state.login.userInfo,
      MyTask: [],
      asset: {},
      project: {},
      currentPage: 1,
      pageSize:10,
      pageSizeList: [10, 30, 50, 100],
      TaskDetail: {
        asset: {
          name: ''
        },
        project: {
          image: ''
        }
      },
      LogList: [],
      detailLoading: false,
      logsLoading: false,
      TaskRecord: [],
      activeRow: {},
      tableLoading: false,
      StatusList: [
        {
          label: '暂停',
          value: 0
        },
        {
          label: '未开始',
          value: 1
        },
        {
          label: '进行中',
          value: 2
        },
        {
          label: '超时',
          value: 5
        }
      ],
      colSel: 'project_name',
      keyword: '',
      columnSelect: [
        {
          value: 'project_name',
          label: '项目名称'
        },
        {
          value: 'assetname',
          label: '镜头号/资产'
        },
        {
          value: 'start_date',
          label: '开始日期'
        },
        {
          value: 'end_date',
          label: '结束日期'
        },
        {
          value: 'status',
          label: '状态'
        }
      ],
      name: '',
      colShow: true,
      colSel2: [],
      columnSelect2: [],
      timeSelection: '',
      timeSelection2: '',
      currentGrade: null,
      os: 'windows'
    }
  },
  watch: {
    colSel: {
      handler: function(newVal, oldVal) {
        this.columnSelect2 = []
        switch (newVal) {
          case 'status':
            this.colShow = false
            this.columnSelect2 = [
              {
                value: 0,
                label: '暂停'
              },
              {
                value: 1,
                label: '未开始'
              },
              {
                value: 2,
                label: '进行中'
              },
              {
                value: 3,
                label: '审核中'
              },
              {
                value: 4,
                label: '完成'
              },
              {
                value: 5,
                label: '超时'
              },
              {
                value: 6,
                label: '反馈中'
              }
            ]
            break

          case 'start_date':
            this.colShow = false
            this.timeSelection = ''
            this.timeSelection2 = ''
            break
          case 'end_date':
            this.colShow = false
            this.timeSelection = ''
            this.timeSelection2 = ''
            break
          default:
            this.colShow = true
            this.colSel2 = []
            this.columnSelect2 = []
        }
      }
    }
  },
  created() {
    this.getTaskList()
    const self = this
    new QWebChannel(qt.webChannelTransport, ({ objects }) => {
      var appManager = objects.app_manager
      appManager.textChanged.connect(function(os) {
        if (os) {
          self.os = os
        }
      })
    })
  },
  mounted() {
    document.body.style.minWidth = 'auto'
  },
  methods: {
    getTaskList() {
      this.tableLoading = true
      let data = {}
      data = {
        status: '[0,1,2,5]'
      }
      getStatusTaskList(data)
        .then(({ data }) => {
          this.MyTask = [...data.msg]
          this.tableLoading = false
          // console.log(this.MyTask);
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    activename() {
      this.activeName = 'first'
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 搜索
    getMyTask() {
      let data = {}
      function DateFormat(dateVal) {
        return new Date(dateVal).toLocaleDateString()
      }
      switch (this.colSel) {
        case 'project_name':
          this.keyword &&
            (data = {
              ...data,
              project_name: this.keyword,
              pagenum: 20,
              page: 1
            })
          this.name = { project_name: this.keyword }
          break
        case 'assetname':
          this.keyword &&
            (data = { ...data, assetname: this.keyword, pagenum: 20, page: 1 })
          this.name = { assetname: this.keyword }
          break
        case 'start_date':
          if (!this.timeSelection && this.timeSelection2) {
            data = {
              ...data,
              start: '' + ',' + DateFormat(this.timeSelection2),
              pagenum: 20,
              page: 1
            }
          } else if (this.timeSelection && !this.timeSelection2) {
            data = {
              ...data,
              start: DateFormat(this.timeSelection) + ',' + '',
              pagenum: 20,
              page: 1
            }
          } else {
            data = {
              ...data,
              start:
                DateFormat(this.timeSelection) +
                ',' +
                DateFormat(this.timeSelection2),
              pagenum: 20,
              page: 1
            }
          }
          this.name = {
            start_date: DateFormat(this.timeSelection)
          }
          break
        case 'end_date':
          if (!this.timeSelection && this.timeSelection2) {
            data = {
              ...data,
              end: '' + ',' + DateFormat(this.timeSelection2),
              pagenum: 20,
              page: 1
            }
          } else if (this.timeSelection && !this.timeSelection2) {
            data = {
              ...data,
              end: DateFormat(this.timeSelection) + ',' + '',
              pagenum: 20,
              page: 1
            }
          } else {
            data = {
              ...data,
              end:
                DateFormat(this.timeSelection) +
                ',' +
                DateFormat(this.timeSelection2),
              pagenum: 20,
              page: 1
            }
          }
          this.name = { end_date: DateFormat(this.timeSelection) }
          break
        case 'status':
          if (this.colSel2.length) {
            data = {
              ...data,
              status: '[' + String(this.colSel2) + ']',
              pagenum: 20,
              page: 1
            }
            this.name = { status: '[' + String(this.colSel2) + ']' }
          }
          break
      }
      getStatusTaskList(data).then(({ data }) => {
        this.MyTask = [...data.msg]
        // this.authRole = data.auth.can_manage_material_state;
        this.currentPage = 1
      })
    },
    // 重置
    reMyTask() {
      let data = {}
      data = {
        status: '[0,1,2,5]',
        pagenum: this.pageSize,
        page: this.currentPage
      }
      getStatusTaskList(data).then(({ data }) => {
        this.MyTask = [...data.msg]
        //    this.currentPage = 1;
        this.keyword = ''
        this.colSel = 'project_name'
        this.colSel2 = []
        this.timeSelection = ''
        this.timeSelection2 = ''
      })
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      // console.log(this.pagesize);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      // console.log(this.currentPage);
    },
    // 解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    },
    openTaskDetail(row) {
      this.activeRow = { ...row }
      this.TaskRecord = Object.assign(
        {},
        {
          task_id: row.task.id,
          type: 0
        }
      )
      this.logsLoading = true

      queryTaskRecord({
        task_id: row.task.id
      })
        .then(({ data }) => {
          this.LogList = [...data.msg]
          this.logsLoading = false
        })
        .catch(() => {
          this.logsLoading = false
        })
      this.detailLoading = true
      this.$nextTick(() => {
        this.$refs['Detail'].getTaskDetail(row.task.id)
      })

      // queryTask({
      //   id: row.task.id
      // })
      //   .then(({ data }) => {
      //     this.TaskDetail = {
      //       ...data.msg
      //     };
      //     this.detailLoading = false;
      //   })
      //   .catch(() => {
      //     this.detailLoading = false;
      //   });
      this.activeName = 'second'
    }
  }
}
</script>

<style scoped>
</style>

