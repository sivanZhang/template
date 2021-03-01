import AXIOS from '@/utils/request'
export function getMaterial(params) {
    return AXIOS.get('api/material/material/', { params })
}
export function addMaterial(data) {
    return AXIOS.post('api/material/material/', data)
}
export function delMaterial(data) {
    return AXIOS.post('api/material/material/?delete', data)
}
export function putMaterial(data) {
    return AXIOS.post('api/material/material/?put', data)
}