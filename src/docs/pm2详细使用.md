---
title: PM2详细使用
icon: laptop-code
# order: 5
date: 2026-01-06
category:
  - 使用指南
tag:
  - PM2
  - Node.js
  - 进程管理
---

<div style="font-weight:700; ">PM2（Process Manager 2）是一个Node.js进程管理器，用于管理、监控和扩展Node.js应用程序，支持负载均衡、自动重启、日志管理等功能，是生产环境部署Node.js应用的首选工具。</div>

<!-- more -->

## 安装与基本配置

### 安装PM2

```bash
# 全局安装PM2
npm install -g pm2

# 检查安装是否成功
pm2 -v
```

### 基本配置

```bash
# 查看PM2版本
pm2 --version

# 获取帮助信息
pm2 --help

# 列出所有可用命令
pm2 list
```

## 启动和管理应用

### 启动应用

```bash
# 启动Node.js应用
pm2 start app.js

# 启动并命名进程
pm2 start app.js --name "my-app"

# 指定端口启动
pm2 start app.js -- --port 3000

# 启动多个实例（负载均衡）
pm2 start app.js -i 4

# 启动并设置环境变量
pm2 start app.js --name "my-app" --env production
```

> 💡 提示：
> - 使用`--name`参数为应用命名，方便后续管理和监控
> - 使用`--`可以传递参数给Node.js应用，如`-- --port 3000`
> - 生产环境建议使用环境变量配置，避免硬编码

> ⚠️ 注意：
> - 确保应用具有正确的入口文件（如app.js、index.js等）
> - 启动前建议先测试应用是否能正常运行：`node app.js`

### 管理应用

```bash
# 查看所有运行中的应用
pm2 list

# 查看应用详情
pm2 show my-app

# 停止应用
pm2 stop my-app

# 重启应用
pm2 restart my-app

# 重载应用（零停机重启）
pm2 reload my-app

# 删除应用
pm2 delete my-app

# 停止所有应用
pm2 stop all

# 重启所有应用
pm2 restart all

# 重载所有应用
pm2 reload all

# 删除所有应用
pm2 delete all
```

## 监控和日志

### 监控应用

```bash
# 实时监控应用状态
pm2 monit

# 查看应用状态
pm2 status

# 查看应用资源使用情况
pm2 metrics

# 查看应用日志
pm2 logs

# 查看特定应用日志
pm2 logs my-app

# 实时查看日志（类似tail -f）
pm2 logs my-app --lines 100 --follow
```

### 日志管理

```bash
# 清空日志
pm2 flush

# 安装日志管理模块
npm install -g pm2-logrotate

# 设置日志最大文件大小
pm2 set pm2-logrotate:max_size 10M

# 设置日志保存天数
pm2 set pm2-logrotate:retain 10

# 设置日志自动压缩
pm2 set pm2-logrotate:compress true

# 配置日志旋转
pm2 set pm2-logrotate:interval 1
pm2 set pm2-logrotate:unit day
```

## 集群模式

### 启动集群

```bash
# 自动根据CPU核心数启动集群
pm2 start app.js -i max

# 启动指定数量的集群实例
pm2 start app.js -i 4

# 查看集群状态
pm2 list
```

> 💡 提示：
> - 集群模式下，PM2会自动实现负载均衡
> - 使用`-i max`会根据服务器CPU核心数自动创建对应数量的实例
> - 集群模式只适用于HTTP服务器类应用，不适合单线程应用

> ⚠️ 注意：
> - 集群模式下，应用需要支持无状态设计
> - 会话数据应存储在外部存储（如Redis）中，而不是内存中
> - 确保应用没有使用全局变量来存储用户状态

> 💡 集群模式 vs 单进程模式对比：
>
>| 特性 | 集群模式 (cluster) | 单进程模式 (fork) |
>|------|-------------------|-------------------|
>| 资源利用 | 多核CPU充分利用 | 单核心CPU利用 |
>| 负载均衡 | 自动实现 | 不支持 |
>| 适用场景 | HTTP服务器、API服务 | 单线程应用、定时任务 |
>| 会话管理 | 需要外部存储 | 可使用内存存储 |
>| 启动速度 | 稍慢（多实例） | 较快（单实例） |
>| 复杂度 | 较高 | 较低 |

### 集群管理

```bash
# 扩展集群实例数量
pm2 scale my-app +2

# 减少集群实例数量
pm2 scale my-app -1

# 设置集群实例数量
pm2 scale my-app 3
```

## 配置文件

### 创建配置文件

```bash
# 生成默认配置文件
pm2 init

# 编辑配置文件
nano ecosystem.config.js
```

### 配置文件示例

```javascript
module.exports = {
  apps: [
    {
      name: 'my-app',                 // 应用名称
      script: './app.js',             // 应用入口文件
      instances: 'max',               // 实例数量，'max'表示根据CPU核心数自动调整
      exec_mode: 'cluster',           // 执行模式，'cluster'为集群模式，'fork'为单进程模式
      
      // 开发环境配置
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      
      // 生产环境配置
      env_production: {
        NODE_ENV: 'production',
        PORT: 80
      },
      
      log_date_format: 'YYYY-MM-DD HH:mm:ss',  // 日志日期格式
      combine_logs: true,                    // 集群模式下合并日志
      max_memory_restart: '1G',             // 内存使用超过1G时自动重启
      restart_delay: 3000,                  // 重启延迟时间（毫秒）
      cron_restart: '0 0 * * *',            // 定时重启，每天凌晨0点
      watch: true,                          // 启用文件监听
      ignore_watch: ['node_modules', 'logs'], // 忽略监听的文件/目录
      merge_logs: true                      // 合并所有实例的日志到一个文件
    }
  ]
}
```

