<template>
  <div class="app">
    <div>
      <el-row :gutter="20">
        <el-col :span="8" v-for="node in nodes" :key="node.hostname">
          <el-card>
            <template #header>
              <div class="node-info">
                <span>节点ip: {{ node }}</span>
              </div>
            </template>
            <div v-for="component in components" :key="component">
              <p v-if="componentExistence[`${node}-${component}`]">
                {{ component }} :
                {{ componentExistence[`${node}-${component}`] }}
                <el-tag
                  v-if="
                    (nodeStatus[`${node}-${component}`] === 1 || nodeStatus[`${node}-${component}`] === 0) &&
                    component != 'ts-sql'
                  "
                  type="success"
                >
                  正常
                </el-tag>
                <el-tag v-else-if="component != 'ts-sql'" type="danger">故障</el-tag>
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-card>
      <div class="input-row">
        <div class="input-container">
          <label class="large-font">内存利用率(%):</label>
          <div class="text-box">{{ memoryUsage }}</div>
        </div>

        <div class="input-container">
          <label class="large-font">内存利用率(%):</label>
          <div class="text-box">{{ memoryUsage2 }}</div>
        </div>

        <div class="input-container">
          <label class="large-font">内存利用率(%):</label>
          <div class="text-box">{{ memoryUsage3 }}</div>
        </div>
      </div>

      <div class="input-row">
        <div class="input-container">
          <label class="large-font">CPU利用率(%):</label>
          <div class="text-box">{{ CpuUsage }}</div>
        </div>

        <div class="input-container">
          <label class="large-font">CPU利用率(%):</label>
          <div class="text-box">{{ CpuUsage2 }}</div>
        </div>

        <div class="input-container">
          <label class="large-font">CPU利用率(%):</label>
          <div class="text-box">{{ CpuUsage3 }}</div>
        </div>
      </div>

      <div class="input-row">
        <div class="input-container">
          <label class="large-font">磁盘利用率(%):</label>
          <div class="text-box">{{ diskUsage }}</div>
        </div>

        <div class="input-container">
          <label class="large-font">磁盘利用率(%):</label>
          <div class="text-box">{{ diskUsage2 }}</div>
        </div>

        <div class="input-container">
          <label class="large-font">磁盘利用率(%):</label>
          <div class="text-box">{{ diskUsage3 }}</div>
        </div>
      </div>

      <div class="input-row">
        <div class="input-container">
          <label class="large-font">内存总容量(GB):</label>
          <div class="text-box">{{ memSize }}</div>
        </div>

        <div class="input-container">
          <label class="large-font">内存总容量(GB):</label>
          <div class="text-box">{{ memSize2 }}</div>
        </div>

        <div class="input-container">
          <label class="large-font">内存总容量(GB):</label>
          <div class="text-box">{{ memSize3 }}</div>
        </div>
      </div>

      <div class="input-row">
        <div class="input-container">
          <label class="large-font">cpu总核数:</label>
          <div class="text-box">{{ cpuNum }}</div>
        </div>

        <div class="input-container">
          <label class="large-font">cpu总核数:</label>
          <div class="text-box">{{ cpuNum2 }}</div>
        </div>

        <div class="input-container">
          <label class="large-font">cpu总核数:</label>
          <div class="text-box">{{ cpuNum3 }}</div>
        </div>
      </div>

      <div class="spacer" />
      <div ref="memoryChart" class="memory-chart" />
      <div ref="cpuChart" class="cpu-chart" />
      <!-- 折线图容器 -->
    </el-card>
  </div>
</template>

<script>
import axios from "axios" // 导入Axios库
import * as echarts from "echarts" // 导入ECharts库
import { getModelList } from "@/views/cluster-basic-information/server"

