import {
  setupMenu,
  getMenu
} from "@/api/project";
import {
  getEpisodeSession
} from "@/api/statistics";
import thumbtackMixin from "@/utils/thumbtack-mixin";
import * as HTTP from "@/api/assets";
import {
  mapState
} from "vuex";
import {
  getToken
} from "@/utils/auth";
import {
  getProjectStatus
} from "@/api/status";
import {
  addMaterial
} from "@/api/material";
import assetMulSel from "@/views/projects/components/mulConditionSel/assetMulSel";
import assetFilter from "@/views/projects/components/filterCondition/assetFilter";
import assetSortMul from "@/views/projects/components/sortMul/assetSortMul";
import assetSel from "@/views/projects/components/oneConditionSel/assetSel";
import taskTable from "@/views/projects/components/taskTable";
import {
  editSmallStatus
} from "@/api/status";
import assetDrawer from "@/views/projects/components/ShowDrawer/assetDrawer";
import taskDrawer from "@/views/projects/components/ShowDrawer/taskDrawer";
import dayjs from "dayjs";
let isSaved = false; //方式重复提交保存表格
export default {
  mixins: [thumbtackMixin],
  components: {
    assetMulSel,
    assetFilter,
    assetSortMul,
    assetSel,
    taskTable,
    assetDrawer,
    taskDrawer
  },
  neme: "asset-list",
  data() {
    return {
      showdrawer: false,
      value1: false,
      tableTask: [], //资产的任务
      labelName: this.notShow == "true" ? "镜头号" : "资产名称",
      uploadVisible: false,
      materialForm: {},
      matrialId: null,
      // assetId: this.$route.query.asset?this.$route.query.asset:"",
      pageCount: 0,
      AssetList: [],
      total: 0,
      tableLoading: false, //表格加载状态
      project: null,
      RemarksData: [],
      value1: false,
      activeAsset: null,
      isDrawerShow: false,
      SRC: "",
      AssetForm: {
        priority: 0
      },
      ImgForm: {},
      isShow: false,
      LevelList: [{
          label: "A+",
          value: 0
        },
        {
          label: "A",
          value: 1
        },
        {
          label: "A-",
          value: 2
        },
        {
          label: "B+",
          value: 3
        },
        {
          label: "B",
          value: 4
        },
        {
          label: "B-",
          value: 5
        },
        {
          label: "C+",
          value: 6
        },
        {
          label: "C",
          value: 7
        },
        {
          label: "D+",
          value: 8
        },
        {
          label: "D",
          value: 9
        },
        {
          label: "E",
          value: 10
        }
      ],
      rules: {
        name: [{
          required: true,
          message: "请输入名称",
          trigger: "blur"
        }],
        priority: [{
          required: true,
          message: "请输入优先等级",
          trigger: "blur"
        }],
        level: [{
          required: true,
          message: "请输入难度",
          trigger: "blur"
        }]
      },
      buttonStates: {
        createLoading: false
      },
      currentPage: 1,
      pageSize:10,
      pageSizeList: [10, 30, 50, 100],
      headers: {
        Authorization: `JWT ${getToken()}`
      },
      multipleSelection: [],
      dialogTitle: "",
      DialogName: null,
      editing: false,
      clickId: null,
      iconShow: false,
      dialogImg: false,
      imagePath: null,
      row: null,
      ind: true,
      show_small_status: false,
      show_image: false,
      show_session: false,
      show_episode: false,
      show_name: false,
      show_frame: false,
      show_frame_range: false,
      show_frame_reference: false,
      show_report: false,
      show_retime: false,
      show_inner_version: false,
      show_content: false,
      show_priority: false,
      show_level: false,
      show_id: false,
      show_creator_name: false,
      show_creator_id: false,
      show_status: false,
      show_link: false,
      show_totle_date_end: false,
      show_total_hours: false,
      show_remark: false,
      show_create_date: false,
      show_start_date: false,
      show_end_date: false,
      checkAssetList: [],
      visible: false,
      filterStatus: [],
      filterSession: [],
      filterEpisode: [],
      filterPriority: [],
      filterLevel: [],
      sort: null,
      path: null,
      multiSelect: [],
      columnSelect1: [], //场次列表
      columnSelect2: [], //集数列表
      name: "",
      approving: [],
      conducting: [],
      finish: [],
      notstart: [],
      pause: [],
      attrsList: [],
      customAttrs: [],
      attrsTypeNum: null,
      materialShow: false,
      materialEstdate: new Date().toLocaleDateString(),
      pro_type: null,
      authAsset: null,
      dbCell: false,
      cellId: null,
      cellCol: null,
      cutType: -1, //分页类型
      oneSel: null, //保存单列筛选的条件
      sortSelForm: {}, //保存多列筛选条件
      valSel: null, //保存table表内筛选（状态、难度、优先级）的条件
      sortfilter: null, //保存单列排序的条件
      sortMulFilter: null, //保存多列排序的条件
      curHeight: 0,
      // 单元格里的值得缓存，以便提交失败后把原值赋值回去
      cellValueCache: null,
      SaveDialogVisible: false,
      mulEditDialog: false,
      updateMulTask: {},
      changeSession: "否",
      changeFrame: "否",
      changeEpisode:"否",
      changeContent: "否",
      changePriority: "否",
      changeLevel: "否",
      changeStatus: "否",
      changeTime: "否",
      changeRemark:"否",
      changeRetime:"否",
      changeReport:"否",
      changeFrame_range:"否",
      changePro_reference:"否",
      disableSession: true,
      disableFrame: true,
      disableEpisode:true,
      disableContent: true,
      disablePriority: true,
      disableLevel: true,
      disableStatus: true,
      disableTime: true,
      disableRemark:true,
      disableRetime:true,
      disableReport:true,
      disableFrame_range:true,
      disablePro_reference:true,
      list:[],
      info:[]
    };
  },
  beforeMount() {
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    this.curHeight = h - 329; //减去页面上固定高度height
    // console.log(h);
  },
  watch: {
    assetId: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.show(Number(newVal));
        }
      }
    }
  },
  computed: {
    ...mapState("project", ["ProjectList"])
  },
  props: {
    assetJump: {
      type: String
    },
    assetId: {
      type: String
    },
    activeName: {
      type: String
    },
    drawerType: {
      //侧边栏为资产还是镜头
      default: ""
    },
    groupType: {
      default: null
    },
    notShow: {
      type: String
    }
  },
  methods: {
    //保存说明
    openExplain() {
      this.SaveDialogVisible = true;
    },
    //全部项目使用保存
    saveLongMenu() {
      if (this.show_image == true) {
        this.checkAssetList.push("缩略图")
      }
      if (this.show_session == true) {
        this.checkAssetList.push("场次")
      }
      if (this.show_episode == true) {
        this.checkAssetList.push("集数")
      }
      if (this.show_name == true) {
        this.checkAssetList.push(this.notShow == "true" ? "镜头号" : "资产名称")
      }
      if (this.show_frame == true) {
        this.checkAssetList.push("帧数")
      }
      if (this.show_frame_range == true) {
        this.checkAssetList.push("帧数范围")
      }
      if (this.show_report == true) {
        this.checkAssetList.push("画面调整信息")
      }
      if (this.show_retime == true) {
        this.checkAssetList.push("变速信息")
      }
      if (this.show_inner_version == true) {
        this.checkAssetList.push("版本号")
      }
      if (this.show_content == true) {
        this.checkAssetList.push("制作内容")
      }
      if (this.show_priority == true) {
        this.checkAssetList.push("优先级")
      }
      if (this.show_level == true) {
        this.checkAssetList.push("难度")
      }
       
      if (this.show_small_status == true) {
        this.checkAssetList.push("小状态")
      }
      if (this.show_creator_name == true) {
        this.checkAssetList.push("创建人")
      }

      if (this.show_status == true) {
        this.checkAssetList.push("进度")
      }
      if (this.show_link == true) {
        this.checkAssetList.push("当前环节")
      }
      if (this.show_create_date == true) {
        this.checkAssetList.push("创建日期")
      }
      if (this.show_start_date == true) {
        this.checkAssetList.push("开始日期")
      }
      if (this.show_end_date == true) {
        this.checkAssetList.push("结束日期")
      }
      if (this.show_totle_date_end == true) {
        this.checkAssetList.push("计划截止日期")
      }
      if (this.show_total_hours == true) {
        this.checkAssetList.push("总工时")
      }
      if (this.show_remark == true) {
        this.checkAssetList.push("备注")
      }
      setupMenu({
        menu_type: this.notShow == "true" ? 2 : 1,
        menu_list: String(this.checkAssetList)
      }).then(({
        data
      }) => {
        this.visible = false;
      })
    },
    //获取菜单设置
    getMenuList() {
      getMenu({
        menu_type: this.notShow == "true" ? 2 : 1
      }).then(({
        data
      }) => {
        if (data.msg != "") {
          [...data.msg].map(item => {
            switch (item) {
              case "缩略图":
                this.show_image = true;
                break;
              case "场次":
                this.show_session = true;
                break;
              case "集数":
                this.show_episode = true;
                break;
              case "镜头号" || "资产名称":
                this.show_name = true;
                break;
              case "帧数":
                this.show_frame = true;
                break;
              case "帧数范围":
                this.show_frame_range = true;
                break;
              case "画面调整信息":
                this.show_report = true;
                break;
              case "变速信息":
                this.show_retime = true;
                break;
              case "版本号":
                this.show_inner_version = true;
                break;
              case "制作内容":
                this.show_content = true;
                break;
              case "优先级":
                this.show_priority = true;
                break;
              case "难度":
                this.show_level = true;
                break;
              
              case "小状态":
                this.show_small_status = true;
                break;
              case "创建人":
                this.show_creator_name = true;
                break;

              case "进度":
                this.show_status = true;
                break;
              case "当前环节":
                this.show_link = true;
                break;
              case "创建日期":
                this.show_create_date = true;
                break;
              case "开始日期":
                this.show_start_date = true;
                break;
              case "结束日期":
                this.show_end_date = true;
                break;
              case "计划截止日期":
                this.show_totle_date_end = true;
                break;
              case "总工时":
                this.show_total_hours = true;
                break;
              case "备注":
                this.show_remark = true;
                break;
            }
          })
        } else {
          this.show_image = true;
          this.show_session = true;
          this.show_episode = true;
          this.show_name = true;
          this.show_frame = true;
          this.show_frame_range = true;
          this.show_report = true;
          this.show_retime = true;
          this.show_inner_version = true;
          this.show_content = true;
          this.show_priority = true;
          this.show_level = true;
          this.show_id = true;
          this.show_small_status = true;
          this.show_creator_name = true;
          this.show_creator_id = true;
          this.show_status = true;
          this.show_link = true;
          this.show_create_date = true;
          this.show_start_date = true;
          this.show_end_date = true;
          this.show_totle_date_end = true;
          this.show_total_hours = true;
          this.show_remark = true;
        }
      })
    },
    renderheader(h, {
      column,
      $index
    }) {
      return h("span", {}, [
        h("span", {}, column.label.split("|")[0]),
        //h("br"), // 这个有bug，排序被换行了
        h("span", {}, column.label.split("|")[1])
      ]);
    },

    getProjectNum() {
      //获取集数列表
      getEpisodeSession({
        id: this.$route.params.id,
        episode: ""
      }).then(
        ({
          data
        }) => {
          [...data.msg].map(item => {
            this.columnSelect2.push({
              value: item,
              text: item
            });
          });
        }
      );
      //  //获取场次列表
      getEpisodeSession({
        id: this.$route.params.id,
        session: ""
      }).then(
        ({
          data
        }) => {
          [...data.msg].map(item => {
            this.columnSelect1.push({
              value: item,
              text: item
            });
          });
        }
      );
    },
    //展示要修改的资产表单
    showAssetForm(Type, row) {
      this.DialogName = Type;
      if (Type === 1) {
        this.dialogTitle = "新建资产";
      }
      if (Type === 2) {
        this.dialogTitle = "修改资产";
        this.SRC = this.$store.state.BASE_URL + row.image;
        this.AssetForm = {
          image: row.image,
          name: row.name,
          path: row.path,
          priority: row.priority,
          level: row.level,
          id: row.id
        };
      }
      this.isShow = true;
    },
    //展示资产的任务
    expandShow(row, expandedRows) {
      if (Object.keys(expandedRows).length) {
        if (row.task_num != 0) {
          this.$nextTick(() => {
            this.$refs["taskTable"].getTaskList(row.id);
          });
        }
      } else {
        return;
      }
    },
    //重置筛选条件展示
    selRefresh() {
      this.$refs["assetFilter"].showMul();
    },
    //筛选条件展示
    filterCondition(showMulChoose, sortSelForm) {
      this.$refs["assetFilter"].filterCondition(showMulChoose, sortSelForm);
    },
    //删除筛选条件，剩余条件再搜索
    closeSelectedTag(sortSelForm, Type) {
      this.cutType = 2;
      this.sortSelForm = sortSelForm;
      let data = {
        ...sortSelForm,
        project: this.$route.params.id
      };
      if (Type === 1) {
        //正常请求
        data = {
          ...data,
          pagenum: 20,
          page: 1
        };
      } else {
        //处理分页
        data = {
          ...data,
          pagenum: this.pageSize,
          page: this.currentPage
        };
      }
      this.multiSelect = sortSelForm;
      this.tableLoading = true;
      HTTP.queryAssets(data)
        .then(({
          data
        }) => {
          if (data.status === 0) {
            this.assignmentAssetList(data.msg)
            this.total = data.count;
            this.pageCount = data.page_count;
            if (Type === 1) {
              this.currentPage = 1;
            }
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    //优先级和难度背景颜色动态改变
    cellStyle({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (column.property == "priority") {
        switch (row.priority) {
          case 1:
            return {
              background: "#C64b2b",
                color: "#FFFFFF"
            };
        }
      } else if (column.property == "level") {
        switch (row.level) {
          case 0:
            return {
              background: "#C64b2b",
                color: "#FFFFFF",
            };
        }
      }
      return {
        borderRight: 0,
        height: 50,
        paddingLeft: 5,
        paddingRight: 5
      };
    },
    //取消编辑
    cancleEdit(index, row){
      this.dbCell = false;
      this.editing = false;
      this.iconShow = false;
      this.info = JSON.parse(this.list);
      row.name = this.info.name;
      row.frame = this.info.frame;
      row.session = this.info.session;
      row.episode = this.info.episode;
      row.frame_range = this.info.frame_range;
      row.report = this.info.report;
      row.retime = this.info.retime;
      row.content = this.info.content;
    },
    //双击修改单元格获取焦点
    editCell(row, column, cell, event) {
      this.value1=false;
      if (this.authAsset) {
        switch (column.label) {
          case "镜头号":
            this.cellCol = "name";
            break;
          case "场次":
            this.cellCol = "session";
            break;
          case "集数":
            this.cellCol = "episode";
            break;
          case "帧数":
            this.cellCol = "frame";
            break;
          case "帧数范围":
            this.cellCol = "frame_range";
            break;
          case "制作参考":
            this.cellCol = "reference";
            break;
          case "画面调整信息":
            this.cellCol = "report";
            break;
          case "变速信息":
            this.cellCol = "retime";
            break;
          case "制作内容":
            this.cellCol = "content";
            break;
          case "优先级":
            this.cellCol = "priority";
            break;
          case "难度":
            this.cellCol = "level";
            break;
          case "小状态":
            this.cellCol = "small_status";
            break;
          case "开始日期":
            this.cellCol = "start_date";
            break;
          case "结束日期":
            this.cellCol = "end_date";
            break;
          case "备注":
            this.cellCol = "remark";
            break;
        }

        this.dbCell = true;
        this.cellId = row.id;
        const index = this.AssetList.findIndex(t => t.id === this.cellId);
        const newObj = JSON.parse(JSON.stringify(this.AssetList[index]));
        this.cellValueCache = {
          index,
          value: newObj[column.property],
          property: column.property
        };
        this.list = JSON.stringify(row);
      }
    },

    //添加进素材库
    pushMaterial(Type, id) {
      this.value1=false;
      if (Type === 1) {
        this.materialShow = true;
        this.matrialId = id;
      } else {
        let dateMaterial = {
          ...this.materialForm,
          ids: this.matrialId
        };
        //console.log(dateMaterial);
        addMaterial(dateMaterial).then(({
          data
        }) => {
          // if(data.status === 0){
          this.$message.success(data.msg);
          this.materialShow = false;
          // }else{
          //    this.$message.error(data.msg);
          //   this.materialShow = false;
          // }
        });
      }
    },
    jumpName(val) {
      this.$emit("jumpName", val);
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
      };
      this.cutType = 3;
      let payload = {
        ...this.sortSelForm,
        ...this.oneSel,
        project: this.$route.params.id,
        asset_type: this.drawerType === "scene" ? 0 : 1,
        sort: order === "descending" ? "-" + prop : prop

      };

      if (Type === 1) {
        //正常请求
        payload = {
          ...payload,
          pagenum: 20,
          page: 1
        };
      } else {
        //处理分页
        payload = {
          ...payload,
          pagenum: this.pageSize,
          page: this.currentPage
        };
      }
      HTTP.queryAssets(payload)
        .then(({
          data
        }) => {
          if (data.status === 0) {
            this.assignmentAssetList(data.msg)
            this.total = data.count;
            this.pageCount = data.page_count;
            if (Type === 1) {
              this.currentPage = 1;
            }
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    //多条件排序
    sortMul(sort, Type) {
      this.sortMulFilter = sort;
      this.cutType = 6;
      let payload = {
        ...this.sortSelForm,
        ...this.oneSel,
        project: this.$route.params.id,
        asset_type: this.drawerType === "scene" ? 0 : 1,
        sort: sort
      };
      if (Type === 1) {
        //正常请求
        payload = {
          ...payload,
          ...sort,
          pagenum: 20,
          page: 1
        };
      } else {
        //处理分页
        payload = {
          ...payload,
          ...sort,
          pagenum: this.pageSize,
          page: this.currentPage
        };
      }
      HTTP.queryAssets(payload)
        .then(({
          data
        }) => {
          if (data.status === 0) {
            this.assignmentAssetList(data.msg)
            this.total = data.count;
            this.pageCount = data.page_count;
            // if (Type === 1) {
            //   this.currentPage = 1;
            // }
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    //table表内筛选（状态、难度、优先级）
    filterHandler(val, Type) {
      this.valSel = val;
      this.cutType = 4;
      if (val.status) {
        this.filterStatus = [];
        this.filterStatus = [...val.status];
        this.filterStatus.forEach((item, index) => {
          item = Number(item);
          this.filterStatus[index] = item;
        });
      }
      if (val.episode) {
        this.filterEpisode = [];
        this.filterEpisode = [...val.episode];
        this.filterEpisode.forEach((item, index) => {
          // item = Number(item);
          this.filterEpisode[index] = item;
        });
      }
      if (val.session) {
        this.filterSession = [];
        this.filterSession = [...val.session];
        this.filterSession.forEach((item, index) => {
          // item = Number(item);
          this.filterSession[index] = item;
        });
      }
      if (val.priority) {
        this.filterPriority = [...val.priority];
        this.filterPriority.forEach((item, index) => {
          item = Number(item);
          this.filterPriority[index] = item;
        });
      }
      if (val.level) {
        this.filterLevel = [...val.level];
        this.filterLevel.forEach((item, index) => {
          item = Number(item);
          this.filterLevel[index] = item;
        });
      }
      let payload = {
        ...this.sortSelForm,
        ...this.oneSel,
        project: this.$route.params.id,
        asset_type: this.drawerType === "scene" ? 0 : 1
      };
      if (Type === 1) {
        //正常请求
        payload = {
          ...payload,
          pagenum: 20,
          page: 1
        };
      } else {
        //处理分页
        payload = {
          ...payload,
          pagenum: this.pageSize,
          page: this.currentPage
        };
      }
      if (this.filterStatus.length) {
        payload = {
          ...payload,
          status: "[" + String(this.filterStatus) + "]"
        };
      }
      if (this.filterEpisode.length) {
        payload = {
          ...payload,
          episode: String(this.filterEpisode)
        };
      }
      if (this.filterSession.length) {
        payload = {
          ...payload,
          session: String(this.filterSession)
        };
      }
      if (this.filterPriority.length) {
        payload = {
          ...payload,
          priority: "[" + String(this.filterPriority) + "]"
        };
      }
      if (this.filterLevel.length) {
        payload = {
          ...payload,
          level: "[" + String(this.filterLevel) + "]"
        };
      }
      this.tableLoading = true;
      HTTP.queryAssets(payload)
        .then(({
          data
        }) => {
          if (data.status === 0) {
            this.assignmentAssetList(data.msg)
            this.total = data.count;
            this.pageCount = data.page_count;
            if (Type === 1) {
              this.currentPage = 1;
            }
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    //多条件筛选
    MulSel(sortSelForm, Type) {
      this.cutType = 1;
      this.sortSelForm = sortSelForm;
      let data = {
        ...sortSelForm,
        project: this.$route.params.id,
        asset_type: this.drawerType === "scene" ? 0 : 1
      };
      if (Type === 1) {
        //正常筛选
        data = {
          ...data,
          pagenum: 20,
          page: 1
        };
      } else {
        //处理分页
        data = {
          ...data,
          pagenum: this.pageSize,
          page: this.currentPage
        };
      }
      this.multiSelect = sortSelForm;
      this.tableLoading = true;
      HTTP.queryAssets(data)
        .then(({
          data
        }) => {
          if (data.status === 0) {
            this.assignmentAssetList(data.msg)
            this.total = data.count;
            this.pageCount = data.page_count;
            if (Type === 1) {
              this.currentPage = 1;
            }
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    img(row) {
      this.dialogImg = true;
      this.row = row;
      this.SRC = this.$store.state.BASE_URL + row.image;
    },
    addImg() {
      // console.log(this.ImgForm)
      this.imagePath = this.ImgForm.image;
      this.SRC = this.$store.state.BASE_URL + this.imagePath;
      this.row.image = this.imagePath;
      this.row.image_id = this.ImgForm.id;
      this.dialogImg = false;
    },
    handleCurrentChange(row, event, column) {
      // console.log(row, event, column, event.currentTarget);
    },
    //是否显示行内修改框
    showEditIcon(index, row) {
      this.iconShow = true;
      this.rowClick = true;
      if (
        this.cellCol == "priority" ||
        this.cellCol == "level" ||
        this.cellCol == "small_status" ||
        this.cellCol == "start_date" ||
        this.cellCol == "end_date"
      ) {
        this.saveEdit(index, row);
      }
    },
    //修改资产
    editOneAsset(row) {
      this.value1=false;
      this.list = JSON.stringify(row);
      function dateFormat(date) {
        return dayjs(date).format("YYYY/MM/DD");
      }
      if (this.iconShow === true) {
        this.$confirm("当前修改未保存", "注意", {
          type: "warning"
        });
      } else {
        this.editing = true;
        this.clickId = row.id;
      }
    },
    // 批量修改是否改变行
    changelist() {
      this.changeSession == "是" ? this.disableSession = false : this.disableSession = true;
      this.changeFrame == "是" ? this.disableFrame = false : this.disableFrame = true;
      this.changeEpisode == "是" ? this.disableEpisode = false : this.disableEpisode = true;
      this.changeRemark=="是"?this.disableRemark=false:this.disableRemark=true,
      this.changeRetime=="是"?this.disableRetime=false:this.disableRetime=true,
      this.changeReport=="是"?this.disableReport=false:this.disableReport=true,
      this.changeFrame_range=="是"?this.disableFrame_range=false:this.disableFrame_range=true,
      this.changePro_reference=="是"?this.disablePro_reference=false:this.disablePro_reference=true,
      this.changeContent == "是" ? this.disableContent = false : this.disableContent = true;
      this.changePriority == "是" ? this.disablePriority = false : this.disablePriority = true;
      this.changeLevel == "是" ? this.disableLevel = false : this.disableLevel = true;
      this.changeStatus == "是" ? this.disableStatus = false : this.disableStatus = true;
      this.changeTime == "是" ? this.disableTime = false : this.disableTime = true;
    },
    //批量修改任务
    mulEditTasks(Type) {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      if (Type === 1) {
        this.mulEditDialog = true;
      } else {
        let keys = [{}];
        if (this.changeSession == "是") {
          keys = [...keys, {
            key: "session",
            value: this.updateMulTask.session
          }];
        }
        if (this.changeFrame == "是") {
          keys = [...keys, {
            key: "frame",
            value: this.updateMulTask.frame
          }];
        }
        if (this.changeEpisode == "是") {
          keys = [...keys, {
            key: "episode",
            value: this.updateMulTask.episode
          }];
        }
        if (this.changeRemark == "是") {
          keys = [...keys, {
            key: "remark",
            value: this.updateMulTask.remark
          }];
        }
        if (this.changeReport == "是") {
          keys = [...keys, {
            key: "report",
            value: this.updateMulTask.report
          }];
        }
        if (this.changeRetime == "是") {
          keys = [...keys, {
            key: "retime",
            value: this.updateMulTask.retime
          }];
        }
        if (this.changeFrame_range == "是") {
          keys = [...keys, {
            key: "frame_range",
            value: this.updateMulTask.frame_range
          }];
        }
        if (this.changePro_reference == "是") {
          keys = [...keys, {
            key: "pro_reference",
            value: this.updateMulTask.pro_reference
          }];
        }
        if (this.changeContent == "是") {
          keys = [
            ...keys,
            {
              key: "content",
              value: this.updateMulTask.content
            }
          ];
        }
        if (this.changePriority == "是") {
          keys = [
            ...keys,
            {
              key: "priority",
              value: this.updateMulTask.priority
            }
          ];
        }
        if (this.changeLevel == "是") {
          keys = [...keys, {
            key: "level",
            value: this.updateMulTask.level
          }];
        }
        if (this.changeStatus == "是") {
          keys = [...keys, {
            key: "status",
            value: this.updateMulTask.status
          }];
        }

        if (this.changeTime == "是") {
          keys = [
            ...keys,
            {
              key: "start",
              value: dataFormat(this.updateMulTask.datetime[0])
            },
            {
              key: "end",
              value: dataFormat(this.updateMulTask.datetime[1])
            }
          ];
        }

        let data = {
          method: "put",
          ids: this.multipleSelection.map(item => item.id).join(","),
          keys: "{" +
            keys.map((t, i) => {
              return `"${t.key}":"${t.value}"`;
            }) +
            "}"
        };
        HTTP.mulPutAssetes(data).then(({
          data
        }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.mulEditDialog = false;
            this.$refs.assetTable.clearSelection();
            this.getAssetList(2);
            this.changeName = "否";
            this.changeContent = "否";
            this.changeLevel = "否";
            this.changePriority = "否";
            this.changeTime = "否";
            this.changeStatus = "否";

            this.updateMulTask = {};
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    //行内修改资产保存
    saveEdit(index, row) {
      this.value1=false;
      if (isSaved) {
        return;
      }
      isSaved = true;

      function DateFormat(dateVal) {
        return dayjs(dateVal).format("YYYY/MM/DD");
      }
      this.iconShow = false;
      this.dbCell = false;
      let payload = {
        id: row.id,
        content: row.content,
        priority: row.priority,
        level: row.level,
        ...this.ImgForm,
        session: row.session,
        frame: row.frame,
        episode: row.episode,
        name: row.name,
        method: "put",
        remark: row.remark,
        report: row.report,
        retime: row.retime,
        frame_range: row.frame_range,
        start: DateFormat(row.start_date),
        end: DateFormat(row.end_date),
        reference: row.pro_reference
      };
      let smallStatus = {};
      if (row.small_status) {
        smallStatus = {
          small_status_id: row.small_status,
          asset_id: row.id
        };
      }
      if (payload.start === "Invalid Date") {
        delete payload.start;
      }
      if (payload.end === "Invalid Date") {
        delete payload.end;
      }
      if (!payload.small_status) {
        delete payload.small_status;
      }
      HTTP.editAssets(payload)
        .then(({
          data
        }) => {
          if (smallStatus) {
            editSmallStatus(smallStatus).then(({
              data
            }) => {});
          }
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.editing = false;
          } else {
            this.$message.error(data.msg);
            this.AssetList[this.cellValueCache.index] = Object.assign({},
              this.AssetList[this.cellValueCache.index], {
                [this.cellValueCache.property]: this.cellValueCache.value
              }
            );
          }
          this.columnSelect2 = [];
          this.columnSelect1 = [];
          this.getProjectNum();
        })
        .catch(() => {
          this.AssetList[this.cellValueCache.index] = Object.assign({},
            this.AssetList[this.cellValueCache.index], {
              [this.cellValueCache.property]: this.cellValueCache.value
            }
          );
        })
        .finally(() => {
          isSaved = false;
        });
    },
    change() {
      this.$forceUpdate();
    },
    //跳转批量上传页
    targetdownload() {
      this.$router.push({
        name: "asset-import",
        params: {
          id: this.$route.params.id
        },
        query: {
          type: this.drawerType
        }
      });
    },
    //跳转导出页面dialog
    targetUpload() {
      HTTP.queryAssets({
          ...this.multiSelect,
          ...this.name,
          project: this.$route.params.id,
          print: "null",
          asset_type: this.drawerType === "scene" ? 0 : 1
        })
        .then(({
          data
        }) => {
          if (data.status === 0) {
            this.uploadVisible = true;
            this.path = data.path;
            this.multiSelect = [];
            this.name = [];
          }
        })
        .catch(err => {
          this.$message.error(data.msg);
          // this.uploadVisible = true;
          this.multiSelect = [];
          this.name = [];
        });
    },
    //导出Excel
    download() {
      let data = this.$store.state.BASE_URL + this.path;
      window.location.href = data;
      this.uploadVisible = false;
    },
    uploadExcel() {
      //  this.download();
      this.uploadVisible = false;
    },
    //获取资产或者镜头列表，type=1时表示重置（包括单条件筛选）
    getAssetList(type, oneSel, name) {
      this.name = name;
      this.oneSel = oneSel;
      let payload = {
        project: this.$route.params.id,
        asset_type: this.drawerType === "scene" ? 0 : 1
      };
      switch (type) {
        case 1: //重置
          this.cutType = -1;
          this.currentPage = 1;
          this.$refs["assetFilter"].showMul(); //重置筛选条件展示
          this.$refs["assetSel"].refreshOneSel(); //重置单条件筛选
          this.sortfilter = null; //重置多条件筛选存储的条件
          this.valSel = null; //重置table表内筛选（状态、难度、优先级）存储的条件
          this.oneSel = null; //重置单条件排序存储的条件
          this.sortMulFilter = null; //重置多条件排序存储的条件
          payload = {
            ...payload,
            pagenum: 20,
            page: 1
          };
          break;
        case 2: //正常查询
          payload = {
            ...payload,
            pagenum: 20,
            page: 1
          };
          break;
        case 3: //单条件筛选查询
          this.cutType = 5;
          payload = {
            ...payload,
            ...oneSel,
            pagenum: this.pageSize,
            page: this.currentPage
          };
          break;
        case 4: //单条件筛选下的分页
          payload = {
            ...payload,
            ...oneSel,
            pagenum: this.pageSize,
            page: this.currentPage
          };
          break;
        case -1: //正常查询下的分页
          payload = {
            ...payload,
            pagenum: this.pageSize,
            page: this.currentPage
          };
          break;
      }
      this.tableLoading = true;
      HTTP.queryAssets(payload)
        .then(({
          data
        }) => {
          if (data.status === 0) {
            this.assignmentAssetList(data.msg)
            this.total = data.count;
            this.pageCount = data.page_count;
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    //获取操作资产权限
    getAuth() {
      HTTP.auth().then(({
        data
      }) => {
        if (data.status === 0) {
          this.authAsset = data.auth.manage_asset;
        }
      });
    },
    //获取项目的状态
    getProjectAllStatus() {
      getProjectStatus({
        project_id: this.$route.params.id
      }).then(
        ({
          data
        }) => {
          if (data.status === 0) this.projectStatus = [...data.msg];
          this.projectStatus.forEach((item, index) => {
            switch (item) {
              case 0:
                this.pause.push({
                  label: "ON_HOLD",
                  id: item
                });
                break;
              case 1:
                this.pause.push({
                  label: "IGNORE",
                  id: item
                });
                break;
              case 2:
                this.pause.push({
                  label: "PAUSE",
                  id: item
                });
                break;
              case 3:
                this.notstart.push({
                  label: "NNT_STARTED",
                  id: item
                });
                break;
              case 4:
                this.notstart.push({
                  label: "WATING_TO_START",
                  id: item
                });
                break;
              case 5:
                this.notstart.push({
                  label: "REAY_TO_START",
                  id: item
                });
                break;
              case 6:
                this.conducting.push({
                  label: "NORMAL",
                  id: item
                });
                break;
              case 7:
                this.conducting.push({
                  label: "OPEN",
                  id: item
                });
                break;
              case 8:
                this.conducting.push({
                  label: "IN_PROGESS",
                  id: item
                });
                break;
              case 9:
                this.conducting.push({
                  label: "OUTSOURCE",
                  id: item
                });
                break;
              case 10:
                this.conducting.push({
                  label: "SUBMITTED",
                  id: item
                });
                break;
              case 11:
                this.conducting.push({
                  label: "FEEDBACK",
                  id: item
                });
                break;
              case 12:
                this.conducting.push({
                  label: "READED",
                  id: item
                });
                break;
              case 13:
                this.conducting.push({
                  label: "TEST",
                  id: item
                });
                break;
              case 14:
                this.conducting.push({
                  label: "RR",
                  id: item
                });
                break;
              case 15:
                this.conducting.push({
                  label: "REDO",
                  id: item
                });
                break;
              case 16:
                this.approving.push({
                  label: "APPROVE",
                  id: item
                });
                break;
              case 17:
                this.approving.push({
                  label: "PENDING_REVIEW",
                  id: item
                });
                break;
              case 18:
                this.approving.push({
                  label: "DAILIES",
                  id: item
                });
                break;
              case 19:
                this.approving.push({
                  label: "CLIENT_REVIEW",
                  id: item
                });
                break;
              case 20:
                this.finish.push({
                  label: "CBB",
                  id: item
                });
                break;
              case 21:
                this.finish.push({
                  label: "APPROVED",
                  id: item
                });
                break;
              case 22:
                this.finish.push({
                  label: "DIRECTOR_APPROVED",
                  id: item
                });
                break;
              case 23:
                this.finish.push({
                  label: "REVISION",
                  id: item
                });
                break;
              case 24:
                this.finish.push({
                  label: "FINAL",
                  id: item
                });
                break;
              case 25:
                this.finish.push({
                  label: "DELIVERED",
                  id: item
                });
                break;
              case 26:
                this.finish.push({
                  label: "OMITTED",
                  id: item
                });
                break;
              case 27:
                this.finish.push({
                  label: "CLOSED",
                  id: item
                });
                break;
            }
          });
        }
      );
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //展示资产侧栏
    show(row) {
      this.value1 = true;
      this.$refs["assetDrawer"].show(row.id);
    },
    //展示任务侧栏
    showDrawer(item) {
      this.showdrawer = true;
      this.$refs["taskDrawer"].showDrawer(item);
    },
    //侧栏关闭
    drawerClose() {
      this.value1 = false;
    },
    //删除单个资产
    deleteAssets(id) {
      this.value1=false
      this.$confirm("此操作将永久删除该资产, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //console.log(id);
        HTTP.deleteAssets({
          id
        }).then(({
          data
        }) => {
          this.$message.success(data.msg);
          if (data.status === 0) {
            this.getAssetList(2);
          }
        });
      });
    },
    //批量删除资产
    delMulAssets() {
      this.$confirm("此操作将永久删除资产, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join(",");
        // console.log(ids);
        HTTP.deleteAssets({
          ids
        }).then(({
          data
        }) => {
          this.$message.success(data.msg);
          if (data.status === 0) {
            this.getAssetList(2);
          }
        });
      });
    },
    cancel() {
      this.isShow = false;
      this.$refs["assetForm"].resetFields();
      this.AssetForm = {
        priority: 0
      };
      this.SRC = "";
    },
    cancel2() {
      this.SRC = "";
      this.dialogImg = false;
    },
    //新建
    addAsset() {
      this.$refs["assetForm"].validate(valid => {
        if (valid) {
          this.createLoading = true;
          if (this.DialogName == 1) {
            if (this.activeName === "tab0") {
              this.AssetForm = Object.assign({}, this.AssetForm, {
                project: this.$route.params.id,
                asset_type: 0
              });
            } else {
              this.AssetForm = Object.assign({}, this.AssetForm, {
                project: this.$route.params.id,
                asset_type: 1
              });
            }

            HTTP.postAssets(this.AssetForm)
              .then(({
                data
              }) => {
                this.createLoading = false;
                this.$message.success(data.msg);
                if (data.status === 0) {
                  this.getAssetList(2);
                  this.AssetForm = Object.assign({}, {
                    priority: 0
                  });
                }
                this.isShow = false;
              })
              .catch(err => {
                this.createLoading = false;
              });
          }
          if (this.DialogName === 2) {
            this.AssetForm = Object.assign({}, this.AssetForm, {
              method: "put"
            });
            HTTP.editAssets(this.AssetForm)
              .then(({
                data
              }) => {
                if (data.status === 0) {
                  this.$message.success(data.msg);
                  this.getAssetList(2);
                  this.isShow = false;
                } else {
                  this.$message.error(data.msg);
                }
              })
              .catch(err => {
                this.$message.error(err.msg);
              });
          }
        } else {
          return false;
        }
      });
      this.DialogName = null;
    },
    //监听图片上传成功
    handleSuccess(response, file, fileList) {
      this.SRC = this.$store.state.BASE_URL + response.msg;
      this.AssetForm.image = response.msg;
      this.AssetForm.image_id = response.id;
      this.ImgForm.image = response.msg;
      this.ImgForm.image_id = response.id;
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      switch (this.cutType) {
        case 1:
          this.MulSel(this.sortSelForm, 2); //多条件筛选分页查看
          break;
        case 2:
          this.closeSelectedTag(this.sortSelForm, 2); //剩余筛选条件再筛选分页查看
          break;
        case 3:
          this.sortFilter(this.sortfilter, 2); //单条件排序分页查看
          break;
        case 4:
          this.filterHandler(this.valSel, 2); //table表内状态、难度和优先级排序分页查看
          break;
        case 5:
          this.getAssetList(4, this.oneSel); //单条件筛选下的分页
          break;
        case 6:
          this.sortMul(this.sortMulFilter, 2); //多条件排序下的分页
        case -1:
          this.getAssetList(-1); //正常请求后分页
          break;
      }
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      switch (this.cutType) {
        case 1:
          this.MulSel(this.sortSelForm, 2); //多条件筛选分页查看
          break;
        case 2:
          this.closeSelectedTag(this.sortSelForm, 2); //剩余筛选条件再筛选分页查看
          break;
        case 3:
          this.sortFilter(this.sortfilter, 2); //单条件排序分页查看
          break;
        case 4:
          this.filterHandler(this.valSel, 2); //table表内状态、难度和优先级排序分页查看
          break;
        case 5:
          this.getAssetList(4, this.oneSel); //单条件筛选下的分页
          break;
        case 6:
          this.sortMul(this.sortMulFilter, 2); //多条件排序下的分页
        case -1:
          this.getAssetList(-1); //正常请求后分页
          break;
      }
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    //难度格式化显示
    Level: function (row, column) {
      switch (row.level) {
        case 0:
          return "A+";
          break;
        case 1:
          return "A";
          break;
        case 2:
          return "A-";
          break;
        case 3:
          return "B+";
          break;
        case 4:
          return "B";
          break;
        case 5:
          return "B-";
          break;
        case 6:
          return "C+";
          break;
        case 7:
          return "C";
          break;
        case 8:
          return "D+";
          break;
        case 9:
          return "D";
          break;
        case 10:
          return "E";
          break;
      }
    },
    //优先级格式化显示
    Priority: function (row, column) {
      switch (row.priority) {
        case 0:
          return "正常";
          break;
        case 1:
          return "优先";
          break;
      }
    },
    // 赋值AssetList,并且改变里面的日期格式（后端返回的时间戳*1000）
    assignmentAssetList(arr) {
      this.AssetList = [...arr];
      this.AssetList.forEach(t => {
        t.start_date = !t.start_date ? t.start_date : t.start_date * 1000;
        t.end_date = !t.end_date ? t.end_date : t.end_date * 1000;
      });
    }
  },
  created() {
    this.getMenuList();
    this.getProjectNum();
    this.$emit("getGroup");
    this.getAuth();
    // this.getAssetList(2);
    this.getProjectAllStatus();
    if (this.assetId) {
      this.$refs["assetDrawer"].show(this.assetId);
    }
  }
};