### 使用配置文件启动

```bash
# 使用开发环境配置启动
pm2 start ecosystem.config.js

# 使用生产环境配置启动
pm2 start ecosystem.config.js --env production
```

> 💡 提示：
> - 配置文件可以统一管理多个应用的配置
> - 支持不同环境（development/production）的配置切换
> - 配置文件可以加入版本控制，便于团队协作和部署自动化

> ⚠️ 注意：
> - 确保配置文件中的路径和命令正确
> - 环境变量名称应遵循大写下划线命名规范
> - 敏感信息（如数据库密码）不应直接存储在配置文件中，建议使用环境变量

## 部署和持续集成

### 部署配置

```bash
# 初始化部署配置
pm2 deploy setup

# 编辑部署配置
nano ecosystem.config.js
```

### 部署配置示例

```javascript
module.exports = {
  apps: [{
    name: 'my-app',
    script: './app.js',
    instances: 'max',
    exec_mode: 'cluster'
  }],
  deploy: {
    // 生产环境部署配置
    production: {
      user: 'deploy',                    // 部署使用的用户名
      host: ['192.168.1.100', '192.168.1.101'],  // 生产服务器IP地址列表
      ref: 'origin/master',              // 部署的Git分支
      repo: 'git@github.com:user/my-app.git',  // Git仓库地址
      path: '/var/www/my-app',           // 部署路径
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'  // 部署后执行的命令
    },
    // 测试环境部署配置
    staging: {
      user: 'deploy',                    // 部署使用的用户名
      host: '192.168.1.200',             // 测试服务器IP地址
      ref: 'origin/develop',             // 部署的Git分支
      repo: 'git@github.com:user/my-app.git',  // Git仓库地址
      path: '/var/www/my-app-staging',   // 部署路径
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env staging'  // 部署后执行的命令
    }
  }
}
```

### 执行部署

```bash
# 部署到生产环境
pm2 deploy production

# 部署到测试环境
pm2 deploy staging

# 回滚部署
pm2 deploy rollback production
```

## 高级功能

### 自动重启

```bash
# 配置应用自动重启（默认已开启）
pm2 start app.js --name "my-app" --watch

# 设置自动重启延迟
pm2 set restart_delay 3000

# 设置最大重启次数
pm2 set max_restarts 10
```

### 环境变量管理

```bash
# 创建环境变量文件
nano .env

# 在应用中使用环境变量
npm install dotenv
```

```javascript
// app.js
require('dotenv').config();
console.log('PORT:', process.env.PORT);
console.log('DB_URL:', process.env.DB_URL);
```

### API访问

```bash
# 生成API密钥
pm2 generate api-key

# 使用API访问PM2
pm2 api get processes
```

```javascript
// 使用PM2 API
const pm2 = require('pm2');

pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  pm2.list(function(err, processDescriptionList) {
    console.log(processDescriptionList);
    pm2.disconnect();
  });
});
```

### 常用工具集成

```bash
# 安装PM2监控面板
npm install -g pm2-server-monit

# 启动监控面板
pm2 server

# 安装PM2日志查看器
npm install -g pm2-logviewer

# 查看日志
pm2 logviewer
```

## 最佳实践

1. **使用配置文件**：始终使用ecosystem.config.js管理应用配置，便于版本控制和自动化部署

2. **集群模式**：在生产环境中使用集群模式（exec_mode: 'cluster'）以充分利用多核CPU

3. **环境变量**：使用环境变量管理不同环境的配置，避免硬编码敏感信息

4. **日志管理**：配置日志旋转和压缩，定期清理旧日志

5. **自动重启**：启用自动重启功能，确保应用在崩溃后能够自动恢复

6. **监控报警**：结合第三方监控工具（如Datadog、New Relic）实现应用性能监控和报警

7. **零停机部署**：使用pm2 reload命令实现零停机部署，减少服务中断时间

8. **定期备份**：定期备份应用配置和数据，确保在故障时能够快速恢复

## 常见问题解决

### 应用无法启动

```bash
# 查看应用日志
pm2 logs my-app

# 检查应用配置
pm2 show my-app

# 手动运行应用查看错误
node app.js
```

### 内存占用过高

```bash
# 查看应用内存使用情况
pm2 metrics

# 配置自动重启内存阈值
pm2 set max_memory_restart 1G

# 优化Node.js应用内存使用
# 在应用中添加：process.memoryUsage()
```

### 日志文件过大

```bash
# 安装日志管理模块
npm install -g pm2-logrotate

# 配置日志旋转
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 10
pm2 set pm2-logrotate:compress true
```

## 总结

PM2是一个功能强大的Node.js进程管理器，提供了完整的应用生命周期管理功能，包括启动、监控、日志管理、集群负载均衡、自动重启等。通过合理配置和使用PM2，可以显著提高Node.js应用的稳定性和可维护性，是生产环境部署Node.js应用的首选工具。