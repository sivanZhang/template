import {
  getWellDetail,
  ApiGetOrders,
} from '@/api/welldetail'
import {
  ApiAlarmDeta,
  ApiHistoryAlarm
} from '@/api/alarmManagement'
import { ApiGetWellList } from '@/api/wellList'
import LineChart from '@/components/ECharts/LineMarker'
import adjustDialog from '@/components/AdjustInstruct/adjustDialog'
import optionDialog from '@/components/Select/optionDialog'
import handleProcess from '@/views/components/handleProcess'
import historyChart from './components/historyChart'
export default {
  data() {
    return {
      name: 0, // 用来在子组件里面判断是周波曲线分析(1)还是诊断处理界面(0)
      wellPoint: 145,
      wellPointList: [{ value: '145' }, { value: '200' }],
      dataSrc: '自动', // 手动还是自动存入数据库的
      dataSrcList: [
        { value: '0', label: '手动' },
        { value: '1', label: '自动' }
      ],
      checkDataSrcTime: 0,
      loadingElect: false,
      loadingLoad: false,
      electricParamList: [], // 修正后的电参力，后端获取
      displacementList: [], // 位移数据
      addTimesValue: '',
      showAddTime: true, // 是否展示叠加次数
      time: '',
      explainVisible: false,
      wellList: [],
      processList: [],
      alarmDetail: [],
      unhandledAlarm: [], // 未处置告警种类
      wellDetail: [],
      dealContent: '',
      auth: '',
      dialogVisible: false,
      imageList: [
        {
          name: '1',
          url: require('@/assets/pump_images/image1.png')
        },
        {
          name: '2',
          url: require('@/assets/pump_images/image2.png')
        },
        {
          name: '3',
          url: require('@/assets/pump_images/image3.png')
        },
        {
          name: '4',
          url: require('@/assets/pump_images/image4.png')
        },
        {
          name: '5',
          url: require('@/assets/pump_images/image5.png')
        },
        {
          name: '6',
          url: require('@/assets/pump_images/image6.png')
        }
      ],
      value: '',
      number: '',
      highParam: false,
      low: '',
      washWell: false,
      lowParam: false,
      high: '',
      changeBelt: false,
      changePole: false,
      verifyWell: false,
      checkList: [],
      date: [],
      time: '',
      warningId: 0, // 接收右边处理框中点击"立即处置"按钮后对应的告警id
      warnid: 0, // 往后端发送的告警id
      complete: false, // 判断是否已保存处置
      param1: false,
      param2: false,
      orderList: [],
      wellName: '',
      warning_id: '',
      diagTitle: '', // 左边选项卡显示井的处置种类
      diagId: '', // 左边选项卡显示的诊断种类的Id
      firstEntry: true, // 判断是否为首次进入该界面，
      // 判断井的状态是否已处置
      // status为0:新增,1:忽略,2:关闭,3:误报,4:已处置
      handleStatus: [],
      activeName: 'first',
      activeName1: 'first',
      handleSign: false,
      show: true, // 处置过程中是否展示‘立即处置’按钮
      current: false, // 是否点击了右边选项卡中的'立即处置'按钮
      typeTitle: '', // 点击了右边选项卡中的‘立即处置’按钮之后左边选项卡中显示的诊断种类
      promote: '', // 参数低调高为或参数高调低为后面的文本框值
      warningindex: '' // 告警对应的索引
    }
  },
  components: {
    LineChart,
    adjustDialog,
    handleProcess,
    optionDialog,
    historyChart
  },
  watch: {
    wellName: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          if (oldVal == '' && this.$route.query.warnId) {
            this.firstEntry = true
            if (this.$route.query.warnName == '皮带断') {
              this.changeBelt = true
              this.index7 = this.checkList.push('换皮带')
            }
            if (this.$route.query.warnName == '结蜡') {
              this.washWell = true
              this.checkList.push('洗井')
            }
            if (this.$route.query.warnName == '参数高') {
              this.highParam = true
              this.param1 = true
              this.checkList.push('参数高调低为' + this.low)
            }
            if (this.$route.query.warnName == '参数低') {
              this.lowParam = true
              this.param2 = true
              this.checkList.push('参数低调高为' + this.high)
            }
            if (this.$route.query.warnName == '杆断') {
              this.changePole = true
              this.checkList.push('换杆')
            }
            if (this.$route.query.warnName == '漏失') {
              this.verifyWell = true
              this.checkList.push('核实井况')
            }
            this.dealContent = String(this.checkList)
            ApiAlarmDeta({ warningid: this.$route.query.warnId }).then(
              ({ data }) => {
                this.alarmDetail = data.msg
                this.promote = this.alarmDetail.promote
                this.warningindex = this.alarmDetail.warningindex
              }
            )
          } else {
            this.firstEntry = false
          }
        }
      }
    }
  },
  methods: {
    handleClick(tab) {
      if (this.wellDetail.well_type == 0) {
        if (tab.name == 'third') {
          var _this = this
          _this.$refs.historychart.getWellParamers()
        }
      } else if (this.wellDetail.well_type == 1) {
        if (tab.name == 'second') {
          this.$router.push({
            name: 'history-data',
            query: { id: this.wellName }
          })
          this.handleSign = true
        } else {
          this.handleSign = false
        }
      }
    },
    openExplain() {
      this.explainVisible = true
    },
    // 获取指令列表
    getOrderList() {
      ApiGetOrders({ wellid: this.wellName }).then(res => {
        this.orderList = res.data.msg
      })
    },
    // 获取所有井列表
    GetwellList() {
      ApiGetWellList({ pagenum: 100 }).then(({ data }) => {
        let wellid = []
        this.wellList = data.msg.well_list
        wellid = this.wellList.map(item => {
          return item.id
        })
        if (this.wellList.length !== 0) {
          if (this.$route.query.wellId) {
            this.wellName = parseInt(this.$route.query.wellId)
          } else {
            this.wellName = wellid[0]
          }
          this.getWellDetails()
        } else {
          this.wellName = ''
        }
      })
    },
    // 获取井的详情
    getWellDetails() {
      getWellDetail({ wellid: this.wellName, welldetail: '' }).then(
        ({ data }) => {
          this.wellDetail = data.msg
          this.activeName = this.wellDetail.well_type == 0 ? 'first' : 'second'
          this.number = data.msg.number
          this.auth = data.auth.order
          this.getHistoryAlarm()
          this.getOrderList()
          // 解决父组件调用子组件方法时报错(该方法未定义)，添加一个计时器
          setTimeout(() => {
            this.$refs.historychart.getWellParamers()
          })
        }
      )
    },
    // 告警详情
    getAlarmDetail() {
      this.checkList = []
      this.dealContent = ''
      this.changeBelt = false
      this.washWell = false
      this.highParam = false
      this.low = ''
      this.lowParam = false
      this.high = ''
      this.changePole = false
      this.verifyWell = false
      if (this.diagTitle == '皮带断') {
        this.changeBelt = true
        this.index7 = this.checkList.push('换皮带')
      }
      if (this.diagTitle == '结蜡') {
        this.washWell = true
        this.checkList.push('洗井')
      }
      if (this.diagTitle == '参数高') {
        this.highParam = true
        this.param1 = true
        this.checkList.push('参数高调低为' + this.low)
      }
      if (this.diagTitle == '参数低') {
        this.lowParam = true
        this.param2 = true
        this.checkList.push('参数低调高为' + this.high)
      }
      if (this.diagTitle == '杆断') {
        this.changePole = true
        this.checkList.push('换杆')
      }
      if (this.diagTitle == '漏失') {
        this.verifyWell = true
        this.checkList.push('核实井况')
      }
      this.dealContent = String(this.checkList)
      if (this.diagId !== '') {
        ApiAlarmDeta({ warningid: this.diagId }).then(({ data }) => {
          this.alarmDetail = data.msg
          this.promote = this.alarmDetail.promote
          this.warningindex = this.alarmDetail.warningindex
        })
      }
    },
    // 子组件改变父组件中的值
    change(
      current,
      typeTitle,
      complete,
      changeBelt,
      washWell,
      highParam,
      low,
      lowParam,
      high,
      param1,
      param2,
      changePole,
      verifyWell,
      checkList,
      dealContent,
      warningId
    ) {
      this.current = current
      this.typeTitle = typeTitle
      this.complete = complete
      this.changeBelt = changeBelt
      this.washWell = washWell
      this.highParam = highParam
      this.low = low
      this.lowParam = lowParam
      this.high = high
      this.param1 = param1
      this.param2 = param2
      this.changePole = changePole
      this.verifyWell = verifyWell
      this.checkList = checkList
      this.dealContent = dealContent
      this.warningId = warningId
    },
    // 历史告警
    getHistoryAlarm() {
      this.diagTitle = ''
      this.diagId = ''
      this.date = []
      const id = []
      const title = []
      const time = []
      this.handleStatus = []
      ApiHistoryAlarm({
        id: this.wellName,
        history: '',
        list: ''
      }).then(({ data }) => {
        this.processList = data.msg
        if (this.processList.length !== 0) {
          this.processList.map(item => {
            id.push(item.id)
            title.push(item.title)
            time.push(item.date_handled)
            this.handleStatus.push(item.status)
          })
          for (let i = 0; i < time.length; i++) {
            if (time[i] !== null) {
              this.date.push(time[i])
            }
          }
          const date = this.date.sort(function(a, b) {
            return b - a
          })
          this.time = date[0]
          for (let i = 0; i < this.handleStatus.length; i++) {
            const diagTitle = []
            const diagId = []
            if (this.handleStatus[i] == 0) {
              diagTitle.push(title[i])
              diagId.push(id[i])
              this.diagTitle = String(diagTitle[0])
              this.diagId = diagId[0]
            }
          }
          this.warning_id = id[0]
          if (this.firstEntry == false) {
            // 如果不是首次进入该页面
            this.getAlarmDetail()
          }
        } else {
          this.warning_id = ''
        }
      })
    }
  },
  mounted() {
    this.GetwellList()
  }
}
