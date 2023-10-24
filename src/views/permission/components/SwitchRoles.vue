<script lang="ts" setup>
import { ref, watch } from "vue"
import { useUserStore } from "@/store/modules/user"
import { ElMessage } from "element-plus"

// 获取环境变量
const passwordSwitchToAdmin = import.meta.env.VITE_APP_PASSWORD_SWITCH_TO_ADMIN

/** Vue 3.3+ defineEmits 语法 */
const emit = defineEmits<{
  change: []
}>()

const userStore = useUserStore()
const switchRoles = ref(userStore.roles[0])
const adminDialogVisible = ref(false) // 控制窗口显示
const adminInfo = ref("") // 存储切换角色为 admin 时需要输入的密码
const maxErrorAttempts = 3 // 最大错误尝试次数
let errorAttempts = 0 // 当前错误尝试次数

watch(switchRoles, async (value) => {
  // 如果用户切换到 admin 角色，显示管理员密码窗口
  if (value === "admin") {
    adminDialogVisible.value = true
  } else {
    await userStore.changeRoles(value)
    emit("change")
  }
})

const submitAdminInfo = async () => {
  if (adminInfo.value === passwordSwitchToAdmin) {
    adminInfo.value = ""
    adminDialogVisible.value = false // 关闭窗口
    errorAttempts = 0

    // 切换为 admin 权限
    await userStore.changeRoles("admin")
    emit("change")
  } else {
    errorAttempts++ // 增加错误尝试次数
    console.log(`切换管理员权限密码验证失败，错误尝试次数：${errorAttempts}`)

    if (errorAttempts >= maxErrorAttempts) {
      console.log("错误尝试次数达到上限，关闭窗口")
      adminInfo.value = ""
      adminDialogVisible.value = false // 关闭窗口
      switchRoles.value = "editor"
    } else {
      // 清空输入框
      adminInfo.value = ""
      ElMessage.error(`密码错误，剩余尝试次数：${maxErrorAttempts - errorAttempts}`)
    }
  }
}

const cancelAdminSwitch = () => {
  adminInfo.value = ""
  adminDialogVisible.value = false
  switchRoles.value = "editor"
}

// 处理 ElDialog 框右上角的 "X" 按钮
const handleBeforeClose = (done: () => void) => {
  if (switchRoles.value === "admin") {
    switchRoles.value = "editor"
  }
  adminInfo.value = ""
  done()
}
</script>

<template>
  <div>
    <div>你的权限：{{ userStore.roles }}</div>
    <div class="switch-roles">
      <span>切换权限：</span>
      <el-radio-group v-model="switchRoles">
        <el-radio-button label="editor" />
        <el-radio-button label="admin" />
      </el-radio-group>
    </div>

    <el-dialog
      class="el-dialog"
      title="切换管理员权限密码验证"
      v-model="adminDialogVisible"
      width="25%"
      :before-close="handleBeforeClose"
    >
      <el-input
        class="el-dialog-body"
        type="password"
        v-model="adminInfo"
        placeholder="请输入验证密码"
        show-password
        @keyup.enter="submitAdminInfo"
      />
      <template v-if="adminDialogVisible">
        <div class="dialog-footer">
          <el-button @click="cancelAdminSwitch">取消</el-button>
          <el-button type="primary" @click="submitAdminInfo">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.switch-roles {
  margin-top: 15px;
  display: flex;
  align-items: center;
}
.el-dialog {
  border-radius: 10px;
}
.el-dialog-body {
  padding: px;
}
.dialog-footer {
  text-align: right;
  margin-top: 20px;
}
</style>
