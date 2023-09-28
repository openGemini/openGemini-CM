import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { layoutSettings } from "@/config/layouts";
import { setConfigLayout } from "@/utils/cache/local-storage";
export const useSettingsStore = defineStore("settings", () => {
    /** 状态对象 */
    const state = {};
    // 遍历 layoutSettings 对象的键值对
    for (const [key, value] of Object.entries(layoutSettings)) {
        // 使用类型断言来指定 key 的类型，将 value 包装在 ref 函数中，创建一个响应式变量
        const refValue = ref(value);
        state[key] = refValue;
        // 监听每个响应式变量
        watch(refValue, () => {
            // 缓存
            const settings = _getCacheData();
            setConfigLayout(settings);
        });
    }
    /** 获取要缓存的数据：将 state 对象转化为 settings 对象 */
    const _getCacheData = () => {
        const settings = {};
        for (const [key, value] of Object.entries(state)) {
            // @ts-ignore
            settings[key] = value.value;
        }
        return settings;
    };
    return state;
});
//# sourceMappingURL=settings.js.map