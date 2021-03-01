import AXIOS from '@/utils/request'
//获取位移
export function getDisplacement(params) {
    return AXIOS.get('api/well/point/', {
        params
    })
}
//获取扭矩
export function getTorque(params) {
    return AXIOS.get('api/well/point/', {
        params
    })
}
// 获取最高可叠加次数以及叠加起止日期
export function getAddMutipleActive(params) {
    return AXIOS.get('api/overlying/overlying/', {
        params
    })
}
// 获取叠加多个一个冲次叠加有功
export function getMutipleActive(params) {
    return AXIOS.get('api/overlying/overlying/', {
        params
    })
}
// 获取叠加多个一个冲次叠加有功
export function getFromStorage(params) {
    return AXIOS.get('api/p144/electrial/', {
        params
    })
}
//新建数据，存入数据库
export function postToStorage(data) {
    return AXIOS.post('api/p144/electrial/', data)
}
