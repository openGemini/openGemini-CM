<script lang="ts">
export default {
  data() {
    return {
      configFileContent: "", //存储配置文件内容

      newMetaJoinInCommon1: "",
      newMetaJoinInCommon2: "",
      newMetaJoinInCommon3: "",

      newBindAddressInMeta: "", //存储新的 [meta] bind-address
      newHttpBindAddressInMeta: "",
      newRpcBindAddressInMeta: "",
      newDirInMeta: "",

      newBindAddressInHttp: "",

      newStoreIngestAddrInData: "",
      newStoreSelectAddrInData: "",
      newStoreDataDirInData: "",
      newStoreWalDirInData: "",
      newStoreMetaDirInData: "",

      newBindAddressInGossip: "",
      newStoreBindPortInGossip: "",
      newMetaBindPortInGossip: "",
      newMembersInGossip1: "",
      newMembersInGossip2: "",
      newMembersInGossip3: "",

      defaultMetaJoinInCommon1: "{{meta_addr_1}}:8092",
      defaultMetaJoinInCommon2: "{{meta_addr_2}}:8092",
      defaultMetaJoinInCommon3: "{{meta_addr_3}}:8092",

      defaultBindAddressInMeta: "{{addr}}:8088",
      defaultHttpBindAddressInMeta: "{{addr}}:8091",
      defaultRpcBindAddressInMeta: "{{addr}}:8092",
      defaultDirInMeta: "/tmp/openGemini/data/meta/{{id}}",

      defaultBindAddressInHttp: "{{addr}}:8086",

      defaultStoreIngestAddrInData: "{{addr}}:8400",
      defaultStoreSelectAddrInData: "{{addr}}:8401",
      defaultStoreDataDirInData: "/tmp/openGemini/data",
      defaultStoreWalDirInData: "/tmp/openGemini/data",
      defaultStoreMetaDirInData: "/tmp/openGemini/data/meta/{{id}}",

      defaultBindAddressInGossip: "{{addr}}",
      defaultStoreBindPortInGossip: "8011",
      defaultMetaBindPortInGossip: "8010",
      defaultMembersInGossip1: "{{meta_addr_1}}:8010",
      defaultMembersInGossip2: "{{meta_addr_2}}:8010",
      defaultMembersInGossip3: "{{meta_addr_3}}:8010"
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

          const regexInCommon = /\[common\][\s\S]*?meta-join\s*=\s*\["([^"]*)",\s*"([^"]*)",\s*"([^"]*)"\]/
          const regexMatchInCommon = data.match(regexInCommon)
          if (regexMatchInCommon && regexMatchInCommon.length >= 4) {
            this.newMetaJoinInCommon1 = regexMatchInCommon[1]
            this.newMetaJoinInCommon2 = regexMatchInCommon[2]
            this.newMetaJoinInCommon3 = regexMatchInCommon[3]
          }

          const regexInMeta =
            /\[meta\][\s\S]*?bind-address\s*=\s*"([^"]*)"\s*http-bind-address\s*=\s*"([^"]*)"\s*rpc-bind-address\s*=\s*"([^"]*)"\s*dir\s*=\s*"([^"]*)"/
          const regexMatchInMeta = data.match(regexInMeta)
          if (regexMatchInMeta && regexMatchInMeta.length >= 5) {
            this.newBindAddressInMeta = regexMatchInMeta[1]
            this.newHttpBindAddressInMeta = regexMatchInMeta[2]
            this.newRpcBindAddressInMeta = regexMatchInMeta[3]
            this.newDirInMeta = regexMatchInMeta[4]
          }

          const regexInHttp = /\[http\][\s\S]*?bind-address\s*=\s*"([^"]*)"/
          const regexMatchInHttp = data.match(regexInHttp)
          if (regexMatchInHttp && regexMatchInHttp.length >= 2) {
            this.newBindAddressInHttp = regexMatchInHttp[1]
          }

          const regexInData =
            /\[data\][\s\S]*?store-ingest-addr\s*=\s*"([^"]*)"\s*store-select-addr\s*=\s*"([^"]*)"\s*store-data-dir\s*=\s*"([^"]*)"\s*store-wal-dir\s*=\s*"([^"]*)"\s*store-meta-dir\s*=\s*"([^"]*)"/
          const regexMatchInData = data.match(regexInData)
          if (regexMatchInData && regexMatchInData.length >= 6) {
            this.newStoreIngestAddrInData = regexMatchInData[1]
            this.newStoreSelectAddrInData = regexMatchInData[2]
            this.newStoreDataDirInData = regexMatchInData[3]
            this.newStoreWalDirInData = regexMatchInData[4]
            this.newStoreMetaDirInData = regexMatchInData[5]
          }

          const regexInGossip =
            /\[gossip\][\s\S]*?bind-address\s*=\s*"([^"]*)"\s*store-bind-port\s*=\s*(\S*)\s*meta-bind-port\s*=\s*(\S*)[\s\S]*?members\s*=\s*\["([^"]*)",\s*"([^"]*)",\s*"([^"]*)"\]/
          const regexMatchInGossip = data.match(regexInGossip)
          if (regexMatchInGossip && regexMatchInGossip.length >= 7) {
            this.newBindAddressInGossip = regexMatchInGossip[1]
            this.newStoreBindPortInGossip = regexMatchInGossip[2]
            this.newMetaBindPortInGossip = regexMatchInGossip[3]
            this.newMembersInGossip1 = regexMatchInGossip[4]
            this.newMembersInGossip2 = regexMatchInGossip[5]
            this.newMembersInGossip3 = regexMatchInGossip[6]
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
            metaJoinInCommon1: this.newMetaJoinInCommon1,
            metaJoinInCommon2: this.newMetaJoinInCommon2,
            metaJoinInCommon3: this.newMetaJoinInCommon3,

            bindAddressInMeta: this.newBindAddressInMeta,
            httpBindAddressInMeta: this.newHttpBindAddressInMeta,
            rpcBindAddressInMeta: this.newRpcBindAddressInMeta,
            dirInMeta: this.newDirInMeta,

            bindAddressInHttp: this.newBindAddressInHttp,

            storeIngestAddrInData: this.newStoreIngestAddrInData,
            storeSelectAddrInData: this.newStoreSelectAddrInData,
            storeDataDirInData: this.newStoreDataDirInData,
            storeWalDirInData: this.newStoreWalDirInData,
            storeMetaDirInData: this.newStoreMetaDirInData,

            bindAddressInGossip: this.newBindAddressInGossip,
            storeBindPortInGossip: this.newStoreBindPortInGossip,
            metaBindPortInGossip: this.newMetaBindPortInGossip,
            membersInGossip1: this.newMembersInGossip1,
            membersInGossip2: this.newMembersInGossip2,
            membersInGossip3: this.newMembersInGossip3
          })
        })

        if (response.ok) {
          this.showSuccessMessage("保存配置文件成功！")
          console.log("Configuration file saved successfully.")
        } else {
          console.error("Failed to save configuration file:", response.status, response.statusText)
        }
      } catch (error) {
        console.error("Error saving configuration file:", error)
      }
    },
    restoreDefaultSettings() {
      this.newMetaJoinInCommon1 = this.defaultMetaJoinInCommon1
      this.newMetaJoinInCommon2 = this.defaultMetaJoinInCommon2
      this.newMetaJoinInCommon3 = this.defaultMetaJoinInCommon3

      this.newBindAddressInMeta = this.defaultBindAddressInMeta
      this.newHttpBindAddressInMeta = this.defaultHttpBindAddressInMeta
      this.newRpcBindAddressInMeta = this.defaultRpcBindAddressInMeta

      this.newBindAddressInHttp = this.defaultBindAddressInHttp

      this.newStoreIngestAddrInData = this.defaultStoreIngestAddrInData
      this.newStoreSelectAddrInData = this.defaultStoreSelectAddrInData
      this.newStoreDataDirInData = this.defaultStoreDataDirInData
      this.newStoreWalDirInData = this.defaultStoreWalDirInData
      this.newStoreMetaDirInData = this.defaultStoreMetaDirInData

      this.newBindAddressInGossip = this.defaultBindAddressInGossip
      this.newStoreBindPortInGossip = this.defaultStoreBindPortInGossip
      this.newMetaBindPortInGossip = this.defaultMetaBindPortInGossip
      this.newMembersInGossip1 = this.defaultMembersInGossip1
      this.newMembersInGossip2 = this.defaultMembersInGossip2
      this.newMembersInGossip3 = this.defaultMembersInGossip3

      this.showSuccessMessage("恢复默认设置成功！")
      this.saveConfigFileContent()
    },
    async showSuccessMessage(message: any) {
      this.$message.success(message)
    }
  }
}
</script>

