<template>
  <!-- 二级菜单入口 -->
  <el-container class="admin-page-warp" direction="vertical">
    <el-container>
      <el-aside width="240px" class="admin-page-aside">
        <AsideBar />
      </el-aside>
      <el-main class="admin-page-company">
        <transition name="slide-fade" mode="out-in">
          <keep-alive :exclude="/(Form|Details)$/">
            <router-view />
          </keep-alive>
        </transition>
      </el-main>
    </el-container>
    <el-backtop target=".admin-page-company" />
  </el-container>
</template>

<script>
import AsideBar from "@/views/components/AsideBar";
export default {
  name: "StudyContainer",
  components: {
    AsideBar
  },
  computed: {
    currentRouteBranch: function() {
      return this.$store.state.currentRouteBranch;
    }
  },
};
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(16px);
  opacity: 0;
}
</style>
