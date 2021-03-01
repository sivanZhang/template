<template>
  <div id="addPumpType">
    <el-tooltip effect="dark" content="添加机型" placement="top">
      <el-button class="el-icon-plus" type="text" style="color:blue" @click="openDialog()"></el-button>
    </el-tooltip>
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
          <!-- <el-button @click="cancel">取消</el-button> -->
          <el-button type="primary" @click="submitForm('addPumpType')">创建</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { ApiAddPumpType ,ApiSearchPumping} from "@/api/wellList";
import dayjs from "dayjs";
export default {
  name: "addPumpType",

  watch: {},
  data() {
    return {
      dialogShow: false,
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
    submitForm(addPumpType) {
      let params = {};
      params = {
        series: this.addPumpType.series,
        type_name: this.addPumpType.type_name,
        turn:this.addPumpType.turn
      };
      ApiAddPumpType(params).then(({ data }) => {
       
          this.$message.success(data.status);

          this.dialogShow = false;
          this.SearchPumping();
        
      });
    },
    SearchPumping() {
      ApiSearchPumping().then(res => {
        this.machinetype = res.data.msg;
          this.$emit("event1", this.machinetype);
      });
    },
  },
  created() {
    this. SearchPumping();
  }
};
</script>

<style>

   
 
</style>