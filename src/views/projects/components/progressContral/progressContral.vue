<template>
  <div>
    <div style="padding-top:15px">
      <el-row>
        <el-col :span="4">
          <el-switch v-model="isChartView" active-text="图表" inactive-text="表格"></el-switch>
        </el-col>
      </el-row>
      <el-row>
        <!-- 项目进度 -->
        <el-col :span="8" align="middle">
          <div style="padding:17px 20px">
            <label for>项目进度</label>
          </div>
          <div style="margin-top:80px">
            <el-progress
              type="circle"
              :percentage="projectProgress"
              :color="colors"
              :format="format"
            ></el-progress>
          </div>
        </el-col>
        <!-- 超期的镜头数量 +table-->
        <el-col :span="10" align="middle">
          <div style="padding:17px 0px">
            <label for>超期镜头数量</label>
          </div>
          <chart
            ref="asset-chart1"
            chart-id="asset-chart1"
            v-if="isChartView"
            @click-item="handleClickChart"
          />
          <el-table
            :data="overdueNum"
            :border="true"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            style="width:180px"
            v-if="!isChartView"
          >
            <el-table-column prop="name" label="镜头状态"></el-table-column>
            <el-table-column prop="value" label="数量" width="80"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-divider />
      <el-row>
        <el-col :span="24">
          <div style="width:100%;padding-top:15px">
            <!-- 燃尽图 +table -->
            <template v-if="burnShow">
              <el-row>
                <LineChart chart-id="line-chart2" ref="line-chart2" v-if="isChartView" />
                <div v-if="!isChartView" style="padding-top:10px">
                  <div style="padding-bottom:10px">
                    <label for>项目燃尽图</label>
                  </div>
                  <el-table
                    :data="burnOutTable.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                    :border="true"
                    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                  >
                    <el-table-column prop="dates" label="日期"></el-table-column>
                    <el-table-column prop="plan_worktimes" label="计划工作时长"></el-table-column>
                    <el-table-column prop="real_worktimes" label="实际工作时长"></el-table-column>
                  </el-table>
                  <div class="block" style="text-align: right">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="pageSizeList"
                      :page-size="pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="burnOutTable.length"
                    ></el-pagination>
                  </div>
                </div>
              </el-row>
            </template>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-divider />
    <!-- 任务预判断 -->
    <div>
      <el-row>
        <el-col :span="2">
          <label for style="width:80px">任务预判断</label>
        </el-col>
        <el-col :span="22">
          <el-switch v-model="progress" active-text="滞后" inactive-text="超前"></el-switch>
          <!-- <span
            @click="openExplain()"
            class="btn-explain"
          >
            使用帮助:
            <svg-icon icon-class="wenhao" />
          </span> -->
        </el-col>
      </el-row>
      <div v-if="progress">
        <el-table
          :data="progressPredict.slice((currentPage2-1)*pageSize2,currentPage2*pageSize2)"
          :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0,minHeight:'50px'}"
          style="padding-top:15px;width:100%"
          highlight-current-row
          default-expand-all
        >
          <!-- <el-table-column type="index"></el-table-column> -->
          <el-table-column prop="deviation" label="偏离值" width="80px">
            <template slot-scope="scope">
              <svg-icon icon-class="shuzhikuang" style="width:20px;height:20px" />
              {{scope.row.deviation }}
            </template>
          </el-table-column>
          <el-table-column label="缩略图" align="center" width="180px">
            <template slot-scope="scope">
              <el-image
                :src="$store.state.BASE_URL+scope.row.asset__image"
                style="width: 180px;height: 100px;cursor: pointer; display:block;"
                :preview-src-list="[$store.state.BASE_URL+scope.row.asset__image]"
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
          <el-table-column prop="asset__name" label="镜头号"></el-table-column>
          <el-table-column prop="name" label="任务名称"></el-table-column>
          <el-table-column prop="content" label="任务内容" show-overflow-tooltip></el-table-column>
          <el-table-column prop="start_date" label="任务开始时间">
            <template slot-scope="scope">{{scope.row.start_date|dateFormat }}</template>
          </el-table-column>
          <el-table-column prop="end_date" label="任务结束时间">
            <template slot-scope="scope">{{scope.row.end_date|dateFormat }}</template>
          </el-table-column>
          <el-table-column prop="executors" label="任务执行人"></el-table-column>
          <el-table-column prop="asset__frame" label="资产帧数" width="100">
            <template slot-scope="scope">{{scope.row.asset__frame?scope.row.asset__frame:'-'}}</template>
          </el-table-column>
          <el-table-column prop="asset__session" label="资产场次">
            <template slot-scope="scope">{{scope.row.asset__session?scope.row.asset__session:'-'}}</template>
          </el-table-column>
        </el-table>
        <div class="block" style="text-align: right">
        <el-pagination
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
          :current-page="currentPage2"
          :page-sizes="pageSizeList"
          :page-size="pageSize2"
          layout="total, sizes, prev, pager, next, jumper"
          :total="progressPredict.length"
        ></el-pagination>
      </div>
      </div>
      <div v-if="!progress">
        <el-table
          :data="progressPredict1.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)"
          :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
          style="padding-top:15px;width:100%"
          highlight-current-row
          default-expand-all
        >
          <!-- <el-table-column type="index"></el-table-column> -->
          <el-table-column prop="deviation" label="偏离值">
            <template slot-scope="scope">
              <svg-icon icon-class="shuzhikuang" style="width:20px;height:20px" />
              {{scope.row.deviation }}
            </template>
          </el-table-column>
          <el-table-column label="缩略图" align="center" width="180px">
            <template slot-scope="scope">
              <el-image
                :src="$store.state.BASE_URL+scope.row.asset__image"
                style="width: 180px;height: 100px;cursor: pointer; display:block;"
                :preview-src-list="[$store.state.BASE_URL+scope.row.asset__image]"
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
          <el-table-column prop="asset__name" label="镜头名称" width="100"></el-table-column>
          <el-table-column prop="name" label="任务名称"></el-table-column>
          <el-table-column prop="content" label="任务内容" show-overflow-tooltip></el-table-column>
          <el-table-column prop="start_date" label="任务开始时间">
            <template slot-scope="scope">{{scope.row.start_date|dateFormat }}</template>
          </el-table-column>
          <el-table-column prop="end_date" label="任务结束时间">
            <template slot-scope="scope">{{scope.row.end_date|dateFormat }}</template>
          </el-table-column>
          <el-table-column prop="executors" label="任务执行人"></el-table-column>
          <el-table-column prop="asset__frame" label="资产帧数" width="100">
            <template slot-scope="scope">{{scope.row.asset__frame?scope.row.asset__frame:'-'}}</template>
          </el-table-column>
          <el-table-column prop="asset__session" label="资产场次">
            <template slot-scope="scope">{{scope.row.asset__session?scope.row.asset__session:'-'}}</template>
          </el-table-column>
        </el-table>
        <div class="block" style="text-align: right">
        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="currentPage1"
          :page-sizes="pageSizeList"
          :page-size="pageSize1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="progressPredict1.length"
        ></el-pagination>
      </div>
      </div>
    </div>
    <!-- 距离截止日期为1天还未提交的任务 -->
    <div style="padding-top:30px">
      <el-row>
        <el-col :span="20">
          <label for style="padding-top:15px">距离截止日期为1天还未提交的任务</label>
        </el-col>
      </el-row>
      <el-table
        :data="notSubmitList"
        :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
        style="padding-top:15px;width:100%"
        highlight-current-row
        default-expand-all
      >
        <el-table-column type="index" align="center"></el-table-column>
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
        <el-table-column prop="asset__name" label="镜头名称"></el-table-column>
        <el-table-column prop="name" label="任务名称"></el-table-column>
        <el-table-column prop="content" label="制作内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="executors" label="任务执行人"></el-table-column>
        <el-table-column prop="asset__frame" label="资产帧数">
          <template slot-scope="scope">{{scope.row.asset__frame?scope.row.asset__frame:'-'}}</template>
        </el-table-column>
        <el-table-column prop="asset__session" label="资产场次">
          <template slot-scope="scope">{{scope.row.asset__session?scope.row.asset__session:'-'}}</template>
        </el-table-column>
        <el-table-column prop="asset__frame_range" label="帧数范围">
          <template
            slot-scope="scope"
          >{{scope.row.asset__frame_range?scope.row.asset__frame_range:'-'}}</template>
        </el-table-column>
        <el-table-column prop="link.content" label="环节制作内容"></el-table-column>
        <el-table-column prop="link.dept__name" label="环节工种"></el-table-column>
        <el-table-column prop="link.title" label="环节标题"></el-table-column>
      </el-table>
    </div>
    <!-- 超期的任务数量与任务执行人排名 -->
    <div style="padding-top:30px">
      <el-row>
        <el-col :span="20">
          <label for style="padding-top:15px">超期的任务数量与任务执行人排名</label>
        </el-col>
      </el-row>
      <el-table
        :data="overdueUserName"
        :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
        style="padding-top:15px;width:100%"
        highlight-current-row
        default-expand-all
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="overdue_tasknum" label="总的超期的任务数量"></el-table-column>
        <el-table-column label="任务执行人">
          <template slot-scope="scope">
            <div v-for="(todo,index) of scope.row.executor_overduetask" :key="index">
              <div v-if="index==0">
                <svg-icon icon-class="numberone" style="width:18px;height:18px" />
                {{todo.user_name}}
              </div>
              <div v-else-if="index == 1">
                <svg-icon icon-class="numbertwo" style="width:18px;height:18px" />
                {{todo.user_name}}
              </div>
              <div v-else-if="index == 2">
                <svg-icon icon-class="numberthree" style="width:18px;height:18px" />
                {{todo.user_name}}
              </div>
              <div v-else>
                <span style="padding-left:20px">{{todo.user_name}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="超期的任务数量">
          <template slot-scope="scope">
            <div
              v-for="(todo,index) of scope.row.executor_overduetask"
              :key="index"
            >{{todo.overdue_tasknum}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 查询项目中提交审批数目最多的资产和任务 -->
    <maxSumbit />
    <!-- 超前与滞后说明 -->
    <el-dialog title="注意事项" :visible.sync="dialogVisible" width="365px">
      <div  class="notice-matter">
        <div style="font-size:12px">
          <h3>偏离值为负数：</h3>说明完成进度超前，绝对值越大，进度越超前，排名也更靠前
        </div>
        <div style="font-size:12px">
          <h3>偏离值为正数：</h3>说明完成进度滞后，绝对值越大，说明滞后程度越严重，排名更靠前
        </div>
        <div style="font-size:12px">
          <h3>偏离值计算公式：</h3>
          <div style="padding-top:3px">
            <h4>正常情况下：</h4>每天工时(8h)&nbsp;*&nbsp;(当前日期&nbsp;-&nbsp;开始日期)&nbsp;/&nbsp;每天工时(8h)&nbsp;*&nbsp;(截止日期&nbsp;-&nbsp;开始日期)
          </div>
          <div>
            <h4>实际情况下：</h4>实际工时&nbsp;/&nbsp;每天工时(8h)&nbsp;*&nbsp;(截止日期&nbsp;-&nbsp;开始日期)
          </div>
          <div>
            <h4>进度预判：</h4>正常情况下&nbsp;-&nbsp;实际情况下&nbsp;=&nbsp;偏离值
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { taskProgress, notSubmitTask } from "@/api/task";
import * as Ajax from "@/api/statistics";
import Chart from "@/components/ECharts/PieChart";
import LineChart from "@/components/ECharts/LineMarker";
import maxSumbit from "./maxSumbit";
export default {
  name: "progressContral",
  components: {
    Chart,
    LineChart,
    maxSumbit
  },
  data() {
    return {
      dialogVisible: false,
      projectProgress: 0,
      currentPage: 1,
      pageSize:10,
      currentPage1: 1,
      pageSize1: 20,
      currentPage2: 1,
      pageSize2: 20,
      pageSizeList: [10, 30, 50, 100],
      progressPredict: [],
      progressPredict1: [],
      progress: true,
      isChartView: true,
      notSubmitList: [],
      overdueNum: [],
      overdueUserName: [],
      burnShow: true,
      burnOutTable: [],
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#6f7ad3", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#5cb87a", percentage: 100 }
      ]
    };
  },
  watch: {
    isChartView: {
      handler: function(newVal, oldVal) {
        if (newVal == true) {
          this.getAssetStatistics();
          this.getBurnOut();
          this.getProjectProgress();
        }
      }
    }
  },
  created() {
    this.taskProgressPredict();
    this.notSubmitTaskList();
    this.getOverDueTaskS();
  },
  mounted() {
    this.getAssetStatistics();
    this.getBurnOut();
    this.getProjectProgress();
  },
  methods: {
    // 监听饼图点击事件
    handleClickChart(params) {
      // 点击超期时
      if (params.dataIndex===0) {
        this.$store.commit('project/setFilterOverdue',true)
        this.$emit('switch-task-tab')
      }
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    //任务预判断滞后分页
    handleSizeChange2(val) {
      this.pageSize2 = val;
    },
    handleCurrentChange2(currentPage) {
      this.currentPage2 = currentPage;
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      console.log(index)
      return (this.currentPage2 - 1) * this.pageSize2 + index + 1;
    },
    //任务预判断超前分页
    handleSizeChange1(val) {
      this.pageSize1 = val;
    },
    handleCurrentChange1(currentPage) {
      this.currentPage1 = currentPage;
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage1 - 1) * this.pageSize1 + index + 1;
    },
    //指定进度条文字内容。
    format(percentage) {
      return percentage === 100 ? "完成" : `${percentage}%`;
    },
    //获取项目进度
    getProjectProgress() {
      Ajax.getProjectStatistic({
        project_id: this.$route.params.id
      }).then(({ data }) => {
        this.projectProgress = data.msg.replace("%", "") - 0;
      });
    },
    //超前滞后说明
    openExplain() {
      this.dialogVisible = true;
    },
    //任务预判断
    taskProgressPredict() {
      let data = {
        project_id: this.$route.params.id,
        prejudgment: ""
      };
      taskProgress(data).then(({ data }) => {
        this.progressPredict = data.positive_message;
        this.progressPredict1 = data.native_message;
      });
    },
    //距离截止日期为1天还未提交的任务
    notSubmitTaskList() {
      let data = {
        project_id: this.$route.params.id,
        not_submit: ""
      };
      notSubmitTask(data).then(({ data }) => {
        this.notSubmitList = data.msg;
      });
    },
    //超期的任务数量与任务执行人排名
    getOverDueTaskS() {
      let data = {
        project_id: this.$route.params.id
      };
      Ajax.getOverDueTask(data).then(({ data }) => {
        this.overdueUserName = [...data.msg];
      });
    },
    //获取镜头状态统计  并传参调用图表组件的初始化方法
    getAssetStatistics() {
      // this.$refs["asset-chart"].openLoading();
      Ajax.getOverDueAsset({
        project_id: this.$route.params.id
      }).then(({ data }) => {
        let chartData = [
          {
            name: "超期",
            value: data.overdue_assetnum
          },{
            name:'未超期',
            value: data.total_asset_num-data.overdue_assetnum
          }
        ];
        this.overdueNum = chartData;
        this.$refs["asset-chart1"].initChart("", chartData);
      });
    },
    //获取燃尽图数据
    getBurnOut() {
      // this.$refs["line-chart1"].openLoading();
      Ajax.burnOut({
        id: this.click_id ? this.click_id : this.$route.params.id,
        workhour: ""
      }).then(({ data }) => {
        if (data.status == 0) {
          if (!data.dates.length) {
            this.burnShow = false;
            return;
          }
          data.dates.map((item, index) => {
            this.burnOutTable.push({
              dates: item,
              plan_worktimes: data.plan_worktimes[index],
              real_worktimes: data.real_worktimes[index]
            });
            this.currentPage = 1;
          });
          let customOption = {
            title: {
              top: 20,
              text: "项目总工时走向图",
              textStyle: {
                fontWeight: 600,
                fontSize: 16
              },
              left: "left",
              top: 0
            },
            tooltip: {
              trigger: "axis"
            },
            legend: {
              //图例
              data: ["计划工作时长", "实际工作时长"], // 名字
              tooltip: {
                show: true
              }
            },
            xAxis: [
              {
                type: "category",
                boundaryGap: false,
                data: data.dates
              }
            ],
            yAxis: [
              {
                type: "value"
                /* name: "(%)", */
              }
            ],
            series: [
              // 线数据
              {
                name: "计划工作时长",
                type: "line",
                symbol:'none', 
                smooth: true,
                showSymbol: true,
                data: data.plan_worktimes
              },
              {
                name: "实际工作时长",
                type: "line",
                symbol:'none', 
                smooth: true, // 是否曲线
                showSymbol: true, // 是否显示点
                data: data.real_worktimes
              }
            ]
          };
          this.$refs["line-chart2"].initChart(customOption);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-explain{
        padding-left:15px;
        font-size:12px;
        color:#808080;
        cursor: pointer;
      }
    .notice-matter {
  padding-left: 5px;
  padding-bottom: 20px;
  padding-right: 5px;
}
</style>
