<template>
  <pump :name="name" :type="type" :well_type="well_type"></pump>
</template>
<script>
import pump from "./components/pump";
export default {
  components: {
    pump
  },
  data() {
    return {
      name: "数据曲线诊断中塔式抽油机界面",
      type:"塔式抽油机",
      well_type:0 //抽油机为0,螺杆泵为1
    };
  }
};
</script>
<style lang="scss">
</style>
