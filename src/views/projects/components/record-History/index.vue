<template>
  <div id="tablerecord">
    <!-- 开关井记录 -->
    <el-table
      :data="recorddata.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      stripe
      :border="true"
      style="width: 100%;"
      max-height="485px"
      :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
      :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
    >
      <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
      <el-table-column label="开/关井" width="200px;" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.status==0" class="cell-wellstatus">
            <span class="well-status">{{scope.row.status|wellStatus}}</span>
            <svg-icon icon-class="wellon" />
          </div>
          <div v-if="scope.row.status==1" class="cell-wellstatus">
            <span class="well-status">{{scope.row.status|wellStatus}}</span>
            <svg-icon icon-class="welloff" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center">
        <template slot-scope="scope">{{scope.row.time|timeDateFormat}}</template>
      </el-table-column>
      <el-table-column prop="last" label="持续时间" align="center"></el-table-column>
    </el-table>
    <div class="block" style="text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizeList"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="recorddata.length"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { ApiGetWellRecord } from "@/api/welldetail";
import dayjs from "dayjs";
export default {
  name: "recordHistory",
  data() {
    return {
      recorddata: [],
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSizeList: [10, 30, 50, 100],
      pageSize:10, // 每页的数据条数
      wellid: "",
      date:""
    };
  },
  methods: {
    //分页
     handleSizeChange(val) {
      this.pageSize = val;
      this.getRecordData(this.wellid,this.date)
    },
    //分页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      switch (this.cutType) {
        case -1:
          this.getRecordData(this.wellid,this.date);//正常查看
          break;
      }
      //
    },
    getRecordData(wellid, date) {
      this.wellid = wellid
      this.date = date;
      let lines = {};
      lines = {
        pagenum: this.pageSize,
        page: this.currentPage,
        id: wellid,
        daterange: date
      };
      ApiGetWellRecord(lines).then(res => {
        // this.recorddata = data;
        this.recorddata = res.data;
      });
    },
  }
};
</script>
<style lang="scss" scoped>
</style>