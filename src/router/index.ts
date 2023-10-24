import { type RouteRecordRaw, createRouter } from "vue-router"
import { history, flatMultiLevelRoutes } from "./helper"
import routeSettings from "@/config/route"

const Layouts = () => import("@/layouts/index.vue")

/**
 * 常驻路由
 * 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          elIcon: "House",
          affix: true
        }
      }
    ]
  },
  {
    path: "/log-displayer",
    component: Layouts,
    redirect: "/log-displayer/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/log-displayer/index.vue"),
        name: "LogDisplayer",
        meta: {
          title: "日志显示",
          elIcon: "Document"
        }
      }
    ]
  },
  {
    path: "/command-executer",
    component: Layouts,
    redirect: "/command-executer/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/command-executer/index.vue"),
        name: "CommandExecuter",
        meta: {
          title: "命令执行",
          elIcon: "Postcard"
        }
      }
    ]
  },
  {
    path: "/cluster-basic-information",
    component: Layouts,
    redirect: "/cluster-basic-information/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/cluster-basic-information/index.vue"),
        name: "ClusterBasicInformation",
        meta: {
          title: "集群基本信息",
          elIcon: "Tickets"
        }
      }
    ]
  },
  {
    path: "/cluster-resource-monitor",
    component: Layouts,
    redirect: "/cluster-resource-monitor/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/cluster-resource-monitor/index.vue"),
        name: "ClusterResourceMonitor",
        meta: {
          title: "集群资源监测",
          elIcon: "Odometer"
        }
      }
    ]
  }
  /*
  {
    path: "/table",
    component: Layouts,
    redirect: "/table/element-plus",
    name: "Table",
    meta: {
      title: "表格",
      elIcon: "Grid"
    },
    children: [
      {
        path: "element-plus",
        component: () => import("@/views/table/element-plus/index.vue"),
        name: "ElementPlus",
        meta: {
          title: "Element Plus",
          keepAlive: true
        }
      },
      {
        path: "vxe-table",
        component: () => import("@/views/table/vxe-table/index.vue"),
        name: "VxeTable",
        meta: {
          title: "Vxe Table",
          keepAlive: true
        }
      }
    ]
  }
  */
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/config-updater",
    component: Layouts,
    redirect: "/config-updater/index",
    meta: {
      roles: ["admin"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/config-updater/index.vue"),
        name: "ConfigUpdater",
        meta: {
          title: "配置文件生成",
          elIcon: "Setting"
        }
      }
    ]
  },
  {
    path: "/permission",
    component: Layouts,
    redirect: "/permission/page",
    name: "Permission",
    meta: {
      title: "权限管理",
      elIcon: "Lock",
      roles: ["admin", "editor"], // 可以在根路由中设置角色
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      /*
      {
        path: "page",
        component: () => import("@/views/permission/page.vue"),
        name: "PagePermission",
        meta: {
          title: "页面权限",
          roles: ["admin"] // 或者在子导航中设置角色
        }
      },
      */
      {
        path: "directive",
        component: () => import("@/views/permission/directive.vue"),
        name: "DirectivePermission",
        meta: {
          title: "指令权限" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
        }
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history,
  routes: routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
