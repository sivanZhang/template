import AXIOS from '@/utils/request'
// 获取油井列表
export function ApiGetWellList(params) {
    return AXIOS.get('api/well/well/?list', { params })
}
//添加油井
export function ApiAddWell(data) {
    return AXIOS.post('/api/well/well/', data)
}
//修改油井
export function ApiAlterWell(data) {
    return AXIOS.put('/api/well/well/', data)
}
//删除油井
export function ApiDeleteWellList(data) {
    return AXIOS.post ('/api/well/well/', data)
}
//机型查询
export function ApiSearchPumping(params) {
    return AXIOS.get('/api/well/pumping/', { params })
}
//机型详情
export function ApiPumpDetail(params) {
    return AXIOS.get('/api/well/pumping/?id', { params })
}
//参量修改记录
export function ApiParamsRecord(params) {
    return AXIOS.get('/api/well/history/', { params })
}
//添加机型
export function ApiAddPumpType(data) {
    return AXIOS.post ('/api/well/pumping/', data)
}
//删除机型
export function ApiDeletePumpType(data) {
    return AXIOS.post ('/api/well/pumping/', data)
}
