---
title: npm详细使用
icon: laptop-code
# order: 6
date: 2026-02-02
category:
  - 使用指南
tag:
  - npm
  - Node.js
  - 包管理
---

<div style="font-weight:700; ">npm（Node Package Manager）是Node.js的默认包管理器，用于安装、管理和分享JavaScript代码库，是前端和Node.js开发的核心工具。</div>

<!-- more -->

## 安装与基本配置

### 安装Node.js（包含npm）

```bash
# 通过nvm安装Node.js（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts

# 通过Homebrew安装（macOS）
brew install node

# 通过官方安装包安装
# 访问 https://nodejs.org 下载安装包
```

### 验证安装

```bash
# 查看Node.js版本
node -v

# 查看npm版本
npm -v

# 查看Node.js和npm的安装路径
which node
which npm
```

### npm基本配置

```bash
# 查看npm配置
npm config list
npm config list -l

# 查看npm配置文件的路径
npm config get userconfig
npm config get globalconfig

# 设置npm镜像源
npm config set registry https://registry.npmmirror.com

# 查看当前镜像源
npm config get registry

# 设置npm为淘宝镜像（国内加速）
npm config set registry https://registry.npmmirror.com

# 恢复官方镜像
npm config set registry https://registry.npmjs.org/

# 设置npm代理
npm config set proxy http://proxy.example.com:8080
npm config set https-proxy http://proxy.example.com:8080

# 取消代理设置
npm config delete proxy
npm config delete https-proxy

# 设置npm的默认编辑器
npm config set editor "code --wait"

# 设置npm的日志级别
npm config set loglevel info
npm config set loglevel warn
npm config set loglevel error

# 查看所有配置项
npm config get
```

### npm初始化项目

```bash
# 初始化新项目（创建package.json）
npm init

# 快速初始化（使用默认配置）
npm init --yes // npm init -y

# 初始化并指定项目名称、版本、描述等
npm init --yes --name="my-project" --version="1.0.0" --description="My awesome project"

# 使用package-lock.json锁定依赖版本
npm init --package-lock

# 初始化私有包
npm init --scope=@myorg
```

## 包管理命令

### 安装包

```bash
# 安装最新版本的包
npm install express

# 安装指定版本的包
npm install express@4.18.2

# 安装包的最新次要版本（兼容版本）
npm install express@^4.18.0
# 安装包的最新补丁版本
npm install express@~4.18.0

# 安装包并保存到dependencies
npm install express --save // 或 -S
# 安装包并保存到devDependencies
npm install typescript --save-dev // 或 -D 
# 全局安装包
npm install -g typescript

# 安装所有依赖
npm install // 简写 npm i 
npm install --legacy-peer-deps

# 安装生产环境依赖（不安装devDependencies）
npm install --production
npm install --omit=dev

# 从本地安装包
npm install /path/to/local/package

# 从Tarball安装包
npm install ./package-1.0.0.tgz

# 安装Git仓库的包
npm install github:user/repo
npm install git+https://github.com/user/repo.git
npm install git+ssh://git@github.com:user/repo.git

# 安装私有仓库的包
npm install @myorg/private-package --registry=https://npm.myorg.com

# 安装包并指定标签
npm install express@beta
npm install express@latest
```

### 卸载包

```bash
# 卸载指定包
npm uninstall express

# 卸载包并从package.json中移除
npm uninstall express --save
npm uninstall express -S

# 卸载devDependencies中的包
npm uninstall typescript --save-dev
npm uninstall typescript -D

# 卸载全局包
npm uninstall -g typescript

# 卸载所有未使用的依赖
npm prune

# 清理未使用的依赖
npm prune --production
```

### 更新包

```bash
# 更新所有包
npm update

# 更新指定包
npm update express

# 更新全局包
npm update -g

# 检查过时的包
npm outdated

# 查看可用的更新版本
npm view express versions

# 查看包的最新版本
npm view express version

# 更新到指定版本
npm install express@latest

# 更新到下一个主版本（重大更新）
npm install express@5 --force
```

### 查看包信息

