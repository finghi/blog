---
title: 常用Linux命令文档
icon: terminal
# order: 2
date: 2025-12-30
category:
  - 使用指南
tag:
  - Linux
---

<div style="font-weight:700; ">常用Linux命令的详细使用文档。</div>

<!-- more -->

## 基础命令

### ls - 列出目录内容
```bash
# 列出当前目录所有文件（不包括隐藏文件）
ls

# 列出当前目录所有文件（包括隐藏文件）  
ls -a

# 列出文件的详细信息（权限、所有者、大小、修改时间等）
ls -l

# 列出文件并显示大小（人类可读格式）
ls -lh

# 按文件大小排序（从大到小）
ls -lhS

# 按修改时间排序（从新到旧）
ls -lht
```

### pwd - 显示当前工作目录
```bash
# 显示当前工作目录的绝对路径
pwd
```

### cd - 切换目录
```bash
# 切换到指定目录
cd /path/to/directory

# 切换到用户主目录
cd ~

# 切换到上一级目录
cd ..

# 切换到上一次的目录
cd -
```

### clear - 清屏
```bash
# 清除终端屏幕内容
clear
```

### echo - 输出文本
```bash
# 输出文本
 echo "Hello World"

# 输出变量值
 echo $HOME

# 输出多行文本
 echo -e "Line 1\nLine 2"
```

### history - 查看命令历史
```bash
# 查看最近执行的命令历史
history

# 查看最近10条命令历史
history 10

# 执行历史记录中的第n条命令
!n

# 执行上一条命令
!!

# 执行最近一次以command开头的命令
!command
```

### alias - 设置命令别名
```bash
# 设置临时别名（仅当前会话有效）
alias ll='ls -la'

# 查看所有别名
alias     

# 取消别名
unalias ll
```

### exit - 退出当前shell
```bash
# 退出当前shell
exit

# 退出当前shell并返回指定退出码
exit 0
```

### which - 查找命令的路径
```bash
# 查找命令的绝对路径
which ls

# 查找所有匹配的命令路径
which -a ls
```

## 文件操作

### touch - 创建文件或更新文件时间戳
```bash
# 创建一个空文件
touch filename.txt

# 同时创建多个文件
touch file1.txt file2.txt file3.txt

# 更新文件的访问时间和修改时间（不改变文件内容）
touch -a existing_file.txt
```

### cat - 查看或合并文件内容
```bash
# 查看文件内容
cat filename.txt

# 查看文件内容并显示行号
cat -n filename.txt

# 合并多个文件内容到一个新文件
cat file1.txt file2.txt > merged.txt

# 追加文件内容到已有文件
cat file1.txt >> existing_file.txt
```

### cp - 复制文件或目录
```bash
# 复制文件到指定位置
cp source.txt destination.txt

# 复制文件到指定目录
cp source.txt /path/to/directory/

# 复制目录（包括子目录）
cp -r source_directory/ destination_directory/

# 复制时保留文件属性（权限、时间等）
cp -p source.txt destination.txt

# 复制时提示是否覆盖
cp -i source.txt destination.txt
```

### mv - 移动或重命名文件/目录
```bash
# 重命名文件
mv oldname.txt newname.txt

# 移动文件到指定目录
mv file.txt /path/to/directory/

# 移动多个文件到指定目录
mv file1.txt file2.txt /path/to/directory/

# 移动目录
mv source_directory/ destination_directory/

# 移动时提示是否覆盖
mv -i oldname.txt newname.txt
```

### rm - 删除文件或目录
```bash
# 删除文件
rm filename.txt

# 删除多个文件
rm file1.txt file2.txt

# 删除目录（包括子目录和文件）
rm -r directory/

# 强制删除（不提示）
rm -f filename.txt

# 强制删除目录（不提示）
rm -rf directory/
```

### find - 查找文件或目录
```bash
# 在当前目录及其子目录中查找文件
find . -name "filename.txt"

# 在指定目录中查找文件
find /path/to/search -name "filename.txt"

# 查找指定类型的文件（f表示普通文件，d表示目录）
find . -type f -name "*.txt"

# 查找并删除匹配的文件
find . -name "*.tmp" -delete

# 查找指定大小的文件（+100M表示大于100MB，-10M表示小于10MB）
find . -type f -size +100M
```

