<template>
  <div id="pumpTypeList">
    <div>
      <el-button
        style="margin-bottom:10px"
        type="primary" 
        icon="el-icon-plus"
        @click="openDialog()">
        添加机型
      </el-button>
    </div>
    <el-table
      :data="pumpTypeList"
      stripe
      :border="true"
      :max-height="tableHeight"
      style="width: 100%;"
      :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
      :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
      :row-key="(row)=>{ return row.id}"
    >
      <el-table-column type="index" width="150px" label="序号" align="center"></el-table-column>
      <el-table-column prop="type_name" label="机型名称" width="400px;" align="center"></el-table-column>
      <el-table-column prop="series" label="机型序列号" align="center"></el-table-column>
      <el-table-column label="转向" width="300px" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.turn==0" class="cell-wellturn">
            <span class="well-turn">{{scope.row.turn|wellTurn}}</span>
          </div>
          <div v-if="scope.row.turn==1" class="cell-wellturn">
            <span class="well-turn">{{scope.row.turn|wellTurn}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :key="18" label="操作" align="center" 
        v-if="$store.state.login.userInfo.auth.manage_well">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="删除机型" placement="top">
            <el-button
              @click="deletePumpType(scope.row.id)"
              icon="el-icon-delete"
              style="color:red;margin-left:10px;"
              type="text"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="block" style="text-align: right">
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
    </div> -->
    <div style="margin-top:50px"></div>
    <!-- 添加机型信息 -->
    <el-dialog title="添加机型" :visible.sync="dialogShow" width="350px" top="5vh">
      <el-form :model="addPumpType" label-width="90px" :rules="rules">
        <el-form-item label="序列号" prop="series">
          <el-input
            v-model.number="addPumpType.series"
            placeholder="必须为数字"
            style="width:160px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="型号名称" prop="type_name">
          <el-input v-model="addPumpType.type_name" style="width:160px;"></el-input>
        </el-form-item>
        <el-form-item label="顺逆时针状态" prop="turn">
          <el-select v-model="addPumpType.turn" placeholder="请选择" style="width:160px;">
            <el-option
              v-for="item in hourHand"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <div  style=" text-align: right;">
          <el-button type="primary" @click="submitForm('addPumpType')">创建</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {ApiAddPumpType,ApiDeletePumpType,ApiSearchPumping} from "@/api/wellList";
import dayjs from "dayjs";
export default {
  data() {
    return {
      total: 0,
      currentPage: 1,
      pageSize:10,
      pageSizeList: [10, 30, 50, 100],
      cutType: -1, //分页类型
      clientHeight: "",
      tableHeight: 0,
      dialogShow: false,
      pumpTypeList:[],
      addPumpType: {
        turn:"0",
      },
      machinetype:[],
      rules: {
        series: [
          { required: true, message: "序列号不能为空" },
          { type: "number", message: "序列号必须为数字" }
        ],
      },
      hourHand:[
        {
          value: "0",
          label: "顺时针"
        },
        {
          value: "1",
          label: "逆时针"
        }
      ]
    };
  },
  methods: {
    openDialog() {
      this.dialogShow = true;
    },
    //增加机型
    submitForm(addPumpType){
        let params = {};
        params = {
            series: this.addPumpType.series,
            type_name: this.addPumpType.type_name,
            turn:this.addPumpType.turn
        };
        ApiAddPumpType(params).then(({ data }) => {
            this.$message.success(data.status);
            this.dialogShow = false;
            this.searchPumpType();
        });
    },
    //删除机型
    deletePumpType(id){
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
        }).then(() => {
            ApiDeletePumpType({ ids: id, method: "delete" }).then(
            ({ data }) => {
                if (data.status === 0) {
                this.$message.success(data.msg);
                this.searchPumpType();
                }
            }
            );
        });
    },
    //查询机型
    searchPumpType(){
        ApiSearchPumping().then(({ data }) => {
            this.pumpTypeList = data.msg
        })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.GetwellList();
    },
    //分页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      switch (this.cutType) {
        case -1:
          this.GetwellList(); //正常查看
          break;
        case 1:
          this.searchWell(); //筛选分页查看
          break;
      }
      //
    },
  },
  created() {
    this.searchPumpType();
    this.clientHeight = `${document.documentElement.clientHeight}`; //document.body.clientWidth;
    this.tableHeight = this.clientHeight - 200;
  }
};
</script>
<style lang="scss">
#pumpTypeList {
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
  .row-bg {
    padding-bottom: 10px;
  }
  .col-bg {
    padding: 5px 2px 0 5px;
  }
  .well-turn {
    padding-right: 5px;
  }
  .cell-wellturn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
