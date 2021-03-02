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

      <AsidebarItem
        v-for="t of asideBarList"
        :aside-bar-list="t"
        :key="t.name"
      />
    </el-menu>
  </div>
</template>

<script>
import AsidebarItem from "./AsideBarItem";
export default {
  components: {
    AsidebarItem
  },
  computed: {
    asideBarList() {
      return this.$store.state.currentRouteBranch.children ?? [];
    },
    default_openeds_array() {
      return this.asideBarList.map(t => t.name) ?? [];
    },
    currentIndex() {
      return this.$route.meta.active ?? this.$route.name;
    }
  },
  methods: {
    handleClickMenu(name) {
      console.log('object',name);
      this.$router.push({ name });
    }
  }
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