### less - 分页查看文件内容
```bash
# 分页查看文件内容
less filename.txt

# 显示行号并分页查看
less -N filename.txt

# 搜索文本（输入/后跟随搜索词）
less filename.txt
```

### more - 分页查看文件内容
```bash
# 分页查看文件内容
more filename.txt
```

### head - 查看文件开头内容
```bash
# 查看文件前10行
head filename.txt

# 查看文件前20行
head -n 20 filename.txt
```

### tail - 查看文件末尾内容
```bash
# 查看文件后10行
tail filename.txt

# 查看文件后20行
tail -n 20 filename.txt

# 实时监控文件内容变化
tail -f logfile.txt
```

### stat - 查看文件或文件系统状态
```bash
# 查看文件状态信息
stat filename.txt
```

### ln - 创建链接
```bash
# 创建硬链接
ln source_file link_name

# 创建符号链接
ln -s source_file link_name

# 创建目录的符号链接
ln -s source_directory link_name
```

## 目录操作

### mkdir - 创建目录
```bash
# 创建一个目录
mkdir directory_name

# 同时创建多个目录
mkdir dir1 dir2 dir3

# 创建多级目录（包括父目录）
mkdir -p /path/to/multiple/directories
```

### rmdir - 删除空目录
```bash
# 删除空目录
rmdir directory_name

# 删除多个空目录
rmdir dir1 dir2 dir3

# 删除空目录及其子目录（必须都是空的）
rmdir -p /path/to/empty/directories
```

### du - 查看目录或文件大小
```bash
# 查看当前目录大小
du

# 查看指定目录大小
du /path/to/directory

# 查看目录大小（人类可读格式）
du -h

# 查看目录大小并显示总和
du -sh

# 查看目录下每个文件/目录的大小
du -sh *
```

### tree - 显示目录结构
```bash
# 以树状结构显示目录内容
tree

# 显示目录结构并包含隐藏文件
tree -a

# 显示目录结构并显示文件大小
tree -h

# 只显示指定深度的目录结构
tree -L 2
```

## 文本处理

### grep - 文本搜索工具
```bash
# 在文件中搜索指定文本
grep "search_text" filename.txt

# 忽略大小写搜索
grep -i "search_text" filename.txt

# 显示匹配行的行号
grep -n "search_text" filename.txt

# 显示不匹配的行
grep -v "search_text" filename.txt

# 搜索多个文件
grep "search_text" file1.txt file2.txt

# 在目录中递归搜索
grep -r "search_text" /path/to/directory/
```

### sed - 文本替换工具
```bash
# 替换文件中的文本（输出到终端，不修改原文件）
sed 's/old_text/new_text/' filename.txt

# 替换文件中的文本并修改原文件
sed -i 's/old_text/new_text/' filename.txt

# 全局替换（替换所有匹配项）
sed -i 's/old_text/new_text/g' filename.txt

# 替换指定行范围的文本
sed -i '1,10s/old_text/new_text/g' filename.txt
```

### awk - 文本分析工具
```bash
# 打印文件的第一列
awk '{print $1}' filename.txt

# 打印文件的第一和第三列
awk '{print $1, $3}' filename.txt

# 根据条件过滤行
awk '$3 > 100 {print}' filename.txt

# 计算列的总和
awk '{sum += $2} END {print sum}' filename.txt
```

### cut - 截取文本
```bash
# 截取文件中以空格分隔的第1列
cut -d' ' -f1 filename.txt

# 截取文件中以冒号分隔的第1-3列
cut -d':' -f1-3 /etc/passwd
```

### paste - 合并文件
```bash
# 合并两个文件的内容
paste file1.txt file2.txt

# 用逗号分隔合并文件内容
paste -d',' file1.txt file2.txt
```

### sort - 排序文本
```bash
# 对文件内容进行排序
sort filename.txt

# 按数值排序
sort -n filename.txt

# 反向排序
sort -r filename.txt

# 按第二列数值排序
sort -k2 -n filename.txt
```

### uniq - 去除重复行
```bash
# 去除连续重复行
uniq filename.txt

# 去除所有重复行（需要先排序）
sort filename.txt | uniq

# 统计每行出现次数
sort filename.txt | uniq -c
```

### wc - 统计文本
```bash
# 统计行数、单词数和字符数
wc filename.txt

# 只统计行数
wc -l filename.txt

# 只统计单词数
wc -w filename.txt

# 只统计字符数
wc -c filename.txt
```

