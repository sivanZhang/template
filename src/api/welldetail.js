import AXIOS from '@/utils/request'
//获取井的信息
export function getWellDetail(params) {
    return AXIOS.get('api/well/well/', { params })
}
//查看月耗电量
export function viewPowersMonth(params) {
    return AXIOS.get('api/stats/consuption/', { params })
}
//获取历史数据
export function getHistoryData(params) {
    return AXIOS.get('api/clientdata/clientdata/', { params })
}
//获取日：产量、液面、平衡度、耗电数据
export function ApiviewDailyData(params) {
    return AXIOS.get('/api/stats/consuption/', { params })
}
//开关井记录
export function ApiGetWellRecord(params) {
    return AXIOS.get('api/well/record/', { params })
}
//填写实测数据
export function ApiMeasureData(data) {
    return AXIOS.post('api/clientdata/clientdata/', data)
}
//获取实测数据
export function ApiGetMeasureData(params) {
    return AXIOS.get('api/clientdata/clientdata/', { params })
}
//获取指令列表
export function ApiGetOrders(params) {
    return AXIOS.get('api/orders/orders/', { params })
}
//创建指令
export function ApiCreateOrder(data) {
    return AXIOS.post('api/orders/orders/', data)
}
//删除指令
export function ApiDeleteOrder(data) {
    return AXIOS.post('api/orders/orders/?put', data)
}
//所有井时率
export function ApiAllTimesRate(params) {
    return AXIOS.get('/api/well/record/?all_time_rate', { params })
}
//单井时率
export function ApiTimeRate(params) {
    return AXIOS.get('/api/well/record/', { params })
}
//系统效率
export function ApiSysEfficiency(params) {
    return AXIOS.get('/api/well/sys/', { params })
}
//添加点位数据
export function ApiAddData(data) {
    return AXIOS.post('/api/p144/p144/', data)
}
// 获取点位数据
export function ApiGetWellData(params) {
    return AXIOS.get('/api/p144/p144/', { params })
}
// 删除手动添加的点位数据
export function ApiDelManualData(data){
    return AXIOS.post('/api/p144/p144/?method=delete',data)
}
//查询系统历史系统效率
export function ApiSystEfficiency(params) {
    return AXIOS.get('/api/realdata/system_efficiency/', { params })
}
//工频或者变频运行状态记录
export function ApiRunstatus(params) {
    return AXIOS.get('/api/well/record/', { params })
}