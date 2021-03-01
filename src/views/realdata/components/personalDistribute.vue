<template>
  <!--部门内，全部项目的任务/人员分配图(甘特图表示) -->
  <div id="personalDistribute">
    <!-- 图表形式显示 -->
    <label class="label">部门人员工时统计甘特图</label>
    <el-date-picker
      v-model="dateRange"
      @change="getganttStat()"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
    <div v-loading="ganttStatLoading">
      <div v-if="!ganttStatData.length" class="nothing">暂无数据</div>
      <Gantt
        v-else
        :gantt-data="ganttStatData"
        :customHeaderOption="customHeaderOption"
        :customOptions="customOptions"
      />
    </div>
  </div>
</template>
<script>
import { getDeptMember } from "@/api/statistics";
import { mapState } from "vuex";
import dayjs from "dayjs";
import Gantt from "@/components/Gantt";
export default {
  name: "personalDistribute",
  components: {
    Gantt
  },
  props: {
    // 页面展示形式：true = 图标；false = 表格
    deptId: {
      type: Number
    }
  },
  data() {
    return {
      // 起止时间
      dateRange:[],
      // 传给甘特图的数据
      ganttStatData: [],
      ganttStatLoading: false,
      // 甘特图的header配置,
      customHeaderOption: {
        title: {
          label: ""
        }
      },
      //甘特图的配置
      customOptions: {
        taskList: {
          //甘特图中的表格配置
          columns: [
            {
              id: 1,
              label: "人员名称",
              value: task => {
                if (task.parentId) {
                  return "";
                } else {
                  return task.name;
                }
              },
              width: 130,
              expander: true // 显示 "+" 拓展图标
            },
            {
              id: 2,
              label: "开始时间",
              value: task => dayjs(task.start).format("YYYY-MM-DD"),
              width: 100,
              html: true
            },
            {
              id: 3,
              label: "结束时间",
              value: task => dayjs(task.end).format("YYYY-MM-DD"),
              width: 100
            },
            {
              id: 4,
              label: "计划工时",
              value: "preinstall",
              width: 80
            },
            {
              id: 5,
              label: "实际工时",
              value: "actual",
              width: 80
            },
            {
              id: 6,
              label: "进度",
              value: task => `${task.progress}%`,
              width: 80,
              html: true
            }
          ]
        }
      }
    };
  },
  methods: {
    // 获取甘特图数据
    getganttStat(dept_id = this.deptId) {
      this.ganttStatLoading = true;
      this.ganttStatData = [];
      let data = { dept_id,
      };
      if (this.dateRange && this.dateRange.length) {
        data = {
          ...data,
          start_date:dayjs(this.dateRange[0]).format('YYYY/MM/DD'),
          end_date:dayjs(this.dateRange[1]).format('YYYY/MM/DD')
          }
      }
      // this.kpiList = [];
      getDeptMember(data)
        .then(({ data }) => {
          let arr = [...data.msg];
          this.ganttStatData = [];
          this.ganttStatData = arr.map((t, i) => {
            let obj = {
              id: t[0], // *
              type: "task", // * 甘特图内图形显示类型
              start: t[2] * 1000, // *任务开始时间
              end: t[3] * 1000,
              progress: t[5] || 0, // *进度
              duration: t[4] * 60 * 60 * 1000, // *工时
              label: `${t[1]} (${t[5] || 0}%)`, // *
              collapsed: false, // * 有子节点默认是否收缩
              name: t[1],
              preinstall: t[4],
              actual: t[6]
            };
            if (t[7]) {
              obj.parentId = t[7];
            }
            return obj;
          });
        })
        .finally(() => {
          this.ganttStatLoading = false;
        });
    }
  },
  watch: {
    // 每当父组件串来的deptId变化时重新请求
    deptId: function(newVal) {
      this.getganttStat(newVal)
    }
  },
  created(){
    // 组件第一次加载时执行一次请求
    this.getganttStat()
  }
};
</script>
<style lang="scss" scoped>
.el-table {
  margin-top: 15px;
}
.label{
  margin-right: 15px;
}
#personalDistribute {
  position: relative;
  width: 100%;
  .nothing {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    width: 100%;
  }
}
</style>