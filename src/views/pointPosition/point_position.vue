<template>
  <div id="pointposition" v-if="auth">
    <div class="content">
      <el-row class="row-bg">
        <el-col :span="4" class="col-bg">
          井名：
          <el-select
            v-model="wellid"
            filterable
            style="width:130px;"
          >
            <el-option
                  v-for="(item,index) of wellList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" style="margin-left:0px;">
            时间：
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
          </el-col>
          <el-col :span="4"  style="margin-left:-10px;">
              点数：
              <el-select
                v-model="wellPoint"
                filterable
                style="width:90px;"
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
          </el-col>
          <el-col :span="5"  style="margin-left:-40px;">
              类型：
              <el-select
                v-model="type"
                filterable
                style="width:100px;"
                placeholder="请选择"
              >   
               <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
              </el-select>
          </el-col>
           <el-col :lg="4" style="margin-left:-75px">
            调用类型：
            <el-select
              v-model="dataSrc"
              filterable
              style="width:86px;"
              placeholder="请选择"
            >
              <el-option
                v-for="item in dataSrcList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        <el-col :span="3"  style="margin-left:-20px;">
          <el-button type="primary" class="button" @click="SearchWell('1')">点击查询</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="pointsdata"
      stripe
      :border="true"
      style="width: 100%;"
      :max-height="tableHeight"
      :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:4,'text-align':'center'}"
      :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
    >
      <el-table-column type="index"  label="序号" width="60" :index="indexMethod" align="left"></el-table-column>
      <el-table-column label="井名"  align="left" width="180">
        <template slot-scope="scope">
          {{scope.row.name}}<br>
          {{scope.row.data_len}}<br>
          {{typeList[scope.row.p_type].label}}<br>
          {{manualList[scope.row.manual].label}}<br>
          {{timeDateFormate(scope.row.time)}}
        </template>
      </el-table-column>
      <el-table-column label="数据" align="left">
         <template slot-scope="scope">
          {{scope.row.datas.join(' ')}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="60">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="删除" placement="top"> 
              <el-button 
                @click="deletePoint(scope.row.id)"
                icon="el-icon-delete"
                style="color:red"
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
          style="margin-top:10px"
        ></el-pagination>
      </div>
    <div style="margin-top:50px"></div>
  </div>
</template>
<script>
import { ApiGetRealdata,ApiGetPointsdata,ApiDeletePoint, ApiGetP144Auth } from "@/api/realdata";
import { ApiGetWellList } from "@/api/wellList";
import dayjs from 'dayjs';
export default {
    data(){
        return{
            pointsdata:[],
            datePicker:'',//时间
            wellPoint:'-1',//点数
            dataSrc:'-1',//调用类型
            wellPointList: [{value: "-1",label:"全部"}, { value: "0",label:"145" }, { value: "1",label:"200" }],
            type:'-1',//类型
            typeList:[
              {value:"-1",label:"全部"},
              {value:"1",label:"位移"},
              {value:"2",label:"有功"},
              {value:"3",label:"电流"},
              {value:"4",label:"荷载力"},
              {value:"5",label:"扭矩因数"}
              ],
            manualList:[
              {value:"0",label:"手动上传"},
              {value:"1",label:"自动绘制"}
              ],
            dataSrcList: [{value:"-1",label:"全部"},{ value: "0" ,label:"手动"}, { value: "1",label:"自动"}],
            wellid:'',
            wellList:[],//油井列表
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
                    }
                },
                {
                    text: "昨天",
                    onClick(picker) {
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
            total:0,
            pageCount:0,
            currentPage:1,
            pageSize:10,
            pageSizeList:[10, 30, 50, 100],
            clientHeight:'',
            tableHeight:0,
            auth:'',//p144管理权限
            ids:[]//存储需要删除数据的id
        };
    },
    created(){
        this.getP144Auth();//获取p144管理权限
        this.GetWellList() ;//获取井号列表
        this.clientHeight=`${document.documentElement.clientHeight}`;
        this.tableHeight=this.clientHeight-270;
        var list=this.getDateRange(new Date(),30,true);
        this.datePicker=[list[0],list[1]];
    },
    methods:{
      //将时间戳转换为日期
      timeDateFormate(date){
        if(date){
          date*=1000;
          return dayjs(date).format('YYYY/MM/DD HH:mm:ss');
        }else{
          return '';
        }
      },
      //分页
      handleSizeChange(val){
        this.pageSize=val;
        this.SearchWell();
      },
      handleCurrentChange(currentPage){
        this.currentPage=currentPage;
        this.SearchWell();
      },
      //获取近30天时间的函数
      getDateRange(dateNow,intervalDays,bolPastTime){
        let oneDayTime=24*60*60*1000;
        let list=[];
        let lastDay;
        if(bolPastTime==true){
          lastDay=new Date(dateNow.getTime()-intervalDays*oneDayTime);
          list.push(this.formateDate(lastDay));
          list.push(this.formateDate(dateNow));
        }else{
          lastDay=new Date(dateNow.getTime()+intervalDays*oneDayTime);
          list.push(this.formateDate(dateNow));
          list.push(this.formateDate(lastDay));
        }
        return list;
      },
      //格式化时间
      formateDate(time){
        let year=time.getFullYear();
        let month=time.getMonth()+1;
        let day=time.getDate();
        if(month<10){
          month="0"+month;
        }
        if(day<10){
          day="0"+day;
        }
        return year+"/"+month+"/"+day+"";
      },
      //获取油井列表
       GetWellList() {
            ApiGetWellList({
                page: 1,
                pagenum: 100
            }).then(res => {
                this.wellList = res.data.msg.well_list;
                let wellid = this.wellList.map(item => {
                    return item.id;
            });
            this.wellid=wellid[0];
            this.SearchWell();
            });
        },
        //解决索引旨在前面排序的问题。增加函数自定义索引序号
        indexMethod(index){
          return (this.currentPage-1)*this.pageSize+index+1;
        },
        //获取管理片144的权限
        getP144Auth(){
           ApiGetP144Auth({ auth : "" }).then(({ data })=>{
              this.auth=data.msg.can_manage_p144;
           });
        },
        //查询点位数据
        SearchWell(type){
          let data={
            pagenum:this.pageSize,
            wellid:this.wellid,
            daterange:this.datePicker[0]+'-'+this.datePicker[1],
            data_type:this.wellPoint,
            p_type:this.type,
            manual:this.dataSrc,
            pointsdata:""
          };
          if(type === '1'){
            this.currentPage = 1;
          }
          data.page = this.currentPage;
          ApiGetPointsdata(data).then(res=>{
            this.pointsdata=res.data.msg.data
            this.total=res.data.msg.totalcount
          });
        },
        //删除数据
        deletePoint(id) {
          this.$confirm("此操作将永久删除数据，是否继续?","提示",{
            confirmButtonText:"确定",
            cancelButtonText:"取消",
            type:"warning"
          }).then(()=>{
            ApiDeletePoint({method:"delete",ids:id}).then(({ data })=>{
                if(data.status === 0){
                  this.$message.success(data.msg);
                  this.SearchWell('1');
                }else{
                  this.$message.error(data.msg);
                  
                }
            });
          }).catch(e=>e);
        }
    }
}
</script>
<style lang="scss" scoped>
#pointposition {
  min-height: 90vh;
  font-size: 12px;
  background-color: #f4f5f5;
  .content{
    padding-bottom: 10px;
  }
  .button{
    height:27.99px
  }
  .links {
    cursor: pointer;
    color: #918e8e;
  }
  .row-bg {
    padding-bottom: 10px;
  }
  .datePicker {
    width: 210px;
  }

}
</style>