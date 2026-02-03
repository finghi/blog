---
title: Docker详细文档
icon: laptop-code
# order: 7
date: 2026-02-02
category:
  - 使用指南
tag:
  - Docker
  - 容器
  - 虚拟化
---

<div style="font-weight:700; ">Docker是一个开源的容器化平台，用于打包、分发和运行应用程序。通过容器技术，Docker可以实现应用与基础设施的分离，保证应用在任何环境中都能一致运行，是现代云原生开发和微服务架构的核心工具。</div>

<!-- more -->

## 安装与基本配置

### Windows安装Docker Desktop

```bash
# 系统要求
# - Windows 10/11 专业版或企业版（支持WSL 2）
# - 启用虚拟化（在BIOS中启用Intel VT-x或AMD-V）
# - 至少4GB内存

# 下载地址：https://www.docker.com/products/docker-desktop

# 安装步骤
# 1. 下载Docker Desktop for Windows安装程序
# 2. 运行安装程序（Double-Click Docker Desktop Installer.exe）
# 3. 勾选"Use WSL 2 instead of Hyper-V"（推荐）
# 4. 完成安装后重启计算机

# 验证安装
docker --version
docker-compose --version
docker info
```

### macOS安装Docker Desktop

```bash
# 系统要求
# - macOS 11（Big Sur）或更高版本
# - 至少4GB内存
# - 支持Apple M1芯片和Intel芯片

# 下载地址：https://www.docker.com/products/docker-desktop

# 安装步骤
# 1. 下载Docker Desktop for Mac安装程序
# 2. 将Docker.app拖入Applications文件夹
# 3. 启动Docker Desktop
# 4. 在菜单栏中查看Docker图标确认运行

# 使用Homebrew安装
brew install --cask docker

# 验证安装
docker --version
docker-compose --version
```

### Linux安装Docker

```bash
# Ubuntu系统安装Docker
# 1. 更新软件包索引
sudo apt update

# 2. 安装依赖包
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# 3. 添加Docker官方GPG密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 4. 添加Docker软件源
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. 安装Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 6. 启动Docker服务
sudo systemctl start docker
sudo systemctl enable docker

# 7. 添加当前用户到docker组（免sudo运行）
sudo usermod -aG docker $USER
newgrp docker

# CentOS系统安装Docker
# 1. 卸载旧版本
sudo yum remove -y docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine

# 2. 安装依赖包
sudo yum install -y yum-utils

# 3. 添加Docker软件源
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 4. 安装Docker
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 5. 启动Docker服务
sudo systemctl start docker
sudo systemctl enable docker

# 6. 添加当前用户到docker组
sudo usermod -aG docker $USER
newgrp docker
```

### Docker验证和基本配置

```bash
# 验证Docker安装
docker --version        # 查看Docker版本
docker-compose --version  # 查看Docker Compose版本
docker info             # 查看Docker系统信息

# 运行测试容器
docker run hello-world

# 配置Docker镜像加速器
# 编辑Docker配置文件
sudo nano /etc/docker/daemon.json

# 添加以下配置（以阿里云镜像加速为例）
{
  "registry-mirrors": [
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com",
    "https://docker.mirrors.ustc.edu.cn"
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "3"
  }
}

# 重启Docker服务使配置生效
sudo systemctl restart docker

# 查看Docker配置
docker system df        # 查看Docker磁盘使用情况
docker system events   # 查看Docker实时事件
docker system prune    # 清理Docker资源
```

## 镜像管理

### 镜像基础操作

```bash
# 查看本地镜像列表
docker images
docker image ls

# 搜索Docker Hub上的镜像
docker search nginx
docker search ubuntu --filter "stars=100"  # 只显示100星以上的镜像
docker search --no-trunc nginx             # 显示完整描述

# 拉取镜像
docker pull nginx:latest              # 拉取最新版本
docker pull nginx:1.21                # 拉取指定版本
docker pull nginx@sha256:abc123...     # 拉取指定digest的镜像
docker pull -a nginx                  # 拉取所有标签的镜像

# 删除镜像
docker rmi nginx:latest               # 删除指定镜像
docker rmi $(docker images -q nginx)  # 删除所有nginx镜像
docker image prune -a                 # 删除所有未使用的镜像
docker rmi -f nginx:latest            # 强制删除镜像

# 标记镜像
docker tag nginx:latest my-registry.com/nginx:v1.0.0
docker tag my-nginx:latest my-username/my-nginx:latest

# 查看镜像历史
docker history nginx:latest
docker history --no-trunc nginx:latest  # 显示完整命令

# 查看镜像详细信息
docker inspect nginx:latest
docker inspect --format='{{.Id}}' nginx:latest  # 只显示镜像ID
docker inspect --format='{{.Architecture}}' nginx:latest  # 显示架构信息

# 导出镜像为tar文件
docker save -o nginx.tar nginx:latest
docker save nginx:latest -o nginx.tar
docker save nginx:1.21 ubuntu:20.04 -o multi-images.tar  # 导出多个镜像

# 从tar文件导入镜像
docker load -i nginx.tar
docker load < nginx.tar

# 推送镜像到Docker Hub
docker login                         # 登录Docker Hub
docker tag my-image:latest username/my-image:latest
docker push username/my-image:latest

# 推送镜像到私有仓库
docker login my-registry.com         # 登录私有仓库
docker tag my-image:latest my-registry.com/my-image:v1.0
docker push my-registry.com/my-image:v1.0
```

