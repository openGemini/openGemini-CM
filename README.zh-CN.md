<div align="center">
  <img alt="openGemini-CM Logo" width="120" height="120" src="./src/assets/layouts/logo.png">
  <h1>OpenGemini Cluster Management Tool</h1>
  <span><a href="./README.md">English</a> | 中文</span>
</div>

# 简介
本项目采用了开源的中后台管理系统基础解决方案 V3 Admin Vite，实现了 openGemini 的集群管理工具开发，体现形式为 WEB，具体功能包括集群基本信息显示、集群资源监控、配置文件生成、日志显示、命令执行等。

# 开发环境

## 环境信息
1. [VSCode](https://code.visualstudio.com/Download) version v1.77+
2. 一键安装 .vscode 目录中推荐的插件(VSCode 会自动弹出窗口询问是否为此仓库安装项目所推荐的扩展,点击安装即可)
3. [Node.js](https://nodejs.org/en/download) version v16+
4. 执行 npm install pnpm@8.9.2，安装版本号为8.9.2的 pnpm

## 安装依赖
安装项目所需的 element-plus（图标组件库）、axios（进行 HTTP 请求）、cors（处理跨域请求）、echarts（提供可视化图标）、express（构建 Web 服务器和 API）等依赖项。
1. 克隆项目
```
git clone https://github.com/openGemini/openGemini-CM.git
```
2. 进入项目目录
```
cd openGemini-CM
```
3. 执行安装依赖命令语句
```
pnpm i
```
至此，已完成开发环境配置，可进行二次开发

# 服务启动

![openGemini架构图](https://github.com/25hours886/image/blob/main/openGemini-image/openGemini%E6%9E%B6%E6%9E%84.png)

集群管理工具部署在管理节点上，该节点同时还部署单机的 openGemini 时序数据库，用于存储 openGemini 业务集群的各项监控指标，比如节点资源监控指标（cpu、内存、磁盘I/O），错误日志等。上述指标数据是通过 ts-monitor 工具采集并写入管理节点的数据库中，监控工具从中查询基本的集群运行状态信息，通过关键字检索库内错误日志并回显。

## 以单机部署的 openGemini 集群和监控举例：
1. 进入项目目录启动 openGemini 数据库
```
sudo bash scripts/install_cluster.sh
sudo bash scripts/install_monitor.sh
```
2. 进入 usr/bin文件中查看数据库 monitor 中的表是否正常
```
./ts-cli -host 127.0.0.1 -port 8086
> show databases
> use monitor
> show measurements
```
正常结果显示如下：

![monitor中表的正常显示情况](https://github.com/25hours886/image/blob/main/openGemini-image/monitor%E4%B8%AD%E8%A1%A8%E7%9A%84%E6%AD%A3%E5%B8%B8%E6%98%BE%E7%A4%BA%E6%83%85%E5%86%B5.png)

3. 启动项目
```
pnpm start
```

# 项目功能预览图及操作

- **用户管理**：登录、登出演示。
![用户管理](https://github.com/25hours886/image/blob/main/openGemini-image/%E7%94%A8%E6%88%B7%E7%AE%A1%E7%90%86.png)
初始登录用户名及密码为：{ editor, editor }或{ admin, admin }。

- **权限管理**：内置指令权限、权限函数。
![权限管理页面](https://github.com/25hours886/image/blob/main/openGemini-image/%E6%9D%83%E9%99%90%E7%AE%A1%E7%90%86.png)
从 editor 角色切换到 admin 角色，输入密码：admin。

- **集群基本信息及资源监控**：显示当前集群中节点地址，展示每个节点的状态及其常用指标的信息。
![集群基本信息及资源监测](https://github.com/25hours886/image/blob/main/openGemini-image/%E9%9B%86%E7%BE%A4%E8%B5%84%E6%BA%90%E7%9B%91%E6%B5%8B.png)
内存利用率(%)如下：
![内存利用率](https://github.com/25hours886/image/blob/main/openGemini-image/%E5%86%85%E5%AD%98%E5%88%A9%E7%94%A8%E7%8E%87(%25).jpg)
CPU利用率(%)如下：
![CPU利用率](https://github.com/25hours886/image/blob/main/openGemini-image/CPU%E5%88%A9%E7%94%A8%E7%8E%87(%25).jpg)

- **命令执行**：输入 openGemini 常用的sql语句，如查询，创建，删除，插入等，返回执行结果。以创建数据库 geminiTest，并在该数据库中创建表 logs 为例：
创建数据库 geminiTest 如下：
![命令执行—创建数据库](https://github.com/25hours886/image/blob/main/openGemini-image/%E5%91%BD%E4%BB%A4%E6%89%A7%E8%A1%8C%E2%80%94%E5%88%9B%E5%BB%BA%E6%95%B0%E6%8D%AE%E5%BA%93.png)
查询创建的数据库 geminiTest 如下：
![命令执行—查询数据库](https://github.com/25hours886/image/blob/main/openGemini-image/%E5%91%BD%E4%BB%A4%E6%89%A7%E8%A1%8C%E2%80%94%E6%9F%A5%E8%AF%A2%E6%95%B0%E6%8D%AE%E5%BA%93.png)
在数据库 geminiTest 中创建表 logs 如下：
![命令执行—创建表](https://github.com/25hours886/image/blob/main/openGemini-image/%E5%91%BD%E4%BB%A4%E6%89%A7%E8%A1%8C%E2%80%94%E5%88%9B%E5%BB%BA%E8%A1%A8.png)
查询所创建的表 logs 如下：
![命令执行—显示表](https://github.com/25hours886/image/blob/main/openGemini-image/%E5%91%BD%E4%BB%A4%E6%89%A7%E8%A1%8C%E2%80%94%E6%98%BE%E7%A4%BA%E8%A1%A8.png)
在表 logs 中插入数据信息如下：
![命令执行—表中插入数据](https://github.com/25hours886/image/blob/main/openGemini-image/%E5%91%BD%E4%BB%A4%E6%89%A7%E8%A1%8C%E2%80%94%E8%A1%A8%E4%B8%AD%E6%8F%92%E5%85%A5%E6%95%B0%E6%8D%AE.png)
查询表 logs 中数据信息如下：
![命令执行—查询表中数据](https://github.com/25hours886/image/blob/main/openGemini-image/%E5%91%BD%E4%BB%A4%E6%89%A7%E8%A1%8C%E2%80%94%E6%9F%A5%E8%AF%A2%E8%A1%A8%E4%B8%AD%E6%95%B0%E6%8D%AE.png)

- **日志显示**: 展示 openGemini 集群运行时的错误日志，支持按时间或特定字段检索，按时间排序。
![日志显示](https://github.com/25hours886/image/blob/main/openGemini-image/%E6%97%A5%E5%BF%97%E6%98%BE%E7%A4%BA.png)

- **配置文件生成**：修改并生成 openGemini 集群的配置文件。
![配置文件生成](https://github.com/25hours886/image/blob/main/openGemini-image/%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E7%94%9F%E6%88%90.png)
对配置项进行修改后，点击“保存配置文件”。或恢复默认配置文件。

# 证书
[Apache 2.0 许可证](./LICENSE)