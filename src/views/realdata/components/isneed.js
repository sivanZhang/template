import thumbtackMixin from "@/utils/thumbtack-mixin";
import myMixin from "@/views/projects/components/mixins";
import { getLinks } from "@/api/links";
import { getDept } from "@/api/admin";
import { addTask } from "@/api/task";
import assetMulSel from "@/views/projects/components/mulConditionSel/assetMulSel";
import assetFilter from "@/views/projects/components/filterCondition/assetFilter";
import assetSel from "@/views/projects/components/oneConditionSel/assetSel";
import * as HTTP from "@/api/assets";
import { getEpisodeSession } from "@/api/statistics";
import dayjs from "dayjs";
let isSaved = false; //方式重复提交保存表格
export default {
  mixins: [myMixin, thumbtackMixin],
  components: {assetMulSel,assetFilter,assetSel},
  props: [
    "scene",
    "tableLoading",
    "pageSize",
    "pageSizeList",
    "currentPage",
    "total",
    "pageCount",
    "active"
  ],
  data() {
    return {
      multipleSelection: [],
      value1: false,
      deptUser: [],
      link: null,
      deptList: this.$store.state.login.userInfo.dept,
      DeptUsers: [],
      isCreateTaskShow: false,
      createTaskLoading: false,
      TaskForm: {},
      linkstart: null,
      linkend: null,
      assetId: null,
      assetName: null,
      mulEditDialog: false,
      updateMulTask: {},
      changeSession: "否",
      changeFrame: "否",
      changeEpisode: "否",
      changeContent: "否",
      changePriority: "否",
      changeLevel: "否",
      changeStatus: "否",
      changeTime2: "否",
      changeRemark: "否",
      changeRetime: "否",
      changeReport: "否",
      changeFrame_range: "否",
      changePro_reference: "否",
      disableSession: true,
      disableFrame: true,
      disableEpisode: true,
      disableContent: true,
      disablePriority: true,
      disableLevel: true,
      disableStatus: true,
      disableTime: true,
      disableRemark: true,
      disableRetime: true,
      disableReport: true,
      disableFrame_range: true,
      disablePro_reference: true,
      dbCell: false,
      cellId: null,
      cellCol: null,
      editing: false,
      clickId: null,
      iconShow: false,
      // 单元格里的值得缓存，以便提交失败后把原值赋值回去
      cellValueCache: null,
      LevelList: [
        {
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
      name: "",
      oneSel: null, //保存单列筛选的条件
      sortSelForm: {}, //保存多列筛选条件
      multiSelect: [],
    };
  },
  filters: {
    executorFilter(val) {
      let arr = [];
      val.forEach(item => {
        arr.push(item);
      });
      return arr.join();
    }
  },
  watch: {},
  methods: {
    //获取资产或者镜头列表，type=1时表示重置（包括单条件筛选）
    getAssetList(type, oneSel, name) {
      this.name = name;
      this.oneSel = oneSel;
      let payload = {
        tag: this.active?0:1
      };
      switch (type) {
        case 1: //重置
          this.cutType = -1;
          this.currentPage = 1;
          this.$refs["assetFilter"].showMul(); //重置筛选条件展示
          this.$refs["assetSel"].refreshOneSel(); //重置单条件筛选
          this.sortfilter = null; //重置多条件筛选存储的条件
          
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
      // console.log(payload)
      this.$emit("refresh",payload);
     
    },
    //多条件筛选
    MulSel(sortSelForm, Type) {
      this.cutType = 1;
      this.sortSelForm = sortSelForm;
      let data = {
        ...sortSelForm,
       tag:this.active?0:1
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
      this.$emit("refresh",data);
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
        tag:this.active?0:1
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
      this.$emit("refresh",data);
    },
    getProjectNum() {
      //获取集数列表
      getEpisodeSession({
        id: this.$route.params.id,
        episode: ""
      }).then(({ data }) => {
        [...data.msg].map(item => {
          this.columnSelect2.push({
            value: item,
            text: item
          });
        });
      });
      //  //获取场次列表
      getEpisodeSession({
        id: this.$route.params.id,
        session: ""
      }).then(({ data }) => {
        [...data.msg].map(item => {
          this.columnSelect1.push({
            value: item,
            text: item
          });
        });
      });
    },
    //修改资产
    editOneAsset(row) {
      this.value1 = false;
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
    //行内修改资产保存
    saveEdit(index, row) {
      this.value1 = false;
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
        .then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.editing = false;
          } else {
            this.$message.error(data.msg);
            this.scene[this.cellValueCache.index] = Object.assign(
              {},
              this.scene[this.cellValueCache.index],
              {
                [this.cellValueCache.property]: this.cellValueCache.value
              }
            );
          }
          this.columnSelect2 = [];
          this.columnSelect1 = [];
          this.getProjectNum();
        })
        .catch(() => {
          this.scene[this.cellValueCache.index] = Object.assign(
            {},
            this.scene[this.cellValueCache.index],
            {
              [this.cellValueCache.property]: this.cellValueCache.value
            }
          );
        })
        .finally(() => {
          isSaved = false;
        });
    },
    //双击修改单元格获取焦点
    editCell(row, column, cell, event) {
      this.value1 = false;

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
      const index = this.scene.findIndex(t => t.id === this.cellId);
      const newObj = JSON.parse(JSON.stringify(this.scene[index]));
      this.cellValueCache = {
        index,
        value: newObj[column.property],
        property: column.property
      };
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
    // 批量修改是否改变行
    changelist() {
      this.changeSession == "是"
        ? (this.disableSession = false)
        : (this.disableSession = true);
      this.changeFrame == "是"
        ? (this.disableFrame = false)
        : (this.disableFrame = true);
      this.changeEpisode == "是"
        ? (this.disableEpisode = false)
        : (this.disableEpisode = true);
      this.changeRemark == "是"
        ? (this.disableRemark = false)
        : (this.disableRemark = true),
        this.changeRetime == "是"
          ? (this.disableRetime = false)
          : (this.disableRetime = true),
        this.changeReport == "是"
          ? (this.disableReport = false)
          : (this.disableReport = true),
        this.changeFrame_range == "是"
          ? (this.disableFrame_range = false)
          : (this.disableFrame_range = true),
        this.changePro_reference == "是"
          ? (this.disablePro_reference = false)
          : (this.disablePro_reference = true),
        this.changeContent == "是"
          ? (this.disableContent = false)
          : (this.disableContent = true);
      this.changePriority == "是"
        ? (this.disablePriority = false)
        : (this.disablePriority = true);
      this.changeLevel == "是"
        ? (this.disableLevel = false)
        : (this.disableLevel = true);
      this.changeStatus == "是"
        ? (this.disableStatus = false)
        : (this.disableStatus = true);
      this.changeTime2 == "是"
        ? (this.disableTime = false)
        : (this.disableTime = true);
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
          keys = [
            ...keys,
            {
              key: "session",
              value: this.updateMulTask.session
            }
          ];
        }
        if (this.changeFrame == "是") {
          keys = [
            ...keys,
            {
              key: "frame",
              value: this.updateMulTask.frame
            }
          ];
        }
        if (this.changeEpisode == "是") {
          keys = [
            ...keys,
            {
              key: "episode",
              value: this.updateMulTask.episode
            }
          ];
        }
        if (this.changeRemark == "是") {
          keys = [
            ...keys,
            {
              key: "remark",
              value: this.updateMulTask.remark
            }
          ];
        }
        if (this.changeReport == "是") {
          keys = [
            ...keys,
            {
              key: "report",
              value: this.updateMulTask.report
            }
          ];
        }
        if (this.changeRetime == "是") {
          keys = [
            ...keys,
            {
              key: "retime",
              value: this.updateMulTask.retime
            }
          ];
        }
        if (this.changeFrame_range == "是") {
          keys = [
            ...keys,
            {
              key: "frame_range",
              value: this.updateMulTask.frame_range
            }
          ];
        }
        if (this.changePro_reference == "是") {
          keys = [
            ...keys,
            {
              key: "pro_reference",
              value: this.updateMulTask.pro_reference
            }
          ];
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
          keys = [
            ...keys,
            {
              key: "level",
              value: this.updateMulTask.level
            }
          ];
        }
        if (this.changeStatus == "是") {
          keys = [
            ...keys,
            {
              key: "status",
              value: this.updateMulTask.status
            }
          ];
        }

        if (this.changeTime2 == "是") {
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
          keys:
            "{" +
            keys.map((t, i) => {
              return `"${t.key}":"${t.value}"`;
            }) +
            "}"
        };
        HTTP.mulPutAssetes(data).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.mulEditDialog = false;
            this.$refs.sceneNeed.clearSelection();
            this.$emit("refresh");
            this.changeName = "否";
            this.changeContent = "否";
            this.changeLevel = "否";
            this.changePriority = "否";
            this.changeTime2 = "否";
            this.changeStatus = "否";

            this.updateMulTask = {};
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      //console.log({ row, column, rowIndex, columnIndex })

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
              color: "#FFFFFF"
            };
        }
      }
      return { borderRight: 0 };
    },
    //展示添加任务表单
    showTaskForm(link_id, dept_id, content, date_and_user,assetId,assetName,create_date,end_date) {
      getDept({
        id: dept_id
      }).then(res => {
        this.DeptUsers = [...res.data.users];
        //console.log(this.DeptUsers);
      });
      this.isCreateTaskShow = true;
      this.TaskForm = Object.assign(
        {},
        {
          priority: 0,
          grade: 7,
          asset: assetId==null?this.assetId:assetId,
          project: this.$route.params.id,
          link_id,
          content
        }
      );
      if(assetName ==null||create_date ==null ||end_date ==null ||date_and_user!= null){
        let linkdatastart = date_and_user.date_start;
      let linkdataend = date_and_user.date_end;
        this.linkstart = linkdatastart;
      this.linkend = linkdataend;
      this.TaskForm.name = this.assetName;
      } else{ 
        this.linkstart = create_date;
        this.linkend = end_date;
        this.TaskForm.name = assetName;
      }
    },
    //总工时默认值
    changeTime(val) {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      const totalHour =
        (this.TaskForm.datetime[1] - this.TaskForm.datetime[0]) /
        (1000 * 3600 * 24);
      this.TaskForm = {
        ...this.TaskForm,
        total_hour: 8 * totalHour
      };
    },
    //取消对话框
    cancelTask() {
      this.isCreateTaskShow = false;
      this.TaskForm = {};
    },
    //给某一环节添加任务
    addTasks() {
      this.$refs["TaskForm"].validate(valid => {
        if (valid) {
          this.createTaskLoading = true;
          function dataFormat(params) {
            return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
          }
          let data = {
            ...this.TaskForm,
            start_date: dataFormat(this.TaskForm.datetime[0]),
            end_date: dataFormat(this.TaskForm.datetime[1]),
            project: this.$route.params.id
          };
          if (this.TaskForm.executorlist.length) {
            data["executorlist"] = data["executorlist"].join();
          }
          delete data.datetime;
          addTask(data)
            .then(({ data }) => {
              this.createTaskLoading = false;
              this.$message.success(data.msg);
              if (data.status === 0) {
                this.cancelTask();
                this.isDialogShow = false;
                this.value1 = false;
                this.$emit("refresh");
                this.getScene();           
              }
            })
            .catch(err => {
              this.createTaskLoading = false;
            });
         //   this.$emit("refresh");
        } else {
          return false;
        }
      });     
    },
    change() {
      this.$forceUpdate();
    },
    showDrawer(row) {
      this.value1 = true;
      this.assetId = row.asset_id;
      this.assetName = row.asset_name;
      getLinks({ asset: row.asset_id }).then(({ data }) => {
        this.link = [...data.msg];
        // console.log('1111111111')
        // console.log(this.link)
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //console.log(this.multipleSelection.length);
    },
    handleSizeChange(val) {
      this.$emit("refresh_size", val);
    },
    handleCurrentChange(currentPage) {
      this.$emit("refresh_current", currentPage);
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    //难度格式化显示
    Level: function(row, column) {
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
    Priority: function(row, column) {
      switch (row.priority) {
        case 0:
          return "正常";
          break;
        case 1:
          return "优先";
          break;
      }
    }
  },
  created() {}
};