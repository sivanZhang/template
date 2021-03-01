<template>
  <div id="layout_main">
    <div class="layout_main_top">
      <div class="layout_main_top_left">
        <div class="layout_task" v-for="(item,index) of topArr" :key="index">
          <div @click="task(item.status)" :class="{active:changecolor==item.status}">
            <h3>{{item.num}}</h3>
            <span class="layout_top_span">{{item.title}}</span>
          </div>
        </div>
      </div>
      <div style="padding-top:25px;padding-left:0px;font-size:12px">未完成包括：未开始、进行中、超时、暂停中的任务</div>
    </div>
    <el-divider></el-divider>
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane label="任务板" name="first" class="tab-task">
        <div>
          <el-row type="flex" justify="space-between" :gutter="15">
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="24">未开始</el-col>
                </el-row>
                <draggable
                  v-model="DraftArr"
                  :group="{name:'task'}"
                  :sort="false"
                  @end="handelChanged"
                  data-arr="DraftArr"
                  class="board-column-content"
                >
                  <el-card
                    @click.native="openDialog(item)"
                    :style="{margin:'10px 0'}"
                    v-for="(item,index) of DraftArr"
                    :key="index"
                    :data-taskid="item.id"
                    :body-style="{backgroundColor:'#59e0e8',color:'#fff',padding:'5px'}"
                  >
                    <div class="cardvalue">{{item.name}}</div>
                    <div class="feedback">{{item.feedback_counter}}个反馈</div>
                  </el-card>
                </draggable>
                <label
                  for
                  @click="openList(DraftArr[0].status)"
                  class="show_more_links"
                  v-if="Object.keys(DraftArr).length"
                >展示更多...</label>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="24">进行中</el-col>
                </el-row>
                <draggable
                  v-model="InProgressArr"
                  group="task"
                  :sort="false"
                  @end="handelChanged"
                  data-arr="InProgressArr"
                  class="board-column-content"
                >
                  <el-card
                    @click.native="openDialog(item)"
                    :style="{margin:'10px 0'}"
                    v-for="(item,index) of InProgressArr"
                    :key="index"
                    :data-taskid="item.id"
                    :body-style="{backgroundColor:'#589BAD',color:'#fff',padding:'5px'}"
                  >
                    <div class="cardvalue">{{item.name}}</div>
                    <div class="feedback">{{item.feedback_counter}}个反馈</div>
                  </el-card>
                </draggable>
                <label
                  for
                  @click="openList(InProgressArr[0].status)"
                  class="show_more_links"
                  v-if="Object.keys(InProgressArr).length"
                >展示更多...</label>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="24">暂停</el-col>
                </el-row>
                <draggable
                  class="board-column-content"
                  v-model="PauseArr"
                  group="task"
                  :sort="false"
                  @end="handelChanged"
                  data-arr="PauseArr"
                >
                  <el-card
                    @click.native="openDialog(item)"
                    :style="{margin:'10px 0'}"
                    v-for="(item,index) of PauseArr"
                    :key="index"
                    :data-taskid="item.id"
                    :body-style="{backgroundColor:'#F9ce8c',color:'#fff',padding:'5px'}"
                  >
                    <div class="cardvalue">{{item.name}}</div>
                    <div class="feedback">{{item.feedback_counter}}个反馈</div>
                  </el-card>
                </draggable>
                <label
                  for
                  @click="openList(PauseArr[0].status)"
                  class="show_more_links"
                  v-if="Object.keys(PauseArr).length"
                >展示更多...</label>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="24">超时</el-col>
                </el-row>
                <draggable
                  class="board-column-content"
                  v-model="TimeOutArr"
                  group="task"
                  :sort="false"
                  @end="handelChanged"
                  data-arr="TimeOutArr"
                >
                  <el-card
                    @click.native="openDialog(item)"
                    :style="{margin:'10px 0'}"
                    v-for="(item,index) of TimeOutArr"
                    :key="index"
                    :data-taskid="item.id"
                    :body-style="{backgroundColor:'#C64b2b',color:'#fff',padding:'5px'}"
                  >
                    <div class="cardvalue">{{item.name}}</div>
                    <div class="feedback">{{item.feedback_counter}}个反馈</div>
                  </el-card>
                </draggable>
                <label
                  for
                  @click="openList(TimeOutArr[0].status)"
                  class="show_more_links"
                  v-if="Object.keys(TimeOutArr).length"
                >展示更多...</label>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp" style="background-color:#eeeeee">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="24">审核中</el-col>
                </el-row>
                <div class="board-column-content">
                  <el-card
                    :style="{margin:'10px 0'}"
                    v-for="(item,index) of ApproveingArr"
                    :key="index"
                    :data-taskid="item.id"
                    :body-style="{backgroundColor:'#2D5637',color:'#fff',padding:'5px'}"
                  >
                    <div class="cardvalue">{{item.name}}</div>
                    <div class="feedback">{{item.feedback_counter}}个反馈</div>
                  </el-card>
                  <label
                    for
                    @click="openList(ApproveingArr[0].status)"
                    class="show_more_links"
                    v-if="Object.keys(ApproveingArr).length"
                  >展示更多...</label>
                </div>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp" style="background-color:#eeeeee">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="24">完成</el-col>
                </el-row>
                <div class="board-column-content">
                  <el-card
                    :style="{margin:'10px 0'}"
                    v-for="(item,index) of FinishedArr"
                    :key="index"
                    :data-taskid="item.id"
                    :body-style="{backgroundColor:'#2f5c85',color:'#fff',padding:'5px'}"
                  >
                    <div class="cardvalue">{{item.name}}</div>
                    <div class="feedback">{{item.feedback_counter}}个反馈</div>
                  </el-card>
                  <label
                    for
                    @click="openList(FinishedArr[0].status)"
                    class="show_more_links"
                    v-if="Object.keys(FinishedArr).length"
                  >展示更多...</label>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="任务列表" name="second" class="tab-task">
        <div ref="drawer-parent">
          <!-- 打开任务侧栏 -->
        <Drawer
          scrollable
          v-model="isDrawerShow"
          width="512px"
          :inner="isInner"
          :mask-style="{backgroundColor: 'transparent'}"
          :transfer="false"
          draggable>
          <el-tabs>
            <el-tab-pane label="任务详情">
              <tabTaskDtail
                ref="taskDetail"
                :taskdetail="TaskDetail"
                :link="Link"
                :asset="Asset"
                :detailLoading="detailLoading"
              />
            </el-tab-pane>
            <el-tab-pane label="项目详情" >
              <info :project="project" @refreshProject="getProjectDetail()"/>
            </el-tab-pane>
            <el-tab-pane label="关联任务输出">
              <linkTaskOutput ref="linkTaskOutput" />
            </el-tab-pane>

            <el-tab-pane label="历史版本">
              <history
                :historyVersion="historyVersion"
                :project="project"
                @Version="getAssetVersion"
              />
            </el-tab-pane>
            <el-tab-pane label="执行记录">
              <tabLog :loglist="LogList" :logsLoading="logsLoading" />
            </el-tab-pane>
            <el-tab-pane label="执行任务">
              <task-form
                :surplus_labor_hour="surplus_labor_hour"
                :task-record.sync="TaskRecord"
                :createLoading="createLoading"
                @addRecord="addRecord"
                @cancel="cancel"
              />
            </el-tab-pane>
            <el-tab-pane label="审核">
              <tab-approve
               
                v-if="activeRow.task && activeRow.task.status === 2"
                :row="activeRow"
                @refresh="getMyTasks"
                ref="tabApprove"
              />
              <div v-else style="display:flex;justify-content:center">任务状态不是进行中</div>
              <div style="padding-bottom:5px;font-weight:bold">历史审批：</div>
              <approve-log ref="taskApprovelog" />
            </el-tab-pane>
            <!-- <el-tab-pane label="审批记录">
              <approve-log ref="taskApprovelog" />
            </el-tab-pane>-->
          </el-tabs>
        </Drawer>
        <!-- 打开资产侧栏 -->
        <Drawer
          scrollable
          closable
          v-model="assetShow"
          width="526"
          :transfer="false"
          :mask="false"
          :inner="isInner">
          <assetDrawer :authAsset="authAsset" ref="assetDrawer" />
        </Drawer>
        <el-row style="padding-bottom:10px">
          <el-col style="text-align:right">
            <div style="display:flex;justify-content:flex-end">
              <el-select
                v-model="colSel"
                placeholder="请选择"
                style="width:120px;margin-right:5px;"
                filterable
                slot="prepend"
              >
                <el-option
                  v-for="(item,index) in columnSelect"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                v-if="colSel === 'name'|| colSel === 'project_name'"
                placeholder="输入关键字搜索"
                v-model="keyword"
                @keyup.enter.native="task(changecolor)"
                style="width:200px"
              ></el-input>
              <el-select
                v-if="colSel === 'priority'"
                v-model="colSel2"
                placeholder="请选择"
                multiple
                filterable
                style="width:200px"
                @keyup.enter.native="task(changecolor)"
              >
                <el-option
                  v-for="(item,index) in columnSelect2"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div v-if="colSel === 'start_date' || colSel === 'end_date'">
                <el-date-picker
                  style="width:130px"
                  v-model="timeSelection"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
                <span style="text-align:center;padding-top:3px">至</span>
                <el-date-picker
                  style="width:130px"
                  v-model="timeSelection2"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
              <el-select
                v-if="colSel === 'grade'"
                v-model="currentGrade"
                placeholder="选择任务难度"
                multiple
                filterable
                style="width:200px"
                @keyup.enter.native="task(changecolor)"
              >
                <el-option
                  v-for="(item,index) in GradeList"
                  :key="item.value+index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-button @click="task(changecolor)" type="primary" style="margin-left:5px">查询</el-button>
              <el-button @click="reTask(changecolor)" type="primary">重置</el-button>
            </div>
          </el-col>
        </el-row>
        <el-table
          :data="MyTaskList1"
          highlight-current-row
          border
          style="width: 100%;"
          :cell-style="cellStyle"
          @sort-change="sortFilter"
          :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
          :row-style="{height:50}"
          @filter-change="filterHandler"
          @cell-dblclick="editCell">
          <el-table-column type="index" label="序号" :index="indexMethod" align="center"></el-table-column>
          <el-table-column label="项目" header-align="left"  >
            <template slot-scope="scope">
              <router-link
                style="cursor: pointer;"
                :to="{name:'project-detail',params:{id:scope.row.project.id},query:{type:scope.row.project.pro_type}}"
              >{{scope.row.project.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="缩略图" v-if="show_project_image" width="180px">
            <template slot-scope="scope">
              <el-image
                :src="$store.state.BASE_URL+scope.row.asset.image"
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

          <el-table-column
            prop="asset.name"
            class-name="links"
            label="镜头号"
            header-align="left"
             width="120px"
          >
            <template slot-scope="scope">
              <div @click="show(scope.row.asset.id)">{{scope.row.asset.name}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="asset.episode" label="集数"></el-table-column>
          <el-table-column prop="asset.session" label="场次"></el-table-column>
          <el-table-column
            prop="task.dept.name"
            label="环节"
            header-align="left" 
          ></el-table-column>
          <el-table-column label="截止日期" header-align="left" width="100px">
            <template slot-scope="scope">{{scope.row.task.end_date|dateFormat}}</template>
          </el-table-column>
          <el-table-column width="30px">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="任务状态：暂停" placement="top">
                <el-card
                  v-if="scope.row.task.status === 0"
                  :style="{width:'10px',backgroundColor:'#F9ce8c',border:'0px',padding: '25px 5px'}"
                ></el-card>
              </el-tooltip>
              <el-tooltip effect="dark" content="任务状态：未开始" placement="top">
                <el-card
                  v-if="scope.row.task.status === 1"
                  :style="{width:'10px',backgroundColor:'#59e0e8',border:'0px',padding: '25px 5px'}"
                ></el-card>
              </el-tooltip>
              <el-tooltip effect="dark" content="任务状态：进行中" placement="top">
                <el-card
                  v-if="scope.row.task.status === 2"
                  :style="{width:'10px',backgroundColor:'#589BAD',border:'0px',padding: '25px 5px'}"
                ></el-card>
              </el-tooltip>
              <el-tooltip effect="dark" content="任务状态：审核中" placement="top">
                <el-card
                  v-if="scope.row.task.status === 3"
                  :style="{width:'10px',backgroundColor:'#2D5637',border:'0px',padding: '25px 5px'}"
                ></el-card>
              </el-tooltip>
              <el-tooltip effect="dark" content="任务状态：完成" placement="top">
                <el-card
                  v-if="scope.row.task.status === 4"
                  :style="{width:'10px',backgroundColor:'#2f5c85',border:'0px',padding: '25px 5px'}"
                ></el-card>
              </el-tooltip>
              <el-tooltip effect="dark" content="任务状态：超时" placement="top">
                <el-card
                  v-if="scope.row.task.status === 5"
                  :style="{width:'10px',backgroundColor:'#C64b2b',border:'0px',padding: '25px 5px'}"
                ></el-card>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="任务状态/进度"
            width="160px"
            sortable="custom"
            prop="schedule"
            column-key="schedule"
            :filters="[{text: '暂停', value: '0'}, {text: '未开始', value: '1'}, {text: '进行中', value: '2'}, {text: '审核中', value: '3'}, {text: '完成', value: '4'}, {text: '超时', value: '5'}]"
          >
            <template slot-scope="scope">
              <div
                v-if="scope.row.task.status != 3 &&scope.row.task.status != 4&& scope.row.task.status != 6"
              >
                <el-select
                  :value="scope.row.task.status"
                  placeholder="请选择"
                  @change="statusChange($event,scope.row)"
                  class="my-select"
                >
                  <el-option
                    v-for="(item,index) in StatusList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div v-else style="color:#909399">{{scope.row.task.status|taskStatus}}</div>
              <el-progress
                :stroke-width="12"
                :percentage="scope.row.task.schedule?scope.row.task.schedule:0"
                v-if="scope.row.task.status != 3 && scope.row.task.status != 4"
              ></el-progress>
              <div v-if="scope.row.task.status == 3">{{scope.row.task.statements}}</div>
            </template>
          </el-table-column>
          <el-table-column label="提交次数" prop="task.submit_num"></el-table-column>
          <el-table-column label="难度" header-align="left" align="center" prop="task.grade">
            <template slot-scope="scope">{{scope.row.task.grade|taskgrade}}</template>
          </el-table-column>
          <el-table-column label="优先级" header-align="left" prop="priority" sortable="custom">
            <template slot-scope="scope">{{scope.row.task.priority|taskPriority}}</template>
          </el-table-column>
          <el-table-column label="开始日期" header-align="left" width="100px">
            <template slot-scope="scope">{{scope.row.task.start_date|dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="total_hour" header-align="left" label="预设时间（小时）" width="80px;">
            <template slot-scope="scope">{{scope.row.task.total_hour}}</template>
          </el-table-column>
          <el-table-column label="最后提交时间" header-align="left" width="100px">
            <template slot-scope="scope">{{scope.row.task.latest_submit_time|dateFormat}}</template>
          </el-table-column>
          <el-table-column
            prop="task.id"
            class-name="links"
            label="任务ID"
            header-align="left"
            width="80"
          >
            <template slot-scope="scope">
              <div @click="taskBoardRightShow(scope.row)">{{scope.row.task.id}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="task.name" header-align="left" label="任务名称"  ></el-table-column>
          <el-table-column
            prop="task.content"
            header-align="left"
            label="任务内容" 
          ></el-table-column>
          <!-- <el-table-column label="创建日期" header-align="left">
            <template slot-scope="scope">{{scope.row.task.create_time|dateFormat}}</template>
          </el-table-column>-->
          <!-- <el-table-column label="任务进度" header-align="left">
            <template slot-scope="scope">{{scope.row.task.schedule}}%</template>
          </el-table-column>-->
        </el-table>
        <div class="block" style="text-align: right">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizeList"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :page-count="pageCount"
            :total="total"
            style="margin-top:10px"
          ></el-pagination>
        </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的反馈" name="third" class="tab-task">
        <div id="feedback">
          <el-table
            :data="FeedbackList.msg"
            :border="false"
            :row-style="{height:50}"
          >
            <el-table-column prop="task.asset_name" label="镜头号"></el-table-column>
            <el-table-column label="缩略图" align="center">
              <template slot-scope="scope">
              <el-image
                :src="$store.state.BASE_URL+scope.row.task.asset_image"
                :preview-src-list="[$store.state.BASE_URL+scope.row.task.asset_image]"
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
            <el-table-column prop="task.name" label="任务名称"></el-table-column>
            <el-table-column prop="result" label="审批结果">
              <template slot-scope="scope">
                <div
                  :style="{color:scope.row.result?'#19be6b':'#ed4014'}"
                >{{scope.row.result?'通过':'未通过'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="suggestion" label="审批意见"></el-table-column>
            <el-table-column label="任务进度" prop="task.schedule">
              <template slot-scope="scope">
                <el-progress :stroke-width="12" :percentage="scope.row.task.schedule"></el-progress>
              </template>
            </el-table-column>
            <el-table-column label="优先级" prop="task.priority">
              <template slot-scope="scope">{{scope.row.task.priority|taskPriority}}</template>
            </el-table-column>
            <el-table-column label="任务状态" prop="task.statements"></el-table-column>
            <el-table-column label="提交次数" prop="task.submit_num"></el-table-column>
          </el-table>
          <div class="block" style="text-align: right">
            <el-pagination
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page.sync="currentPage1"
              :page-sizes="[10,20,50,100]"
              :page-size="pageSize1"
              layout="total, sizes, prev, pager, next, jumper"
              :total="FeedbackList.count"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="任务执行" :visible.sync="isDialogShow" width="512px" center :modal="false">
      <task-form
        :task-record.sync="TaskRecord"
        :createLoading="createLoading"
        :surplus_labor_hour="surplus_labor_hour"
        @addRecord="addRecord"
        @cancel="cancel"
      />
    </el-dialog>
  </div>
</template>

<script src="./task.js">
</script>
<style lang="scss" src="./task.scss">

</style>
