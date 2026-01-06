---
title: Nginx 详细文档
icon: server
# order: 3
date: 2026-01-06
category:
  - 使用指南
tag:
  - Nginx
---

<div style="font-weight:700; ">Nginx 的详细使用文档。</div>

<!-- more -->

## 基础配置

### 安装 Nginx

#### Ubuntu/Debian
```bash
# 更新包列表
apt update

# 安装 Nginx
apt install nginx

# 启动 Nginx
systemctl start nginx

# 设置开机自启
systemctl enable nginx

# 查看 Nginx 状态
systemctl status nginx
```

#### CentOS/RHEL
```bash
# 安装 EPEL 仓库
yum install epel-release

# 安装 Nginx
yum install nginx

# 启动 Nginx
systemctl start nginx

# 设置开机自启
systemctl enable nginx

# 查看 Nginx 状态
systemctl status nginx
```

#### macOS
```bash
# 使用 Homebrew 安装
brew install nginx

# 启动 Nginx
brew services start nginx

# 停止 Nginx
brew services stop nginx
```

### 配置文件结构

Nginx 主配置文件通常位于 `/etc/nginx/nginx.conf`，其基本结构如下：

```nginx
# Nginx 运行用户
user www-data;

# Nginx 工作进程数，通常设置为 CPU 核心数
worker_processes auto;

# 错误日志路径
error_log /var/log/nginx/error.log warn;

# PID 文件路径
pid /var/run/nginx.pid;

# 事件模块配置
events {
    # 每个工作进程的最大连接数
    worker_connections 1024;
}

# HTTP 模块配置
http {
    # 包含 MIME 类型映射文件
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 日志格式定义
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                  '$status $body_bytes_sent "$http_referer" '
                  '"$http_user_agent" "$http_x_forwarded_for"';

    # 访问日志路径
    access_log /var/log/nginx/access.log main;

    # 启用 sendfile 优化
    sendfile on;
    # 启用 TCP_NOPUSH 优化
    tcp_nopush on;
    # 启用 TCP_NODELAY 优化
    tcp_nodelay on;

    # 长连接超时时间
    keepalive_timeout 65;

    # 启用 gzip 压缩
    gzip on;

    # 包含所有虚拟主机配置
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

> 💡 提示：Nginx 配置文件使用分号 (;) 作为语句结束符，花括号 ({}) 用于分组配置块。

## 虚拟主机配置

### 基于域名的虚拟主机

```nginx
# /etc/nginx/conf.d/example.com.conf
server {
    # 监听端口
    listen 80;
    # 服务器名称
    server_name example.com www.example.com;
    # 网站根目录
    root /var/www/example.com;
    # 默认索引文件
    index index.html index.htm index.php;

    # 访问日志
    access_log /var/log/nginx/example.com.access.log main;
    # 错误日志
    error_log /var/log/nginx/example.com.error.log warn;

    # 位置配置
    location / {
        # 尝试按顺序访问文件，如果不存在则返回 404
        try_files $uri $uri/ =404;
    }

    # PHP 支持配置
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
    }

    # 禁止访问 .htaccess 文件
    location ~ /\.ht {
        deny all;
    }
}
```

### 基于端口的虚拟主机

```nginx
# /etc/nginx/conf.d/port8080.conf
server {
    # 监听指定端口
    listen 8080;
    # 服务器名称（可选）
    server_name localhost;
    # 网站根目录
    root /var/www/port8080;
    # 默认索引文件
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

### 基于 IP 的虚拟主机

```nginx
# /etc/nginx/conf.d/192.168.1.100.conf
server {
    # 监听指定 IP 和端口
    listen 192.168.1.100:80;
    # 网站根目录
    root /var/www/192.168.1.100;
    # 默认索引文件
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

## 反向代理配置

### 基本反向代理

```nginx
# /etc/nginx/conf.d/proxy.conf
server {
    listen 80;
    server_name proxy.example.com;

    location / {
        # 代理到后端服务器
        proxy_pass http://127.0.0.1:3000;
        # 设置真实客户端 IP
        proxy_set_header X-Real-IP $remote_addr;
        # 设置代理路径
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # 设置原始请求协议
        proxy_set_header X-Forwarded-Proto $scheme;
        # 设置主机头
        proxy_set_header Host $host;
    }
}
```

### 负载均衡配置

```nginx
# /etc/nginx/nginx.conf（在 http 块内添加）
http {
    # 定义上游服务器组
    upstream backend {
        # 服务器 1
        server 127.0.0.1:3000 weight=1;
        # 服务器 2
        server 127.0.0.1:3001 weight=2;
        # 服务器 3（备用）
        server 127.0.0.1:3002 backup;
    }

    # 虚拟主机配置
    server {
        listen 80;
        server_name loadbalance.example.com;

        location / {
            # 代理到上游服务器组
            proxy_pass http://backend;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Host $host;
        }
    }
}
```

> 💡 负载均衡策略：
> - `weight`：设置服务器权重，权重越高，分配的请求越多
> - `ip_hash`：基于客户端 IP 分配请求，确保同一客户端始终访问同一服务器
> - `least_conn`：将请求分配给连接数最少的服务器
> - `url_hash`：基于请求 URL 分配请求

## SSL/TLS 配置

### 申请 SSL 证书

#### 使用 Let's Encrypt 免费证书

```bash
# 安装 Certbot
apt install certbot python3-certbot-nginx

# 自动获取证书并配置 Nginx
certbot --nginx -d example.com -d www.example.com

# 自动续期测试
certbot renew --dry-run

# 设置自动续期定时任务
crontab -e
# 添加以下内容
0 3 * * * certbot renew --quiet
```

> 💡 提示：
> - `0 3 * * *` 是 cron 表达式，表示每天凌晨 3 点整执行命令
> - `certbot renew` 自动检测并续期所有即将过期的 SSL 证书
> - `--quiet` 安静模式，仅在出现错误时显示信息
> - Let's Encrypt 证书有效期为 90 天，此定时任务确保证书始终有效

### Cron 表达式详解

cron 表达式由 5 个字段组成，按顺序分别是：**分钟**、**小时**、**日**、**月**、**星期**

| 字段位置 | 含义       | 取值范围                | 示例值 `0 3 * * *` 的含义 |
|---------|-----------|------------------------|--------------------------|
| 1       | 分钟      | 0-59                   | 0 表示 0 分              |
| 2       | 小时      | 0-23                   | 3 表示 3 时（凌晨）      |
| 3       | 日        | 1-31                   | * 表示所有日期           |
| 4       | 月        | 1-12 或 Jan-Dec        | * 表示所有月份           |
| 5       | 星期      | 0-7 或 Sun-Sat（0/7=周日） | * 表示所有星期几         |

#### 更多 cron 表达式示例

| 表达式          | 含义                              |
|----------------|----------------------------------|
| `30 8 * * 1-5`  | 每周一至周五早上 8:30 执行          |
| `0 */2 * * *`   | 每 2 小时执行一次                  |
| `0 0 1 1 *`     | 每年 1 月 1 日（元旦）凌晨 0 点执行 |
| `0 0 * * 0`     | 每周日凌晨 0 点执行                |
| `0 3 2 * *`     | 每月 2 号凌晨 3 点执行             |
| `30 * 2 * 5`    | 每月 2 号（且当天是星期五）的每小时 30 分执行 |


### 手动配置 SSL

```nginx
# /etc/nginx/conf.d/ssl.example.com.conf
server {
    # 监听 HTTPS 端口
    listen 443 ssl http2;
    server_name ssl.example.com;

    # SSL 证书路径
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    # SSL 私钥路径
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    # SSL 协议配置
    ssl_protocols TLSv1.2 TLSv1.3;
    # SSL 加密套件
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    # 优先使用服务器加密套件
    ssl_prefer_server_ciphers on;
    # SSL 会话缓存
    ssl_session_cache shared:SSL:10m;
    # SSL 会话超时
    ssl_session_timeout 10m;
    # HSTS 配置
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    root /var/www/ssl.example.com;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name ssl.example.com;
    return 301 https://$server_name$request_uri;
}
```

## 静态文件服务

### 优化静态文件服务

```nginx
server {
    listen 80;
    server_name static.example.com;
    root /var/www/static;

    location / {
        try_files $uri $uri/ =404;
    }

    # 静态文件优化配置
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|eot|svg)$ {
        # 过期时间设置
        expires 30d;
        # 启用 gzip 压缩
        gzip on;
        # 设置缓存控制头
        add_header Cache-Control "public, no-transform";
        # 禁用日志记录
        access_log off;
    }
}
```

## 高级功能配置

### URL 重写

```nginx
server {
    listen 80;
    server_name rewrite.example.com;
    root /var/www/rewrite;

    # 重写规则示例
    location / {
        # 将 /blog/123 重写为 /index.php?page=blog&id=123
        rewrite ^/blog/(\d+)$ /index.php?page=blog&id=$1 last;
        # 将 /about 重写为 /about.html
        rewrite ^/about$ /about.html permanent;
        # 将 /products/ 重写为 /shop/
        rewrite ^/products/(.*)$ /shop/$1 redirect;

        try_files $uri $uri/ =404;
    }
}
```

> ⚠️ 注意：
> - `last`：完成当前重写后，继续搜索匹配的 location
> - `break`：完成当前重写后，不再搜索匹配的 location
> - `redirect`：返回 302 临时重定向
> - `permanent`：返回 301 永久重定向

### 访问控制

```nginx
server {
    listen 80;
    server_name secure.example.com;
    root /var/www/secure;

    location / {
        try_files $uri $uri/ =404;
    }

    # 限制指定 IP 访问
    location /admin {
        allow 192.168.1.0/24;
        allow 127.0.0.1;
        deny all;
        try_files $uri $uri/ =404;
    }

    # HTTP 基本认证
    location /private {
        auth_basic "Private Area";
        auth_basic_user_file /etc/nginx/.htpasswd;
        try_files $uri $uri/ =404;
    }
}
```

#### 生成 HTTP 基本认证密码文件

```bash
# 安装 htpasswd
apt install apache2-utils

