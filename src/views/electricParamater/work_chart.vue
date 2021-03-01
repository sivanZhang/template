<template>
  <div id="workchart" v-if="auth">
    <el-form :inline="true" class="search-form">
      <el-form-item label="井名：">
        <el-select v-model="wellid" filterable style="width: 130px">
          <el-option
            v-for="(item, index) of wellList"
            :label="item.name"
            :value="item.id"
            :key="index"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间：">
        <el-date-picker
          class="datePicker"
          v-model="datePicker"
          align="right"
          type="daterange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :picker-options="pickerOptions"
          value-format="yyyy/MM/dd"
          size="mini"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="点数：">
        <el-select
          v-model="wellPoint"
          filterable
          style="width: 90px"
          placeholder="请选择"
        >
          <el-option
            v-for="item in wellPointList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="调用类型：">
        <el-select
          v-model="dataSrc"
          filterable
          style="width: 90px"
          placeholder="请选择"
        >
          <el-option
            v-for="item in dataSrcList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="isLoading"
          type="primary"
          class="button"
          @click="Searchwell('1')"
          >点击查询</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      :data="workchartsdata"
      stripe
      v-loading="isLoading"
      :border="true"
      style="width: 100%"
      :max-height="tableHeight"
      :header-cell-style="{
        color: '#212529',
        fontSize: '16px',
        fontWeight: 400,
        'text-align': 'center',
      }"
      :row-style="{ fontSize: '16px', color: '#212529;', fontWeight: 400 }"
    >
      <el-table-column
        type="index"
        label="序号"
        width="60"
        :index="indexMethod"
        align="left"
      ></el-table-column>
      <el-table-column label="井名" align="left" width="180">
        <template slot-scope="{row}">
          {{ row.name }}<br />
          {{ row.point_number }}<br />
          示功图：{{ manualList[row.data_src].label }}<br />
          有功：{{ row.is_auto | autoFillters }}<br />
          {{ timeDateFormate(row.date) }}
        </template>
      </el-table-column>
      <el-table-column label="电参力" align="left" width="1500">
        <template slot-scope="scope">
          {{
            scope.row.adjustment_electrical_force === null
              ? ""
              : scope.row.adjustment_electrical_force.join(" ")
          }}<br />
        </template>
      </el-table-column>

      <el-table-column
        label="有功"
        align="left"
        prop="active_power"
        width="1500"
      >
        <template slot-scope="{ row }">
          {{ row.active_power }}
        </template>
      </el-table-column>
      <el-table-column label="位移数据" align="left" width="1000">
        <template slot-scope="scope">
          {{
            scope.row.displacement === null
              ? ""
              : scope.row.displacement.join(" ")
          }}<br />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="60">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button
              @click="deleteWorkCharts(scope.row.id)"
              icon="el-icon-delete"
              style="color: red"
              type="text"
            >
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="text-align: right">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizeList"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 10px"
      ></el-pagination>
    </div>
    <div style="margin-top: 50px"></div>
  </div>
