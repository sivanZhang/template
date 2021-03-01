<template>
  <div>
    <!-- <div class="el-header">
      <el-row class="row-bg">
        <el-col :sm="2" class="col-bg">密码2：</el-col>
        <el-col :sm="3">
          <el-input placeholder="请输入密码" v-model="input" show-password></el-input>
        </el-col>
        <el-col :sm="2" class="col-bg">
          <div v-if="type==1">手动：</div>
          <div v-if="type==2">自动：</div>
        </el-col>
        <el-col :sm="3">
          <el-input v-model="input"></el-input>
        </el-col>
        <el-col :sm="2" class="col-bg">操作者：</el-col>
        <el-col :sm="3">
          <el-input v-model="input"></el-input>
        </el-col>
      </el-row>
    </div>-->
    <div class="body-main">
      <div class="el-body">
        <div class="body-header">
          <div class="body-header-row">
            <el-row class="row-bg-top">
              <el-col :lg="5">
                井名：
                <el-select
                  v-model="wellID"
                  filterable
                  style="width:130px;"
                  placeholder="请选择"
                  @change="getWellParamers(1)"
                >
                  <el-option
                    v-for="(item,index) of wellList"
                    :label="item.name"
                    :value="item.wellid"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col
                :lg="8"
                class="col-bg"
              >时间:{{startdate|dateTimeFormat}}&nbsp;至&nbsp;{{enddate|dateTimeFormat}}</el-col>
              <el-col :lg="4" class="col-bg">
                <div v-if="welltype == 0">油井类别：抽油机</div>
                <div v-if="welltype == 1">油井类别：螺杆泵</div>
              </el-col>
              <el-col :lg="4">
                点数：
                <el-select
                  v-model="wellPoint"
                  filterable
                  style="width:80px;"
                  placeholder="请选择"
                  @change="getWellParamers(2)"
                >
                  <el-option
                    v-for="item in wellPointList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="body-middle">
          <div class="body-middle-row">
            <el-row class="row-bg">
              <el-col :lg="4" class="col-bg">
                <div>机型&nbsp;:&nbsp;{{wellDetail.motor_type}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <div>顺时针运行&nbsp;:&nbsp;{{wellDetail.run_status}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <div>逆时针运行&nbsp;:&nbsp;{{wellDetail.run_status}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <div>大平衡块数&nbsp;:&nbsp;{{wellDetail.num_big_balance}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <div>小平衡块数&nbsp;:&nbsp;{{wellDetail.num_small_balance}}</div>
              </el-col>
            </el-row>
            <el-row class="row-bg">
              <el-col :lg="4" class="col-bg">
                <div>大平衡块尺寸1&nbsp;:&nbsp;{{wellDetail.size_1_big_balance}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <div>大平衡块尺寸2&nbsp;:&nbsp;{{wellDetail.size_2_big_balance}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <div>小平衡块尺寸1&nbsp;:&nbsp;{{wellDetail.size_1_small_balance}}</div>
              </el-col>
            </el-row>
            <el-row class="row-bg">
              <el-col :lg="4" class="col-bg">
                <div>小平衡块尺寸2&nbsp;:&nbsp;{{wellDetail.size_2_small_balance}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <div>曲柄尺寸&nbsp;:&nbsp;{{wellDetail.size_1_crank}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <div>大平衡块重量&nbsp;:&nbsp;{{wellDetail.weight_1_big_balance}}</div>
              </el-col>
            </el-row>
            <el-row class="row-bg">
              <el-col :lg="4" class="col-bg">
                <div>小平衡块重量&nbsp;:&nbsp;{{wellDetail.weight_1_small_balance}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <div>曲柄重量&nbsp;:&nbsp;{{wellDetail.weight_1_crank}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <div>曲柄梢重量&nbsp;:{{wellDetail.weight_2_crank}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <div>偏置角&nbsp;:&nbsp;{{wellDetail.offset_angle}}</div>
              </el-col>
            </el-row>
            <el-row class="row-bg">
              <el-col :lg="4" class="col-bg">
                <div>冲程&nbsp;:&nbsp;{{wellDetail.stroke}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                <div>冲次&nbsp;:&nbsp;{{wellDetail.rush_times}}</div>
              </el-col>
              <el-col :lg="5" class="col-bg">
                叠加有功次数&nbsp;:
                <el-select
                  v-model="addTimesValue"
                  placeholder="请选择"
                  style="width:100px;"
                  filterable
                  @change="getWellParamers(3)"
                >
                  <el-option
                    v-for="item in addTimesList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :sm="4" class="col-bg">
                <div>不平衡重量&nbsp;:&nbsp;</div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ApiGetRealdata } from "@/api/realdata";
import { getAddMutipleActive } from "@/api/electricParamater";
import { getWellDetail } from "@/api/welldetail";
export default {
  name: "electricParames",
  data() {
    return {
      wellList: [],
      wellID: "",
      wellPoint: "145",
      startdate: "",
      enddate: "",
      welltype: 0, //油井类别，暂为螺杆泵 ,全部：-1 , 0 # 抽油机, 1 # 螺杆泵
      input: "",
      addTimesValue: "1", //叠加有功次数
      wellPointList: [{ value: "145" }, { value: "200" }],
      addTimesList: [],
      wellDetail: [],
    };
  },
  props: ["type"],
  created() {
    this.GetRealdata();
  },
  methods: {
    // 获取井号的列表
    GetRealdata() {
      ApiGetRealdata({
        realdata: "",
        pagenum: "100"
      }).then(({ data }) => {
        this.wellList = data.realdata;
        let wellid = this.wellList.map(item => {
          return item.wellid;
        });
        this.wellID = wellid[0];
        this.getWellParamers();
        this.AddMutipleActive();
        this.getWellDetails();
      });
    },
    // 获取井的详细信息
    getWellDetails(){
      getWellDetail({ wellid: this.wellID, welldetail: ""}).then(({ data })=>{
        // console.log(data)
        this.wellDetail = data.msg;
        this.welltype = data.msg.well_type
      })
       
    },
    // 获取最高可叠加次数以及叠加起止日期
    AddMutipleActive() {
      getAddMutipleActive({ id: this.wellID }).then(({ data }) => {
        this.startdate = data.msg.startdate;
        this.enddate = data.msg.enddate;
        // this.addTimesValue = data.msg.times
        for (var i = 1; i <= data.msg.times; i++) {
          this.addTimesList.push({ value: i });
        }
      });
    },
    // 子组件传值给父组件
    getWellParamers(type) {
      //选择井号
      if (type == 1) {
        this.$emit("getWellId", this.wellID);
        this.getWellDetails();
      } else if (type == 2) {
        // 选择点数
        this.$emit("getWellPoint", this.wellPoint);
      } else if (type == 3) {
        // 叠加有功次数
        this.$emit("getTimesValue", this.addTimesValue);
      } else {
        // 使用默认的井号和点数, 叠加有功次数
        this.$emit("getWellId", this.wellID);
        this.$emit("getWellPoint", this.wellPoint);
        this.$emit("getTimesValue", this.addTimesValue);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-header {
  margin-top: 10px;
  padding: 0;
}
.body-main {
  margin: 0 30px;
}
.body-header {
  border: 0.5px solid rgb(230, 230, 230);
}
.body-middle {
  border-left: 0.5px solid rgb(230, 230, 230);
  border-right: 0.5px solid rgb(230, 230, 230);
  border-bottom: 0.5px solid rgb(230, 230, 230);
}
.body-header-row {
  margin: 10px 30px;
}
.body-middle-row {
  margin: 0 30px 10px 30px;
  padding-top: 10px;
}
.row-bg-top {
    align-items: center;
    padding: 10px;
}
.row-bg {
  padding-bottom: 10px;
}
.col-bg {
  padding: 5px 0 0 0;
}
</style>