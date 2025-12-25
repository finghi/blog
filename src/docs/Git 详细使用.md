---
title: Git 详细使用
icon: laptop-code
# order: 1
date: 2025-12-24
category:
  - 使用指南
tag:
  - Git
---

<div style="font-weight:700; ">Git 的详细使用文档。</div>

<!-- more -->

## 基础配置

```bash
# 配置全局用户名（关联提交记录）
git config --global user.name "Your Name"

# 配置全局邮箱（需与 GitHub/GitLab 账号一致）
git config --global user.email "your.email@example.com"

# 查看配置信息
git config --list

# 配置默认编辑器（可选，如 VS Code）
git config --global core.editor "code --wait"

# 配置中文显示（解决乱码）
git config --global core.quotepath false

# 配置别名（提高效率，推荐）
git config --global alias.st status
# 配置图形化日志别名（非常实用）
git config --global alias.lg "log --oneline --graph --all --decorate"
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.pu push
git config --global alias.pl pull
git config --global alias.sh stash
git config --global alias.df diff
```

> 💡 别名使用示例：
>
> - `git st` → `git status`
> - `git lg` → `git log --oneline --graph --all --decorate`
> - `git co main` → `git checkout main`

## 一、初始化仓库

### 1、本地新建仓库

```bash
# 初始化 Git 仓库
git init

# 查看仓库状态（初始化后为空仓库）
git status
```

### 2、克隆远程仓库

```bash
# 克隆远程仓库到本地（HTTPS 方式）
git clone https://github.com/username/repo-name.git

# 克隆远程仓库并指定本地目录名
git clone https://github.com/username/repo-name.git my-project

# SSH 方式（需配置 SSH 密钥）
git clone git@github.com:username/repo-name.git
```

> 💡 SSH 密钥配置步骤：
>
> 1. 生成 SSH 密钥：`ssh-keygen -t ed25519 -C "your.email@example.com"`
> 2. 查看公钥：`cat ~/.ssh/id_ed25519.pub`
> 3. 将公钥添加到 GitHub/GitLab 账号
> 4. 测试连接：`ssh -T git@github.com`

## 二、工作区与暂存区操作

### 1、添加文件到暂存区

```bash
# 添加指定文件到暂存区
git add filename.txt

# 添加所有修改/新增的文件到暂存区
git add .

# 添加指定目录下的所有文件
git add src/

# 交互式添加（选择部分文件/部分修改）
git add -i
```

### 2、撤销暂存区文件

```bash
# 撤销暂存区的指定文件（回到工作区）
git reset HEAD filename.txt

# 撤销暂存区的所有文件
git reset HEAD .
```

### 3、撤销工作区修改

```bash
# 恢复工作区指定文件到最近一次提交的状态（慎用，会丢失未提交的修改）
git checkout -- filename.txt

# 恢复工作区所有文件（慎用）
git checkout -- .
```

### 4、提交修改到版本库

```bash
# 提交暂存区的修改（需填写提交信息）
git commit -m "feat: 新增用户登录功能"

# 提交时跳过暂存区（直接提交工作区已跟踪的文件）
git commit -am "fix: 修复登录按钮点击无响应问题"

# 修改最近一次提交的信息（未推送到远程时使用）
git commit --amend -m "fix: 修复登录按钮点击无响应问题（补充说明）"

# 查看提交历史
git log

# 简洁格式查看提交历史
git log --oneline

# 查看指定文件的提交历史
git log filename.txt

# 查看所有分支的提交历史（图形化）
git log --graph --all --oneline
```

### 5、版本回滚

```bash
# 查看提交历史，获取要回滚的 commit ID
git log --oneline

# 回滚到指定版本（保留工作区修改，可重新提交）
git reset --soft <commit-id>

# 回滚到指定版本（重置暂存区，保留工作区）
git reset --mixed <commit-id>  # 默认方式

# 回滚到指定版本（彻底删除指定版本后的所有修改，慎用）
git reset --hard <commit-id>

# 恢复误回滚的版本（查看所有操作记录）
git reflog
git reset --hard <commit-id>  # 恢复到指定操作记录的版本
```

> ⚠️ 版本回滚注意事项：
>
> 1. **--hard 参数慎用**：会彻底删除工作区和暂存区的修改，无法恢复
> 2. **已推送到远程的提交**：不要使用 reset 回滚，应使用 revert 命令
> 3. **多人协作分支**：回滚后强制推送会覆盖他人的提交，需谨慎操作
> 4. **reflog 的重要性**：误操作后，reflog 是最后的救命稻草