```bash
# 查看包信息
npm view express

# 查看包的所有版本
npm view express versions

# 查看包的依赖
npm view express dependencies

# 查看包的可用的标签
npm view express dist-tags

# 查看包在npm上的主页
npm view express homepage

# 查看包的仓库地址
npm view express repository

# 查看包的所有者
npm view express maintainers

# 搜索包
npm search express

# 搜索包（指定返回数量）
npm search express --json | head -20

# 查看已安装的包
npm list

# 查看已安装的包（树状结构）
npm list --depth=0

# 查看全局安装的包
npm list -g
npm list -g --depth=0
```

### npm ci - 干净的安装（CI/CD专用）

```bash
# 使用npm ci代替npm install（推荐在CI/CD环境中使用）
npm ci

# 安装生产环境依赖（不安装devDependencies）
npm ci --production

# 安装并忽略scripts
npm ci --ignore-scripts

# 指定安装的package-lock.json版本
npm ci --package-lock-only

# 使用--legacy-peer-deps解决peer依赖冲突
npm ci --legacy-peer-deps

# 安装并指定日志级别
npm ci --loglevel verbose
```

> 💡 npm ci vs npm install 对比：
>
> | 特性 | npm ci | npm install |
> |------|--------|-------------|
> | 速度 | 更快（直接读取package-lock.json） | 较慢（需要解析依赖） |
> | 可靠性 | 每次安装完全一致 | 可能有微小差异 |
> | 清理 | 自动清理node_modules | 不会清理 |
> | 适用场景 | CI/CD、生产环境 | 开发环境 |
> | package-lock.json | 必须存在 | 可选 |

> ⚠️ 注意：
> - npm ci 要求 package-lock.json 必须存在且与 package.json 一致
> - npm ci 会删除整个 node_modules 目录后重新安装
> - 在 CI/CD 环境中，使用 npm ci 可以显著提高安装速度并确保一致性

### npm ping - 检查npm注册表连接

```bash
# 检查npm官方注册表连接
npm ping

# 检查指定注册表的连接
npm ping --registry=https://registry.npmmirror.com

# 忽略网络延迟测试
npm ping --no-timing

# 只显示ping信息（无进度条）
npm ping --json
```

### npm doctor - 检查npm健康状况

```bash
# 检查npm安装的健康状况
npm doctor

# 检查并显示详细信息
npm doctor --verbose

# 只检查特定项
npm doctor --check npm-version
npm doctor --check node-version
npm doctor --check registry
npm doctor --check git
npm doctor --check permissions
```

> 💡 npm doctor 检查项目：
>
> - npm 版本：确保使用最新版本的 npm
> - Node 版本：检查 Node.js 版本是否兼容
> - 注册表连接：测试与 npm 注册表的连接
> - Git 配置：检查 Git 是否正确配置
> - 权限检查：检查全局安装目录的权限
> - 缓存检查：验证缓存目录是否正常

### npm star/unstar - 收藏包

```bash
# 收藏包
npm star my-package

# 取消收藏
npm unstar my-package

# 查看已收藏的包列表
npm stars

# 查看指定用户的收藏列表
npm stars username

# 收藏包并添加说明
npm star my-package --message "Great package for validation"
```

### npm fund - 支持开源项目

```bash
# 查看包的资金支持信息
npm fund my-package

# 查看所有已安装依赖的资金支持信息
npm fund

# 为当前项目安装的依赖提供资金支持（一次性）
npm fund --give

# 通过浏览器打开资金页面
npm fund --browser
```

> 💡 提示：
> - `npm fund` 命令会显示项目中所有依赖的资金支持信息
> - 使用 `--give` 参数可以一次性支持所有依赖项目
> - 这是一种支持开源开发者的好方式

## 依赖管理

### 依赖类型

```bash
# optionalDependencies - 可选依赖
npm install optional-package --save-optional

# peerDependencies - 同伴依赖（用于插件开发）
npm install react --save-peer
```

### package.json依赖版本详解

```json
{
  "dependencies": {
    "express": "4.18.2",        // 精确版本
    "lodash": "^4.17.21",       // 兼容版本（主版本不变）
    "semver": "~5.7.1",         // 补丁版本（主次版本不变）
    "chalk": ">=4.0.0",         // 大于等于
    "node": ">=16.0.0",         // Node.js版本要求
    "npm": "^8.0.0"             // npm版本要求
  }
}
```

