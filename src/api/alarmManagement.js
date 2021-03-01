import AXIOS from '@/utils/request'
//获取告警列表
export function ApiAlarmQuery(params) {
    return AXIOS.get('api/warning/warning/', {
        params
    })
}
//添加告警
export function ApiaddAlarm(data) {
    return AXIOS.post('api/warning/warning/', data)
}
//删除告警
export function ApiDeleteAlarm(data) {
    return AXIOS.post('api/warning/warning/?delete', data)
}
//修改告警处置状态
export function ApiPutAlarm(data) {
    return AXIOS.post('api/warning/warning/?put', data)
}
//查看告警详情
export function ApiAlarmDetail(params) {
    return AXIOS.get('api/warning/warning/?id=9151', { params })
}
//提交评论
export function ApiSubmitComment(data) {
    return AXIOS.post('api/warning/comment/', data)
}
//删除评论
export function ApiDeleteComment(data) {
    return AXIOS.post('api/warning/comment/?method=delete', data)
}
//获取评论管理权限
export function ApiGetAuthority(params) {
    return AXIOS.get('api/warning/comment/', { params })
}
//告警诊断查询
export function ApiDiagQuery(params) {
    return AXIOS.get('/api/ctlwarning/ctlwarning/', { params })
}
//告警种类确定
export function ApiTypeDeter(data) {
    return AXIOS.post('/api/ctlwarning/ctlwarning/', data)
}
//告警处置
export function ApiAlarmHandle(data) {
    return AXIOS.post('/api/ctlwarning/ctlwarning/?01', data)
}
//告警处置之直接处理（无预先告警）
export function ApiAlarmDirHand(data) {
    return AXIOS.post('/api/ctlwarning/ctlwarning/?02', data)
}
//告警权限获取
export function ApiAlarmAuth(params) {
    return AXIOS.get('/api/ctlwarning/ctlwarning/?auth', { params })
}
//告警详情
export function ApiAlarmDeta(params) {
    return AXIOS.get('/api/ctlwarning/ctlwarning/?warningid', { params })
}
//历史告警
export function ApiHistoryAlarm(params) {
    return AXIOS.get('/api/ctlwarning/ctlwarning/?01', { params })
}
