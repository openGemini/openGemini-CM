<div align="center">
  <img alt="openGemini-CM Logo" width="120" height="120" src="./src/assets/layouts/logo.png">
  <h1>OpenGemini Cluster Management Tool</h1>
  <span>English | <a href="./README.zh-CN.md">中文</a></span>
</div>

# Introduction
This project adopts the open-source mid to backend management system basic solution V3 Admin Vite, and implements the development of cluster management tools for openGemini in the form of WEB. The specific functions include displaying basic cluster information, monitoring cluster resources, generating configuration files, displaying logs, and executing commands.

# Development environment

## Environmental Information
1. [VSCode](https://code.visualstudio.com/Download) version v1.77+
2. Install the recommended plugins in the. vscode directory with one click (VSCode will automatically pop up a window asking if to install the recommended extensions for this warehouse project, click Install to proceed)
3. [Node.js](https://nodejs.org/en/download) version v16.14+
4. Execute npm install pnpm@8.7.4, install version 8.7.4 of pnpm

## Installation dependencies
Install dependencies such as element plus (icon component library), axios (making HTTP requests), cors (handling cross domain requests), echarts (providing visual icons), and express (building web servers and APIs) required for the project.
1. Clone project
```
git clone https://github.com/openGemini/openGemini-CM.git
```
2. Enter the project directory
```
cd openGemini-CM
```
3. Execute installation dependent command statements
```
pnpm i
```
At this point, the development environment configuration has been completed and secondary development can proceed

# Operating Environment
The running environment takes Linux as an example:
1. Install Node.js version 16.14.0
```
curl -o node-v16.14.0-linux-x64.tar.xz https://nodejs.org/dist/v16.14.0/node-v16.14.0-linux-x64.tar.xz
```
2.  After the download is complete, extract the downloaded archive
```
tar -xvf node-v16.14.0-linux-x64.tar.xz
```
3. Move the extracted Node.js directory to the /usr/local directory
```
sudo mv node-v16.14.0-linux-x64 /usr/local/nodejs
```
4. Configure environment variables. Execute the following command to edit the ~/.bashrc file
```
nano ~/.bashrc
```
Then, add the following lines to the end of the file
```
export PATH="/usr/local/nodejs/bin:$PATH"
```
Press Ctrl + X to bring up the prompt, press Y to save the file changes. If you see "File Name to Write: .bashrc" in the prompt, press Enter to save the file successfully
5. Execute the following command to make the edited .bashrc file take effect
```
source ~/.bashrc
```
6. Run the following command to verify if Node.js has been successfully installed
```
node -v
```
If it displays v16.14.0, the installation was successful
7. Install pnpm, run the following command
```
pnpm -v
```
If you encounter an error message like "pnpm: command not found" execute
```
npm install -g pnpm
```
8. Navigate to the directory where you want to store the project and clone it
```
git clone https://github.com/openGemini/openGemini-CM.git
```
9. Enter the project directory
```
cd openGemini-CM
```
10. Run the project startup script
```
bash install_de.sh
bash run_preview.sh
```

# Service startup

![openGemini架构图](https://github.com/25hours886/image/blob/main/openGemini-image/openGemini%E6%9E%B6%E6%9E%84.png)

The cluster management tool is deployed on the management node, which also deploys a standalone OpenGemini temporal database to store various monitoring indicators of the OpenGemini business cluster, such as node resource monitoring indicators (CPU, memory, disk I/O), error logs, etc. The above indicator data is collected and written into the database of the management node through the TS monitor tool. The monitoring tool queries basic cluster operation status information from it, retrieves error logs in the database through keywords, and echoes them.

## For example, using a standalone deployment of openGemini cluster and monitoring:
1. Enter the project directory and start the openGemini database
```
sudo bash scripts/install_cluster.sh
sudo bash scripts/install_monitor.sh
```
2. Enter the usr/bin file to check if the tables in the database monitor are normal
```
./ts-cli -host 127.0.0.1 -port 8086
> show databases
> use monitor
> show measurements
```
The normal results are shown as follows:

![monitor中表的正常显示情况](https://github.com/25hours886/image/blob/main/openGemini-image/monitor%E4%B8%AD%E8%A1%A8%E7%9A%84%E6%AD%A3%E5%B8%B8%E6%98%BE%E7%A4%BA%E6%83%85%E5%86%B5.png)

3. Start the project
```
pnpm start
```

# Project Function Preview and Operation

- **User Management**: Login and logout demonstrations.
![用户管理](https://github.com/25hours886/image/blob/main/openGemini-image/%E7%94%A8%E6%88%B7%E7%AE%A1%E7%90%86.png)
The initial login username and password are: {editor, editor} or {admin, admin}.

- **Permission Management**: Built in instruction permissions and permission functions.
![权限管理页面](https://github.com/25hours886/image/blob/main/openGemini-image/%E6%9D%83%E9%99%90%E7%AE%A1%E7%90%86.png)
Switch from the editor role to the admin role and enter the password: admin.

- **Cluster Basic Information and Resource Monitoring**: Display the address of nodes in the current cluster, displaying the status of each node and information on its commonly used indicators.
![集群基本信息及资源监测](https://github.com/25hours886/image/blob/main/openGemini-image/%E9%9B%86%E7%BE%A4%E8%B5%84%E6%BA%90%E7%9B%91%E6%B5%8B.png)
The memory utilization rate (%) is as follows:
![内存利用率](https://github.com/25hours886/image/blob/main/openGemini-image/%E5%86%85%E5%AD%98%E5%88%A9%E7%94%A8%E7%8E%87(%25).jpg)
The CPU utilization rate (%) is as follows:
![CPU利用率](https://github.com/25hours886/image/blob/main/openGemini-image/CPU%E5%88%A9%E7%94%A8%E7%8E%87(%25).jpg)

- **Command Execution**: Enter commonly used SQL statements for openGemini, such as query, create, delete, insert, etc., and return the execution results. Taking creating a database geminiTest and creating a table logs in the database as an example:
Create a database geminiTest as follows:
![命令执行—创建数据库](https://github.com/25hours886/image/blob/main/openGemini-image/%E5%91%BD%E4%BB%A4%E6%89%A7%E8%A1%8C%E2%80%94%E5%88%9B%E5%BB%BA%E6%95%B0%E6%8D%AE%E5%BA%93.png)
The database geminiTest created by querying is as follows:
![命令执行—查询数据库](https://github.com/25hours886/image/blob/main/openGemini-image/%E5%91%BD%E4%BB%A4%E6%89%A7%E8%A1%8C%E2%80%94%E6%9F%A5%E8%AF%A2%E6%95%B0%E6%8D%AE%E5%BA%93.png)
Create table logs in the database geminiTest as follows:
![命令执行—创建表](https://github.com/25hours886/image/blob/main/openGemini-image/%E5%91%BD%E4%BB%A4%E6%89%A7%E8%A1%8C%E2%80%94%E5%88%9B%E5%BB%BA%E8%A1%A8.png)
The table logs created by the query are as follows:
![命令执行—显示表](https://github.com/25hours886/image/blob/main/openGemini-image/%E5%91%BD%E4%BB%A4%E6%89%A7%E8%A1%8C%E2%80%94%E6%98%BE%E7%A4%BA%E8%A1%A8.png)
Insert data information into the table logs as follows:
![命令执行—表中插入数据](https://github.com/25hours886/image/blob/main/openGemini-image/%E5%91%BD%E4%BB%A4%E6%89%A7%E8%A1%8C%E2%80%94%E8%A1%A8%E4%B8%AD%E6%8F%92%E5%85%A5%E6%95%B0%E6%8D%AE.png)
The data information in the query table logs is as follows:
![命令执行—查询表中数据](https://github.com/25hours886/image/blob/main/openGemini-image/%E5%91%BD%E4%BB%A4%E6%89%A7%E8%A1%8C%E2%80%94%E6%9F%A5%E8%AF%A2%E8%A1%A8%E4%B8%AD%E6%95%B0%E6%8D%AE.png)

- **Log Display**: Display error logs during the operation of the openGemini cluster, supporting retrieval by time or specific fields, sorted by time.
![日志显示](https://github.com/25hours886/image/blob/main/openGemini-image/%E6%97%A5%E5%BF%97%E6%98%BE%E7%A4%BA.png)

- **Configuration File Generation**: Modify and generate the configuration file for the openGemini cluster.
![配置文件生成](https://github.com/25hours886/image/blob/main/openGemini-image/%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E7%94%9F%E6%88%90.png)
对配置项进行修改后，点击“保存配置文件”。或恢复默认配置文件。

# License
[Apache 2.0 许可证](./LICENSE)