> 💡 版本符号说明：
>
> - `^`（兼容版本）：主版本不变，允许更新次版本和补丁版本
> - `~`（补丁版本）：主次版本不变，允许更新补丁版本
> - 无符号：精确版本
> - `>=`、`>`、`<=`、`<`：版本范围

### 锁定依赖版本

```bash
# package-lock.json会在npm install时自动生成
# 它锁定所有依赖的精确版本，确保团队成员安装相同版本

# 重新生成package-lock.json
rm package-lock.json
npm install

# 查看package-lock.json内容
cat package-lock.json

# 升级package-lock.json中的依赖版本
npm update

# 使用--package-lock-only只更新package-lock.json
npm update --package-lock-only
```

### 工作区（Workspaces）

```bash
# 初始化带工作区的项目
npm init -w packages/package-a -w packages/package-b

# 在所有工作区安装依赖
npm install

# 在指定工作区安装依赖
npm install express -w packages/package-a

# 在所有工作区运行命令
npm run test -ws

# 在指定工作区运行命令
npm run test -w packages/package-a

# 列出所有工作区
npm workspaces list

# 查看工作区依赖
npm ls -ws
```

## 脚本和生命周期

### scripts配置

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/",
    "clean": "rm -rf dist",
    "deploy": "npm run build && npm run start"
  }
}
```

### 运行脚本

```bash
# 运行package.json中的脚本
npm run start

# 运行开发脚本
npm run dev

# 运行测试脚本
npm test

# 运行构建脚本
npm run build

# 运行清理脚本
npm run clean

# 查看所有可用脚本
npm run

# 传递参数给脚本
npm run dev -- --port 3000

# 使用npm run执行多个命令
npm run lint && npm run test
```

### 生命周期脚本

```json
{
  "scripts": {
    "preinstall": "echo \"安装前执行\"",
    "postinstall": "echo \"安装后执行\"",
    "prepublish": "echo \"发布前执行（已废弃）\"",
    "prepare": "echo \"安装后或准备发布时执行\"",
    
    "prepublishOnly": "echo \"仅在发布前执行\",
    "prepack": "echo \"打包前执行\"",
    "postpack": "echo \"打包后执行\"",

    "prepublish": "echo \"发布包之前执行（用于准备）\"", //  已废弃
    "publish": "echo \"发布包时执行\"",
    "postpublish": "echo \"发布包后执行\"",

    "preversion": "echo \"版本号变更前执行\"",
    "version": "echo \"版本号变更后执行（用于更新文件）\"",
    "postversion": "echo \"版本号变更并提交后执行\"",

    "pretest": "echo \"运行测试前执行\"",
    "test": "echo \"运行测试\" && exit 0",
    "posttest": "echo \"运行测试后执行\"",

    "prestart": "echo \"启动前执行\"",
    "start": "node index.js",
    "poststart": "echo \"启动后执行\"",

    "prestop": "echo \"停止前执行\"",
    "stop": "echo \"停止\"",
    "poststop": "echo \"停止后执行\""
  }
}
```

> ⚠️ 注意：
> - `prepublish` 已废弃，使用 `prepare` 和 `prepublishOnly` 替代
> - 生命周期脚本的退出码非0会中断操作
> - `version` 脚本中修改文件后，这些修改会被自动提交

### 使用npx运行命令

```bash
# 运行本地安装的命令
npx eslint src/

# 运行指定版本的包
npx ts-node index.ts
npx create-react-app my-app

# 运行未安装的包（会自动安装）
npx cowsay "Hello npm!"

# 指定包版本运行
npx node@18 index.js

# 在不同目录下运行
npx -p package-name command

# 运行交互式命令
npx -y create-react-app
```

## npm脚本进阶

### 并行和顺序执行

```bash
# 并行运行多个脚本（使用&）
npm run dev & npm run server &

# 顺序运行多个脚本（使用&&）
npm run lint && npm run test && npm run build

# 使用npm-run-all并行运行
npm install -D npm-run-all
npm run dev -- --parallel
npm-run-all --parallel dev server

# 顺序运行
npm-run-all --sequence lint test build
```

### 环境变量

```bash
# 在脚本中使用环境变量
npm run dev -- --env=production

# 在package.json中使用环境变量
"scripts": {
  "dev": "cross-env NODE_ENV=development node index.js"
}

