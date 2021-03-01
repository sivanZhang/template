<template>
    <div>
         <div style="margin:10px 10px">
                <span style="width:80px;margin-top:13px">处理方式:</span>
                <el-input style="top:10px;" v-model="dealContent" type="textarea" :rows="6"/>
              </div>
              <el-row class="row-bg">诊断处理选择:</el-row>
              <el-row class="row-bg">
                <el-col :lg="10" :sm="10">
                  1.
                  <el-checkbox v-model="changeBelt" label="换皮带" @change="click4"></el-checkbox>
                </el-col>
                <el-col :lg="5" :sm="5">
                  2. 
                  <el-checkbox v-model="changePole" label="换杆" @change="click5"></el-checkbox>
                </el-col>
                <el-col :lg="9" :sm="9" style="margin-top:-3px">
                  3.
                  <el-checkbox v-model="lowParam" @change="click3" :disabled="highParam">
                    参数低调高为
                    <el-input
                      oninput="value=value.replace(/[^\d.]/g,'')"
                      style="width:60px"
                      v-model="high"
                    />
                  </el-checkbox>
                </el-col>
              </el-row>

              <el-row class="row-bg">
                <el-col :lg="10" :sm="10" style="margin-top:-3px">
                  4.
                  <el-checkbox v-model="highParam" @change="click2" :disabled="lowParam">
                    参数高调低为
                    <el-input
                      oninput="value=value.replace(/[^\d.]/g,'')"
                      style="width:60px"
                      v-model="low"
                    />
                  </el-checkbox>
                </el-col>
                <el-col :lg="5" :sm="5">
                  5.
                  <el-checkbox v-model="washWell" label="洗井" @change="click7"></el-checkbox>
                </el-col>
                <el-col :lg="9" :sm="9">
                  6.
                  <el-checkbox v-model="verifyWell" label="核实井况" @change="click10"></el-checkbox>
                </el-col>
              </el-row>

              <el-row class="row-bg">
                <el-col :lg="10" :sm="10">
                  7.
                  <el-checkbox v-model="normalParam" label="参数正常" @change="click1"></el-checkbox>
                </el-col>
                <el-col :lg="5" :sm="5">
                  8.
                  <el-checkbox v-model="changePipe" label="换油管" @change="click11"></el-checkbox>
                </el-col>
                <el-col :lg="9" :sm="9">
                  9.
                  <el-checkbox v-model="changePump" label="换泵" @change="click6"></el-checkbox>
                </el-col>
              </el-row>
              
              <el-row class="row-bg">
                <el-col :lg="10" :sm="10">
                  10.
                  <el-checkbox v-model="changeCase" label="换套管" @change="click17"></el-checkbox>
                </el-col>
                <el-col :lg="5" :sm="5">
                  11.
                  <el-checkbox v-model="changeMotor" label="换电机" @change="click9"></el-checkbox>
                </el-col>
                <el-col :lg="9" :sm="9" v-if="wellDetail.well_type==0">
                  12.
                  <el-checkbox v-model="changeModel" label="换机型" @change="click16"></el-checkbox>
                </el-col>
                <el-col :lg="9" :sm="9" v-else>
                  12.
                  <el-checkbox v-model="changeModel" label="换泵型" @change="click16"></el-checkbox>
                </el-col>
              </el-row>
              <el-row class="row-bg">
                <el-col :lg="10" :sm="10">
                  13.
                  <el-checkbox v-model="sand" label="油井除沙" @change="click14"></el-checkbox>
                </el-col>
                <el-col :lg="5" :sm="5">
                  14.
                  <el-checkbox v-model="wellhead" label="井口处理" @change="click15"></el-checkbox>
                </el-col>
                <el-col :lg="9" :sm="9">
                  15.
                  <el-checkbox v-model="changePack" label="换盘根" @change="click13"></el-checkbox>
                </el-col>
              </el-row>
              <el-row class="row-bg">
                <el-col :lg="10" :sm="10" v-if="wellDetail.well_type==0">
                  16.
                  <el-checkbox v-model="balance" label="调平衡" @change="click12"></el-checkbox>
                </el-col>
                <el-col :lg="10" :sm="10" v-else>
                  16.
                  <el-checkbox v-model="loosePack" label="松盘根" @change="click8"></el-checkbox>
                </el-col>
                <el-col :lg="5" :sm="5" v-if="wellDetail.well_type==0">
                  17.
                  <el-checkbox v-model="loosePack" label="松盘根" @change="click8"></el-checkbox>
                </el-col>
              </el-row>
              <div v-if="name==1">
                <el-col v-if="this.auth==true">
                <el-button class="buttonSave" type="primary" @click="save()" :disabled="complete">确认存储</el-button>
                <!-- <el-button type="primary" style="width:160px" class="buttonSave"  @click=" showImage" v-if="wellDetail.well_type == 0">抽油机周波曲线自动诊断</el-button> -->
                <!-- <el-button  type="primary" style="width:160px" class="buttonSave"  v-if="wellDetail.well_type == 1">螺杆泵周波曲线自动诊断</el-button> -->
              </el-col>
              <!-- <el-col v-else>
                <el-button
                  style="margin:40px 10px;width:160px"
                  type="primary"
                  class="buttonSave"
                  @click=" showImage"
                >抽油机周波曲线自动诊断</el-button>
              </el-col> -->
              </div>

              <div v-else>
                <el-col v-if="this.auth==true" class="bottom_btn">
                <el-button
                  type="primary"
                  class="buttonSave"
                  @click="save()"
                  :disabled="complete"
                >确认存储</el-button>
                <!-- <el-button type="primary" class="buttonSave"  style="width:135px"  v-if="wellDetail.well_type == 0">电参示功图自动诊断</el-button> -->
              </el-col>
              <!-- <el-col v-else>
                <el-button style="margin:40px 10px;width:135px" class="buttonSave"  type="primary"  >电参示功图自动诊断</el-button>
                 
              </el-col> -->
              </div>

              <el-dialog title="示功图分析与典型示功图" :visible.sync="dialogVisible" width="700px" top="1vh">
        
                 <div class="dialog-middle">
                    <el-carousel :interval="5000" arrow="always" style="height:450px">
                         <el-carousel-item v-for="(item,index) in imageList" :key="index" style="height:450px">
                              <img style="width:650px;height:450px" :src="item.url" alt />
                         </el-carousel-item>
                    </el-carousel>
                 </div>

             </el-dialog>
    </div>