> 💡 版本回滚流程图：
>
> ```
> ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
> │   查看提交历史   │────▶│   选择回滚方式   │────▶│   执行回滚操作   │
> └─────────────────┘     └─────────────────┘     └─────────────────┘
>                                  │                       │
>                                  ▼                       ▼
>                          ┌─────────────────┐     ┌─────────────────┐
>                          │   确认回滚风险   │     │   验证回滚结果   │
>                          └─────────────────┘     └─────────────────┘
> ```

### 6、reflog

- `git log` 只能看到 “未被删除” 的提交历史（如果用 reset 回滚后，后续提交会从 log 中消失
- `git reflog` 能看到所有本地操作的痕迹，哪怕是被 “删除” 的提交，只要本地仓库没被清理，都能找到

```bash
# 查看 HEAD 的所有操作记录（最常用）
git reflog

# 查看指定分支的操作记录（比如 master 分支）
git reflog show master

# 查看更详细的记录（包含时间戳）
git reflog --date=iso
```

##### 补充

1. reflog 的有效期：默认情况下，Git 会在 90 天后清理 reflog 中 “不可达” 的记录（可以通过 git gc 手动清理），所以误操作后要尽快恢复
2. 仅本地有效：reflog 是本地仓库的日志，不会同步到远程仓库，所以别人的仓库看不到你的 reflog

##### 常用参数

- `git reflog expire`：手动清理过期的 reflog 记录
- `git reflog delete`：删除指定的 reflog 条目（极少用)

## 三、分支管理

### 1、分支基础操作

```bash
# 查看所有分支（本地+远程）
git branch -a

# 创建新分支
git branch feature/login

# 切换到指定分支
git checkout feature/login

# 创建并切换到新分支（常用）
git checkout -b feature/payment

# 删除本地分支（已合并到主分支后）
git branch -d feature/login

# 强制删除未合并的本地分支（慎用）
git branch -D feature/login

# 删除远程分支
git push origin --delete feature/login
```

### 2、分支合并

#### 普通合并（保留合并记录）

```bash
# 切换到主分支
git checkout main

# 拉取主分支最新代码
git pull origin main

# 合并指定分支到当前分支
git merge feature/login

# 若合并冲突，解决冲突后提交
git add .
git commit -m "merge: 合并登录功能分支，解决冲突"
```

#### 变基合并（线性提交历史）

```bash
# 切换到功能分支
git checkout feature/login

# 基于主分支最新代码变基
git rebase main

# 若变基冲突，解决冲突后继续
git add .
git rebase --continue

# 切换到主分支，合并变基后的功能分支
git checkout main
git merge feature/login
```

> ⚠️ 注意：变基会修改提交历史，若分支已推送到远程且多人协作，禁止使用变基。

> 💡 合并 vs 变基对比：
> | 操作 | 优点 | 缺点 | 使用场景 |
> |------|------|------|----------|
> | 合并 | 保留完整历史，操作简单 | 产生额外合并提交，历史线复杂 | 公共分支，多人协作 |
> | 变基 | 历史线清晰，线性提交 | 修改历史，有风险 | 本地分支，未推送 |

> 💡 分支合并流程图：
>
> ```
> ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
> │   切换到目标分支  │────▶│   拉取最新代码   │────▶│   合并源分支     │
> └─────────────────┘     └─────────────────┘     └─────────────────┘
>                                  │                       │
>                                  ▼                       ▼
>                          ┌─────────────────┐     ┌─────────────────┐
>                          │   解决冲突（如果有）│     │   验证合并结果   │
>                          └─────────────────┘     └─────────────────┘
> ```

### 3、远程分支同步

```bash
# 拉取远程分支到本地
git pull origin main

# 推送本地分支到远程
git push origin feature/login

# 跟踪远程分支 告诉 Git：以后 git pull / git push 时，默认去跟 origin 上的 feature/login 同步。（本地分支与远程分支关联）
git branch --set-upstream-to=origin/feature/login feature/login
```

## 四、标签管理（版本发布）

### 1、创建标签

```bash
# 查看所有标签
git tag

# 创建轻量标签（仅记录 commit ID，本地临时使用）
git tag v1.0.0

# 创建附注标签（含作者、备注，推荐发布版本使用）
git tag -a v1.0.0 -m "v1.0.0 正式发布，支持用户登录功能"

# 给指定 commit 创建标签
git tag -a v1.0.0 <commit-id> -m "v1.0.0 正式发布"
```

### 2、推送标签到远程

```bash
# 推送单个标签
git push origin v1.0.0

# 推送所有本地标签
git push origin --tags
```

### 3、删除标签

```bash
# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0
```

### 4、检出标签版本