### Dockerfile构建镜像

```bash
# Dockerfile示例
# 基本结构
FROM ubuntu:20.04                    # 基础镜像
MAINTAINER yourname@example.com      # 维护者信息（已废弃，推荐使用LABEL）
LABEL maintainer="yourname@example.com"  # 元数据
LABEL version="1.0.0"
LABEL description="This is my custom image"

# 工作目录
WORKDIR /app                         # 设置工作目录

# 复制文件
COPY package*.json ./                # 复制文件（相对路径）
COPY ./src /app/src                  # 复制目录
ADD https://example.com/file.zip ./  # 支持URL和压缩包自动解压
ADD ./archive.tar.gz /               # 自动解压tar.gz

# 执行命令
RUN apt-get update && apt-get install -y \    # 执行命令
    python3 \
    pip3 \
    && rm -rf /var/lib/apt/lists/*

# 环境变量
ENV NODE_ENV=production
ENV APP_PORT=8080

# 暴露端口
EXPOSE 8080

# 设置容器启动时执行的命令
CMD ["python3", "app.py"]            # 覆盖方式（推荐）
ENTRYPOINT ["python3", "app.py"]     # 追加方式

# 多阶段构建示例
# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# 构建镜像
docker build -t my-app:latest .              # 使用当前目录的Dockerfile
docker build -t my-app:v1.0 -f Dockerfile.prod .  # 指定Dockerfile路径

# 构建参数
ARG NODE_VERSION=18
FROM node:${NODE_VERSION}
ARG BUILD_DATE
LABEL build-date=${BUILD_DATE}

# .dockerignore文件示例
node_modules/
dist/
.git/
.gitignore
.env*
*.log
*.md
.DS_Store
Thumbs.db
coverage/
.nyc_output/
```

## 容器管理

### 创建和启动容器

```bash
# 创建并启动容器
docker run nginx                           # 前台运行
docker run -d nginx                        # 后台运行（detached模式）
docker run --name my-nginx nginx           # 指定容器名称
docker run -p 8080:80 nginx                # 端口映射（宿主机端口:容器端口）
docker run -P nginx                        # 随机映射端口

# 交互式容器
docker run -it ubuntu /bin/bash            # 交互式运行
docker run -it --rm ubuntu /bin/bash       # 退出后自动删除

# 数据卷挂载
docker run -v /host/path:/container/path nginx  # 绑定挂载
docker run -v my-volume:/app/data nginx         # 数据卷挂载
docker run --mount type=bind,source=/host/path,target=/container/path nginx  # 详细绑定挂载

# 环境变量
docker run -e MY_VAR=value nginx           # 设置环境变量
docker run --env-file .env nginx           # 从文件读取环境变量

# 网络配置
docker run --network bridge nginx          # 使用默认桥接网络
docker run --network host nginx            # 使用主机网络
docker run --network my-network nginx      # 使用自定义网络

# 资源限制
docker run --memory 512m nginx             # 限制内存
docker run --memory-reservation 256m nginx # 软限制内存
docker run --cpus 1.5 nginx                # 限制CPU
docker run --cpu-shares 512 nginx          # CPU权重

# 重启策略
docker run --restart=always nginx          # 总是重启
docker run --restart=on-failure:3 nginx    # 失败时重启（最多3次）
docker run --restart=unless-stopped nginx  # 除非手动停止，否则重启
```

### 管理容器