</template>
<script>
import {
  ApiGetRealdata,
  ApiGetWorkChartsdata,
  ApiGetP144Auth,
  ApiDeleteWorkChartsdata,
} from "@/api/realdata";
import { ApiGetWellList } from "@/api/wellList";
import adjusttypeTips from "./components/adjusttype-tips";
import dayjs from "dayjs";
export default {
  components: {
    adjusttypeTips,
  },
  filters:{
    autoFillters(val){
      const arr = ['','从第三方自动采集','手动上传','自动上传']
      return  arr[val+2]
    }
  },
  data() {
    return {
      workchartsdata: [],
      datePicker: "", //时间
      wellPoint: "-1", //点数
      dataSrc: "-1", //调用类型
      wellPointList: [
        { value: "-1", label: "全部" },
        { value: "145", label: "145" },
        { value: "200", label: "200" },
      ],
      dataSrcList: [
        { value: "-1", label: "全部" },
        { value: "0", label: "手动" },
        { value: "1", label: "自动" },
      ],
      wellid: "",
      wellList: [], //油井列表
      manualList: [
        { value: "0", label: "手动上传" },
        { value: "1", label: "自动绘制" },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, start]);
            },
          },
          {
            text: "最近7日",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近30日",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      total: 0,
      pageCount: 0,
      currentPage: 1,
      pageSize:10,
      pageSizeList: [10, 30, 50, 100],
      cutType: -1, //分页类型
      clientHeight: "",
      tableHeight: 0,
      auth: "", //管理p144的权限
      isLoading: false,
    };
  },
  created() {
    this.getP144Auth();
    this.GetWellList();
    this.clientHeight = `${document.documentElement.clientHeight}`;
    this.tableHeight = this.clientHeight - 270;
    var list = this.getDateRange(new Date(), 30, true);
    this.datePicker = [list[0], list[1]];
  },
  methods: {
    //将时间戳转换为日期
    timeDateFormate(date) {
      if (date) {
        date *= 1000;
        return dayjs(date).format("YYYY/MM/DD HH:mm:ss");
      } else {
        return "";
      }
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.Searchwell();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.Searchwell();
    },
    //获取近30天时间的函数
    getDateRange(dateNow, intervalDays, bolPastTime) {
      let oneDayTime = 24 * 60 * 60 * 1000;
      let list = [];
      let lastDay;
      if (bolPastTime == true) {
        lastDay = new Date(dateNow.getTime() - intervalDays * oneDayTime);
        list.push(this.formateDate(lastDay));
        list.push(this.formateDate(dateNow));
      } else {
        lastDay = new Date(dateNow.getTime() + intervalDays * oneDayTime);
        list.push(this.formateDate(dateNow));
        list.push(this.formateDate(lastDay));
      }
      return list;
    },
    //格式化时间
    formateDate(time) {
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return year + "/" + month + "/" + day + "";
    },
    //获取油井列表
    GetWellList() {
      ApiGetWellList({ page: 1, pagenum: 100 }).then(({ data: { msg, status } }) => {
        if (status == 0) {
          this.wellList = msg.well_list;
          this.wellid = this.wellList[0].id;
          this.Searchwell();
        }
      });
    },
    //解决索引旨在前面排序的问题。增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    //获取p144权限
    getP144Auth() {
      ApiGetP144Auth({ auth: "" }).then(({ data }) => {
        this.auth = data.msg.can_manage_p144;
      });
    },
    //查询功图表格数据
    Searchwell(type) {
      this.isLoading = true;
      let data = {
        pagenum: this.pageSize,
        well_id: this.wellid,
        daterange: this.datePicker[0] + "-" + this.datePicker[1],
        data_src: this.dataSrc,
        point_number: this.wellPoint,
      };
      if (type === "1") {
        this.currentPage = 1;
      }
      data.page = this.currentPage;
      ApiGetWorkChartsdata(data)
        .then((res) => {
          this.workchartsdata = res.data.msg;
          this.total = res.data.toalcount;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    //删除数据
    deleteWorkCharts(id) {
      this.$confirm("此操作将永久删除数据，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ApiDeleteWorkChartsdata({ method: "delete", ids: id }).then(
            ({ data }) => {
              if (data.status === 0) {
                this.$message.success(data.msg);
                this.Searchwell("1");
              } else {
                this.$message.error(data.msg);
              }
            }
          );
        })
        .catch((e) => e);
    },
  },
};
</script>
<style lang="scss" scoped>
#workchart {
  min-height: 90vh;
  font-size: 12px;
  background-color: #f4f5f5;
  .button {
    height: 27.99px;
  }
  .links {
    cursor: pointer;
    color: #918e8e;
  }
  .datePicker {
    width: 210px;
  }
  .explain {
    display: flex;
    align-items: center;
  }
}
</style>
<style lang="scss">
#workchart {
  .search-form {
    .el-form-item--mini.el-form-item {
      margin-right: 24px;
      .el-form-item__label {
        padding-right: 4px;
      }
    }
  }
}
</style>