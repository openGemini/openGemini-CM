const express = require("express")
const fs = require("fs/promises")
//const path = require("path")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const port = 8086

app.use(
  cors({
    origin: ["http://localhost:3333", "http://192.168.128.1:3333", "http://172.22.49.211:3333"]
  })
)

app.use(bodyParser.json()) //使用 body-parser 解析请求体

app.post("/start-server", async (req, res) => {
  try {
    // 启动服务器的代码
    const { spawn } = require("child_process")
    const serverProcess = spawn("node", ["../config-updater/server.js"])

    serverProcess.stdout.on("data", (data) => {
      console.log(`Server stdout: ${data}`)
    })

    serverProcess.stderr.on("data", (data) => {
      console.error(`Server stderr: ${data}`)
    })

    serverProcess.on("close", (code) => {
      console.log(`Server process exited with code ${code}`)
    })

    res.status(200).json({ success: true, message: "Server started successfully." })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get("/get-config-file-content", async (req, res) => {
  try {
    // 在这里编写代码以读取配置文件的内容
    const configFileContent = await fs.readFile("D:/open-gemini-master/etc/test.conf", "utf-8")
    res.send(configFileContent)
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post("/save-config-file-content", async (req, res) => {
  try {
    const {
      metaJoinInCommon1,
      metaJoinInCommon2,
      metaJoinInCommon3,

      bindAddressInMeta,
      httpBindAddressInMeta,
      rpcBindAddressInMeta,
      dirInMeta,

      bindAddressInHttp,

      storeIngestAddrInData,
      storeSelectAddrInData,
      storeDataDirInData,
      storeWalDirInData,
      storeMetaDirInData,

      bindAddressInGossip,
      storeBindPortInGossip,
      metaBindPortInGossip,
      membersInGossip1,
      membersInGossip2,
      membersInGossip3
    } = req.body

    //读配置文件内容
    const contentInCommon = await fs.readFile("D:/open-gemini-master/etc/test.conf", "utf-8")

    const updatedConfigInCommon = contentInCommon.replace(
      /(\[common\][\s\S]*?meta-join\s*=\s*\[")([^"]*)(",\s*")([^"]*)(",\s*")([^"]*)("\])/,
      (match, group1, group2, group3, group4, group5, group6, group7) =>
        `${group1}${metaJoinInCommon1}${group3}${metaJoinInCommon2}${group5}${metaJoinInCommon3}${group7}`
    )
    //将更新后的配置写回文件
    await fs.writeFile("D:/open-gemini-master/etc/test.conf", updatedConfigInCommon, "utf-8")

    const contentInMeta = await fs.readFile("D:/open-gemini-master/etc/test.conf", "utf-8")
    const updatedConfigInMeta = contentInMeta.replace(
      /(\[meta\][\s\S]*?bind-address\s*=\s*")([^"]*)("\s*http-bind-address\s*=\s*")([^"]*)("\s*rpc-bind-address\s*=\s*")([^"]*)("\s*dir\s*=\s*")([^"]*)(")/,
      (match, group1, group2, group3, group4, group5, group6, group7, group8, group9) =>
        `${group1}${bindAddressInMeta}${group3}${httpBindAddressInMeta}${group5}${rpcBindAddressInMeta}${group7}${dirInMeta}${group9}`
    )
    await fs.writeFile("D:/open-gemini-master/etc/test.conf", updatedConfigInMeta, "utf-8")

    const contentInHttp = await fs.readFile("D:/open-gemini-master/etc/test.conf", "utf-8")
    const updatedConfigInHttp = contentInHttp.replace(
      /(\[http\][\s\S]*?bind-address\s*=\s*")([^"]*)(")/,
      (match, group1, group2, group3) => `${group1}${bindAddressInHttp}${group3}`
    )
    await fs.writeFile("D:/open-gemini-master/etc/test.conf", updatedConfigInHttp, "utf-8")

    const contentInData = await fs.readFile("D:/open-gemini-master/etc/test.conf", "utf-8")
    const updatedConfigInData = contentInData.replace(
      /(\[data\][\s\S]*?store-ingest-addr\s*=\s*")([^"]*)("\s*store-select-addr\s*=\s*")([^"]*)("\s*store-data-dir\s*=\s*")([^"]*)("\s*store-wal-dir\s*=\s*")([^"]*)("\s*store-meta-dir\s*=\s*")([^"]*)(")/,
      (match, group1, group2, group3, group4, group5, group6, group7, group8, group9, group10, group11) =>
        `${group1}${storeIngestAddrInData}${group3}${storeSelectAddrInData}${group5}${storeDataDirInData}${group7}${storeWalDirInData}${group9}${storeMetaDirInData}${group11}`
    )
    await fs.writeFile("D:/open-gemini-master/etc/test.conf", updatedConfigInData, "utf-8")

    const contentInGossip = await fs.readFile("D:/open-gemini-master/etc/test.conf", "utf-8")
    const updatedConfigInGossip = contentInGossip.replace(
      /(\[gossip\][\s\S]*?bind-address\s*=\s*")([^"]*)("\s*store-bind-port\s*=\s*)(\S*)(\s*meta-bind-port\s*=\s*)(\S*)([\s\S]*?members\s*=\s*\[")([^"]*)(",\s*")([^"]*)(",\s*")([^"]*)("\])/,
      (
        match,
        group1,
        group2,
        group3,
        group4,
        group5,
        group6,
        group7,
        group8,
        group9,
        group10,
        group11,
        group12,
        group13
      ) =>
        `${group1}${bindAddressInGossip}${group3}${storeBindPortInGossip}${group5}${metaBindPortInGossip}${group7}${membersInGossip1}${group9}${membersInGossip2}${group11}${membersInGossip3}${group13}`
    )
    await fs.writeFile("D:/open-gemini-master/etc/test.conf", updatedConfigInGossip, "utf-8")

    res.status(200).json({ success: true, message: "Configuration file([meta]) saved successfully" })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`)
})
