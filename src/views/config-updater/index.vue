<!--template>
  <div>
    <h1>opengemini.conf 文件内容</h1>
    <div>
      <label for="bindAddressInMeta">bind-address:</label>
      <input type="text" id="bindAddressInMeta" v-model="newBindAddressInMeta" />
    </div>
    <div>
      <label for="httpBindAddressInMeta">http-bind-address:</label>
      <input type="text" id="httpBindAddressInMeta" v-model="newHttpBindAddressInMeta" />
    </div>
    <button @click="saveConfigFileContent">保存配置文件内容</button>
  </div>
</template!-->
<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="searchData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="searchData.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增用户</el-button>
          <el-button type="danger" :icon="Delete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="username" label="用户名" align="center" />
          <el-table-column prop="roles" label="角色" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.roles === 'admin'" effect="plain">admin</el-tag>
              <el-tag v-else type="warning" effect="plain">{{ scope.row.roles }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" align="center" />
          <el-table-column prop="email" label="邮箱" align="center" />
          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status" type="success" effect="plain">启用</el-tag>
              <el-tag v-else type="danger" effect="plain">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增用户' : '修改用户'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="formData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="password" label="密码" v-if="currentUpdateId === undefined">
          <el-input v-model="formData.password" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      configFileContent: "", //存储配置文件内容
      newBindAddressInMeta: "", //存储新的 bind-address
      newHttpBindAddressInMeta: "" //存储新的 https-bind-address
    }
  },
  created() {
    this.loadConfigFileContent()
    this.startServer()
  },
  methods: {
    async startServer() {
      try {
        // 向后端发送请求以触发服务器的启动
        const response = await fetch("http://localhost:8086/start-server", {
          method: "POST"
        })

        if (response.ok) {
          console.log("Server started successfully.")
        } else {
          console.error("Failed to start server:", response.status, response.statusText)
        }
      } catch (error) {
        console.error("Error starting server:", error)
      }
    },
    async loadConfigFileContent() {
      try {
        const response = await fetch("http://localhost:8086/get-config-file-content")
        if (response.ok) {
          const data = await response.text()

          /*
          //使用正则表达式提取 [meta] 部分的 bind-address
          const bindAddressRegexInMeta = /\[meta\][\s\S]*?bind-address\s*=\s*"(.*?)"/;
          const bindAddressMatchInMeta = data.match(bindAddressRegexInMeta);
          if (bindAddressMatchInMeta) {
            this.newBindAddress = bindAddressMatchInMeta[1];
          }
          //使用正则表达式提取 [meta] 部分的 http-bind-address
          const httpBindAddressRegexInMeta = /\[meta\][\s\S]*?http-bind-address\s*=\s*"(.*?)"/;
          const httpBindAddressMatchInMeta = data.match(httpBindAddressRegexInMeta);
          if(httpBindAddressMatchInMeta) {
            this.newHttpBindAddress = httpBindAddressMatchInMeta[1];
          }
          */
          const regexInMeta = /\[meta\][\s\S]*?bind-address\s*=\s*"([^"]*)"\s*http-bind-address\s*=\s*"([^"]*)"/
          const regexMatchInMeta = data.match(regexInMeta)
          if (regexMatchInMeta && regexMatchInMeta.length >= 3) {
            this.newBindAddressInMeta = regexMatchInMeta[1]
            this.newHttpBindAddressInMeta = regexMatchInMeta[2]
          }
        } else {
          console.error("Failed to fetch configuration file:", response.status, response.statusText)
        }
      } catch (error) {
        console.error("Error fetching configuration file:", error)
      }
    },
    async saveConfigFileContent() {
      try {
        const response = await fetch("http://localhost:8086/save-config-file-content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            bindAddressInMeta: this.newBindAddressInMeta,
            httpBindAddressInMeta: this.newHttpBindAddressInMeta
          })
        })

        if (response.ok) {
          console.log("Configuration file saved successfully.")
        } else {
          console.error("Failed to save configuration file:", response.status, response.statusText)
        }
      } catch (error) {
        console.error("Error saving configuration file:", error)
      }
    }
  }
}
</script>

<style>
/* 修改输入框的宽度 */
input {
  width: 100%;
}
</style>
