<template>
  <div id="alarmList">
      <el-row class="row-bg" :gutter="20">
        <el-col class="col-bg">
          井名:
          <el-input class="input" v-model="wellName"></el-input>
        </el-col>
        <el-col class="col-bg">
          告警类型:
          <el-select class="select" v-model="alarmCategory" placeholder="请选择" filterable>
            <el-option
              v-for="item in category"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col class="col-bg">
          告警时间:
          <el-date-picker
            class="datePicker"
            v-model="alarmDatePicker"
            type="daterange"
            align="right"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            size="mini"
            :picker-options="pickerOptions"
            value-format="yyyy/MM/dd"
          ></el-date-picker>
        </el-col>
        <el-col class="col-bg">
          产生方式:
          <el-select class="select" v-model="productWay" placeholder="请选择" filterable>
            <el-option
              v-for="item in way"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col class="col-bg">
          处置人:
          <el-input class="input" v-model="handleMan"></el-input>
        </el-col>
        <el-col class="col-bg">
          告警状态:
          <el-select class="select" v-model="alarmStatus" placeholder="请选择" filterable>
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col class="col-bg">
          处置时间:
          <el-date-picker
            class="datePicker"
            v-model="handleDatePicker"
            type="daterange"
            align="right"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            size="mini"
            :picker-options="pickerOptions"
            value-format="yyyy/MM/dd"
          ></el-date-picker>
        </el-col>
        <el-col>
          <el-button type="primary" class="btn" @click="search()">点击查询</el-button>
        </el-col>
        <el-col>
          <el-popover placement="right" trigger="click" width="250" v-model="visible">
            <el-row>
              <el-col :span="24">
                <el-row>
                  <el-col :span="8">井ID:</el-col>
                  <el-col :span="16"><el-input v-model="wellid" placeholder="请输入井的ID"/></el-col>
                </el-row>
                <el-row style="height:8px"/>
                <el-row>
                  <el-col :span="8">告警类型:</el-col>
                  <el-col :span="16">
                    <el-select v-model="alarmCategory" placeholder="请选择告警类型" filterable>
                      <el-option
                        v-for="item in category"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row style="height:8px"/>
                <el-row>
                  <el-col :span="8">告警标题:</el-col>
                  <el-col :span="16"><el-input v-model="alarmTitle" placeholder="请输入告警标题"/></el-col>
                </el-row>
                <el-row style="height:8px"/>
                <el-row>
                  <el-col :span="8">产生方式:</el-col>
                  <el-col :span="16">
                    <el-select v-model="productWay" placeholder="请选择产生方式" filterable>
                      <el-option
                        v-for="item in way"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row style="height:8px"/>
                <el-row>
                  <el-col :span="8">告警内容:</el-col>
                  <el-col :span="16"><el-input v-model="content" placeholder="请输入告警内容"/></el-col>
                </el-row>
                <el-row style="height:8px"/>
                <el-row>
                  <el-col :span="8">告警状态:</el-col>
                  <el-col :span="16">
                    <el-select v-model="alarmStatus" placeholder="请选择告警状态" filterable>
                      <el-option
                        v-for="item in status"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row style="height:20px"/>
                <el-row>
                  <el-col :span="12"><el-button size="mini" type="primary" @click="visible = false">取消</el-button></el-col>
                  <el-col :span="12"><el-button type="primary" size="mini" @click="addWell">确定</el-button></el-col>
                </el-row>
              </el-col>
            </el-row>
            <div slot="reference">
              <el-button type="primary" icon="el-icon-plus" class="btn" v-if="disabled">添加告警</el-button>
            </div>
          </el-popover>
        </el-col>
        <el-col>
          <el-button type="primary" class="btn" v-if="disabled" icon="el-icon-setting" @click="dialog = true">告警设置</el-button> 
          <el-drawer
            title="告警设置"
            :visible.sync="dialog"
            direction="rtl"
            style="margin-top:52px"
            custom-class="drawer"
            ref="drawer"
            size="32%"
            :modal="false"
            >
            <div class="drawer_content" style="margin-left:20px">
              <el-row>
                <span style="font-size:25px;font-weight:bold;">出现以下情况时系统自动告警</span>
              </el-row>
              <el-row style="height:30px"/>
              <el-row>
                <el-switch
                  style="display: block"
                  v-model="value1"
                  active-color="#ff4949"
                  inactive-color="#13ce66"
                  active-text="停机"
                  inactive-text="开机">
                </el-switch>
              </el-row>
              <el-row style="height:30px"/>
              <el-row>
                <el-col :span="12">油压不在范围：
                  <el-input v-model="oil_pressure1" style="width:40px"/> 至 <el-input v-model="oil_pressure2" style="width:40px"/>
                </el-col>
                <el-col :span="12">动液面不在范围：
                  <el-input v-model="level1" style="width:40px"/> 至 <el-input v-model="level2" style="width:40px"/>
                </el-col>
              </el-row>
              <el-row style="height:15px"/>
              <el-row>
                <el-col :span="12">日产量不在范围：
                  <el-input v-model="output1" style="width:40px"/> 至 <el-input v-model="output2" style="width:40px"/>
                </el-col>
                <el-col :span="12">平衡度不在范围：
                  <el-input v-model="balance1" style="width:40px"/> 至 <el-input v-model="balance2" style="width:40px"/>
                </el-col>
              </el-row>
              <el-row style="height:15px"/>
              <el-row>
                <el-col :span="12">电压不在范围：
                  <el-input v-model="voltage1" style="width:40px"/> 至 <el-input v-model="voltage2" style="width:40px"/>
                </el-col>
                <el-col :span="12">电流不在范围：
                  <el-input v-model="electric_current1" style="width:40px"/> 至 <el-input v-model="electric_current2" style="width:40px"/>
                </el-col>
              </el-row>
              <el-row style="height:15px"/>
              <el-row>
                <el-col :span="12">有功不在范围：
                  <el-input v-model="active1" style="width:40px"/> 至 <el-input v-model="active2" style="width:40px"/>
                </el-col>
                <el-col :span="12">油温不在范围：
                  <el-input v-model="oil_temperature1" style="width:40px"/> 至 <el-input v-model="oil_temperature2" style="width:40px"/>
                </el-col>
              </el-row>
              <el-row style="height:15px"/>
              <el-row>
                <el-col :span="12">日耗电超出：
                  <el-input v-model="power_consumption" style="width:40px"/>
                </el-col>
                <el-col :span="12">载荷不在范围：
                  <el-input v-model="burden1" style="width:40px"/> 至 <el-input v-model="burden2" style="width:40px"/>
                </el-col>
              </el-row>
              <el-row style="height:15px"/>
              <el-row>
                <el-col :span="12">频率不在范围：
                  <el-input v-model="frequency1" style="width:40px"/> 至 <el-input v-model="frequency2" style="width:40px"/>
                </el-col>
                <el-col :span="12">套压不在范围：
                  <el-input v-model="nesting_pressure1" style="width:40px"/> 至 <el-input v-model="nesting_pressure2" style="width:40px"/>
                </el-col>
              </el-row>
              <el-row style="height:15px"/>
              <div class="drawer_footer" style="margin-left:140px;margin-top:40px">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="alarmSet">确 定</el-button>
              </div>
            </div>
          </el-drawer>   
        </el-col>
      </el-row>
    <el-table
      :data="alarmList"
      stripe
      :border="true"
      highlight-current-row
      style="width: 100%;"
      :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
      :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
    >
      <el-table-column type="index" width="95" label="序号" align="center"></el-table-column>
      <el-table-column prop="well" width="140" label="井" align="center"></el-table-column>
      <el-table-column width="140" label="告警类型" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.category==0">
            {{scope.row.category|alarmCategory}}
          </div>
          <div v-if="scope.row.category==1">
            {{scope.row.category|alarmCategory}}
          </div>
          <div v-if="scope.row.category==2">
            {{scope.row.category|alarmCategory}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="title" width="240" label="告警标题" align="center"></el-table-column>
      <el-table-column width="140" label="产生方式" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.way==0">
            <span>{{scope.row.way|alarmWay}}</span>
            <svg-icon icon-class="xitong" />
          </div>
          <div v-if="scope.row.way==1">
            <span>{{scope.row.way|alarmWay}}</span>
            <svg-icon icon-class="renwei" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="告警时间" width="180px" align="center">
        <template slot-scope="scope">{{scope.row.date|dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column width="110" label="告警状态" align="center">
         <template slot-scope="scope">
          <el-select 
            filterable
            v-model="alarmStatus" 
            placeholder="请选择" 
            v-if="editing&&clickId === scope.row.id">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span v-if="!editing||clickId !== scope.row.id">
            <div v-if="scope.row.status==0">
              <span>{{scope.row.status|alarmStatus}}</span>
              <svg-icon icon-class="xinzeng" />
            </div>
            <div v-if="scope.row.status==1">
              <span>{{scope.row.status|alarmStatus}}</span>
              <svg-icon icon-class="hulve" />
            </div>
            <div v-if="scope.row.status==2">
              <span>{{scope.row.status|alarmStatus}}</span>
              <svg-icon icon-class="guanbi" />
            </div>
            <div v-if="scope.row.status==3">
              <span>{{scope.row.status|alarmStatus}}</span>
              <svg-icon icon-class="wubao" />
            </div>
            <div v-if="scope.row.status==4">
              <span>{{scope.row.status|alarmStatus}}</span>
              <svg-icon icon-class="yichuzhi" />
            </div>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="110" label="告警处置" align="center">
        <template slot-scope="scope">
          <router-link
            style="cursor: pointer;color:blue"
            :to="{name:'alarmDetail',params:{id:scope.row.id},query:{type:scope.row.pro_type}}"
          >处置详情</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="username" width="90" label="处置人" align="center"></el-table-column>
      <el-table-column label="处置时间" width="180px" align="center">
        <template slot-scope="scope">{{scope.row.modify_date|dateTimeFormat}}</template>
      </el-table-column>
      <!-- <el-table-column prop="welltype" width="110" label="处置状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.status==0">
            <span>未处置</span>
            <svg-icon icon-class="weichuzhi" />
          </div>
          <div v-if="scope.row.status==1">
            <span>忽略</span>
            <svg-icon icon-class="hulve" />
          </div>
          <div v-if="scope.row.status==2">
            <span>关闭</span>
            <svg-icon icon-class="guanbi" />
          </div>
          <div v-if="scope.row.status==3">
            <span>误报</span>
            <svg-icon icon-class="wubao" />
          </div>
          <div v-if="scope.row.status==4">
            <span>已处置</span>
            <svg-icon icon-class="yichuzhi" />
          </div>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" width="165px" show-overflow v-if="disabled">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="修改告警状态" placement="top">
            <el-button
              v-if="!editing||clickId !== scope.row.id"
              type="primary"
              icon="el-icon-edit"
              @click="editAlarm(scope.row)"
            />
          </el-tooltip>
          <el-tooltip effect="dark" content="保存修改" placement="top">
            <el-button
              v-if="editing&&clickId === scope.row.id"
              type="success"
              icon="el-icon-check"
              @click="saveEdit(scope.$index,scope.row)"
            />
          </el-tooltip>
          <el-tooltip effect="dark" content="取消" placement="top">
            <el-button v-if="editing&&clickId === scope.row.id" type="primary" icon="el-icon-error" @click="cancleAlarm(scope.row)" />
          </el-tooltip>

          <el-tooltip effect="dark" content="删除告警" placement="top">
              <el-button 
              v-if="!editing||clickId !== scope.row.id" 
              icon="el-icon-delete" 
              type="danger"   
              @click="deleteAlarm(scope.row.id)"/>
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
          style="margin-top:10px"
        ></el-pagination>
      </div>
  </div>
</template>
<script>
import { ApiAlarmQuery,ApiaddAlarm,ApiDeleteAlarm,ApiPutAlarm} from "@/api/alarmManagement";
export default {
  data() {
    return {
      alarmList: [],
      alarmCategory: "",
      alarmStatus: "",
      alarmDatePicker: "",
      alarmDate:"",
      handleDate:"",
      handleDatePicker:"",
      handleMan:null,
      productWay:"",
      way:[
        {
          value: "0",
          label: "系统自动"
        },
        {
          value: "1",
          label: "人为手动"
        }
      ],
      category: [
        {
          value: "0",
          label: "开关井异常"
        },
        {
          value: "1",
          label: "动液面异常"
        },
        {
          value: "2",
          label: "日产量告警"
        }
      ],
      username:"",
      wellName: null,
      status: [
        {
          value: "0",
          label: "新增"
        },
        {
          value: "1",
          label: "忽略"
        },
        {
          value: "2",
          label: "关闭"
        },
        {
          value: "3",
          label: "误报"
        },
        {
          value: "4",
          label: "已处置"
        },

      ],
      pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '昨天',
            onClick(picker) {
              // const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, start]);
            }
          },{
            text: '最近7日',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近30日',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      total: 0,
      pageCount: 0,
      currentPage: 1,
      pageSize:10,
      pageSizeList: [10, 30, 50, 100],
      cutType: -1, //分页类型
      visible:false,
      wellid:"",
      alarmTitle:"",
      content:"",
      disabled:false,
      editing: false,
      clickId: null,
      iconShow: false,
      list:[],
      Info:[],
      dialog:false,
      value1: true,
      oil_pressure1:"",
      oil_pressure2:"",
      level1:"",
      level2:"",
      output1:"",
      output2:"",
      balance1:"",
      balance2:"",
      voltage1:"",
      voltage2:"",
      electric_current1:"",
      electric_current2:"",
      active1:"",
      active2:"",
      oil_temperature1:"",
      oil_temperature2:"",
      power_consumption:"",
      burden1:"",
      burden2:"",
      frequency1:"",
      frequency2:"",
      nesting_pressure1:"",
      nesting_pressure2:""
    };
  },
  methods: {
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.GetalarmList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      switch (this.cutType) {
        case -1:
          this.GetalarmList();//正常查看
          break;
        case 1:
          this.search(); //筛选分页查看
          break;
      }
      // 
    },
    //获取告警列表
    GetalarmList() {
      ApiAlarmQuery({page:this.currentPage,pagenum:this.pageSize}).then(({ data }) => {
        this.alarmList = data.msg.warnings;
        this.total = data.msg.total;
        if(data.msg.auth.manage_warning == true){
          this.disabled = true
        }
      });
    },
    //告警查询
    search(){
      this.cutType = 1;
      if(this.alarmDatePicker==""){
        this.alarmDate = ''
      }else{
        this.alarmDate = this.alarmDatePicker[0]+'-'+this.alarmDatePicker[1]
      }
      if(this.handleDatePicker==""){
        this.handleDate = ''
      }else{
        this.handleDate = this.handleDatePicker[0]+'-'+this.handleDatePicker[1]
      }
      let data = {
        well_name:this.wellName,
        category:this.alarmCategory,
        warning_date:this.alarmDate,
        way:this.productWay,
        status:this.alarmStatus,
        username:this.handleMan,
        deal_date:this.handleDate,
        page: this.currentPage,
      };
      ApiAlarmQuery(data).then(res => {
        this.alarmList = res.data.msg.warnings;
        this.total = res.data.msg.total;
      });
    },
    //运行状态格式化显示
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
    //添加告警
    addWell(){
      let data = {
        well_id:this.wellid,
        category:this.alarmCategory,
        title:this.alarmTitle,
        way:this.productWay,
        detail:this.content,
        status:this.alarmStatus
      };
      ApiaddAlarm(data).then(({ data }) => {
        if(data.status == 0){
          this.$message.success(data.msg);
          this.GetalarmList();
          this.visible = false
        }else{
          this.$message.error(data.msg);
        }
      });
    },
    //修改告警状态
    editAlarm(row) {
      this.list = JSON.stringify(row);
      if(this.disabled==true){
        if (this.iconShow === true) {
          this.$confirm("当前修改未保存", "注意", {
            confirmButtonText: "确定",
            concelButtonText: "取消",
            type: "warning"
          });
        } else {
          this.editing = true;
          this.clickId = row.id;
        }
      }
    },
    //取消修改
    cancleAlarm(row) {
        this.Info = JSON.parse(this.list);
        row.status = this.Info.status;
        this.editing = false;
        this.iconShow = false;
    },
    //删除告警
    deleteAlarm(id){
      if(this.disabled==true){
        this.$confirm("是否删除该告警?", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          ApiDeleteAlarm({ ids: id, method: "delete " }).then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.GetalarmList();
            } else {
              this.$message.error(data.msg);
            }
          });
        });
      }
    },
    //保存修改
    saveEdit(index, row) {
      this.$confirm("确定保存当前修改？", "注意", {
        confirmButtonText: "确定",
        concelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.iconShow = false;
        ApiPutAlarm({
          method: "put",
          id: row.id,
          status:this.alarmStatus
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.editing = false;
            this.GetalarmList();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    cancel() {
      this.loading = false;
      this.dialog = false;
    },
    alarmSet(){
      this.loading = false;
      this.dialog = false;
    }
  },
  created() {
    this.GetalarmList();
  }
};
</script>
<style lang="scss">
#alarmList {
  //   font-size: 12px;
  background-color: #f4f5f5;
  .links {
    cursor: pointer;
    color: #918e8e;
  };
  .el-col {
    width: auto;
  }
  .row-bg {
    padding-bottom: 10px;
  }
  .col-bg {
    padding:5px 2px 0 5px;
  }
  .input{
    width:120px
  }
  .select{
    width:140px
  }
  .datePicker{
    width:210px
  }
  .btn{
   height:27.99px;
   margin-left:10px;
   margin-top:5px;
  }
  .cell-wellstatus{
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
