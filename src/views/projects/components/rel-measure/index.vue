<template>
  <div id="relMeasure">
    <el-row>
      <el-button type="primary" class="btn" @click="openDialog()" size="medium">填写实测数据</el-button>
    </el-row>
    <el-row>
      <el-table
        :data="measureData"
        stripe
        :border="true"
        style="width: 100%;"
        max-height="485px"
        :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
        :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
      >
        <el-table-column type="index"  label="序号" align="center" width="80px"></el-table-column>
        <!-- <el-table-column label="井号" width="100px" align="center"></el-table-column> -->
        <el-table-column label="上报时间"  align="center">
          <template slot-scope="scope">{{scope.row.time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="实测液面(米)"  align="center" prop="level"></el-table-column>
        <el-table-column label="实测产量(吨)" align="center" prop="output"></el-table-column>
      </el-table>
       <div class="block" style="text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizeList"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    </el-row>
    <el-dialog title="填写实测数据" :visible.sync="dialogVisible" width="380px">
      <el-form :model="measureForm" ref="measure-form" label-width="100px" :rules="rules">
        <el-form-item label="实测产量" prop="yield">
          <el-input
            v-model="measureForm.yield"
            style="width:200px"
            placeholder="数量必须为数字或小数点"
            oninput="value=value.replace(/[^\d.]/g,'')"
          ></el-input>
        </el-form-item>
        <el-form-item label="实测液面" prop="liquid">
          <el-input
            v-model="measureForm.liquid"
            style="width:200px"
            placeholder="数量必须为数字或小数点"
            oninput="value=value.replace(/[^\d.]/g,'')"
          ></el-input>
        </el-form-item>
        <el-form-item label="测量日期" prop="date">
          <el-date-picker
            v-model="measureForm.date"
            type="date"
            placeholder="选择日期"
            style="width:200px"
          ></el-date-picker>
        </el-form-item>
        <div class="butn">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm('measureForm')">创建</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { ApiMeasureData, ApiGetMeasureData } from "@/api/welldetail";
import dayjs from "dayjs";
export default {
  name: "relMeasure",
  data() {
    return {
      date: null,
      dialogVisible: false,
      measureForm: {
        yield: null,
        liquid: null,
        date: null
      },
      id: this.$route.params.id,
      measureData: [],
      measuredata: [],
      rules: {},
      currentPage: 1,
      pageSize:10,
      pageSizeList: [10, 30, 50, 100],
      total: 0,
      cutType: -1, //分页类型
    };
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
    },
      //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getMeasureData(this.id)
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
       switch (this.cutType) {
        case -1:
          this.getMeasureData(this.id);
          break;
       }
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    //获取实测数据
    getMeasureData(wellid) {
      ApiGetMeasureData({ wellid: wellid,page:this.currentPage,pagenum:this.pageSize }).then(res => {
        this.measureData = res.data.msg.datas;
         this.total = res.data.msg.totalcount;
      });
    },
    submitForm(measureForm) {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      this.date = dataFormat(this.measureForm.date);
      let measure = {};
      measure = {
        wellid: this.id,
        level: this.measureForm.liquid,
        output: this.measureForm.yield,
        time: this.date
      };
      ApiMeasureData(measure).then(res => {
        if (res.data.status === 0) {
          this.$message.success(res.data.msg);
          this.dialogVisible = false;
          this.measureForm = {};
          this.getMeasureData(this.id);
        }
      else {
          this.$message.error(res.data.msg);
          this.measureForm = {};
        }
       
      });
    },

    cancel() {
      this.measureForm = {};
    }
  },
  created() {}
};
</script>
<style lang="scss" scoped>
.btn {
  margin-left: 5px;
  margin-bottom: 10px;
}
.butn {
  text-align: right;
  margin-top: 50px;
}
</style>