### tr - 字符转换
```bash
# 将文本中的小写字母转换为大写字母
tr 'a-z' 'A-Z' < filename.txt

# 删除文本中的特定字符
tr -d '0-9' < filename.txt

# 将多个连续空格合并为一个空格
tr -s ' ' < filename.txt
```

### diff - 比较文件差异
```bash
# 比较两个文件的差异
diff file1.txt file2.txt

# 以并排格式显示差异
diff -y file1.txt file2.txt

# 生成补丁文件
diff -u file1.txt file2.txt > file.patch
```

### patch - 应用补丁
```bash
# 应用补丁文件
patch file1.txt < file.patch

# 撤销补丁
patch -R file1.txt < file.patch
```

### vim - 文本编辑器
```bash
# 启动vim编辑器
vim filename.txt

# 启动vim并显示行号
vim -n filename.txt

# 以只读模式打开文件
vim -R filename.txt

# 启动vim时不加载配置文件并设置行号
vim -nu NONE -c "set nu" filename.txt

# 启动vim并跳转到第10行
vim +10 filename.txt

# 比较两个文件（diff模式）
vim -d file1.txt file2.txt

# 编辑模式
# 在普通模式下按i进入插入模式（光标前）
# 在普通模式下按a进入插入模式（光标后）
# 在普通模式下按A进入插入模式（行末）
# 在普通模式下按o在当前行下方插入新行
# 在普通模式下按O在当前行上方插入新行
# 在普通模式下按I在行首插入
# 在普通模式下按R进入替换模式

# 可视模式
# 在普通模式下按v进入字符可视模式
# 在普通模式下按V进入行可视模式
# 在普通模式下按Ctrl+v进入块可视模式

# 保存并退出
# 在普通模式下按:wq

# 不保存退出
# 在普通模式下按:q!

# 保存文件
# 在普通模式下按:w

# 退出文件
# 在普通模式下按:q

# 搜索文本
# 在普通模式下按/然后输入搜索词，按回车
# 按n查找下一个匹配项，按N查找上一个匹配项
# 在普通模式下按?然后输入搜索词，按回车（反向搜索）

# 替换文本
# 在普通模式下按:%s/old_text/new_text/g替换所有匹配项
# 在普通模式下按:%s/old_text/new_text/gc替换所有匹配项并确认
# 在普通模式下按:1,10s/old_text/new_text/g替换第1到10行的匹配项

# 复制粘贴
# 在普通模式下按yy复制当前行
# 在普通模式下按y3y复制当前行和下面2行
# 在普通模式下按yw复制当前单词
# 在普通模式下按y$复制从当前位置到行末
# 在普通模式下按p粘贴到光标位置之后
# 在普通模式下按P粘贴到光标位置之前

# 删除文本
# 在普通模式下按dd删除当前行
# 在普通模式下按d3d删除当前行和下面2行
# 在普通模式下按dw删除当前单词
# 在普通模式下按d$删除从当前位置到行末
# 在普通模式下按x删除当前字符
# 在普通模式下按X删除前一个字符

# 撤销操作
# 在普通模式下按u

# 重做操作
# 在普通模式下按Ctrl+r

# 跳转到指定行
# 在普通模式下按:n（n为行号）
# 在普通模式下按G跳转到文件末尾
# 在普通模式下按gg跳转到文件开头
# 在普通模式下按0跳转到行首
# 在普通模式下按$跳转到行末

# 文本操作
# 在普通模式下按J合并当前行和下一行
# 在普通模式下按>>增加缩进
# 在普通模式下按<<减少缩进
# 在普通模式下按~切换大小写
# 在可视模式下按u转为小写
# 在可视模式下按U转为大写

# 窗口管理
# 水平分割窗口
:split filename.txt
:sp filename.txt

# 垂直分割窗口
:vsplit filename.txt
:vsp filename.txt

# 窗口导航
# 在普通模式下按Ctrl+w+h切换到左侧窗口
# 在普通模式下按Ctrl+w+j切换到下方窗口
# 在普通模式下按Ctrl+w+k切换到上方窗口
# 在普通模式下按Ctrl+w+l切换到右侧窗口
# 在普通模式下按Ctrl+w+w切换到下一个窗口

# 关闭窗口
:q
:close

# 调整窗口大小
# 在普通模式下按Ctrl+w+">"增加宽度
# 在普通模式下按Ctrl+w+"<"减少宽度
# 在普通模式下按Ctrl+w+">>"增加较多宽度
# 在普通模式下按Ctrl+w+"<<"减少较多宽度

# 标签页管理
# 新建标签页
:tabnew filename.txt

# 切换到下一个标签页
:tabn
# 在普通模式下按gt

# 切换到上一个标签页
:tabp
# 在普通模式下按gT

# 关闭当前标签页
:tabc

# 查看所有标签页
:tabs

# 配置命令
# 设置tab键为4个空格
:set ts=4
:set tabstop=4

# 设置自动缩进
:set ai
:set autoindent

# 设置智能缩进
:set si
:set smartindent

# 设置展开tab为空格
:set expandtab

# 设置行号
:set nu
:set number

# 设置相对行号
:set rnu
:set relativenumber

# 设置自动换行
:set wrap

# 高亮搜索结果
:set hlsearch

# 忽略大小写搜索
:set ignorecase
:set ic
```

