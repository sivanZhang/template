<template>
  <div id="tab-assets" ref="drawer-parent">
    <div>
      <el-row :gutter="24">
        <el-col :span="16" style="padding-bottom:15px;">
          <template v-if="authAsset">
            <el-button icon="el-icon-plus" type="primary" @click="showAssetForm(1)">
              <slot name="add">添加资产</slot>
            </el-button>
            <el-button icon="el-icon-download" type="primary" @click="targetdownload">
              <slot name="import">资产导入</slot>
            </el-button>
            <el-button icon="el-icon-upload2" type="success" @click="targetUpload">
              <slot name="upload">资产导出</slot>
            </el-button>
            <el-button
              type="success"
              @click="mulEditTasks(1)"
              icon="el-icon-edit"
              :disabled="this.multipleSelection.length === 0"
            >批量修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="delMulAssets()"
              :disabled="this.multipleSelection.length === 0"
            >批量删除</el-button>
          </template>
          <el-popover
            placement="bottom"
            v-model="visible"
            width="300"
            trigger="click"
            style="margin-left:15px"
          >
            <el-col :span="12">
              <el-checkbox v-model="show_image">缩略图</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_session" v-if="(notShow == 'true' ?true:false)">场次</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_episode" v-if="(notShow == 'true' ?true:false)">集数</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_name">{{labelName}}</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_frame">帧数</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_frame_range">帧数范围</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_report" v-if="(notShow == 'true' ?true:false)">画面调整信息</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_retime" v-if="(notShow == 'true' ?true:false)">变速信息</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_inner_version">版本号</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_content">制作内容</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_priority">优先级</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_level">难度</el-checkbox>
            </el-col>
            
            <el-col :span="12">
              <el-checkbox v-model="show_small_status">小状态/进度</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_creator_name">创建人</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_link">当前环节</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_create_date">创建日期</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_start_date">开始日期</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_end_date">结束日期</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_totle_date_end">计划截止日期</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_total_hours">总工时</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_remark">备注</el-checkbox>
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
              <el-button type="primary" size="mini" @click="saveLongMenu">记住选择列</el-button>
            </el-col>
            <el-button slot="reference" type="primary" icon="el-icon-setting">展示列</el-button>
          </el-popover>
          <template>
            <assetSortMul @refresh="sortMul" style="margin-left:15px;width:100px" />
          </template>
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
      <el-table
        ref="assetTable"
        :height="curHeight"
        :data="AssetList"
        :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
        :cell-style="cellStyle"
        highlight-current-row
        @selection-change="handleSelectionChange"
        :row-key="(row)=>{ return row.id}"
        v-loading="tableLoading"
        @filter-change="filterHandler"
        @sort-change="sortFilter"
        border
        @cell-dblclick="editCell"
        @expand-change="expandShow"
        @row-click="show"
      >
        <el-table-column type="selection" :reserve-selection="true" width="50px" align="right"></el-table-column>
        <el-table-column type="expand" prop="expand" width="20px">
          <template slot-scope="props">
            <taskTable
              ref="taskTable"
              v-if="props.row.task_num != 0"
              style="margin-left:20px"
              @showDrawer="showDrawer"
            />
            <label for v-else>此镜头暂无任务</label>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          :label="labelName"
          align="left"
          width="110px"
          v-if="show_name"
          sortable="custom"
         
        >
          <template slot-scope="scope" style="display:flex">
            <el-input
              size="small"
              v-model="scope.row.name"
              placeholder="请输入"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'name')"
              @change="showEditIcon"
        
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <span>{{scope.row.name?scope.row.name:"-"}}</span>
            </el-input>
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'name')"
              
            >{{scope.row.name?scope.row.name:"-"}}</span>
             <el-tooltip effect="dark" content="取消" placement="top">
              <el-button
                v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'name')"
                type="text"
                icon="el-icon-circle-close"
                style="color:blue;padding-top:7px;"
                @click="cancleEdit(scope.$index,scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- <el-table-column type="index" :index="indexMethod" align="center" v-if="ind"></el-table-column> -->
        <el-table-column label="缩略图" align="center" v-if="show_image" width="180px">
          <template slot-scope="scope">
            <el-image
              :src="$store.state.BASE_URL+scope.row.image"
              style="width: 180px;height: 100px;cursor: pointer; display:block;"
              :preview-src-list="[$store.state.BASE_URL+scope.row.image]"
              v-if="!editing||clickId !== scope.row.id"
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
            <el-image
              :src="$store.state.BASE_URL+scope.row.image"
              style="width: 180px; height: 100px;cursor: pointer; display:block;"
              @click.native="img(scope.row)"
              v-if="editing&&clickId === scope.row.id"
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
        <el-table-column label="小状态/进度" prop="small_status" width="150px" v-if="show_small_status">
          <template slot-scope="scope">
            <div>
            <el-select
              v-model="scope.row.small_status"
              placeholder="请选择状态"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'small_status')"
              @change="showEditIcon(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <div v-if="scope.row.status === 0">
                <el-option
                  v-for="item of pause"
                  :key="item.value"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </div>
              <div v-if="scope.row.status === 1">
                <el-option
                  v-for="item of notstart"
                  :key="item.value"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </div>
              <div v-if="scope.row.status === 2">
                <el-option
                  v-for="item of conducting"
                  :key="item.value"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </div>
              <div v-if="scope.row.status === 3">
                <el-option
                  v-for="item of approving"
                  :key="item.value"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </div>
              <div v-if="scope.row.status === 4">
                <el-option
                  v-for="item of finish"
                  :key="item.value"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </div>
            </el-select>
            
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'small_status')"
            >{{scope.row.small_status|taskMinStatus}}</span>
            <el-progress :stroke-width="12" :percentage="scope.row.schedule"
            class="progress"
           ></el-progress>
            </div>
          </template>
        </el-table-column>
        <template v-if="groupType == 0?true:false">
          <el-table-column label="练习阶段" prop="groups" width="120px">
            <template slot-scope="scope">
              <el-row v-for="(item,index) of scope.row.groups" :key="index">
                <el-col>{{item}}</el-col>
              </el-row>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="任务数量" prop="task_num"   :render-header="renderheader" :min-width="30"></el-table-column>
        <el-table-column
          width="100px;"
          style="padding-left:100px;"
          prop="session"
          label="场次"
          align="center"
          v-if="show_session&&notShow == 'true'?true:false"
          sortable="custom"
          column-key="session"
          :filters="columnSelect1"
        >
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
             <el-tooltip effect="dark" content="取消" placement="top">
              <el-button
                v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'session')"
                type="text"
                icon="el-icon-circle-close"
                style="color:blue;"
                @click="cancleEdit(scope.$index,scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          width="100px;"
          prop="episode"
          label="集数"
          align="center"
          v-if="show_episode&&notShow == 'true'?true:false"
          sortable="custom"
          column-key="episode"
          :filters="columnSelect2"
        >
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
             <el-tooltip effect="dark" content="取消" placement="top">
              <el-button
                v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'episode')"
                type="text"
                icon="el-icon-circle-close"
                style="color:blue;"
                @click="cancleEdit(scope.$index,scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          width="100px;"
          prop="frame"
          label="帧数"
          align="left"
          v-if="show_frame&&notShow == 'true'?true:false"
          sortable="custom"
        >
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.frame"
              placeholder="请输入帧数"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'frame')"
              @change="showEditIcon"
              @blur="saveEdit(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <span>{{scope.row.frame?scope.row.frame:"-"}}</span>
            </el-input>
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'frame')"
            >{{scope.row.frame?scope.row.frame:"-"}}</span>
            <el-tooltip effect="dark" content="取消" placement="top">
              <el-button
                v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'frame')"
                type="text"
                icon="el-icon-circle-close"
                style="color:blue;"
                @click="cancleEdit(scope.$index,scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="frame_range"
          label="帧数范围"
          align="left"
          width="120px"
          v-if="show_frame_range&&notShow == 'true'?true:false"
        >
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
             <el-tooltip effect="dark" content="取消" placement="top">
              <el-button
                v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'frame_range')"
                type="text"
                icon="el-icon-circle-close"
                style="color:blue;"
                @click="cancleEdit(scope.$index,scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          prop="reference"
          label="制作参考"
          align="left"
          width="100px"
          v-if="show_frame_reference"
        >
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

        <el-table-column
          prop="report"
          label="画面调整信息"
          align="left"
          width="120px"
          v-if="show_report&&(notShow == 'true' ?true:false)"
        >
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
             <el-tooltip effect="dark" content="取消" placement="top">
              <el-button
                v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'report')"
                type="text"
                icon="el-icon-circle-close"
                style="color:blue;"
                @click="cancleEdit(scope.$index,scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="retime"
          label="变速信息"
          align="left"
          width="100px"
          v-if="show_retime&&(notShow == 'true' ?true:false)"
        >
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
             <el-tooltip effect="dark" content="取消" placement="top">
              <el-button
                v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'retime')"
                type="text"
                icon="el-icon-circle-close"
                style="color:blue;"
                @click="cancleEdit(scope.$index,scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="inner_version"
          label="版本号"
          align="left"
          width="90px"
          show-overflow-tooltip
          v-if="show_inner_version"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span style="white-space: pre-line;">{{scope.inner_version}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="制作内容"
          width="150px"
          align="left"
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
        
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            ></el-input>
            <span style="white-space: pre-line;" v-else>{{scope.row.content?scope.row.content:"-"}}</span>
             <el-tooltip effect="dark" content="取消" placement="top">
              <el-button
                v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'content')"
                type="text"
                icon="el-icon-circle-close"
                style="color:blue;"
                @click="cancleEdit(scope.$index,scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="priority"
          label="优先级"
          :formatter="Priority"
          align="center"
          width="120px"
          v-if="show_priority"
          sortable="custom"
          column-key="priority"
          :filters="[{text: '正常', value: '0'}, {text: '优先', value: '1'}]"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.priority"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'priority')"
              @change="showEditIcon(scope.$index,scope.row)"
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
        <el-table-column
          prop="level"
          label="难度"
          :formatter="Level"
          align="center"
          v-if="show_level"
          width="120px"
          sortable="custom"
          column-key="level"
          :filters="[{text: 'A+', value: '0'}, {text: 'A', value: '1'}, {text: 'A-', value: '2'}, 
          {text: 'B+', value: '3'},{text: 'B', value: '4'}, {text: 'B-', value: '5'},
           {text: 'C+', value: '6'}, {text: 'C', value: '7'},{text: 'D+', value: '8'},
           {text: 'D', value: '9'}, {text: 'E', value: '10'}]"
        >
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
            <span style="padding-left:50px;"
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'level')"
            >{{scope.row.level|Level}}</span>
             <el-tooltip effect="dark" content="取消" placement="top">
              <el-button
                v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'level')"
                type="text"
                icon="el-icon-circle-close"
                style="color:blue;"
                @click="cancleEdit(scope.$index,scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        
        <el-table-column prop="creator_name" label="创建人" align="left" v-if="show_creator_name"></el-table-column> 
        <el-table-column label="当前环节" align="center" width="160px" v-if="show_link">
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
        <el-table-column
          label="创建日期"
          align="left"
          width="80px"
          v-if="show_create_date"
          prop="date"
          class-name="date"
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.create_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column
          label="开始日期"
          align="left"
          width="80px"
          v-if="show_start_date"
          prop="start_date"
          class-name="date"
          sortable="custom"
        >
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.start_date"
              type="date"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'start_date')"
              @change="showEditIcon(scope.$index,scope.row)"
              @blur="saveEdit(scope.$index,scope.row)"
              placeholder="点击选择"
              value-format="timestamp"
            />
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'start_date')"
            >{{scope.row.start_date/1000 | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="结束日期"
          align="left"
          width="80px"
          v-if="show_end_date"
          prop="end_date"
          class-name="date"
          sortable="custom"
        >
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.end_date"
              type="date"
              value-format="timestamp"
              :default-value="new Date()"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'end_date')"
              @change="showEditIcon(scope.$index,scope.row)"
              @blur="saveEdit(scope.$index,scope.row)"
              placeholder="点击选择"
            />
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'end_date')"
            >{{scope.row.end_date/1000 | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="计划截止|日期"
          align="left"
          width="80px"
          v-if="show_totle_date_end"
          prop="total_end_date"
          class-name="date"
          sortable="custom"
          :render-header="renderheader"
        >
          <template slot-scope="scope">{{scope.row.total_date_end|dateFormat}}</template>
        </el-table-column>
        <el-table-column
          prop="total_hours"
          label="总工时"
          align="left"
          width="60px"
          v-if="show_total_hours"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="left"
          show-overflow-tooltip
          v-if="show_remark"
        >
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
        <el-table-column label="操作" align="center" width="110px" v-if="authAsset">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="导出至素材库" placement="top">
              <svg-icon
                icon-class="exportMaterial"
                @click="pushMaterial(1,scope.row.id)"
                style="cursor:pointer;margin-right:10px;margin-top:8px"
              />
            </el-tooltip>
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
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                @click="deleteAssets(scope.row.id)"
                icon="el-icon-delete"
                style="color:red"
                type="text"
                v-if="!editing||clickId !== scope.row.id"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="取消" placement="top">
              <el-button
                v-if="editing&&clickId === scope.row.id"
                type="text"
                icon="el-icon-circle-close"
                style="color:blue"
                @click="cancleEdit(scope.$index,scope.row)"
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
    </div>
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
              <el-input v-model="updateMulTask.session" placeholder="请填写场次" :disabled="disableSession"></el-input>
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
              <el-input v-model="updateMulTask.frame_range" placeholder="请填写帧数范围" :disabled="disableFrame_range"></el-input>
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
              <el-input v-model="updateMulTask.episode" placeholder="请填写集数" :disabled="disableEpisode"></el-input>
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
              <el-input v-model="updateMulTask.retime" placeholder="请填写变速信息" :disabled="disableRetime"></el-input>
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
              <el-input v-model="updateMulTask.report" placeholder="请填写画面调整信息" :disabled="disableReport"></el-input>
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
              <el-input v-model="updateMulTask.pro_reference" placeholder="请填写制作参考" :disabled="disablePro_reference"></el-input>
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
              v-model="changeTime"
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
              <el-input v-model="updateMulTask.remark" placeholder="请填写备注" :disabled="disableRemark"></el-input>
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
    <!-- 添加镜头 -->
    <el-dialog :title="dialogTitle" :visible.sync="isShow" width="480px" top="5vh">
      <el-form
        :model="AssetForm"
        :rules="rules"
        ref="assetForm"
        label-width="100px"
        hide-required-asterisk
        label-position="left"
      >
        <el-upload
          accept="image/jpeg, image/gif, image/png"
          ref="upload"
          class="upload-demo"
          action="/api/appfile/appfile/"
          :headers="headers"
          :on-success="handleSuccess"
          drag
          :show-file-list="false"
        >
          <el-image v-if="SRC" style="width: 100%; height: 100%" :src="SRC"></el-image>
          <template v-else>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </template>
        </el-upload>
        <el-form-item label="资产名称" prop="name">
          <el-input v-model="AssetForm.name" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="存放路径" prop="path">
          <el-input v-model="AssetForm.path" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="优先等级" prop="priority">
          <!-- <el-input v-model="AssetForm.code"></el-input> -->
          <el-radio v-model="AssetForm.priority" :label="0">正常</el-radio>
          <el-radio v-model="AssetForm.priority" :label="1">优先</el-radio>
        </el-form-item>
        <el-form-item label="难度" prop="level">
          <el-select v-model="AssetForm.level" placeholder="请选择难度">
            <el-option
              v-for="item of LevelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="所属团队" prop="team">
          <el-input v-model="AssetForm.category"></el-input>
        </el-form-item>-->
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button
            :loading="buttonStates.createLoading"
            type="primary"
            @click="addAsset"
          >{{DialogName===1?'立即创建':'立即修改'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 资产修改时上传图片 -->
    <el-dialog title="上传图片" :visible.sync="dialogImg" width="480px" top="5vh">
      <el-form
        :model="ImgForm"
        ref="ImgForm"
        label-width="100px"
        hide-required-asterisk
        label-position="left"
      >
        <el-upload
          accept="image/jpeg, image/gif, image/png"
          ref="upload"
          class="upload-demo"
          action="/api/appfile/appfile/"
          :headers="headers"
          :on-success="handleSuccess"
          drag
          :show-file-list="false"
        >
          <el-image v-if="SRC" style="width: 100%; height: 100%" :src="SRC"></el-image>
          <template v-else>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </template>
        </el-upload>
        <el-form-item>
          <el-button @click="cancel2">取消</el-button>
          <el-button :loading="buttonStates.createLoading" type="primary" @click="addImg">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加至素材库 -->
    <el-dialog title="添加至素材库" :visible.sync="materialShow" width="480px" top="5vh">
      <el-form :model="materialForm" label-width="90px">
        <el-form-item label="素材名称" prop="name">
          <el-input v-model="materialForm.name"></el-input>
        </el-form-item>
        <el-form-item label="素材路径" prop="path">
          <el-input v-model="materialForm.path"></el-input>
        </el-form-item>
        <el-form-item label="素材说明" prop="explain">
          <el-input type="textarea" v-model="materialForm.explain"></el-input>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="primary" @click="pushMaterial()">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 导出 -->
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
    <!-- 资产侧栏 -->
    <Drawer
      scrollable
      closable
      v-model="value1"
      width="526"
      :transfer="false"
      :mask="false"
      :inner="isInner"
      ref="drawer-parent"
    >
      <assetDrawer
        :authAsset="authAsset"
        :assetJump="assetJump"
        @refresh_assetList="getAssetList(2)"
        ref="assetDrawer"
      />
    </Drawer>
    <!-- 任务侧栏 -->
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
  </div>
</template>

<script src="./tab-assets.js">
</script>

<style lang="scss">
#tab-assets {
  
  min-height: calc(100vh - 199px);
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
  //  .el-table .cell {
  //   display:flex !important;
  // }
  .links {
    cursor: pointer;
    color: #2d8cf0;
  }
}
svg-icon {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 22px;
  height: 22px;
  vertical-align: 10px;
  padding-right: 10px;
}
.el-table__expanded-cell {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  padding-right: 70px !important;
}
.el-table__row {
  height: 50px !important;
}
.el-card {
  border-radius: 0px;
}
.el-button--mini{
  padding: 7px 7px 
}
.btn-explain{
        padding-left:10px;
        font-size:12px;
        color:#808080;
        cursor: pointer;
      }
.progress{
  width:130px;
  height:12px;
  margin-bottom:5px;
}
</style>