```bash
# 切换到标签对应的版本（分离头指针状态，仅查看/打包）
git checkout v1.0.0

# 基于标签创建分支（如需修改标签版本的代码）
git checkout -b branch-v1.0.0 v1.0.0
```

## 五、远程仓库操作

### 1、查看远程仓库

```bash
# 查看远程仓库地址
git remote -v

# 查看远程仓库详细信息
git remote show origin
```

### 2、 添加 / 修改远程仓库

```bash
# 添加远程仓库（命名为 origin）
git remote add origin https://github.com/username/repo-name.git

# 修改远程仓库地址
git remote set-url origin https://github.com/username/new-repo-name.git

# 删除远程仓库
git remote remove origin
```

### 3、拉取 / 推送代码

```bash
# 拉取远程最新代码（合并到本地分支）
git pull origin main

# 推送本地代码到远程
git push origin main

# 强制推送（覆盖远程分支，慎用！仅个人仓库/无协作时使用）
git push -f origin main
```

## 六、Git 高级操作

### 1、暂存工作区修改（stash）

```bash
# 暂存当前工作区的修改（未提交的内容）
git stash

# 暂存时添加备注
git stash save "暂存登录功能的未完成修改"

# 查看所有暂存记录
git stash list

# 恢复最近一次暂存的修改（保留暂存记录）
git stash apply

# 恢复最近一次暂存的修改（删除暂存记录）
git stash pop

# 恢复指定暂存记录
git stash apply stash@{1}

# 删除指定暂存记录
git stash drop stash@{1}

# 删除所有暂存记录
git stash clear
```

### 2、交互式变基（整理提交记录）

#### 合并 / 修改历史提交，让提交记录更整洁：

```bash
# 编辑最近 3 次提交
git rebase -i HEAD~3

# 编辑从指定 commit ID 到最新提交的所有记录（左开右闭，不包含该 commit）
git rebase -i <commit-id>

# 常用指令（在弹出的编辑器中修改）：
# pick：保留该提交
# reword：修改提交信息
# squash：合并到上一个提交
# fixup：合并到上一个提交，丢弃提交信息
# drop：删除该提交

# 完成变基
git rebase --continue
```

#### 保存并退出编辑器

- Vim 编辑器：按 `Esc → 输入 `:wq` → 回车
- vscode 编辑器： 保存文件 → 关闭窗口

#### 关键操作技巧与注意事项

##### 暂停 / 继续 / 放弃变基

```bash
# 变基过程中暂停（如需修改代码）
git rebase --edit-todo

# 解决冲突后继续变基
git add .
git rebase --continue

# 放弃变基（回到操作前的状态）
git rebase --abort

# 查看变基状态
git rebase --status
```

##### 处理变基冲突

###### 交互式变基过程中可能出现冲突（如调整提交顺序后代码依赖冲突），解决流程：

- Git 提示 `error: could not apply xxx...`，并标记冲突文件
- 打开冲突文件，手动解决 `<<<<<<<`/`=======`/`>>>>>>>` 标记的冲突
- 标记冲突已解决：`git add .`
- 继续变基：`git rebase --continue`
- 若不想保留该提交，可执行 `git rebase --skip` 跳过

###### 总结

1. 交互式变基（`git rebase -i`）核心用于编辑本地未推送的提交历史，支持合并、修改、删除、拆分提交
2. 常用指令：`pick`（保留）、`fixup`（合并丢弃信息）、`reword`（改信息）、`edit`（编辑代码）
3. 操作禁忌：不修改已推送的公共分支，冲突解决后用 `git rebase --continue` 继续，放弃用 `git rebase --abort`
4. 最佳实践：开发功能时可随意小提交，完成后用交互式变基整理为有意义的提交，再推送到远程。

### 3、Cherry-pick（挑选提交）

##### 将指定提交复制到当前分支（适用于跨分支复用单个提交）

```bash
# 查看目标提交的 commit ID
git log --oneline

# 将指定提交复制到当前分支
git cherry-pick <commit-id>

# 若冲突，解决后继续
git add .
git cherry-pick --continue

# 放弃 cherry-pick
git cherry-pick --abort

# （可选）如果只是暂时退出，保留当前修改，执行：
git cherry-pick --quit
```

### 4、忽略文件（.gitignore）

```plaintext
# 忽略所有 .log 文件
*.log

# 忽略 node_modules 目录
node_modules/

# 忽略 dist 目录（打包产物）
dist/

# 忽略 IDE 配置文件
.idea/
.vscode/
*.swp

# 忽略系统文件
.DS_Store
Thumbs.db
```

### 5、子模块（Submodule）

#### 用于在主仓库中引入其他 Git 仓库：

```bash
# 添加子模块
git submodule add https://github.com/username/submodule.git src/submodule