## 进程管理

### top - 实时监控系统资源
```bash
# 查看实时系统资源使用情况
top

# 在top界面按P - 按CPU使用率排序
# 在top界面按M - 按内存使用率排序
# 在top界面按q - 退出top界面
```

### ps - 查看进程信息
```bash
# 查看当前用户的进程
ps

# 查看所有进程
ps aux

# 查看指定进程（通过进程名）
ps aux | grep "process_name"

# 查看进程树
ps -ef --forest
```

### kill - 终止进程
```bash
# 终止指定PID的进程
kill 1234

# 强制终止进程
kill -9 1234

# 发送SIGINT信号（相当于Ctrl+C）
kill -2 1234

# 发送SIGTERM信号（默认）
kill -15 1234
```

### pkill - 根据进程名终止进程
```bash
# 根据进程名终止进程
pkill process_name

# 强制终止进程
pkill -9 process_name

# 根据终端号终止进程
pkill -t pts/0
```

### killall - 根据进程名终止所有进程
```bash
# 根据进程名终止所有进程
killall process_name

# 强制终止所有进程
killall -9 process_name

# 等待进程终止
killall -w process_name
```

### nice - 调整进程优先级
```bash
# 以指定优先级启动进程
nice -n 10 command

# 调整正在运行的进程优先级
renice 10 -p 1234
```

## 系统信息

### df - 查看磁盘空间使用情况
```bash
# 查看磁盘空间使用情况
df

# 查看磁盘空间（人类可读格式）
df -h
```

### free - 查看内存使用情况
```bash
# 查看内存使用情况
free

# 查看内存使用情况（人类可读格式）
free -h
```

### date - 显示或设置系统时间
```bash
# 显示当前系统时间
date

# 显示当前时间的详细信息
date -R

# 设置系统时间
date -s "2025-12-30 14:30:00"
```

### uptime - 显示系统运行时间
```bash
# 显示系统运行时间和负载情况
uptime
```

### whoami - 显示当前用户
```bash
# 显示当前登录用户
whoami
```

### hostname - 显示或设置主机名
```bash
# 显示当前主机名
hostname

# 设置主机名
hostname new_hostname
```

### uname - 显示系统信息
```bash
# 显示系统内核名称
uname

# 显示详细系统信息
uname -a

# 显示内核版本
uname -r

# 显示硬件架构
uname -m
```

### lsof - 列出打开的文件
```bash
# 列出所有打开的文件
lsof

# 列出指定用户打开的文件
lsof -u username

# 列出指定端口打开的文件
lsof -i :80
```

### netstat - 网络状态统计
```bash
# 查看所有网络连接
netstat -a

# 查看TCP连接
netstat -t

# 查看UDP连接
netstat -u

# 查看监听状态的连接
netstat -l

# 查看网络连接和进程ID
netstat -p
```

### ss - 网络套接字统计
```bash
# 查看所有网络连接
ss -a

# 查看TCP连接
ss -t

# 查看UDP连接
ss -u

# 查看监听状态的连接
ss -l

# 查看网络连接和进程ID
ss -p
```

## 环境变量

### env - 查看环境变量
```bash
# 查看所有环境变量
env

# 查看指定环境变量
echo $PATH
echo $HOME
```

