<template>
  <!-- 一级菜单入口 -->
  <main class="app-main">
    <TopMenu />
    <router-view />
  </main>
</template>

<script>
import TopMenu from "@/views/components/TopMenu";
export default {
  name: "AppMain",
  components: {
    TopMenu,
  },
};
</script>

<style lang="scss" scoped>
.app-main {
  width: 100%;
}
</style>
