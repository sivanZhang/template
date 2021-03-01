<template>
  <div id="alarmDetail">
     <el-row class="home-header" :gutter="15">
       <el-col :lg="12" class="left">
            <el-row :lg="24" class="top-item">
                <el-card shadow="always">
                    <div class="title">告警详情：</div>
                    <div style="display:flex">
                      <div class="text">告警产生时间: <span class="row-lg">{{alarmInfo.date|dateTimeFormat}}</span></div>
                      <div class="text" style="margin-left:80px;">告警产生方式:
                        <span class="row-lg" v-if="alarmInfo.way==0">
                          系统自动
                          <svg-icon icon-class="xitong" />
                        </span>
                        <span class="row-lg" v-if="alarmInfo.way==1">
                          人为手动
                          <svg-icon icon-class="renwei" />
                        </span>
                      </div>
                    </div>
                    <div class="text">告警标题: <span class="row-lg">{{alarmInfo.title}}</span></div>
                    <div class="text">告警类型:
                      <span class="row-lg" v-if="alarmInfo.category==0">
                        开关井异常
                      </span>
                      <span class="row-lg" v-if="alarmInfo.category==1">
                        动液面异常
                      </span>
                      <span class="row-lg" v-if="alarmInfo.category==2">
                        日产量告警
                      </span>
                    </div>
                    <div class="text">告警状态:
                      <span class="row-lg" v-if="alarmInfo.status==0">
                        新增
                        <svg-icon icon-class="xinzeng" />
                      </span>
                      <span class="row-lg" v-if="alarmInfo.status==1">
                        忽略
                        <svg-icon icon-class="hulve" />
                      </span>
                      <span class="row-lg" v-if="alarmInfo.status==2">
                        关闭
                        <svg-icon icon-class="guanbi" />
                      </span>
                      <span class="row-lg" v-if="alarmInfo.status==3">
                        误报
                        <svg-icon icon-class="wubao" />
                      </span>
                      <span class="row-lg" v-if="alarmInfo.status==4">
                        已处置
                        <svg-icon icon-class="yichuzhi" />
                      </span>
                    </div>
                </el-card>
            </el-row>
            <el-row style="height:20px"></el-row>
            <el-row :lg="24" class="bottom-item">
                <el-card shadow="always" :body-style="{overflowY:'scroll',height:'170px'}">
                  <template slot="header" type="flex">
                    <div class="title">告警处置过程：</div>
                    <div class="text date">{{alarmInfo.date|dateTimeFormat}}</div>
                    <div class="text">
                      <span v-if="alarmInfo.way == 0"> 
                        系统自动创建了告警
                      </span>
                      <span v-else>
                        {{alarmInfo.username}}手动创建了告警
                      </span>
                    </div>
                    <!-- <div v-if="alarmInfo.modify_date!==alarmInfo.date"> -->
                      <!-- <div class="text date">{{alarmInfo.modify_date|dateTimeFormat}}</div> -->
                    <div class="processTitle">处置详情</div>
                  </template>
                  <div class="processContent">
                    <div v-html="process">{{process}}</div>
                      <!-- <span v-if="alarmInfo.status == 0"> 
                        {{alarmInfo.username}}将告警状态设置为【新增 <svg-icon icon-class="xinzeng" />】
                      </span>
                      <span v-if="alarmInfo.status == 1"> 
                        {{alarmInfo.username}}将告警状态设置为【忽略 <svg-icon icon-class="hulve" />】
                      </span>
                      <span v-if="alarmInfo.status == 2"> 
                        {{alarmInfo.username}}将告警状态设置为【关闭 <svg-icon icon-class="guanbi" />】
                      </span>
                      <span v-if="alarmInfo.status == 3"> 
                        {{alarmInfo.username}}将告警状态设置为【误报 <svg-icon icon-class="wubao" />】
                      </span>
                      <span v-if="alarmInfo.status == 4"> 
                        {{alarmInfo.username}}将告警状态设置为【已处置 <svg-icon icon-class="yichuzhi" />】
                      </span> -->
                    <!-- </div> -->
                  </div>
                </el-card>
            </el-row>
      </el-col>
      <el-col :lg="12" class="right">
        <el-card shadow="always" :body-style="{overflowY:'scroll',height:'390px'}">
          <template slot="header" type="flex">
            <el-input   
                type="textarea"
                :rows="5" 
                clearable
                v-model="commentContent" 
                placeholder="评论:"
            />
            <div class="btn">
                <el-button type="primary" style="height:27.99px;margin-top:10px" @click="submit()">提交评论</el-button>
            </div>
            <div class="comment">往期评论</div>
          </template>
          <div>
            <div v-for="(item,index) of comment" :key="index">
              <div style="text">
                <span>{{item.user.username}}</span>
                <span class="commentDate">{{item.date|dateTimeFormat}}</span>
                <el-button type="text" style="margin-left:10px" @click="deleteComment(item.id)" v-if="authority">删除</el-button>
              </div>
              <div>{{item.content}}</div>
              <el-divider></el-divider>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { 
  ApiAlarmDetail,
  ApiSubmitComment,
  ApiDeleteComment,
  ApiGetAuthority 
} from "@/api/alarmManagement";
export default {
  data() {
    return {
      alarmInfo:[],
      input:"",
      alarmStatus: "",
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
      commentContent:"",
      authority:false,
      comment:[],
      process:""
    };
  },
  methods: {
    //告警详情
    GetalarmDetail() {
      ApiAlarmDetail({id: this.$route.params.id}).then(({data}) => {
        console.log(data)
        this.alarmInfo = data.msg;
        this.process = data.msg.process;
        this.comment = data.msg.comment
      });
    },
    //获取权限
    GetAuthority(){
      ApiGetAuthority().then(({data}) => {
        if(data.auth.manage_comment==true){
          this.authority = true
        }
      });
    },
    //删除评论
    deleteComment(id){
      if(this.authority == true){
        this.$confirm("是否删除该评论?", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          ApiDeleteComment({id:id, method: "delete"}).then(({data})=>{
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.GetalarmDetail(); 
            }
          });
        });
      }
    },
    //提交评论
    submit(){
      let data = {
        entity_id:this.$route.params.id,
        entity_type:0,
        content:this.commentContent
      }
      ApiSubmitComment(data).then(({data})=>{
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.commentContent = "";
          this.GetalarmDetail();
        } else {
          this.$message.error(data.msg);
        }
      })
    }
  },
  created() {
    this.GetalarmDetail();
    this.GetAuthority();
  }
}
</script>
<style lang="scss">
#alarmDetail{
  font-size: 14px;
  height: calc(100vh - 84px); 
  background-color: #f4f5f5;
  position: relative;
  $border: 1px solid #dcdfe6;
  .home-header {
    .text{
      font-size:15px;
      margin-top:12px
    }
    .row-lg{
      margin-left:8px
    }
    .left {
      .title{
        font-size: 30px !important;
        font-weight:bold;
        text-align: left;
        }
      .date{
        color: rgb(185, 184, 184);
      }
      .btn{
        height:27.99px;
        margin-top:30px
      }
      .top-item {
        .el-card {
          height: 220px;
        }
      }
      .bottom-item {
        .el-card {
          height: 360px;
        }
        .processTitle{
          font-size:18px;
          font-weight: bold;
          margin-top:15px;
        }
        .processContent{
          font-size:15px;
          margin-top:10px
        }
      }
    }
    .right {
      .el-card {
        height: 600px;
      }
      .comment{
        margin-top:10px;
        font-size: 16px;
        font-weight:bold;
      }
      .commentDate{
        color: rgb(185, 184, 184);
        font-size:13px;
        margin-left:8px;
      }
    }
  }
}
</style>