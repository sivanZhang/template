import AXIOS from '@/utils/request'
// 获取配置信息
export function ApiCtlConfig(params) {
    return AXIOS.get('api/ctlconfig/ctlconfig/', { params })
}
//设置配置信息
export function ApiSetCtlConfig(data) {
    return AXIOS.post('api/ctlconfig/ctlconfig/',data)
}