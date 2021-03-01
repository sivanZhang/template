export default {
    // 图片地址
    BASE_URL: process.env.NODE_ENV === 'development' ? 'http://8.131.91.233:8091/' : `${location.origin}/`,
    // 是否设置了basURL
    hasSetUrl: false
}