</template>
<script>
//调用无警告直接处置接口
import {
  ApiAlarmDirHand,ApiAlarmHandle
} from "@/api/alarmManagement"
export default {
  //引用从父组件传入的值
  props:["auth","wellDetail","wellName","name","handleStatus","warningId","promote","warningindex"],
  data(){
    return{
      normalParam:false,  //1.参数正常
      highParam:false,    //2.参数高
      low:"",             //参数高调低为low
      lowParam:false,     //3.参数低
      high:"",            //参数低调高为high
      changeBelt:false,   //4.换皮带
      changePole:false,   //5.换杆
      changePump:false,   //6.换泵
      washWell:false,     //7.洗井
      loosePack:false,    //8.松盘根
      changeMotor:false,  //9.换电机
      verifyWell:false,   //10.核实井况
      changePipe:false,   //11.换油管 
      balance:false,      //12.调平衡
      changePack:false,   //13.换盘根
      sand:false,         //14.油井除沙
      wellhead:false,     //15.井口处理 
      shortFluid:false,   //15.供液不足
      changeModel:false,  //16.换机型
      changeCase:false,   //17.换套管 
      value:"",     
      dealContent:"",     //处理方式(传递给后端的值)
      checkList:[],       //存储处理方式的数组
      param1:false,
      param2:false,
      status: [], //接收父组件传递的井的处置状态
      warnid:"",//接收父组件传递的井的诊断种类id
      complete:false,
      dialogVisible: false,//判断示功图分析与典型示功图是否显示
      welltype:0,
      imageList: [
        {
            name: "1",
            url: require("@/assets/pump_images/image1.png")
        },
        {
            name: "2",
            url: require("@/assets/pump_images/image2.png")
        },
        {
            name: "3",
            url: require("@/assets/pump_images/image3.png")
        },
        {
            name: "4",
            url: require("@/assets/pump_images/image4.png")
        },
        {
            name: "5",
            url: require("@/assets/pump_images/image5.png")
        },
        {
            name: "6",
            url: require("@/assets/pump_images/image6.png")
        }
      ],
      warnindex:""
    };
  },
  watch:{
    //监测参数高调低low的变化
    low: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          let index = this.checkList.indexOf("参数高调低为" + oldVal);
          if (this.highParam == true) {
            this.checkList.splice(index, 1);
            this.checkList.push("参数高调低为" + newVal);
          }
          this.dealContent = String(this.checkList);
        } else {
          let index = this.checkList.indexOf("参数高调低为" + oldVal);
          if (this.highParam == true) {
            this.checkList.splice(index, 1);
            this.checkList.push("参数高调低为" + this.low);
          }
          this.dealContent = String(this.checkList);
        }
      }
    },
    //监测参数低调高high的变化
    high: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          let index = this.checkList.indexOf("参数低调高为" + oldVal);
          if (this.lowParam == true) {
            this.checkList.splice(index, 1);
            this.checkList.push("参数低调高为" + newVal);
          }
          this.dealContent = String(this.checkList);
        } else {
          let index = this.checkList.indexOf("参数低调高为" + oldVal);
          if (this.lowParam == true) {
            this.checkList.splice(index, 1);
            this.checkList.push("参数低调高为" + this.high);
          }
          this.dealContent = String(this.checkList);
        }
      }
    },
    handleStatus: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.status = newVal
        }
      }
    },
    warningId: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.warnid = newVal
        }
      }
    },
    wellDetail:{
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.welltype = newVal.well_type
        }
      }
    },
    warningindex:{
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.warnindex = newVal
        }
      }
    },
    promote:{
      handler:function(newVal,oldVal){
        if(newVal){
          if(this.warnindex == 14){
            this.high = newVal
          }else{
            this.low = newVal
          }
        }
      }
    }
  },
  methods:{
    showImage() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
        this.dialogVisible = true;
      }, 300);
      loading.close();
    },
    //确认存储
    save() {
      /* 如果不存在新增的告警，此处0为新增，1为忽略
      2为关闭，3为误报，4为已处置
      以下两种状态调用无告警的直接处置接口：
      1、如果父组件传递的井的处置状态为空,说明没有诊断种类
      2、如果父组件传递的井的处置状态中不存在状态为0(新增)的诊断状态
      即this.status.indexOf(0) == -1
      */  
      if(this.dealContent != ""){ 
        if (this.status.length == 0 || this.status.indexOf(0) == -1) {  
          //无告警直接处置
          ApiAlarmDirHand({
            well_id: this.wellName,
            method: "put",
            process: this.dealContent
          }).then(({ data }) => {
            if (data.status == 0) {
              this.complete = true;
              this.$message.success(data.msg);
              this.$emit("getHistoryAlarm");
              this.checkList = [],
              this.dealContent = "",
              this.normalParam = false,  //1.参数正常
              this.low = "",             //2.参数高调低为low
              this.high = "",            //3.参数低调高为high
              this.changeBelt = false,   //4.换皮带
              this.changePole = false,   //5.换杆
              this.changePump = false,   //6.换泵
              this.washWell = false,     //7.洗井
              this.loosePack = false,    //8.松盘根
              this.changeMotor = false,  //9.换电机
              this.verifyWell = false,   //10.核实井况
              this.changePipe = false,   //11.换油管 
              this.balance = false,      //12.调平衡
              this.changePack = false,   //13.换盘根
              this.sand = false,         //14.油井除沙
              this.wellhead = false,     //15.井口处理 
              this.changeModel = false,  //16.换机型
              this.changeCase = false,   //17.换套管 
              this.highParam = false,    //参数高  
              this.lowParam = false     //参数低
            } else {
              this.$message.error(data.msg);
            }
            this.complete=false;
          });
        } else {
            if (this.current == false ) {
              if(this.firstEntry == true){
                this.warnid = this.$route.query.warnId;
              }else{
                this.warnid = this.diagId
              }
            } else {
              this.warnid = this.warningId;
          }
          //有告警处置
          ApiAlarmHandle({
            warning_id: this.warnid,
            method: "put",
            process: this.dealContent
          }).then(({ data }) => {
            if (data.status == 0) {
              this.complete = true;
              this.$message.success(data.msg);
              this.$emit("getHistoryAlarm");
              this.checkList = [],
              this.dealContent = "",
              this.normalParam = false,  //1.参数正常
              this.low = "",             //2.参数高调低为low
              this.high = "",            //3.参数低调高为high
              this.changeBelt = false,   //4.换皮带
              this.changePole = false,   //5.换杆
              this.changePump = false,   //6.换泵
              this.washWell = false,     //7.洗井
              this.loosePack = false,    //8.松盘根
              this.changeMotor = false,  //9.换电机
              this.verifyWell = false,   //10.核实井况
              this.changePipe = false,   //11.换油管 
              this.balance = false,      //12.调平衡
              this.changePack = false,   //13.换盘根
              this.sand = false,         //14.油井除沙
              this.wellhead = false,     //15.井口处理 
              this.changeModel = false,  //16.换机型 
              this.changeCase = false,   //17.换套管
              this.highParam = false,    //参数高  
              this.lowParam = false     //参数低
            } else {
              this.$message.error(data.msg);
            }
            this.complete=false;
          });
        }
      }else{
        this.$message.error("请选择诊断处理方式");
      }
    },
    //1.参数正常
    click1() {
      let index = this.checkList.indexOf("参数正常");
      if (this.normalParam == true) {
        this.checkList.push("参数正常");
      } else if (this.normalParam == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
     //调低参数
    click2() {
      let index = this.checkList.indexOf("参数高调低为" + this.low);
      if (this.highParam == true) {
        this.checkList.push("参数高调低为" + this.low);
      } else if (this.highParam == false && index > -1) {
        this.low = "";
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
     //调高参数
    click3() {
      console.log("参数低调高为：")
      if (this.high == "") {
        this.param2 = true;
      }
      let index = this.checkList.indexOf("参数低调高为" + this.high);
      if (this.lowParam == true) {
        this.checkList.push("参数低调高为" + this.high);
      } else if (this.lowParam == false && index > -1) {
        this.high = "";
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
     //换皮带
    click4() {
      let index = this.checkList.indexOf("换皮带");
      if (this.changeBelt == true) {
        this.checkList.push("换皮带");
      } else if (this.changeBelt == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
     //换杆
    click5() {
      let index = this.checkList.indexOf("换杆");
      if (this.changePole == true) {
        this.checkList.push("换杆");
      } else if (this.changePole == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //换泵
    click6() {
      let index = this.checkList.indexOf("换泵");
      if (this.changePump == true) {
        this.checkList.push("换泵");
      } else if (this.changePump == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //洗井
    click7() {
      let index = this.checkList.indexOf("洗井");
      if (this.washWell == true) {
        this.checkList.push("洗井");
      } else if (this.washWell == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
     //松盘根
    click8() {
      let index = this.checkList.indexOf("松盘根");
      if (this.loosePack == true) {
        this.checkList.push("松盘根");
      } else if (this.loosePack == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
     //换电机
    click9() {
      let index = this.checkList.indexOf("换电机");
      if (this.changeMotor == true) {
        this.checkList.push("换电机");
      } else if (this.changeMotor == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //核实井况
    click10() {
      let index = this.checkList.indexOf("核实井况");
      if (this.verifyWell == true) {
        this.checkList.push("核实井况");
      } else if (this.verifyWell == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //换油管
    click11() {
      let index = this.checkList.indexOf("换油管");
      if (this.changePipe == true) {
        this.checkList.push("换油管");
      } else if (this.changePipe == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //调平衡
    click12() {
      let index = this.checkList.indexOf("调平衡");
      if (this.balance == true) {
        this.checkList.push("调平衡");
      } else if (this.balance == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //换盘根
    click13() {
      let index = this.checkList.indexOf("换盘根");
      if (this.changePack == true) {
        this.checkList.push("换盘根");
      } else if (this.changePack == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //油井除沙
    click14() {
      let index = this.checkList.indexOf("油井除沙");
      if (this.sand == true) {
        this.checkList.push("油井除沙");
      } else if (this.sand == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //井口处理
    click15() {
      let index = this.checkList.indexOf("井口处理");
      if (this.wellhead == true) {
        this.checkList.push("井口处理");
      } else if (this.wellhead == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //换机型
    click16() {
      if(this.welltype == 0){
        let index = this.checkList.indexOf("换机型");
        if (this.changeModel == true) {
          this.checkList.push("换机型");
        } else if (this.changeModel == false && index > -1) {
          this.checkList.splice(index, 1);
        }
      }else{
        let index = this.checkList.indexOf("换泵型");
        if (this.changeModel == true) {
          this.checkList.push("换泵型");
        } else if (this.changeModel == false && index > -1) {
          this.checkList.splice(index, 1);
        }
      }
      this.dealContent = String(this.checkList);
    },
    //换套管
    click17() {
      let index = this.checkList.indexOf("换套管");
      if (this.changeCase == true) {
        this.checkList.push("换套管");
      } else if (this.changeCase == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
    //不平衡
    click18() {
      let index = this.checkList.indexOf("不平衡");
      if (this.unbalance == true) {
        this.checkList.push("不平衡");
      } else if (this.unbalance == false && index > -1) {
        this.checkList.splice(index, 1);
      }
      this.dealContent = String(this.checkList);
    },
  }
}
</script>
<style lang="scss" scoped>

     .row-bg {
        margin-left: 10px;
        margin-top: 20px;
    }
   .buttonSave {
        width: 110px;
        height: 37px;
        margin:20px 0px 0px -20px;
    }

    //  .bottom_btn{
    //   position:absolute ;
    //   bottom: 15px;
    // }

</style>