# 安装cross-env（跨平台环境变量）
npm install -D cross-env

# 使用.env文件
npm install -D dotenv
# 在脚本中加载.env文件
"scripts": {
  "dev": "node -r dotenv/config index.js"
}
```

### 传递参数

```bash
# 脚本中接收参数
"scripts": {
  "build": "webpack --mode production"
}

# 传递额外参数
npm run build -- --config webpack.prod.js

# 使用yargs解析参数
npm install -D yargs
```

## 包发布

### 登录npm

```bash
# 登录npm账号
npm login
npm adduser

# 查看当前登录用户
npm whoami

# 退出登录
npm logout
```

### 发布包

```bash
# 发布包到npm
npm publish

# 发布指定标签的包
npm publish --tag beta

# 发布测试版本
npm publish --tag next

# 发布到私有仓库
npm publish --registry=https://npm.myorg.com

# 发布包并指定访问级别（需要npm账号设置）
npm publish --access=public
npm publish --access=restricted

# 使用npm tag管理标签
npm dist-tag add my-package@1.0.0 latest
npm dist-tag add my-package@2.0.0-beta.0 beta
npm dist-tag rm my-package latest
npm dist-tag ls my-package
```

### 版本管理

```bash
# 查看当前版本
npm version

# 升级补丁版本（1.0.0 -> 1.0.1）
npm version patch

# 升级次要版本（1.0.0 -> 1.1.0）
npm version minor

# 升级主版本（1.0.0 -> 2.0.0）
npm version major

# 设置指定版本
npm version 1.2.3

# 自动更新版本并提交git
npm version patch -m "chore(release): %s"
```

### npm patch - 创建补丁包

```bash
# 创建补丁包（需要先登录npm）
npm patch

# 为指定包创建补丁
npm patch my-package

# 为指定版本创建补丁
npm patch my-package@1.0.0

# 创建补丁并指定输出目录
npm patch my-package --patch-dir ./patches

# 查看补丁内容
npm patch my-package --dry-run
```

> 💡 `npm patch` 说明：
>
> - 此命令用于**包维护者**为自己的包创建补丁版本
> - 需要是包的维护者且已登录 npm 账号
> - 用于快速修复已发布包的问题并发布补丁版本
>
> **版本号规范（语义化版本）：**
>
> - **主版本（Major）**：做了不兼容的 API 修改
> - **次版本（Minor）**：新增了向下兼容的功能
> - **补丁版本（Patch）**：做了向下兼容的问题修复
>
> | 版本号示例 | 类型 | 说明 |
> |-----------|------|------|
> | 1.0.0 | 初始版本 | 第一个正式发布版本 |
> | 1.0.1 | Patch | Bug 修复，向下兼容 |
> | 1.1.0 | Minor | 新功能，向下兼容 |
> | 2.0.0 | Major | 重大更新，可能不兼容 |

> ⚠️ 打补丁最佳实践：
>
> - 补丁版本应仅包含 Bug 修复，不引入新功能
> - 确保补丁版本向后兼容
> - 编写清晰的 CHANGELOG 记录修复内容
> - 在发布前充分测试
> - 使用 `npm version patch` 自动更新版本号

### 为第三方库打本地补丁（patch-package）

```bash
# 安装 patch-package
npm install -D patch-package postinstall-postinstall

# 修改 node_modules 中的代码后，创建补丁
cd /path/to/your-project
npx patch-package lodash

# 这会在项目根目录创建 patches/lodash+4.17.21.patch 文件

# 提交补丁文件到版本控制
git add patches/
git commit -m "fix: patch lodash for issue"

# 之后每次 npm install 后会自动应用补丁
# 因为 postinstall-postinstall 会在 postinstall 脚本中运行 patch-package

# 应用所有补丁
npx patch-package

# 跳过应用补丁（如果需要）
npx patch-package --skip-check

# 查看已创建的补丁列表
ls patches/

# 删除某个补丁
rm patches/lodash+4.17.21.patch
```

> 💡 patch-package 使用场景：
>
> - 临时修复第三方库的 Bug，等待官方修复
> - 修复项目中依赖的库的兼容性问题
> - 对关键依赖进行小幅定制
>
> ⚠️ 注意事项：
>
> - 补丁文件需要提交到版本控制中
> - 每次更新包版本后可能需要重新创建补丁
> - 长期依赖临时补丁不是最佳实践，应推动官方修复
> - 使用 `--reject-file` 参数可以生成 .rej 文件处理冲突

### 取消发布

```bash
# 取消发布（24小时内）
npm unpublish my-package@1.0.0

