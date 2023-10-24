<template>
  <div>
    <!-- 第一个卡片 -->
    <el-card shadow="always" class="card-wrapper">
      <el-form :model="formData" ref="form" label-width="90px">
        <div class="top-container">
          <div class="input-container">
            <el-form-item label="IP地址" prop="searchHostname">
              <el-input v-model="formData.searchHostname" placeholder="请输入Hostname" />
            </el-form-item>
          </div>
          <div class="input-container">
            <el-form-item label="Level" prop="searchLevel">
              <el-input v-model="formData.searchLevel" placeholder="请输入Level" />
            </el-form-item>
          </div>
          <div class="input-container">
            <el-form-item label="Message" prop="searchMsg">
              <el-input v-model="formData.searchMsg" placeholder="请输入Message" />
            </el-form-item>
          </div>
        </div>
        <div class="bottom-container">
          <div class="input-container">  
            <el-form-item label="起始时间" prop="searchStartTime">
              <el-date-picker
                  v-model="formData.searchStartTime"
                  type="datetime"
                  placeholder="输入起始时间"
                  format="YYYY/MM/DD hh:mm:ss"
                  value-format="'YYYY-MM-DDThh:mm:ss[Z]'"
              />
            </el-form-item>
          </div>
          <div class="input-container">  
            <el-form-item label="终止时间" prop="searchEndTime">
              <el-date-picker
                v-model="formData.searchEndTime"
                type="datetime"
                placeholder="输入终止时间"
                format="YYYY/MM/DD hh:mm:ss"
                value-format="'YYYY-MM-DDThh:mm:ss[Z]'"
              />
          </el-form-item>
          </div>
        </div>
        <div class="button-container">
          <el-form-item>
            <el-button type="primary" round @click="fetchData">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" round @click="executeClear">清空</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <!-- 表格内容 -->
    <el-card shadow="always" class="card-wrapper">    
      <el-table 
        :data="displayedData" 
        @sort-change="fetchData" 
        border 
        style="width: 100%">
        <el-table-column :prop="item" :label="item" v-for="item in tableHeader" :sortable="'custom'" :key="item" />
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
    </el-card>
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
      formData: {
        searchStartTime: "",
        searchEndTime: "",
        searchHostname: "",
        searchLevel: "",
        searchMsg: ""
      }
    }
  },
  methods: {
    fetchData(column: any) {
      this.tableData = []
      this.tableHeader = []
      this.displayedData = []
      this.currentPage = 1
      this.pageSize = 8

      const apiUrl = "http://localhost:8086/query"
      const queryDB = "db"
      let querySql = "select * from logs where 1 = 1"

      /* 附加查询条件 */
      if ("" != this.formData.searchLevel && null != this.formData.searchLevel) {
        querySql += " " + " AND level = " + this.formData.searchLevel
      }
      if ("" != this.formData.searchHostname && null != this.formData.searchHostname) {
        querySql += " " + " AND hostname = " + this.formData.searchHostname
      }
      if ("" != this.formData.searchMsg && null != this.formData.searchMsg) {
        querySql += " " + " AND msg = " + this.formData.searchMsg
      }
      if ("" != this.formData.searchStartTime && null != this.formData.searchStartTime) {
        querySql += " " + " AND time >= " + this.formData.searchStartTime
      }
      if ("" != this.formData.searchEndTime && null != this.formData.searchEndTime) {
        querySql += " " + " AND time <= " + this.formData.searchEndTime
      }

      //TODO附加排序
      //console.log(column);
      //console.log(column.prop);
      //console.log(column.order);
      if(column != undefined){
        if ("" != column.prop && null != column.prop) {
          console.log(column.prop);
          console.log(column.order);
          querySql += " " + " order by " + column.prop;
          if(column.order == 'ascending'){
            querySql += " " + " ASC ";
          }
          else if(column.order == 'descending'){
            querySql += " " + " DESC ";
          }
        }
      }
      console.log(querySql);

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
            this.tableData = results.series[0].values.map((row: any[]) => {
              return results.series[0].columns.reduce((rowData: any, columnName: string, index: number) => {
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
    },
    executeClear() {
      this.formData.searchHostname = ""
      this.formData.searchLevel = ""
      this.formData.searchMsg = ""
      this.formData.searchStartTime = ""
      this.formData.searchEndTime = ""
    }
  },
  mounted() {
    this.fetchData(undefined)
  }
}
</script>

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
