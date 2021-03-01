import {
  addTaskRecord,
  putTaskRecord,
  queryTaskRecord,
  queryTask,
  getStatusTaskList,
  getFeedback
} from '@/api/task'
import {
  getHistoryVersion,
  auth
} from '@/api/assets'
import {
  getProjects,gettestProjects
} from '@/api/project'
import draggable from 'vuedraggable'
import taskForm from './components/task-form'
import tabLog from './components/tab-log'
import tabApprove from './components/tab-approve'
import tabTaskDtail from './components/tab-task-detail'
import history from '@/views/task/components/tab-history'
import linkTaskOutput from "./components/tab-linkTaskOutput"
import approveLog from '@/views/components/approve-log'
import thumbtackMixin from '@/utils/thumbtack-mixin'
import dayjs from 'dayjs'
import assetDrawer from '@/views/projects/components/ShowDrawer/assetDrawer'
import info from '@/components/projectDrawer/components/info'
export default {
  mixins: [thumbtackMixin],
  components: {
    draggable,
    tabApprove,
    taskForm,
    tabLog,
    tabTaskDtail,
    approveLog,
    history,
    assetDrawer,
    info,
    linkTaskOutput
  },
  data() {
    return {
      authAsset: null,
      activeTab: 'second',
      TaskDetail: {
        name: ''
      },
      detailLoading: false,
      show_project_image: true,
      logsLoading: false,
      LogList: [],
      isDrag: false,
      isDrawerShow: false,
      StatusList: [{
        label: '暂停',
        value: 0
      }, {
        label: '未开始',
        value: 1
      }, {
        label: '进行中',
        value: 2
      },
      {
        label: '超时',
        value: 5
      }
      ],
      createLoading: false,
      TaskRecord: {},
      isDialogShow: false,
      MyTaskList: [],
      MyTaskList1: [],
      // Allnum:[],
      DraftArr: [],
      InProgressArr: [],
      TimeOutArr: [],
      FinishedArr: [],
      PauseArr: [],
      // PassArr : [],
      ApproveingArr: [],
      taskList: [{
        value: '1',
        label: '任何项目'
      }],
      taskProgress: [{
        value: '1',
        label: '任何备注'
      },
      {
        value: '2',
        label: '已完成'
      },
      {
        value: '3',
        label: '未完成'
      }
      ],
      typeList: [{
        value: '1',
        label: '任何类型'
      },
      {
        value: '2',
        label: '备注'
      },
      {
        value: '3',
        label: '资产上传'
      },
      {
        value: '4',
        label: '状态更改'
      },
      {
        value: '5',
        label: '任务分配'
      }
      ],
      taskTime: [{
        value: '1',
        label: '昨天'
      },
      {
        value: '2',
        label: '上星期'
      },
      {
        value: '3',
        label: '最近一个月'
      }
      ],
      options: [{
        value: '1',
        label: '截止时间'
      },
      {
        value: '2',
        label: '项目'
      },
      {
        value: '3',
        label: '状态'
      },
      {
        value: '4',
        label: '父级'
      },
      {
        value: '5',
        label: '优先级'
      }
      ],
      value1: [],
      value2: [],
      value3: [],
      value4: [],
      taskAvailableSel: [],
      notStartedSel: [],
      inProgressSel: [],
      doneSel: [],
      taskListSortSel: [],
      taskListProgramSel: [],
      taskListProgressSel: [],
      checked: false,
      Asset: '',
      Link: '',
      changecolor: 1,
      activeRow: {}, // 点击任务列表选中的列的数据
      keyword: '',
      colSel: 'name',
      columnSelect: [{
        value: 'name',
        label: '任务名称'
      }, {
        value: 'project_name',
        label: '项目名称'
      },
      {
        value: 'priority',
        label: '优先等级'
      },
      {
        value: 'start_date',
        label: '开始日期'
      },
      {
        value: 'end_date',
        label: '截止日期'
      },
      {
        value: 'grade',
        label: '难度'
      }
      ],
      columnSelect2: [{
        value: 0,
        label: '低'
      },
      {
        value: 1,
        label: '中'
      },
      {
        value: 2,
        label: '高'
      }
      ],
      colSel2: [],
      timeSelection: '',
      timeSelection2: '',
      historyVersion: [],
      project: {},
      testproject:{},
      project_id:null,
      testproject_id:null,
      configImg:'',
      assetId: null,
      currentGrade: null,
      GradeList: [{
        label: 'A+',
        value: 0
      },
      {
        label: 'A',
        value: 1
      },
      {
        label: 'A-',
        value: 2
      }, {
        label: 'B+',
        value: 3
      },
      {
        label: 'B',
        value: 4
      },
      {
        label: 'B-',
        value: 5
      }, {
        label: 'C+',
        value: 6
      },
      {
        label: 'C',
        value: 7
      },
      {
        label: 'D+',
        value: 8
      },
      {
        label: 'D',
        value: 9
      },
      {
        label: 'E',
        value: 10
      }
      ],
      sortfilter: null, // 保存单列排序的条件
      valSel: null, // 保存table表内筛选（状态、难度、优先级）的条件
      cutType: -1, // 分页类别区分
      filterStatus: [],
      assetShow: false,
      surplus_labor_hour: null,
      statusNumber: [],
      pageCount: 0,
      total: 0,
      currentPage: 1,
      pageSize:10,
      pageSizeList: [10, 30, 50, 100],
      currentPage1: 1, // 我的反馈分页
      pageSize1: 20,
      FeedbackList: {
        msg: []
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$store.state.mine.task_id) {
        vm.show(vm.$store.state.mine.task_id)
        vm.$store.commit('mine/setTaskId')
      }
    })
  },
  methods: {
    // 分页
    handleSizeChange1(e) {
      this.pageSize1 = e
      this.getFeedback()
    },
    handleCurrentChange1(currentPage1) {
      this.currentPage1 = currentPage1
      this.getFeedback()
    },

    // 单条件排序
    sortFilter({
      column,
      prop,
      order
    }, Type) {
      const status = this.changecolor
      this.sortfilter = {
        column,
        prop,
        order
      }
      this.cutType = 3
      if (status === 6) {
        let data = {
          mytask: null,
          sort: order === 'descending' ? '-' + prop : prop,
          status: '[0,1,2,5]',
          pagenum: this.pageSize,
          page: this.currentPage

        }
        if (Type === 2) {
          // 处理分页
          data = {
            ...data,
            pagenum: this.pageSize,
            page: this.currentPage
          }
        }
        getStatusTaskList(data).then(({
          data
        }) => {
          if (data.status === 0) {
            this.MyTaskList1 = [...data.msg]
            if (Type === 1) {
              this.currentPage = 1
            }
          }
        })
      } else if (status == null) {
        let data = {
          mytask: null,
          sort: order === 'descending' ? '-' + prop : prop,
          status: '[0,1,2,3,4,5]',
          pagenum: this.pageSize,
          page: this.currentPage
        }
        if (Type === 2) {
          // 处理分页
          data = {
            ...data,
            pagenum: this.pageSize,
            page: this.currentPage
          }
        }
        getStatusTaskList(data).then(({
          data
        }) => {
          if (data.status === 0) {
            this.MyTaskList1 = [...data.msg]
            if (Type === 1) {
              this.currentPage = 1
            }
          }
        })
      } else {
        let data = {
          mytask: null,
          sort: order === 'descending' ? '-' + prop : prop,
          status: '[' + status + ']',
          pagenum: this.pageSize,
          page: this.currentPage
        }
        if (Type === 2) {
          // 处理分页
          data = {
            ...data,
            pagenum: this.pageSize,
            page: this.currentPage
          }
        }
        getStatusTaskList(data).then(({
          data
        }) => {
          if (data.status === 0) {
            this.MyTaskList1 = [...data.msg]
            if (Type === 1) {
              this.currentPage = 1
            }
          }
        })
      }
    },
    // table表内筛选（状态）+分页
    filterHandler(val, Type) {
      this.cutType = 4
      this.valSel = val
      if (val.schedule) {
        this.filterStatus = []
        this.filterStatus = [...val.schedule]
        this.filterStatus.forEach((item, index) => {
          item = Number(item)
          this.filterStatus[index] = item
        })
      }
      let data = {
        mytask: null,
        pagenum: 20,
        page: 1
      }
      if (Type === 2) {
        // 处理分页
        data = {
          ...data,
          pagenum: this.pageSize,
          page: this.currentPage
        }
      }
      if (this.filterStatus.length) {
        data = {
          ...data,
          status: '[' + String(this.filterStatus) + ']'
        }
      }
      getStatusTaskList(data).then(({
        data
      }) => {
        if (data.status === 0) {
          this.MyTaskList1 = [...data.msg]
          if (Type === 1) {
            this.currentPage = 1
          }
        }
      })
    },
    // 表内单元格样式（状态、优先级改变背景色）
    cellStyle({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (column.property === 'task.priority') {
        switch (row.task.priority) {
          case 2:
            return {
              background: '#C64b2b',
              color: '#FFFFFF'
            }
        }
      } else if (column.property === 'task.grade') {
        switch (row.task.grade) {
          case 0:
            return {
              background: '#C64b2b',
              color: '#FFFFFF'
            }
        }
      }
      return {
        borderRight: 0
      }
    },
    getstatus(data) {
      return getStatusTaskList(data).then(({
        data
      }) => {
        this.MyTaskList1 = [...data.msg]
        switch (this.changecolor) {
          case null:
            this.total = this.statusNumber.all_num ? this.statusNumber.all_num : 0
            break
          case 6:
            this.total = (this.statusNumber.timeout_num ? this.statusNumber.timeout_num : 0) +
              (this.statusNumber.pause_num ? this.statusNumber.pause_num : 0) +
              (this.statusNumber.not_start_num ? this.statusNumber.not_start_num : 0) +
              (this.statusNumber.ongoing_num ? this.statusNumber.ongoing_num : 0)
            break
          case 1:
            this.total = this.statusNumber.not_start_num ? this.statusNumber.not_start_num : 0
            break
          case 2:
            this.total = this.statusNumber.ongoing_num ? this.statusNumber.ongoing_num : 0
            break
          case 0:
            this.total = this.statusNumber.pause_num ? this.statusNumber.pause_num : 0
            break
          case 3:
            this.total = this.statusNumber.in_review_num ? this.statusNumber.in_review_num : 0
            break
          case 5:
            this.total = this.statusNumber.timeout_num ? this.statusNumber.timeout_num : 0
            break
          case 4:
            this.total = this.statusNumber.accomplish_num ? this.statusNumber.accomplish_num : 0
            break
        }
        // this.total = this.statusNumber.all_num ? this.statusNumber.all_num : 0;
        this.pageCount = data.page_count
      })
    },
    search(data) {
      function DateFormat(dateVal) {
        return dayjs(dateVal).format('YYYY/MM/DD')
      }
      switch (this.colSel) {
        case 'name':
          this.keyword && (data = {
            ...data,
            name: this.keyword
          })
          break
        case 'project_name':
          this.keyword && (data = {
            ...data,
            project_name: this.keyword
          })
          break
        case 'grade':
          data = {
            ...data,
            grade: JSON.stringify(this.currentGrade)
          }
          break
        case 'start_date':
          if (!this.timeSelection && this.timeSelection2) {
            data = {
              ...data,
              start: '' + ',' + DateFormat(this.timeSelection2)
            }
          } else if (this.timeSelection && !this.timeSelection2) {
            data = {
              ...data,
              start: DateFormat(this.timeSelection) + ',' + ''
            }
          } else {
            data = {
              ...data,
              start: DateFormat(this.timeSelection) +
                ',' +
                DateFormat(this.timeSelection2)
            }
          }
          break
        case 'end_date':
          if (!this.timeSelection && this.timeSelection2) {
            data = {
              ...data,
              end: '' + ',' + DateFormat(this.timeSelection2)
            }
          } else if (this.timeSelection && !this.timeSelection2) {
            data = {
              ...data,
              end: DateFormat(this.timeSelection) + ',' + ''
            }
          } else {
            data = {
              ...data,
              end: DateFormat(this.timeSelection) +
                ',' +
                DateFormat(this.timeSelection2)
            }
          }
          break
        case 'priority':
          if (this.colSel2.length) {
            data = {
              ...data,
              priority: JSON.stringify(this.colSel2)
            }
            this.name = {
              priority: JSON.stringify(this.colSel2)
            }
          }
          break
      }
      this.getstatus(data)
    },
    // 点击筛选任务
    task(status) {
      this.changecolor = status
      let data = {
        mytask: null,
        pagenum: this.pageSize,
        page: this.currentPage
      }
      switch (this.changecolor) {
        case 6:
          data = {
            ...data,
            status: '[0,1,2,5]'
          }
          break
        case null:
          data = {
            ...data,
            status: '[0,1,2,3,4,5]'
          }
          break
        default:
          data = {
            ...data,
            status: '[' + status + ']'
          }
          break
      }

      this.search(data)
      // this.getstatus(data);
    },
    // 筛选重置
    reTask(status) {
      this.keyword = ''
      this.colSel = 'name'
      this.colSel2 = []
      this.timeSelection = ''
      this.timeSelection2 = ''
      if (status === 6) {
        const data = {
          mytask: null,
          status: '[0,1,2,5]'
        }
        this.getstatus(data)
      } else if (status == null) {
        const data = {
          mytask: null,
          status: '[0,1,2,3,4,5]'
        }
        this.getstatus(data)
      } else {
        const data = {
          mytask: null,
          status: '[' + status + ']'
        }
        this.getstatus(data)
      }
    },
    // 表格中的快捷下拉切换任务状态
    statusChange(status, row) {
      const loading = this.$loading({
        fullscreen: true
      })
      putTaskRecord({
        method: 'put',
        id: row.task.id,
        status
      }).then(({
        data
      }) => {
        loading.close()
        if (data.status === 0) {
          row.task.status = status
          if (status === 0) {
            status = '暂停'
          }
          if (status === 1) {
            status = '未开始'
          }
          if (status === 2) {
            status = '进行中'
          }

          this.$message.success('任务' + row.task.id + '状态已更改为：' + status)
          this.resetTasks()
        } else {
          this.$message.warning(data.msg)
        }
      }).catch(() => {
        loading.close()
      })
    },
    checkMove() {
      return false
    },
    handelChanged(e) {
      const self = this
      if (e.to.dataset.arr === e.from.dataset.arr) {
        return false
      }
      let status = -1
      switch (e.to.dataset.arr) {
        case 'PauseArr':
          status = 0
          break
        case 'DraftArr':
          status = 1
          break
        case 'InProgressArr':
          status = 2
          break
        case 'ApproveingArr':
          status = 3
          break
        case 'FinishedArr':
          status = 4
          break
        case 'TimeOutArr':
          status = 5
          break
      }
      const loading = this.$loading({
        fullscreen: true
      })
      putTaskRecord({
        method: 'put',
        id: e.item.dataset.taskid,
        status
      }).then(({
        data
      }) => {
        loading.close()
        if (data.status === 0) {
          this[e.to.dataset.arr][e.newIndex]['status'] = status
          self.resetTasks()
          this.$message.success(data.msg)
        } else {
          this.$message.warning(data.msg)
        };
        this.getstatusNumber();
      }).catch(() => {
        loading.close()
        self.resetTasks()
      });
    },
    cancel() {
      this.isDialogShow = false
    },
    openDialog(obj) {
      this.isDialogShow = true
      this.TaskRecord = Object.assign({}, {
        task_id: obj.id,
        type: 0,
        date: new Date().toLocaleDateString()
      })
      queryTask({
        id: obj.id
      }).then(({
        data
      }) => {
        this.surplus_labor_hour = data.msg.surplus_labor_hour
      })
    },
    addRecord() {
      this.createLoading = true

      addTaskRecord(this.TaskRecord)
        .then(res => {
          if (res.data.status === 0) {
            this.$message.success(res.data.msg)
            this.getMyTasks()
          } else {
            this.$message.warning(res.data.msg)
          }
          this.isDialogShow = false
          this.createLoading = false
          this.isDrawerShow = false
        })
        .catch(() => {
          this.createLoading = false
        })
    },
    // 双击一行弹出任务侧边栏
    editCell(row) {
      this.taskBoardRightShow(row)
    },
    // 是否显示任务板右侧
    taskBoardRightShow(row) {
      // this.project = row.project
      this.project_id = row.project.id
      this.assetId = row.asset.id
      this.isDrawerShow = true
      this.activeRow = {
        ...row
      }
      this.TaskRecord = Object.assign({}, {
        task_id: row.task.id,
        type: 0,
        date: new Date().toLocaleDateString()

      })
      this.$refs["linkTaskOutput"].getlinkTaskOutput(row.task.id);
      if(this.activeRow.task && this.activeRow.task.status === 2){

        this.$nextTick(() => { this.$refs["tabApprove"].getMakeQequire(row.task.id);})
      }
     
     // this.$refs["tabApprove"];
      // console.log('11111111')
      // console.log( this.$refs)
      this.logsLoading = true
      this.$refs['taskApprovelog'].getApproveLog(row.task.id)
      queryTaskRecord({
        task_id: row.task.id
      }).then(({
        data
      }) => {
        this.LogList = [...data.msg]
        this.logsLoading = false
      }).catch(() => {
        this.logsLoading = false
      })
      this.detailLoading = true
      this.$nextTick(() => {
        this.$refs['taskDetail'].getDetail(row.task.id)
      })

      queryTask({
        id: row.task.id
      }).then(({
        data
      }) => {
        this.TaskDetail = {
          ...data.msg
        }
        this.surplus_labor_hour = data.msg.surplus_labor_hour
        this.Asset = this.TaskDetail.asset
        this.Link = this.TaskDetail.link_dept_name
      }).finally(() => {
        this.detailLoading = false
      })
      getHistoryVersion({
        asset_id: row.asset.id
      }).then(({
        data
      }) => {
        this.historyVersion = [...data.msg]
      })
       this.getProjectDetail()
      gettestProjects({id:this.project_id}).then(({ data })=>{
        if(data.msg.id!=undefined){
          this.testproject_id=data.msg.id
          gettestProjects({id:this.testproject_id}).then(({ data })=>{  
            this.project=data.msg
          })
        }
        
      })
    },
    getProjectDetail() {
        getProjects({ id: this.project_id }).then(({ data }) => {
          this.project = data.msg;
          this.task(this.changecolor);
        });
    },
    // 任务板展示更多跳转任务列表
    openList(status) {
      this.activeTab = 'second'
      this.task(status)
    },
    // 展示资产侧栏
    show(id) {
      this.assetShow = true
      // 获取项目操作资产权限
      auth().then(({
        data
      }) => {
        if (data.status === 0) {
          this.authAsset = data.auth.manage_asset
        }
      })
      this.$refs['assetDrawer'].show(id)
    },

    getAssetVersion() {
      getHistoryVersion({
        asset_id: this.assetId
      }).then(({
        data
      }) => {
        this.historyVersion = [...data.msg]
      })
    },
    // http获取所有‘我的任务’列表
    getMyTasks() {
      return getStatusTaskList().then(({
        data
      }) => {
        this.MyTaskList = [...data.msg];
        this.resetTasks();
      })
    },
    // 按状态划分我的任务
    resetTasks() {
      // 暂停 0
      this.PauseArr = []
      // 未开始 1
      this.DraftArr = []
      // 进行中 2
      this.InProgressArr = []
      // 审核中 3
      this.ApproveingArr = []
      // 完成 4
      this.FinishedArr = []
      // 超时 5
      this.TimeOutArr = []
      this.MyTaskList.forEach(item => {
        switch (item.task.status) {
          case 0:
            this.PauseArr.push(item.task)
            break
          case 1:
            this.DraftArr.push(item.task)
            break
          case 2:
            this.InProgressArr.push(item.task)
            break
          case 3:
            this.ApproveingArr.push(item.task)
            break
          case 4:
            this.FinishedArr.push(item.task)
            break
          case 5:
            this.TimeOutArr.push(item.task)
        }
      })
    },
    getstatusNumber() {
      return getStatusTaskList({
        number: ''
      }).then(({
        data
      }) => {
        this.statusNumber = data
      })
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      // this.task(this.changecolor);
      switch (this.cutType) {
        case 3:
          this.sortFilter(this.sortfilter, 2) // 单条件排序分页查看
          break
        case 4:
          this.filterHandler(this.valSel, 2) // table表内状态、难度和优先级排序分页查看
          break
        case -1:
          this.task(this.changecolor) // 正常请求后分页
          break
      }
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      // this.task(this.changecolor);
      switch (this.cutType) {
        case 3:
          this.sortFilter(this.sortfilter, 2) // 单条件排序分页查看
          break
        case 4:
          this.filterHandler(this.valSel, 2) // table表内状态、难度和优先级排序分页查看
          break
        case -1:
          this.task(this.changecolor) // 正常请求后分页
          break
      }
    },
    // 解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    },
    // 获取我的反馈 分页数据
    getFeedback() {
      const PARAMS = {
        page: this.currentPage1,
        pagenum: this.pageSize1
      }
      getFeedback(PARAMS).then(res => {
        if (res.data.status === 0) {
          this.FeedbackList = {
            ...res.data
          }
        } else {
          this.$message.error('审批反馈：' + res.data.msg)
        }
      })
    }
  },
  computed: {
    topArr() {
      return [{
        title: '所有任务',
        status: null,
        num: this.statusNumber.all_num ? this.statusNumber.all_num : 0
      },
      {
        title: '未完成',
        status: 6,
        num: (this.statusNumber.timeout_num ? this.statusNumber.timeout_num : 0) +
            (this.statusNumber.pause_num ? this.statusNumber.pause_num : 0) +
            (this.statusNumber.not_start_num ? this.statusNumber.not_start_num : 0) +
            (this.statusNumber.ongoing_num ? this.statusNumber.ongoing_num : 0)
      },
      {
        title: '未开始',
        status: 1,
        num: this.statusNumber.not_start_num ? this.statusNumber.not_start_num : 0
      },
      {
        title: '进行中',
        status: 2,
        num: this.statusNumber.ongoing_num ? this.statusNumber.ongoing_num : 0
      },
      {
        title: '暂停',
        status: 0,
        num: this.statusNumber.pause_num ? this.statusNumber.pause_num : 0
      },
      {
        title: '审核中',
        status: 3,
        num: this.statusNumber.in_review_num ? this.statusNumber.in_review_num : 0
      },
      {
        title: '超时',
        status: 5,
        num: this.statusNumber.timeout_num ? this.statusNumber.timeout_num : 0
      },
      {
        title: '完成',
        status: 4,
        num: this.statusNumber.accomplish_num ? this.statusNumber.accomplish_num : 0
      }

        // {
        //     title: '审核通过',
        //     status: 6,
        //     num: this.PassArr.length
        // }
      ]
    },
    searchId() {
      return this.$store.state.mine.taskId
    }
  },
  watch: {
    searchId(val) {
      if (val > 0) {
        const row = this.MyTaskList1.find(t => {
          return t.task.id === val
        })
        if (row) {
          this.taskBoardRightShow(row)
        } else {
          this.$message.error('未找到匹配的任务')
        }
        this.$store.commit('mine/setTaskId')
      }
    },
    MyTaskList1: {
      handler: function(val) {
        if (this.searchId > 0) {
          const row = val.find(t => {
            return t.task.id === this.searchId
          })
          if (row) {
            this.taskBoardRightShow(row)
          } else {
            this.$message.error('未找到匹配的任务')
          }
          this.$store.commit('mine/setTaskId')
        }
      },
      deep: true
    }
  },
  created() {
    this.getMyTasks()
    this.getstatusNumber()
    this.getFeedback()
    // 首页中传递过来的字段
    switch (this.$store.state.mine.keyword) {
      case 'priority':
        this.colSel = 'priority'
        this.colSel2 = [2]
        break
      case 'grade':
        this.colSel = 'grade'
        this.currentGrade = [0, 1, 2]
        break
      case 'expire':
        this.colSel = 'end_date'
        this.timeSelection = dayjs(new Date())
        this.timeSelection2 = dayjs(new Date()).add(1, 'day')
        break
    }
    this.$nextTick(() => {
      this.task(6)
      // 清空store中的 state.mine.keyword
      this.$store.commit('mine/SET_KEYWORD', '')
    })
  }
}
