/**
 *
 *@file 静态路由
 *
 */
import GlobalEntry from "@/views/layout/GlobalEntry";
import SidebarEntry from "@/views/layout/SidebarEntry";
export default [
  {
    path: "/redirect",
    component: GlobalEntry,
    hidden: true,
    children: [
      {
        path: "/redirect/:path*",
        component: () => import("@/views/redirect/index")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/views/login/signin"),
    hidden: true
  },
  {
    path: "/login-task",
    component: () => import("@/views/myTask/loginMyTask"),
    hidden: true
  },
  {
    path: "/mytaskplug",
    component: () => import("@/views/myTask/myTaskPlug"),
    hidden: true
  },
  {
    path: "/forgot",
    component: () => import("@/views/login/passwordReset")
  },
  {
    path: "/signup",
    component: () => import("@/views/login/signup")
  },
  {
    path: "/",
    component: GlobalEntry,
    redirect: {
      name: "homePage-detail"
    },
    name: "home",
    meta: {
      breadcrumb: false,
      title: "首页",
      icon: "gailan",
      top: true
    },
    children: [
      {
        path: "homePage",
        name: "homePage-detail",
        component: () => import("@/views/homePage"),
        meta: {
          title: "首页大屏",
          icon: "home"
        }
      }
    ]
  },
  {
    path: "/electricParamater",
    component: GlobalEntry,
    redirect: {
      name: "indicatorDiagram"
    },
    name: "electricParamater",
    meta: {
      title: "项目",
      icon: "tree-table",
      top: true
    },
    children: [
      {
        path: "mid2",
        component: SidebarEntry,
        name: "哈哈哈",
        meta: {
          title: "实时数据",
          icon: "gailan"
        },
        children: [
          {
            path: "indicatorDiagram",
            name: "indicatorDiagram",
            component: () =>
              import("@/views/electricParamater/indicatorDiagram"),
            meta: {
              title: "多个历史载荷示功图曲线",
              icon: "tree"
            }
          },
          {
            path: "ele-parameter",
            name: "ele-parameter",
            component: () => import("@/views/electricParamater/ele-parameter"),
            meta: {
              title: "多个历史电参数示功图曲线",
              icon: "tree"
            }
          },
          {
            path: "signalElecticParam",
            name: "signalElecticParam",
            component: () =>
              import("@/views/electricParamater/signalElecticParam"),
            meta: {
              title: "电参及载荷示功图曲线",
              icon: "tree"
            }
          },
          {
            path: "manualDrawing",
            name: "manualDrawing",
            component: () => import("@/views/electricParamater/manualDrawing"),
            meta: {
              title: "绘制电参数示功图界面",
              icon: "tree"
            }
          },
          {
            path: "manual-automatic",
            name: "manual-automatic",
            component: () =>
              import("@/views/electricParamater/manual-automatic"),
            meta: {
              title: "自动绘制电参数示功图",
              icon: "tree"
            }
          }
        ]
      }
    ]
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  }
];
