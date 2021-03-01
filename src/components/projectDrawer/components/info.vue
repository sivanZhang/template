<template>
  <div id="info">
    <!-- 项目消息栏 -->
    <template v-if="project && project.entity_type === 4">
      <div>
        <el-row v-if="configImg == 'img'">
          <!-- <el-col :span="6" class="comment">缩略图</el-col> -->
          <el-col :span="18" class="comment">
            <el-image
              class="mini-image"
              :src="project.image?$store.state.BASE_URL+project.image:''"
              fit="cover"
              style="height:121.5px;width:181.7px;margin-bottom:5px"
            ></el-image>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">项目名称</el-col>
          <el-col :span="18" class="comment">
            <div
              v-if="!copyProjecr.name.isEdit"
              @mouseover="showIcon('name',true)"
              @mouseleave="showIcon('name',false)"
            >
              <span>{{project.name}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_project&&copyProjecr.name.isShowEditeIcon"
                @click="editItem('name')"
              ></i>
            </div>
            <div v-else>
              <input
                type="text"
                ref="input"
                class="input"
                v-model="copyProjecr.name.value"
                @keyup.enter="saveItem('name')"
              />
              <el-button @click="saveItem('name')" type="primary">修改</el-button>
              <el-button @click="cancelChange('name')">取消</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">项目编码</el-col>
          <el-col :span="18" class="comment">{{project.code}}</el-col>
        </el-row>
        <el-row >
          <el-col :span="6" class="comment">制作要求</el-col>
          <el-col :span="18" class="comment">
            <div
              v-if="!copyProjecr.requirement.isEdit"
              @mouseover="showIcon('requirement',true)"
              @mouseleave="showIcon('requirement',false)"
            >
              <span>{{project.requirement?project.requirement:"-"}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_project&&copyProjecr.requirement.isShowEditeIcon"
                @click="editItem('requirement')"
              ></i>
            </div>
            <div v-else>
              <el-input
                type="textarea"
                ref="input"
                class="input"
                v-model="copyProjecr.requirement.value"
                @keyup.enter="saveItem('requirement')"
                style="width:300px"
              />
              <el-button @click="saveItem('requirement')" type="primary">修改</el-button>
              <el-button @click="cancelChange('requirement')">取消</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">Windows路径</el-col>
          <el-col :span="18" class="comment">
            <div
              v-if="!copyProjecr.Windows.isEdit"
              @mouseover="showIcon('Windows',true)"
              @mouseleave="showIcon('Windows',false)"
            >
              <span>{{project.Windows?project.Windows:"-"}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_project&&copyProjecr.Windows.isShowEditeIcon"
                @click="editItem('Windows')"
              ></i>
            </div>
            <div v-else>
              <input
                type="text"
                ref="input"
                class="input"
                v-model="copyProjecr.Windows.value"
                @keyup.enter="saveItem('Windows')"
              />
              <el-button @click="saveItem('Windows')" type="primary">修改</el-button>
              <el-button @click="cancelChange('Windows')">取消</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">Mac路径</el-col>
          <el-col :span="18" class="comment">
            <div
              v-if="!copyProjecr.Mac.isEdit"
              @mouseover="showIcon('Mac',true)"
              @mouseleave="showIcon('Mac',false)"
            >
              <span>{{project.Mac?project.Mac:"-"}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_project&&copyProjecr.Mac.isShowEditeIcon"
                @click="editItem('Mac')"
              ></i>
            </div>
            <div v-else>
              <input
                type="text"
                ref="input"
                class="input"
                v-model="copyProjecr.Mac.value"
                @keyup.enter="saveItem('Mac')"
              />
              <el-button @click="saveItem('Mac')" type="primary">修改</el-button>
              <el-button @click="cancelChange('Mac')">取消</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">Linux路径</el-col>
          <el-col :span="18" class="comment">
            <div
              v-if="!copyProjecr.Linux.isEdit"
              @mouseover="showIcon('Linux',true)"
              @mouseleave="showIcon('Linux',false)"
            >
              <span>{{project.Linux?project.Linux:"-"}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_project&&copyProjecr.Linux.isShowEditeIcon"
                @click="editItem('Linux')"
              ></i>
            </div>
            <div v-else>
              <input
                type="text"
                ref="input"
                class="input"
                v-model="copyProjecr.Linux.value"
                @keyup.enter="saveItem('Linux')"
              />
              <el-button @click="saveItem('Linux')" type="primary">修改</el-button>
              <el-button @click="cancelChange('Linux')">取消</el-button>
            </div>
          </el-col>
        </el-row>
      
        <el-row>
          <el-col :span="6" class="comment">负责人</el-col>
          <el-col :span="18" class="comment">
            <div
              v-if="!copyProjecr.charger_name.isEdit"
              @mouseover="showIcon('charger_name',true)"
              @mouseleave="showIcon('charger_name',false)"
            >
              <span>{{project.charger_name}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_project&&copyProjecr.charger_name.isShowEditeIcon"
                @click="editItem('charger_name')"
              ></i>
            </div>
            <div v-else>
              <el-select
                v-model="copyProjecr.charger_name.value"
                filterable
                placeholder="请选择负责人"
                ref="selete"
              >
                <el-option
                  v-for="item of UserList"
                  :label="item.username"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
              <el-button @click="saveItem('charger_name')" type="primary">修改</el-button>
              <el-button @click="cancelChange('charger_name')">取消</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">工作流</el-col>
          <el-col :span="18" class="comment">
            <div @mouseover="showEdit6=true" @mouseleave="showEdit6 = false">
              <span v-if="!editing6">{{project.status|projectStatus}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_project&&showEdit6"
                @click="edit(5)"
              ></i>
            </div>
            <div v-if="editing6">
              <el-select v-model="status" placeholder="请选择工作流" ref="selete" @change="save(5)">
                <el-option label="未开始" :value="0"></el-option>
                <el-option label="正在进行" :value="1"></el-option>
                <el-option label="已完成" :value="2"></el-option>
                <el-option label="超期" :value="3"></el-option>
                <el-option label="重启" :value="4"></el-option>
              </el-select>
              <el-button @click="save(5)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">开始日期</el-col>
          <el-col :span="18" class="comment">
            <div
              v-if="!copyProjecr.date_start.isEdit"
              @mouseover="showIcon('date_start',true)"
              @mouseleave="showIcon('date_start',false)"
            >
              <span>{{project.date_start|dateFormat}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_project&&copyProjecr.date_start.isShowEditeIcon"
                @click="editItem('date_start')"
              ></i>
            </div>
            <div v-else>
              <el-date-picker
                v-model="copyProjecr.date_start.value"
                type="date"
                format="yyyy/MM/dd"
                ref="start"
              ></el-date-picker>
              <el-button @click="saveItem('date_start')" type="primary">修改</el-button>
              <el-button @click="cancelChange('date_start')">取消</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">结束日期</el-col>
          <el-col :span="18" class="comment">
            <div
              v-if="!copyProjecr.date_end.isEdit"
              @mouseover="showIcon('date_end',true)"
              @mouseleave="showIcon('date_end',false)"
            >
              <span>{{project.date_end|dateFormat}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_project&&copyProjecr.date_end.isShowEditeIcon"
                @click="editItem('date_end')"
              ></i>
            </div>
            <div v-else>
              <!-- $store.state.login.userInfo -->
              <el-date-picker
                v-model="copyProjecr.date_end.value"
                type="date"
                format="yyyy/MM/dd"
                ref="end"
              ></el-date-picker>
              <el-button @click="saveItem('date_end')" type="primary">修改</el-button>
              <el-button @click="cancelChange('date_end')">取消</el-button>
            </div>
          </el-col>
        </el-row>
        <template v-if="project.pro_type === 1">
          <el-row>
            <el-col :span="6" class="comment">客户信息</el-col>
            <el-col :span="18" class="comment">
              <div
                v-if="!copyProjecr.client.isEdit"
                @mouseover="showIcon('client',true)"
                @mouseleave="showIcon('client',false)"
              >
                <span>{{project.client.client_name?project.client.client_name:"-"}}</span>
                <i
                  class="el-icon-edit"
                  style="color:blue"
                  v-if="$store.state.login.userInfo.auth.manage_project&&copyProjecr.client.isShowEditeIcon"
                  @click="editItem('client')"
                ></i>
              </div>
              <div v-else>
                <el-select
                  v-model="copyProjecr.client.value.client_id"
                  placeholder="请选择"
                  ref="selete"
                >
                  <el-option
                    v-for="item of clientList"
                    :key="item.id"
                    :label="item.username"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-button @click="saveItem('client')" type="primary">修改</el-button>
                <el-button @click="cancelChange('client')">取消</el-button>
              </div>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row>
            <el-col :span="6" class="comment">所属学校</el-col>
            <el-col :span="18" class="comment">
              <div @mouseover="showEdit23=true" @mouseleave="showEdit23 = false">
                <span v-if="!editing23">{{project.school?project.school:"-"}}</span>
                <i
                  class="el-icon-edit"
                  style="color:blue"
                  v-if="$store.state.login.userInfo.auth.manage_project&&showEdit23"
                  @click="edit(22)"
                ></i>
              </div>
              <div v-if="editing23">
                <input
                  type="text"
                  ref="input"
                  class="input"
                  value="project.school"
                  v-model="school"
                  @keyup.enter="save(22)"
                />
                <el-button @click="save(22)" type="primary">修改</el-button>
              </div>
            </el-col>
          </el-row>
        </template>
      </div>
    </template>
    <!-- 资产消息栏 -->
    <template v-if="project && project.entity_type === 5">
      <div>
        <el-row>
          <el-col :span="6" class="comment">名称</el-col>
          <el-col :span="18" class="comment">
            <div @mouseover="showEdit15=true" @mouseleave="showEdit15 = false">
              <span v-if="!editing15">{{project.name}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                @click="edit(14)"
                v-if="showEdit15&&authAsset"
              ></i>
            </div>
            <div v-if="editing15">
              <input
                type="text"
                ref="input"
                class="input"
                value="project.name"
                v-model="assetName"
                @keyup.enter="save2(14)"
              />
              <el-button @click="save2(14)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">类型</el-col>
          <el-col :span="18" class="comment">{{project.category>0?project.category:"未分类"}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">路径</el-col>
          <el-col :span="18" class="comment">
            <div @mouseover="showEdit4=true" @mouseleave="showEdit4 = false">
              <span v-if="!editing4">{{project.path?project.path:"-"}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="showEdit4&&authAsset"
                @click="edit(3)"
              ></i>
            </div>
            <div v-if="editing4">
              <input
                type="text"
                ref="input"
                class="input"
                value="project.path"
                v-model="path"
                @keyup.enter="save2(3)"
              />
              <el-button @click="save2(3)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">创建人</el-col>
          <el-col :span="18" class="comment">{{project.creator_name}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">优先级</el-col>
          <el-col :span="18" class="comment">
            <div @mouseover="showEdit18=true" @mouseleave="showEdit18 = false">
              <span v-if="!editing18">{{project.priority |Priority}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="showEdit18&&authAsset"
                @click="edit(17)"
              ></i>
            </div>
            <div v-if="editing18">
              <el-select
                v-model="priority"
                filterable
                placeholder="请选择优先级"
                ref="selete"
                @change="save2(17)"
              >
                <el-option label="正常" :value="0"></el-option>
                <el-option label="优先" :value="1"></el-option>
              </el-select>
              <el-button @click="save2(17)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">难度</el-col>
          <el-col :span="18" class="comment">
            <div @mouseover="showEdit19=true" @mouseleave="showEdit19 = false">
              <span v-if="!editing19">{{project.level |Level}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="showEdit19&&authAsset"
                @click="edit(18)"
              ></i>
            </div>
            <div v-if="editing19">
              <el-select
                v-model="level"
                filterable
                placeholder="请选择难度"
                ref="selete"
                @change="save2(18)"
              >
                <el-option label="A+" :value="0"></el-option>
                <el-option label="A" :value="1"></el-option>
                <el-option label="A-" :value="2"></el-option>
                <el-option label="B+" :value="3"></el-option>
                <el-option label="B" :value="4"></el-option>
                <el-option label="B-" :value="5"></el-option>
                <el-option label="C+" :value="6"></el-option>
                <el-option label="C" :value="7"></el-option>
                <el-option label="D+" :value="8"></el-option>
                <el-option label="D" :value="9"></el-option>
                <el-option label="E" :value="10"></el-option>
              </el-select>
              <el-button @click="save2(18)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">开始日期</el-col>
          <el-col :span="18" class="comment">
            <div @mouseover="showEdit11=true" @mouseleave="showEdit11 = false">
              <span v-if="!editing11">{{project.start_date|dateFormat}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="showEdit11&&authAsset"
                @click="edit(10)"
              ></i>
            </div>
            <div v-if="editing11">
              <el-date-picker
                v-model="start_date"
                type="date"
                format="yyyy/MM/dd"
                ref="start"
                @change="save2(10)"
              ></el-date-picker>
              <el-button @click="save2(10)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">结束日期</el-col>
          <el-col :span="18" class="comment">
            <div @mouseover="showEdit12=true" @mouseleave="showEdit12 = false">
              <span v-if="!editing12">{{project.end_date|dateFormat}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="showEdit12&&authAsset"
                @click="edit(11)"
              ></i>
            </div>
            <div v-if="editing12">
              <!-- $store.state.login.userInfo -->
              <el-date-picker
                v-model="end_date"
                type="date"
                format="yyyy/MM/dd"
                ref="end"
                @change="save2(11)"
              ></el-date-picker>
              <el-button @click="save2(11)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">帧数</el-col>
          <el-col :span="18" class="comment">
            <div @mouseover="showEdit16=true" @mouseleave="showEdit16 = false">
              <span v-if="!editing16">{{project.frame?project.frame:"-"}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                @click="edit(15)"
                v-if="showEdit16&&authAsset"
              ></i>
            </div>
            <div v-if="editing16">
              <input
                type="text"
                ref="input"
                class="input"
                value="project.frame"
                v-model="frame"
                @keyup.enter="save2(15)"
              />
              <el-button @click="save2(15)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">集数</el-col>
          <el-col :span="18" class="comment">
            <div @mouseover="showEdit17=true" @mouseleave="showEdit17 = false">
              <span v-if="!editing17">{{project.episode?project.episode:"-"}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                @click="edit(16)"
                v-if="showEdit17&&authAsset"
              ></i>
            </div>
            <div v-if="editing17">
              <input
                type="text"
                ref="input"
                class="input"
                value="project.episode"
                v-model="episode"
                @keyup.enter="save2(16)"
              />
              <el-button @click="save2(16)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">内部版本</el-col>
          <el-col :span="18" class="comment">{{project.inner_version?project.inner_version:"-"}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">外部版本</el-col>
          <el-col :span="18" class="comment">{{project.outer_version?project.outer_version:"-"}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">画面调整信息</el-col>
          <el-col :span="18" class="comment">
            <div @mouseover="showEdit20=true" @mouseleave="showEdit20 = false">
              <span v-if="!editing20">{{project.report?project.report:"-"}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="showEdit20&&authAsset"
                @click="edit(19)"
              ></i>
            </div>
            <div v-if="editing20">
              <input
                type="text"
                ref="input"
                class="input"
                value="project.report"
                v-model="report"
                @keyup.enter="save2(19)"
              />
              <el-button @click="save2(19)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">变速信息</el-col>
          <el-col :span="18" class="comment">
            <div @mouseover="showEdit21=true" @mouseleave="showEdit21 = false">
              <span v-if="!editing21">{{project.retime?project.retime:"-"}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="showEdit21&&authAsset"
                @click="edit(20)"
              ></i>
            </div>
            <div v-if="editing21">
              <input
                type="text"
                ref="input"
                class="input"
                value="project.retime"
                v-model="retime"
                @keyup.enter="save2(20)"
              />
              <el-button @click="save2(20)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">帧数范围</el-col>
          <el-col :span="18" class="comment">
            <div @mouseover="showEdit22=true" @mouseleave="showEdit22 = false">
              <span v-if="!editing22">{{project.frame_range?project.frame_range:"-"}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="showEdit22&&authAsset"
                @click="edit(21)"
              ></i>
            </div>
            <div v-if="editing22">
              <input
                type="text"
                ref="input"
                class="input"
                value="project.frame_range"
                v-model="frame_range"
                @keyup.enter="save2(21)"
              />
              <el-button @click="save2(21)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">制作参考</el-col>
          <el-col :span="18" class="comment">
            <div @mouseover="showEdit24=true" @mouseleave="showEdit24 = false">
              <span v-if="!editing24">{{project.pro_reference}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                @click="edit(23)"
                v-if="showEdit24&&authAsset"
              ></i>
            </div>
            <div v-if="editing24">
              <input
                type="text"
                ref="input"
                class="input"
                value="project.pro_reference"
                v-model="reference"
                @keyup.enter="save2(23)"
              />
              <el-button @click="save2(23)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">备注</el-col>
          <el-col :span="18" class="comment">
            <div @mouseover="showEdit10=true" @mouseleave="showEdit10 = false">
              <span v-if="!editing10&&project.remark" v-html="project.remark" style="width:20px"></span>
              <span v-else v-show="!editing10&&!project.remark">{{"-"}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="showEdit10&&authAsset"
                @click="edit(9)"
              ></i>
            </div>

            <div v-if="editing10" style="display:flex">
              <el-input type="textarea" ref="input" v-model="remark" @keyup.enter="save2(9)" />
              <el-button @click="save2(9)" type="primary">修改</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </template>
  </div>
</template>

<script>
import { putProjects, updateRequirement } from "@/api/project";
import { getClientList } from "@/api/admin";
import { editAssets } from "@/api/assets";
import { mapState } from "vuex";
import { returnStatement } from "@babel/types";
import { constants } from "crypto";
import dayjs from "dayjs";
export default {
  props: ["project", "authAsset", "configImg"],
  name: "info",
  data() {
    return {
      // 复制并变异this.project对象
      copyProjecr: {},
      editing2: false,
      editing4: false,
      editing5: false,
      editing6: false,
      editing7: false,
      editing8: false,
      editing9: false,
      editing10: false,
      editing11: false,
      editing12: false,
      editing13: false,
      editing14: false,
      editing15: false,
      editing16: false,
      editing17: false,
      editing18: false,
      editing19: false,
      editing20: false,
      editing21: false,
      editing22: false,
      editing23: false,
      editing24: false,
      editing25: false,
      charger: null,
      charger_name: null,
      path: null,
      client: null,
      client_name: null,
      status: null,
      windows: null,
      mac: null,
      linux: null,
      remark: null,
      start_date: null,
      end_date: null,
      date_start: null,
      date_end: null,
      assetName: null,
      frame: null,
      episode: null,
      priority: null,
      level: null,
      report: null,
      retime: null,
      frame_range: null,
      school: null,
      reference: null,
      requirement: null,
      showEdit2: false,
      showEdit4: false,
      showEdit5: false,
      showEdit6: false,
      showEdit7: false,
      showEdit8: false,
      showEdit9: false,
      showEdit10: false,
      showEdit11: false,
      showEdit12: false,
      showEdit13: false,
      showEdit14: false,
      showEdit15: false,
      showEdit16: false,
      showEdit17: false,
      showEdit18: false,
      showEdit19: false,
      showEdit20: false,
      showEdit21: false,
      showEdit22: false,
      showEdit23: false,
      showEdit24: false,
      showEdit25: false,
      clientList: []
    };
  },
  computed: {
    ...mapState("admin", ["UserList"])
  },
  created() {},
  watch: {
    project: {
      deep: true,
      handler: function(newObj) {
        const OBJ = {};
        Object.keys(newObj).map(t => {
          OBJ[t] = {
            value:
              t == "date_end" || t == "date_start"
                ? newObj[t] * 1000
                : newObj[t],
            isEdit: false,
            isShowEditIcon: false
          };
        });
        this.copyProjecr = Object.assign({}, OBJ);
      }
    }
  },
  methods: {
    // 提交编辑的内容
    saveItem(prop) {
      const httpData = {
        method: "put",
        id: this.project.id
      };
      function dataFormat(dateVal) {
        return dayjs(dateVal).format("YYYY/MM/DD HH:mm:ss");
      }
      switch (prop) {
        case "start" || "end":
          httpData[prop] = dataFormat(this.copyProjecr[prop].value);
          break;
        case "charger_name":
          httpData["charger"] = this.copyProjecr[prop].value;
          break;
        case "client":
          httpData[prop] = this.copyProjecr[prop].value.client_id;
          break;
        case "Windows":
          httpData["windows_path"] = this.copyProjecr[prop].value;
          break;
        case "Mac":
          httpData["mac_path"] = this.copyProjecr[prop].value;
          break;
        case "Linux":
          httpData["linux_path"] = this.copyProjecr[prop].value;
          break;
        case "date_start":
          httpData["start"] = dayjs(this.copyProjecr[prop].value).format(
            "YYYY/MM/DD"
          );
          break;
        case "date_end":
          httpData["end"] = dayjs(this.copyProjecr[prop].value).format(
            "YYYY/MM/DD"
          );
          break;
        default:
          httpData[prop] = this.copyProjecr[prop].value;
          break;
      }
      putProjects(httpData).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          // 关闭编辑状态
          this.editItem(prop, false);
          this.$emit("refreshProject");
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 取消修改
    cancelChange(prop) {
      // 关闭编辑状态
      this.editItem(prop, false);
      // 还原成原来的数据
      this.copyProjecr[prop] = {
        ...this.copyProjecr[prop],
        value: this.project[prop]
      };
    },
    /**
     * 进入编辑状态
     * @param {Boolean} type 默认为true表示进入了编辑状态
     **/
    editItem(prop, type = true) {
      if (prop === "client") {
        getClientList().then(({ data }) => {
          this.clientList = [...data];
        });
      }
      this.copyProjecr[prop] = { ...this.copyProjecr[prop], isEdit: type };
    },
    /**
     * hover状态显示编辑按钮
     * @param {Boolean} type hover的时候改变状态，表示是否显示编辑图标
     **/
    showIcon(prop, type) {
      this.copyProjecr[prop] = {
        ...this.copyProjecr[prop],
        isShowEditeIcon: type
      };
    },
    edit(Type) {
      if (Type === 0) {
        this.showEdit = false;
        this.editing = true;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 1) {
        this.showEdit2 = false;
        this.editing2 = true;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 2) {
        this.showEdit3 = false;
        this.editing3 = true;
        this.$nextTick(() => {
          this.$refs.selete.focus();
        });
      }
      if (Type === 3) {
        this.showEdit4 = false;
        this.editing4 = true;
        this.$nextTick(() => {
          this.$refs.selete.focus();
        });
      }
      if (Type === 4) {
        this.showEdit5 = false;
        this.editing5 = true;
        this.$nextTick(() => {
          this.$refs.selete.focus();
        });
        getClientList().then(({ data }) => {
          this.clientList = [...data];
          // console.log(this.clientList);
        });
      }
      if (Type === 5) {
        this.showEdit6 = false;
        this.editing6 = true;
        this.$nextTick(() => {
          this.$refs.selete.focus();
        });
      }
      if (Type === 6) {
        this.showEdit7 = false;
        this.editing7 = true;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 7) {
        this.showEdit8 = false;
        this.editing8 = true;

        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 8) {
        this.showEdit9 = false;
        this.editing9 = true;

        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 9) {
        this.showEdit10 = false;
        this.editing10 = true;

        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 10) {
        this.showEdit11 = false;
        this.editing11 = true;

        this.$nextTick(() => {
          this.$refs.start.focus();
        });
      }
      if (Type === 11) {
        this.showEdit12 = false;
        this.editing12 = true;

        this.$nextTick(() => {
          this.$refs.end.focus();
        });
      }
      if (Type === 12) {
        this.showEdit13 = false;
        this.editing13 = true;

        this.$nextTick(() => {
          this.$refs.start.focus();
        });
      }
      if (Type === 13) {
        this.showEdit14 = false;
        this.editing14 = true;

        this.$nextTick(() => {
          this.$refs.end.focus();
        });
      }
      if (Type === 14) {
        this.showEdit15 = false;
        this.editing15 = true;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 15) {
        this.showEdit16 = false;
        this.editing16 = true;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 16) {
        this.showEdit17 = false;
        this.editing17 = true;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 17) {
        this.showEdit18 = false;
        this.editing18 = true;
        this.$nextTick(() => {
          this.$refs.selete.focus();
        });
      }
      if (Type === 18) {
        this.showEdit19 = false;
        this.editing19 = true;
        this.$nextTick(() => {
          this.$refs.selete.focus();
        });
      }
      if (Type === 19) {
        this.showEdit20 = false;
        this.editing20 = true;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 20) {
        this.showEdit21 = false;
        this.editing21 = true;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 21) {
        this.showEdit22 = false;
        this.editing22 = true;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 22) {
        this.showEdit23 = false;
        this.editing23 = true;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 23) {
        this.showEdit24 = false;
        this.editing24 = true;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (Type === 24) {
        this.showEdit25 = false;
        this.editing25 = true;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
    },
    save(Type) {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      let data = null;
      if (Type === 0) {
        this.editing = false;
        data = {
          method: "put",
          id: this.project.id,
          name: this.name
        };
      }
      if (Type === 1) {
        this.editing2 = false;
        data = {
          method: "put",
          id: this.project.id,
          budget: this.budget
        };
      }
      if (Type === 2) {
        this.editing3 = false;
        data = {
          method: "put",
          id: this.project.id,
          charger: this.charger
        };
      }

      if (Type === 4) {
        this.editing5 = false;
        data = {
          method: "put",
          id: this.project.id,
          client: this.client
        };
      }
      if (Type === 5) {
        this.editing6 = false;
        data = {
          method: "put",
          id: this.project.id,
          status: this.status
        };
      }
      if (Type === 6) {
        this.editing7 = false;
        data = {
          method: "put",
          id: this.project.id,
          windows_path: this.windows
        };
      }
      if (Type === 7) {
        this.editing8 = false;
        data = {
          method: "put",
          id: this.project.id,
          mac_path: this.mac
        };
      }
      if (Type === 8) {
        this.editing9 = false;
        data = {
          method: "put",
          id: this.project.id,
          linux_path: this.linux
        };
      }

      if (Type === 12) {
        this.editing13 = false;
        data = {
          method: "put",
          id: this.project.id,
          start: dataFormat(this.date_start)
        };
      }
      if (Type === 13) {
        this.editing14 = false;
        data = {
          method: "put",
          id: this.project.id,
          end: dataFormat(this.date_end)
        };
      }

      if (Type === 22) {
        this.editing23 = false;
        data = {
          method: "put",
          id: this.project.id,
          school: this.school
        };
      }
      putProjects(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            if (Type === 0) {
              this.project.name = this.name;
              this.name = null;
            }
            if (Type === 1) {
              this.project.budget = this.budget;
              this.budget = null;
            }
            if (Type === 2) {
              this.project.charger_name = this.charger_name;
              this.charger = null;
            }
            if (Type === 4) {
              this.project.client.client_name = this.client_name;
              this.client = null;
            }
            if (Type === 5) {
              this.project.status = this.status;
              this.status = null;
            }
            if (Type === 6) {
              this.project.Windows = this.windows;
              this.windows = null;
            }
            if (Type === 7) {
              this.project.Mac = this.mac;
              this.mac = null;
            }
            if (Type === 8) {
              this.project.Linux = this.linux;
              this.linux = null;
            }
            if (Type === 12) {
              this.project.date_start = this.date_start / 1000;
              this.date_start = null;
            }
            if (Type === 13) {
              this.project.date_end = this.date_end / 1000;
              this.date_end = null;
            }
            if (Type === 22) {
              this.project.school = this.school;
              this.school = null;
            }
          }
        })
        .catch(({ data }) => {
          this.$message.error(data.msg);
        });
    },
    save2(Type) {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      let data = null;
      if (Type === 3) {
        this.editing4 = false;
        data = {
          method: "put",
          id: this.project.id,
          path: this.path
        };
      }
      if (Type === 9) {
        this.editing10 = false;
        data = {
          method: "put",
          id: this.project.id,
          remark: this.remark
            .replace(/\r\n/g, "<br/>")
            .replace(/\n/g, "<br/>")
            .replace(/\s/g, "&nbsp;")
        };
      }
      if (Type === 10) {
        this.editing11 = false;
        data = {
          method: "put",
          id: this.project.id,
          start: dataFormat(this.start_date),
          end: dataFormat(this.project.end_date * 1000)
        };
      }
      if (Type === 11) {
        this.editing12 = false;
        data = {
          method: "put",
          id: this.project.id,
          start: dataFormat(this.project.start_date * 1000),
          end: dataFormat(this.end_date)
        };
      }
      if (Type === 14) {
        this.editing15 = false;
        data = {
          method: "put",
          id: this.project.id,
          name: this.assetName
        };
      }
      if (Type === 15) {
        this.editing16 = false;
        data = {
          method: "put",
          id: this.project.id,
          frame: this.frame
        };
      }
      if (Type === 16) {
        this.editing17 = false;
        data = {
          method: "put",
          id: this.project.id,
          episode: this.episode
        };
      }
      if (Type === 17) {
        this.editing18 = false;
        data = {
          method: "put",
          id: this.project.id,
          priority: this.priority
        };
      }
      if (Type === 18) {
        this.editing19 = false;
        data = {
          method: "put",
          id: this.project.id,
          level: this.level
        };
      }
      if (Type === 19) {
        this.editing20 = false;
        data = {
          method: "put",
          id: this.project.id,
          report: this.report
        };
      }
      if (Type === 20) {
        this.editing21 = false;
        data = {
          method: "put",
          id: this.project.id,
          retime: this.retime
        };
      }
      if (Type === 21) {
        this.editing22 = false;
        data = {
          method: "put",
          id: this.project.id,
          frame_range: this.frame_range
        };
      }
      if (Type === 23) {
        this.editing24 = false;
        data = {
          method: "put",
          id: this.project.id,
          reference: this.reference
        };
      }
      editAssets(data).then(({ data }) => {
        this.$message.success(data.msg);
        if (data.status === 0) {
          if (Type === 3) {
            this.project.path = this.path;
            this.path = null;
          }
          if (Type === 9) {
            this.project.remark = this.remark
              .replace(/\r\n/g, "<br/>")
              .replace(/\n/g, "<br/>")
              .replace(/\s/g, "&nbsp;");
            this.remark = null;
          }
          if (Type === 10) {
            this.project.start_date = this.start_date / 1000;
            this.start_date = null;
          }
          if (Type === 11) {
            this.project.end_date = this.end_date / 1000;
            this.end_date = null;
          }
          if (Type === 14) {
            this.project.name = this.assetName;
            this.assetName = null;
          }
          if (Type === 15) {
            this.project.frame = this.frame;
            this.frame = null;
          }
          if (Type === 16) {
            this.project.episode = this.episode;
            this.episode = null;
          }
          if (Type === 17) {
            this.project.priority = this.priority;
            this.priority = null;
          }
          if (Type === 18) {
            this.project.level = this.level;
            this.level = null;
          }
          if (Type === 19) {
            this.project.report = this.report;
            this.report = null;
          }
          if (Type === 20) {
            this.project.retime = this.retime;
            this.retime = null;
          }
          if (Type === 21) {
            this.project.frame_range = this.frame_range;
            this.frame_range = null;
          }
          if (Type === 23) {
            this.project.pro_reference = this.reference;
            this.reference = null;
          }
        }
        this.$emit("refresh_assetList");
      });
    },
    save3(Type) {
      if (Type === 24) {
        let data = {};
        this.editing25 = false;
        data = {
          method: "put",
          id: this.project.id,
          requirement: this.requirement
            .replace(/\r\n/g, "<br/>")
            .replace(/\n/g, "<br/>")
            .replace(/\s/g, "&nbsp;")
        };
        updateRequirement(data).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.project.requirement = this.requirement
              .replace(/\r\n/g, "<br/>")
              .replace(/\n/g, "<br/>")
              .replace(/\s/g, "&nbsp;");
            this.requirement = null;
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#info {
  .comment {
    padding: 5px 10px;
    font-size: 12px;
  }
  input {
    width: 100px;
    border: none;
    border-bottom: solid 2px deepskyblue;
  }
  input:focus {
    outline: none;
  }
  .edit-inp {
    width: 300px;
  }
}
</style>

