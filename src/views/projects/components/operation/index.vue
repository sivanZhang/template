<template>
  <div>
    <div style="padding-top: 10px">
      <div style="padding-bottom: 10px" v-if="auth">
        <el-button
          style="margin-left: 0"
          type="primary"
          @click="openDialog(2)"
          size="medium"
          >固定调参</el-button
        >
        <el-button type="warning" @click="openDialog(3)" size="medium"
          >自动调参</el-button
        >
        <el-button type="primary" @click="openDialog(1)" size="medium"
          >参量修改</el-button
        >
        <el-button type="success" @click="openDialog(4)" size="medium"
          >发送实测值</el-button
        >
        <el-button
          type="warning"
          @click="openDialog(5)"
          size="medium"
          v-if="auth"
          :disabled="wellDetail.status"
          >直接指令发送</el-button
        >
        <!-- <span class="btn-explain" @click="openExplain()">
              提示:
              <svg-icon icon-class="wenhao" />
            </span> -->
      </div>
      <el-table
        :data="orderList"
        stripe
        :border="true"
        style="width: 100%"
        :header-cell-style="{
          color: '#212529',
          fontSize: '16px',
          fontWeight: 400,
        }"
        :row-style="{ fontSize: '16px', color: '#212529;', fontWeight: 400 }"
      >
        <el-table-column
          type="index"
          width="80"
          label="序号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="order_type"
          label="指令类型"
          :formatter="Order_type"
          align="center"
          width="170"
        ></el-table-column>
        <el-table-column
          prop="text"
          label="内容"
          align="center"
          width="400"
        ></el-table-column>
        <el-table-column label="提交时间" align="center" width="150">
          <template slot-scope="scope">{{
            scope.row.date | dateTimeFormat
          }}</template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          :formatter="Status"
          align="center"
        ></el-table-column>
        <el-table-column label="执行日期" align="center" width="150">
          <template slot-scope="scope">{{
            scope.row.exe_date | dateTimeFormat
          }}</template>
        </el-table-column>
        <el-table-column
          prop="result"
          label="执行结果"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center" v-if="auth">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                @click="deleteOrder(scope.row.id)"
                icon="el-icon-delete"
                style="color: red"
                type="text"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="text-align: right">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="pageSizeList"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 10px"
        ></el-pagination>
      </div>
    </div>
    <div class="diag-footer">
      <el-dialog title="参量调整" :visible.sync="dialogVisible1" width="500px">
        <el-form :model="paramModal" ref="paramModal" :rules="rules">
          <el-form-item label="含水率" prop="container">
            <el-input-number
              v-model="paramModal.container"
              :precision="3"
              :step="0.001"
              :min="0"
              :max="1"
              size="medium"
            ></el-input-number>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('container')"
              >确认</el-button
            >
          </el-form-item>
          <el-form-item
            label="冲程 (米)"
            prop="stroke"
            v-if="wellDetail.well_type == 0"
          >
            <el-input-number
              v-model="paramModal.stroke"
              :precision="2"
              :step="0.01"
              :min="0"
              size="medium"
            ></el-input-number>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('stroke')"
              >确认</el-button
            >
          </el-form-item>
          <!-- //泵型跟泵径 -->
          <el-form-item
            :label="wellPumpType"
            prop="pumptype"
            :rules="[{ type: 'number', message: '请输入数字' }]"
          >
            <el-select
              v-model.number="paramModal.pumptype"
              filterable
              placeholder="请选择"
              allow-create
            >
              <el-option
                v-for="(item, index) in pumptypeList"
                :key="item.value + index"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('pumptype')"
              >确认</el-button
            >
          </el-form-item>
          <el-form-item label="泵挂 (米)" prop="pumphanging">
            <el-input-number
              v-model="paramModal.pumphanging"
              :precision="2"
              :step="0.01"
              :min="0"
              size="medium"
            ></el-input-number>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('pumphanging')"
              >确认</el-button
            >
          </el-form-item>
          <el-form-item
            label="平衡块数量"
            prop="banlence"
            placeholder="千瓦"
            v-if="wellDetail.well_type == 0"
          >
            <el-select v-model="paramModal.banlence" placeholder="请选择">
              <el-option
                v-for="(item, index) in balanceNum"
                :key="item.value + index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('banlence')"
              >确认</el-button
            >
          </el-form-item>
          <el-form-item
            label="油管外径尺寸 (毫米)"
            prop="outer_diameter"
            placeholder="毫米"
          >
            <el-input-number
              v-model="paramModal.outer_diameter"
              :min="0"
              size="medium"
            ></el-input-number>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('outer_diameter')"
              >确认</el-button
            >
          </el-form-item>
          <el-form-item
            label="机型"
            prop="pumping_id"
            v-if="wellDetail.well_type == 0"
          >
            <el-select v-model="paramModal.pumping_id" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.type_name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('machine_type')"
              >确认</el-button
            >
          </el-form-item>
          <el-form-item
            label="永磁电动机额定功率 (千瓦)"
            prop="permanent_magnet_motor_rated_power"
            placeholder="千瓦"
            v-if="this.wellDetail.motor_type == 1"
          >
            <el-input-number
              v-model="paramModal.permanent_magnet_motor_rated_power"
              :step="0.01"
              :min="0"
              size="medium"
              :precision="2"
            ></el-input-number>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('permanent_magnet_motor_rated_power')"
              >确认</el-button
            >
          </el-form-item>
          <el-form-item
            label="异步电动机额定功率 (千瓦)"
            prop="asynchronous_motor_rated_power"
            placeholder="千瓦"
            v-if="this.wellDetail.motor_type == 0"
          >
            <el-input-number
              v-model="paramModal.asynchronous_motor_rated_power"
              :step="0.01"
              :min="0"
              size="medium"
              :precision="2"
            ></el-input-number>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('asynchronous_motor_rated_power')"
              >确认</el-button
            >
          </el-form-item>
          <el-form-item
            label="是否停止周期性自动测产参量"
            prop="param_cechan"
            placeholder="千瓦"
          >
            <el-switch
              v-model="paramModal.param_cechan"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('param_cechan')"
              >确认</el-button
            >
          </el-form-item>
          <el-form-item
            label="更换驱动装置"
            prop="param_huan_jiansuqi"
            placeholder="千瓦"
            v-if="wellDetail.well_type == 1"
          >
            <el-select
              v-model="paramModal.param_huan_jiansuqi"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in reducer"
                :key="item.value + index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('param_huan_jiansuqi')"
              >确认</el-button
            >
          </el-form-item>
          <el-form-item
            label="1、3平衡块重量（千牛）"
            prop="param_balance_big_weight"
            placeholder="千瓦"
            v-if="wellDetail.well_type == 0"
          >
            <el-input-number
              v-model="paramModal.param_balance_big_weight"
              :step="0.001"
              size="medium"
              :min="0"
              :precision="3"
            ></el-input-number>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('param_balance_big_weight')"
              >确认</el-button
            >
          </el-form-item>
          <el-form-item
            label="2、4平衡块重量（千牛）"
            prop="param_balance_small_weight"
            placeholder="千瓦"
            v-if="wellDetail.well_type == 0"
          >
            <el-input-number
              v-model="paramModal.param_balance_small_weight"
              :step="0.001"
              size="medium"
              :min="0"
              :precision="3"
            ></el-input-number>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('param_balance_small_weight')"
              >确认</el-button
            >
          </el-form-item>
          <el-form-item
            label="平衡块尺寸1 (米)"
            prop="param_balance_size1"
            placeholder="千瓦"
            v-if="wellDetail.well_type == 0"
          >
            <el-input-number
              v-model="paramModal.param_balance_size1"
              :step="0.001"
              size="medium"
              :min="0"
              :precision="3"
            ></el-input-number>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('param_balance_size1')"
              >确认</el-button
            >
          </el-form-item>
          <el-form-item
            label="平衡块尺寸2 (米)"
            prop="param_balance_size2"
            placeholder="千瓦"
            v-if="wellDetail.well_type == 0"
          >
            <el-input-number
              v-model="paramModal.param_balance_size2"
              :step="0.001"
              :min="0"
              size="medium"
              :precision="3"
            ></el-input-number>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('param_balance_size2')"
              >确认</el-button
            >
          </el-form-item>

          <el-form-item
            label="平衡块尺寸3 (米)"
            prop="param_small_balance_size1"
            placeholder="千瓦"
            v-if="wellDetail.well_type == 0"
          >
            <el-input-number
              v-model="paramModal.param_small_balance_size1"
              :step="0.001"
              size="medium"
              :min="0"
              :precision="3"
            ></el-input-number>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('param_small_balance_size1')"
              >确认</el-button
            >
          </el-form-item>
          <el-form-item
            label="平衡块尺寸4 (米)"
            prop="param_small_balance_size2"
            placeholder="千瓦"
            v-if="wellDetail.well_type == 0"
          >
            <el-input-number
              v-model="paramModal.param_small_balance_size2"
              :step="0.001"
              size="medium"
              :min="0"
              :precision="3"
            ></el-input-number>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('param_small_balance_size2')"
              >确认</el-button
            >
          </el-form-item>
          
          <el-form-item
            label="曲柄重量 (千牛)"
            prop="param_qubing_weight"
            placeholder="千瓦"
            v-if="wellDetail.well_type == 0"
          >
            <el-input-number
              v-model="paramModal.param_qubing_weight"
              :step="0.001"
              :min="0"
              size="medium"
              :precision="3"
            ></el-input-number>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('param_qubing_weight')"
              >确认</el-button
            >
          </el-form-item>
          <el-form-item
            label="销子重量 (千牛)"
            prop="param_xiaozi_weight"
            placeholder="千瓦"
            v-if="wellDetail.well_type == 0"
          >
            <el-input-number
              v-model="paramModal.param_xiaozi_weight"
              :step="0.001"
              size="medium"
              :min="0"
              :precision="3"
            ></el-input-number>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('param_xiaozi_weight')"
              >确认</el-button
            >
          </el-form-item>
          <el-form-item
            label="曲柄尺寸 (米)"
            prop="param_qubing_size"
            placeholder="千瓦"
            v-if="wellDetail.well_type == 0"
          >
            <el-input-number
              v-model="paramModal.param_qubing_size"
              :step="0.001"
              :min="0"
              size="medium"
              :precision="3"
            ></el-input-number>
            <el-button
              type="primary"
              class="buttonConfirm"
              @click="paramForm('param_qubing_size')"
              >确认</el-button
            >
          </el-form-item>
          <div class="butn">
            <el-button @click="cancel(1)" class="buttonConfirm">取消</el-button>
          </div>
        </el-form>
      </el-dialog>
      <el-dialog title="手动调参" :visible.sync="dialogVisible2" width="380px">
        <el-form
          :model="freguencyModal"
          ref="freguency-modal"
          label-width="100px"
          :rules="rules"
        >
          <span v-if="wellDetail.well_type == 0">
            <el-form-item label="冲次" prop="freguency">
              <el-input-number
                v-model="freguencyModal.freguency"
                :min="0"
                :precision="1"
                :step="0.1"
              ></el-input-number>
            </el-form-item>
          </span>
          <span v-if="wellDetail.well_type == 1">
            <el-form-item label="转速" prop="freguency">
              <el-input-number
                v-model="freguencyModal.freguency"
                :min="0"
                :precision="1"
                :step="0.1"
              ></el-input-number>
            </el-form-item>
          </span>
          <div class="butn">
            <el-button @click="cancel(2)" style="width: 60px; height: 30px"
              >取消</el-button
            >
            <el-button
              type="primary"
              @click="freguencyForm('freguencyModal')"
              style="width: 60px; height: 30px"
              >确认</el-button
            >
          </div>
        </el-form>
      </el-dialog>
      <el-dialog title="自动调参" :visible.sync="dialogVisible3" width="380px">
        <span>确定执行自动调参</span>
        <div class="butn">
          <el-button @click="cancel(3)" style="width: 60px; height: 30px"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="autoFreguency()"
            style="width: 60px; height: 30px"
            >确认</el-button
          >
        </div>
      </el-dialog>
      <el-dialog
        title="发送实测数据"
        :visible.sync="dialogVisible4"
        width="500px"
      >
        <el-form :model="readdataBtn" ref="readdata-btn" :rules="rules">
          <el-form-item label="声波实测液面值" prop="realLevel ">
            <el-input-number
              v-model="readdataBtn.realLevel"
              :precision="0"
              :min="1"
              :step="1"
            ></el-input-number>
            <el-button
              type="primary"
              @click="realdataForm('realLevel')"
              class="buttonConfirm"
              >确认</el-button
            >
          </el-form-item>
          <el-form-item
            label="计量间实测产量值"
            prop="dataOutput"
            style="margin-top: 60px"
          >
            <el-input-number
              v-model="readdataBtn.dataOutput"
              :precision="2"
              :min="0.05"
              :step="0.01"
            ></el-input-number>
            <el-button
              type="primary"
              @click="realdataForm('dataOutput')"
              class="buttonConfirm"
              >确认</el-button
            >
          </el-form-item>
          <div class="butn-bottom">
            <div class="butn-explain">提示：建议要启机运行平稳后测量实测值!</div>
            <div class="butn">            
              <el-button @click="cancel(4)" class="buttonConfirm">取消</el-button>
            </div>
          </div>          
        </el-form>
      </el-dialog>
      <el-dialog title="指令发送" :visible.sync="dialogVisible5" width="450px">
        <el-form :model="anyOrderModal" ref="any-order-modal" :rules="rules">
          <el-form-item label="十六进制指令" prop="anyOrder">
            <el-input
              v-model="anyOrderModal.anyOrder"
              placeholder="f1 00 0e 05 00 20 00"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <div class="butn">
            <el-button @click="cancel(5)" class="buttonConfirm">取消</el-button>
            <el-button
              type="primary"
              @click="anyOrderForm('anyOrderModal')"
              style="width: 60px; height: 30px"
              >确认</el-button
            >
          </div>
        </el-form>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="explainVisible" width="365px">
        <div style="font-size: 14px">
          <span style="font-weight: bold">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;指令可以随时发送，但是发送完之后并没有将指令发送到现场设备里，
            而是存储在上位机。等到现场系统发送可以执行这些指令的代码后，
            才会从上机位调出这些指令进行执行。
          </span>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  ApiGetWellRecord,
  ApiGetOrders,
  ApiCreateOrder,
  ApiDeleteOrder,
} from "@/api/welldetail";
import { ApiSearchPumping } from "@/api/wellList";
export default {
  props: ["wellDetail", "auth"],
  data() {
    return {
      explainVisible: false,
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      number: "",
      well_type: "",
      id: this.$route.params.id,
      orderList: [],
      data: "",
      rules: {},
      paramModal: {},
      freguencyModal: { freguency: 0 },
      options: [], //机型
      reducer: [
        {
          value: "11",
          label: "驱动形式L3",
        },
        {
          value: "22",
          label: "驱动形式L4",
        },
        {
          value: "33",
          label: "驱动形式L5",
        },
        {
          value: "44",
          label: "驱动形式直驱",
        },
      ],
      balanceNum: [
        {
          value: "1",
          label: "4个大平衡块",
        },
        {
          value: "2",
          label: "4个小平衡块",
        },
        {
          value: "3",
          label: "2个大平衡块",
        },
        {
          value: "4",
          label: "2个小平衡块",
        },
        {
          value: "5",
          label: "2个大平衡块和2个小平衡块",
        },
        {
          value: "6",
          label: "没有平衡块",
        },
      ],
      banlence_num: "", //平衡块数量
      machine_type: "", //机型
      drive_type: "", //驱动装置
      zhouqixing_cechan: "", //周期测产，自动0，停止5000
      pumptypeListChouyou: [
        //抽油机的泵径列表
        { value: "28" },
        { value: "32" },
        { value: "38" },
        { value: "44" },
        { value: "45" },
        { value: "51" },
        { value: "56" },
        { value: "57" },
        { value: "64" },
        { value: "70" },
        { value: "83" },
        { value: "95" },
      ],
      pumptypeListLuogan: [
        //螺杆泵的泵型列表
        { value: "40" },
        { value: "65" },
        { value: "75" },
        { value: "90" },
        { value: "104" },
        { value: "120" },
        { value: "200" },
        { value: "300" },
        { value: "400" },
        { value: "500" },
        { value: "555" },
        { value: "800" },
        { value: "1200" },
        { value: "1400" },
        { value: "1600" },
        { value: "2000" },
      ],
      pumptypeList: [],
      readdataBtn: {
        realLevel: 0,
        dataOutput: 0,
      },
      anyOrderModal: {
        anyOrder: "",
      },
      // label:'',
      wellPumpType: "",
      total: 0,
      pageCount: 0,
      currentPage: 1,
      pageSize:10,
      pageSizeList: [10, 30, 50, 100],
    };
  },
  created() {
    this.getOrderList();
    // 获取机型
    this.getPumping();
  },
  watch: {
    wellDetail: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          if (newVal.well_type == 1) {
            //  螺杆泵是泵型
            this.wellPumpType = "泵型 (毫米)";
            this.pumptypeList = this.pumptypeListLuogan;
          } else {
            // 抽油机泵径
            this.wellPumpType = "泵径 (毫米)";
            this.pumptypeList = this.pumptypeListChouyou;
          }
        }
      },
    },
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getOrderList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getOrderList();
    },
    getPumping() {
      ApiSearchPumping().then(({ data }) => {
        this.options = data.msg;
      });
    },
    // 打开提示
    openExplain() {
      this.explainVisible = true;
    },
    //获取指令列表
    getOrderList() {
      let params = {
        wellid: this.id,
        page: this.currentPage,
        pagenum: this.pageSize,
      };
      ApiGetOrders(params).then((res) => {
        this.total = res.data.total;
        this.orderList = res.data.msg;
      });
    },
    Order_type: function (row, column) {
      switch (row.order_type) {
        case 0:
          return " 现场系统允许可进行调参或自动调参指令";
          break;
        case 1:
          return "现场系统可接收动液面、产液量值指令";
          break;
        case 2:
          return "现场系统调参";
          break;
        case 3:
          return "参量调整";
          break;
        case 4:
          return "直接指令";
          break;
      }
    },
    Status: function (row, column) {
      switch (row.status) {
        case 0:
          return "未执行";
        case 1:
          return "已执行";
        case 2:
          return "已发送";
        case 3:
          return "发送失败";
      }
    },
    openDialog(Type) {
      switch (Type) {
        case 1:
          // 参量修改
          this.dialogVisible1 = true;
          this.balanceNum.forEach((item, index) => {
            if (item.value == this.wellDetail.balance_num) {
              this.banlence_num = item.value;
            }
          });
          this.options.forEach((item, index) => {
            if (item.series == this.wellDetail.pumping_type.type_name) {
              this.machine_type = item.type_name;
            }
          });
          this.reducer.forEach((item, index) => {
            if (item.value == this.wellDetail.drive_type) {
              this.drive_type = item.label;
            }
          });
          if (this.wellDetail.zhouqixing_cechan != null) {
            this.zhouqixing_cechan =
              this.wellDetail.zhouqixing_cechan == 0 ? false : true;
          } else {
            this.zhouqixing_cechan = undefined;
          }
          // if(this.wellDetail.well_type ==1){
          //   this.label = "转速 (转)"
          //   this.stroke_speed = this.wellDetail.speed?this.wellDetail.speed:undefined
          // }else{
          //   this.label = "冲程 (米)"
          //   this.stroke_speed = this.wellDetail.stroke?this.wellDetail.stroke:undefined
          // }
          // console.log(this.wellDetail);
          this.paramModal = {
            container:
              this.wellDetail.watery == null
                ? undefined
                : this.wellDetail.watery,
            stroke: this.wellDetail.stroke ? this.wellDetail.stroke : undefined,
            pumptype:
              this.wellDetail.pump_diameter == null
                ? undefined
                : this.wellDetail.pump_diameter,
            pumphanging:
              this.wellDetail.pump_hang == null
                ? undefined
                : this.wellDetail.pump_hang,
            banlence: this.banlence_num == null ? undefined : this.banlence_num,
            outer_diameter:
              this.wellDetail.tubing_outer_diameter == null
                ? undefined
                : this.wellDetail.tubing_outer_diameter,
            pumping_id:
              this.wellDetail.pumping_type.type_name == null
                ? undefined
                : this.wellDetail.pumping_type.type_name,
            permanent_magnet_motor_rated_power:
              this.wellDetail.motor_type == 1
                ? this.wellDetail.motor_power
                : undefined,
            asynchronous_motor_rated_power:
              this.wellDetail.motor_type == 0
                ? this.wellDetail.motor_power
                : undefined,
            param_cechan: this.zhouqixing_cechan,
            param_huan_jiansuqi:
              this.drive_type == null ? undefined : this.drive_type,
            param_balance_big_weight:
              this.wellDetail.weight_1_big_balance == null
                ? undefined
                : this.wellDetail.weight_1_big_balance,
            param_balance_small_weight:
              this.wellDetail.weight_2_big_balance == null
                ? undefined
                : this.wellDetail.weight_2_big_balance,
            param_balance_size1: this.wellDetail.size_1_big_balance
              ? this.wellDetail.size_1_big_balance
              : 0,
            param_balance_size2: this.wellDetail.size_2_big_balance
              ? this.wellDetail.size_2_big_balance
              : 0,
            param_small_balance_size1: this.wellDetail.size_1_small_balance
              ? this.wellDetail.size_1_small_balance
              : 0,
            param_small_balance_size2: this.wellDetail.size_2_small_balance
              ? this.wellDetail.size_2_small_balance
              : 0,
            param_qubing_weight: this.wellDetail.weight_1_crank
              ? this.wellDetail.weight_1_crank
              : 0,
            param_xiaozi_weight: this.wellDetail.crank_pin_weight
              ? this.wellDetail.crank_pin_weight
              : 0,
            param_qubing_size: this.wellDetail.size_1_crank
              ? this.wellDetail.size_1_crank
              : 0,
          };
          break;
        case 2:
          // 固定调参
          this.dialogVisible2 = true;
          if (this.wellDetail.well_type == 0) {
            // 冲程
            this.freguencyModal.freguency = this.wellDetail.impulse_times
              ? this.wellDetail.impulse_times
              : 0;
          } else {
            // 转速
            this.freguencyModal.freguency = this.wellDetail.speed
              ? this.wellDetail.speed
              : 0;
          }
          break;
        case 3:
          // 自动调参
          this.dialogVisible3 = true;
          break;
        case 4:
          // 发送实测值
          this.dialogVisible4 = true;
          this.readdataBtn = {
            realLevel: this.wellDetail.liquid_level
              ? this.wellDetail.liquid_level
              : 0,
            dataOutput: this.wellDetail.out_put ? this.wellDetail.out_put : 0,
          };
          break;
        case 5:
          // 直接指令发送
          this.dialogVisible5 = true;
          break;
      }
    },
    //参量调整
    paramForm(paramModal) {
      this.$refs["paramModal"].validate((valid) => {
        if (valid) {
          let paramModalAgo = {
            container:
              this.wellDetail.watery == null
                ? undefined
                : this.wellDetail.watery,
            stroke: this.wellDetail.stroke ? this.wellDetail.stroke : undefined,
            pumptype:
              this.wellDetail.pump_diameter == null
                ? undefined
                : this.wellDetail.pump_diameter,
            pumphanging:
              this.wellDetail.pump_hang == null
                ? undefined
                : this.wellDetail.pump_hang,
            banlence: this.balance_num == null ? undefined : this.balance_num,
            outer_diameter:
              this.wellDetail.tubing_outer_diameter == null
                ? undefined
                : this.wellDetail.tubing_outer_diameter,
            pumping_id:
              this.machine_type == null ? undefined : this.machine_type,
            permanent_magnet_motor_rated_power:
              this.wellDetail.motor_type == 0
                ? this.wellDetail.motor_power
                : undefined,
            asynchronous_motor_rated_power:
              this.wellDetail.motor_type == 1
                ? this.wellDetail.motor_power
                : undefined,
            param_cechan: this.zhouqixing_cechan,
            param_huan_jiansuqi:
              this.drive_type == null ? undefined : this.drive_type,
            param_balance_big_weight:
              this.wellDetail.weight_1_big_balance == null
                ? undefined
                : this.wellDetail.weight_1_big_balance,
            param_balance_small_weight:
              this.wellDetail.weight_1_small_balance == null
                ? undefined
                : this.wellDetail.weight_1_small_balance,
            param_balance_size1: this.wellDetail.size_1_big_balance
              ? this.wellDetail.size_1_big_balance
              : 0,
            param_balance_size2: this.wellDetail.size_2_big_balance
              ? this.wellDetail.size_2_big_balance
              : 0,
            param_small_balance_size1: this.wellDetail.size_1_small_balance
              ? this.wellDetail.size_1_small_balance
              : 0,
            param_small_balance_size2: this.wellDetail.size_2_small_balance
              ? this.wellDetail.size_2_small_balance
              : 0,
            param_qubing_weight: this.wellDetail.weight_1_crank
              ? this.wellDetail.weight_1_crank
              : 0,
            param_xiaozi_weight: this.wellDetail.crank_pin_weight
              ? this.wellDetail.crank_pin_weight
              : 0,
            param_qubing_size: this.wellDetail.size_1_crank
              ? this.wellDetail.size_1_crank
              : 0,
          };
          let param = {
            well_no: this.number,
            param: "",
          };
          switch (paramModal) {
            case "container":
              param.container = this.paramModal.container;
              break;
            case "stroke":
              param.stroke = this.paramModal.stroke;
              break;
            case "pumptype":
              param.pumptype = this.paramModal.pumptype;
              break;
            case "pumphanging":
              param.pumphanging = this.paramModal.pumphanging;
              break;
            case "banlence":
              param.banlence = this.paramModal.banlence;
              break;
            case "outer_diameter":
              param.outer_diameter = this.paramModal.outer_diameter;
              break;
            case "machine_type":
              param.pumping_id = this.paramModal.pumping_id;
              this.options.forEach((item, index) => {
                if (item.id == param.pumping_id) {
                  param.machine_type = item.series;
                }
              });
              break;
            case "permanent_magnet_motor_rated_power":
              param.permanent_magnet_motor_rated_power = this.paramModal.permanent_magnet_motor_rated_power;
              break;
            case "asynchronous_motor_rated_power":
              param.asynchronous_motor_rated_power = this.paramModal.asynchronous_motor_rated_power;
              break;
            case "param_cechan":
              param.param_cechan =
                this.paramModal.param_cechan == true ? 5000 : 0;
              break;
            case "param_huan_jiansuqi":
              param.param_huan_jiansuqi = this.paramModal.param_huan_jiansuqi;
              break;
            case "param_balance_big_weight":
              param.param_balance_big_weight = this.paramModal.param_balance_big_weight;
              break;
            case "param_balance_small_weight":
              param.param_balance_small_weight = this.paramModal.param_balance_small_weight;
              break;
            case "param_balance_size1":
              param.param_balance_size1 = this.paramModal.param_balance_size1;
              break;
            case "param_balance_size2":
              param.param_balance_size2 = this.paramModal.param_balance_size2;
              break;
            case "param_small_balance_size1":
              param.param_small_balance_size1 = this.paramModal.param_small_balance_size1;
              break;
            case "param_small_balance_size2":
              param.param_small_balance_size2 = this.paramModal.param_small_balance_size2;
              break;
            case "param_qubing_weight":
              param.param_qubing_weight = this.paramModal.param_qubing_weight;
              break;
            case "param_xiaozi_weight":
              param.param_xiaozi_weight = this.paramModal.param_xiaozi_weight;
              break;
            case "param_qubing_size":
              param.param_qubing_size = this.paramModal.param_qubing_size;
              break;
          }
          ApiCreateOrder(param).then((res) => {
            if (res.data.status === 0) {
              this.$message.success(res.data.msg);
              this.getOrderList();
              // // 调用父组件的“获取指令列表”函数
              this.$emit("getWellDetails");
              // this.dialogVisible1 = false;
              // this.paramModal = paramModalAgo
            } else {
              this.$message.error(res.data.msg);
              this.paramModal = paramModalAgo;
            }
          });
        }
      });
    },
    //固定调参
    freguencyForm(freguencyModal) {
      let freguency = {};
      freguency = {
        well_no: this.number,
        frequency: this.freguencyModal.freguency,
      };
      ApiCreateOrder(freguency).then((res) => {
        if (res.data.status === 0) {
          this.$message.success(res.data.msg);
          // 调用父组件的“获取油井详情”函数
          this.$emit("getWellDetails");
          this.getOrderList();
          this.dialogVisible2 = false;
          this.freguencyModal = {
            freguency: 0,
          };
        } else {
          this.$message.error(res.data.msg);
          if (this.wellDetail.well_type == 0) {
            // 冲程
            this.freguencyModal.freguency = this.wellDetail.impulse_times
              ? this.wellDetail.impulse_times
              : 0;
          } else {
            // 转速
            this.freguencyModal.freguency = this.wellDetail.speed
              ? this.wellDetail.speed
              : 0;
          }
        }
      });
    },
    //自动调参
    autoFreguency() {
      ApiCreateOrder({ well_no: this.number, auto: "" }).then((res) => {
        if (res.data.status === 0) {
          this.$message.success(res.data.msg);
          this.dialogVisible3 = false;
          this.getOrderList();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //发送实测值
    realdataForm(readdataBtn) {
      let rel = { well_no: this.number };
      switch (readdataBtn) {
        case "realLevel":
          rel.real_level = this.readdataBtn.realLevel;
          break;
        case "dataOutput":
          rel.data_output = this.readdataBtn.dataOutput;
          break;
      }
      ApiCreateOrder(rel).then((res) => {
        if (res.data.status === 0) {
          this.$message.success(res.data.msg);
          // this.dialogVisible4 = false;
          //  调用父组件的“获取油井详情”函数
          this.$emit("getWellDetails");
          this.getOrderList();
        } else {
          this.$message.error(res.data.msg);
          this.readdataBtn = {
            realLevel: this.wellDetail.liquid_level
              ? this.wellDetail.liquid_level
              : 0,
            dataOutput: this.wellDetail.out_put ? this.wellDetail.out_put : 0,
          };
        }
      });
    },
    //直接指令发送
    anyOrderForm(anyOrderModal) {
      let order = {};
      order = {
        well_no: this.number,
        any_order: this.anyOrderModal.anyOrder,
      };
      ApiCreateOrder(order).then((res) => {
        if (res.data.status === 0) {
          this.$message.success(res.data.msg);
          this.dialogVisible5 = false;
          this.anyOrderModal = { anyOrder: "" };
          //  调用父组件的“获取油井详情”函数
          this.$emit("getWellDetails");
          this.getOrderList();
        } else {
          this.$message.error(res.data.msg);
          this.anyOrderModal = { anyOrder: "" };
        }
      });
    },
    //指令删除
    deleteOrder(id) {
      this.$confirm("此操作将永久删除指令, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        ApiDeleteOrder({ id: id, method: "delete" }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            //  调用父组件的“获取油井详情”函数
            this.getOrderList();
          }
        });
      });
    },
    cancel(Type) {
      //取消参量修改
      if (Type === 1) {
        this.dialogVisible1 = false;
      }
      //取消手动调参
      if (Type === 2) {
        this.dialogVisible2 = false;
        this.freguencyModal = { freguency: 0 };
      }
      //取消自动调参
      if (Type === 3) {
        this.dialogVisible3 = false;
      }
      //取消发送实测值
      if (Type === 4) {
        this.dialogVisible4 = false;
        this.readdataBtn = {
          realLevel: 0,
          dataOutput: 0,
        };
      }
      //取消指令发送
      if (Type === 5) {
        this.dialogVisible5 = false;
        this.$refs["any-order-modal"].resetFields();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-explain {
  padding-left: 10px;
  font-size: 12px;
  color: #808080;
  cursor: pointer;
}
.butn {
  text-align: right;
  margin-top: 30px;
}
.butn-explain {
  font-size: 12px;
  margin-top: 30px;
}
.butn-bottom{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.buttonConfirm {
  width: 60px;
  height: 30px;
  margin-top: 0;
  margin-left: 10px;
}
</style>

