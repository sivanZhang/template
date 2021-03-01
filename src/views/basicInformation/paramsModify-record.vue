<template>
  <div id="wellList">
    <el-row style="padding-bottom: 10px;">
      <el-col :span="4">
        井名：
        <el-input v-model="wellNumber" style="width:130px;"></el-input>
      </el-col>
      <el-col :span="6">
        修改时间：
        <el-date-picker
          v-model="wellDatePicker"
          type="daterange"
          align="right"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          size="mini"
          style="width:200px"
          :picker-options="pickerOptions"
          value-format="yyyy/MM/dd"
        ></el-date-picker>
      </el-col>
      <el-col :span="5">
        <el-button type="primary" @click="searchWell()" style="height:27.99px">点击查询</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="wellList"
      stripe
      :border="true"
      :max-height="tableHeight"
      style="width: 100%;"
      :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
      :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
      :row-key="(row)=>{ return row.id}"
    >
      <el-table-column type="index" width="80px" label="序号" align="center"></el-table-column>

      <el-table-column label="井名" width="120" align="center" prop="name"></el-table-column>
      <el-table-column label="操作人" width="120" align="center" prop="username"></el-table-column>
      <el-table-column label="修改时间" align="center" width="150px">
        <template slot-scope="scope">{{scope.row.date|dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column label="说明" align="left" prop="msg"></el-table-column>
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
        style="margin-top:10px"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { ApiGetWellList, ApiParamsRecord } from "@/api/wellList";
import dayjs from "dayjs";
export default {
  data() {
    return {
      wellList: [],
      wellNumber: null,
      wellDatePicker: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              // const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, start]);
            }
          },
          {
            text: "最近7日",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近30日",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      total: 0,
      currentPage: 1,
      pageSize:10,
      pageSizeList: [10, 30, 50, 100],
      cutType: -1 //分页类型
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.GetwellList();
    },
    //分页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      switch (this.cutType) {
        case -1:
          this.GetwellList();  //正常查看
          break;
        case 1:
          this.searchWell(); //筛选分页查看
          break;
      }
      //
    },
    GetwellList()  {
      ApiParamsRecord({ page: this.currentPage, pagenum: this.pageSize }).then(
        res => {
          this.wellList = res.data.msg.well_list;
        this.total = res.data.msg.total;
        }
      );
    },
    searchWell() {
        this.cutType = 1;
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      let data = {
        page: this.currentPage,
         pagenum: this.pageSize,
        wellno: this.wellNumber,
        daterange: this.wellDatePicker[0] + "-" + this.wellDatePicker[1]
      };
      if (data.daterange === "undefined-undefined") {
        delete data.daterange;
      }
      ApiParamsRecord(data).then(res => {
        this.wellList = res.data.msg.well_list;
         this.total = res.data.msg.total;
      });
    }
  },
  created() {
       this.GetwellList();
    this.clientHeight = `${document.documentElement.clientHeight}`; //document.body.clientWidth;
    this.tableHeight = this.clientHeight - 270;
  }
};
</script>
<style lang="scss">
#wellList {
  min-height: 90vh;
  .btn {
    text-align: right;
  }
  //   font-size: 12px;
  background-color: #f4f5f5;
  .links {
    cursor: pointer;
    color: #918e8e;
  }
  // .row-bg {
  //   padding-bottom: 10px;
  // }
}
</style>
