# openGemini-CM
openGemini Cluster Management Tool

## ⚡ Introduction

This project adopts V3 Admin Vite, the basic solution of the free and open source middle and background management system, and realizes the development of the cluster management tool of openGemini, which is reflected in the form of WEB and can monitor and manage multiple sets of clusters at the same time. The specific functions include displaying basic cluster information, monitoring cluster resources, modifying configuration files, searching error logs, and executing commands.

## Functions

- **User management**: log in, log out of the demo
- **Authority management**: Built-in page permissions (dynamic routing), instruction permissions, permission functions
- **Basic cluster information**: Displays the addresses of nodes in the current cluster and the status of each node.
- **Cluster Resource Monitoring**: Displays information about common cluster indicators.
- **Command Execution**：Enter common sql statements of openGemini, such as query, create, delete, insert, etc., and return the execution result.
- **Error log Search**: Displays the error logs of the openGemini cluster when it is running. The logs can be searched by time or specific fields, sorted by time.
- **Configuration file generation**: Modify the configuration file used to generate the openGemini cluster.

## 🚀 Development

```bash
# configure
1. installation of the recommended plugins in the .vscode directory
2. node version 16+
3. pnpm version 8.x

# clone
git clone https://github.com/openGemini/openGemini-CM.git

# enter the project directory
cd openGemini

# install dependencies
pnpm i

# start the service

#start openGemini
bash scripts/install_cluster.sh
bash scripts/install_monitor.sh 
#start project
pnpm start
```
## 📄 License
[Apache 2.0](./LICENSE)
