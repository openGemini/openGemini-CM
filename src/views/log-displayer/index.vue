<template>
  <div>
    <!-- 查询条件 -->
    <div>
      <el-card shadow="always" class="card-wrapper">
        <el-form label-width="90px">
          <div class="top-container">
            <div class="input-container">
              <el-form-item label="Hostname">
                <el-input v-model="searchHostname" placeholder="Enter hostname" />
              </el-form-item>
            </div>
            <div class="input-container">
              <el-form-item label="Level">
                <el-input v-model="searchLevel" placeholder="Enter level" />
              </el-form-item>
            </div>
            <div class="input-container">
              <el-form-item>
                <el-date-picker
                  v-model="searchStartTime"
                  type="datetime"
                  placeholder="输入起始时间"
                  format="YYYY/MM/DD hh:mm:ss"
                  value-format="'YYYY-MM-DDThh:mm:ss[Z]'"
                />
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  v-model="searchEndTime"
                  type="datetime"
                  placeholder="输入终止时间"
                  format="YYYY/MM/DD hh:mm:ss"
                  value-format="'YYYY-MM-DDThh:mm:ss[Z]'"
                />
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-card>
    </div>
    <!-- 表格内容 -->
    <el-table :data="displayedData" :default-sort="{ prop: 'time', order: 'descending' }" border style="width: 100%">
      <el-table-column :prop="item" :label="item" v-for="item in tableHeader" :sortable="true" :key="item" />
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      :total="tableData.length"
      layout="sizes, prev, pager, next, jumper"
      style="float: right"
    />
  </div>
</template>

<script lang="ts">
import axios from "axios"

export default {
  name: "LogTable",
  data() {
    return {
      tableHeader: [],
      tableData: [],
      displayedData: [],
      currentPage: 1,
      pageSize: 8,
      searchStartTime: "",
      searchEndTime: "",
      searchHostname: "",
      searchLevel: "",
      searchMsg: ""
    }
  },
  methods: {
    fetchData() {
      this.tableData = []
      this.tableHeader = []
      this.displayedData = []
      this.currentPage = 1
      this.pageSize = 8

      const apiUrl = "http://localhost:8086/query"
      const queryDB = "db"
      let querySql = "select * from logs where 1 = 1"

      /* 附加查询条件 */
      if ("" != this.searchLevel && null != this.searchLevel) {
        querySql += " " + " AND level = " + this.searchLevel
      }
      if ("" != this.searchStartTime && null != this.searchStartTime) {
        querySql += " " + " AND time >= " + this.searchStartTime
      }
      if ("" != this.searchEndTime && null != this.searchEndTime) {
        querySql += " " + " AND time <= " + this.searchEndTime
      }

      axios
        .get(apiUrl, {
          params: {
            db: queryDB,
            pretty: true,
            q: querySql
          }
        })
        .then((response) => {
          const results = response.data.results[0]
          if (results && results.series) {
            this.tableHeader = results.series[0].columns
            this.tableData = results.series[0].values.map((row) => {
              return results.series[0].columns.reduce((rowData: RowData, columnName: string, index: number) => {
                rowData[columnName] = row[index]
                return rowData
              }, {})
            })
            console.log(this.tableData)
            this.updateDisplayedData()
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error)
        })
    },
    updateDisplayedData() {
      const startIndex = (this.currentPage - 1) * this.pageSize
      this.displayedData = this.tableData.slice(startIndex, startIndex + this.pageSize)
    },
    handleSizeChange(newSize: number) {
      this.pageSize = newSize
      this.currentPage = 1
      this.updateDisplayedData()
    },
    handleCurrentChange(newPage: number) {
      this.currentPage = newPage
      this.updateDisplayedData()
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style>
/* Add your custom styles here */
</style>