```bash
# 查看运行中的容器
docker ps
docker container ls

# 查看所有容器（包括已停止）
docker ps -a
docker ps --all

# 查看容器详细信息
docker inspect my-container
docker inspect --format='{{.State.Status}}' my-container  # 只显示状态

# 查看容器日志
docker logs my-container
docker logs -f my-container              # 实时跟踪日志
docker logs --tail 100 my-container      # 显示最后100行
docker logs -t my-container              # 显示时间戳

# 查看容器资源使用情况
docker stats                             # 查看所有容器资源使用
docker stats my-container                # 查看指定容器
docker stats --no-stream my-container    # 只显示一次

# 进入容器
docker exec -it my-container /bin/bash   # 进入bash
docker exec my-container ls /app         # 执行命令

# 停止和启动容器
docker stop my-container                 # 停止容器
docker stop $(docker ps -q)              # 停止所有运行中的容器
docker start my-container                # 启动容器
docker restart my-container              # 重启容器

# 暂停和恢复容器
docker pause my-container                # 暂停容器
docker unpause my-container              # 恢复容器

# 删除容器
docker rm my-container                   # 删除已停止的容器
docker rm -f my-container                # 强制删除（正在运行）
docker rm $(docker ps -aq)               # 删除所有容器
docker container prune                   # 删除所有已停止的容器

# 复制文件
docker cp my-container:/app/file.txt ./  # 从容器复制到宿主机
docker cp ./file.txt my-container:/app/  # 从宿主机复制到容器

# 查看容器进程
docker top my-container                  # 在容器中运行top命令

# 查看容器变更
docker diff my-container                 # 查看容器文件系统变更
```

### 容器生命周期管理

```bash
# 容器状态转换
# created（已创建）→ running（运行中）→ paused（暂停）→ stopped（已停止）

# 使用docker run创建并启动
docker run -d --name test-container nginx

# 使用docker create创建，使用docker start启动
docker create --name test-container nginx
docker start test-container

# 优雅停止（发送SIGTERM，等待30秒后发送SIGKILL）
docker stop test-container

# 强制停止（直接发送SIGKILL）
docker kill test-container

# 重启策略示例
docker run -d --restart=always --name web-server nginx
```

> 💡 提示：
> - 使用`docker run -d`在后台运行容器
> - 使用`--name`为容器命名，方便管理
> - 使用`-p`进行端口映射，格式为`宿主机端口:容器端口`
> - 使用`-v`进行数据卷挂载，实现数据持久化

> ⚠️ 注意：
> - 容器退出后，使用`docker rm`删除容器以释放资源
> - 使用`--rm`参数可以在容器退出后自动删除
> - 生产环境中，建议设置合适的重启策略

## 数据管理

### 数据卷（Volumes）

```bash
# 创建数据卷
docker volume create my-volume

# 查看数据卷列表
docker volume ls

# 查看数据卷详细信息
docker volume inspect my-volume

# 使用数据卷
docker run -v my-volume:/app/data nginx

# 挂载只读数据卷
docker run -v my-volume:/app/data:ro nginx

# 删除数据卷
docker volume rm my-volume
docker volume prune                       # 删除所有未使用的数据卷

# 挂载指定路径的数据卷
docker run -v my-volume:/app/data:z nginx  # SELinux标签（z表示共享，Z表示私有）

# 挂载tmpfs（内存文件系统）
docker run --tmpfs /app/data nginx        # 挂载tmpfs
docker run --tmpfs /app/data:rw,size=100m nginx  # 带参数挂载
```

### 绑定挂载（Bind Mounts）

```bash
# 挂载宿主机目录/文件
docker run -v /host/path:/container/path nginx
docker run -v /host/file:/container/file:ro nginx

# 使用--mount方式（更明确的语法）
docker run --mount type=bind,source=/host/path,target=/container/path nginx
docker run --mount type=bind,source=/host/file,target=/container/file,readonly nginx

# 挂载单个文件
docker run -v /host/file:/container/file nginx

# 注意事项
# - 源路径必须是绝对路径
# - 如果容器中路径已存在，会覆盖原有内容
# - 使用:ro设置为只读
```

### tmpfs挂载

```bash
# 挂载tmpfs到容器
docker run --tmpfs /run nginx            # 挂载到/run
docker run --tmpfs /run:rw,size=100m nginx  # 指定大小和权限

# 使用--mount方式
docker run --mount type=tmpfs,target=/run nginx
docker run --mount type=tmpfs,target=/run,tmpfs-size=100m nginx
```

### 数据备份和恢复

