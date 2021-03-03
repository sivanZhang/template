<template>
  <!-- 侧边栏组件 -->
  <div class="aside-bar">
    <el-menu
      class="el-menu_aside"
      :default-active="currentIndex"
      :collapse-transition="false"
      @select="handleClickMenu"
      :default-openeds="default_openeds_array"
    >
      <template v-for="t of asideBarList.children">
        <AsidebarItem v-if="t.children && t.children.length" :route="t" :key="t.name" />
        <el-menu-item v-else :key="t.name" :index="t.name">{{t.meta.title}}</el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import AsidebarItem from "./AsideBarItem";
export default {
  components: {
    AsidebarItem,
  },
  computed: {
    asideBarList() {
      return (
        this.$store.state.currentRouteBranch.children.find(
          (e) => e.isSide === true
        ) ?? []
      );
    },
    default_openeds_array() {
      return this.asideBarList.children?.map((t) => t.name) ?? [];
    },
    currentIndex() {
      return this.$route.meta.active ?? this.$route.name;
    },
  },
  methods: {
    handleClickMenu(name) {
      if(name===this.$route.name) return;
      this.$router.push({ name });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-menu {
  height: 100%;
}
.aside-bar {
  // @include scrollHideBar;
  padding-top: 16px;
  // background-color: $darkgreen-color;
}
</style>