# 取消发布整个包
npm unpublish my-package --force

# 废弃版本
npm deprecate my-package@1.0.0 "Use version 2.0.0 instead"
```

### 包访问权限管理

```bash
# 设置包的访问级别
npm access public my-package
npm access restricted my-package

# 查看包的当前访问级别
npm access ls packages

# 授予用户访问权限
npm access grant read-only my-package username
npm access grant read-write my-package username

# 撤销用户访问权限
npm access revoke my-package username

# 授予团队访问权限
npm access grant read-only my-package @myorg:developers
npm access grant read-write my-package @myorg:developers

# 撤销团队访问权限
npm access revoke my-package @myorg:developers

# 查看包的访问权限列表
npm access ls my-package
```

### 包所有者管理

```bash
# 查看包的所有者
npm owner ls my-package

# 添加包的所有者
npm owner add username my-package

# 移除包的所有者
npm owner rm username my-package
```

### 认证令牌管理

```bash
# 查看所有认证令牌
npm token list

# 创建只读令牌
npm token create --readonly

# 创建自动化令牌
npm token create --automation

# 创建具有完整权限的令牌
npm token create

# 创建具有过期时间的令牌
npm token create --expires="2025-12-31"

# 删除令牌
npm token delete <token-id>

# 删除所有令牌（需要确认）
npm token revoke all
```

### 用户资料管理

```bash
# 查看当前用户资料
npm profile get

# 修改用户资料
npm profile set email "new.email@example.com"
npm profile set fullname "Your Name"
npm profile set homepage "https://yourwebsite.com"
npm profile set github "username"

# 修改密码
npm profile set password

# 启用双因素认证
npm profile enable-2fa

# 禁用双因素认证
npm profile disable-2fa
```

### 团队管理

```bash
# 创建团队
npm team create @myorg/developers

# 删除团队
npm team destroy @myorg/developers

# 查看团队成员
npm team ls @myorg/developers

# 添加团队成员
npm team add @myorg/developers username

# 移除团队成员
npm team rm @myorg/developers username
```

### 组织管理

```bash
# 查看当前所属组织
npm org ls

# 查看组织信息
npm org ls @myorg

# 查看组织成员
npm team ls @myorg

# 创建组织（需要访问 https://www.npmjs.com/settings/）
# 组织管理主要通过npm网站进行
```

## 常见问题处理

### 权限问题

```bash
# 解决全局安装权限问题（推荐使用nvm）
sudo npm install -g typescript

# 或者配置npm全局安装路径
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo "export PATH=~/.npm-global/bin:$PATH" >> ~/.bashrc
source ~/.bashrc

# 解决EACCES权限错误
sudo chown -R $(whoami) ~/.npm
```

### 网络问题

```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 使用cnpm
npm install -g cnpm
cnpm install express

# 设置代理
npm config set proxy http://proxy.example.com:8080
npm config set https-proxy http://proxy.example.com:8080

# 清除代理
npm config delete proxy
npm config delete https-proxy

# 使用镜像安装
npm install express --registry=https://registry.npmmirror.com
```

### 依赖冲突

```bash
# 使用--legacy-peer-deps解决peer依赖冲突
npm install --legacy-peer-deps

# 使用--force强制安装
npm install --force

# 清除node_modules重新安装
rm -rf node_modules package-lock.json
npm install

# 使用npm dedupe减少重复依赖
npm dedupe
```

### 缓存管理

```bash
# 清除npm缓存
npm cache clean --force

# 查看缓存大小
npm cache verify

# 缓存目录位置
npm config get cache
```

### 安全审计

```bash
# 检查安全漏洞
npm audit

# 检查生产环境漏洞
npm audit --production

# 查看详细漏洞信息
npm audit --json

# 自动修复安全漏洞
npm audit fix

# 修复生产环境漏洞
npm audit fix --production