```bash
# 备份数据卷
docker run --rm -v my-volume:/data -v $(pwd):/backup alpine tar cvf /backup/backup.tar -C /data .
docker run --rm -v my-volume:/data -v $(pwd):/backup alpine tar xvf /backup/backup.tar -C /data

# 使用docker cp备份
docker cp my-container:/app/data ./backup/
docker exec my-container tar cvf /backup/data.tar -C /app/data .
docker cp my-container:/backup/data.tar ./
```

## 网络管理

### 网络基础操作

```bash
# 查看网络列表
docker network ls

# 查看网络详细信息
docker network inspect bridge
docker network inspect --format='{{.Name}}' my-network

# 创建网络
docker network create my-network
docker network create --driver bridge my-bridge-network
docker network create --subnet 172.20.0.0/16 --gateway 172.20.0.1 my-subnet-network

# 删除网络
docker network rm my-network
docker network prune                       # 删除所有未使用的网络

# 连接容器到网络
docker network connect my-network my-container
docker network connect --alias db my-network my-container  # 设置网络别名

# 断开容器与网络的连接
docker network disconnect my-network my-container
```

### 网络类型

```bash
# bridge（桥接网络）- 默认网络
docker run --network bridge nginx  # 默认使用bridge
docker run --network bridge --ip 172.17.0.10 nginx  # 指定IP地址

# host（主机网络）- 与宿主机共享网络命名空间
docker run --network host nginx

# none（无网络）- 禁用网络
docker run --network none nginx

# overlay（覆盖网络）- 用于Docker Swarm集群
docker network create --driver overlay my-overlay-network

# macvlan（MACVLAN网络）- 为容器分配MAC地址
docker network create --driver macvlan \
  --subnet 192.168.1.0/24 \
  --gateway 192.168.1.1 \
  --ip-range 192.168.1.100/28 \
  my-macvlan-network
```

### DNS和主机名

```bash
# 查看容器的DNS配置
docker exec my-container cat /etc/resolv.conf

# 自定义DNS服务器
docker run --dns 8.8.8.8 nginx
docker run --dns 8.8.8.8 --dns 114.114.114.114 nginx

# 自定义主机名
docker run --hostname my-hostname nginx

# 添加主机映射
docker run --add-host myhost:192.168.1.100 nginx

# 使用自定义hosts文件
docker run --add-host-file hosts.txt nginx
```

### 端口发布

```bash
# 发布端口
docker run -p 8080:80 nginx                       # 宿主机8080 -> 容器80
docker run -p 192.168.1.100:8080:80 nginx         # 绑定到指定IP
docker run -p 8080:80 -p 8443:443 nginx           # 多个端口
docker run -P nginx                               # 随机端口映射

# 查看端口映射
docker port my-container                          # 查看单个容器端口
docker port my-container 80                       # 查看指定端口

# 端口范围映射
docker run -p 8000-8010:80 nginx                 # 映射端口范围
```

## Docker Compose

### Docker Compose基础

```yaml
# docker-compose.yml示例
version: '3.8'

services:
  web:
    image: nginx:alpine
    container_name: my-web
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    environment:
      - NGINX_HOST=localhost
      - NGINX_PORT=80
    depends_on:
      - db
      - redis
    networks:
      - frontend
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s

  db:
    image: postgres:14
    container_name: my-db
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d mydb"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:alpine
    container_name: my-redis
    command: redis-server --requirepass mypassword
    volumes:
      - redis_data:/data
    networks:
      - backend
    restart: unless-stopped

  app:
    build:
      context: ./app
      dockerfile: Dockerfile
    container_name: my-app
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://user:password@db:5432/mydb
      - REDIS_URL=redis://:mypassword@redis:6379
    ports:
      - "3000:3000"
    working_dir: /app
    stdin_open: true
    tty: true
    networks:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
```

### Docker Compose命令

