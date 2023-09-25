<script lang="ts" setup>
import { ref } from "vue"
import { checkPermission } from "@/utils/permission" // checkPermission 权限判断函数
import SwitchRoles from "./components/SwitchRoles.vue"

/** key 是为了能每次切换权限的时候重新初始化指令 */
const key = ref(1)
const handleRolesChange = () => {
  key.value++
}
</script>

<template>
  <div class="app-container">
    <SwitchRoles @change="handleRolesChange" />
    <!-- v-permission 示例 -->

    <!-- checkPermission 示例 -->
    <div :key="`checkPermission${key}`" class="margin-top-30">
      <el-tabs type="border-card" class="margin-top-15">
        <el-tab-pane v-if="checkPermission(['admin'])" label="admin">只有 admin 可以看见这句话</el-tab-pane>
        <el-tab-pane v-if="checkPermission(['editor'])" label="editor">只有 editor 可以看见这句话</el-tab-pane>
        <el-tab-pane v-if="checkPermission(['admin', 'editor'])" label="admin 和 editor">
          admin 和 editor 都可以看见这句话
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.margin-top-15 {
  margin-top: 15px;
}
.margin-top-30 {
  margin-top: 30px;
}
</style>