<template>
  <div class="app-container">
    <el-card shadow="always" class="card-wrapper" header="common" font-size="20px">
      <el-form label-width="250px">
        <el-form-item label="meta-join">
          <el-row>
            <el-col :span="7">
              <el-input type="text" id="metaJoinInCommon1" v-model="newMetaJoinInCommon1" placeholder="请输入" />
            </el-col>
            <el-col :span="1" class="comma">,</el-col>
            <el-col :span="7">
              <el-input type="text" id="metaJoinInCommon2" v-model="newMetaJoinInCommon2" placeholder="请输入" />
            </el-col>
            <el-col :span="1" class="comma">,</el-col>
            <el-col :span="7">
              <el-input type="text" id="metaJoinInCommon3" v-model="newMetaJoinInCommon3" placeholder="请输入" />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="always" class="card-wrapper" header="meta" font-size="20px">
      <el-form label-width="250px">
        <el-form-item label="bind-address">
          <el-input
            class="custom-input"
            type="text"
            id="bindAddressInMeta"
            v-model="newBindAddressInMeta"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <el-form label-width="250px">
        <el-form-item label="http-bind-address">
          <el-input
            class="custom-input"
            type="text"
            id="httpBindAddressInMeta"
            v-model="newHttpBindAddressInMeta"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <el-form label-width="250px">
        <el-form-item label="rpc-bind-address">
          <el-input
            class="custom-input"
            type="text"
            id="rpcBindAddressInMeta"
            v-model="newRpcBindAddressInMeta"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <el-form label-width="250px">
        <el-form-item label="dir">
          <el-input class="custom-input" type="text" id="dirInMeta" v-model="newDirInMeta" placeholder="请输入" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="always" class="card-wrapper" header="http" font-size="20px">
      <el-form label-width="250px">
        <el-form-item label="bind-address">
          <el-input
            class="custom-input"
            type="text"
            id="bindAddressInHttp"
            v-model="newBindAddressInHttp"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="always" class="card-wrapper" header="data" font-size="20px">
      <el-form label-width="250px">
        <el-form-item label="store-ingest-addr">
          <el-input
            class="custom-input"
            type="text"
            id="storeIngestAddrInData"
            v-model="newStoreIngestAddrInData"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <el-form label-width="250px">
        <el-form-item label="store-select-addr">
          <el-input
            class="custom-input"
            type="text"
            id="storeSelectAddrInData"
            v-model="newStoreSelectAddrInData"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <el-form label-width="250px">
        <el-form-item label="store-data-dir">
          <el-input
            class="custom-input"
            type="text"
            id="storeDataDirInData"
            v-model="newStoreDataDirInData"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <el-form label-width="250px">
        <el-form-item label="store-wal-dir">
          <el-input
            class="custom-input"
            type="text"
            id="storeWalDirInData"
            v-model="newStoreWalDirInData"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <el-form label-width="250px">
        <el-form-item label="store-meta-dir">
          <el-input
            class="custom-input"
            type="text"
            id="storeMetaDirInData"
            v-model="newStoreMetaDirInData"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="always" class="card-wrapper" header="gossip" font-size="20px">
      <el-form label-width="250px">
        <el-form-item label="bind-address">
          <el-input
            class="custom-input"
            type="text"
            id="bindAddressInGossip"
            v-model="newBindAddressInGossip"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <el-form label-width="250px">
        <el-form-item label="store-bind-port">
          <el-input
            class="custom-input"
            type="text"
            id="storeBindPortInGossip"
            v-model="newStoreBindPortInGossip"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <el-form label-width="250px">
        <el-form-item label="meta-bind-port">
          <el-input
            class="custom-input"
            type="text"
            id="metaBindPortInGossip"
            v-model="newMetaBindPortInGossip"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <el-form label-width="250px">
        <el-form-item label="members">
          <el-row>
            <el-col :span="7">
              <el-input type="text" id="membersInGossip1" v-model="newMembersInGossip1" placeholder="请输入" />
            </el-col>
            <el-col :span="1" class="comma">,</el-col>
            <el-col :span="7">
              <el-input type="text" id="membersInGossip2" v-model="newMembersInGossip2" placeholder="请输入" />
            </el-col>
            <el-col :span="1" class="comma">,</el-col>
            <el-col :span="7">
              <el-input type="text" id="membersInGossip3" v-model="newMembersInGossip3" placeholder="请输入" />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="button-wrapper">
      <el-button type="primary" @click="saveConfigFileContent">保存配置文件</el-button>
      <el-button type="primary" @click="restoreDefaultSettings">恢复默认设置</el-button>
    </div>
  </div>
</template>

<style>
.card-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.custom-input {
  width: 250px;
}

.comma {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  color: hsl(0, 1%, 38%);
}

.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
</style>
