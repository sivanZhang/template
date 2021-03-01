<template>
  <pump :name="name" :type="type" :well_type="well_type" ref="pump"></pump>
</template>
<script>
import pump from "./components/pump";
import { ApiGetRealdata } from "@/api/realdata";
import { getWellDetail } from "@/api/welldetail";
export default {
  components: {
    pump
  },
  data() {
    return {
      name: "数据曲线诊断中节能抽油机界面",
      type:"节能抽油机",
      well_type:0 //抽油机为0,螺杆泵为1
    };
  },
  methods:{
    
  },
  created() {
  },
};
</script>
<style lang="scss">
</style>