### export - 设置环境变量
```bash
# 设置临时环境变量（仅当前会话有效）
export VAR_NAME=value

# 设置带空格的环境变量
export VAR_NAME="value with spaces"

# 在环境变量中添加路径
export PATH=$PATH:/new/path

# 使环境变量对所有用户生效（需要写入配置文件）
# 在/etc/profile或/etc/environment中添加
export VAR_NAME=value
```

### set - 查看shell变量
```bash
# 查看所有shell变量（包括环境变量）
set
```

### unset - 删除环境变量
```bash
# 删除指定环境变量
unset VAR_NAME
```

### source - 加载环境变量配置
```bash
# 加载当前用户的bash配置
source ~/.bashrc

# 加载系统级bash配置
source /etc/bashrc

# 加载环境变量文件
source env_file
```

## 系统服务

### systemctl - systemd服务管理工具
```bash
# 启动服务
systemctl start service_name

# 停止服务
systemctl stop service_name

# 重启服务
systemctl restart service_name

# 重新加载服务配置
systemctl reload service_name

# 查看服务状态
systemctl status service_name

# 设置服务开机自启
systemctl enable service_name

# 禁用服务开机自启
systemctl disable service_name

# 查看服务是否开机自启
systemctl is-enabled service_name

# 查看所有正在运行的服务
systemctl list-units --type=service

# 查看所有服务（包括未运行的）
systemctl list-units --type=service --all

# 查看系统启动日志
systemctl status

# 重新加载systemd配置
systemctl daemon-reload
```

### service - SysVinit服务管理工具
```bash
# 启动服务
service service_name start

# 停止服务
service service_name stop

# 重启服务
service service_name restart

# 重新加载服务配置
service service_name reload

# 查看服务状态
service service_name status

# 查看所有服务状态
service --status-all
```

### journalctl - 系统日志管理
```bash
# 查看所有日志
journalctl

# 查看最近的日志
journalctl -n 100

# 实时查看日志
journalctl -f

# 查看特定服务的日志
journalctl -u service_name

# 查看今天的日志
journalctl --since today

# 查看指定时间范围的日志
journalctl --since "2025-12-30 14:00" --until "2025-12-30 15:00"
```

## 用户和权限

### chmod - 修改文件或目录权限
```bash
# 数字方式设置权限（所有者：rwx，组：r-x，其他：r-x）
chmod 755 filename.txt

# 数字方式设置权限（所有者：rw-，组：r--，其他：r--）
chmod 644 filename.txt

# 给所有者添加执行权限
chmod u+x filename.txt

# 移除组的写入权限
chmod g-w filename.txt

# 给其他用户设置只读权限
chmod o=r filename.txt

# 给所有用户添加执行权限
chmod a+x filename.txt
```

### chown - 修改文件或目录的所有者和组
```bash
# 修改所有者
chown username filename.txt

# 修改所有者和组
chown username:groupname filename.txt

# 递归修改目录及其内容的所有者
chown -R username directory/
```

### sudo - 以管理员权限执行命令
```bash
# 以管理员权限执行命令
sudo command

# 切换到root用户
sudo su

# 以指定用户身份执行命令
sudo -u username command
```

### chgrp - 修改文件或目录的所属组
```bash
# 修改文件的所属组
chgrp groupname filename.txt

# 递归修改目录及其内容的所属组
chgrp -R groupname directory/
```

### su - 切换用户
```bash
# 切换到root用户
su

# 切换到指定用户
su username

# 切换到指定用户并加载其环境变量
su - username
```

### id - 查看用户和组信息
```bash
# 查看当前用户的UID、GID和所属组
id

# 查看指定用户的信息
id username
```

### groups - 查看用户所属组
```bash
# 查看当前用户所属组
groups

# 查看指定用户所属组
groups username
```

### adduser - 添加用户（Debian/Ubuntu）
```bash
# 添加新用户
adduser username
```

### useradd - 添加用户（CentOS/RHEL）
```bash
# 添加新用户
useradd username

# 添加用户并指定主目录
useradd -d /home/username username

# 添加用户并指定用户组
useradd -g groupname username
```

### deluser - 删除用户（Debian/Ubuntu）
```bash
# 删除用户
deluser username

# 删除用户及其主目录
deluser --remove-home username
```

### userdel - 删除用户（CentOS/RHEL）
```bash
# 删除用户
userdel username

# 删除用户及其主目录
userdel -r username
```

### passwd - 设置用户密码
```bash
# 设置当前用户密码
passwd

# 设置指定用户密码
passwd username
```

