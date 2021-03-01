import AXIOS from '@/utils/request'
// 获取实时数据和综合查询
export function ApiGetRealdata(params) {
    return AXIOS.get('api/realdata/realdata/', { params })
}
//获取最新的实时数据
export function ApiGetNewestRealdata(params) {
    return AXIOS.get('api/realdata/newestrealdata/', { params })
}
//获取历史数据
export function ApiGetHistorydata(params) {
    return AXIOS.get('api/clientdata/clientdata/', { params })
}
//获取电流曲线
export function ApiGetElectdata(params) {
    return AXIOS.get('api/p144/p144/', { params })
}

//获取管理p144的管理权限
export function ApiGetP144Auth(params) {
    return AXIOS.get('api/p144/points/?auth', { params })
}

//获取点位数据
export function ApiGetPointsdata(params) {
    return AXIOS.get('api/p144/points/', { params })
}

//删除点位数据
export function ApiDeletePoint(data) {
    return AXIOS.post('/api/p144/points/',data)
}

//获取功图数据
export function ApiGetWorkChartsdata(params) {
    return AXIOS.get('/api/p144/workcharts/', { params })
}

//删除点位数据
export function ApiDeleteWorkChartsdata(data) {
    return AXIOS.post('/api/p144/workcharts/',data)
}