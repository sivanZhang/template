<template>
  <div id="built">
    <el-form :model="addwellForm" status-icon ref="addwellForm" label-width="90px">
      <el-row :gutter="15">
        <el-col :sm="6">
          <el-form-item label="归属:" prop="belongs">
            <el-cascader
              :options="depts"
              v-model="addwellForm.belongs"
              type="text"
              :props="props"
              style="width:160px;"
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="井号编号:" prop="number">
            <el-input
              v-model="addwellForm.number"
              placeholder="必须为数字"
              oninput="value=value.replace(/[^\d]/g,'')"
              style="width:160px;"
              :min="0"
              :disabled= "disableNum"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="井名:" prop="name">
            <el-input v-model="addwellForm.name" style="width:160px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label=" 开关井状态:" prop="status">
            <el-select v-model="addwellForm.status" placeholder="请选择" style="width:160px;">
              <el-option
                v-for="item in statuslist"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="6">
          <el-form-item label="油井类别:" prop="well_type">
            <el-select v-model="addwellForm.well_type" placeholder="请选择" style="width:160px;">
              <el-option
                v-for="item in category"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="工变运行状态:" prop="run_status">
            <el-select v-model="addwellForm.run_status" placeholder="请选择" style="width:160px;">
              <el-option
                v-for="item in runStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="产量:" prop="output">
            <el-input-number v-model="addwellForm.output" style="width:160px;" :precision="2" :min="0.05" :step="0.01"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="液面:" prop="liquid_level">
            <el-input-number v-model="addwellForm.liquid_level" style="width:160px;" :precision="2" :min="1.00" :step="0.01"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="5">
          <el-form-item label="抽油机机型:" prop="pumpingtype">
            <el-select
              v-model="addwellForm.pumpingtype"
              placeholder="请选择"
              style="width:140px;"
              filterable
              @change="changePumpType"
            >
              <el-option
                v-for="item in machinetype"
                :key="item.value"
                :label="item.type_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="1">
          <addPumpType @event1="change($event)" />
        </el-col>
        <el-col :sm="6">
          <el-form-item label="电机类型:" prop="motor_type">
            <el-select v-model="addwellForm.motor_type" placeholder="请选择" style="width:160px;">
              <el-option
                v-for="item in motorType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="电机功率:" prop="motor_power">
            <el-input-number v-model="addwellForm.motor_power" style="width:160px;" :precision="1" :min="0" :step="0.1"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="曲柄尺寸:" prop="size_1_crank">
            <el-input-number v-model="addwellForm.size_1_crank" style="width:160px;" :precision="3" :min="0" :step="0.001"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="6">
          <el-form-item label="曲柄重量:" prop="weight_1_crank">
            <el-input-number v-model="addwellForm.weight_1_crank" style="width:160px;" :precision="3" :min="0" :step="0.001"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="曲柄销子重量:" prop="crank_pin_weight" label-width="130px;">
            <el-input-number v-model="addwellForm.crank_pin_weight" style="width:160px;" :precision="3" :min="0" :step="0.001"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="结构不平衡重:" prop="unbalance_waight" label-width="130px;">
            <el-input-number v-model="addwellForm.unbalance_waight" style="width:160px;" :precision="3"  :step="0.001"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="平衡块数量" prop="balance_num">
            <el-select
              v-model="addwellForm.balance_num"
              placeholder="请选择"
              style="width:160px;"
              filterable
            >
              <el-option
                v-for="item in balanceNum"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :sm="6">
          <el-form-item label="大平衡块数量:" prop="big_balance_num" label-width="130px;">
            <el-input-number v-model="addwellForm.big_balance_num" style="width:160px;"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="小平衡块数量:" prop="small_balance_num" label-width="130px;">
            <el-input-number v-model="addwellForm.small_balance_num" style="width:160px;"></el-input-number>
          </el-form-item>
        </el-col>-->
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="6">
          <el-form-item label="平衡块尺寸1:" prop="size_1_big_balance" label-width="130px;">
            <el-input-number v-model="addwellForm.size_1_big_balance" style="width:160px;" :precision="3" :min="0" :step="0.001"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="平衡块尺寸2:" prop="size_2_big_balance" label-width="130px;">
            <el-input-number v-model="addwellForm.size_2_big_balance" style="width:160px;" :precision="3" :min="0" :step="0.001"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="平衡块尺寸3:" prop="size_1_small_balance" label-width="130px;">
            <el-input-number v-model="addwellForm.size_1_small_balance" style="width:160px;" :precision="3" :min="0" :step="0.001"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="平衡块尺寸4:" prop="size_2_small_balance" label-width="130px;">
            <el-input-number v-model="addwellForm.size_2_small_balance" style="width:160px;" :precision="3" :min="0" :step="0.001"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="6">
          <el-form-item label="平衡块重量1:" prop="weight_1_small_balance" label-width="130px;">
            <el-input-number v-model="addwellForm.weight_1_small_balance" style="width:160px;" 
            :precision="3" :min="0" :step="0.001"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="平衡块重量2:" prop="weight_2_small_balance" label-width="130px;">
            <el-input-number v-model="addwellForm.weight_2_small_balance" style="width:160px;" :precision="3" :min="0" :step="0.001"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="平衡块重量3:" prop="weight_1_big_balance" label-width="130px;">
            <el-input-number v-model="addwellForm.weight_1_big_balance" style="width:160px;" :precision="3" :min="0" :step="0.001"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="平衡块重量4:" prop="weight_2_big_balance" label-width="130px;">
            <el-input-number v-model="addwellForm.weight_2_big_balance" style="width:160px;" :precision="3" :min="0" :step="0.001"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="6">
          <el-form-item label="泵径:" prop="pump_diameter"
          :rules="[{type: 'number', message: '请输入数字' }]">
            <el-select
              v-model.number="addwellForm.pump_diameter"
              placeholder="请选择"
              filterable
              allow-create
              default-first-option
              style="width:160px;"
            >
              <el-option
                v-for="item in pumpType"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="泵挂:" prop="pump_hang">
            <el-input-number v-model="addwellForm.pump_hang" style="width:160px;" :precision="2" :min="0.00" :step="0.01"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="油管外径尺寸:" prop="tubing_outer_diameter" label-width="130px;">
            <el-input-number v-model="addwellForm.tubing_outer_diameter" style="width:160px;" :precision="0" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="套管内径尺寸:" prop="casing_inner_diameter" label-width="130px;">
            <el-input-number v-model="addwellForm.casing_inner_diameter" style="width:160px;" :precision="0" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="6">
          <el-form-item label="含水:" prop="watery">
            <el-input-number v-model="addwellForm.watery" style="width:160px;" :precision="3"
            :max="1" :min="0" :step="0.001"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="冲程:" prop="stroke">
            <el-input-number v-model="addwellForm.stroke" style="width:160px;" :precision="2" :min="0" :step="0.01"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="冲次:" prop="impulse_times">
            <div v-if="addwellForm.name == 'X11-3-B333' && id">
               <el-input-number v-model="addwellForm.impulse_times" style="width:160px;" :precision="1" :min="0" :step="0.1"></el-input-number>
            </div>
            <div v-else>
               <el-input-number v-model="addwellForm.impulse_times" style="width:160px;" :precision="2" :min="0" :step="0.01"></el-input-number>
            </div>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="额定冲次:" prop="ratedImpulse_times">
            <el-input-number v-model="addwellForm.ratedImpulse_times" style="width:160px;" :precision="2" :min="0.00" :step="0.01"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="6">
          <el-form-item label="泵深:" prop="depth">
            <el-input-number v-model="addwellForm.depth" style="width:160px;" :min="0"></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :sm="6">
          <el-form-item label="冲次上限值:" prop="toplimit">
            <el-input-number
              v-model="addwellForm.toplimit"
              style="width:160px;"
              :min="0&&addwellForm.lowerlimit"
              :precision="1" 
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="冲次下限值:" prop="lowerlimit">
            <el-input-number
              v-model="addwellForm.lowerlimit"
              style="width:160px;"
              :min="0"
              :max="addwellForm.toplimit"
              :precision="1"
              :step="0.1"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="额定理排:" prop="rated_rowArran">
            <el-input-number v-model="addwellForm.rated_rowArran" style="width:160px;" :precision="2" :min="0.00" :step="0.01"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="6">
          <el-form-item label="油压是否有安装:" prop="pt_install" label-width="130px;">
            <el-select v-model="addwellForm.pt_install" placeholder="请选择" style="width:160px;">
              <el-option
                v-for="item in ptPcInstall"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="套压是否有安装:" prop="pc_install" label-width="130px;">
            <el-select v-model="addwellForm.pc_install" placeholder="请选择" style="width:160px;">
              <el-option
                v-for="item in ptPcInstall"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="偏置角:" prop="offset_angle" label-width="130px;">
            <el-input
              v-model="addwellForm.offset_angle"
              placeholder="写入数字并保留两位小数"
              oninput="value=value.replace(/[^\d^\.]+/g, '').replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/,'$1')"
              style="width:170px;"
              :min="0"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="顺逆时针状态" prop="turn" label-width="130px;">
            <el-select v-model="turn" placeholder="请选择" style="width:160px;">
              <el-option
                v-for="item in hourHand"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="btn">
        <el-button @click="cancel">清空</el-button>
        <el-button type="primary" @click="submitForm('addwellForm',)">{{id?'修改':'新建'}}</el-button>
      </div>
    </el-form>
    <div style="margin-top:50px"></div>
  </div>
