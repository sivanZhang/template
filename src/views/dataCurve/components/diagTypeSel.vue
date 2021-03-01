<template>
  <div id="diagTypeSel">
    <!-- 诊断种类选择 -->
    <div class="content">
        <el-row class="content-row-bg">
            <el-checkbox-group v-model="check" @change="handleCheckedTypesChange">
            <el-row class="row-bg">
                <el-checkbox
                v-for="(item,index) of diagTy"
                :label="item.type"
                :key="index"
                :disabled = "diagBool[index] == true && auth == true"
                style="width:190px;margin-top:20px"
                >
                {{index+1}}. {{item.type}}
                <router-link
                    :to="{name:'diagQuery',
                    query:{warnId:diagId[index],wellId:id}}"
                >
                    <el-button
                    v-if="diagBool[index] == true && auth == true"
                    type="warning"
                    style="width:75px;height:30px;padding:5px"
                    >诊断处理</el-button>
                </router-link>
                </el-checkbox>
            </el-row>
            </el-checkbox-group>
        </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: "diagTypeSel",
  props: ["checkedTypes","diagBool","diagId",
          "indexType","welltype","auth","id"],
  data() {
    return {
      multipleSelection:[], //发送给后端的诊断种类
      check:[],  //已选择的诊断种类
      diagTy:[]  //诊断种类名称
    };
  },
  methods: {
    //点击复选框
    handleCheckedTypesChange(value) {
      this.multipleSelection = [];
      for (let i = 0; i < value.length; i++) {
        for (let j = 0; j < this.diagTy.length; j++) {
          if (value[i] == this.diagTy[j].type && this.diagBool[j] == false) {
            this.multipleSelection.push(this.diagTy[j].index);
          }
        }
      }
      this.$emit("transferPass", this.check,this.multipleSelection)
    },
  },
  watch: {
    checkedTypes: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.check = this.checkedTypes
        }
      }
    },
    indexType:{
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.diagTy = newVal
        }
      }
    }
  },
  created(){
  }
};
</script>
<style lang="scss">
#diagTypeSel {
  font-size: 14px;
  .content {
    margin-top: 10px;
  }
  .content-row-bg {
    margin-left: 15px;
  }
  .type-card {
    margin: 30px 10px;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: red;
    border-color: red;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: red;
  }
  .row-bg {
    margin-top: 5px;
    align-items: center;
  }
  .col-bg-1 {
    padding: 5px 2px 0 5px;
  }
  .col-bg {
    padding: 5px 2px 0 45px;
  }
  .el-button {
    width: 120px;
    height: 40px;
    margin-left: 10px;
  }
}
</style>