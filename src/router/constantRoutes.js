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
    path: "/forgot",
    component: () => import("@/views/login/passwordReset")
  },
  {
    path: "/signup",
    component: () => import("@/views/login/signup")
  },
  // 这是没侧边栏的例子
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
      top: true
    },
    children: [
      {
        path: "homePage",
        name: "homePage-detail",
        component: () => import("@/views/home-page"),
        meta: {
          title: "首页大屏",
        }
      }
    ]
  },
  //  这是有侧边栏的例子
  {
    path: "/electricParamater",
    component: GlobalEntry,// 带顶部菜单
    redirect: {
      name: "indicatorDiagram"
    },
    name: "electricParamater",
    meta: {
      title: "项目",
      top: true //如果现实在顶部菜单 加 top 并且=true  否则不加top
    },
    children: [
      {
        path: "mid2",
        component: SidebarEntry,//带侧边栏
        isSide:true,//带侧边栏的时候加isSide并=true，否则不加isSide
        name: "哈哈哈",
        meta: {
          title: "实时数据",
        },
        children: [// children里就是侧边栏的东西
          {
            path: "indicatorDiagram",
            name: "indicatorDiagram",
            component: () =>
              import("@/views/electricParamater/indicatorDiagram"),
            meta: {
              title: "多个历史载荷示功图曲线",
            }
          },
          {
            path: "ele-parameter",
            name: "ele-parameter",
            component: () => import("@/views/electricParamater/ele-parameter"),
            meta: {
              title: "多个历史电参数示功图曲线",
            }
          },
          {
            path: "signalElecticParam",
            name: "signalElecticParam",
            component: () =>
              import("@/views/electricParamater/signalElecticParam"),
            meta: {
              title: "电参及载荷示功图曲线",
            }
          },
          {
            path: "manualDrawing",
            name: "manualDrawing",
            component: () => import("@/views/electricParamater/manualDrawing"),
            meta: {
              title: "绘制电参数示功图界面",
            }
          },
          {
            path: "manual-automatic",
            name: "manual-automatic",
            component: () =>
              import("@/views/electricParamater/manual-automatic"),
            meta: {
              title: "自动绘制电参数示功图",
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
