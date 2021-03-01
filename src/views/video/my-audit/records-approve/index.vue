<template>
    <div id="records-approve">
        <el-card class="custom-card"  shadow="never">
            <header class="inputs-warp">
                <div>
                    <label class="input-label">任务名称:</label>
                    <el-input v-model="httpParams.task_name" placeholder="请输入内容" clearable />
                </div>
                <div>
                    <label class="input-label">镜头号:</label>
                    <el-input v-model="httpParams.asset_name" placeholder="请输入内容" clearable />
                </div>
                <div>
                    <label class="input-label">审批结果:</label>
                    <el-select v-model="httpParams.approve_result" placeholder="请选择" style="width:120px;">
                        <el-option label="同意" :value="1"></el-option>
                        <el-option label="拒绝" :value="0"></el-option>
                    </el-select>
                </div>
                <div>
                    <label class="input-label">任务内容:</label>
                    <el-input v-model="httpParams.task_content" placeholder="请输入内容" clearable />
                </div>
                <el-button-group>
                    <el-button type="primary" @click="get_Records">查询</el-button>
                    <el-button @click="handelResetParams">重置</el-button>
                </el-button-group>
            </header>
        </el-card>
        <RecordsTable :records-list="recordsList" :is-load="isLoad" />
        <el-pagination
            class="text-right"
            :current-page="httpParams.page"
            @size-change="handleSizeChange"
            :page-sizes="pageSizes"
            @current-change="handleCurrentChange"
            :page-size="httpParams.pagenum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="resultTotal"
        />
    </div>
</template>

<script>
import { getRecords } from '@/api/video'
// table组件分离
import RecordsTable from './records-approve_table'
export default {
  name: 'PecordsApprove',
  components: {
    RecordsTable
  },
  data() {
    return {
      httpParams: {
        pagenum: 20,
        page: 1
      },
      // 表格数据
      recordsList: [],
      isLoad: false,
      resultTotal: 0,
      pageSizes: [20, 30, 50, 100]
    }
  },
  created() {
    this.get_Records()
  },
  methods: {
    // 监听分页每页大小改变
    handleSizeChange(pageSize) {
      this.httpParams.pagenum = pageSize
      this.get_Records()
    },
    // 监听是否换页
    handleCurrentChange(currentPage) {
      this.httpParams.page = currentPage
      this.get_Records()
    },
    // 重置
    handelResetParams() {
      this.httpParams = {
        pagenum: 20,
        page: 1
      }
      this.get_Records()
    },
    // http查询我的审核记录数据
    get_Records() {
      // 去掉空值参数
      Object.keys(this.httpParams).forEach(t => {
        if (!this.httpParams[t] && this.httpParams[t] !== 0) {
          delete this.httpParams[t]
        }
      })
      this.isLoad = true
      getRecords(this.httpParams)
        .then(({ data }) => {
          if (data.status === 0) {
            this.resultTotal = data.count
            this.recordsList = data.msg
          } else {
            this.$message.warning(data.masg)
          }
        })
        .finally(() => {
          this.isLoad = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
#records-approve {
    .el-card {
        border-radius: 0px;
    }
    .inputs-warp {
        display: flex;
        flex-flow: row wrap;
        align-items: flex-end;
        justify-content: space-between;
        & > * {
            margin-bottom: 10px;
        }
        .input-label {
            width: 70px;
            display: block;
            font-weight: 100;
            font-size: 12px;
            margin-bottom: 4px;
            & + * {
                width: 200px;
            }
        }
    }
    .el-table {
        margin: 15px 0;
    }
}
</style>
