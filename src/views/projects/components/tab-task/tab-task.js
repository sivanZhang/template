import {
  getProjectMember,
  getEpisodeSession,
  getOneProjectLinks,
  getProjectTaskMember
} from '@/api/statistics'
import {
  setupMenu,
  getMenu
} from '@/api/project'
import * as HTTP from '@/api/task'
import {
  Transform
} from 'stream'
import myMixin from '../mixins'
import {
  mapState
} from 'vuex'
import {
  getDeptUsers,
  getDept
} from '@/api/admin'
import {
  queryAssets,
  getHistoryVersion,
  auth
} from '@/api/assets'
import {
  getLinks,
  getLink,
  addLinks
} from '@/api/links'
import thumbtackMixin from '@/utils/thumbtack-mixin'
import {
  getProjectJoinMeb
} from '@/api/training'
import taskMulSel from '@/views/projects/components/mulConditionSel/taskMulSel'
import taskFilter from '@/views/projects/components/filterCondition/taskFilter'
import taskSel from '@/views/projects/components/oneConditionSel/taskSel'
import assetDrawer from '@/views/projects/components/ShowDrawer/assetDrawer'
import taskDrawer from '@/views/projects/components/ShowDrawer/taskDrawer'

export default {
  mixins: [myMixin, thumbtackMixin],
  name: 'tab-task',
  data() {
    return {
      rememberLoading: false,
      showdrawer: false,
      assetShow: false,
      authTask: null,
      uploadVisible: false,
      activeTab: 'first',
      tableLoading: false, // 表格加载状态
      total: 0,
      pageCount: 0,
      TaskList: [],
      DeptUsers: [],
      isDialogShow: false,
      isLinkDialogShow: false,
      buttonStates: {
        createLoading: false
      },
      ActiveRow: {},
      DialogType: null,
      dialogTitle: '',
      mainTaskShow: false,
      active: 0,
      asset: null,
      asset_type: null,
      AssetListTask: null,
      optionAssetType: null,
      columnSelect2: [], // 执行人列表
      columnSelect3: [], // 集数列表
      columnSelect4: [], // 场次列表
      colomnSelect5: [], // 环节列表
      LinkList: [],
      FormList: [{}],
      selectList: [],
      createLoading: false,
      multipleSelection: [],
      path: null,
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [20, 50, 100],
      show_name: false,
      show_link_dept_name: false,
      show_content: false,
      show_project_name: false,
      show_project_image: false,
      show_asset_name: false,
      show_priority: false,
      show_grade: false,
      show_status: false,
      show_executor: false,
      show_episode: false,
      show_session: false,
      show_creator_name: false,
      show_create_time: false,
      show_start_date: false,
      show_end_date: false,
      show_total_hour: false,
      show_schedule: false,
      filterStatus: [],
      filterSession: [],
      filterEpisode: [],
      filterPriority: [],
      filterDept: [],
      filterGrade: [],
      filterExecutor: [],
      sort: null,
      propName: null,
      sortFunction: null,
      Assetcontent: null,
      datacontent: null,
      multiSelect: [],
      name: '',
      linkstart: null,
      linkend: null,
      trainingMenber: [],
      mulEditDialog: false,
      updateMulTask: {},
      value1: '否',
      value2: '否',
      value3: '否',
      value4: '否',
      value5: '否',
      value6: '否',
      value7: '否',
      value8: '否',
      sortSelForm: {}, // 保存多列筛选条件
      sortfilter: null, // 保存单列排序的条件
      valSel: null, // 保存table表内筛选（状态、难度、优先级）的条件
      cutType: -1, // 分页类别区分
      oneSel: null, // 保存单列筛选的条件
      authAsset: null,
      curHeight: 0,
      cellCol: null,
      dbCell: false,
      cellId: null,
      editing: false,
      clickId: null,
      iconShow: false,
      LevelList: [{
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
      },
      {
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
      },
      {
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
      start_date: null,
      end_date: null,
      disabled1: true,
      disabled2: true,
      disabled3: true,
      disabled4: true,
      disabled5: true,
      disabled6: true,
      disabled7: true,
      disabled8: true,
      cache: null,
      visible: false,
      checkList: [],
      SaveDialogVisible: false,
      executorList: []
    }
  },
  beforeMount() {
    var h = document.documentElement.clientHeight || document.body.clientHeight
    this.curHeight = h - 329 // 减去页面上固定高度height
    // console.log(h);
  },
  filters: {
    executorFilter(val) {
      const arr = []
      val.forEach(item => {
        arr.push(item.name)
      })
      return arr.join()
    },
    categoryFilter(obj) {
      if ('name' in obj) {
        return obj['name']
      } else {
        return ''
      }
    }
  },
  computed: {
    ...mapState('admin', ['DeptList', 'UserList'])
  },
  components: {
    taskMulSel,
    taskFilter,
    taskSel,
    assetDrawer,
    taskDrawer
  },
  props: {
    AssetList: {
      type: Array
    }
  },
  watch: {
    active: {
      handler: function(newVal, oldVal) {
        if (newVal === 1 && this.TaskForm.asset) {
          // console.log(this.TaskForm.asset);

          getLinks({
            asset: this.TaskForm.asset
          }).then(({
            data
          }) => {
            const linkData = [...data.msg]
            this.LinkList = []
            linkData.forEach(item => {
              item.forEach(ct => {
                this.LinkList.push(ct)
              })
            })
            const linktime = this.LinkList[0].date_and_user
            this.linkstart = linktime.date_start
            this.linkend = linktime.date_end
          })
        }
        if (oldVal === 1 && this.TaskForm.link_id) {
          getLink({
            link: this.TaskForm.link_id
          }).then(({
            data
          }) => {
            this.TaskForm.content = data.msg.content
            return getDeptUsers({
              id: data.msg.dept.id
            })
          }).then(res => {
            this.DeptUsers = [...res.data.users]
          })
        } else {
          return
        }
      }
    }
  },
  methods: {
    //
    get_RowDeptUsers(id, e = true) {
      if (!e) {
        return
      }
      getDeptUsers({
        id
      }).then(({
        data
      }) => {
        this.executorList = data.users
        if (data.users.length) {
          this.executorList.forEach(t => {
            t['name'] = t['username']
          })
        }
      })
    },
    // 保存说明
    openExplain() {
      this.SaveDialogVisible = true
    },
    // 永久保存
    saveLongMenu() {
      if (this.show_name == true) {
        this.checkList.push('任务名称')
      }
      if (this.show_link_dept_name == true) {
        this.checkList.push('环节')
      }
      if (this.show_content == true) {
        this.checkList.push('制作内容')
      }
      if (this.show_project_image == true) {
        this.checkList.push('缩略图')
      }
      if (this.show_asset_name == true) {
        this.checkList.push('镜头号')
      }
      if (this.show_episode == true) {
        this.checkList.push('集数')
      }
      if (this.show_session == true) {
        this.checkList.push('场次')
      }
      if (this.show_priority == true) {
        this.checkList.push('优先级')
      }
      if (this.show_grade == true) {
        this.checkList.push('难度')
      }
      if (this.show_status == true) {
        this.checkList.push('状态')
      }
      if (this.show_creator_name == true) {
        this.checkList.push('创建者')
      }
      if (this.show_executor == true) {
        this.checkList.push('执行人')
      }
      if (this.show_schedule == true) {
        this.checkList.push('任务进度')
      }
      if (this.show_create_time == true) {
        this.checkList.push('创建日期')
      }
      if (this.show_start_date == true) {
        this.checkList.push('开始日期')
      }
      if (this.show_end_date == true) {
        this.checkList.push('截止日期')
      }
      if (this.show_total_hour == true) {
        this.checkList.push('预设时间（小时）')
      }
      this.rememberLoading = true
      setupMenu({
        menu_type: 0,
        menu_list: String(this.checkList)
      }).then(
        ({
          data
        }) => {
          this.visible = false
        }
      ).finally(()=>{
        this.rememberLoading = true
      })
    },
    // 获取菜单设置
    getMenuList() {
      getMenu({
        menu_type: 0
      }).then(({
        data
      }) => {
        if (data.msg != '') {
          [...data.msg].map(item => {
            switch (item) {
              case '任务名称':
                this.show_name = true
                break
              case '环节':
                this.show_link_dept_name = true
                break
              case '制作内容':
                this.show_content = true
                break
              case '缩略图':
                this.show_project_image = true
                break
              case '镜头号':
                this.show_asset_name = true
                break
              case '集数':
                this.show_episode = true
                break
              case '场次':
                this.show_session = true
                break
              case '优先级':
                this.show_priority = true
                break
              case '难度':
                this.show_grade = true
                break
              case '状态':
                this.show_status = true
                break
              case '创建者':
                this.show_creator_name = true
                break
              case '执行人':
                this.show_executor = true
                break
              case '任务进度':
                this.show_schedule = true
                break
              case '创建日期':
                this.show_create_time = true
                break
              case '开始日期':
                this.show_start_date = true
                break
              case '截止日期':
                this.show_end_date = true
                break
              case '预设时间（小时）':
                this.show_total_hour = true
                break
            }
          })
        } else {
          this.show_asset_name = true
          this.show_project_image = true
          this.show_episode = true
          this.show_session = true
          this.show_content = true
          this.show_link_dept_name = true
          this.show_end_date = true
          this.show_executor = true
          this.show_status = true
          this.show_schedule = true
          this.show_priority = true
          this.show_grade = true
          this.show_start_date = true
          this.show_total_hour = true
          this.show_name = true
          this.show_create_time = true
          this.show_creator_name = true
        }
      })
    },
    renderheader(h, {
      column,
      $index
    }) {
      return h('span', {}, [
        h('span', {}, column.label.split('|')[0]),
        // h('br'), //有bug
        h('span', {}, column.label.split('|')[1])
      ])
    },

    getProjectNum() {
      // 获取执行人的列表
      getProjectTaskMember({
        id: this.$route.params.id
      }).then(
        ({
          data
        }) => {
          [...data.msg].map(item => {
            this.columnSelect2.push({
              value: item.userid,
              text: item.username
            })
          })
        }
      )
      // 获取集数列表
      getEpisodeSession({
        id: this.$route.params.id,
        episode: ''
      }).then(
        ({
          data
        }) => {
          [...data.msg].map(item => {
            this.columnSelect3.push({
              value: item,
              text: item
            })
          })
        }
      )
      //  //获取场次列表
      getEpisodeSession({
        id: this.$route.params.id,
        session: ''
      }).then(
        ({
          data
        }) => {
          [...data.msg].map(item => {
            this.columnSelect4.push({
              value: item,
              text: item
            })
          })
        }
      )
      //  获取所有环节列表
      getOneProjectLinks({
        id: this.$route.params.id,
        dept: ''
      }).then(({
        data
      }) => {
        [...data.msg].map(item => {
          this.colomnSelect5.push({
            value: item.dept__id,
            text: item.dept__name
          })
        })
      })
    },
    // 是否显示行内修改框
    showEditIcon(index, row) {
      this.iconShow = true
      // this.rowClick = true;
      const arr = ['executor', 'priority', 'grade', 'start_date', 'end_date']
      // 这些项在改动时直接保存
      if (arr.includes(this.cellCol)) {
        this.saveEdit(index, row)
      }
    },
    // 双击修改单元格获取焦点
    editCell(row, column) {
      if (this.authTask) {
        if (column.columnKey === 'executor') {
          this.get_RowDeptUsers(row.link_dept)
        }
        this.cellCol = column.columnKey
        this.dbCell = true
        this.cellId = row.id
        // 为修改失败后重新回原值加的缓存
        const index = this.TaskList.findIndex(t => t.id === this.cellId)
        const newObj = this.TaskList[index] instanceof Object ? JSON.parse(JSON.stringify(this.TaskList[index])) : this.TaskList[index]
        this.cache = {
          index,
          row: newObj
        }
      }
    },
    // 行内修改资产保存
    saveEdit(index, row) {
      function DateFormat(dateVal) {
        return new Date(dateVal).toLocaleDateString()
        // 'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
      }
      this.iconShow = false
      this.dbCell = false
      const payload = {
        id: row.id,
        content: row.content,
        priority: row.priority,
        grade: row.grade,
        ...this.ImgForm,
        name: row.name,
        method: 'put',
        start_date: DateFormat(this.start_date),
        end_date: DateFormat(this.end_date)
      }
      if (this.cellCol === 'executor') {
        payload.associatedlist = row.executor.map(t => t.id).join()
      }
      if (payload.start_date === 'Invalid Date') {
        delete payload.start_date
      }
      if (payload.end_date === 'Invalid Date') {
        delete payload.end_date
      }
      HTTP.putTask(payload)
        .then(({
          data
        }) => {
          if (data.status === 0) {
            this.$message.success(data.msg)
            this.editing = false
          } else {
            // 失败后还原原数据
            this.TaskList[this.cache.index] = this.cache.row
            this.$message.error(data.msg)
          }
          this.getProjectNum()
        })
        .catch(() => {
          // 失败后还原原数据
          this.TaskList[this.cache.index] = this.cache.row
        })
    },
    getAssetList() {
      return
    },
    // 重置筛选条件展示
    selRefresh() {
      this.$refs['taskFilter'].showMul()
    },
    // 删除筛选条件，剩余条件再搜索 +分页
    closeSelectedTag(sortSelForm, Type) {
      this.sortSelForm = sortSelForm
      this.cutType = 2
      let data = {
        ...sortSelForm,
        project: this.$route.params.id
      }
      if (Type === 1) {
        // 正常筛选
        data = {
          ...data,
          pagenum: 20,
          page: 1
        }
      } else {
        // 处理分页
        data = {
          ...data,
          pagenum: this.pageSize,
          page: this.currentPage
        }
      }
      this.multiSelect = sortSelForm
      this.tableLoading = true
      HTTP.queryTask(data)
        .then(({
          data
        }) => {
          if (data.status === 0) {
            this.TaskList = [...data.msg]
            this.authTask = data.auth.manage_task
            this.total = data.count
            this.pageCount = data.page_count
            this.visible2 = false
            if (Type === 1) {
              this.currentPage = 1
            }
          }
          this.tableLoading = false
        })
        .catch(err => {
          this.tableLoading = false
          this.visible2 = false
        })
    },
    // 表内单元格样式（状态、优先级改变背景色）
    cellStyle({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (column.property == 'priority') {
        switch (row.priority) {
          case 2:
            return {
              background: '#C64b2b',
              color: '#FFFFFF'
            }
        }
      } else if (column.property == 'grade') {
        switch (row.grade) {
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
    changelist() {
      this.value1 == '是' ? this.disabled1 = false : this.disabled1 = true
      this.value2 == '是' ? this.disabled2 = false : this.disabled2 = true
      this.value3 == '是' ? this.disabled3 = false : this.disabled3 = true
      this.value4 == '是' ? this.disabled4 = false : this.disabled4 = true
      this.value5 == '是' ? this.disabled5 = false : this.disabled5 = true
      this.value6 == '是' ? this.disabled6 = false : this.disabled6 = true
      this.value7 == '是' ? this.disabled7 = false : this.disabled7 = true
      this.value8 == '是' ? this.disabled8 = false : this.disabled8 = true
    },
    // 批量修改任务
    mulEditTasks(Type) {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString() // 'yyyy/mm/dd hh:mm:ss'
      }
      if (Type === 1) {
        this.mulEditDialog = true
      } else {
        let keys = [{}]
        if (this.value1 == '是') {
          keys = [...keys, {
            key: 'name',
            value: this.updateMulTask.name
          }]
        }
        if (this.value2 == '是') {
          keys = [
            ...keys,
            {
              key: 'content',
              value: this.updateMulTask.content
            }
          ]
        }
        if (this.value3 == '是') {
          keys = [
            ...keys,
            {
              key: 'priority',
              value: this.updateMulTask.priority
            }
          ]
        }
        if (this.value4 == '是') {
          keys = [...keys, {
            key: 'grade',
            value: this.updateMulTask.grade
          }]
        }
        if (this.value5 == '是') {
          keys = [...keys, {
            key: 'status',
            value: this.updateMulTask.status
          }]
        }
        if (this.value6 == '是') {
          keys = [
            ...keys,
            {
              key: 'executorlist',
              value: this.updateMulTask.executorlist.join()
            }
          ]
        }
        if (this.value7 == '是') {
          keys = [
            ...keys,
            {
              key: 'start_date',
              value: dataFormat(this.updateMulTask.datetime[0])
            },
            {
              key: 'end_date',
              value: dataFormat(this.updateMulTask.datetime[1])
            }
          ]
        }
        if (this.value8 == '是') {
          keys = [
            ...keys,
            {
              key: 'total_hour',
              value: this.updateMulTask.total_hour
            }
          ]
        }
        const data = {
          method: 'put',
          ids: this.multipleSelection.map(item => item.id).join(','),
          keys: '{' +
            keys.map((t, i) => {
              return `"${t.key}":"${t.value}"`
            }) +
            '}'
        }
        HTTP.mulPutTasks(data).then(({
          data
        }) => {
          if (data.status === 0) {
            this.$message.success(data.msg)
            this.mulEditDialog = false
            this.$refs.multipleTable.clearSelection()
            this.getTasks(2)
            this.value1 = '否'
            this.value2 = '否'
            this.value3 = '否'
            this.value4 = '否'
            this.value5 = '否'
            this.value6 = '否'
            this.value7 = '否'
            this.value8 = '否'
            this.updateMulTask = {}
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    // 获取练习分组
    getTeam() {
      getProjectJoinMeb({
        id: this.$route.params.id,
        users: 'users'
      }).then(
        ({
          data
        }) => {
          this.trainingMenber = [...data.msg]
        }
      )
    },
    // 任务导出dialog
    targetUpload() {
      const data = {
        ...this.name,
        ...this.multiSelect,
        project: this.$route.params.id,
        print: 'null'
      }
      HTTP.queryTask(data)
        .then(({
          data
        }) => {
          if (data.status === 0) {
            this.uploadVisible = true
            this.path = data.path
            this.multiSelect = []
            this.name = []
          }
        })
        .catch(err => {
          this.$message.error(data.msg)
          // this.uploadVisible = true;
          this.multiSelect = []
          this.name = []
        })
    },
    // 导出Excel
    download() {
      const data = this.$store.state.BASE_URL + this.path
      window.location.href = data
      this.uploadVisible = false
    },
    uploadExcel() {
      //  this.download();
      this.uploadVisible = false
    },
    // 筛选条件展示
    filterCondition(showMulChoose, sortSelForm) {
      this.$refs['taskFilter'].filterCondition(showMulChoose, sortSelForm)
    },
    // 多条件筛选 +分页
    MulSel(sortSelForm, Type) {
      this.cutType = Type
      this.sortSelForm = sortSelForm
      let data = {
        ...sortSelForm,
        project: this.$route.params.id
      }
      if (Type === 1) {
        // 正常筛选
        data = {
          ...data,
          pagenum: 20,
          page: 1
        }
      } else {
        // 处理分页
        data = {
          ...data,
          pagenum: this.pageSize,
          page: this.currentPage
        }
      }
      this.multiSelect = sortSelForm
      this.tableLoading = true

      HTTP.queryTask(data)
        .then(({
          data
        }) => {
          if (data.status === 0) {
            this.TaskList = [...data.msg]
            this.authTask = data.auth.manage_task
            this.total = data.count
            this.pageCount = data.page_count
            this.visible2 = false
            if (Type === 1) {
              this.currentPage = 1
            }
          }
          this.tableLoading = false
        })
        .catch(err => {
          this.tableLoading = false
          this.visible2 = false
        })
    },
    changeAsset(val) {
      const data = this.AssetListTask.filter(item => {
        return item.id === this.TaskForm.asset
      })
      this.TaskForm.name = data[0].name
    },
    // 单条件排序
    sortFilter({
      column,
      prop,
      order
    }, Type) {
      this.sortfilter = {
        column,
        prop,
        order
      }
      this.cutType = 3
      let data = {
        ...this.sortSelForm,
        ...this.oneSel,
        project: this.$route.params.id,
        pagenum: this.pageSize,
        page: this.currentPage,
        sort: order === 'descending' ? '-' + prop : prop
      }
      if (Type === 2) {
        // 处理分页
        data = {
          ...data,
          pagenum: this.pageSize,
          page: this.currentPage
        }
      }
      HTTP.queryTask(data)
        .then(({
          data
        }) => {
          if (data.status === 0) {
            this.TaskList = [...data.msg]
            this.authTask = data.auth.manage_task
            this.total = data.count
            this.pageCount = data.page_count
            if (Type === 1) {
              this.currentPage = 1
            }
          }
          this.tableLoading = false
        })
        .catch(err => {
          this.tableLoading = false
        })
    },
    changeTime(val) {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString() // 'yyyy/mm/dd hh:mm:ss'
      }
      const totalHour =
        (this.TaskForm.datetime[1] - this.TaskForm.datetime[0]) /
        (1000 * 3600 * 24)

      this.TaskForm = {
        ...this.TaskForm,
        total_hour: 8 * totalHour + 8
      }
    },
    changeTime2(val) {
      if (this.radio7 == '是') {
        this.radio8 = '是'
        const totalHour2 =
          (this.updateMulTask.datetime[1] - this.updateMulTask.datetime[0]) /
          (1000 * 3600 * 24)
        this.updateMulTask = {
          ...this.updateMulTask,
          total_hour: 8 * totalHour2
        }
      }
    },
    // 展示任务侧栏
    showDrawer(item) {
      this.showdrawer = true
      this.$refs['taskDrawer'].showDrawer(item)
    },
    // 展开资产侧栏
    show(id) {
      this.assetShow = true
      this.$refs['assetDrawer'].show(id)
      // 获取项目操作资产权限
      auth().then(({
        data
      }) => {
        if (data.status === 0) {
          this.authAsset = data.auth.manage_asset
        }
      })
    },

    change() {
      this.$forceUpdate()
    },
    // 创建环节时，前置
    before(ind) {
      this.FormList.splice(ind, 0, {})
      //  this.FormList[ind - 1].content=this.datacontent[0].content;
    },
    // 创建环节时，后置
    after(ind) {
      this.FormList.splice(ind + 1, 0, {})
      this.FormList[ind + 1].content = this.datacontent[0].content
    },
    // 创建环节时，删除
    deleteLink(index) {
      if (index !== 0) this.FormList.splice(index, 1)
    },
    // 资产环节为空时，可创建
    addLink(asset) {
      this.asset = asset
      this.isLinkDialogShow = true
      this.mainTaskShow = false
      this.datacontent = this.AssetListTask.filter(item => {
        return item.id === this.asset
      })
      this.FormList[0].content = this.datacontent[0].content
    },
    // 给某一资产添加环节
    addLinks() {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString() // 'yyyy/mm/dd hh:mm:ss'
      }
      this.FormList.forEach((item, index) => {
        this.FormList[index] = Object.assign({}, this.FormList[index], {
          dept: this.FormList[index].dept[this.FormList[index].dept.length - 1],
          asset: this.asset
        })

        if (
          'datetime' in this.FormList[index] &&
          this.FormList[index].datetime.length
        ) {
          this.FormList[index] = {
            ...this.FormList[index],
            date_start: dataFormat(this.FormList[index].datetime[0]),
            date_end: dataFormat(this.FormList[index].datetime[1])
          }
          delete this.FormList[index].datetime
        }
        if (index === 0) {
          this.FormList[index].pid = 0
        } else {
          this.FormList[index].pid = this.FormList[index - 1].dept
        }
      })
      this.createLoading = true

      addLinks({
        links: [...this.FormList]
      })
        .then(({
          data
        }) => {
          this.createLoading = false

          if (data.status === 0) {
            this.$message.success(data.msg)
            this.$emit('refresh')
            this.$emit('refresh_assetList')
            this.isLinkDialogShow = false
            this.FormList = [{}]
            this.mainTaskShow = true
            this.TaskForm.asset = this.asset
            getLinks({
              asset: this.TaskForm.asset
            }).then(({
              data
            }) => {
              const linkData = [...data.msg]
              this.LinkList = []
              linkData.forEach(item => {
                item.forEach(ct => {
                  this.LinkList.push(ct)
                })
              })
            })
            this.active = 1
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => {
          this.isDialogShow = false
          this.createLoading = false
        })
    },
    formatList() {
      function changeList(arr) {
        for (const item of arr) {
          if (item['children'] && item['children'].length) {
            changeList(item['children'])
          } else {
            item['children'] = null
          }
        }
      }
      this.selectList = JSON.parse(
        JSON.stringify(this.DeptList)
          .replace(/name/g, 'label')
          .replace(/id/g, 'value')
      )
      changeList(this.selectList)
    },
    mainTask() {
      this.mainTaskShow = true
      this.active = 0
      queryAssets({
        project: this.$route.params.id,
        asset_type: this.asset_type
      }).then(({
        data
      }) => {
        this.AssetListTask = [...data.msg]
      })
      this.TaskForm = {
        priority: 0,
        grade: 7
      }
    },
    before() {
      if (this.active-- < 0) this.active = 0
    },
    next() {
      if (this.active++ > 2) this.active = 0
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 行被点击后触发
    rowSelected(row) {
      this.ActiveRow = {
        ...row
      }
      // console.log(this.ActiveRow);
    },
    // 打开对话框
    openDialog(Type, row) {
      this.ActiveRow = {
        ...row
      }
      this.DialogType = Type
      getDeptUsers({
        id: this.ActiveRow.link_dept
      }).then(res => {
        this.DeptUsers = [...res.data.users]
      })

      switch (Type) {
        case 1:
          this.dialogTitle = '创建任务'
          this.TaskForm = {
            priority: 0,
            grade: 7
          }
          this.isDialogShow = true
          break
        case 2:
          this.$emit('getAssetList')
          if (!Object.keys(this.ActiveRow).length) {
            this.$message.error('请选择父任务')
            return false
          }
          this.dialogTitle = `创建 ${this.ActiveRow.name} 的子任务`

          function dateFormat2(date) {
            return new Date(date * 1000).toLocaleDateString()
          }
          this.TaskForm = {
            priority: 0,
            grade: 7,
            pid: this.ActiveRow.id,
            asset: this.ActiveRow.asset.id,
            datetime: [
              new Date(dateFormat2(this.ActiveRow.start_date)) > 0
                ? new Date(dateFormat2(this.ActiveRow.start_date))
                : '',
              new Date(dateFormat2(this.ActiveRow.end_date)) > 0
                ? new Date(dateFormat2(this.ActiveRow.end_date))
                : ''
            ]
          }
          this.isDialogShow = true
          break
        case 3:
          function dateFormat(date) {
            return new Date(date * 1000).toLocaleDateString()
          }
          this.isDialogShow = true
          if (!Object.keys(this.ActiveRow).length) {
            this.$message.error('请选择要修改的任务')
            return false
          }
          let executorlist
          if (this.ActiveRow.executor.length) {
            executorlist = this.ActiveRow.executor.map(item => +item.id)
          }
          this.$emit('getAssetList')
          this.dialogTitle = '修改任务'
          this.TaskForm = {
            ...this.ActiveRow,

            datetime: [
              new Date(dateFormat(this.ActiveRow.start_date)) > 0
                ? new Date(dateFormat(this.ActiveRow.start_date))
                : '',
              new Date(dateFormat(this.ActiveRow.end_date)) > 0
                ? new Date(dateFormat(this.ActiveRow.end_date))
                : ''
            ],
            executorlist,
            manager: this.ActiveRow.manager ? this.ActiveRow.manager.id : null,
            asset: this.ActiveRow.asset.id,
            method: 'put'
          }
          console.log(this.TaskForm, '~~~~~~~~~~~~')

          delete this.TaskForm.executor
          delete this.TaskForm.creator
          delete this.TaskForm.create_time
          delete this.TaskForm.category
          delete this.TaskForm.project
          delete this.TaskForm['sub_task']

          this.updateMulTask.grade = this.ActiveRow.grade

          break
      }
    },
    // 添加或者修改任务
    editTask() {
      this.$refs['TaskRef'].validate(valid => {
        if (valid) {
          this.buttonStates.createLoading = true

          function changeDateFormat(dateVal) {
            return new Date(dateVal).toLocaleDateString()
            // 'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
          }
          const data = {
            ...this.TaskForm,
            grade: this.updateMulTask.grade,
            start_date: changeDateFormat(this.TaskForm.datetime[0]),
            end_date: changeDateFormat(this.TaskForm.datetime[1]),
            project: this.$route.params.id
          }
          if (this.TaskForm.executorlist.length) {
            data['executorlist'] = data['executorlist'].join()
          }else{
            data['executorlist'] = null
          }
          delete data.datetime
          // 若果是修改
          if (this.DialogType === 3) {
            HTTP.putTask(data)
              .then(({
                data
              }) => {
                this.buttonStates.createLoading = false

                if (data.status === 0) {
                  this.getTasks(2)
                  this.$message.success('已修改')
                  this.isDialogShow = false
                } else {
                  this.$message.error(data.msg)
                  this.buttonStates.createLoading = false
                }
              })
              .catch(err => {
                this.buttonStates.createLoading = false
              })
          } else {
            // console.log(data);
            HTTP.addTask(data).then(({
              data
            }) => {
              this.buttonStates.createLoading = false
              if (data.status === 0) {
                this.getTasks(2)
                this.isDialogShow = false
                this.$message.success('已完成')
              } else {
                this.$message.error(data.msg)
                this.buttonStates.createLoading = false
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 添加主任务
    editMainTask() {
      this.$refs['TaskRef'].validate(valid => {
        if (valid) {
          function changeDateFormat(dateVal) {
            return new Date(dateVal).toLocaleDateString()
            // 'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
          }
          if (this.$route.query.type == 0) {
            // console.log(this.TaskForm);
            const dataMulTask = {
              group_id: this.TaskForm.group_id,

              link_id: this.TaskForm.link_id,

              asset_id: this.TaskForm.asset,

              name: this.TaskForm.name,

              content: this.TaskForm.content,

              start_date: changeDateFormat(this.TaskForm.datetime[0]),
              end_date: changeDateFormat(this.TaskForm.datetime[1]),

              total_hour: this.TaskForm.total_hour,

              project_id: this.$route.params.id,

              status: this.TaskForm.status,

              priority: this.TaskForm.priority,

              grade: this.TaskForm.grade
            }
            // console.log(dataMulTask);
            HTTP.mulCreateTasks(dataMulTask)
              .then(({
                data
              }) => {
                this.$message.success(data.msg)
                if (data.status === 0) {
                  this.mainTaskShow = false
                  this.active = 0
                  this.getTasks(2)
                  t
                }
              })
              .catch(err => {})
          } else {
            const data = {
              ...this.TaskForm,
              start_date: changeDateFormat(this.TaskForm.datetime[0]),
              end_date: changeDateFormat(this.TaskForm.datetime[1]),
              project: this.$route.params.id
            }
            if (this.TaskForm.executorlist.length) {
              data['executorlist'] = data['executorlist'].join()
            }
            // 若果是修改
            HTTP.addTask(data).then(({
              data
            }) => {
              if (data.status === 0) {
                this.$message.success(data.msg)
                this.mainTaskShow = false
                this.active = 0
                this.getTasks(2)

                // console.log(this.mainTaskShow);
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        }
      })
    },

    // 取消对话框
    cancel() {
      this.isDialogShow = false
      this.TaskForm = {}
      this.$refs['TaskRef'].resetFields()
    },
    cancel2() {
      this.mainTaskShow = false
      this.$refs['TaskRef'].resetFields()
      this.active = 0
    },
    // 删除任务http请求
    deleteTask() {
      this.$confirm('删除任务后无法恢复，确认删除?', '注意', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const ids = this.multipleSelection.map(item => item.id).join(',')
          HTTP.deleteTask({
            ids: ids,
            method: 'delete'
          }).then(({
            data
          }) => {
            this.$message.success(data.msg)
            if (data.status === 0) {
              this.getTasks(2)
            }
          })
        })
        .catch(() => {})
    },
    // table表内筛选（状态、难度、优先级）+分页
    filterHandler(val, Type) {
      this.cutType = 4
      this.valSel = val
      if (val.status) {
        this.filterStatus = []
        this.filterStatus = [...val.status]
        this.filterStatus.forEach((item, index) => {
          item = Number(item)
          this.filterStatus[index] = item
        })
      }
      if (val.episode) {
        this.filterEpisode = []
        this.filterEpisode = [...val.episode]
        this.filterEpisode.forEach((item, index) => {
          // item = Number(item);
          this.filterEpisode[index] = item
        })
      }
      if (val.session) {
        this.filterSession = []
        this.filterSession = [...val.session]

        this.filterSession.forEach((item, index) => {
          // item = Number(item);
          this.filterSession[index] = item
        })
      }
      if (val.dept) {
        this.filterDept = []
        this.filterDept = [...val.dept]

        this.filterDept.forEach((item, index) => {
          // item = Number(item);
          this.filterDept[index] = item
        })
        // console.log(this.filterDept)
      }
      if (val.grade) {
        this.filterGrade = []
        this.filterGrade = [...val.grade]
        this.filterGrade.forEach((item, index) => {
          item = Number(item)
          this.filterGrade[index] = item
        })
      }
      if (val.priority) {
        this.filterPriority = []
        this.filterPriority = [...val.priority]

        this.filterPriority.forEach((item, index) => {
          item = Number(item)
          this.filterPriority[index] = item
        })
      }
      if (val.executor) {
        this.filterExecutor = []
        this.filterExecutor = [...val.executor]
        // console.log("111111");
        // console.log(this.filterExecutor);

        this.filterExecutor.forEach((item, index) => {
          // item = Number(item)
          this.filterExecutor[index] = item
        })
      }
      let data = {
        ...this.sortSelForm,
        ...this.oneSel,
        project: this.$route.params.id,
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
      if (this.filterEpisode.length) {
        data = {
          ...data,
          episode: String(this.filterEpisode)
        }
      }
      if (this.filterSession.length) {
        data = {
          ...data,
          session: String(this.filterSession)
        }
      }
      if (this.filterDept.length) {
        data = {
          ...data,
          depts: String(this.filterDept)
        }
      }
      if (this.filterGrade.length) {
        data = {
          ...data,
          grade: '[' + String(this.filterGrade) + ']'
        }
      }
      if (this.filterPriority.length) {
        data = {
          ...data,
          priority: '[' + String(this.filterPriority) + ']'
        }
      }
      if (this.filterExecutor.length) {
        data = {
          ...data,
          executor_ids:  String(this.filterExecutor)
        }
      }

      HTTP.queryTask(data)
        .then(({
          data
        }) => {
          if (data.status === 0) {
            this.TaskList = [...data.msg]
            this.authTask = data.auth.manage_task
            this.total = data.count
            this.pageCount = data.page_count
            if (Type === 1) {
              this.currentPage = 1
            }
          }
          this.tableLoading = false
        })
        .catch(err => {
          this.tableLoading = false
        })
    },
    // 获取任务列表
    getTasks(type, oneSel, name) {
      // 如果isFilterOverdue 告诉直接筛选超期，就不要事先加载一遍
      if (this.$store.state.project.isFilterOverdue) {
        return
      }
      this.oneSel = oneSel
      this.name = name // 任务导出时若有筛选条件
      let data = {
        project: this.$route.params.id
      }
      switch (type) {
        case 1: // 重置
          this.cutType = -1
          this.$refs['taskFilter'].showMul() // 重置筛选条件展示
          this.$refs['taskSel'].refreshOneSel() // 重置单条件筛选
          this.sortfilter = null // 重置多条件筛选存储的条件
          this.valSel = null // 重置table表内筛选（状态、难度、优先级）存储的条件
          this.oneSel = null // 重置单条件排序存储的条件
          this.currentPage = 1
          data = {
            ...data,
            pagenum: 20,
            page: 1
          }
          break
        case 2: // 正常查询
          data = {
            ...data,
            pagenum: 20,
            page: 1
          }
          break

        case 3: // 单条件筛选查询
          this.cutType = 5
          data = {
            ...data,
            ...oneSel,
            pagenum: 20,
            page: 1
          }
          break
        case 4: // 单条件筛选下的分页
          data = {
            ...data,
            ...oneSel,
            pagenum: this.pageSize,
            page: this.currentPage
          }
          break
        case -1: // 正常查询下的分页
          data = {
            ...data,
            pagenum: this.pageSize,
            page: this.currentPage
          }
          break
      }
      this.tableLoading = true
      HTTP.queryTask(data)
        .then(({
          data
        }) => {
          if (data.status === 0) {
            this.TaskList = [...data.msg]
            this.authTask = data.auth.manage_task
            // console.log(this.authTask);
            this.total = data.count
            this.pageCount = data.page_count
          }
          this.tableLoading = false
        })
        .catch(err => {
          this.tableLoading = false
        })
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      switch (this.cutType) {
        case 1:
          this.MulSel(this.sortSelForm, 2) // 多列筛选分页查看
          break
        case 2:
          this.closeSelectedTag(this.sortSelForm, 2) // 剩余筛选条件再筛选分页查看
          break
        case 3:
          this.sortFilter(this.sortfilter, 2) // 单条件排序分页查看
          break
        case 4:
          this.filterHandler(this.valSel, 2) // table表内状态、难度和优先级排序分页查看
          break
        case 5:
          this.getTasks(4, this.oneSel) // 单条件筛选下的分页
          break
        case -1:
          this.getTasks(-1) // 正常请求后分页
          break
      }
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      switch (this.cutType) {
        case 1:
          this.MulSel(this.sortSelForm, 2) // 多列筛选分页查看
          break
        case 2:
          this.closeSelectedTag(this.sortSelForm, 2) // 剩余筛选条件再筛选分页查看
          break
        case 3:
          this.sortFilter(this.sortfilter, 2) // 单条件排序分页查看
          break
        case 4:
          this.filterHandler(this.valSel, 2) // table表内状态、难度和优先级排序分页查看
          break
        case 5:
          this.getTasks(4, this.oneSel) // 单条件筛选下的分页
          break
        case -1:
          this.getTasks(-1) // 正常请求后分页
          break
      }
    },
    // 解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    },

    // 优先级格式化显示
    Priority: function(row, column) {
      switch (row.priority) {
        case 0:
          return '低'
          break
        case 1:
          return '中'
          break
        case 2:
          return '高'
          break
      }
    },
    // 难度格式化显示
    Grade: function(row, column) {
      switch (row.grade) {
        case 0:
          return '简单'
          break
        case 1:
          return '标准'
          break
        case 2:
          return '困难'
          break
      }
    }
  },

  async created() {
    this.getMenuList()
    this.getProjectNum()
    if (this.$route.query.type == 0) {
      this.getTeam()
      // console.log("train")
    }
    this.getTasks(2)
    if (!this.DeptList) {
      await this.$store.dispatch('admin/get_DeptList')
      this.formatList()
    } else {
      this.formatList()
    }
  }
}
