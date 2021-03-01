
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
          <el-form-item label="开关井状态:" prop="status">
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
            <el-input-number v-model="addwellForm.output" style="width:160px;" :precision="2" :min="0" :step="0.01"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="液面:" prop="liquid_level">
            <el-input-number v-model="addwellForm.liquid_level" style="width:160px;" :precision="2" :min="0" :step="0.01"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
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
          <el-form-item label="驱动方式:" prop="dirving_way">
            <el-select v-model="addwellForm.dirving_way" placeholder="请选择" style="width:160px;">
              <el-option
                v-for="item in dirvingWay"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="驱动装置类型:" prop="drive_type" label-width="130px;">
            <el-select v-model="addwellForm.drive_type" placeholder="请选择" style="width:160px;">
              <el-option
                v-for="item in driveType"
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
          <el-form-item label="泵型:" prop="pump_diameter"
          :rules="[{type: 'number', message: '请输入数字' }]">
            <!-- <el-input-number v-model="addwellForm.pump_diameter" style="width:160px;"></el-input-number> -->
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
          <el-form-item label="泵深:" prop="depth">
            <el-input-number v-model="addwellForm.depth" style="width:160px;" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="含水:" prop="watery">
            <el-input-number v-model="addwellForm.watery" style="width:160px;" :precision="3"
            :max="1" :min="0" :step="0.001"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="转速:" prop="speed">
            <el-input-number v-model="addwellForm.speed" style="width:160px;" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="额定转速:" prop="rated_speed">
            <el-input-number v-model="addwellForm.rated_speed" style="width:160px;" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="6">
          <el-form-item label="转速上限值:" prop="toplimit">
            <el-input-number
              v-model="addwellForm.toplimit"
              style="width:160px;"
              :min="0&&addwellForm.lowerlimit"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="转速下限值:" prop="lowerlimit">
            <el-input-number
              v-model="addwellForm.lowerlimit"
              style="width:160px;"
              :min="0"
              :max="addwellForm.toplimit"
            ></el-input-number>
          </el-form-item>
        </el-col>
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
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="6">
          <el-form-item label="额定理排:" prop="rated_rowArran">
            <el-input-number v-model="addwellForm.rated_rowArran" style="width:160px;" :precision="2" :min="0.00" :step="0.01"></el-input-number>
          </el-form-item>
        </el-col>
        <!-- <el-col :sm="6">
          <el-form-item label="偏置角:" prop="offset_angle" label-width="130px;">
            <el-input
              v-model="addwellForm.offset_angle"
              placeholder="写入数字并保留两位小数"
              oninput="value=value.replace(/[^\d^\.]+/g, '').replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/,'$1')"
              style="width:170px;"
              :min="0"
            ></el-input>
          </el-form-item>
        </el-col> -->
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
import { ApiAddWell, ApiGetWellList, ApiAlterWell } from "@/api/wellList";
import comName from "@/views/components/comName";
import { getDept } from "@/api/admin";
export default {
  components: {
    comName
  },
  data() {
    return {
      id: this.$route.params.id || "",
      depts: [],
      addwellForm: {
        well_type: "1"
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
      pumpType: [
        {
          value: "0",
          label: "40"
        },
        {
          value: "1",
          label: "65"
        },
        {
          value: "2",
          label: "75"
        },
        {
          value: "3",
          label: "90"
        },
        {
          value: "4",
          label: "104"
        },
        {
          value: "5",
          label: "120"
        },
        {
          value: "6",
          label: "200"
        },
        {
          value: "7",
          label: "300"
        },
        {
          value: "8",
          label: "400"
        },
        {
          value: "9",
          label: "500"
        },
        {
          value: "10",
          label: "555"
        },
        {
          value: "11",
          label: "800"
        },
        {
          value: "12",
          label: "1200"
        },
        {
          value: "13",
          label: "1400"
        },
        {
          value: "14",
          label: "1600"
        },
        {
          value: "15",
          label: "2000"
        }
      ],
      //   Status: "",
      category: [
        // {
        //   value: "0",
        //   label: "抽油机"
        // }
        {
          value: "1",
          label: "螺杆泵"
        }
      ],
      wellCategory: "",
      dirvingWay: [
        {
          value: "0",
          label: "直驱"
        },
        {
          value: "1",
          label: "普驱"
        }
      ],
      driveType: [
        
        {
          value: "11",
          label: "L3"
        },
         {
          value: "22",
          label: "L4"
        },
         {
          value: "33",
          label: "L5"
        },
        {
          value: "44",
          label: "直驱"
        }
      ],
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
        output:
          this.ActiveRow.out_put == null ? undefined : this.ActiveRow.out_put,
        liquid_level:
          this.ActiveRow.liquid_level == null
            ? undefined
            : this.ActiveRow.liquid_level,
        pump_diameter:
          this.ActiveRow.pump_diameter == null
            ? undefined
            : this.ActiveRow.pump_diameter,
        pump_hang:
          this.ActiveRow.pump_hang == null
            ? undefined
            : this.ActiveRow.pump_hang,
        watery:
          this.ActiveRow.watery == null ? undefined : this.ActiveRow.watery,
        depth: this.ActiveRow.depth == null ? undefined : this.ActiveRow.depth,
        motor_power:
          this.ActiveRow.motor_power == null
            ? undefined
            : this.ActiveRow.motor_power,
        rated_speed:
          this.ActiveRow.rated_speed == null
            ? undefined
            : this.ActiveRow.rated_speed,
        speed: this.ActiveRow.speed == null ? undefined : this.ActiveRow.speed,
        rated_rowArran:
          this.ActiveRow.rated_rowArran == null
            ? undefined
            : this.ActiveRow.rated_rowArran,
        tubing_outer_diameter:
          this.ActiveRow.tubing_outer_diameter == null
            ? undefined
            : this.ActiveRow.tubing_outer_diameter,
        casing_inner_diameter:
          this.ActiveRow.casing_inner_diameter == null
            ? undefined
            : this.ActiveRow.casing_inner_diameter,
        belongs: this.ActiveRow.belongs_ids[this.ActiveRow.belongs_ids.length-1],
        status: String(this.ActiveRow.status),
        well_type: String(this.ActiveRow.well_type),
        dirving_way:
          this.ActiveRow.dirving_way == null
            ? this.ActiveRow.dirving_way
            : String(this.ActiveRow.dirving_way),
        drive_type:
          this.ActiveRow.drive_type == null
            ? this.ActiveRow.drive_type
            : String(this.ActiveRow.drive_type),
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
        offset_angle:
          this.ActiveRow.offset_angle == null
            ? this.ActiveRow.offset_angle
            : String(this.ActiveRow.offset_angle),
      };
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
              run_status: this.addwellForm.run_status,
              output: this.addwellForm.output,
              liquid_level: this.addwellForm.liquid_level,
              motor_power: this.addwellForm.motor_power,
              motor_type: this.addwellForm.motor_type,
              dirving_way: this.addwellForm.dirving_way,
              drive_type: this.addwellForm.drive_type,
              pump_diameter: this.addwellForm.pump_diameter,
              pump_hang: this.addwellForm.pump_hang,
              tubing_outer_diameter: this.addwellForm.tubing_outer_diameter,
              casing_inner_diameter: this.addwellForm.casing_inner_diameter,
              watery: this.addwellForm.watery,
              rated_speed: this.addwellForm.rated_speed,
              speed: this.addwellForm.speed,
              rated_rowArran: this.addwellForm.rated_rowArran,
              pt_install: this.addwellForm.pt_install,
              pc_install: this.addwellForm.pc_install,
              depth: this.addwellForm.depth,
              toplimit: this.addwellForm.toplimit,
              lowerlimit: this.addwellForm.lowerlimit,
              offset_angle:this.addwellForm.offset_angle
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
            if (wellparams.run_status == undefined) {
              delete wellparams.run_status;
            }
            if (wellparams.output == undefined) {
              delete wellparams.output;
            }
            if (wellparams.liquid_level == undefined) {
              delete wellparams.liquid_level;
            }
            if (wellparams.motor_power == undefined) {
              delete wellparams.motor_power;
            }
            if (wellparams.motor_type == undefined) {
              delete wellparams.motor_type;
            }
            if (wellparams.dirving_way == undefined) {
              delete wellparams.dirving_way;
            }
            if (wellparams.drive_type == undefined) {
              delete wellparams.drive_type;
            }
            if (wellparams.pump_diameter == undefined) {
              delete wellparams.pump_diameter;
            }
            if (wellparams.pump_hang == undefined) {
              delete wellparams.pump_hang;
            }
            if (wellparams.tubing_outer_diameter == undefined) {
              delete wellparams.tubing_outer_diameter;
            }
            if (wellparams.casing_inner_diameter == undefined) {
              delete wellparams.casing_inner_diameter;
            }
            if (wellparams.depth == undefined) {
              delete wellparams.depth;
            }
            if (wellparams.watery == undefined) {
              delete wellparams.watery;
            }
            if (wellparams.rated_speed == undefined) {
              delete wellparams.rated_speed;
            }
            if (wellparams.speed == undefined) {
              delete wellparams.speed;
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
            if (wellparams.toplimit == undefined) {
              delete wellparams.toplimit;
            }
            if (wellparams.lowerlimit == undefined) {
              delete wellparams.lowerlimit;
            }
            if (wellparams.offset_angle == undefined) {
              delete wellparams.offset_angle;
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
              run_status: this.addwellForm.run_status,
              output: this.addwellForm.output,
              liquid_level: this.addwellForm.liquid_level,
              motor_power: this.addwellForm.motor_power,
              motor_type: this.addwellForm.motor_type,
              dirving_way: this.addwellForm.dirving_way,
              drive_type: this.addwellForm.drive_type,
              pump_diameter: this.addwellForm.pump_diameter,
              pump_hang: this.addwellForm.pump_hang,
              tubing_outer_diameter: this.addwellForm.tubing_outer_diameter,
              casing_inner_diameter: this.addwellForm.casing_inner_diameter,
              watery: this.addwellForm.watery,
              rated_speed: this.addwellForm.rated_speed,
              speed: this.addwellForm.speed,
              rated_rowArran: this.addwellForm.rated_rowArran,
              pt_install: this.addwellForm.pt_install,
              pc_install: this.addwellForm.pc_install,
              depth: this.addwellForm.depth,
              toplimit: this.addwellForm.toplimit,
              lowerlimit: this.addwellForm.lowerlimit,
              offset_angle:this.addwellForm.offset_angle
            };
            //   console.log(wellparams.dept_id);
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
            if (wellparams.depth == undefined) {
              delete wellparams.depth;
            }
            if (wellparams.well_type == undefined) {
              delete wellparams.well_type;
            }
            if (wellparams.run_status == undefined) {
              delete wellparams.run_status;
            }
            if (wellparams.output == undefined) {
              delete wellparams.output;
            }
            if (wellparams.liquid_level == undefined) {
              delete wellparams.liquid_level;
            }
            if (wellparams.motor_power == undefined) {
              delete wellparams.motor_power;
            }
            if (wellparams.motor_type == undefined) {
              delete wellparams.motor_type;
            }
            if (wellparams.dirving_way == undefined) {
              delete wellparams.dirving_way;
            }
            if (wellparams.drive_type == undefined) {
              delete wellparams.drive_type;
            }
            if (wellparams.pump_diameter == undefined) {
              delete wellparams.pump_diameter;
            }
            if (wellparams.pump_hang == undefined) {
              delete wellparams.pump_hang;
            }
            if (wellparams.tubing_outer_diameter == undefined) {
              delete wellparams.tubing_outer_diameter;
            }
            if (wellparams.casing_inner_diameter == undefined) {
              delete wellparams.casing_inner_diameter;
            }

            if (wellparams.watery == undefined) {
              delete wellparams.watery;
            }
            if (wellparams.rated_speed == undefined) {
              delete wellparams.rated_speed;
            }
            if (wellparams.speed == undefined) {
              delete wellparams.speed;
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
            if (wellparams.toplimit == undefined) {
              delete wellparams.toplimit;
            }
            if (wellparams.lowerlimit == undefined) {
              delete wellparams.lowerlimit;
            }
            if (wellparams.offset_angle == undefined) {
              delete wellparams.offset_angle;
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
    },
    GetwellList() {
      ApiGetWellList().then(res => {
        this.wellList = res.data.msg.well_list;
        // this.total = res.data.msg.total;
      });
    }
  },
  created() {
    this.getDeptList();
  }
};
</script>
<style lang="scss">
#built {
  //   font-size: 12px;
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