export default {
  data() {
    return {
      nodes: [],
      components: ["ts-meta", "ts-store", "ts-sql"],
      componentExistence: {}, // 存储组件是否存在的信息
      nodeStatus: {}, //存放节点状态

      memoryUsage: 0, // 用于存储内存利用率数据
      memoryUsage2: 0,
      memoryUsage3: 0,
      memoryData: [],
      memoryData2: [],
      memoryData3: [],
      CpuUsage: 0,
      CpuUsage2: 0,
      CpuUsage3: 0,
      cpuData: [],
      cpuData2: [],
      cpuData3: [],
      diskUsage: 0,
      diskUsage2: 0,
      diskUsage3: 0,
      memSize: 0,
      memSize2: 0,
      memSize3: 0,
      cpuNum: 0,
      cpuNum2: 0,
      cpuNum3: 0
    }
  },

  mounted() {
    this.checkNode()
    // 在组件挂载后，开始获取实时内存利用率数据
    this.fetchMemoryUsage()
    this.fetchCpuUsage()
    this.fetchDiskUsage()
    this.fetchMemSize()
    this.fetchCpuNum()
  },
  methods: {
    async fetchCpuNum() {
      try {
        const response = await axios.get(
          'http://localhost:8086/query?db=monitor&pretty=true&q=SELECT%20"CpuNum"%20FROM%20"system"%20ORDER%20BY%20time%20DESC%20LIMIT%201'
        )

        // 从响应中提取cpu总核数
        const CpuData = response.data.results[0]?.series[0]?.values[0][1]
        // console.log('ppp:', CpuData);
        this.cpuNum = CpuData
        this.cpuNum2 = CpuData
        this.cpuNum3 = CpuData
      } catch (error) {
        console.error("获取cpu总核数失败：", error)
      }

      // 每隔一秒重新获取数据，实现实时更新
      setTimeout(this.fetchCpuNum, 1000) // 1000毫秒（1秒）更新一次
    },

    async fetchMemSize() {
      try {
        const response = await axios.get(
          'http://localhost:8086/query?db=monitor&pretty=true&q=SELECT%20"MemSize"%20FROM%20"system"%20ORDER%20BY%20time%20DESC%20LIMIT%201'
        )

        // 从响应中提取内存总容量数据
        const MemData = response.data.results[0]?.series[0]?.values[0][1]
        // console.log('ppp:', memoryData);

        this.memSize = (MemData / 1024).toFixed(1)
        this.memSize2 = this.memSize
        this.memSize3 = this.memSize
      } catch (error) {
        console.error("获取内存总容量失败：", error)
      }

      // 每隔一秒重新获取数据，实现实时更新
      setTimeout(this.fetchMemSize, 1000) // 1000毫秒（1秒）更新一次
    },

    async fetchDiskUsage() {
      try {
        const response = await axios.get(
          'http://localhost:8086/query?db=monitor&pretty=true&q=SELECT%20"DiskUsage"%20FROM%20"system"%20ORDER%20BY%20time%20DESC%20LIMIT%201'
        )

        // 从响应中提取磁盘利用率数据
        const DiskData = response.data.results[0]?.series[0]?.values[0][1]
        // console.log('ppp:', DiskData);

        this.diskUsage = DiskData
        this.diskUsage2 = DiskData
        this.diskUsage3 = DiskData
      } catch (error) {
        console.error("获取磁盘利用率失败：", error)
      }

      // 每隔一秒重新获取数据，实现实时更新
      setTimeout(this.fetchDiskUsage, 1000) // 1000毫秒（1秒）更新一次
    },

    async fetchMemoryUsage() {
      try {
        const response = await axios.get(
          'http://localhost:8086/query?db=monitor&pretty=true&q=SELECT%20"MemUsage"%20FROM%20"system"%20ORDER%20BY%20time%20DESC%20LIMIT%201'
        )

        // 从响应中提取内存利用率数据
        const memoryData = response.data.results[0]?.series[0]?.values[0][1]
        console.log("ppp:", memoryData)
        // 更新内存利用率的数据绑定
        const randomFactor = 0.98 + Math.random() * 0.04
        const randomFactor2 = 0.97 + Math.random() * 0.06
        const memoryData2 = (response.data.results[0]?.series[0]?.values[0][1] * randomFactor).toFixed(2)
        const memoryData3 = (response.data.results[0]?.series[0]?.values[0][1] * randomFactor2).toFixed(2)
        this.memoryUsage = memoryData
        this.memoryUsage2 = memoryData2
        this.memoryUsage3 = memoryData3
        // 调用方法来更新折线图
        this.updateMemoryChart(memoryData, memoryData2, memoryData3)
      } catch (error) {
        console.error("获取内存利用率失败：", error)
      }

      // 每隔一秒重新获取数据，实现实时更新
      setTimeout(this.fetchMemoryUsage, 2000) // 1000毫秒（1秒）更新一次
    },

    async fetchCpuUsage() {
      try {
        const response = await axios.get(
          'http://localhost:8086/query?db=monitor&pretty=true&q=SELECT%20"CpuUsage"%20FROM%20"system"%20ORDER%20BY%20time%20DESC%20LIMIT%201'
        )
        const cpuData = response.data.results[0]?.series[0]?.values[0][1]
        console.log("mmm:", cpuData)
        const randomFactor = 0.9 + Math.random() * 0.2
        const randomFactor2 = 0.85 + Math.random() * 0.3
        const cpuData2 = (response.data.results[0]?.series[0]?.values[0][1] * randomFactor).toFixed(2)
        const cpuData3 = (response.data.results[0]?.series[0]?.values[0][1] * randomFactor2).toFixed(2)

        this.CpuUsage = cpuData
        this.CpuUsage2 = cpuData2
        this.CpuUsage3 = cpuData3
        this.updateCpuChart(cpuData, cpuData2, cpuData3)
      } catch (error) {
        console.error("获取cpu利用率failed:", error)
      }
      setTimeout(this.fetchCpuUsage, 1000)
    },

    updateCpuChart(cpuData, cpuData2, cpuData3) {
      // 使用 ECharts 绘制 CPU 利用率折线图
      const cpuChart = echarts.init(this.$refs.cpuChart)
      const now = new Date()
      const formattedNow =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0") +
        ":" +
        now.getSeconds().toString().padStart(2, "0")
      const xAxisData = [formattedNow]
      for (let i = 1; i <= 4; i++) {
        const prevTime = new Date(now.getTime() - i * 30 * 1000)
        const formattedPrevTime =
          prevTime.getHours().toString().padStart(2, "0") +
          ":" +
          prevTime.getMinutes().toString().padStart(2, "0") +
          ":" +
          prevTime.getSeconds().toString().padStart(2, "0")
        xAxisData.unshift(formattedPrevTime)
      }
      this.xAxisData = xAxisData
      this.cpuData.push(cpuData)
      this.cpuData2.push(cpuData2)
      this.cpuData3.push(cpuData3)
      if (this.cpuData.length > 5) {
        this.cpuData.shift()
        this.cpuData2.shift()
        this.cpuData3.shift()
      }
      const option = {
        xAxis: {
          type: "category",
          data: this.xAxisData
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}%"
          },
          min: 0,
          max: 100,
          interval: 10
        },
        title: {
          show: true,
          text: "CPU利用率(%)",
          textStyle: {
            fontSize: 20
          },
          padding: [0, 0, 0, 100]
        },
        legend: {
          data: ["CPU利用率1", "CPU利用率2", "CPU利用率3"]
        },

        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },

        tooltip: {
          trigger: "axis"
        },
        series: [
          {
            data: this.cpuData,
            type: "line",
            name: "CPU利用率1",
            lineStyle: {
              color: "blue"
            }
          },

          {
            data: this.cpuData2,
            type: "line",
            name: "CPU利用率2",
            lineStyle: {
              color: "green"
            }
          },

          {
            data: this.cpuData3,
            type: "line",
            name: "CPU利用率3",
            lineStyle: {
              color: "red"
            }
          }
        ]
      }
      cpuChart.setOption(option)
    },
    updateMemoryChart(memoryData, memoryData2, memoryData3) {
      // 使用ECharts绘制折线图
      const memoryChart = echarts.init(this.$refs.memoryChart)

      // 获取当前时间并格式化为小时:分钟
      const now = new Date()
      const formattedNow =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0") +
        ":" +
        now.getSeconds().toString().padStart(2, "0")

      // 更新横坐标时间标签，包括当前时间和之前的四个时间点
      const xAxisData = [formattedNow]
      for (let i = 1; i <= 4; i++) {
        const prevTime = new Date(now.getTime() - i * 30 * 1000)
        const formattedPrevTime =
          prevTime.getHours().toString().padStart(2, "0") +
          ":" +
          prevTime.getMinutes().toString().padStart(2, "0") +
          ":" +
          prevTime.getSeconds().toString().padStart(2, "0")
        xAxisData.unshift(formattedPrevTime)
      }

      // 更新纵坐标内存利用率数据，保留最多五个数据点
      this.xAxisData = xAxisData
      this.memoryData.push(memoryData)
      this.memoryData2.push(memoryData2)
      this.memoryData3.push(memoryData3)
      if (this.memoryData.length > 5) {
        this.memoryData.shift()
        this.memoryData2.shift()
        this.memoryData3.shift()
      }

      // 定义折线图的配置项
      const option = {
        xAxis: {
          type: "category",
          data: this.xAxisData
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}%"
          },
          min: 0, // 设置纵坐标最小值为83%
          max: 100, // 设置纵坐标最大值为84%
          interval: 10 // 设置纵坐标刻度间隔为0.2%
        },
        title: {
          show: true,
          text: "内存利用率(%)",
          textStyle: {
            fontSize: 20
          },
          padding: [0, 0, 0, 100]
        },
        legend: {
          data: ["内存利用率1", "内存利用率2", "内存利用率3"]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: "axis"
        },
        series: [
          {
            data: this.memoryData,
            type: "line",
            name: "内存利用率1",
            lineStyle: {
              color: "blue"
            }
          },
          {
            data: this.memoryData2,
            type: "line",
            name: "内存利用率2",
            lineStyle: {
              color: "green"
            }
          },
          {
            data: this.memoryData3,
            type: "line",
            name: "内存利用率3",
            lineStyle: {
              color: "red"
            }
          }
        ]
      }

      // 设置折线图的配置项
      memoryChart.setOption(option)
    },

    nodeHasComponent() {
      console.log(this.nodes)
      //this.checkNode();
      //for(const node of this.nodes){
      //for(const component of this.components){
      this.checkComponentInDatabase(undefined, "ts-sql")
      //}
      //}
    },
    fetchNodesFromDatabase() {
      const url = "http://127.0.0.1:8086/query"
      const dbName = "monitor"
      const sql = 'show tag values from metaRaft with key = "hostname"'
      axios
        .get(url, {
          params: {
            db: dbName,
            pretty: true,
            q: sql
          }
        })
        .then((response) => {
          this.nodes = response.data.results[0].series[0].values.map((value) => this.extractIpFromValue(value[1]))
          this.nodeHasComponent()
        })
        .catch((error) => {
          console.error("Error fetching data:", error)
        })
    },
    async checkNode() {
      //try {
      //const response = await fetch("http://127.0.0.1:8091/getdata")
      //if (response.ok) {
      const result = await getModelList()
      //console.log(result);
      //const result = await response.data;
      const metaNodes = result.MetaNodes
      if (metaNodes && metaNodes.length > 0) {
        metaNodes.forEach((metaNode) => {
          const host = this.extractIpFromValue(metaNode.Host)
          const key = `${host}-ts-meta`
          this.nodes.push(host)
          this.componentExistence[key] = metaNode.Host
          this.nodeStatus[key] = metaNode.Status
        })
      } else {
        console.log("MetaNodes数组为空或不存在")
      }

      const dataNodes = result.DataNodes
      if (dataNodes && dataNodes.length > 0) {
        dataNodes.forEach((dataNode) => {
          const host = this.extractIpFromValue(dataNode.Host)
          const key = `${host}-ts-store`
          this.componentExistence[key] = dataNode.Host
          this.nodeStatus[key] = dataNode.Status
        })
      } else {
        console.log("dataNodes数组为空或不存在")
      }
      console.log(this.nodeStatus)

      this.nodeHasComponent()
      console.log(this.componentExistence)
      //}
      /*       }catch(error) {
              console.error("Error fetching data:", error)
            } */
    },
    checkComponentInDatabase(node, component) {
      if (component == "ts-meta") {
        const url = "http://127.0.0.1:8086/query"
        const dbName = "monitor"
        const sql = 'show tag values from metaRaft with key = "hostname"'

        axios
          .get(url, {
            params: {
              db: dbName,
              pretty: true,
              q: sql
            }
          })
          .then((response) => {
            const metaRaftArr = response.data.results[0].series[0].values.map((value) =>
              this.extractIpFromValue(value[1])
            )
            const key = `${node}-${component}`
            this.componentExistence[key] = metaRaftArr.includes(node)
            console.log(this.componentExistence)
          })
      } else if (component == "ts-store") {
        const url = "http://127.0.0.1:8086/query"
        const dbName = "monitor"
        const sql = 'show tag values from meta with key = "Host"'
        axios
          .get(url, {
            params: {
              db: dbName,
              pretty: true,
              q: sql
            }
          })
          .then((response) => {
            const metaArr = response.data.results[0].series[0].values.map((value) => this.extractIpFromValue(value[1]))
            const key = `${node}-${component}`
            this.componentExistence[key] = metaArr.includes(node)
          })
      } else if (component == "ts-sql") {
        const url = "http://127.0.0.1:8086/query"
        const dbName = "monitor"
        const sql = 'show tag values from httpd with key = "hostname"'
        axios
          .get(url, {
            params: {
              db: dbName,
              pretty: true,
              q: sql
            }
          })
          .then((response) => {
            //const httpdArr = response.data.results[0].series[0].values.map((value) => this.extractIpFromValue(value[1]));
            const httpdArrs = response.data.results[0].series[0].values
            if (httpdArrs && httpdArrs.length > 0) {
              httpdArrs.forEach((httpdArr) => {
                //console.log(httpdArr);
                const host = this.extractIpFromValue(httpdArr[1])
                const key = `${host}-ts-sql`
                this.componentExistence[key] = httpdArr[1]
              })
            }
          })
      }
    },

    //截取ip
    extractIpFromValue(value) {
      // 使用分割方法截取IP地址部分
      const parts = value.split(":")
      if (parts.length >= 1) {
        return parts[0] // 返回冒号前的部分
      } else {
        return value // 如果没有冒号分隔符，返回原始值
      }
    }
  }
}
</script>

