//import express from "express"
//import { promises as fs } from "fs"
//import cors from "cors"
//import bodyParser from "body-parser"
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
    const { bindAddressInMeta, httpBindAddressInMeta } = req.body

    //读配置文件内容
    const configFileContent = await fs.readFile("D:/open-gemini-master/etc/test.conf", "utf-8")

    /*
    //使用正则表达式匹配并替换 [meta] 部分的 bind-adress
    const updatedConfig = configFileContent.replace(
      /\[meta\][\s\S]*?bind-address\s*=\s*".*?"/,
      `[meta]\n  bind-address = "${bindAddressInMeta}"`
    ).replace(
      /(\[meta\][\s\S]*?http-bind-address\s*=\s*")([^"]*)(")/,
      (match, prefix, httpBindAddressValue, suffix) => `${prefix}${httpBindAddressInMeta}${suffix}`
    );
    */
    const updatedConfig = configFileContent.replace(
      /(\[meta\][\s\S]*?bind-address\s*=\s*")([^"]*)("\s*http-bind-address\s*=\s*")([^"]*)(")/,
      (match, group1, group2, group3, group4, group5) =>
        `${group1}${bindAddressInMeta}${group3}${httpBindAddressInMeta}${group5}`
    )

    //将更新后的配置写回文件
    await fs.writeFile("D:/open-gemini-master/etc/test.conf", updatedConfig, "utf-8")
    res.status(200).json({ success: true, message: "Configuration file saved successfully" })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`)
})
