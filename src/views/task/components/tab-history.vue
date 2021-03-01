<!-- 任务的历史版本 -->
<template>
  <div id="history">
    <el-table
      :data="historyVersion"
      style="width:100%"
      border
      :stripe="true"
      :row-style="{'font-size':'13px'}"
      :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
      highlight-current-row
    >
      <el-table-column prop="link_content" label="环节内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="task_name" label="任务名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="task_content" label="任务内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="current_version" label="版本号" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            style="color:#C64b2b"
            v-if="scope.row.end == true"
          >{{scope.row.current_version}}</span>
          <span v-else>{{scope.row.current_version}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="out_path" label="审核路径" show-overflow-tooltip></el-table-column>
      <el-table-column prop="date" width="130" label="更新时间">
        <template slot-scope="scope">{{scope.row.date|dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column prop="end" label="设定" v-if="$store.state.login.userInfo.auth.can_manage_asset_history">
        <template slot-scope="scope">
          <el-tooltip content="设定为最终状态" placement="top">
            <el-button
              @click="openAssetDetail(scope.row)"
              icon="el-icon-edit"
              type="text"
              style="color:blue"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAssetsEndStatus } from "@/api/assets";
export default {
  name: "history",
  components: {},
  props: ["historyVersion", "project"],
  data() {
    return {};
  },
  watch: {},
  methods: {
    //资产的最终状态修改
    openAssetDetail(row) {
      getAssetsEndStatus({
        version_record_id: row.version_record_id,
      }).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.$emit("Version");
        } else {
          this.$message.warning(data.msg);
        }
      });
    }
  },
  created() {}
};
</script>
<style lang='scss' scoped>
</style>