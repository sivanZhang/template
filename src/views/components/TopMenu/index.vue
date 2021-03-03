<template>
  <!-- 顶部菜单 -->
  <el-row
    tag="header"
    id="top-menu"
    type="flex"
    align="middle"
    justify="space-between"
  >
    <div class="block-right">
      <div class="menu-bg">
        <el-menu
          :default-active="defaultActive"
          mode="horizontal"
          @select="targetPage"
        >
          <template v-for="(item, index) in topMenuList">
            <el-menu-item :index="item.name" :key="index">{{
              item.meta.title
            }}</el-menu-item>
          </template>
        </el-menu>
        <template v-if="hasToken">
          <el-dropdown>
            <el-avatar
              v-if="userInfo.avatar"
              :src="host + userInfo.avatar"
            ></el-avatar>
            <el-avatar v-else>{{ userInfo.userName }}</el-avatar>
            <el-dropdown-menu slot="dropdown">
              <div class="user-name">
                <p>{{ userInfo.userName }}</p>
                <div>{{ userInfo.dept.deptName }}</div>
              </div>
              <el-dropdown-item
                @click.native="$router.push({ name: 'user-center' })"
                >用户中心</el-dropdown-item
              >
              <el-dropdown-item @click.native="logout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button
            type="primary"
            size="mini"
            :underline="false"
            @click="targetLogin()"
            >登录</el-button
          >
        </template>
      </div>
    </div>
  </el-row>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dialogVisible: false,
      isShowChange: false,
      password: ""
    };
  },
  computed: {
    hasToken() {
      return !!this.$store.state.login.token;
    },
    ...mapGetters(["permission_routes"]),
    userInfo() {
      return this.$store.state.login.userInfo;
    },
    topMenuList() {
      return this.permission_routes.filter(t => t.meta?.top);
    },
    defaultActive() {
      return this.$store.state.currentRouteBranch?.name;
    }
  },
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler: function() {
        this.$store.commit(
          "SET_CURRENT_BRANCH",
          this.permission_routes.find(
            t => t.name == this.$route.matched[0].name
          )
        );
        console.log(this.$route,'this.$route');
        // if (this.$route.matched[0].meta?.realParent) {
        //   // 静态路由中加的标识
        //   this.$store.commit(
        //     "SET_CURRENT_BRANCH",
        //     this.permission_routes.find(
        //       t => t.name == this.$route.matched[0].meta.realParent
        //     )
        //   );
        // } else {
        //   this.$store.commit(
        //     "SET_CURRENT_BRANCH",
        //     this.permission_routes.find(
        //       t => t.name == this.$route.matched[0].name
        //     )
        //   );
        // }
      }
    }
  },
  methods: {
    logout() {
      const { path } = this.$route;
      this.$store.dispatch("login/logout").then(() => {
        path == "/home" && this.$router.go(0);
        this.$router.push({ name: "home-page" }).then(() => {
          this.$store.dispatch("dictManage/resetState");
        });
      });
    },
    targetLogin() {
      this.$router.push("/login");
    },
    targetPage(name) {
      this.$router.push({ name });
    }
  }
};
</script>

<style lang="scss">
#top-menu {
  .menu-bg {
    display: flex;
    align-items: center;
    padding-right: 16px;
  }
}
</style>
