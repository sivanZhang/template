<template>
  <el-tabs value="undetermined">
    <el-tab-pane label="待审批项" name="undetermined">
        <undetermined-approve/>
    </el-tab-pane>
    <el-tab-pane label="审批记录" name="records" lazy>
        <records-approve />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import UndeterminedApprove from './undetermined-approve'
import RecordsApprove from './records-approve'
export default {
    components:{
        UndeterminedApprove,
        RecordsApprove
    }
}
</script>