import { cloneVNode, createVNode, defineComponent, h, KeepAlive } from "vue";
import { useRoute } from "vue-router";
import { useTagsViewStore } from "@/store/modules/tags-view";
const compMap = new Map();
export const CompConsumer = defineComponent((props) => {
    const tagsViewStore = useTagsViewStore();
    const route = useRoute();
    return () => {
        const component = props.component;
        // 判断当前是否包含 name，如果不包含name，那就直接处理掉 name
        if (!route.name)
            return component;
        // 获取当前组件的 name
        const compName = component.type?.name;
        const routeName = route.name;
        let Comp;
        if (compMap.has(routeName)) {
            Comp = compMap.get(routeName);
        }
        else {
            const node = cloneVNode(component);
            if (compName && compName === routeName) {
                ;
                node.type.name = `__${compName}__CUSTOM_NAME`;
            }
            // @ts-expect-error this is VNode
            Comp = defineComponent({
                name: routeName,
                setup() {
                    return () => node;
                }
            });
            compMap.set(routeName, Comp);
        }
        return createVNode(KeepAlive, {
            include: tagsViewStore.cachedViews
        }, {
            default: () => h(Comp)
        });
    };
}, {
    name: "CompConsumer",
    props: ["component"]
});
//# sourceMappingURL=index.js.map