# 生成密码文件
htpasswd -c /etc/nginx/.htpasswd username
```

### 日志配置

```nginx
# /etc/nginx/nginx.conf（在 http 块内配置）
http {
    # 定义自定义日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                  '$status $body_bytes_sent "$http_referer" '
                  '"$http_user_agent" "$http_x_forwarded_for"';

    log_format json '{'
                  '"remote_addr":"$remote_addr",'
                  '"remote_user":"$remote_user",'
                  '"time_local":"$time_local",'
                  '"request":"$request",'
                  '"status":"$status",'
                  '"body_bytes_sent":"$body_bytes_sent",'
                  '"http_referer":"$http_referer",'
                  '"http_user_agent":"$http_user_agent",'
                  '"http_x_forwarded_for":"$http_x_forwarded_for"'
                  '}';

    # 访问日志使用 JSON 格式
    access_log /var/log/nginx/access.log json;
    # 错误日志
    error_log /var/log/nginx/error.log warn;
}
```

### 压缩配置

```nginx
# /etc/nginx/nginx.conf（在 http 块内配置）
http {
    # 启用 gzip 压缩
    gzip on;
    # 设置压缩级别（1-9，9 最高）
    gzip_comp_level 6;
    # 设置压缩缓冲区大小
    gzip_buffers 16 8k;
    # 设置压缩最小文件大小
    gzip_min_length 256;
    # 设置压缩的 MIME 类型
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    # 启用对代理请求的压缩
    gzip_proxied any;
    # 为 IE6 禁用压缩
    gzip_disable "MSIE [1-6]\.";
    # 添加 Vary 头
    gzip_vary on;
}
```

## 常用命令

### Nginx 服务管理

```bash
# 启动 Nginx
systemctl start nginx

