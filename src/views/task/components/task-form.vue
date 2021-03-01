<template>
  <div>
    <el-form 
    :rules="rules" 
    :model="TaskRecord" 
    ref="task-form" 
    label-width="100px" 
    label-position="left"
    >
      <el-form-item label="标题" prop="title">
        <el-input type="text" v-model="TaskRecord.title" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item label="完成内容" prop="content">
        <el-input type="textarea" v-model="TaskRecord.content" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item label="完成进度" prop="schedule">
        <el-row type="flex" align="middle">
          <el-col :span="10">
            <el-input-number v-model="TaskRecord.schedule" :min="0" :max="100" :step="10" @blur="BlurText($event)"></el-input-number>
          </el-col>
          <el-col :span="14">
            <el-progress
              :percentage="TaskRecord.schedule"
              :color="customColors"
              :text-inside="true"
              :stroke-width="20"
            ></el-progress>
          </el-col>
        </el-row>
      </el-form-item>
        <el-form-item label="剩余工时">{{surplus_labor_hour?surplus_labor_hour:0}}</el-form-item>
      <el-form-item label="工时" prop="labor_hour">
        <el-input-number
          :disabled="surplus_labor_hour?false:true"
          v-model="TaskRecord.labor_hour"
          :min="0"
          :max="surplus_labor_hour < 24? surplus_labor_hour: 24"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="日期" prop="date">
        <el-date-picker
          v-model="TaskRecord.date"
          type="date"
          placeholder="选择日期"
          value-format="yyyy/MM/dd"
          style="width:130px"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="end">
      <el-button @click="cancel">取消</el-button>
        <el-button :loading="createLoading" type="primary" @click="addRecord()" :disabled="surplus_labor_hour?false:true">提交</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ["TaskRecord", "createLoading", "surplus_labor_hour"],
  data() {
    return {
      customColors: [
        {
          color: "#f56c6c",
          percentage: 20
        },
        {
          color: "#e6a23c",
          percentage: 40
        },
        {
          color: "#6f7ad3",
          percentage: 60
        },
        {
          color: "#1989fa",
          percentage: 80
        },
        {
          color: "#5cb87a",
          percentage: 100
        }
      ],
       rules: {
        labor_hour: [{ required: true, message: "请输入工时", trigger: "blur" }],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入完成内容", trigger: "blur" }],
        schedule: [
          { required: true, message: "请输入完成进度", trigger: "blur" }
        ],
        date: [
          { required: true, message: "请选择日期", trigger: "blur" }
        ],
      },
    };
  },
  methods: {
    //进度输入框限制只能输入整数
    BlurText(e){
     let boolean = new RegExp("^[1-9][0-9]*$").test(e.target.value)
     if(!boolean){
       this.$message.error('请输入正整数');
       e.target.value = '0';
       this.TaskRecord.schedule = ''
     }
    },
    addRecord() {
      this.$refs["task-form"].validate(valid => {
        if (valid) {
           this.$emit("addRecord");
        }
      })
    },
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>

<style>
</style>
