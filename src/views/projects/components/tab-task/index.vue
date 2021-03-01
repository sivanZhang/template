<template>
  <div id="task" ref="drawer-parent">
    <div>
      <el-row>
        <el-col :span="13">
          <template v-if="authTask">
            <el-button type="primary" icon="el-icon-plus" @click.native="mainTask">创建任务</el-button>
            <!-- <el-button icon="el-icon-download" type="primary">导入</el-button> -->
            <el-button icon="el-icon-upload2" type="success" @click="targetUpload">导出</el-button>
            <el-button
              type="success"
              @click="mulEditTasks(1)"
              icon="el-icon-edit"
              :disabled="this.multipleSelection.length === 0"
            >批量修改</el-button>
            <el-button
              type="danger"
              @click="deleteTask"
              icon="el-icon-delete"
              :disabled="this.multipleSelection.length === 0"
            >批量删除</el-button>
          </template>
          <el-popover
            placement="bottom"
            width="300"
            trigger="click"
            v-model="visible"
            style="margin-left:15px"
          >
            <el-col :span="12">
              <el-checkbox v-model="show_name">任务</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_link_dept_name">环节</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_content">制作内容</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_project_image">缩略图</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_asset_name">镜头号</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_episode">集数</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_session">场次</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_priority">优先级</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_grade">难度</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_status">状态</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_creator_name">创建者</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_executor">执行人</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_schedule">任务进度</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_create_time">创建日期</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_start_date">开始日期</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_end_date">截止日期</el-checkbox>
            </el-col>
            <el-col :span="24">
              <el-checkbox v-model="show_total_hour">预设时间(h)</el-checkbox>
            </el-col>
            <!-- <el-col :span="14" style="padding-top:11px" align="right">
              <span
               class="btn-explain"
                @click="openExplain()"
              >
                使用帮助:
                <svg-icon icon-class="wenhao" />
              </span>
            </el-col> -->
            <el-col :span="10" style="padding-top:8px" align="center">
              <el-button type="primary" size="mini" @click="saveLongMenu" :loading="rememberLoading">记住选择列</el-button>
            </el-col>
            <el-button slot="reference" type="primary" icon="el-icon-setting" size="mini">展示列</el-button>
          </el-popover>
        </el-col>
        <el-col :span="11" style="text-align:right">
          <div style="display:flex;justify-content:flex-end;text-align:bottom">
            <!-- 单条件筛选 -->
            <taskSel ref="taskSel" @refreshTaskList="getTasks" />
            <!-- 多条件筛选 -->
            <taskMulSel
              @refresh_sortMul="MulSel"
              @filterCondition="filterCondition"
              @selRefresh="selRefresh"
            />
            <el-button @click="getTasks(1)" style="margin-left: 15px" type="primary" size="mini">重置</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 筛选条件展示 -->
      <taskFilter ref="taskFilter" @refresh_close="closeSelectedTag" />
      <el-table
        ref="multipleTable"
        :height="curHeight"
        :data="TaskList"
        style="margin-top:15px;width:100%"
        highlight-current-row
        :tree-props="{ children: 'sub_task' }"
        @current-change="rowSelected"
        @selection-change="handleSelectionChange"
        :stripe="true"
        :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0,padding:0 }"
        :cell-style="cellStyle"
        border
        :row-key="row=>row.id"
        v-loading="tableLoading"
        @filter-change="filterHandler"
        @sort-change="sortFilter"
        @cell-dblclick="editCell"       
      >
        <!-- default-expand-all -->
        <el-table-column :key="1" type="selection" :reserve-selection="true" width="40" align="center"></el-table-column>
        <el-table-column
        :key="2"
          label="镜头号"
          v-if="show_asset_name"
          prop="asset"
          sortable="custom"
          width="130px"
          class-name="links"
        >
          <template slot-scope="scope">
            <div @click="show(scope.row.asset.id)">{{scope.row.asset.name}}</div>
          </template>
        </el-table-column>

        <el-table-column :key="3" label="缩略图" v-if="show_project_image" width="180px" align="center">
          <template slot-scope="scope" v-if="!scope.row.pid">
            <el-tooltip effect="dark" content="右击展示侧边栏" placement="top">
            <el-image
            @contextmenu.prevent="showDrawer(scope.row)"
              :src="$store.state.BASE_URL+scope.row.asset.image"
              :preview-src-list="[$store.state.BASE_URL+scope.row.asset.image]"
              style="width: 160px;height: 90px;cursor: pointer; display:inline-block;margin-top:5px;"
              fit="cover"
            >
              <div slot="placeholder" class="image-slot">
                加载中
                <span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <el-image
                 @contextmenu.prevent="showDrawer(scope.row)"
                  :src="$store.state.BASE_URL+'images/appfile/1573029716.780075picture.png'"
                ></el-image>
              </div>
            </el-image>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
        :key="4"
          label="集数"
          prop="episode"
          sortable="custom"
          v-if="show_episode"
          column-key="episode"
          :filters="columnSelect3"
        >
          <template slot-scope="scope">{{scope.row.episode?scope.row.episode:"-"}}</template>
        </el-table-column>
        <el-table-column
        :key="5"
          label="场次"
          prop="session"
          sortable="custom"
          column-key="session"
          v-if="show_session"
          :filters="columnSelect4"
        >
          <template slot-scope="scope">{{scope.row.session?scope.row.session:"-"}}</template>>
        </el-table-column>
        <el-table-column
        :key="6"
          label="制作内容"
          align="left"
          :max-width="70"
          prop="content"
          show-overflow-tooltip
          v-if="show_content"
        >
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.content"
              placeholder="请输入制作内容"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'content')"
              @change="showEditIcon"
              @blur="saveEdit(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <span>{{scope.row.content?scope.row.content:"-"}}</span>
            </el-input>
            <span
              style="white-space: pre-line;"
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'content')"
            >{{scope.row.content?scope.row.content:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column
        :key="7"
          label="环节"
          prop="dept"
          sortable="custom" 
          v-if="show_link_dept_name"
          width="60px"
          column-key="dept"
          :filters="colomnSelect5"
        >
          <template slot-scope="scope">{{scope.row.link_dept_name}}</template>
        </el-table-column>
        <el-table-column
        :key="8"
          label="截止日期"
          width="90px"
          v-if="show_end_date"
          prop="end_date"
          sortable="custom"
        >
          <template slot-scope="scope">
            <el-date-picker
              v-model="end_date"
              type="date"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'end_date')"
              @change="showEditIcon(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
              placeholder="点击选择"
            />
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'end_date')"
            >{{scope.row.end_date|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
        :key="9"
          label="执行人" 
          v-if="show_executor"
          :filters="columnSelect2"
          column-key="executor"
          @change="showEditIcon(scope.$index,scope.row)"
          align="center" 
          width="70px"
        >
          <template slot-scope="scope">
            <template  v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'executor')">
              <el-select
              v-model="scope.row.executor"
              multiple
              @blur="showEditIcon(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
              placeholder="请选择"
              value-key="id"
            >
              <el-option
                v-for="(item,index) in executorList"
                :key="index"
                :label="item.name"
                :value="item"
              ></el-option>
            </el-select>
            
            </template>
            <template v-else>{{scope.row.executor|executorFilter}}</template>
          </template>
        </el-table-column>
        <!-- 状态的颜色展示 -->
        <el-table-column :key="10" width="30px" v-if="show_status">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="任务状态：暂停" placement="top">
              <el-card
                v-if="scope.row.status === 0"
                :style="{width:'10px',backgroundColor:'#F9ce8c',border:'0px',padding: '30px 5px'}"
              ></el-card>
            </el-tooltip>
            <el-tooltip effect="dark" content="任务状态：未开始" placement="top">
              <el-card
                v-if="scope.row.status === 1"
                :style="{width:'10px',backgroundColor:'#59e0e8',border:'0px',padding: '30px 5px'}"
              ></el-card>
            </el-tooltip>
            <el-tooltip effect="dark" content="任务状态：进行中" placement="top">
              <el-card
                v-if="scope.row.status === 2"
                :style="{width:'10px',backgroundColor:'#589BAD',border:'0px',padding: '30px 5px'}"
              ></el-card>
            </el-tooltip>
            <el-tooltip effect="dark" content="任务状态：审核中" placement="top">
              <el-card
                v-if="scope.row.status === 3"
                :style="{width:'10px',backgroundColor:'#2D5637',border:'0px',padding: '30px 5px'}"
              ></el-card>
            </el-tooltip>
            <el-tooltip effect="dark" content="任务状态：完成" placement="top">
              <el-card
                v-if="scope.row.status === 4"
                :style="{width:'10px',backgroundColor:'#2f5c85',border:'0px',padding: '30px 5px'}"
              ></el-card>
            </el-tooltip>
            <el-tooltip effect="dark" content="任务状态：超时" placement="top">
              <el-card
                v-if="scope.row.status === 5"
                :style="{width:'10px',backgroundColor:'#C64b2b',border:'0px',padding: '30px 5px'}"
              ></el-card>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
        :key="11"
          label="状态"
          prop="status"
          v-if="show_status"
          width="140px"
          align="left"
          sortable="custom"
          column-key="status"
          :filters="[{text: '暂停', value: '0'}, {text: '未开始', value: '1'}, {text: '进行中', value: '2'}, {text: '审核中', value: '3'}, {text: '完成', value: '4'}, {text: '超时', value: '5'}, {text: '反馈中', value: '6'}]"
        >
          <template slot-scope="scope">
            {{scope.row.status|taskStatus}}
            <el-progress
              :stroke-width="12"
              :percentage="scope.row.schedule"
              v-if="scope.row.status != 3 && scope.row.status != 4"
            ></el-progress>
            <div v-if="scope.row.status == 3">{{scope.row.statements}}</div>
          </template>
        </el-table-column>
        <el-table-column :key="12" label="提交次数" prop="submit_num"  :min-width="35"></el-table-column>
        <el-table-column
        :key="13"
          prop="priority"
          label="优先级"
          :formatter="Priority"
          v-if="show_priority"
          width="90px"
          sortable="custom"
          align="center"
          column-key="priority"
          :filters="[{text: '低', value: '0'}, {text: '中', value: '1'}, {text: '高', value: '2'}]"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.priority"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'priority')"
              @change="showEditIcon(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <el-option label="低" :value="0"></el-option>
              <el-option label="中" :value="1"></el-option>
              <el-option label="高" :value="2"></el-option>
            </el-select>
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'priority')"
            >{{scope.row.priority|taskPriority}}</span>
          </template>
        </el-table-column>
        <el-table-column
        :key="14"
          prop="grade"
          label="难度"
          :formatter="Grade"
          v-if="show_grade"
          width="100px"
          sortable="custom"
          align="center"
          column-key="grade"
          :filters="[{text: 'A+', value: '0'}, {text: 'A', value: '1'}, {text: 'A-', value: '2'},
           {text: 'B+', value: '3'}, {text: 'B', value: '4'}, {text: 'B-', value: '5'}, 
           {text: 'C+', value: '6'}, {text: 'C', value: '7'}, {text: 'D+', value: '8'}, 
           {text: 'D', value: '9'}, {text: 'E', value: '10'}]"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.grade"
              placeholder="请选择难度"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'grade')"
              @change="showEditIcon(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <el-option
                v-for="item of LevelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'grade')"
            >{{scope.row.grade|taskgrade}}</span>
          </template>
        </el-table-column>
        <el-table-column
        :key="15"
          label="开始日期"
          width="85px"
          v-if="show_start_date"
          prop="start_date"
          sortable="custom"
        >
          <template slot-scope="scope">
            <el-date-picker
              v-model="start_date"
              type="date"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'start_date')"
              @change="showEditIcon(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
              placeholder="点击选择"
            />
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'start_date')"
            >{{scope.row.start_date|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
        :key="16"
          :render-header="renderheader"
          prop="total_hour"
          align="center"
          label="预设时间(h)"
          width="40px"
          v-if="show_total_hour"
        ></el-table-column>
        <el-table-column
        :key="17"
          label="最后提交时间"
          header-align="left"
          width="60px"
          :render-header="renderheader"
        >
          <template slot-scope="scope">{{scope.row.latest_submit_time|dateFormat}}</template>
        </el-table-column>
         <el-table-column :key="18" label="操作" align="center" v-if="authTask">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="添加子任务" placement="top">
              <span>
                <i
                  type="primary"
                  class="el-icon-plus"
                  style="color:red"
                  @click="openDialog(2,scope.row)"
                ></i>
              </span>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改任务" placement="top">
              <el-button
                class="el-icon-edit"
                type="text"
                style="color:blue"
                @click="openDialog(3,scope.row)"
                v-if="!editing||clickId !== scope.row.id"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="确认" placement="top">
              <el-button
                v-if="editing&&clickId === scope.row.id"
                type="text"
                icon="el-icon-check"
                style="color:green"
                @click="saveEdit(scope.$index,scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :key="19" label="任务ID"  prop="id" width="80px" sortable="custom">
          <template slot-scope="scope">
            <span >{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column
        :key="20"
          prop="name"
          label="任务名称" 
          v-if="show_name"
          sortable="custom"
          width="100px"
        >
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.name"
              placeholder="请输入"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'name')"
              @change="showEditIcon"
              @blur="saveEdit(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <span>{{scope.row.name?scope.row.name:"-"}}</span>
            </el-input>
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'name')"
            >{{scope.row.name?scope.row.name:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column
        :key="21"
          label="创建日期"
          width="100px"
          v-if="show_create_time"
          prop="date"
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <!-- <el-table-column
          label="状态"
          prop="status"
          v-if="show_status"
          width="160px"
          align="left"
          sortable="custom"
          column-key="status"
          :filters="[{text: '暂停', value: '0'}, {text: '未开始', value: '1'}, {text: '进行中', value: '2'}, {text: '审核中', value: '3'}, {text: '完成', value: '4'}, {text: '超时', value: '5'}, {text: '审核通过', value: '6'}]"
        >
          <template slot-scope="scope">
            <el-progress :stroke-width="12" :percentage="scope.row.schedule?scope.row.schedule:0"></el-progress>
          </template>
        </el-table-column>-->
        <el-table-column :key="22" label="创建者" v-if="show_creator_name" prop="user" link_dept_name>
          <template slot-scope="scope">{{scope.row.creator.name}}</template>
        </el-table-column>
        <!-- <el-table-column
          label="任务进度"
          width="100px"
          align="center"
          v-if="show_schedule"
          prop="schedule"
        >
          <template slot-scope="scope">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.schedule"></el-progress>
          </template>
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

    <!-- 主任务创建 -->
    <el-dialog title="主任务创建" :visible.sync="mainTaskShow" width="490px" ref="mainTask">
      <el-steps :active="active" finish-status="success">
        <el-step title="所属资产"></el-step>
        <el-step title="所属环节"></el-step>
        <el-step title="任务详情"></el-step>
      </el-steps>
      <el-form :model="TaskForm" :rules="rules" ref="TaskRef" label-width="100px">
        <div v-if="active == 0" style="padding-top:10px">
          <el-form-item label="所属资产">
            <el-select
              v-model="TaskForm.asset"
              filterable
              placeholder="请选择所属资产"
              @change="changeAsset()"
            >
              <el-option
                v-for="item of AssetListTask"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="active==1&&LinkList.length" style="padding-top:10px">
          <el-form-item label="所属环节">
            <el-select v-model="TaskForm.link_id" filterable placeholder="请选择所属环节">
              <el-option
                v-for="item of LinkList"
                :label="item.dept.name"
                :value="item.link_id"
                :key="item.link_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="active==1&&LinkList.length===0" style="padding-top:10px">
          <el-row style="display:flex;justify-content:center">
            <svg-icon icon-class="warn" style="width:40px;height:40px;"></svg-icon>
          </el-row>
          <el-row style="display:flex;justify-content:center;padding-top:10px">
            <span>当前资产没有环节，请创建</span>
          </el-row>
          <el-row style="display:flex;justify-content:center;padding-top:10px">
            <el-button type="primary" @click="addLink(TaskForm.asset)">创建环节</el-button>
          </el-row>
        </div>
        <div v-if="active==2" style="padding-top:10px">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="TaskForm.name" placeholder="请填写任务名称" @input="change($event)"></el-input>
          </el-form-item>
          <el-form-item label="任务内容" prop="content">
            <el-input type="textarea" v-model="TaskForm.content" @input="change($event)"></el-input>
          </el-form-item>
          <el-form-item label="优先级" prop="priority">
            <!-- <el-input v-model="TaskForm.code"></el-input> -->
            <el-radio v-model="TaskForm.priority" :label="0">低</el-radio>
            <el-radio v-model="TaskForm.priority" :label="1">中</el-radio>
            <el-radio v-model="TaskForm.priority" :label="2">高</el-radio>
          </el-form-item>
          <el-form-item label="任务难度" prop="grade">
            <el-row>
              <el-col :span="5">
                <el-radio v-model="updateMulTask.grade" :label="0">A+</el-radio>
              </el-col>
              <el-col :span="5">
                <el-radio v-model="updateMulTask.grade" :label="1">A</el-radio>
              </el-col>
              <el-col :span="5">
                <el-radio v-model="updateMulTask.grade" :label="2">A-</el-radio>
              </el-col>
              <el-col :span="5">
                <el-radio v-model="updateMulTask.grade" :label="3">B+</el-radio>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-radio v-model="updateMulTask.grade" :label="4">B</el-radio>
              </el-col>
              <el-col :span="5">
                <el-radio v-model="updateMulTask.grade" :label="5">B-</el-radio>
              </el-col>
              <el-col :span="5">
                <el-radio v-model="updateMulTask.grade" :label="6">C+</el-radio>
              </el-col>
              <el-col :span="5">
                <el-radio v-model="updateMulTask.grade" :label="7">C</el-radio>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-radio v-model="updateMulTask.grade" :label="8">D+</el-radio>
              </el-col>
              <el-col :span="5">
                <el-radio v-model="updateMulTask.grade" :label="9">D</el-radio>
              </el-col>
              <el-col :span="5">
                <el-radio v-model="updateMulTask.grade" :label="10">E</el-radio>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="任务状态" prop="status">
            <el-select v-model="TaskForm.status" filterable placeholder="请选择任务状态">
              <el-option
                v-for="item of StatusList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <template v-if="$route.query.type == 0">
            <el-form-item label="执行小组" prop="group_id"
            :rules="[{ required: true, message: '请输入执行小组', trigger: 'blur' }]"
            >
              <el-select v-model="TaskForm.group_id" filterable placeholder="请选择分组">
                <el-option
                  v-for="(item,index) of trainingMenber"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="任务执行人" prop="executorlist"
            :rules="[{ required: true, message: '请输入任务执行人', trigger: 'blur' }]"
            >
              <el-select v-model="TaskForm.executorlist" filterable multiple placeholder="请选择任务执行人">
                <el-option
                  v-for="item of DeptUsers"
                  :label="item.username"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="环节时间">
            <el-row style="padding-left:10px;font-size: 12px;">
              <el-col :span="5">{{linkstart|dateFormat}}</el-col>
              <el-col :span="2">
                <span>至</span>
              </el-col>
              <el-col :span="17">{{linkend|dateFormat}}</el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="任务时间" prop="datetime">
            <el-date-picker
              v-model="TaskForm.datetime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy/MM/dd"
              @change="changeTime()"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="总工时" prop="total_hour">
            <el-input v-model="TaskForm.total_hour" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="cancel2">取消</el-button>
            <el-button type="primary" @click="editMainTask">立即创建</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-button style="margin-top: 12px;" @click="before" v-if="active !=0">上一步</el-button>
      <el-button
        style="margin-top: 12px;"
        @click="next"
        v-if="active !=2"
        :disabled="(active==1&&LinkList.length===0)||active==0&&!this.TaskForm.asset||active==1&&!this.TaskForm.link_id"
      >下一步</el-button>
    </el-dialog>
    <!-- 子任务创建，任务修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="isDialogShow" width="490px">
      <el-form :model="TaskForm" :rules="rules" ref="TaskRef" label-width="100px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="TaskForm.name" placeholder="请填写任务名称"></el-input>
        </el-form-item>
        <el-form-item label="任务内容" prop="content">
          <el-input type="textarea" :rows="3" v-model="TaskForm.content" placeholder="请填写任务内容"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <!-- <el-input v-model="TaskForm.code"></el-input> -->
          <el-radio v-model="TaskForm.priority" :label="0">低</el-radio>
          <el-radio v-model="TaskForm.priority" :label="1">中</el-radio>
          <el-radio v-model="TaskForm.priority" :label="2">高</el-radio>
        </el-form-item>
        <el-form-item label="任务难度" prop="grade">
          <el-row>
            <el-col :span="5">
              <el-radio v-model="updateMulTask.grade" :label="0">A+</el-radio>
            </el-col>
            <el-col :span="5">
              <el-radio v-model="updateMulTask.grade" :label="1">A</el-radio>
            </el-col>
            <el-col :span="5">
              <el-radio v-model="updateMulTask.grade" :label="2">A-</el-radio>
            </el-col>
            <el-col :span="5">
              <el-radio v-model="updateMulTask.grade" :label="3">B+</el-radio>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-radio v-model="updateMulTask.grade" :label="4">B</el-radio>
            </el-col>
            <el-col :span="5">
              <el-radio v-model="updateMulTask.grade" :label="5">B-</el-radio>
            </el-col>
            <el-col :span="5">
              <el-radio v-model="updateMulTask.grade" :label="6">C+</el-radio>
            </el-col>
            <el-col :span="5">
              <el-radio v-model="updateMulTask.grade" :label="7">C</el-radio>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-radio v-model="updateMulTask.grade" :label="8">D+</el-radio>
            </el-col>
            <el-col :span="5">
              <el-radio v-model="updateMulTask.grade" :label="9">D</el-radio>
            </el-col>
            <el-col :span="5">
              <el-radio v-model="updateMulTask.grade" :label="10">E</el-radio>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="TaskForm.status" filterable placeholder="请选择任务状态">
            <el-option
              v-for="item of StatusList2"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务执行人">
          <el-select v-model="TaskForm.executorlist" filterable multiple placeholder="请选择任务执行人">
            <el-option
              v-for="item of DeptUsers"
              :label="item.username"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属资产" prop="asset">
          <el-select v-model="TaskForm.asset" filterable placeholder="请选择所属资产">
            <el-option
              v-for="item of AssetList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
              :disabled="DialogType===2||!TaskForm.asset"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务时间" prop="datetime">
          <el-date-picker
            v-model="TaskForm.datetime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy/MM/dd"
            @change="changeTime()"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="总工时" prop="total_hour">
          <el-input v-model="TaskForm.total_hour" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button
            :loading="buttonStates.createLoading"
            type="primary"
            @click="editTask"
          >{{DialogType===3?'立即修改':'立即创建'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 创建任务时，所选资产无环节时，创建环节 -->
    <el-dialog title="添加环节" :visible.sync="isLinkDialogShow" width="512px" center :modal="false">
      <el-row type="flex" align="middle" v-for="(item,index) of FormList" :key="index">
        <el-col :span="4">
          <el-button type="text" icon="el-icon-plus" @click="before(index)">前置</el-button>
          <el-avatar>{{index+1}}</el-avatar>
          <el-button type="text" icon="el-icon-plus" @click="after(index)">后续</el-button>
        </el-col>
        <el-col :span="18">
          <el-form :model="item" label-width="90px">
            <el-form-item
              label="环节内容"
              prop="content"
              :rules="[{ required: true, message: '请输入环节内容', trigger: 'blur' }]"
            >
              <el-input
                type="textarea"
                v-model="item.content"
                style="width:100%"
                @input="change($event)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="当前工种"
              prop="dept"
              :rules="[{ required: true, message: '请输入当前工种', trigger: 'blur' }]"
            >
              <el-cascader
                v-model="item.dept"
                placeholder="输入搜索工种"
                :options="selectList"
                :props="{ checkStrictly: true}"
                filterable
                style="width:100%"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="时间" prop="datetime">
              <el-date-picker
                v-model="item.datetime"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:100%"
                format="yyyy/MM/dd"
              ></el-date-picker>
            </el-form-item>
          </el-form>
          <el-divider />
        </el-col>
        <el-col :span="4" align="center">
          <el-tooltip effect="dark" content="删除" placement="top">
            <span>
              <i class="el-icon-delete" style="color:red" @click="deleteLink(index)"></i>
            </span>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-button @click="cancel">取消</el-button>
        <el-button :loading="createLoading" type="primary" @click="addLinks()">立即创建</el-button>
      </el-row>
    </el-dialog>
    <!-- 任务导出 -->
    <el-dialog title="Excel文件导出" :visible.sync="uploadVisible" width="400px" hieght="300px">
      <el-row>
        <el-col :span="6">
          <span>excel文件</span>
        </el-col>
        <el-col :span="18">
          <span @click="download" style="cursor:pointer;color:#2d8cf0">{{"点击下载"}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadExcel">确定</el-button>
      </span>
    </el-dialog>
    <!-- 批量修改任务 -->
    <el-dialog title="批量修改任务" :visible.sync="mulEditDialog" width="620px" center :modal="false">
      <el-form :model="updateMulTask" label-width="90px">
        <el-row>
          <el-col :span="20" style="padding-left:35px">
            <el-row>
              <el-col :span="8">
                <h4 style="padding-bottom:10px">是否修改</h4>
              </el-col>
              <el-col :span="16">
                <div style="font-size:12px">
                  <span style="font-weight:bold">任务难度:</span>A+ ----> E 难---->易，默认为中等等级
                </div>
              </el-col>
            </el-row>
          </el-col>
          <!-- <el-col :span="4" align="center"></el-col> -->
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value1"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
              @change="changelist"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="updateMulTask.name" placeholder="请填写任务名称" :disabled="disabled1"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value2"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
              @change="changelist"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务内容" prop="content">
              <el-input
                v-model="updateMulTask.content"
                type="textarea"
                placeholder="请填写任务内容"
                :disabled="disabled2"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value3"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
              @change="changelist"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="优先级" prop="priority">
              <el-radio v-model="updateMulTask.priority" :label="0" :disabled="disabled3">低</el-radio>
              <el-radio v-model="updateMulTask.priority" :label="1" :disabled="disabled3">中</el-radio>
              <el-radio v-model="updateMulTask.priority" :label="2" :disabled="disabled3">高</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value4"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
              @change="changelist"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务难度" prop="grade">
              <el-row>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.grade" :label="0" :disabled="disabled4">A+</el-radio>
                </el-col>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.grade" :label="1" :disabled="disabled4">A</el-radio>
                </el-col>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.grade" :label="2" :disabled="disabled4">A-</el-radio>
                </el-col>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.grade" :label="3" :disabled="disabled4">B+</el-radio>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.grade" :label="4" :disabled="disabled4">B</el-radio>
                </el-col>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.grade" :label="5" :disabled="disabled4">B-</el-radio>
                </el-col>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.grade" :label="6" :disabled="disabled4">C+</el-radio>
                </el-col>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.grade" :label="7" :disabled="disabled4">C</el-radio>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.grade" :label="8" :disabled="disabled4">D+</el-radio>
                </el-col>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.grade" :label="9" :disabled="disabled4">D</el-radio>
                </el-col>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.grade" :label="10" :disabled="disabled4">E</el-radio>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value5"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
              @change="changelist"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务状态" prop="status">
              <el-select v-model="updateMulTask.status" filterable placeholder="请选择任务状态">
                <el-option
                  v-for="item of StatusList2"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                  :disabled="disabled5"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value6"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
              @change="changelist"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务执行人" prop="executorlist">
              <el-select
                v-model="updateMulTask.executorlist"
                filterable
                multiple
                placeholder="请选择任务执行人"
              >
                <el-option
                  v-for="item of UserList"
                  :label="item.username"
                  :value="item.id"
                  :key="item.id"
                  :disabled="disabled6"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value7"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
              @change="changelist"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务时间" prop="datetime">
              <el-date-picker
                v-model="updateMulTask.datetime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy/MM/dd"
                :disabled="disabled7"
                @change="changeTime2()"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value8"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
              @change="changelist"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="总工时" prop="total_hour">
              <el-input
                v-model="updateMulTask.total_hour"
                :disabled="disabled8"
                oninput="value=value.replace(/[^\d.]/g,'')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col align="right">
            <el-button type="primary" @click="mulEditTasks(2)">立即修改</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 展示列保存说明 -->
    <el-dialog title="注意事项" :visible.sync="SaveDialogVisible" width="365px">
      <div style="padding:0px 5px 20px;">
        <div style="font-size:12px">
          <h3>点击“记住选择列”后：</h3>
          <div style="padding-top:2px">
            <span style="font-weight:bold">1：</span>
            所有项目中都会展示选择的列
          </div>
          <div style="padding-top:2px">
            <span style="font-weight:bold">2：</span>
            刷新之后，仍然会展示选择的列
          </div>
          <div style="padding-top:2px">
            <span style="font-weight:bold">3：</span>
            重新登录之后，仍然会展示选择的列
          </div>
          <div style="padding-top:2px">
            <span style="font-weight:bold">4：</span>
            在不同客户端中，仍然会展示选择的列
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 打开任务侧栏 -->
    <Drawer
      title="任务"
      scrollable
      closable
      v-model="showdrawer"
      width="526"
      :inner="isInner"
      :transfer="false"
      :mask="false"
      draggable
      ref="drawer-parent"
    >
      <taskDrawer ref="taskDrawer" />
    </Drawer>
    <!-- 打开资产侧栏 -->
    <Drawer
      scrollable
      closable
      v-model="assetShow"
      width="526"
      :transfer="false"
      :mask="false"
      :inner="isInner"
      ref="drawer-parent"
    >
      <assetDrawer :authAsset="authAsset" @refresh_assetList="getAssetList" ref="assetDrawer" />
    </Drawer>
  </div>
</template>
<script src="./tab-task.js">
</script>

<style lang="scss">
#task {
  min-height: calc(100vh - 199px);
  .links {
    cursor: pointer;
    color: #2d8cf0;
  }
}

.el-switch__core {
  height: 15px;
  width: 33px !important;
}
.el-switch__core:after {
  top: -1px;
  left: -1px;
  margin-right: -10px;
  width: 14px;
  height: 14px;
  box-shadow: 1px 1px 1px black;
  background-color: white;
}
.el-switch__label * {
  line-height: 1;
  font-size: 10px;
  display: inline-block;
}
.el-switch.is-checked .el-switch__core::after {
  margin-left: -14px;
  box-shadow: 1px 1px 1px black;
  background-color: white;
}
.el-table--mini td {
  padding: 0px 0;
}
.el-table td {
  .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
}
.el-table th {
  .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
}
.el-card {
  border-radius: 0px;
}
.btn-explain{
        padding-left:10px;
        font-size:12px;
        color:#808080;
        cursor: pointer;
      }
</style>

