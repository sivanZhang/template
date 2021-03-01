<template>
    <div>
        <!-- 调用类型的提示 -->
        <div class="btn-explain" @click="openExplain()">
              提示:
            <svg-icon icon-class="wenhao" />
        </div>
        <!-- 调用类型提示 -->
        <el-dialog title="提示" :visible.sync="typevisible" width="365px">
            <div>
                <div class="explain-title">
                自动：
                </div>
                <div class="explain-content">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                展示的曲线图数据是从后台获取到的，或者DTU连接获取的。
                </div>
                <div class="explain-title">
                手动：
                </div>
                <div class="explain-content">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                展示的曲线图数据是用户手动输入的。
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            typevisible:false,
        }
    },
    methods:{
        // 打开提示
        openExplain() {
            this.typevisible=true
        },
    }
}
</script>
<style lang="scss" scoped>
.btn-explain {
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-size: 12px;
  color: #808080;
  cursor: pointer;
}
.explain-title{
  font-weight:bold;
  font-size: 15px;
}
.explain-content{
  font-size: 14px;
  margin: 2px;
}
</style>