# 忽略某些漏洞
npm audit fix --package-lock-only --ignore-scripts
```

## 最佳实践

### 项目结构

```
my-project/
├── package.json          # 项目配置
├── package-lock.json     # 依赖锁定文件
├── .npmrc               # npm配置文件
├── .npmignore           # 发布时忽略的文件
├── node_modules/        # 依赖目录
├── src/                 # 源代码
├── dist/                # 构建产物
├── public/              # 静态资源
├── tests/               # 测试文件
└── README.md            # 项目说明
```

### .npmignore配置

```
# 忽略的文件和目录
node_modules/
dist/
coverage/
*.log
.env
.env.*
.git/
.gitignore
.editorconfig
.eslintrc*
.prettier*
.DS_Store
Thumbs.db
```

### .npmrc配置

```ini
# 镜像源
registry=https://registry.npmmirror.com

# 保存配置
save-exact=true

# 自动安装peer依赖
legacy-peer-deps=true

# 日志级别
loglevel=warn

# 禁用审计提示
audit=false

# 禁用fund提示
fund=false

# 设置全局安装路径
prefix=/Users/username/.npm-global
```

### package.json最佳实践

```json
{
  "name": "my-awesome-project",
  "version": "1.0.0",
  "description": "A awesome project built with Node.js",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "require": "./dist/index.js",
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    }
  },
  "sideEffects": false,
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src/",
    "format": "prettier --write src/",
    "prepublishOnly": "npm run build && npm test"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  },
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourname/my-awesome-project.git"
  },
  "bugs": {
    "url": "https://github.com/yourname/my-awesome-project/issues"
  },
  "homepage": "https://github.com/yourname/my-awesome-project#readme",
  "keywords": [
    "nodejs",
    "javascript",
    "npm"
  ]
}
```

### 版本控制

```bash
# .gitignore中添加
node_modules/
dist/
*.log
.env
.env.local
.DS_Store
```

### CI/CD集成

```yaml
# .github/workflows/npm-publish.yml
name: Node.js Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

## 其他常用命令

### npm explain - 查看依赖关系

```bash
# 查看包的依赖关系树
npm explain express

# 查看特定版本的依赖关系
npm explain express@4.18.2

# 查看所有依赖关系（详细）
npm explain --all

# 以JSON格式输出
npm explain --json
```

### npm exec - 执行包命令

```bash
# 执行包中的命令
npm exec --package=eslint -- eslint src/

# 交互式执行
npm exec

# 使用参数执行
npm exec --package=ts-node -- ts-node index.ts

# 在指定目录执行
npm exec --prefix ./packages/my-package -- my-script.sh

# 创建临时脚本并执行
npm exec --create-script -- "echo Hello"
```

### npm diff - 比较版本差异

```bash
# 比较当前安装的版本与npm上的最新版本
npm diff

# 比较指定包的版本差异
npm diff express

# 比较两个版本的差异
npm diff express@4.17.1 express@4.18.2

# 比较本地包与远程包
npm diff --diff=remote express@latest
```

### npm pack - 打包包

```bash
# 打包当前包
npm pack

# 打包指定包
npm pack express

# 打包指定版本
npm pack express@4.18.2

# 打包并指定输出目录
npm pack --pack-destination=/path/to/output

# 打包忽略scripts
npm pack --ignore-scripts
```

### npm root - 查看npm安装路径

```bash
# 查看本地安装路径
npm root

# 查看全局安装路径
npm root -g

# 查看用户配置路径
npm root --userconfig
```

### npm prefix - 查看项目根路径

```bash
# 查看当前项目的根路径
npm prefix

# 查看指定位置的根路径
npm prefix /path/to/project
```

### npm link - 链接本地包（开发专用）

```bash
# 在要开发的包目录下，创建全局链接
cd /path/to/my-local-package
npm link

# 在项目中使用全局链接的包
cd /path/to/my-project
npm link my-local-package

# 创建本地链接（不安装到全局）
cd /path/to/my-project
npm link ../my-local-package

# 移除全局链接
npm link -g my-local-package

# 移除项目中的链接
cd /path/to/my-project
npm unlink my-local-package

# 列出所有全局链接的包
npm link --global

# 检查链接状态
npm ls --link
```

