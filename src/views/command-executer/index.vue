<script>
import axios from "axios"
export default {
  data() {
    return {
      formData: {
        ipAddress: "",
        dbName: "",
        command: ""
      },
      tableHeader: [],
      tableData: [],
      displayedData: [],
      currentPage: 1,
      pageSize: 20,
      commType: "",
      commTypeValues: [
        { label: "查询", value: "query" },
        { label: "创建/删除/修改", value: "update" },
        { label: "插入", value: "insert" }
      ]
    }
  },
  methods: {
    executeCommand() {
      if (!this.formData.ipAddress) {
        this.$message.error("请输入IP地址")
        return
      } else if (!this.formData.command) {
        this.$message.error("请输入要执行的命令")
        return
      } else {
        console.log("sss")
        //根据输入sql语句的形式判断，创建、查询、删除、插入、修改
        //端口号 设置
        const url = "http://" + this.formData.ipAddress + ":8086/"
        const dbName = this.formData.dbName
        const command = this.formData.command

        if (this.commType == "query") {
          const sqlType = "query"
          const apiUrl = url + sqlType

          axios
            .get(apiUrl, {
              params: {
                db: dbName,
                pretty: true,
                q: command
              }
            })
            .then((response) => {
              const results = response.data.results[0]
              if (results && results.error) {
                this.$message.error(results.error)
              } else if (results && results.series) {
                this.tableHeader = results.series[0].columns
                this.tableData = results.series[0].values.map((row) => {
                  return results.series[0].columns.reduce((rowData, columnName, index) => {
                    rowData[columnName] = row[index]
                    return rowData
                  }, {})
                })
                console.log(this.tableData)
                this.updateDisplayedData()
              }
            })
            .catch((error) => {
              this.$message.error("Error fetching data:", error)
            })
        } else if (this.commType == "update") {
          //创建数据库、删除数据库是post,query
          const sqlType = "query"
          const apiUrl = url + sqlType

          axios
            .post(apiUrl, null, {
              params: {
                db: dbName,
                pretty: true,
                q: command
              }
            })
            .then((response) => {
              // 根据响应判断操作是否成功
              if (response.status === 200) {
                this.$message.success("Database operate successfully.")
              } else {
                const results = response.data.results[0]
                if (results && results.error) {
                  this.$message.error(results.error)
                }
                this.$message.error("Failed to operate database.")
              }
            })
            .catch((error) => {
              this.$message.error("Error: " + error.message)
            })
        } else if (this.commType == "insert") {
          //TODO 插入insert去掉
          const sqlType = "write"
          const apiUrl = url + sqlType + "?db=" + dbName
          // 使用正则表达式来提取 InfluxDB 插入语句的值部分
          const processedCom = command.replace(/^INSERT\s+/i, "")
          console.log(processedCom)

          //const apiUrl = "http://127.0.0.1:8086/write?db=test";
          //const data = "mymeas value=5";      value=5,等号两边不能有空格，command不要insert
          axios
            .post(apiUrl, processedCom)
            .then((response) => {
              // 根据响应判断操作是否成功
              if (response.status === 204) {
                this.$message.success("Database operate successfully.")
              } else {
                const results = response.data.results[0]
                if (results && results.error) {
                  this.$message.error(results.error)
                }
                this.$message.error("Failed to operate database.")
              }
            })
            .catch((error) => {
              this.$message.error("Error: " + error.message)
            })
        }
      }
    },
    updateDisplayedData() {
      const startIndex = (this.currentPage - 1) * this.pageSize
      this.displayedData = this.tableData.slice(startIndex, startIndex + this.pageSize)
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.currentPage = 1
      this.updateDisplayedData()
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      this.updateDisplayedData()
    },
    executeClear() {
      this.formData.ipAddress = ""
      this.formData.dbName = ""
      this.formData.command = ""
    }
  }
}
</script>

<template>
  <div>
    <!-- 第一个卡片 -->
    <el-card shadow="always" class="card-wrapper">
      <el-form :model="formData" ref="form" label-width="90px" :label-position="right" :rules="rules">
        <div class="top-container">
          <div class="input-container">
            <el-form-item label="IP地址" prop="ipAddress">
              <el-input v-model="formData.ipAddress" placeholder="请输入IP地址" />
            </el-form-item>
          </div>
          <div class="input-container">
            <el-form-item label="数据库名称" prop="dbName">
              <el-input v-model="formData.dbName" placeholder="请输入数据库名称" />
            </el-form-item>
          </div>
          <div class="input-container">
            <el-form-item label="命令类型" prop="commType">
              <el-select v-model="commType" clearable placeholder="Select">
                <el-option v-for="item in commTypeValues" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="bottom-container">
          <div class="inputcommand-container">
            <el-form-item label="命令">
              <el-input v-model="formData.command" type="textarea" placeholder="请输入要执行的命令" />
            </el-form-item>
          </div>
        </div>
        <div class="button-container">
          <el-form-item>
            <el-button type="primary" round @click="executeCommand">执行</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" round @click="executeClear">清空</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <!-- 第二个卡片 -->
    <el-card shadow="always" class="card-wrapper">
      <!-- 表格内容 -->
      <el-table :data="displayedData" border style="width: 100%">
        <el-table-column :prop="item" :label="item" v-for="item in tableHeader" :key="item" />
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="pageSize"
        :total="tableData.length"
        layout="sizes, prev, pager, next, jumper"
        style="float: right"
      />
    </el-card>
  </div>
</template>

<style scoped>
.card-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}
.input-container {
  width: 200px; /* 设置为你希望的宽度 */
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
}

.top-container,
.bottom-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.input-container {
  margin: 10px;
  width: 300px;
  /* 调整宽度以对齐两行内容 */
}

.inputcommand-container {
  margin: 10px;
  width: 820px;
  /* 调整宽度以对齐两行内容 */
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
