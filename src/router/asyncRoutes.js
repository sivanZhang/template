/* eslint-disable no-sparse-arrays */
/**
 *
 * @file 动态路由
 *
 */
import GlobalEntry from "@/views/layout/GlobalEntry";
import SidebarEntry from "@/views/layout/SidebarEntry";
export default [
  {
    path: "/realdata",
    component: GlobalEntry,
    redirect: "noRedirect",
    name: "realdata",
    meta: {
      title: "实时数据",
      icon: "gailan",
      top: true
    },
    children: [
      {
        path: "mid",
        isSidebar: true,
        component: SidebarEntry,
        name: "realdata-mid",
        meta: {
          title: "实时数据",
          icon: "gailan"
        },
        children: [
          {
            path: "realdata",
            name: "realdata-main",
            component: () => import("@/views/realdata"),
            meta: {
              title: "实时数据表格",
              icon: "chakan"
            }
          },
          {
            path: "realtime-data",
            name: "realtime-data",
            component: () => import("@/views/realTimeData/realtime-data"),
            meta: {
              title: "实时数据曲线",
              icon: "chakan"
            }
          },
          {
            path: "history-data",
            name: "history-data",
            component: () => import("@/views/historyData/history-data"),
            meta: {
              title: "历史数据曲线",
              icon: "chakan"
            }
          },
          {
            path: "point-position",
            name: "point-position",
            component: () => import("@/views/pointPosition/point_position"),
            meta: {
              title: "点位表格",
              icon: "chakan"
            }
          }
        ]
      }
    ]
  },
  {
    path: "/admin",
    component: GlobalEntry,
    redirect: {
      name:"system-mid"
    },
    name: "system",
    meta: {
      title: "系统设置",
      icon: "settings",
      top: true
    },
    children: [
      {
        path: "system",
        component: SidebarEntry,
        name: "system-mid",
        redirect: {
          name:"profession"
        },
        meta: {
          title: "实时数据",
          icon: "gailan"
        },
        children: [
          {
            path: "profession",
            name: "profession",
            component: () => import("@/views/admin/userGroup"),
            meta: {
              title: "用户",
              icon: "group"
            }
          },
          {
            path: "userGroup",
            name: "UserGroup",
            component: () => import("@/views/admin/profession"),
            meta: {
              title: "部门",
              icon: "profession"
            }
          },
          {
            path: "roles",
            name: "UserGqqqroup",
            component: () => import("@/views/admin/roles"),
            meta: {
              title: "角色管理",
              icon: "role"
            }
          },
          {
            path: "settings",
            name: "settings",
            component: () => import("@/views/admin/settings"),
            meta: {
              title: "配置",
              icon: "setting"
            }
          }
        ]
      }
    ]
  },
  {
    // 404必须在最后面
    path: "*",
    redirect: "/404",
    hidden: true
  }
];