# 停止 Nginx
systemctl stop nginx

# 重启 Nginx
systemctl restart nginx

# 重新加载配置（不重启服务）
systemctl reload nginx

# 查看 Nginx 状态
systemctl status nginx

# 设置开机自启
systemctl enable nginx

# 禁用开机自启
systemctl disable nginx
```

### Nginx 配置检查

```bash
# 检查配置文件语法
nginx -t

# 查看 Nginx 版本
nginx -v

# 查看 Nginx 详细版本信息
nginx -V

# 查看 Nginx 进程
ps aux | grep nginx

# 查看 Nginx 监听端口
netstat -tulpn | grep nginx
```

## 性能优化

### 工作进程优化

```nginx
# /etc/nginx/nginx.conf
# 设置工作进程数为 CPU 核心数
worker_processes auto;

# 绑定工作进程到特定 CPU 核心
worker_cpu_affinity 0001 0010 0100 1000;

# 设置每个工作进程的最大连接数
events {
    worker_connections 4096;
    # 使用 epoll 事件模型
    use epoll;
    # 允许同时接受多个连接
    multi_accept on;
}
```

### 连接优化

```nginx
# /etc/nginx/nginx.conf（在 http 块内配置）
http {
    # 启用 sendfile 优化
    sendfile on;
    # 启用 TCP_NOPUSH 优化
    tcp_nopush on;
    # 启用 TCP_NODELAY 优化
    tcp_nodelay on;
    # 长连接超时时间
    keepalive_timeout 65;
    # 长连接请求数上限
    keepalive_requests 100;
}
```

### 缓存优化

```nginx
# /etc/nginx/nginx.conf（在 http 块内配置）
http {
    # 定义缓存区域
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g 
                 inactive=60m use_temp_path=off;

    server {
        listen 80;
        server_name cache.example.com;

        location / {
            # 使用缓存
            proxy_cache my_cache;
            # 缓存有效时间
            proxy_cache_valid 200 302 10m;
            proxy_cache_valid 404 1m;
            # 缓存键
            proxy_cache_key "$scheme$request_method$host$request_uri";
            # 代理配置
            proxy_pass http://backend;
        }
    }
}
```

## 常见问题解决

### 502 Bad Gateway

```bash
# 检查后端服务器是否运行
curl http://127.0.0.1:3000