```bash
# 启动服务
docker-compose up                    # 前台启动
docker-compose up -d                 # 后台启动
docker-compose up --build            # 重新构建镜像后启动
docker-compose up -d --no-color      # 不使用颜色输出
docker-compose up --no-deps db       # 启动特定服务（不启动依赖）

# 停止服务
docker-compose down                  # 停止并删除容器
docker-compose down -v               # 同时删除数据卷
docker-compose down --rmi all        # 同时删除镜像
docker-compose down --remove-orphans # 删除孤立容器

# 查看服务状态
docker-compose ps                    # 查看服务状态
docker-compose top                   # 查看服务进程
docker-compose config                # 验证并显示配置
docker-compose config --services     # 只显示服务列表

# 查看日志
docker-compose logs                  # 查看所有服务日志
docker-compose logs -f               # 实时跟踪日志
docker-compose logs -f --tail=100 web  # 查看最后100行

# 执行命令
docker-compose exec web ls /app      # 在服务中执行命令
docker-compose exec -T web npm test  # 非交互式执行

# 缩放服务
docker-compose up -d --scale web=3   # 启动3个web实例
docker-compose scale web=3           # 缩放到3个实例

# 重启服务
docker-compose restart               # 重启所有服务
docker-compose restart web           # 重启特定服务

# 暂停/恢复服务
docker-compose pause                 # 暂停所有服务
docker-compose unpause               # 恢复所有服务

# 资源管理
docker-compose pull                  # 拉取最新镜像
docker-compose build                # 构建镜像
docker-compose build --no-cache     # 不使用缓存构建
```

### Docker Compose进阶配置

```yaml
# 多环境配置文件
# docker-compose.yml（基础配置）
# docker-compose.override.yml（覆盖配置，会自动加载）
# docker-compose.prod.yml（生产环境配置）
# docker-compose.dev.yml（开发环境配置）

# 使用指定配置文件
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 环境变量文件
# .env（默认环境变量文件）
# .env.development（开发环境变量）
# .env.production（生产环境变量）
# .env.local（本地覆盖变量，最高优先级）

# .env文件示例
COMPOSE_PROJECT_NAME=myapp
COMPOSE_FILE=docker-compose.yml
COMPOSE_PROJECT_NAME=my_project
COMPOSE_VERSION=3.8

# profiles（配置文件）
services:
  web:
    image: nginx
    profiles: ["frontend"]

  worker:
    image: worker
    profiles: ["backend"]

  db:
    image: postgres
    profiles: ["db"]

# 使用profile启动
docker-compose --profile frontend --profile backend up -d

# extend（扩展服务）
# docker-compose.base.yml
services:
  base:
    image: nginx
    restart: unless-stopped

# docker-compose.yml
services:
  web:
    extends:
      file: docker-compose.base.yml
      service: base
    ports:
      - "8080:80"
```

## 镜像优化最佳实践

### 减小镜像体积

```dockerfile
# 1. 使用合适的基础镜像
# 不推荐
FROM ubuntu
RUN apt-get update && apt-get install -y python3

# 推荐 - 使用官方精简镜像
FROM python:3.11-slim

# 更推荐 - 使用Alpine（极简Linux）
FROM python:3.11-alpine

# 最推荐 - 使用特定语言的官方镜像
FROM node:18-alpine

# 2. 多阶段构建
# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# 3. 减少层数
# 不推荐
FROM node:18-alpine
RUN apk add --no-cache python3
RUN apk add --no-cache make
RUN apk add --no-cache g++
RUN mkdir /app
COPY . /app
RUN chmod +x /app/start.sh

# 推荐
FROM node:18-alpine
RUN apk add --no-cache python3 make g++ && \
    mkdir /app && \
    chmod +x /app/start.sh
COPY . /app

# 4. 清理不必要的文件
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        package1 \
        package2 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 5. 使用.dockerignore
node_modules/
.git/
.gitignore
*.log
*.md
test/
coverage/
.env*
.vscode/
.idea/
*.swp
.DS_Store

# 6. 利用构建缓存
# 将变化频繁的操作放在后面
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
```

### 安全最佳实践

```dockerfile
# 1. 不使用root用户运行
FROM node:18-alpine
RUN addgroup -g 1000 appgroup && \
    adduser -u 1000 -G appgroup -s /bin/sh -D appuser
USER appuser

# 2. 只读文件系统
FROM node:18-alpine
RUN chmod -R go-w /etc
USER nobody

# 3. 不在镜像中包含敏感信息
# 使用构建参数或环境变量
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

# 4. 使用健康检查
FROM node:18-alpine
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# 5. 设置元数据
FROM node:18-alpine
LABEL maintainer="yourname@example.com" \
      version="1.0.0" \
      description="My application" \
      org.opencontainers.image.source="https://github.com/username/repo"

# 6. 使用非特权端口
EXPOSE 8080

# 7. 禁用或清理Shell历史
ENV HISTFILE=/dev/null
RUN rm -f /root/.bash_history
```

### 性能最佳实践

