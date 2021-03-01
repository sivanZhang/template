<template>
  <div id="linkTaskOutput">
    <!-- 关联任务输出 -->
    <el-row>
      <el-col :span="10">
        <div style="padding:5px 0px">
          <label for>上一环节任务输出</label>
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="TaskOutput"
      :border="true"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="width:100%"
    >
      <el-table-column prop="link_content" label="环节名称" width="80" />
      <el-table-column prop="task_name" label="任务名称" width="80" />
      <el-table-column prop="task_content" label="任务内容" />
      <el-table-column prop="path" label="输出文件的路径" width="200">
        <template slot-scope="scope">
          {{ scope.row.path }}
          <el-button :disabled="!scope.row.path" type="text" @click="handelClick(scope.row.path)">导入</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="10">
        <div style="padding:15px 0px">
          <label for>镜头的其他任务输出</label>
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="AssetOutput"
      :border="true"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="width:100%"
    >
      <el-table-column prop="link_content" label="环节名称" width="80" />
      <el-table-column prop="task_name" label="任务名称" width="80" />
      <el-table-column prop="task_content" label="任务内容" />

      <el-table-column prop="path" label="输出文件的路径" width="200" />
    </el-table>
  </div>
</template>

<script>
import QWebChannel from '@/views/myTask/plugin/qwebchannel.js'
import { getLinkOutput } from '@/api/task'
export default {
  name: 'LinkTaskOutput',
  data() {
    return {
      TaskOutput: [],
      AssetOutput: []
    }
  },
  created() {
    // this.getlinkTaskOutput();
  },
  methods: {
    handelClick(path) {
      new QWebChannel(qt.webChannelTransport, function({ objects }) {
        objects.app_manager.text = `read@${path}`
      })
    },
    // 父组件直接通过$refs[组件ref值].getlinkTaskOutput(task的id)即可请求列表，切换筛选时自动调用的
    getlinkTaskOutput(task_id) {
      getLinkOutput({ task_id: task_id }).then(({ data }) => {
        this.TaskOutput = data.other_task_output
        this.AssetOutput = data.parent_link_output
      })
    }
  }
}
</script>

<style>
</style>

