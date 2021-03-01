import AXIOS from '@/utils/request'
//获取首页信息
export function ApiGetHomedata(params) {
    return AXIOS.get('api/', { params })
}