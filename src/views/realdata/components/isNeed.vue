<!--  -->
<template>
  <div id="isNeed">
    <div>
      <el-row :gutter="24" style="padding-bottom:15px;">
        <el-col :span="16" style="padding-bottom:15px;">
          <el-button
            type="success"
            @click="mulEditTasks(1)"
            icon="el-icon-edit"
            :disabled="this.multipleSelection.length === 0"
          >批量修改</el-button>
        </el-col>
        <el-col :span="8" align="right">
          <el-row type="flex" justify="end">
            <!-- 单条件筛选 -->
            <assetSel ref="assetSel" @refreshAssetList="getAssetList" />
            <!-- 多条件筛选 -->
            <assetMulSel
              ref="assetMulSel"
              @refresh_sortMul="MulSel"
              @filterCondition="filterCondition"
              @selRefresh="selRefresh"
            />
            <el-button @click="getAssetList(1)" type="primary" style="margin-left: 15px">重置</el-button>
          </el-row>
        </el-col>
      </el-row>
      <assetFilter ref="assetFilter" @refresh_close="closeSelectedTag" />
    </div>
    <el-table
      ref="sceneNeed"
      :data="scene"
      :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
      :row-style="{height:50}"
      highlight-current-row
      :row-key="(row)=>{ return row.id}"
      @selection-change="handleSelectionChange"
      :border="false"
      v-loading="tableLoading"
      :cell-style="cellStyle"
      @cell-dblclick="editCell"
    >
      <el-table-column type="selection" :reserve-selection="true" width="50px" align="right"></el-table-column>
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="项目名称" class-name="links">
        <template slot-scope="scope">
          <router-link
            :to="{name:'project-detail',params:{id:scope.row.project_id},query:{type:scope.row.project_type}}"
          >{{scope.row.project_name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="镜头号" prop="asset_name" width="120px">
        <template slot-scope="scope">
          <span @click="showDrawer(scope.row)">{{scope.row.asset_name?scope.row.asset_name:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="缩略图" prop="image" width="180px">
        <template slot-scope="scope">
          <el-image
            :src="$store.state.BASE_URL+scope.row.image"
            style="width: 160px; height: 90px;cursor: pointer; display:block;"
            :preview-src-list="[$store.state.BASE_URL+scope.row.image]"
          >
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture" style="color:#909399"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="session" label="场次" align="center" column-key="session">
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.session"
            placeholder="请输入场次"
            v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol=='session')"
            @change="showEditIcon"
            @keyup.enter.native="saveEdit(scope.$index,scope.row)"
          >
            <span>{{scope.row.session?scope.row.session:"-"}}</span>
          </el-input>
          <span
            v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol!='session')"
          >{{scope.row.session?scope.row.session:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="episode" label="集数" align="center">
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.episode"
            placeholder="请输入集数"
            v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'episode')"
            @change="showEditIcon"
            @keyup.enter.native="saveEdit(scope.$index,scope.row)"
          >
            <span>{{scope.row.episode?scope.row.episode:"-"}}</span>
          </el-input>
          <span
            v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'episode')"
          >{{scope.row.episode?scope.row.episode:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="frame" label="帧数" align="left">
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.frame"
            placeholder="请输入帧数"
            v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'frame')"
            @change="showEditIcon"
            @keyup.enter.native="saveEdit(scope.$index,scope.row)"
          >
            <span>{{scope.row.frame?scope.row.frame:"-"}}</span>
          </el-input>
          <span
            v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'frame')"
          >{{scope.row.frame?scope.row.frame:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="frame_range" label="帧数范围" align="left" width="120px">
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.frame_range"
            placeholder="请输入帧数范围"
            v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'frame_range')"
            @change="showEditIcon"
            @keyup.enter.native="saveEdit(scope.$index,scope.row)"
          ></el-input>
          <span
            v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'frame_range')"
          >{{scope.row.frame_range?scope.row.frame_range:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pro_reference" label="制作参考" align="left" width="120px">
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.pro_reference"
            placeholder="请输入制作参考内容"
            v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'reference')"
            @change="showEditIcon"
            @keyup.enter.native="saveEdit(scope.$index,scope.row)"
          >
            <span>{{scope.row.pro_reference?scope.row.pro_reference:"-"}}</span>
          </el-input>
          <span
            v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'reference')"
          >{{scope.row.pro_reference?scope.row.pro_reference:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="report" label="画面调整信息" align="left" width="120px">
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.report"
            placeholder="请输入画面调整信息"
            v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'report')"
            @change="showEditIcon"
            @keyup.enter.native="saveEdit(scope.$index,scope.row)"
          >
            <span>{{scope.row.report?scope.row.report:"-"}}</span>
          </el-input>
          <span
            v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'report')"
          >{{scope.row.report?scope.row.report:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="retime" label="变速信息" align="left">
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.retime"
            placeholder="请输入变速信息"
            v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'retime')"
            @change="showEditIcon"
            @keyup.enter.native="saveEdit(scope.$index,scope.row)"
          >
            <span>{{scope.row.retime?scope.row.retime:"-"}}</span>
          </el-input>
          <span
            v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'retime')"
          >{{scope.row.retime?scope.row.retime:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="制作内容" align="left">
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.content"
            placeholder="请输入制作内容"
            v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'content')"
            @change="showEditIcon"
            @keyup.enter.native="saveEdit(scope.$index,scope.row)"
          ></el-input>
          <span style="white-space: pre-line;" v-else>{{scope.row.content?scope.row.content:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.priority"
            v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'priority')"
            @keyup.enter.native="saveEdit(scope.$index,scope.row)"
          >
            <el-option label="正常" :value="0"></el-option>
            <el-option label="优先" :value="1"></el-option>
          </el-select>
          <span
            v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'priority')"
          >{{scope.row.priority|Priority}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="难度">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.level"
            placeholder="请选择难度"
            v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'level')"
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
            v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'level')"
          >{{scope.row.level|Level}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="active?'未分配环节':'已分配环节'" align="center" width="180px">
        <el-table-column prop="link" label="工种" align="left" width="100px">
          <template slot-scope="scope">
            <div v-if="active=='true'">
              <div v-for="(todo,index) of scope.row.not_allcoted_link" :key="index">
                {{todo.dept_name}}
                <el-tooltip effect="dark" content="添加任务" placement="top">
                  <span>
                    <i
                      type="primary"
                      class="el-icon-plus"
                      style="color:blue"
                      @click="showTaskForm(
                        todo.link_id,todo.dept_id,scope.row.content,null,
                        scope.row.asset_id,scope.row.asset_name,todo.dept_date_start,todo.dept_date_end)"
                    ></i>
                  </span>
                </el-tooltip>
              </div>
            </div>
            <div v-else>
              <div v-for="(todo,index) of scope.row.allcoted_link" :key="index">{{todo.dept_name}}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="截止日期" align="left" width="95px">
          <template slot-scope="scope">
            <div v-if="active=='true'">
              <div
                v-for="(todo,index) of scope.row.not_allcoted_link"
                :key="index"
                style="position:top"
              >{{todo.dept_date_end|dateFormat}}</div>
            </div>
            <div v-else>
              <div
                v-for="(todo,index) of scope.row.allcoted_link"
                :key="index"
                style="position:top"
              >{{todo.dept_date_end|dateFormat}}</div>
            </div>
          </template>
          <!-- <template slot-scope="scope">
            <div
              v-for="(todo,index) of scope.row.allcoted_link"
              :key="index"
              style="position:top"
            >{{todo.dept_date_end|dateFormat}}</div>
          </template>-->
        </el-table-column>
      </el-table-column>
      <el-table-column label="创建日期" align="left" width="160px" prop="date">
        <template slot-scope="scope">{{scope.row.create_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column label="截止日期" align="left" width="160px" prop="date">
        <template slot-scope="scope">{{scope.row.total_date_end|dateFormat}}</template>
      </el-table-column>

      <el-table-column prop="total_hours" label="总工时" align="left"></el-table-column>
      <el-table-column prop="remark" label="备注" align="left">
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.remark"
            placeholder="请输入备注"
            v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'remark')"
            @change="showEditIcon"
            @keyup.enter.native="saveEdit(scope.$index,scope.row)"
          >
            <p v-html="scope.row.remark"></p>
          </el-input>
          <span
            v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'remark')"
          >
            <p v-html="scope.row.remark"></p>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="修改" placement="top">
            <el-button
              @click="editOneAsset(scope.row,scope.$index)"
              icon="el-icon-edit"
              type="text"
              style="color:blue"
              v-if="!editing||clickId !== scope.row.id"
            />
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

    <Drawer
      ref="parent-drawer"
      scrollable
      closable
      v-model="value1"
      width="526"
      :transfer="false"
      :mask="false"
      :inner="isInner"
      title="环节"
    >
      <div style="display:flex;overflow:auto">
        <el-steps
          direction="vertical"
          :active="1"
          style="width:250px;display:flex；justify-content:flex-start"
          v-for="(todo,Index) of link"
          :key="Index"
        >
          <el-step v-for="item of todo" :key="item.link_id" status="process" style="width:250px">
            <div slot="title" style="font-size:14px;display:flex;justify-content:flex-start">
              {{item.dept.name}}
              <template
                v-if="deptList.filter(todo=>{  return todo.id === item.dept.id}).length"
              >
                <el-tooltip effect="dark" content="添加任务" placement="top">
                  <span style="padding-left:5px">
                    <i
                      class="el-icon-plus"
                      style="color:blue"
                      @click="showTaskForm(item.link_id,item.dept.id,item.content,item.date_and_user,null,null,null,null)"
                    ></i>
                  </span>
                </el-tooltip>
              </template>
            </div>
            <ul slot="description" style="width:250px;">
              <li>制作要求: {{item.content}}</li>
              <template>
                <li>开始日期: {{item.date_and_user.date_start|dateFormat}}</li>
                <li>截止日期: {{item.date_and_user.date_end|dateFormat}}</li>
              </template>
            </ul>
          </el-step>
        </el-steps>
      </div>
    </Drawer>

    <!-- 添加任务 -->
    <el-dialog title="添加任务" :visible.sync="isCreateTaskShow" width="512px" center :modal="false">
      <el-form :model="TaskForm" :rules="rules" ref="TaskForm" label-width="100px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="TaskForm.name" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="任务内容" prop="content">
          <el-input type="textarea" :rows="3" v-model="TaskForm.content" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <!-- <el-input v-model="TaskForm.code"></el-input> -->
          <el-radio v-model="TaskForm.priority" :label="0">低</el-radio>
          <el-radio v-model="TaskForm.priority" :label="1">中</el-radio>
          <el-radio v-model="TaskForm.priority" :label="2">高</el-radio>
        </el-form-item>
        <el-form-item label="任务难度" prop="grade">
          <!-- <el-input v-model="TaskForm.code"></el-input> -->
          <el-radio v-model="TaskForm.grade" :label="0">A+</el-radio>
          <el-radio v-model="TaskForm.grade" :label="1">A</el-radio>
          <el-radio v-model="TaskForm.grade" :label="2">A-</el-radio>
          <el-radio v-model="TaskForm.grade" :label="3">B+</el-radio>
          <el-radio v-model="TaskForm.grade" :label="4">B</el-radio>
          <el-radio v-model="TaskForm.grade" :label="5">B-</el-radio>
          <el-radio v-model="TaskForm.grade" :label="6">C+</el-radio>
          <el-radio v-model="TaskForm.grade" :label="7">C</el-radio>
          <el-radio v-model="TaskForm.grade" :label="8">D+</el-radio>
          <el-radio v-model="TaskForm.grade" :label="9">D</el-radio>
          <el-radio v-model="TaskForm.grade" :label="10">E</el-radio>
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
        <el-form-item label="任务执行人" prop="executorlist">
          <el-select v-model="TaskForm.executorlist" filterable multiple placeholder="请选择执行人">
            <el-option
              v-for="item of DeptUsers"
              :label="item.username"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="环节时间">
          <el-row style="padding-left:10px;font-size: 12px;">
            <el-col :span="6">{{linkstart|dateFormat}}</el-col>
            <el-col :span="3">
              <span>至</span>
            </el-col>
            <el-col :span="15">{{linkend|dateFormat}}</el-col>
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
          <el-button @click="cancelTask">取消</el-button>
          <el-button :loading="createTaskLoading" type="primary" @click="addTasks">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 批量修改资产 -->
    <el-dialog title="批量修改资产" :visible.sync="mulEditDialog" width="620px" top="5vh">
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
        </el-row>

        <!-- 制作内容 -->
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="changeContent"
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
            <el-form-item label="制作内容" prop="content">
              <el-input
                v-model="updateMulTask.content"
                type="textarea"
                placeholder="请填写制作内容"
                :disabled="disableContent"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 场次 -->
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="changeSession"
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
            <el-form-item label="场次" prop="session">
              <el-input
                v-model="updateMulTask.session"
                placeholder="请填写场次"
                :disabled="disableSession"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 帧数 -->
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="changeFrame"
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
            <el-form-item label="帧数" prop="frame">
              <el-input v-model="updateMulTask.frame" placeholder="请填写帧数" :disabled="disableFrame"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 帧数范围 -->
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="changeFrame_range"
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
            <el-form-item label="帧数范围" prop="frame_range">
              <el-input
                v-model="updateMulTask.frame_range"
                placeholder="请填写帧数范围"
                :disabled="disableFrame_range"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 集数 -->
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="changeEpisode"
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
            <el-form-item label="集数" prop="episode">
              <el-input
                v-model="updateMulTask.episode"
                placeholder="请填写集数"
                :disabled="disableEpisode"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 变速信息 -->
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="changeRetime"
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
            <el-form-item label="变速信息" prop="retime">
              <el-input
                v-model="updateMulTask.retime"
                placeholder="请填写变速信息"
                :disabled="disableRetime"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 画面调整信息 -->
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="changeReport"
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
            <el-form-item label="画面调整" prop="report">
              <el-input
                v-model="updateMulTask.report"
                placeholder="请填写画面调整信息"
                :disabled="disableReport"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 制作参考 -->
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="changePro_reference"
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
            <el-form-item label="制作参考" prop="pro_reference">
              <el-input
                v-model="updateMulTask.pro_reference"
                placeholder="请填写制作参考"
                :disabled="disablePro_reference"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 优先级 -->
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="changePriority"
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
              <el-radio v-model="updateMulTask.priority" :label="0" :disabled="disablePriority">正常</el-radio>
              <el-radio v-model="updateMulTask.priority" :label="1" :disabled="disablePriority">优先</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 难度等级 -->
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="changeLevel"
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
            <el-form-item label="难度等级" prop="level">
              <el-row>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.level" :label="0" :disabled="disableLevel">A+</el-radio>
                </el-col>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.level" :label="1" :disabled="disableLevel">A</el-radio>
                </el-col>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.level" :label="2" :disabled="disableLevel">A-</el-radio>
                </el-col>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.level" :label="3" :disabled="disableLevel">B+</el-radio>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.level" :label="4" :disabled="disableLevel">B</el-radio>
                </el-col>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.level" :label="5" :disabled="disableLevel">B-</el-radio>
                </el-col>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.level" :label="6" :disabled="disableLevel">C+</el-radio>
                </el-col>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.level" :label="7" :disabled="disableLevel">C</el-radio>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.level" :label="8" :disabled="disableLevel">D+</el-radio>
                </el-col>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.level" :label="9" :disabled="disableLevel">D</el-radio>
                </el-col>
                <el-col :span="5">
                  <el-radio v-model="updateMulTask.level" :label="10" :disabled="disableLevel">E</el-radio>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 资产时间 -->
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="changeTime2"
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
            <el-form-item label="资产时间" prop="datetime">
              <el-date-picker
                v-model="updateMulTask.datetime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy/MM/dd"
                :disabled="disableTime"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 备注 -->
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="changeRemark"
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
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="updateMulTask.remark"
                placeholder="请填写备注"
                :disabled="disableRemark"
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
  </div>
</template>
<script src="./isneed.js">
</script>

<style lang='scss' scoped>
</style>