> 💡 npm link 使用场景：
>
> - 开发本地包时，无需发布到 npm 即可在其他项目中测试
> - 调试复杂依赖关系，避免频繁发布测试版本
> - 多仓库项目中，跨项目协作开发
>
> ⚠️ 注意：
> - 使用 `npm link` 后，包的更改会实时生效
> - 链接关系会在 `node_modules` 中体现为符号链接
> - 生产环境应使用正式版本，避免依赖链接包

### npm rebuild - 重新构建原生模块

```bash
# 重新构建所有原生模块
npm rebuild

# 重新构建指定包
npm rebuild bcrypt

# 重新构建指定版本的包
npm rebuild bcrypt@0.8.9

# 重新构建并指定构建工具
npm rebuild bcrypt --build-from-source

# 忽略scripts重新构建
npm rebuild --ignore-scripts

# 查看需要重新构建的包
npm rebuild --dry-run
```

> 💡 适用场景：
>
> - Node.js 版本升级后，原生模块需要重新编译
> - 更改了 Python 版本（某些原生模块使用 Python 构建）
> - 操作系统更新后，底层依赖发生变化
> - 解决了原生模块加载错误

### npm repo - 打开包仓库页面

```bash
# 在浏览器中打开包的仓库页面
npm repo express

# 打开当前包的仓库页面
npm repo

# 打开指定版本的仓库页面
npm repo express@4.18.2
```

### npm bugs - 查看包的Bug报告页面

```bash
# 在浏览器中打开包的Bug报告页面
npm bugs express

# 打开当前包的Bug报告页面
npm bugs

# 使用web选项强制使用浏览器
npm bugs --web
```

### npm home - 打开包的主页

```bash
# 在浏览器中打开包的主页
npm home express

# 打开当前包的主页
npm home

# 使用web选项强制使用浏览器
npm home --web
```

### npm info - 查看包信息（别名）

```bash
# 查看包信息
npm info express

# 查看包的所有版本
npm info express versions

# 查看包的最新版本
npm info express version

# 查看包的所有者
npm info express maintainers

# 以JSON格式输出
npm info express --json
```

## 常用命令速查表

| 命令 | 说明 |
|------|------|
| `npm init` | 初始化项目 |
| `npm install` | 安装所有依赖 |
| `npm install <package>` | 安装包 |
| `npm ci` | 干净的安装（CI/CD专用） |
| `npm uninstall <package>` | 卸载包 |
| `npm update` | 更新所有包 |
| `npm run <script>` | 运行脚本 |
| `npm test` | 运行测试 |
| `npm start` | 启动项目 |
| `npm run build` | 构建项目 |
| `npm list` | 列出已安装的包 |
| `npm outdated` | 检查过时的包 |
| `npm audit` | 安全审计 |
| `npm audit fix` | 修复安全漏洞 |
| `npm publish` | 发布包 |
| `npm login` | 登录npm |
| `npm logout` | 退出登录 |
| `npm config` | 配置npm |
| `npm cache` | 管理缓存 |
| `npm ping` | 检查npm注册表连接 |
| `npm doctor` | 检查npm健康状况 |
| `npm star <package>` | 收藏包 |
| `npm unstar <package>` | 取消收藏 |
| `npm fund` | 支持开源项目 |
| `npm exec` | 执行包命令 |
| `npm explain` | 查看依赖关系 |
| `npm diff` | 比较版本差异 |
| `npm pack` | 打包包 |
| `npm root` | 查看npm安装路径 |
| `npm prefix` | 查看项目根路径 |
| `npm repo` | 打开包仓库页面 |
| `npm bugs` | 查看包的Bug报告页面 |
| `npm home` | 打开包的主页 |
| `npm info` | 查看包信息 |
| `npm view` | 查看包信息 |
| `npm search` | 搜索包 |
| `npm whoami` | 查看当前登录用户 |
| `npm token` | 管理认证令牌 |
| `npm profile` | 管理用户资料 |
| `npm access` | 管理包访问权限 |
| `npm owner` | 管理包所有者 |
| `npm team` | 管理团队 |
| `npm dist-tag` | 管理包的标签 |
| `npm deprecate` | 废弃包版本 |
| `npm version` | 管理包版本 |
| `npm unpublish` | 取消发布包 |
| `npm patch` | 创建补丁包 |
| `npm link` | 链接本地包（开发专用） |
| `npm rebuild` | 重新构建原生模块 |
