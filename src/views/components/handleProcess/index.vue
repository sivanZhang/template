<template>
  <div id="handleProcess">
    <!-- 处置过程子组件 -->
    <div class="content">
      <div v-for="(item, index) of processList" :key="index">
        <div style="display:flex;margin-top:5px">
          <div class="process-item" v-if="item.title !== ''">
            诊断种类：{{ item.title }}
          </div>

          <span class="source">
            <span class="source_span">{{ item.way | djagFilter }}</span>
          </span>
          <!-- <div class="process-item" v-else>
            诊断种类：无
          </div> -->
          <el-button
            v-if="item.status == 0 && auth == true && show == true"
            style="width:75px;height:30px;padding:5px;margin:-5px 0px 0px 10px"
            type="warning"
            @click="handle(item.id, item.title)"
            >立即处置</el-button
          >
        </div>
        <div>创建时间：{{ item.create_time | dateTimeFormat }}</div>
        <div v-if="item.status !== 0">
          <div class="process-item">
            处置时间：{{ item.date_handled | dateTimeFormat }}
          </div>
          <div class="process-item">处置人：{{ item.username }}</div>
          <div class="process-item">处置方式：{{ item.process }}</div>
        </div>
        <div v-else style="margin-top:5px;color:red">该诊断未处置</div>
        <el-divider></el-divider>
      </div>
    </div>
  </div>
</template>

<script>
import { ApiAlarmDeta } from "@/api/alarmManagement";
export default {
  name: "handleProcess",
  props: ["processList", "auth", "show"],
  components: {},
  data() {
    return {
      id: "",
      current: true,
      typeTitle: "",
      complete: false,
      changeBelt: false,
      washWell: false,
      highParam: false,
      param1: false,
      low: "",
      lowParam: false,
      param2: false,
      high: "",
      changePole: false,
      verifyWell: false,
      checkList: [],
      dealContent: ""
    };
  },
  methods: {
    handle(id, title) {
      this.current = true;
      this.complete = false;
      (this.changeBelt = false),
        (this.washWell = false),
        (this.highParam = false),
        (this.low = ""),
        (this.lowParam = false),
        (this.high = ""),
        (this.changePole = false),
        (this.verifyWell = false),
        (this.typeTitle = title);
      this.checkList = [];
      if (title == "皮带断") {
        this.changeBelt = true;
        this.checkList.push("换皮带");
      }
      if (title == "结蜡") {
        this.washWell = true;
        this.checkList.push("洗井");
      }
      if (title == "参数高") {
        this.highParam = true;
        this.param1 = true;
        this.checkList.push("参数高调低为" + this.low);
      }
      if (title == "参数低") {
        this.lowParam = true;
        this.param2 = true;
        this.checkList.push("参数低调高为" + this.high);
      }
      if (title == "杆断") {
        this.changePole = true;
        this.checkList.push("换杆");
      }
      if (title == "漏失") {
        this.verifyWell = true;
        this.checkList.push("核实井况");
      }
      this.dealContent = String(this.checkList);
      this.warningId = id;
      ApiAlarmDeta({ warningid: id }).then(({ data }) => {
        this.alarmDetail = data.msg;
      });
      //调用父组件中的‘change’函数,并且向父组件传递this.current和this.typeTitle这两个参数
      this.$emit(
        "change",
        this.current,
        this.typeTitle,
        this.complete,
        this.changeBelt,
        this.washWell,
        this.highParam,
        this.low,
        this.lowParam,
        this.high,
        this.param1,
        this.param2,
        this.changePole,
        this.verifyWell,
        this.checkList,
        this.dealContent,
        this.warningId
      );
    }
  },
  watch: {
    wellId: {
      handler: function() {
        this.$emit("getHistoryAlarm");
      }
    }
  }
};
</script>
<style lang="scss">
#handleProcess {
  .content {
    margin: 5px;
  }
  .source {
    width: 70px;
    margin-left: 15px;
    background-color: red;
    justify-content: center;
    display: flex;
    align-items: center;
    border-radius: 25px;
  }
  .source_span {
    color: #ffffff;
    font-size: 12px;
  }
}
</style>
