/**
 * 
 *@file 静态路由
 *  
 */
import Layout from '@/layout'
export default [{
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [{
            path: '/redirect/:path*',
            component: () =>
                import ('@/views/redirect/index')
        }]
    }, {
        path: '/login',
        component: () =>
            import ('@/views/login/signin'),
        hidden: true
    },
    {
        path: '/login-task',
        component: () =>
            import ('@/views/myTask/loginMyTask'),
        hidden: true
    },
    {
        path: '/mytaskplug',
        component: () =>
            import ('@/views/myTask/myTaskPlug'),
        hidden: true
    },
    {
        path: '/forgot',
        component: () =>
            import ('@/views/login/passwordReset'),
    },
    {
        path: '/signup',
        component: () =>
            import ('@/views/login/signup'),
    },
    {
        path: '/electricParamater',
        component: Layout,
        redirect: 'noRedirect',
        meta: {
            title: '项目',
            icon: 'tree-table',
        },
        hidden: true,
        children: [{
            path: 'indicatorDiagram',
            name: 'indicatorDiagram',
            component: () =>
                import ('@/views/electricParamater/indicatorDiagram'),
            meta: {
                title: '多个历史载荷示功图曲线',
                icon: 'tree',
            }
        },
        {
            path: 'ele-parameter',
            name: 'ele-parameter',
            component: () =>
                import ('@/views/electricParamater/ele-parameter'),
            meta: {
                title: '多个历史电参数示功图曲线',
                icon: 'tree',
            }
        },{
            path: 'signalElecticParam',
            name: 'signalElecticParam',
            component: () =>
                import ('@/views/electricParamater/signalElecticParam'),
            meta: {
                title: '电参及载荷示功图曲线',
                icon: 'tree',
            }
        },
        {
            path: 'manualDrawing',
            name: 'manualDrawing',
            component: () =>
                import ('@/views/electricParamater/manualDrawing'),
            meta: {
                title: '绘制电参数示功图界面',
                icon: 'tree',
            }
        },{
            path: 'manual-automatic',
            name: 'manual-automatic',
            component: () =>
                import ('@/views/electricParamater/manual-automatic'),
            meta: {
                title: '自动绘制电参数示功图',
                icon: 'tree',
            }
        }]
    },
    {
        path: '/alarmManagement',
        component: Layout,
        redirect: 'noRedirect',
        meta: {
            title: '项目',
            icon: 'tree-table',
        },
        hidden: true,
        children: [{
            path: 'alarmDetail/:id',
            name: 'alarmDetail',
            component: () =>
                import ('@/views/alarmManagement/alarmDetail'),
            meta: {
                title: '告警详情',
                icon: 'tree',
            }
        }]
    },
    {
        path: '/projects',
        component: Layout,
        redirect: 'noRedirect',
        meta: {
            title: '项目',
            icon: 'tree-table',
        },
        hidden: true,
        children: [{
            path: 'well-detail/:id',
            name: 'well-detail',
            component: () =>
                import ('@/views/projects/well-detail'),
            meta: {
                title: '油井详情',
                icon: 'tree',
            }
        }]
    },
    {
        path: '/alarmManagement',
        component: Layout,
        redirect: 'noRedirect',
        meta: {
            title: '告警管理',
            icon: 'tree-table',
        },
        hidden: true,
        children: [{
            path: 'systemAlarm',
            name: 'systemAlarm',
            component: () =>
                import ('@/views/alarmManagement/systemAlarm'),
            meta: {
                title: '系统告警',
                icon: 'tree',
            }
        }]
    },
    {
        path: '/workDiagnosis',
        component: Layout,
        redirect: 'noRedirect',
        meta: {
            title: '工况诊断',
            icon: 'tree-table',
        },
        hidden: true,
        children: [
        {
            path: 'diagQuery',
            name: 'diagQuery',
            component: () =>
                import ('@/views/workDiagnosis/diagQuery'),
            meta: {
                title: '诊断查询处理',
                icon: 'diagQuery',
            }
        },
        {
            path: 'suggestDiag',
            name: 'suggestDiag',
            component: () =>
                import ('@/views/workDiagnosis/suggestDiag'),
            meta: {
                title: '建议工况诊断',
                icon: 'tree',
            }
        }
    ]
    },
    {
        path: '/basicInformation',
        component: Layout,
        redirect: 'noRedirect',
        meta: {
          title: '基础信息',
          icon: 'tree-basicInformation',
        },
        hidden: true,
        children: [{
            path: 'new-built/:id',
            name: 'alter-built',
            component: () =>
                import ('@/views/basicInformation/new-built'),
            meta: {
                title: '修改抽油机信息',
                icon: 'wellList',
                // roles: 'manage_well'
            }
        },
        {
            path: 'new-screw pump/:id',
            name: 'alter-pump',
            component: () =>
                import ('@/views/basicInformation/new-screw pump'),
            meta: {
                title: '修改螺杆泵信息',
                icon: 'wellList',
                // roles: 'manage_well'
            }
        },
       
      ]
      },
    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    }
]