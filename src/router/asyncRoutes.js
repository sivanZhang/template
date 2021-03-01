/* eslint-disable no-sparse-arrays */
/**
 *
 * @file 动态路由
 *
 */
import Layout from '@/layout';
export default function asyncRoutes(params) {
    return [{
            path: '/',
            component: Layout,
            redirect: {
                name: 'homePage'
            },
            meta: {
                breadcrumb: false,
                title: '',
                icon: 'gailan'
            },
            children: [{
                path: 'homePage',
                name: 'homePage',
                component: () =>
                    import ('@/views/homePage'),
                meta: {
                    title: '首页大屏',
                    icon: 'home'
                }
            }]
        },
        {
            path: '/realdata',
            component: Layout,
            // redirect: {
            //   name: 'home-page'
            // },
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: {
                title: '实时数据',
                icon: 'gailan'
            },
            children: [{
                    path: 'realdata',
                    name: 'realdata',
                    component: () =>
                        import ('@/views/realdata'),
                    meta: {
                        title: '实时数据表格',
                        icon: 'chakan'
                    }
                },
                {
                    path: 'realtime-data',
                    name: 'realtime-data',
                    component: () =>
                        import ('@/views/realTimeData/realtime-data'),
                    meta: {
                        title: '实时数据曲线',
                        icon: 'chakan'
                    }
                },
                {
                    path: 'history-data',
                    name: 'history-data',
                    component: () =>
                        import ('@/views/historyData/history-data'),
                    meta: {
                        title: '历史数据曲线',
                        icon: 'chakan'
                    }
                },
                {
                    path: 'point-position',
                    name: 'point-position',
                    component: () =>
                        import ('@/views/pointPosition/point_position'),
                    meta: {
                        title: '点位表格',
                        icon: 'chakan'
                    }
                }
            ]
        },
        {
            path: '/comprehensiveQuery',
            component: Layout,
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: {
                title: '综合查询',
                icon: 'comprehensiveQuery'
            },
            children: [{
                path: 'comprehensiveQuery',
                name: 'comprehensiveQuery',
                component: () =>
                    import ('@/views/comprehensiveQuery'),
                meta: {
                    title: '查看',
                    icon: 'chakan'
                }
            }]
        },
        {
            path: '/cycleCurve',
            component: Layout,
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: {
                title: '周波曲线分析',
                icon: 'dataCurve'
            },
            children: [{
                path: 'pumpCycle',
                name: 'pumpCycle',
                component: () =>
                    import ('@/views/cycleCurve/pumpCycle'),
                meta: {
                    title: '周波曲线分析',
                    icon: 'chakan'
                }
            }]
        },
        {
            path: '/dataCurve',
            component: Layout,
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: {
                title: '曲线诊断',
                icon: 'dataCurve'
            },
            children: [{
                    path: 'dataCurve',
                    name: 'dataCurve',
                    component: () =>
                        import ('@/views/dataCurve'),
                    meta: {
                        title: '主界面',
                        icon: 'chakan'
                    }
                },
                {
                    path: 'diagSubmit',
                    name: 'diagSubmit',
                    component: () =>
                        import ('@/views/workDiagnosis/diagSubmit'),
                    meta: {
                        title: '诊断种类确认',
                        icon: 'diagQuery',
                        roles: 'manage_role'
                    }
                },
                {
                    path: 'diagQuery',
                    name: 'diagQuery',
                    component: () =>
                        import ('@/views/workDiagnosis/diagQuery'),
                    meta: {
                        title: '诊断查询处理',
                        icon: 'process',
                        roles: 'manage_role'
                    }
                },
                {
                    path: 'pumpUnit',
                    name: 'pumpUnit',
                    component: () =>
                        import ('@/views/dataCurve/pumpUnit'),
                    meta: {
                        title: '抽油机',
                        icon: 'pumpUnit'
                    }
                },
                {
                    path: 'screwPump',
                    name: 'screwPump',
                    component: () =>
                        import ('@/views/dataCurve/screwPump'),
                    meta: {
                        title: '螺杆泵',
                        icon: 'screwPump'
                    }
                },
                {
                    path: 'elePump',
                    name: 'elePump',
                    component: () =>
                        import ('@/views/dataCurve/elePump'),
                    meta: {
                        title: '电泵',
                        icon: 'screwPump'
                    }
                },
                {
                    path: 'subScrewPump',
                    name: 'subScrewPump',
                    component: () =>
                        import ('@/views/dataCurve/subScrewPump'),
                    meta: {
                        title: '电潜螺杆泵',
                        icon: 'screwPump'
                    }
                },
                {
                    path: 'energyPumpUnit',
                    name: 'energyPumpUnit',
                    component: () =>
                        import ('@/views/dataCurve/energyPumpUnit'),
                    meta: {
                        title: '节能抽油机',
                        icon: 'pumpUnit'
                    }
                },
                {
                    path: 'towPumpUnit',
                    name: 'towPumpUnit',
                    component: () =>
                        import ('@/views/dataCurve/towPumpUnit'),
                    meta: {
                        title: '塔式抽油机',
                        icon: 'pumpUnit'
                    }
                },
            ]
        },
        {
            path: '/basicInformation',
            component: Layout,
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: {
                title: '基础信息',
                icon: 'basicInformation'
            },
            children: [{
                    path: 'wellList',
                    name: 'wellList',
                    component: () =>
                        import ('@/views/basicInformation/wellList'),
                    meta: {
                        title: '油井列表',
                        icon: 'wellList'
                    }
                },
                {
                    path: 'pumpType',
                    name: 'pumpType',
                    component: () =>
                        import ('@/views/basicInformation/pumpType'),
                    meta: {
                        title: '机型列表',
                        icon: 'wellList'
                    }
                },
                {
                    path: 'new-built',
                    name: 'new-built',
                    component: () =>
                        import ('@/views/basicInformation/new-built'),
                    meta: {
                        title: '添加抽油机信息',
                        icon: 'wellList',
                        roles: 'manage_well'
                    }
                },
                {
                    path: 'new-screw pump',
                    name: 'new-screw pump',
                    component: () =>
                        import ('@/views/basicInformation/new-screw pump'),
                    meta: {
                        title: '添加螺杆泵信息',
                        icon: 'wellList',
                        roles: 'manage_well'
                    }
                },
                {
                    path: 'paramsModify-record',
                    name: 'paramsModify-record',
                    component: () =>
                        import ('@/views/basicInformation/paramsModify-record'),
                    meta: {
                        title: '参量修改记录',
                        icon: 'wellList',
                        //    roles: 'manage_well'
                    }
                },
            ]
        },
        {
            path: '/electricParamater',
            component: Layout,
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: {
                title: '电参示功图',
                icon: 'basicInformation'
            },
            children: [
                {
                path: 'electricParamater',
                name: 'electricParamater',
                component: () =>
                    import ('@/views/electricParamater/electricParamater'),
                meta: {
                    title: '电参示功图',
                    icon: 'workDiagnosis'
                }
            
            },
            {
                path: 'work-chart',
                name: 'work-chart',
                component: () =>
                    import ('@/views/electricParamater/work_chart'),
                meta: {
                    title: '功图表格',
                    icon: 'workDiagnosis'
                }
            
            }
        ]
        },
        /*
        {
            path: '/deviceStatus',
            component: Layout,
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: {
                title: '设备管理',
                icon: 'device',
            },
            children: [{
                path: 'deviceStatus',
                name: 'deviceStatus',
                component: () =>
                    import ('@/views/deviceStatus'),
                meta: {
                    title: '设备状态',
                    icon: 'deviceStatus',
                },
                // hidden: true
            }]
        },
        {
            path: '/alarmManagement',
            component: Layout,
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: {
                title: '告警管理',
                icon: 'alarmManagement'
            },
            children: [{
                path: 'alarmQuery',
                name: 'alarmQuery',
                component: () =>
                    import ('@/views/alarmManagement/alarmQuery'),
                meta: {
                    title: '告警查询',
                    icon: 'alarmQuery'
                }
            },
            {
                path: 'systemAlarm',
                name: 'systemAlarm',
                component: () =>
                    import ('@/views/alarmManagement/systemAlarm'),
                meta: {
                    title: '系统警告',
                    icon: 'systemAlarm'
                }
            }]
        },
        {
            path: '/workDiagnosis',
            component: Layout,
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: {
                title: '工况诊断',
                icon: 'workDiagnosis'
            },
            children: [{
                    path: 'suggestDiag',
                    name: 'suggestDiag',
                    component: () =>
                        import ('@/views/workDiagnosis/suggestDiag'),
                    meta: {
                        title: '建议诊断',
                        icon: 'suggestDiag'
                    }
                },
                // {
                //   path: 'diagQuery',
                //   name: 'diagQuery',
                //   component: () => import('@/views/workDiagnosis/diagQuery'),
                //   meta: {
                //     title: '诊断查询',
                //     icon: 'diagQuery'
                //   }
                // }
            ]
        },
        */
        {
            path: '/alarmManagement/systemAlarm',
            name: '/alarmManagement/systemAlarm',
            component: () =>
                import ('@/views/alarmManagement/systemAlarm'),
            meta: {
                title: '系统警告',
                icon: 'systemAlarm'
            }
        },
        {
            path: '/orderSystem',
            component: Layout,
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: {
                title: '指令系统',
                icon: 'orderSystem'
            },
            children: [{
                path: 'orderQuery',
                name: 'orderQuery',
                component: () =>
                    import ('@/views/orderSystem/orderQuery'),
                meta: {
                    title: '指令审计',
                    icon: 'orderQuery'
                }
            }]
        },
        {
            path: '/checking-in',
            component: Layout,
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: {
                title: '用户管理',
                icon: 'kq',
                roles: 'system_auth'
            },
            children: [{
                    path: 'extra-work',
                    name: 'extra-work',
                    component: () =>
                        import ('@/views/checking-in/extra-work'),
                    meta: {
                        title: '添加用户',
                        icon: 'group',
                        roles: 'system_auth'
                    }
                },
                {
                    path: 'view-extra-work',
                    name: 'view-extra-work',
                    component: () =>
                        import ('@/views/checking-in/view-extra-work'),
                    meta: {
                        title: '查看用户',
                        icon: 'jbck',
                        roles: 'system_auth'
                    }
                }
            ]
        },
        {
            path: '/admin',
            component: Layout,
            redirect: 'noRedirect',
            meta: {
                title: '系统设置',
                icon: 'settings',
            },
            children: [{
                    path: 'profession',
                    name: 'profession',
                    component: () =>
                        import ('@/views/admin/userGroup'),
                    meta: {
                        title: '用户',
                        icon: 'group',
                    }
                },
                {
                    path: 'userGroup',
                    name: 'UserGroup',
                    component: () =>
                        import ('@/views/admin/profession'),
                    meta: {
                        title: '部门',
                        icon: 'profession',
                    }
                },
                {
                    path: 'roles',
                    name: 'UserGqqqroup',
                    component: () =>
                        import ('@/views/admin/roles'),
                    meta: {
                        title: '角色管理',
                        icon: 'role',
                    }
                },
                {
                    path: 'settings',
                    name: 'settings',
                    component: () =>
                        import ('@/views/admin/settings'),
                    meta: {
                        title: '配置',
                        icon: 'setting',
                    }
                }
            ]
        },
        // {
        //   path: '/admin',
        //   component: Layout,
        //   redirect: 'noRedirect',
        //   meta: {
        //     title: '系统管理',
        //     icon: 'settings',
        //     roles: 'system_auth'
        //   },
        //   children: [
        //     {
        //       path: 'profession',
        //       name: 'profession',
        //       component: () => import('@/views/admin/userGroup'),
        //       meta: {
        //         title: '审计日志',
        //         icon: 'menu',
        //         roles: 'system_auth'
        //       }
        //     },
        //     {
        //       path: 'userGroup',
        //       name: 'UserGroup',
        //       component: () => import('@/views/admin/profession'),
        //       meta: {
        //         title: '指令结论',
        //         icon: 'bangding',
        //         roles: 'system_auth'
        //       }
        //     },
        //     {
        //       path: 'roles',
        //       name: 'UserGqqqroup',
        //       component: () => import('@/views/admin/roles'),
        //       meta: {
        //         title: '系统设置',
        //         icon: 'settings',
        //         roles: 'manage_role'||'system_auth'
        //       }
        //     }
        //   ]
        // },
        {
            // 404必须在最后面
            path: '*',
            redirect: '/404',
            hidden: true
        }
    ]
}