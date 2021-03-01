import AXIOS from '@/utils/request'
// 我的待审批任务
export function getApprove(params) {
    return AXIOS.get('api/approve/approve/', {
        params
    })
}
// 我的审批记录
export function getRecords(params) {
    return AXIOS.get('api/approve/approve_record/', {
        params
    })
}
// 提交审核
export function postApprove(data) {
    return AXIOS.post('api/approve/approve/', data, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [params => {
            return JSON.stringify(params)
        }]
    })
}
// 获取审核备注列表/approve/approve/
export function getApproveRemark(params) {
    return AXIOS.get('api/approve/approve_result/', {
        params
    })
}
// 根据任务id查询审核信息
export function getApproveDetail(params) {
    return AXIOS.get('api/approve/approve/', {
        params
    })
}

// 客户待审批列表
export function getExtraApproveList() {
    return AXIOS.get('api/approve/pendingclient/')
}

// 向外网发数据
export function submitExtra(data) {
    return AXIOS.post('api/approve/toclient/', data)
}