import AXIOS from '@/utils/request'
//上传文件
export function uploadfile(data) {
    return AXIOS.post('api/sharefiles/sharefiles/', data)
}
//获取文件列表
export function searchfileList(params) {
    return AXIOS.get('api/sharefiles/sharefiles/', { params })
}
//删除文件
export function deletefile(data) {
    return AXIOS.post('api/sharefiles/sharefiles/?method=delete', data)
}