### groupadd - 添加用户组
```bash
# 添加新用户组
groupadd groupname
```

### groupdel - 删除用户组
```bash
# 删除用户组
groupdel groupname
```

## 网络命令

### ping - 测试网络连接
```bash
# 测试与目标主机的网络连接
ping google.com

# 发送指定数量的ICMP包
ping -c 4 google.com

# 设置超时时间
ping -W 2 google.com
```

### ifconfig - 查看网络接口
```bash
# 查看网络接口信息
ifconfig

# 查看指定网络接口信息
ifconfig eth0
```

### ip - 网络配置工具
```bash
# 查看所有网络接口信息
ip addr
ip a

# 查看路由表
ip route
ip r

# 查看网络连接
ip link
```

### curl - 数据传输工具
```bash
# 下载网页内容到终端
curl https://www.google.com

# 下载文件
curl -O https://example.com/file.zip

# 下载文件并保存为指定名称
curl -o new_filename.zip https://example.com/file.zip

# 发送POST请求
curl -X POST -d "param1=value1&param2=value2" https://example.com/api

# 发送带有头信息的请求
curl -H "Content-Type: application/json" -d '{"key":"value"}' https://example.com/api
```

### wget - 下载工具
```bash
# 下载文件
wget https://example.com/file.zip

# 下载文件并保存为指定名称
wget -O new_filename.zip https://example.com/file.zip

# 递归下载整个网站
wget -r https://example.com/
```

### telnet - 远程登录
```bash
# 连接到远程主机的指定端口
telnet example.com 80
```

### ssh - 安全远程登录
```bash
# 连接到远程主机
ssh username@example.com

# 使用指定端口连接
ssh -p 2222 username@example.com

# 使用密钥文件连接
ssh -i /path/to/key.pem username@example.com
```

### scp - 安全文件传输
```bash
# 复制本地文件到远程主机
scp localfile.txt username@example.com:/remote/path/

# 复制远程文件到本地
scp username@example.com:/remote/file.txt /local/path/

# 递归复制目录
scp -r localdir/ username@example.com:/remote/path/
```

### rsync - 远程同步
```bash
# 同步本地目录到远程目录
rsync -avz localdir/ username@example.com:/remote/path/

# 同步远程目录到本地目录
rsync -avz username@example.com:/remote/path/ localdir/

# 同步时删除目标目录中不存在的文件
rsync -avz --delete localdir/ username@example.com:/remote/path/
```

## 定时任务

### crontab - 定时任务管理
```bash
# 查看当前用户的定时任务
crontab -l

# 编辑当前用户的定时任务
crontab -e

# 删除当前用户的所有定时任务
crontab -r

# 查看特定用户的定时任务
crontab -u username -l

# 编辑特定用户的定时任务
crontab -u username -e

# cron表达式格式：
# * * * * * command
# - - - - - -
# | | | | | |
# | | | | | +-- 命令
# | | | | +---- 星期几（0-7，0和7都表示周日）
# | | | +------ 月份（1-12）
# | | +-------- 日期（1-31）
# | +---------- 小时（0-23）
# +------------ 分钟（0-59）

# 示例：
# 每分钟执行一次
* * * * * command

# 每小时的第30分钟执行
30 * * * * command

# 每天的凌晨2点执行
0 2 * * * command

# 每周一的上午10点执行
0 10 * * 1 command

# 每月1号的上午9点执行
0 9 1 * * command

# 每5分钟执行一次
*/5 * * * * command

# 每天的上午8点到12点，每2小时执行一次
0 8-12/2 * * * command
```

### at - 一次性定时任务
```bash
# 在指定时间执行命令
at 14:30
at> command
at> Ctrl+D

# 在明天的14:30执行命令
at 14:30 tomorrow

# 在指定日期执行命令
at 14:30 2025-12-30

# 查看所有待执行的at任务
atq

# 删除指定的at任务
atrm job_id
```

## 压缩和解压缩

### tar - 归档工具
```bash
# 创建tar归档文件
tar -cvf archive.tar files/

# 查看tar归档文件内容
tar -tvf archive.tar

# 提取tar归档文件
tar -xvf archive.tar

# 创建gzip压缩的tar文件
tar -czvf archive.tar.gz files/

# 提取gzip压缩的tar文件
tar -xzvf archive.tar.gz

# 创建bzip2压缩的tar文件
tar -cjvf archive.tar.bz2 files/

# 提取bzip2压缩的tar文件
tar -xjvf archive.tar.bz2
```


