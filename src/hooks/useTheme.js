import { ref, watchEffect } from "vue";
import { getActiveThemeName, setActiveThemeName } from "@/utils/cache/local-storage";
const DEFAULT_THEME_NAME = "normal";
/** 主题列表 */
const themeList = [
    {
        title: "默认",
        name: DEFAULT_THEME_NAME
    },
    {
        title: "黑暗",
        name: "dark"
    },
    {
        title: "深蓝",
        name: "dark-blue"
    }
];
/** 正在应用的主题名称 */
const activeThemeName = ref(getActiveThemeName() || DEFAULT_THEME_NAME);
/** 设置主题 */
const setTheme = (value) => {
    activeThemeName.value = value;
};
/** 在 html 根元素上挂载 class */
const setHtmlRootClassName = (value) => {
    document.documentElement.className = value;
};
/** 初始化 */
const initTheme = () => {
    // watchEffect 来收集副作用
    watchEffect(() => {
        const value = activeThemeName.value;
        setHtmlRootClassName(value);
        setActiveThemeName(value);
    });
};
/** 主题 hook */
export function useTheme() {
    return { themeList, activeThemeName, initTheme, setTheme };
}
//# sourceMappingURL=useTheme.js.map