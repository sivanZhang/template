<template>
    <div id="settings">
        <div class="content">
            <el-tabs :tab-position="tabPosition">
                <el-tab-pane label="oracle数据配置">
                    <el-row>
                        <el-col :span="8">   
                            ip地址&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-input v-model="ip" placeholder="请输入ip地址" style="width:180px;"></el-input>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:10px;">
                        <el-col :span="8">   
                            实例名称&nbsp;&nbsp;<el-input v-model="instance_name" placeholder="请输入实例名称" style="width:180px;"></el-input>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:10px;">
                        <el-col :span="8">
                           用户名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-input  v-model="username" placeholder="请输入用户名" style="width:180px;"></el-input>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:10px;">
                        <el-col :span="8">
                            密码&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-input  v-model="password" placeholder="请输入密码" style="width:180px;" show-password></el-input>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="第三方数据获取时间">
                        <el-row>
                            <el-col :span="8">
                                获取时间&nbsp;&nbsp;
                                 <el-input 
                                    v-model="timeinterval"
                                    placeholder="请输入获取时间(分钟)"
                                    style="width:90px;"
                                    type="number"
                                    >
                                </el-input >分钟
                            </el-col>
                        </el-row>
                        <el-row style="margin-top:5px;">
                                第三方获取数据时间间隔不能小于20分钟
                        </el-row>
                </el-tab-pane>
                <el-tab-pane label="示功图计算时间间隔">
                    <el-row>
                        <el-col :span="8">
                            时间间隔&nbsp;&nbsp;<el-input v-model="shigongtu_timeinterval"  placeholder="请输入时间间隔(分钟)" style="width:90px;" type="number"></el-input>分钟
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:5px;">
                                示功图计算时间间隔不能小于10分钟
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div style="margin-left:240px;">
            <el-row>
                <el-col :span="2">
                    <el-button type="primary" class="button" @click="SaveCtlConfig()">保存</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button @click="ReSetConfig()">重置</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { ApiCtlConfig , ApiSetCtlConfig} from "@/api/ctlconfig";
import dayjs from 'dayjs';
export default {
     data() {
      return {
        tabPosition: 'left',
        ip:'',
        username:'',
        password:'',
        shigongtu_timeinterval:'',
        timeinterval:'',
        instance_name:''
      };
    },
    created(){
        this.GetCtlConfig()

    },
    methods:{
        //格式化时间
        formatDate(date){
            if(date){
                date = date;
                return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
            }else{
                return ''
            }
        },
        //获取配置信息
        GetCtlConfig(){
            ApiCtlConfig({}).then(({ data })=>{
               if(data.status === 0){
                    this.ip = data.msg.localhost;
                    this.instance_name = data.msg.instancetime;
                    this.username = data.msg.username;
                    this.password = data.msg.password
                    this.shigongtu_timeinterval = data.msg.shigongtutimeinterval
                    this.timeinterval = data.msg.timeinterval
               }else{
                   this.$message.console.error('未能获取到配置信息');
               }
            });
        },
        //保存配置信息
        SaveCtlConfig(){
           let data ={
               ip:this.ip,
               instance_name:this.instance_name,
               username:this.username,
               password:this.password,
               timeinterval:this.timeinterval,
               shigongtu_timeinterval:this.shigongtu_timeinterval
           };
           ApiSetCtlConfig(data).then(({ data })=>{
               if(data.status === 0){
                   this.$message.success(data.msg);
               }else{
                   this.$message.console.error(data.msg);
                   
               }
           });
        },
        ReSetConfig(){
            this.ip = '';
            this.username = '';
            this.password = '';
            this.thirdtime = '';
            this.shigongtu_timeinterval = '';
            this.timeinterval = '';
            this.instance_name = '';
        }
        
    }
   

}
</script>
<style lang="scss" scoped>
  #settings {
    min-height: 90vh;
    font-size: 12px;
    background-color: #f4f5f5;
  .content{
    padding-bottom: 10px;
    height: 160px;
  }

}
</style>