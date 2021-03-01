// 统计相关http API
import AXIOS from '@/utils/request'
// 获取项目进度统计
export function getProjectStatistic(params) {
    return AXIOS.get('api/statistic/project/', {
        params
    })
}
// 获取镜头状态统计
export function getAssetStatistic(params) {
    return AXIOS.get('api/statistic/asset/', {
        params
    })
}
// 获取任务状态统计
export function getTaskStatistic(params) {
    return AXIOS.get('api/statistic/task/', {
        params
    })
}
// 获取任务甘特图数据
export function getGanttData(params) {
    return AXIOS.get('api/projects/stat/', {
        params
    })
}
// 燃尽图接口
export function burnOut(params) {
    return AXIOS.get('api/projects/stat/', {
        params
    })
}
// 外包
export function exportTask(params) {
    return AXIOS.get('api/projects/stat/', {
        params
    })
}
// 查询项目提交次数
export function proCommitCount(params) {
    return AXIOS.get('api/projects/submitrecord/', {
        params
    })
}

// 统计项目成员的资产和任务信息
export function statisticMemberDetail(params) {
    return AXIOS.get('api/statistic/member/', {
        params
    })
}
// 成员排名
export function MemberSort(params) {
    return AXIOS.get('api/statistic/score/', {
        params
    })
}

//获取执行人
export function getingExecutorChart(params) {
    return AXIOS.get('api/projects/stat/?05', {
        params
    })
}

//获取练习生项目下某分组的任务完成情况
export function trainTask(params) {
    return AXIOS.get('api/statistic/task/', {
        params
    })
}
//获取个人练习生画像雷达数据
export function getRange(params) {
    return AXIOS.get('api/projects/range/', {
        params
    })
}
//组内考勤统计
export function checkInAll(params) {
    return AXIOS.get('api/projects/range/?01', {
        params
    })
}

//获取项目参与人员
export function getProjectMember(params) {
    return AXIOS.get('api/projects/stat/?09', {
        params
    })
}
//获取项目任务中执行人列表
export function getProjectTaskMember(params) {
    return AXIOS.get('api/projects/stat/?task_executors', {
        params
    })
}
//获取项目中的场次和集数
export function getEpisodeSession(params) {
    return AXIOS.get('api/projects/projects/', {
        params
    })
}

//获取人员工时
export function getMemberTime(params) {
    return AXIOS.get('api/task/freetime/', {
        params
    })
}
// 资产实际耗时与计划耗时top10
export function assetTime(params) {
    return AXIOS.get('api/assets/assettime/', {
        params
    })
}
//查询kpi
export function searchKpi(params) {
    return AXIOS.get('api/task/kpi/', {
        params
    })
}
//部门kpi
export function searchDepartmentKpi(params) {
    return AXIOS.get('api/task/dept_kpi/', {
        params
    })
}
//部门本月的总工时实际工时和空闲工时
export function getDepartmentTime(params) {
    return AXIOS.get('api/projects/dept_worktime/', {
        params
    })
}
//查询项目中超时的镜头
export function getOverDueAsset(params) {
    return AXIOS.get('api/statistic/asset/?overdue', {
        params
    })
}
//统计超期的任务数量和任务执行人的排名
export function getOverDueTask(params) {
    return AXIOS.get('api/statistic/task/?overdue', {
        params
    })
}
//查询项目中提交审批数目最多的资产和任务
export function getAssetMaxSubmit(params) {
    return AXIOS.get('api/statistic/asset/', {
        params
    })
}
//按照部门去看人员的甘特图
export function getDeptMember(params) {
    return AXIOS.get('api/task/dept_member_gantt/', {
        params
    })
}

//获取某项目下所有的环节
export function getOneProjectLinks(params) {
    return AXIOS.get('api/projects/projects/?id=&dept', { params })
}