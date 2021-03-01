<template>
  <div id="wellList">
    <el-row class="row-bg">
      <el-col :span="4" class="col-bg">井类别：<el-select v-model="wellCategory" placeholder="请选择" style="width:130px;" filterable>
          <el-option
            v-for="item in category"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4" class="col-bg">井名：
         <el-input v-model="wellNumber" @keyup.enter.native="searchWell()" style="width:130px;"></el-input>
      </el-col>
      <el-col :span="4" class="col-bg">状态：<el-select v-model="wellStatus" placeholder="请选择" style="width:130px;" filterable>
          <el-option
            v-for="item in wellstatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-button type="primary" style="height:27.99px;margin-left:10px" @click="searchWell()">点击查询</el-button>
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
      <el-table-column prop="number" label="井号编号" width="90px;" align="center"></el-table-column>
      <el-table-column label="井名" width="120" align="center">
        <template slot-scope="scope">
          <router-link
            style="cursor: pointer;"
            :to="{name:'well-detail',params:{id:scope.row.id},query:{type:scope.row.pro_type}}"
          >{{scope.row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80px" align="center">
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
      <el-table-column label="状态变动日期" align="center" width="150px">
        <template slot-scope="scope">{{scope.row.changed_time|dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column prop="belongs" label="归属" width="230" align="center"></el-table-column>
      <el-table-column prop="depth" label="泵深(米)" width="100" align="center"></el-table-column>
      
      <el-table-column label="类型" width="90" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.well_type==0">{{scope.row.well_type|welltype}}</div>
          <div v-if="scope.row.well_type==1">{{scope.row.well_type|welltype}}</div>
        </template>
      </el-table-column>
      <el-table-column :key="18" label="操作" align="center" width="100px;">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="添加点位数据" placement="top">
              <el-button
                 class="el-icon-plus"
                type="text"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_well"
                  @click="openDialog(scope.row.id,scope.row.well_type)"
              ></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="修改" placement="top"  v-if="scope.row.well_type==0">
            <router-link
              :to="{name:'alter-built',params:{id:scope.row},query:{type:scope.row.pro_type}}"
            >
              <el-button
                class="el-icon-edit"
                type="text"
                style="color:blue;margin-left:10px;"
                v-if="$store.state.login.userInfo.auth.manage_well"
              ></el-button>
            </router-link>
          </el-tooltip>
           <el-tooltip effect="dark" content="修改" placement="top"  v-if="scope.row.well_type==1">
            <router-link
              :to="{name:'alter-pump',params:{id:scope.row},query:{type:scope.row.pro_type}}"
            >
              <el-button
                class="el-icon-edit"
                type="text"
                style="color:blue;margin-left:10px;"
                v-if="$store.state.login.userInfo.auth.manage_well"
              ></el-button>
            </router-link>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button
              @click="deleteWell(scope.row.id)"
              icon="el-icon-delete"
              style="color:red;margin-left:10px;"
              type="text"
              v-if="$store.state.login.userInfo.auth.manage_well"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="rod" label="光杆规范" width="130" align="center"></el-table-column>
      <el-table-column prop="cover" label="套管规范" width="130" align="center"></el-table-column>
      <el-table-column prop="pipe" label="油管规范" width="130" align="center"></el-table-column>
      <!-- <el-table-column prop="machine_type" label="机型" width="130" align="center"></el-table-column> -->
      <el-table-column prop="machine" label="电机" width="130" align="center"></el-table-column>
      <el-table-column prop="crank" label="曲柄" width="130" align="center"></el-table-column>
      <el-table-column prop="box" label="配电箱" width="130" align="center"></el-table-column>
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
    <div style="margin-top:50px"></div>
    <!-- 添加点位数据 -->
    <el-dialog title="添加点位数据" :visible.sync="dialogShow" width="520px" top="5vh">
      
      <el-form :model="addData" label-width="90px">
          <el-form-item label="点位类型" prop="p_type" v-if="this.wellType== 0">
          <el-select v-model="addData.p_type" placeholder="请选择" style="width:200px;">
            <el-option
              v-for="item in typelist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="点位类型" prop="p_type" v-if="this.wellType== 1">
          <el-select v-model="addData.p_type" placeholder="请选择" style="width:200px;">
            <el-option
              v-for="item in typelist1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="点位数据类型" prop="data_type" v-if="addData.p_type!=6">
          <el-select v-model="addData.data_type" placeholder="请选择" style="width:200px;">
            <el-option
              v-for="item in datalist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="点位数据" prop="data_type" v-if="addData.p_type==6">
          <el-select v-model="addData.data_type1" placeholder="请选择" style="width:200px;">
            <el-option
              v-for="item in datalist1"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
       
        <el-form-item label="上报时间" prop="time" >
          <el-date-picker
            v-model="addData.time"
            type="datetime"
            placeholder="选择日期时间"
            style="width:200px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="点位数据" prop="p144_data">
          <el-input
            v-model="addData.p144_data"
            type="textarea"
            :rows="12"
            onkeyup="value=value.replace(/[\u4E00-\u9FA5]|[A-Za-z]/g,'')"
            placeholder="点位数据之间用英文逗号隔开"
          ></el-input>
        </el-form-item>

        <div class="btn">
          <!-- <el-button @click="cancel">取消</el-button> -->
          <el-button type="primary" @click="submitForm('addData')">创建</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { ApiGetWellList, ApiDeleteWellList } from "@/api/wellList";
import { ApiAddData ,ApiDelManualData} from "@/api/welldetail";
import { postToStorage } from "@/api/electricParamater";
import dayjs from "dayjs";
export default {
  data() {
    return {
      wellList: [],
      wellCategory: "-1",
      wellStatus: "",
      category: [
        {
          value: "-1",
          label: "全部"
        },
        {
          value: "0",
          label: "抽油机"
        },
        {
          value: "1",
          label: "螺杆泵"
        }
      ],
      wellNumber: null,
      wellstatus: [
        {
          value: "0",
          label: "开井"
        },
        {
          value: "1",
          label: "关井"
        },
        {
          value: "2",
          label: "已移除"
        }
      ],
      total: 0,
      currentPage: 1,
      pageSize:10,
      pageSizeList: [10, 30, 50, 100],
      cutType: -1, //分页类型
      clientHeight: "",
      tableHeight: 0,
      dialogShow: false,
      addData: {},
      datalist: [
        {
          value: "0",
          label: "145"
        },
        {
          value: "1",
          label: "200"
        }
      ],
      datalist1: [
        {
          value: "0",
          label: "145"
        },
        {
          value: "1",
          label: "200"
        }
      ],
       multipleSelection: [],
      typelist: [
        {
          value: "1",
          label: "位移"
        },
        {
          value: "2",
          label: "有功"
        },
        {
          value: "3",
          label: "电流 "
        },
        {
          value: "4",
          label: "载荷力"
        },
        {
          value: "5",
          label: "扭矩因数"
        },
        // {
        //   value: "6",
        //   label: "电参力"
        // }
      ],
       typelist1: [
        {
          value: "2",
          label: "有功"
        },
        {
          value: "3",
          label: "电流 "
        },
      ],
      wellType:'',
    };
  },
  methods: {
    openDialog(id,well_type) {
      this.dialogShow = true;
      this.wellid=id;
      this.wellType=well_type;
      console.log( this.wellType)
    
    },
    //添加点位数据
    submitForm(addData) {
      function dataFormat(dateVal) {
        return dayjs(dateVal).format("YYYYMMDDHHmmss");
      }
   //   const ids = this.multipleSelection.map(item => item.id);
      if(this.addData.p_type != 6){
     let params = {};
      params = {
        data_type: this.addData.data_type,
        well_id:this.wellid,
        p_type: this.addData.p_type,
        p144_data: this.addData.p144_data,
        time: dataFormat(this.addData.time),
      };
      ApiAddData(params).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
       
          this.dialogShow = false;
        } else {
          this.$message.error(data.msg);
          
        }
      });} else if (this.addData.p_type == 6) {
        let params = {};
        params = {
          well_id: this.wellid,
          data_src: "0",
          point_number: this.addData.data_type1,
          adjustment_electrical_force: this.addData.p144_data,
          date: dataFormat(this.addData.time),
        };
        postToStorage(params).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.dialogShow1 = false;
          } else {
            this.$message.error(data.msg);
          }
        });
      }
   
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
    GetwellList() {
      ApiGetWellList({ page: this.currentPage, pagenum: this.pageSize }).then(
        res => {
          this.wellList = res.data.msg.well_list;
          this.total = res.data.msg.total;
        }
      );
    },
    searchWell() {
      this.cutType = 1;
      let data = {
        page: this.currentPage,
        well_type: this.wellCategory,
        wellno: this.wellNumber,
        status:this.wellStatus
      };
      ApiGetWellList(data).then(res => {
        this.wellList = res.data.msg.well_list;
        this.total = res.data.msg.total;
      });
    },
    // 运行状态格式化显示
    Status: function(row, column) {
      switch (row.status) {
        case 0:
          return "开井";
          break;
        case 1:
          return "关井";
          break;
        case 2:
          return "设备已被移除";
          break;
      }
    },
    //删除
    deleteWell(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        ApiDeleteWellList({ well_id: id, method: "delete" }).then(
          ({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.searchWell();
            }
          }
        );
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
  .row-bg {
    padding-bottom: 10px;
  }
  .col-bg {
    padding: 5px 2px 0 5px;
  }
  .well-status {
    padding-right: 5px;
  }
  .cell-wellstatus {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
