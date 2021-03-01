import AXIOS from '@/utils/request'
// 获取项目列表或者项目详情
export function getProjects(params) {
    return AXIOS.get('api/projects/projects/', { params })
}
//获取实训项目
export function gettestProjects(params) {
    return AXIOS.get('api/projects/training_projects/', { params })
}
// 创建项目
export function addProjects(data) {
    return AXIOS.post('api/projects/projects/', data)
}
// 编辑项目
export function putProjects(data) {
    return AXIOS.post('api/projects/projects/?01', data)
}
// 我的项目
export function getMyProject(params) {
    return AXIOS.get('api/projects/projects/?mine', { params })
}
// 添加/删除项目参与的工种
export function projectProfession(data) {
    return AXIOS.post('api/projects/projects/?method=put', data)
}
// 删除项目
export function delOneProject(data) {
    return AXIOS.post('api/projects/projects/?delete', data)
}
// 练习生项目新建分组
export function createTeam(data) {
    return AXIOS.post('api/projects/team/', data)
}

// 练习生项目修改分组
export function putTeam(data) {
    return AXIOS.post('api/projects/team/?put', data)
}

// 练习生项目删除分组
export function delTeam(data) {
    return AXIOS.post('api/projects/team/?delete', data)
}
// 练习生项目获取分组列表
export function getTeamList(params) {
    return AXIOS.get('api/projects/team/', { params })
}
//修改项目的制作内容
export function updateRequirement(data) {
    return AXIOS.post("/projects/projects/", data)
}
//设置菜单项(镜头与任务中展示列设置)
export function setupMenu(data) {
    return AXIOS.post('api/menu/menu/', data)
}
//获取菜单设置
export function getMenu(params) {
    return AXIOS.get('api/menu/menu/', { params })
}