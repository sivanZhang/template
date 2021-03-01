<template>
    <el-table :data="recordsList" v-loading="isLoad">
        <el-table-column label="任务" header-align="center">
            <el-table-column label="名称" prop="approve_task__name" header-align="center" />
            <el-table-column label="路径" prop="path" header-align="center" />
            <el-table-column label="内容" prop="approve_task__content" header-align="center" />
            <el-table-column label="状态" align="center" width="50">
                <template slot-scope="scope">
                    {{
                    scope.row.approve_task__status | taskStatus
                    }}
                </template>
            </el-table-column>
            <el-table-column
                label="执行人"
                prop="approve_task_executors"
                header-align="center"
                width="80"
            />
        </el-table-column>
        <el-table-column label="镜头" header-align="center">
            <el-table-column label="镜头号" prop="approve_asset__name" header-align="center" />
            <el-table-column label="缩略图" align="center" width="180" height="100">
                <template slot-scope="scope">
                    <el-image
                        :src="$store.state.BASE_URL+scope.row.approve_asset__image"
                        style="width: 180px;height: 100px;cursor: pointer;"
                        :preview-src-list="[$store.state.BASE_URL+scope.row.approve_asset__image]"
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
            <el-table-column prop="approve_asset__episode" label="集数" header-align="center" />
            <el-table-column prop="approve_asset__session" label="场次"  header-align="center" />
        </el-table-column>
        <el-table-column label="所属项目" prop="approve_task__name" header-align="center" />
        <!-- <el-table-column label="项目" header-align="center">
      <el-table-column label="所属项目" prop="approve_task__name" />
      <el-table-column label="项目类型" prop="project__pro_type" :formatter="projectTypeFormat" />
      <el-table-column label="实习成绩" prop="score" />
        </el-table-column>-->
        <el-table-column label="审批" align="center">
            <el-table-column label="结果" align="center" width="40">
                <template slot-scope="scope">
                    {{
                    scope.row.approve_result ? "同意" : "拒绝"
                    }}
                </template>
            </el-table-column>
            <el-table-column label="意见" prop="suggestion" align="left" />
            <el-table-column label="时间" align="center">
                <template slot-scope="scope">{{ scope.row.date | dateTimeFormat }}</template>
            </el-table-column>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    props: {
        recordsList: {
            default: [],
            type: Array
        },
        isLoad: {
            default: false,
            type: Boolean
        }
    },
    methods: {
        projectTypeFormat(row, column, cellValue, index) {
            if (cellValue) {
                return "标准项目";
            } else {
                return "实训项目";
            }
        }
    }
};
</script>
