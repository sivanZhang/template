import AXIOS from '@/utils/request'
//获取我的作品
export function getProduction(params) {
    return AXIOS.get('api/approve/works/', { params })
}