</template>
<script>
import {
  ApiAddWell,
  ApiGetWellList,
  ApiAlterWell,
  ApiSearchPumping,
  ApiPumpDetail
} from "@/api/wellList";
import { getDept } from "@/api/admin";
import addPumpType from "./components/add-pumpType";
export default {
  components: {
    addPumpType
  },
  data() {
    return {
      id: this.$route.params.id || "",
      depts: [],
      addwellForm: {
        well_type: "0"
      },
      statuslist: [
        {
          value: "0",
          label: "开井"
        },
        {
          value: "1",
          label: "关井"
        },
        {
          value: "2",
          label: "已移除"
        }
      ],
      //   Status: "",
      category: [
        {
          value: "0",
          label: "抽油机"
        }
        // {
        //   value: "1",
        //   label: "螺杆泵"
        // }
      ],
      wellCategory: "",
      motorType: [
        {
          value: "0",
          label: " 异步电机YB"
        },
        {
          value: "1",
          label: "永磁电机YC"
        },
        {
          value: "2",
          label: " 角差电机JC"
        },
        {
          value: "3",
          label: "变速电机BS"
        },
        {
          value: "4",
          label: "盘式电机PS"
        }
      ],
      ptPcInstall: [
        {
          value: "0",
          label: "是"
        },
        {
          value: "1",
          label: "否"
        }
      ],
      runStatus: [
        {
          value: "0",
          label: "工频"
        },
        {
          value: "1",
          label: "变频"
        }
      ],
      pumpType: [
        {
          value: "0",
          label: "28"
        },
        {
          value: "1",
          label: "32"
        },
        {
          value: "2",
          label: "38"
        },
        {
          value: "3",
          label: "44"
        },
        {
          value: "4",
          label: "45"
        },
        {
          value: "5",
          label: "51"
        },
        {
          value: "6",
          label: "56"
        },
        {
          value: "7",
          label: "57"
        },
        {
          value: "8",
          label: "64"
        },
        {
          value: "9",
          label: "70"
        },
        {
          value: "10",
          label: "83"
        },
        {
          value: "11",
          label: "95"
        }
      ],
      balanceNum: [
        {
          value: "1",
          label: "4个大平衡块"
        },
        {
          value: "2",
          label: "4个小平衡块"
        },
        {
          value: "3",
          label: "2个大平衡块"
        },
        {
          value: "4",
          label: "2个小平衡块"
        },
        {
          value: "5",
          label: "2个大平衡块和2个小平衡块"
        },
        {
          value: "6",
          label: "没有平衡块"
        }
      ],
      machinetype: [],
      hourHand:[
        {
          value: "0",
          label: "顺时针"
        },
        {
          value: "1",
          label: "逆时针"
        }
      ],
      turn:'',
      disableNum:false,
    };
  },
  computed: {
    props() {
      return {
        ActiveRow: {},
        expandTrigger: "hover",
        emitPath: false,
        value: "id",
        label: "name",
        lazy: false,
        GetwellList: [],
        lazyLoad(node, resolve) {
          const { level } = node;
          setTimeout(() => {
            const nodes = Array.from({ length: level + 1 }).map(item => ({
              leaf: level >= 2
            }));
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes);
          }, 1000);
        }
      };
    }
  },
  mounted() {
    if (this.id.id) {
      this.disableNum = true
      this.ActiveRow = {
        ...this.id
      };
      this.addwellForm = {
        ...this.ActiveRow,
        motor_power:
          this.ActiveRow.motor_power == null
            ? undefined
            : this.ActiveRow.motor_power,
        size_1_crank:
          this.ActiveRow.size_1_crank == null
            ? undefined
            : this.ActiveRow.size_1_crank,
        weight_1_crank:
          this.ActiveRow.weight_1_crank == null
            ? undefined
            : this.ActiveRow.weight_1_crank,
        crank_pin_weight:
          this.ActiveRow.crank_pin_weight == null
            ? undefined
            : this.ActiveRow.crank_pin_weight,
        //   big_balance_num:this.ActiveRow.big_balance_num==null?undefined:this.ActiveRow.big_balance_num,
        //   small_balance_num:this.ActiveRow.small_balance_num==null?undefined:this.ActiveRow.small_balance_num,
        size_1_small_balance:
          this.ActiveRow.size_1_small_balance == null
            ? undefined
            : this.ActiveRow.size_1_small_balance,
        size_2_small_balance:
          this.ActiveRow.size_2_small_balance == null
            ? undefined
            : this.ActiveRow.size_2_small_balance,
        size_1_big_balance:
          this.ActiveRow.size_1_big_balance == null
            ? undefined
            : this.ActiveRow.size_1_big_balance,
        size_2_big_balance:
          this.ActiveRow.size_2_big_balance == null
            ? undefined
            : this.ActiveRow.size_2_big_balance,
        weight_1_small_balance:
          this.ActiveRow.weight_1_small_balance == null
            ? undefined
            : this.ActiveRow.weight_1_small_balance,
        weight_2_small_balance:
          this.ActiveRow.weight_2_small_balance == null
            ? undefined
            : this.ActiveRow.weight_2_small_balance,
        weight_1_big_balance:
          this.ActiveRow.weight_1_big_balance == null
            ? undefined
            : this.ActiveRow.weight_1_big_balance,
        weight_2_big_balance:
          this.ActiveRow.weight_2_big_balance == null
            ? undefined
            : this.ActiveRow.weight_2_big_balance,
        pump_diameter:
          this.ActiveRow.pump_diameter == null
            ? undefined
            : this.ActiveRow.pump_diameter,
        pump_hang:
          this.ActiveRow.pump_hang == null
            ? undefined
            : this.ActiveRow.pump_hang,
        tubing_outer_diameter:
          this.ActiveRow.tubing_outer_diameter == null
            ? undefined
            : this.ActiveRow.tubing_outer_diameter,
        casing_inner_diameter:
          this.ActiveRow.casing_inner_diameter == null
            ? undefined
            : this.ActiveRow.casing_inner_diameter,
        watery:
          this.ActiveRow.watery == null ? undefined : this.ActiveRow.watery,
        stroke:
          this.ActiveRow.stroke == null ? undefined : this.ActiveRow.stroke,
        impulse_times:
          this.ActiveRow.impulse_times == null
            ? undefined
            : this.ActiveRow.impulse_times,
        ratedImpulse_times:
          this.ActiveRow.ratedImpulse_times == null
            ? undefined
            : this.ActiveRow.ratedImpulse_times,
        depth: this.ActiveRow.depth == null ? undefined : this.ActiveRow.depth,
        rated_rowArran:
          this.ActiveRow.rated_rowArran == null
            ? undefined
            : this.ActiveRow.rated_rowArran,
        unbalance_waight:
          this.ActiveRow.unbalance_waight == null
            ? undefined
            : this.ActiveRow.unbalance_waight,
        output:
          this.ActiveRow.out_put == null ? undefined : this.ActiveRow.out_put,
        liquid_level:
          this.ActiveRow.liquid_level == null
            ? undefined
            : this.ActiveRow.liquid_level,
        belongs: this.ActiveRow.belongs_ids[this.ActiveRow.belongs_ids.length -1],
        status: String(this.ActiveRow.status),
        well_type: String(this.ActiveRow.well_type),
        pt_install:
          this.ActiveRow.pt_install == null
            ? this.ActiveRow.pt_install
            : String(this.ActiveRow.pt_install),
        pc_install:
          this.ActiveRow.pc_install == null
            ? this.ActiveRow.pc_install
            : String(this.ActiveRow.pc_install),
        run_status:
          this.ActiveRow.run_status == null
            ? this.ActiveRow.run_status
            : String(this.ActiveRow.run_status),
        pumpingtype:
          this.ActiveRow.pumping_type.id == undefined
            ? null
            : this.ActiveRow.pumping_type.id,
        balance_num:
          this.ActiveRow.balance_num == null
            ? this.ActiveRow.balance_num
            : String(this.ActiveRow.balance_num),
        offset_angle:
          this.ActiveRow.offset_angle == null
            ? this.ActiveRow.offset_angle
            : String(this.ActiveRow.offset_angle),
        turn:
          this.ActiveRow.turn == undefined
            ? this.ActiveRow.pumping_type.turn
            : this.ActiveRow.turn,
      }
      if(this.addwellForm.turn == 0){
        this.turn = "0"
      }else{
        this.turn = "1"
      }
      console.log(this.addwellForm.belongs);
    }
  },
  methods: {
    getDeptList() {
      getDept().then(res => {
        res.data.msg.map(item => {
          item.children.map(ite => {
            ite.children.map(it => {
              it.children.map(i => {
                i.children = null;
              });
            });
          });
        });
        this.depts = res.data.msg;
      });
    },

    submitForm(addwellForm) {
      this.$refs["addwellForm"].validate((valid) => {
        if (valid) {
        if (this.id.id) {
          let wellparams = {};
          wellparams = {
            well_id: this.id.id,
            dept_id: this.addwellForm.belongs,
            number: this.addwellForm.number,
            name: this.addwellForm.name,
            status: this.addwellForm.status,
            well_type: this.addwellForm.well_type,
            depth: this.addwellForm.depth,
            pumping_id: this.addwellForm.pumpingtype,
            balance_num: this.addwellForm.balance_num,
            motor_power: this.addwellForm.motor_power,
            motor_type: this.addwellForm.motor_type,
            //   big_balance_num: this.addwellForm.big_balance_num,
            //   small_balance_num: this.addwellForm.small_balance_num,
            size_1_big_balance: this.addwellForm.size_1_big_balance,
            size_2_big_balance: this.addwellForm.size_2_big_balance,
            size_1_small_balance: this.addwellForm.size_1_small_balance,
            size_2_small_balance: this.addwellForm.size_2_small_balance,
            weight_1_big_balance: this.addwellForm.weight_1_big_balance,
            weight_2_big_balance: this.addwellForm.weight_2_big_balance,
            weight_1_small_balance: this.addwellForm.weight_1_small_balance,
            weight_2_small_balance: this.addwellForm.weight_2_small_balance,
            size_1_crank: this.addwellForm.size_1_crank,
            pump_diameter: this.addwellForm.pump_diameter,
            tubing_outer_diameter: this.addwellForm.tubing_outer_diameter,
            casing_inner_diameter: this.addwellForm.casing_inner_diameter,
            pump_hang: this.addwellForm.pump_hang,
            crank_pin_weight: this.addwellForm.crank_pin_weight,
            weight_1_crank: this.addwellForm.weight_1_crank,
            impulse_times: this.addwellForm.impulse_times,
            ratedImpulse_times: this.addwellForm.ratedImpulse_times,
            toplimit: this.addwellForm.toplimit,
            lowerlimit: this.addwellForm.lowerlimit,
            output: this.addwellForm.output,
            liquid_level: this.addwellForm.liquid_level,
            watery: this.addwellForm.watery,
            stroke: this.addwellForm.stroke,
            run_status: this.addwellForm.run_status,
            rated_rowArran: this.addwellForm.rated_rowArran,
            pt_install: this.addwellForm.pt_install,
            pc_install: this.addwellForm.pc_install,
            unbalance_waight: this.addwellForm.unbalance_waight,
            offset_angle:this.addwellForm.offset_angle,
            turn:this.turn
          };

          if (wellparams.dept_id == undefined) {
            delete wellparams.dept_id;
          }
          if (wellparams.number == undefined) {
            delete wellparams.number;
          }
          if (wellparams.name == undefined) {
            delete wellparams.name;
          }
          if (wellparams.status == undefined) {
            delete wellparams.status;
          }
          if (wellparams.well_type == undefined) {
            delete wellparams.well_type;
          }
          if (wellparams.depth == undefined) {
            delete wellparams.depth;
          }
          if (wellparams.pumping_id == undefined) {
            delete wellparams.pumping_id;
          }
          if (wellparams.motor_power == undefined) {
            delete wellparams.motor_power;
          }
          if (wellparams.motor_type == undefined) {
            delete wellparams.motor_type;
          }

          if (wellparams.balance_num == undefined) {
            delete wellparams.balance_num;
          }
          // if (wellparams.small_balance_num == undefined) {
          //   delete wellparams.small_balance_num;
          // }
          if (wellparams.size_1_big_balance == undefined) {
            delete wellparams.size_1_big_balance;
          }
          if (wellparams.size_2_big_balance == undefined) {
            delete wellparams.size_2_big_balance;
          }
          if (wellparams.size_1_small_balance == undefined) {
            delete wellparams.size_1_small_balance;
          }
          if (wellparams.size_2_small_balance == undefined) {
            delete wellparams.size_2_small_balance;
          }
          if (wellparams.weight_1_big_balance == undefined) {
            delete wellparams.weight_1_big_balance;
          }
          if (wellparams.weight_2_big_balance == undefined) {
            delete wellparams.weight_2_big_balance;
          }
          if (wellparams.weight_1_small_balance == undefined) {
            delete wellparams.weight_1_small_balance;
          }
          if (wellparams.weight_2_small_balance == undefined) {
            delete wellparams.weight_2_small_balance;
          }
          if (wellparams.size_1_crank == undefined) {
            delete wellparams.size_1_crank;
          }
          if (wellparams.pump_diameter == undefined) {
            delete wellparams.pump_diameter;
          }
          if (wellparams.tubing_outer_diameter == undefined) {
            delete wellparams.tubing_outer_diameter;
          }
          if (wellparams.casing_inner_diameter == undefined) {
            delete wellparams.casing_inner_diameter;
          }
          if (wellparams.pump_hang == undefined) {
            delete wellparams.pump_hang;
          }
          if (wellparams.watery == undefined) {
            delete wellparams.watery;
          }

          if (wellparams.crank_pin_weight == undefined) {
            delete wellparams.crank_pin_weight;
          }
          if (wellparams.weight_1_crank == undefined) {
            delete wellparams.weight_1_crank;
          }

          if (wellparams.toplimit == undefined) {
            delete wellparams.toplimit;
          }
          if (wellparams.lowerlimit == undefined) {
            delete wellparams.lowerlimit;
          }

          if (wellparams.output == undefined) {
            delete wellparams.output;
          }
          if (wellparams.liquid_level == undefined) {
            delete wellparams.liquid_level;
          }
          if (wellparams.impulse_times == undefined) {
            delete wellparams.impulse_times;
          }
          if (wellparams.stroke == undefined) {
            delete wellparams.stroke;
          }
          if (wellparams.run_status == undefined) {
            delete wellparams.run_status;
          }
          if (wellparams.ratedImpulse_times == undefined) {
            delete wellparams.ratedImpulse_times;
          }
          if (wellparams.rated_rowArran == undefined) {
            delete wellparams.rated_rowArran;
          }
          if (wellparams.pt_install == undefined) {
            delete wellparams.pt_install;
          }
          if (wellparams.pc_install == undefined) {
            delete wellparams.pc_install;
          }
          if (wellparams.unbalance_waight == undefined) {
            delete wellparams.unbalance_waight;
          }
          if (wellparams.offset_angle == undefined) {
            delete wellparams.offset_angle;
          }
          if (wellparams.turn == undefined) {
            delete wellparams.turn;
          }
          ApiAlterWell(wellparams).then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              // this.addwellForm={};
            } else {
              this.$message.error(data.msg);
              //  this.addwellForm={};
            }
          });
        } else {
          let wellparams = {};
          wellparams = {
            dept_id: this.addwellForm.belongs,
            number: this.addwellForm.number,
            name: this.addwellForm.name,
            status: this.addwellForm.status,
            well_type: this.addwellForm.well_type,
            pumping_id: this.addwellForm.pumpingtype,
            motor_power: this.addwellForm.motor_power,
            motor_type: this.addwellForm.motor_type,
            balance_num: this.addwellForm.balance_num,
            // small_balance_num: this.addwellForm.small_balance_num,
            size_1_big_balance: this.addwellForm.size_1_big_balance,
            size_2_big_balance: this.addwellForm.size_2_big_balance,
            size_1_small_balance: this.addwellForm.size_1_small_balance,
            size_2_small_balance: this.addwellForm.size_2_small_balance,
            weight_1_big_balance: this.addwellForm.weight_1_big_balance,
            weight_2_big_balance: this.addwellForm.weight_2_big_balance,
            weight_1_small_balance: this.addwellForm.weight_1_small_balance,
            weight_2_small_balance: this.addwellForm.weight_2_small_balance,
            size_1_crank: this.addwellForm.size_1_crank,
            pump_diameter: this.addwellForm.pump_diameter,
            tubing_outer_diameter: this.addwellForm.tubing_outer_diameter,
            casing_inner_diameter: this.addwellForm.casing_inner_diameter,
            pump_hang: this.addwellForm.pump_hang,
            crank_pin_weight: this.addwellForm.crank_pin_weight,
            weight_1_crank: this.addwellForm.weight_1_crank,
            impulse_times: this.addwellForm.impulse_times,
            toplimit: this.addwellForm.toplimit,
            lowerlimit: this.addwellForm.lowerlimit,
            output: this.addwellForm.output,
            liquid_level: this.addwellForm.liquid_level,
            watery: this.addwellForm.watery,
            stroke: this.addwellForm.stroke,
            run_status: this.addwellForm.run_status,
            rated_rowArran: this.addwellForm.rated_rowArran,
            pt_install: this.addwellForm.pt_install,
            pc_install: this.addwellForm.pc_install,
            ratedImpulse_times: this.addwellForm.ratedImpulse_times,
            depth: this.addwellForm.depth,
            unbalance_waight: this.addwellForm.unbalance_waight,
            offset_angle:this.addwellForm.offset_angle,
            turn:this.turn
          };
          if (wellparams.dept_id == undefined) {
            delete wellparams.dept_id;
          }
          if (wellparams.number == undefined) {
            delete wellparams.number;
          }
          if (wellparams.name == undefined) {
            delete wellparams.name;
          }
          if (wellparams.status == undefined) {
            delete wellparams.status;
          }
          if (wellparams.well_type == undefined) {
            delete wellparams.well_type;
          }

          if (wellparams.pumping_id == undefined) {
            delete wellparams.pumping_id;
          }
          if (wellparams.depth == undefined) {
            delete wellparams.depth;
          }
          if (wellparams.motor_power == undefined) {
            delete wellparams.motor_power;
          }
          if (wellparams.motor_type == undefined) {
            delete wellparams.motor_type;
          }
          if (wellparams.balance_num == undefined) {
            delete wellparams.balance_num;
          }
          // if (wellparams.small_balance_num == undefined) {
          //   delete wellparams.small_balance_num;
          // }
          if (wellparams.size_1_big_balance == undefined) {
            delete wellparams.size_1_big_balance;
          }
          if (wellparams.size_2_big_balance == undefined) {
            delete wellparams.size_2_big_balance;
          }
          if (wellparams.size_1_small_balance == undefined) {
            delete wellparams.size_1_small_balance;
          }
          if (wellparams.size_2_small_balance == undefined) {
            delete wellparams.size_2_small_balance;
          }
          if (wellparams.weight_1_big_balance == undefined) {
            delete wellparams.weight_1_big_balance;
          }
          if (wellparams.weight_2_big_balance == undefined) {
            delete wellparams.weight_2_big_balance;
          }
          if (wellparams.weight_1_small_balance == undefined) {
            delete wellparams.weight_1_small_balance;
          }
          if (wellparams.weight_2_small_balance == undefined) {
            delete wellparams.weight_2_small_balance;
          }
          if (wellparams.size_1_crank == undefined) {
            delete wellparams.size_1_crank;
          }
          if (wellparams.pump_diameter == undefined) {
            delete wellparams.pump_diameter;
          }
          if (wellparams.tubing_outer_diameter == undefined) {
            delete wellparams.tubing_outer_diameter;
          }
          if (wellparams.casing_inner_diameter == undefined) {
            delete wellparams.casing_inner_diameter;
          }
          if (wellparams.pump_hang == undefined) {
            delete wellparams.pump_hang;
          }
          if (wellparams.watery == undefined) {
            delete wellparams.watery;
          }

          if (wellparams.crank_pin_weight == undefined) {
            delete wellparams.crank_pin_weight;
          }
          if (wellparams.weight_1_crank == undefined) {
            delete wellparams.weight_1_crank;
          }

          if (wellparams.toplimit == undefined) {
            delete wellparams.toplimit;
          }
          if (wellparams.lowerlimit == undefined) {
            delete wellparams.lowerlimit;
          }

          if (wellparams.output == undefined) {
            delete wellparams.output;
          }
          if (wellparams.liquid_level == undefined) {
            delete wellparams.liquid_level;
          }
          if (wellparams.impulse_times == undefined) {
            delete wellparams.impulse_times;
          }
          if (wellparams.stroke == undefined) {
            delete wellparams.stroke;
          }
          if (wellparams.run_status == undefined) {
            delete wellparams.run_status;
          }
          if (wellparams.ratedImpulse_times == undefined) {
            delete wellparams.ratedImpulse_times;
          }
          if (wellparams.rated_rowArran == undefined) {
            delete wellparams.rated_rowArran;
          }
          if (wellparams.pt_install == undefined) {
            delete wellparams.pt_install;
          }
          if (wellparams.pc_install == undefined) {
            delete wellparams.pc_install;
          }
          if (wellparams.unbalance_waight == undefined) {
            delete wellparams.unbalance_waight;
          }
          if (wellparams.offset_angle == undefined) {
            delete wellparams.offset_angle;
          }
          if (wellparams.turn == undefined) {
            delete wellparams.turn;
          }
          ApiAddWell(wellparams).then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              // this.addwellForm={};
            } else {
              this.$message.error(data.msg);
              //  this.addwellForm={};
            }
          });
        }
        }
      })
    },
    cancel() {
      this.$refs["addwellForm"].resetFields();
      this.turn = ''
    },
    GetwellList() {
      ApiGetWellList().then(res => {
        this.wellList = res.data.msg.well_list;
        // this.total = res.data.msg.total;
      });
    },
    change(data) {
      this.machinetype = data;
    },
    changePumpType(value){
      if(value != null){
        ApiPumpDetail({id:value}).then(({ data })=>{
          let pumpDetail = data.msg
          switch (pumpDetail.turn){
            case 0 :
              this.turn = "0"
              break;
            case 1:
              this.turn = "1"
              break;
          }
        })
      }
      
    }
  },
  created() {
    this.getDeptList();
    //  this.SearchPumping();
  }
};
</script>
<style lang="scss">
#built {
  //   font-size: 12px;
  min-height: 90vh;
  background-color: #f4f5f5;
  height: 100%;
  .row-bg-top {
    align-items: center;
    padding: 10px;
  }
  .row-bg {
    padding-bottom: 10px;
  }
  .col-bg {
    padding: 5px 0 0 0;
  }
  .btn {
    text-align: right;
    margin-top: 0px;
    margin-right: 60px;
  }
}
</style>       