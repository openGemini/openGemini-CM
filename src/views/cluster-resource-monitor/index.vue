<template>
  <div id="app">
    <div class="input-row">
      <div class="input-container">
        <label class="large-font">内存利用率(%):</label>
        <div class="text-box">{{ memoryUsage }}</div>
      </div>

      <div class="input-container">
        <label class="large-font">CPU利用率(%):</label>
        <div class="text-box">{{ CpuUsage }}</div>
      </div>

      <div class="input-container">
        <label class="large-font">磁盘利用率(%):</label>
        <div class="text-box">{{ diskUsage }}</div>
      </div>
    </div>

    <div class="spacer" />

    <div class="input-row">
      <div class="input-container">
        <label class="large-font">内存总容量(GB):</label>
        <div class="text-box">{{ memSize }}</div>
      </div>

      <div class="input-container">
        <label class="large-font">CPU总核数:</label>
        <div class="text-box">{{ cpuNum }}</div>
      </div>

      <div class="input-container">
        <label class="large-font">store进程健康状态:</label>
        <div class="text-box">{{ StoreStaus }}</div>
      </div>
    </div>

    <!-- 折线图容器 -->
    <div ref="memoryChart" class="memory-chart" />

    <!-- CPU利用率折线图容器 -->
    <div ref="cpuChart" class="cpu-chart" />
  </div>
</template>

<script>
import axios from "axios" // 导入Axios库
import * as echarts from "echarts" // 导入ECharts库

export default {
  data() {
    return {
      memoryUsage: 0, // 用于存储内存利用率数据
      CpuUsage: 0,
      diskUsage: 0,
      memSize: 0,
      cpuNum: 0,
      StoreStaus: 0,
      xAxisData: [], // 存储横坐标时间标签
      memoryData: [], // 存储纵坐标内存利用率数据
      cpuXAxisData: [],
      cpuData: []
    }
  },

  mounted() {
    // 在组件挂载后，开始获取实时内存利用率数据
    this.fetchMemoryUsage()
    this.fetchCpuUsage()
    this.fetchDiskUsage()
    this.fetchMemSize()
    this.fetchCpuNum()
    this.fetchStoreStatus()
  },
  methods: {
    async fetchStoreStatus() {
      try {
        const response = await axios.get(
          'http://localhost:8086/query?db=monitor&pretty=true&q=SELECT%20"StoreStatus"%20FROM%20"system"%20ORDER%20BY%20time%20DESC%20LIMIT%201'
        )

        // 从响应中提取内存利用率数据
        const StoreData = response.data.results[0]?.series[0]?.values[0][1]
        console.log("status:", StoreData)
        // 更新内存利用率的数据绑定
        this.StoreStaus = StoreData
      } catch (error) {
        console.error("获取进程状态失败：", error)
      }

      // 每隔一秒重新获取数据，实现实时更新
      setTimeout(this.fetchStoreStatus, 10000) // 1000毫秒（1秒）更新一次
    },
    async fetchCpuNum() {
      try {
        const response = await axios.get(
          'http://localhost:8086/query?db=monitor&pretty=true&q=SELECT%20"CpuNum"%20FROM%20"system"%20ORDER%20BY%20time%20DESC%20LIMIT%201'
        )

        // 从响应中提取内存利用率数据
        const CpuData = response.data.results[0]?.series[0]?.values[0][1]
        // console.log('ppp:', memoryData);
        // 更新内存利用率的数据绑定
        this.cpuNum = CpuData
      } catch (error) {
        console.error("获取cpu核数失败：", error)
      }

      // 每隔一秒重新获取数据，实现实时更新
      setTimeout(this.fetchCpuNum, 10000) // 1000毫秒（1秒）更新一次
    },

    async fetchMemSize() {
      try {
        const response = await axios.get(
          'http://localhost:8086/query?db=monitor&pretty=true&q=SELECT%20"MemSize"%20FROM%20"system"%20ORDER%20BY%20time%20DESC%20LIMIT%201'
        )

        // 从响应中提取内存利用率数据
        const MemData = response.data.results[0]?.series[0]?.values[0][1]
        // console.log('ppp:', memoryData);
        // 更新内存利用率的数据绑定
        this.memSize = (MemData / 1024).toFixed(1)
      } catch (error) {
        console.error("获取内存总容量失败：", error)
      }

      // 每隔一秒重新获取数据，实现实时更新
      setTimeout(this.fetchMemSize, 10000) // 1000毫秒（1秒）更新一次
    },

    async fetchDiskUsage() {
      try {
        const response = await axios.get(
          'http://localhost:8086/query?db=monitor&pretty=true&q=SELECT%20"DiskUsage"%20FROM%20"system"%20ORDER%20BY%20time%20DESC%20LIMIT%201'
        )

        // 从响应中提取内存利用率数据
        const DiskData = response.data.results[0]?.series[0]?.values[0][1]
        // console.log('ppp:', memoryData);
        // 更新内存利用率的数据绑定
        this.diskUsage = DiskData
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
        this.memoryUsage = memoryData

        // 调用方法来更新折线图
        this.updateMemoryChart(memoryData)
      } catch (error) {
        console.error("获取内存利用率失败：", error)
      }

      // 每隔一秒重新获取数据，实现实时更新
      setTimeout(this.fetchMemoryUsage, 1000) // 1000毫秒（1秒）更新一次
    },

    async fetchCpuUsage() {
      try {
        const response = await axios.get(
          'http://localhost:8086/query?db=monitor&pretty=true&q=SELECT%20"CpuUsage"%20FROM%20"system"%20ORDER%20BY%20time%20DESC%20LIMIT%201'
        )
        const cpuData = response.data.results[0]?.series[0]?.values[0][1]
        console.log("mmm:", cpuData)
        this.CpuUsage = cpuData
        this.updateCpuChart(cpuData)
      } catch (error) {
        console.error("获取cpu利用率失败:", error)
      }
      setTimeout(this.fetchCpuUsage, 1000)
    },

    updateMemoryChart(memoryData) {
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
      if (this.memoryData.length > 5) {
        this.memoryData.shift()
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
          max: 20, // 设置纵坐标最大值为84%
          interval: 2 // 设置纵坐标刻度间隔为0.2%
        },
        title: {
          show: true,
          text: "内存利用率(%)",
          textStyle: {
            fontSize: 15
          },
          padding: [10, 0, 0, 70]
        },
        series: [
          {
            data: this.memoryData,
            type: "line"
          }
        ]
      }

      // 设置折线图的配置项
      memoryChart.setOption(option)
    },

    updateCpuChart(cpuData) {
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
      this.cpuXAxisData = xAxisData
      this.cpuData.push(cpuData)
      if (this.cpuData.length > 5) {
        this.cpuData.shift()
      }
      const option = {
        xAxis: {
          type: "category",
          data: this.cpuXAxisData
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}%"
          },
          min: 0,
          max: 10,
          interval: 1
        },
        title: {
          show: true,
          text: "CPU利用率(%)",
          textStyle: {
            fontSize: 15
          },
          padding: [10, 0, 0, 70]
        },
        series: [
          {
            data: this.cpuData,
            type: "line"
          }
        ]
      }
      cpuChart.setOption(option)
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
}

