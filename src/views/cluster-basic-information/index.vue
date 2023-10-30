<template>
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
</template>

<script>
import axios from "axios"
//import { jsonp } from 'vue-jsonp'
//import { id } from 'element-plus/es/locale';
import { getModelList } from "@/views/cluster-basic-information/server"

export default {
  data() {
    return {
      nodes: [],
      components: ["ts-meta", "ts-store", "ts-sql"],
      componentExistence: {}, // 存储组件是否存在的信息
      nodeStatus: {} //存放节点状态
    }
  },
  created() {
    this.checkNode()
  },
  methods: {
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
.node-info {
  text-align: center;
}
</style>
