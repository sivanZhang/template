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
    AsideBar,
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
.admin-page-warp {
  .el-menu {
    box-sizing: border-box;
    border-right: unset;

    .el-submenu {
      .el-submenu__title {
        &:hover {
          background: #1b1b1b;
        }
      }
      .el-menu {
        margin: 4px 0;
      }
      .el-menu-item {
        border: 1px solid transparent;
        height: 32px;
        width: 248px;
        &:hover,
        &:focus {
          background: #1b1b1b !important;
          border: 1px solid #1b1b1b !important;
        }

        /* &.is-active {
          @include ActiveStyle;
        } */

        line-height: 0px;
        padding: 0px 40px;
        line-height: 30px;
        margin-bottom: 8px;
        margin-left: 24px;
      }
    }
  }
  // background-color: $dim-green-bg-color;
  & > .el-header {
    // background: $active-bg-color;
  }
  .admin-page-content {
    height: calc(100vh - 80px);
    // @include scrollBar;
    padding: 16px;
    background-color: #fff;
    margin: 64px 8px 0 16px;
    // border-radius: $base-radius;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.3),
      0 6px 12px 0 rgba(0, 0, 0, 0.2), 0 9px 18px 6px rgba(0, 0, 0, 0.1);
  }
  .admin-page-company {
    height: 100vh;
    padding: 0;
    margin-top: 48px;
    overflow: hidden;
    // border-radius: $base-radius;
    .company-main {
      height: calc(100vh - 150px);
      background-color: #fff;
      overflow-y: scroll;
      // @include scrollBar;
      margin: 16px 16px 0 16px;
      border-radius: 2px;
    }
  }
  .admin-page-aside {
    // background-color: $darkgreen-color;
    height: calc(100vh - 48px);
    margin-top: 48px;
  }
  min-height: 100%;
}
</style>
