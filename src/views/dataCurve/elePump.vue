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
      name: "数据曲线诊断中电泵界面",
      type:"电泵",
      well_type:1 //抽油机为0,螺杆泵为1
    };
  }
};
</script>
<style lang="scss">
</style>