# 克隆包含子模块的仓库
git clone --recurse-submodules https://github.com/username/repo-name.git

# 更新子模块
git submodule update --remote
```

## 七、常见问题解决

### 1、推送失败（failed to push some refs）

```bash
# 原因：本地分支与远程分支历史不一致
# 解决：先拉取远程最新代码并合并
git pull --rebase origin main
# 若冲突，解决后继续
git add .
git rebase --continue
# 重新推送
git push origin main
```

### 2、合并冲突

1. 冲突提示：`Automatic merge failed; fix conflicts and then commit the result.`
2. 解决步骤：
   - 打开冲突文件，找到 `<<<<<<< HEAD`（当前分支代码）、`=======`（分隔线）、`>>>>>>> branch-name`（合并分支代码）.
   - 手动删除冲突标记，调整代码逻辑.
   - 标记冲突已解决：`git add .`.
   - 完成合并：`git commit -m "merge: 解决合并冲突"`.

### 3、忘记提交，已切换分支

```bash
# 暂存当前修改
git stash
# 切换回原分支
git checkout main
# 恢复暂存的修改
git stash pop
# 提交修改
git commit -am "feat: 补充遗漏的修改"
```

### 4、本地环境重置

当本地 Git 环境变得混乱（如大量未解决的冲突、错误的合并、误操作等）时，可以通过以下方法进行重置：

#### 轻度重置：保留本地修改，仅重置暂存区和 HEAD

```bash
# 重置暂存区，保留工作区修改
git reset HEAD .
```

#### 中度重置：重置到远程最新状态，删除未提交的修改

```bash
# 拉取远程最新代码（不自动合并）
git fetch origin
# 重置到远程main分支的最新状态（删除本地所有未提交的修改）
git reset --hard origin/main
```

#### 深度重置：清理未跟踪的文件和目录

```bash
# 清理所有未跟踪的文件（-f强制，-d包括目录）
git clean -df
# 清理所有未跟踪的文件和忽略的文件（慎用，会删除.gitignore中指定的文件）
git clean -dfx
```

#### 完全重置：重新克隆仓库（最彻底的方法）

```bash
# 退出当前仓库目录
cd ..
# 删除当前仓库目录
rm -rf repo-name
# 重新克隆仓库
git clone https://github.com/username/repo-name.git
```

> ⚠️ 重置注意事项：
>
> 1. **--hard 参数慎用**：会彻底删除工作区和暂存区的修改，无法恢复
> 2. **git clean 命令**：删除未跟踪的文件，无法恢复
> 3. **重新克隆**：会丢失本地所有未推送到远程的修改和分支
> 4. **先备份重要文件**：在执行任何重置操作前，建议先备份重要的未提交修改

### 5、敏感信息清理

如果不小心将敏感信息（如密码、API 密钥）提交到 Git 仓库，可以通过以下方法清理：

#### 方法一：修改提交历史（仅本地未推送时使用）

```bash
# 交互式变基，修改包含敏感信息的提交
git rebase -i <commit-id>^  # ^表示该提交的上一个提交
# 在编辑器中，将对应提交的 pick 改为 edit
# 修复文件中的敏感信息
git add .
git commit --amend
git rebase --continue
```

#### 方法二：使用 filter-branch（已推送到远程时使用）

```bash
# 删除包含敏感信息的文件的所有历史记录
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch path/to/sensitive-file' \
--prune-empty --tag-name-filter cat -- --all

# 强制推送到远程
git push -f origin main
```

#### 方法三：使用 BFG Repo-Cleaner（推荐，更高效）

```bash
# 下载 BFG
download bfg.jar

# 清理敏感文件
java -jar bfg.jar --delete-files sensitive-file.txt repo-name.git

# 清理敏感字符串（替换为***）
java -jar bfg.jar --replace-text passwords.txt repo-name.git

# 进入仓库目录，清理残留
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 强制推送到远程
git push -f origin main
```

> ⚠️ 敏感信息清理注意事项：
>
> 1. **已推送到远程的情况**：清理后需要通知所有协作者重新克隆仓库
> 2. **备份仓库**：清理前建议先备份仓库
> 3. **修改凭证**：即使清理了历史记录，仍建议立即修改泄露的敏感信息

## 总结

1. Git 核心流程：工作区 → 暂存区 → 版本库 → 远程仓库，核心命令围绕这三个区域展开；
2. 分支管理是 Git 协作的核心，遵循 “功能分支开发、合并到主分支” 的规范；
3. 遇到问题优先通过 `git status`/`git log` 排查，冲突需手动解决，版本回滚慎用 `--hard` 参数。
