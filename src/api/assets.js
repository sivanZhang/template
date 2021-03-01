import AXIOS from '@/utils/request'
//获取资产列表（搜索）
// export function getAssets() {
//     return AXIOS.get('api/assets/assets/')
// }
//删除资产
export function deleteAssets(data) {
    return AXIOS.post('api/assets/assets/?delete', {
        ...data,
        method: 'delete'
    })
}
//创建资产
export function postAssets(data) {
    return AXIOS.post('api/assets/assets/', data)
}
//获取资产
export function queryAssets(params) {
    return AXIOS.get('api/assets/assets/', {
        params
    })
}
//修改资产
export function editAssets(data) {
    return AXIOS.post('api/assets/assets/?put', data)
}
// 批量修改资产
export function mulPutAssetes(data) {
    return AXIOS.post('api/assets/assets/?02', data)
}
//导入资产列表
export function uploadAssets(data) {
    return AXIOS.post('api/assets/batch/', data, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [params => {
            return JSON.stringify(params)
        }]
    })
}
//后端解析excel
export function parseExcel(data) {
    return AXIOS.post('api/excel/excel/', data, {
        transformRequest: [data => {
            return data;
        }],

        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
//查询对应资产的版本记录
export function getVersion(params) {
    return AXIOS.get('api/assets/version/', { params })
}
//镜头的历史版本获取
export function getHistoryVersion(params) {
    return AXIOS.get('api/assets/history/', { params })
}
//资产的最终状态确定
export function getAssetsEndStatus(data) {
    return AXIOS.post('api/assets/history/', data)
}
//查询资产对应任务的审批结果
export function getAssetsApprove(params) {
    return AXIOS.get('api/approve/approve_result/?01', { params })
}
//组长分配镜头（已分配）
export function noNeedScene(params) {
    return AXIOS.get('api/assets/scene/', { params })
}
//组长分配镜头（未分配）
export function needScene(params) {
    return AXIOS.get('api/assets/scene/', { params })
}

//操作资产的权限
export function auth() {
    return AXIOS.get('api/assets/assets/?auth')
}