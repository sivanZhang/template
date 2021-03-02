import constantRoutes from "@/router/constantRoutes";
import asyncRoutes from "@/router/asyncRoutes";
import router from "@/router";
import { cloneDeep } from "lodash";
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(route, UserRoles) {
  if (route.meta?.roles) {
    return UserRoles[route.meta.roles];
  }
  return true;
}
// 判断Training权限
function judgeTraining(UserRoles = {}) {
  return UserRoles["training_manager"] === true;
}
/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 */
function filterAsyncRoutes(routes, UserRoles) {
  const res = [];
  routes.forEach(route => {
    if (hasPermission(route, UserRoles)) {
      if (route.children) {
        route.children = filterAsyncRoutes(route.children, UserRoles);
      }
      res.push(route);
    }
  });
  return res;
}

const state = {
  routes: [], // 当前用户可以访问的所有路由
  addRoutes: [] // 筛选出来有权限进入的动态路由，最后添加到routers中
};

const mutations = {
  SET_ROUTES: (state, arr) => {
    state.addRoutes = arr;
    state.routes = constantRoutes.concat(arr);
  }
};

const actions = {
  generateRoutes({ commit, rootState }) {
    const UserRoles = rootState.login.userInfo.auth;
    return new Promise(resolve => {
      let accessedRoutes = [];
      if (!judgeTraining(UserRoles)) {
        accessedRoutes = filterAsyncRoutes(cloneDeep(asyncRoutes), UserRoles);
      }
      commit("SET_ROUTES", accessedRoutes);
      router.addRoutes(accessedRoutes);
      resolve(accessedRoutes);
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
