import { ref } from "vue";
import store from "@/store";
import { defineStore } from "pinia";
import { constantRoutes, asyncRoutes } from "@/router";
import { flatMultiLevelRoutes } from "@/router/helper";
import routeSettings from "@/config/route";
const hasPermission = (roles, route) => {
    const routeRoles = route.meta?.roles;
    return routeRoles ? roles.some((role) => routeRoles.includes(role)) : true;
};
const filterAsyncRoutes = (routes, roles) => {
    const res = [];
    routes.forEach((route) => {
        const tempRoute = { ...route };
        if (hasPermission(roles, tempRoute)) {
            if (tempRoute.children) {
                tempRoute.children = filterAsyncRoutes(tempRoute.children, roles);
            }
            res.push(tempRoute);
        }
    });
    return res;
};
export const usePermissionStore = defineStore("permission", () => {
    const routes = ref([]);
    const dynamicRoutes = ref([]);
    const setRoutes = (roles) => {
        const accessedRoutes = routeSettings.async ? filterAsyncRoutes(asyncRoutes, roles) : asyncRoutes;
        routes.value = constantRoutes.concat(accessedRoutes);
        dynamicRoutes.value = routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(accessedRoutes) : accessedRoutes;
    };
    return { routes, dynamicRoutes, setRoutes };
});
/** 在 setup 外使用 */
export function usePermissionStoreHook() {
    return usePermissionStore(store);
}
//# sourceMappingURL=permission.js.map