## 磁盘管理

### fdisk - 磁盘分区工具
```bash
# 查看所有磁盘和分区
fdisk -l

# 对指定磁盘进行分区操作
fdisk /dev/sda

# 在fdisk交互模式下的常用命令：
# n - 创建新分区
# d - 删除分区
# p - 显示分区表
# t - 更改分区类型
# w - 保存更改并退出
# q - 不保存更改退出
```

### mkfs - 创建文件系统
```bash
# 创建ext4文件系统
mkfs.ext4 /dev/sda1

# 创建xfs文件系统
mkfs.xfs /dev/sda1

# 创建vfat文件系统
mkfs.vfat /dev/sda1
```

### mount - 挂载文件系统
```bash
# 挂载指定分区到目录
mount /dev/sda1 /mnt

# 挂载ISO镜像文件
mount -o loop image.iso /mnt

# 挂载Windows共享目录
mount -t cifs //server/share /mnt -o username=user,password=pass

# 查看所有挂载的文件系统
mount
```

### umount - 卸载文件系统
```bash
# 卸载指定挂载点
umount /mnt

# 卸载指定分区
umount /dev/sda1

# 强制卸载（当文件系统忙时）
umount -f /mnt

# 懒卸载（稍后卸载）
umount -l /mnt
```

### fsck - 文件系统检查
```bash
# 检查指定分区（必须先卸载）
fsck /dev/sda1

# 自动修复文件系统错误
fsck -y /dev/sda1

# 检查ext4文件系统
fsck.ext4 /dev/sda1
```

### blkid - 查看块设备信息
```bash
# 查看所有块设备的UUID和文件系统类型
blkid

# 查看指定设备的信息
blkid /dev/sda1
```

## 软件包管理

### apt - Debian/Ubuntu包管理工具
```bash
# 更新软件包列表
apt update

# 升级所有已安装的软件包
apt upgrade

# 安装指定软件包
apt install package_name

# 安装多个软件包
apt install package1 package2

# 卸载软件包
apt remove package_name

# 卸载软件包并删除配置文件
apt purge package_name

# 搜索软件包
apt search keyword

# 查看软件包详细信息
apt show package_name

# 清理无用的软件包
apt autoremove

# 清理缓存
apt clean
```

### yum - CentOS/RHEL 6.x包管理工具
```bash
# 更新软件包列表
yum check-update

# 升级所有已安装的软件包
yum update

# 安装指定软件包
yum install package_name

# 安装多个软件包
yum install package1 package2

# 卸载软件包
yum remove package_name

# 搜索软件包
yum search keyword

# 查看软件包详细信息
yum info package_name

# 清理无用的软件包
yum autoremove

# 清理缓存
yum clean all
```

### dnf - CentOS/RHEL 7+包管理工具
```bash
# 更新软件包列表
dnf check-update

# 升级所有已安装的软件包
dnf update

# 安装指定软件包
dnf install package_name

# 安装多个软件包
dnf install package1 package2

# 卸载软件包
dnf remove package_name

# 搜索软件包
dnf search keyword

# 查看软件包详细信息
dnf info package_name

# 清理无用的软件包
dnf autoremove

# 清理缓存
dnf clean all
```

### pacman - Arch Linux包管理工具
```bash
# 更新软件包列表和系统
pacman -Syu

# 安装指定软件包
pacman -S package_name

# 安装多个软件包
pacman -S package1 package2

# 卸载软件包
pacman -R package_name

# 卸载软件包并删除依赖
pacman -Rs package_name

# 搜索软件包
pacman -Ss keyword

# 查看软件包详细信息
pacman -Si package_name

# 清理缓存
pacman -Sc
```

## 常用快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + C` | 终止当前命令 |
| `Ctrl + D` | 退出当前shell |
| `Ctrl + Z` | 暂停当前命令（可通过fg恢复） |
| `Ctrl + A` | 光标移到行首 |
| `Ctrl + E` | 光标移到行尾 |
| `Ctrl + L` | 清屏 |
| `Tab` | 自动补全命令或文件名 |
| `Up/Down` | 查看命令历史 |
| `history` | 查看命令历史记录 |
| `!n` | 执行历史记录中第n条命令 |
| `!!` | 执行上一条命令 |
| `!command` | 执行最近一次以command开头的命令 |
