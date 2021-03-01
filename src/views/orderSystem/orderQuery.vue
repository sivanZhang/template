<template>
  <div id="orderList">
    <el-row style="margin-bottom:10px;">
      <el-col :span="4"   style="margin-top:5px;">井名称：
        <el-input class="input" v-model="wellName" style="width:130px;"></el-input>
      </el-col>
      <el-col :span="7" class="order" >指令下发时间：<el-date-picker
          v-model="orderTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:240px;"
        ></el-date-picker></el-col>
      <el-col :span="3">
        <el-button type="primary" @click="OrderSearch()">点击查询</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="orderList"
      stripe
      :border="true"
      style="width: 100%;"
      :max-height="tableHeight"
      :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
      :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
    >
      <el-table-column type="index" label="序号" width="80px;" align="center"></el-table-column>
      <el-table-column prop="wellname" label="井名称" align="center" width="110px;"></el-table-column>
      <el-table-column prop="user" label="指令下发人" align="center" width="110px;"></el-table-column>
      <el-table-column label="指令下发时间" align="center" width="150px;">
        <template slot-scope="scope">{{scope.row.date|dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column
        prop="order_type"
        label="指令类型"
        :formatter="Order_type"
        width="150px"
        align="center"
      ></el-table-column>
      <el-table-column prop="text" label="指令说明" align="center"></el-table-column>
      <el-table-column prop="order" label="指令代码" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="Status" align="center" width="80px;"></el-table-column>
      <el-table-column label="执行日期" align="center">
        <template slot-scope="scope">{{scope.row.exe_date|dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column prop="result" label="执行结果" align="center"></el-table-column>
    </el-table>
    <div style="margin-top:50px"></div>
  </div>
</template>
<script>
import { ApiGetOrders } from "@/api/welldetail";
import dayjs from "dayjs";
export default {
  data() {
    return {
      orderList: [],
      wellName: null,
      orderTime: "",
      clientHeight:"",
      tableHeight:0
    };
  },
  methods: {
    //获取指令列表
    getOrderList() {
      ApiGetOrders().then(res => {
        this.orderList = res.data.msg;
      });
    },
    //查询
    OrderSearch() {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      let data = {
        well_no: this.wellName,
        daterange:
          dataFormat(this.orderTime[0]) + "-" + dataFormat(this.orderTime[1])
      };
      if (data.daterange === "Invalid Date-Invalid Date") {
        delete data.daterange;
      }
      ApiGetOrders(data).then(res => {
        this.orderList = res.data.msg;
        // this.total = res.data.msg.;
      });
    },
    Order_type: function(row, column) {
      switch (row.order_type) {
        case 0:
          return " 维持当前运行状态";
          break;
        case 1:
          return "固定频率调参";
          break;
        case 2:
          return "现场系统调参";
          break;
        case 3:
          return "参量调整";
          break;
        case 4:
          return "直接指令";
          break;
      }
    },
    Status: function(row, column) {
      switch (row.status) {
        case 0:
          return "未执行";
          break;
        case 1:
          return "已执行";
          break;
        case 2:
          return "已发送";
          break;
        case 3:
          return "发送失败";
          break;
      }
    }
  },
  created() {
    this.getOrderList();
    this.clientHeight =   `${document.documentElement.clientHeight}`          //document.body.clientWidth;
    this.tableHeight = this.clientHeight - 270
  }
};
</script>
<style lang="scss" scoped>
#orderList {
  //   font-size: 12px;
  min-height: 90vh;
  background-color: #f4f5f5;
  .order{
    margin-left:15px;
    margin-top:5px;
  }
}
</style>