.input-container {
  flex: 1; /* 平分容器宽度，实现左右排列 */
  margin-right: 10px; /* 可根据需要添加间距 */
}

/* 样式规则 */
.large-font {
  font-size: 20px; /* 调整字体大小 */
}

.large-input {
  font-size: 20px; /* 调整输入框字体大小 */
  padding: 10px; /* 调整输入框内边距，增加框格大小 */
  border: none; /* 移除默认边框 */
  outline: 0.1px solid #ccc; /* 使用 outline 控制边框，1px 或适当的值 */
  border-radius: 5px; /* 添加圆角边框 */
}

.text-box {
  font-size: 20px; /* 调整输入框字体大小 */
  padding: 8px; /* 调整输入框内边距，增加框格大小 */
  border: 0.5px solid #ccc; /* 移除默认边框 */
  display: inline-block;
}
.large-input::value {
  color: red; /* 将输入框中的数字文本着色为红色 */
}

/* 折线图容器样式 */
.memory-chart {
  width: 100%; /* 设置宽度为100%以充满容器 */
  height: 400px; /* 设置高度，根据需求调整 */
  margin-top: 100px; /* 设置上边距，根据需求调整 */
}

.cpu-chart {
  width: 100%; /* 设置宽度为100%以充满容器 */
  height: 400px; /* 设置高度，根据需求调整 */
  margin-top: 100px; /* 设置上边距，根据需求调整 */
}
/* 其他样式规则可以根据需要添加或修改 */
</style>
