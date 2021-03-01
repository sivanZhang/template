<!-- 展开任务侧栏 -->
<template>
  <div id="taskDrawer">
    <el-tabs v-model="activeName">
      <el-tab-pane label="任务详情" name="first">
        <tabTaskDtail
          :detailLoading="detailLoading"
          ref="taskdetail"
        />
      </el-tab-pane>
      <el-tab-pane label="关联任务输出" name="fourth">
        <linkTaskOutput ref="linkTaskOutput" />
      </el-tab-pane>
      <el-tab-pane label="历史版本" name="third">
        <history :historyVersion="historyVersion" :project="project" @Version="getAssetVersion" />
      </el-tab-pane>
      <el-tab-pane label="执行记录" name="fifth">
        <tabLog :loglist="LogList" :logsLoading="logsLoading" />
      </el-tab-pane>
      <el-tab-pane label="审批记录">
        <approve-log ref="approvelogs" />
      </el-tab-pane>
      <el-tab-pane label="自定义属性" name="second">
        <attrsBind
          :project="project"
          :customAttrs="customAttrs"
          :attrsList="attrsList"
          @refresh_customAttrs="NewcustomAttrs"
          :attrsTypeNum="attrsTypeNum"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as HTTP from "@/api/task";
import tabTaskDtail from "@/views/task/components/tab-task-detail";
import history from "@/views/task/components/tab-history";
import linkTaskOutput from "@/views/task/components/tab-linkTaskOutput";
import tabLog from "@/views/task/components/tab-log";
import approveLog from "@/views/components/approve-log";
import attrsBind from "@/components/projectDrawer/components/attrsBind";
import { searchBind, getAttrsEntityList } from "@/api/attrs";
import {getHistoryVersion } from "@/api/assets";
export default {
  name: "taskDrawer",
  components: {
    approveLog,
    attrsBind,
    tabLog,
    tabTaskDtail,
    history,
    linkTaskOutput
  },
  data() {
    return {
      activeName: "first",
      project: null,
      attrsList: [],
      customAttrs: [],
      attrsTypeNum: null,
      detailLoading: false,
      historyVersion: [],
       logsLoading: false,
       LogList: [],
    };
  },
  watch: {},
  methods: {
    //展示任务侧栏
    showDrawer(item) {
      // console.log("-----")
      // console.log(item);
      this.$refs["linkTaskOutput"].getlinkTaskOutput(item.id);
      this.project = item.project;
      searchBind({ entity_type: 1 }).then(({ data }) => {
        this.attrsList = [...data.msg];
      });
      getAttrsEntityList({ entity_id: item.id, entity_type: 1 }).then(
        ({ data }) => {
          this.customAttrs = [...data.msg];
          this.attrsTypeNum = 1;
        }
      );
      this.detailLoading = true;

      this.$refs["taskdetail"].getDetail(item.id, "taskLook");

      getHistoryVersion({ asset_id: item.asset.id }).then(({ data }) => {
        this.historyVersion = [...data.msg];
      });
      this.logsLoading = true;
      HTTP.queryTaskRecord({ task_id: item.id })
        .then(({ data }) => {
          this.LogList = [...data.msg];
          this.logsLoading = false;
        })
        .catch(() => {
          this.logsLoading = false;
        });
      this.$refs["approvelogs"].getApproveLog(item.id);
    },
    NewcustomAttrs() {
      getAttrsEntityList({ entity_id: this.project.id, entity_type: 1 }).then(
        ({ data }) => {
          this.customAttrs = [...data.msg];
          this.attrsTypeNum = 1;
        }
      );
    },
    getAssetVersion() {
      getHistoryVersion({
        asset_id: this.assetId
      }).then(({ data }) => {
        this.historyVersion = [...data.msg];
      });
    },
  },
  created() {}
};
</script>
<style lang='scss' scoped>
</style>