```dockerfile
# 1. 使用构建缓存
# 先复制依赖文件，再复制源代码
COPY package*.json ./
RUN npm ci
COPY . .

# 2. 并行操作
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        package1 \
        package2 && \
    rm -rf /var/lib/apt/lists/*

# 3. 使用特定版本的镜像
FROM node:18.12.1-alpine3.17  # 不使用:latest

# 4. 最小化运行时依赖
FROM node:18-alpine
RUN apk add --no-cache \
    # 只安装运行时必需的依赖
    > /dev/null

# 5. 使用.init系统管理进程
FROM node:18-alpine
CMD ["node", "app.js"]
```

## 常见问题处理

### 镜像拉取问题

```bash
# 问题：镜像拉取失败
# 解决方案：配置镜像加速器
sudo nano /etc/docker/daemon.json

{
  "registry-mirrors": [
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}

sudo systemctl restart docker

# 使用代理拉取镜像
docker pull --registry https://registry.example.com image:tag
```

### 容器启动问题

```bash
# 问题：容器启动后立即退出
# 解决方案：检查容器日志
docker logs my-container
docker logs -f my-container

# 常见原因
# 1. 应用崩溃 - 检查应用日志
# 2. 端口冲突 - 检查端口是否被占用
# 3. 配置错误 - 检查环境变量和配置文件
# 4. 依赖服务未启动 - 使用depends_on

# 保持容器运行
docker run -d --name my-container busybox tail -f /dev/null

# 检查容器退出码
docker inspect --format='{{.State.ExitCode}}' my-container
```

### 权限问题

```bash
# 问题：Permission denied
# 解决方案：挂载目录设置正确权限
docker run -v /host/path:/container/path:z nginx

# 使用指定用户运行
docker run -u 1000:1000 nginx

# 在容器中修改文件权限
docker exec my-container chown -R 1000:1000 /app/data

# 解决Docker Socket权限问题
sudo usermod -aG docker $USER
newgrp docker
```

### 内存和磁盘问题

```bash
# 查看Docker磁盘使用
docker system df
docker system df -v

# 清理未使用的资源
docker system prune                    # 清理所有未使用的资源
docker system prune -a                 # 清理所有未使用的镜像
docker image prune -a                  # 清理所有未使用的镜像
docker container prune                 # 清理所有停止的容器
docker volume prune                    # 清理所有未使用的卷
docker network prune                   # 清理所有未使用的网络

# 完整清理
docker system prune -a --volumes

# 清理特定镜像
docker rmi $(docker images -f "dangling=true" -q)

# 清理特定标签的镜像
docker rmi $(docker images | grep "none" | awk '{print $3}')

# 查看Docker磁盘占用详情
docker system events --since '1h'
```

### 网络问题

```bash
# 问题：容器无法访问外网
# 检查网络配置
docker network ls
docker network inspect bridge

# 检查DNS配置
docker run --rm alpine cat /etc/resolv.conf

# 自定义DNS
docker run --dns 8.8.8.8 nginx

# 问题：容器间无法通信
# 检查是否在同一网络
docker network inspect my-network

# 连接容器到网络
docker network connect my-network my-container

# 创建自定义网络（自动DNS解析）
docker network create my-network
docker run --network my-network --name service1 nginx
docker run --network my-network --name service2 nginx
# service1可以通过service2访问service2
```

### 构建问题

```bash
# 问题：构建缓存导致更新不生效
# 强制不使用缓存构建
docker build --no-cache .

# 清理构建缓存
docker builder prune

# 问题：Dockerfile指令失败
# 详细输出
docker build -t my-image . --progress=plain

# 调试构建过程
RUN echo "Debug step"
```

## 常用命令速查表

| 命令 | 说明 |
|------|------|
| `docker run` | 创建并启动容器 |
| `docker ps` | 列出容器 |
| `docker images` | 列出镜像 |
| `docker exec` | 在容器中执行命令 |
| `docker logs` | 查看容器日志 |
| `docker stop` | 停止容器 |
| `docker start` | 启动容器 |
| `docker rm` | 删除容器 |
| `docker rmi` | 删除镜像 |
| `docker build` | 构建镜像 |
| `docker pull` | 拉取镜像 |
| `docker push` | 推送镜像 |
| `docker cp` | 复制文件 |
| `docker inspect` | 查看详细信息 |
| `docker stats` | 查看资源使用 |
| `docker network` | 管理网络 |
| `docker volume` | 管理数据卷 |
| `docker-compose up` | 启动Compose服务 |
| `docker-compose down` | 停止Compose服务 |
| `docker system df` | 查看磁盘使用 |
| `docker system prune` | 清理资源 |