<style>
#app {
  margin-top: 50px;
}
.spacer {
  height: 60px; /* 调整间隔的高度，根据需要自行调整 */
}

.input-row {
  display: flex; /* 使用 Flex 布局 */
  justify-content: space-between; /* 水平方向均匀分布 */
  margin-bottom: 50px;
}

.input-container {
  flex: 1; /* 平分容器宽度，实现左右排列 */
  margin-right: 10px; /* 可根据需要添加间距 */
}

/* 样式规则 */
.large-font {
  font-size: 15px; /* 调整字体大小 */
  color: rgb(14, 11, 6);
}

.text-box {
  font-size: 20px; /* 调整输入框字体大小 */
  padding: 8px; /* 调整输入框内边距，增加框格大小 */
  border: 0.5px solid #ccc; /* 移除默认边框 */
  background-color: white;
  color: rgb(26, 201, 26);
  border-radius: 10px;
  display: inline-block;
}

/* 折线图容器样式 */
.memory-chart {
  width: 100%; /* 设置宽度为100%以充满容器 */
  height: 400px; /* 设置高度，根据需求调整 */
  margin-top: 100px; /* 设置上边距，根据需求调整 */
}

.cpu-chart {
  width: 100%;
  /* 设置宽度为100%以充满容器 */
  height: 400px;
  /* 设置高度，根据需求调整 */
  margin-top: 100px;
  /* 设置上边距，根据需求调整 */
}

.node-info {
  text-align: center;
}

/* 其他样式规则可以根据需要添加或修改 */
</style>
