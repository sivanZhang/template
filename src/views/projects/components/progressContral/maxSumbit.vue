<template>
  <div>
    <!-- 查询项目中提交审批数目最多的资产和任务 -->
    <div style="padding-top:30px">
      <el-row>
        <el-col :span="4">
          <label for style="padding-top:15px">项目中提交审批次数最多的镜头</label>
        </el-col>
        <el-col :span="3">
          <el-select v-model="assetvalue" placeholder="请选择提交次数排名" @change="assetValueChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-table
        :data="assetMaxSubmit"
        :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
        highlight-current-row
        default-expand-all
        :border="false"
      >
        <el-table-column prop="submit_num" label="提交次数" align="center"></el-table-column>
        <el-table-column label="缩略图" align="center" width="180px">
          <template slot-scope="scope">
            <el-image
              :src="$store.state.BASE_URL+scope.row.image"
              style="width: 180px;height: 100px;cursor: pointer; display:block;"
              :preview-src-list="[$store.state.BASE_URL+scope.row.image]"
            >
              <div slot="placeholder" class="image-slot">
                加载中
                <span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <el-image
                  :src="$store.state.BASE_URL+'images/appfile/1573029716.780075picture.png'"
                ></el-image>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="镜头号" width="130px;" ></el-table-column>
        <el-table-column prop="schedule" label="进度" width="160px">
          <template slot-scope="scope">
            <el-progress
              :stroke-width="10"
              :status="scope.row.schedule==100?'success':''"
              :show-text="false"
              :percentage="scope.row.schedule"
            ></el-progress>
            {{scope.row.schedule}}%
          </template>
        </el-table-column>
        <el-table-column prop="small_status" label="小状态">
          <template slot-scope="scope">{{scope.row.small_status|taskMinStatus}}</template>
        </el-table-column>
        <el-table-column prop="task_num" label="任务数量"></el-table-column>
        <el-table-column prop="session" label="场次">
          <template slot-scope="scope">{{scope.row.session?scope.row.session:'-'}}</template>
        </el-table-column>
        <el-table-column prop="episode" label="集数">
          <template slot-scope="scope">{{scope.row.episode?scope.row.episode:'-'}}</template>
        </el-table-column>
        <el-table-column prop="frame" label="帧数">
          <template slot-scope="scope">{{scope.row.frame?scope.row.frame:'-'}}</template>
        </el-table-column>
        <el-table-column prop="frame_range" label="帧数范围" width="120px">
          <template slot-scope="scope">{{scope.row.frame_range?scope.row.frame_range:'-'}}</template>
        </el-table-column>
        <el-table-column prop="pro_reference" label="制作参考">
          <template slot-scope="scope">{{scope.row.pro_reference?scope.row.pro_reference:'-'}}</template>
        </el-table-column>
        <el-table-column prop="report" label="画面调整信息" width="120px">
          <template slot-scope="scope">{{scope.row.report?scope.row.report:'-'}}</template>
        </el-table-column>
        <el-table-column prop="retime" label="变速信息" width="120px">
          <template slot-scope="scope">{{scope.row.retime?scope.row.retime:'-'}}</template>
        </el-table-column>
        <el-table-column prop="inner_version" label="版本号" width="90px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="content" label="制作内容" width="150px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="priority" label="优先级">
          <template slot-scope="scope">{{scope.row.priority|Priority}}</template>
        </el-table-column>
        <el-table-column prop="level" label="难度">
          <template slot-scope="scope">{{scope.row.level|Level}}</template>
        </el-table-column>
         
        <el-table-column prop="creator_name" label="创建人"></el-table-column>
      
        <el-table-column label="当前环节" align="center" width="160px">
          <el-table-column prop="link" label="工种" align="left">
            <template slot-scope="scope">
              <div v-for="(todo,index) of scope.row.link" :key="index">{{todo.name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="截止日期" align="left" width="95px">
            <template slot-scope="scope">
              <div
                v-for="(todo,index) of scope.row.link"
                :key="index"
                style="position:top"
              >{{todo.date_end|dateFormat}}</div>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column prop="create_date" label="创建日期" width="160px">
          <template slot-scope="scope">{{scope.row.create_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="start_date" label="开始日期" width="160px">
          <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="end_date" label="结束日期" width="160px">
          <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="total_date_end" label="计划截止日期" width="160px">
          <template slot-scope="scope">{{scope.row.total_date_end|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="left" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <div style="padding-top:20px">
      <el-row>
        <el-col :span="4">
          <label for style="padding-top:15px">项目中提交审批次数最多的任务</label>
        </el-col>
        <el-col :span="3">
          <el-select v-model="taskvalue" placeholder="请选择提交次数排名" @change="taskValueChange">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-table
        :data="taskMaxSubmit "
        :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
        highlight-current-row
        default-expand-all
        :border="false"
      >
        <el-table-column prop="submit_num" label="提交次数" align="center"></el-table-column>
        <el-table-column label="缩略图" align="center" width="180px">
          <template slot-scope="scope">
            <el-image
              :src="$store.state.BASE_URL+scope.row.asset.image"
              style="width: 180px;height: 100px;cursor: pointer; display:block;"
              :preview-src-list="[$store.state.BASE_URL+scope.row.asset.image]"
            >
              <div slot="placeholder" class="image-slot">
                加载中
                <span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <el-image
                  :src="$store.state.BASE_URL+'images/appfile/1573029716.780075picture.png'"
                ></el-image>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="asset.name" label="镜头号" width="130px;">
          <template slot-scope="scope">{{scope.row.asset.name?scope.row.asset.name:'-'}}</template>
        </el-table-column>
        <el-table-column prop="episode" label="集数">
          <template slot-scope="scope">{{scope.row.episode?scope.row.episode:'-'}}</template>
        </el-table-column>
        <el-table-column prop="session" label="场次">
          <template slot-scope="scope">{{scope.row.session?scope.row.session:'-'}}</template>
        </el-table-column>
        <el-table-column prop="content" label="制作内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="end_date" label="截止日期" width="100px">
          <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="executor.name" label="执行人"></el-table-column>
        <el-table-column prop="status" label="状态/进度" width="160px" align="left">
          <template slot-scope="scope">
            {{scope.row.status|taskStatus}}
            <div v-if="scope.row.status != 3 && scope.row.status != 4">
              <el-progress
              :stroke-width="10"
              :show-text="false"
              :percentage="scope.row.schedule"
            ></el-progress>
            {{scope.row.schedule}}%
            </div>
            <div v-if="scope.row.status == 3">{{scope.row.statements}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级">
          <template slot-scope="scope">{{scope.row.priority|taskPriority}}</template>
        </el-table-column>
        <el-table-column prop="grade" label="难度">
          <template slot-scope="scope">{{scope.row.grade|taskgrade}}</template>
        </el-table-column>
        <el-table-column prop="start_date" label="开始日期" width="100px">
          <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="total_hour" align="center" label="预设时间（小时）" width="130px"></el-table-column>
        <el-table-column label="最后提交时间" header-align="left" width="100px">
          <template slot-scope="scope">{{scope.row.latest_submit_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="id" label="任务ID" width="80px"></el-table-column>
        <el-table-column prop="name" label="任务名称" width="100px" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="create_time" label="创建时间" width="100px">
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="creator.name" label="创建者"></el-table-column>-->
      </el-table>
    </div>
  </div>
</template>
<script>
import * as Ajax from "@/api/statistics";
export default {
  name: "maxSumbit",
  data() {
    return {
      assetMaxSubmit: [],
      taskMaxSubmit: [],
      options: [
        {
          //镜头的查询提交次数
          value: "10",
          label: "top10"
        },
        {
          value: "20",
          label: "top20"
        },
        {
          value: "30",
          label: "top30"
        },
        {
          value: "40",
          label: "top40"
        },
        {
          value: "50",
          label: "top50"
        }
      ],
      assetvalue: "10",
      options1: [
        {
          //任务的查询提交次数
          value: "10",
          label: "top10"
        },
        {
          value: "20",
          label: "top20"
        },
        {
          value: "30",
          label: "top30"
        },
        {
          value: "40",
          label: "top40"
        },
        {
          value: "50",
          label: "top50"
        }
      ],
      taskvalue: "10"
    };
  },
  created() {
    this.getAssetMaxSubmitS();
    this.getTaskMaxSubmitS();
  },
  methods: {
    assetValueChange() {
      this.getAssetMaxSubmitS();
    },
    taskValueChange() {
      this.getTaskMaxSubmitS();
    },
    //查询项目中提交审批数目最多的资产
    getAssetMaxSubmitS() {
      let data = {
        project_id: this.$route.params.id,
        max_submit_asset: "",
        top: this.assetvalue
      };
      Ajax.getAssetMaxSubmit(data).then(({ data }) => {
        this.assetMaxSubmit = data.asset;
      });
    },
    //查询项目中提交审批数目最多的任务
    getTaskMaxSubmitS() {
      let data = {
        project_id: this.$route.params.id,
        max_submit_task: "",
        top: this.taskvalue
      };
      Ajax.getAssetMaxSubmit(data).then(({ data }) => {
        this.taskMaxSubmit = data.task;
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.el-table {
  margin: 15px 0 20px;
}
.el-progress {
  width: 80px;
  display: inline-block;
  margin-right: 5px;
}
</style>