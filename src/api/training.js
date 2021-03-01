import AXIOS from '@/utils/request'
//获取练习项目
export function getTrainingProject(params) {
    return AXIOS.get('api/projects/training_projects/', { params })
}

// 获取项目参与人员（练习项目的练习生）
export function getProjectJoinMeb(params) {
    return AXIOS.get('api/projects/stat/', { params })
}

//创建阶段
export function createGroup(data) {
    return AXIOS.post('api/assets/group/', data)
}
//删除阶段
export function removeGroup(data) {
    return AXIOS.post('api/assets/group/?delete', data)
}
//修改阶段
export function putGroup(data) {
    return AXIOS.post('api/assets/group/?put', data)
}
//获取阶段列表
export function getGroup(params) {
    return AXIOS.get('api/assets/group/', { params })
}
//获取所有项目下所有资产
export function allScene(params) {
    return AXIOS.get('api/assets/assets/?10', { params })
}
//查询实习成员成绩权重
export function getRecord(params) {
    return AXIOS.get('api/projects/scoreconfig/', { params })
}
//新建实习成员成绩权重
export function setRecord(data) {
    return AXIOS.post('api/projects/scoreconfig/', data)
}
//删除实习成员成绩权重
export function removeRecord(data) {
    return AXIOS.post('api/projects/scoreconfig/', data)
}
//按照任务的打分成绩排名
export function getTaskRecord(params) {
    return AXIOS.get('api/teachingsystem/statistics/?task_score', { params })
}
//按照审批通过的任务提交时间来排名
export function getApproveTimeRecord(params) {
    return AXIOS.get('api/teachingsystem/statistics/?submition', { params })
}
//按照考勤时间排名
export function getAttendanceRecord(params) {
    return AXIOS.get('api/teachingsystem/statistics/?attendance', { params })
}
//按照权重排名
export function getWeightRecord(params) {
    return AXIOS.get('api/teachingsystem/statistics/?weight_socre', { params })
}
//查看项目下面的环节
export function getProjectLinks(params) {
    return AXIOS.get('api/teachingsystem/statistics/', { params })
}
//刷新成绩
export function refreshRecord(data) {
    return AXIOS.post('api/teachingsystem/statistics/', data)
}
//查看项目下所有环节的人员排名
export function getProjectAllLinks(params) {
    return AXIOS.get('api/teachingsystem/statistics/', { params })
}
//查看资产下的所有环节的人员排名
export function getAssetAllLinks(params) {
    return AXIOS.get('api/teachingsystem/statistics/', { params })
}
//我的成绩单
export function myRecord(params) {
    return AXIOS.get('api/teachingsystem/statistics/?my_score', { params })
}
//我的加权排名
export function myWeightRecord(params) {
    return AXIOS.get('api/teachingsystem/statistics/?my_weight_socre', { params })
}