# 检查后端服务器日志
cat /var/log/backend/error.log

# 检查 Nginx 配置
nginx -t

# 重新加载 Nginx 配置
systemctl reload nginx
```

### 403 Forbidden

```bash
# 检查文件权限
ls -la /var/www/html/

# 检查目录权限
find /var/www/html -type d -exec chmod 755 {} \;

# 检查文件权限
find /var/www/html -type f -exec chmod 644 {} \;

# 检查 Nginx 运行用户
ps aux | grep nginx

# 检查 SELinux 状态
getenforce

# 临时禁用 SELinux
setenforce 0
```

### Nginx 无法启动

```bash
# 检查端口是否被占用
netstat -tulpn | grep 80

# 检查配置文件语法
nginx -t

# 查看错误日志
cat /var/log/nginx/error.log

# 检查 SELinux 规则
audit2allow -a
```

## 总结

1. Nginx 是一个高性能的 Web 服务器、反向代理服务器和负载均衡器，广泛应用于生产环境。
2. 核心配置包括虚拟主机、反向代理、SSL/TLS、静态文件服务等。
3. 性能优化主要从工作进程、连接管理、缓存配置等方面入手。
4. 常见问题解决需结合错误日志和系统工具进行排查。
5. 定期更新 Nginx 和 SSL 证书，确保系统安全。