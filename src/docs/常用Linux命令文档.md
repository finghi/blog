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

### alias - 设置命令别名
```bash
# 设置临时别名（仅当前会话有效）
alias ll='ls -la'

# 查看所有别名
alias     

# 取消别名
unalias ll
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

### which - 查找命令的路径
```bash
# 查找命令的绝对路径
which ls

# 查找所有匹配的命令路径
which -a ls
```

### exit - 退出当前shell
```bash
# 退出当前shell
exit

# 退出当前shell并返回指定退出码
exit 0
```

### sudo - 以管理员身份执行命令
```bash
# 以管理员身份执行命令
sudo command

# 以管理员身份执行命令并保持环境变量
sudo -E command

# 以指定用户身份执行命令
sudo -u username command

# 切换到管理员身份
sudo su

# 查看sudo权限
sudo -l
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

### passwd - 修改密码
```bash
# 修改当前用户密码
passwd

# 修改指定用户密码（需要管理员权限）
passwd username

# 锁定用户账户（需要管理员权限）
passwd -l username

# 解锁用户账户（需要管理员权限）
passwd -u username
```

### chmod - 修改文件权限
```bash
# 给文件所有者添加执行权限
chmod +x filename.txt

# 给文件所有者、组和其他用户添加读权限
chmod +r filename.txt

# 给文件所有者添加读、写和执行权限，给组和其他用户添加读和执行权限
chmod 755 filename.txt

# 递归修改目录及其子目录和文件的权限
chmod -R 755 directory/
```

### chown - 修改文件所有者
```bash
# 修改文件所有者（需要管理员权限）
chown username filename.txt

# 修改文件所有者和所属组（需要管理员权限）
chown username:groupname filename.txt

# 递归修改目录及其子目录和文件的所有者（需要管理员权限）
chown -R username:groupname directory/
```

### chgrp - 修改文件所属组
```bash
# 修改文件所属组（需要管理员权限）
chgrp groupname filename.txt

# 递归修改目录及其子目录和文件的所属组（需要管理员权限）
chgrp -R groupname directory/
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

### ln - 创建链接
```bash
# 创建硬链接
ln source_file link_name

# 创建符号链接
ln -s source_file link_name

# 创建目录的符号链接
ln -s source_directory link_name
```

### stat - 查看文件或文件系统状态
```bash
# 查看文件状态信息
stat filename.txt
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

### more - 分页查看文件内容
```bash
# 分页查看文件内容
more filename.txt
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

### file - 查看文件类型
```bash
# 查看文件类型
file filename.txt

# 查看文件类型（不显示文件名）
file -b filename.txt

# 递归查看目录下所有文件的类型
file directory/*
```

### md5sum - 计算文件MD5哈希值
```bash
# 计算文件MD5哈希值
md5sum filename.txt

# 计算多个文件的MD5哈希值
md5sum file1.txt file2.txt

# 计算文件MD5哈希值并保存到文件
md5sum filename.txt > filename.md5

# 验证文件MD5哈希值
md5sum -c filename.md5
```

### sha256sum - 计算文件SHA256哈希值
```bash
# 计算文件SHA256哈希值
sha256sum filename.txt

# 计算多个文件的SHA256哈希值
sha256sum file1.txt file2.txt

# 计算文件SHA256哈希值并保存到文件
sha256sum filename.txt > filename.sha256

# 验证文件SHA256哈希值
sha256sum -c filename.sha256
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

### locate - 快速查找文件
```bash
# 快速查找文件
locate filename.txt

# 忽略大小写查找文件
locate -i filename.txt

# 只显示前10个匹配结果
locate -n 10 filename.txt

# 显示匹配结果的数量
locate -c filename.txt
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

## 文本处理

### xargs - 将标准输入转换为命令行参数
```bash
# 将当前目录下的所有.txt文件复制到指定目录
ls *.txt | xargs cp -t /path/to/directory/

# 删除当前目录下的所有.txt文件
ls *.txt | xargs rm

# 查找当前目录下的所有.txt文件并显示它们的内容
find . -name "*.txt" | xargs cat

# 将标准输入中的每行作为一个参数传递给命令
echo -e "file1.txt\nfile2.txt\nfile3.txt" | xargs rm
```

### tee - 读取标准输入并写入到文件和标准输出
```bash
# 将命令输出写入到文件并显示在终端
command | tee output.txt

# 将命令输出追加到文件并显示在终端
command | tee -a output.txt

# 将命令输出写入到多个文件并显示在终端
command | tee output1.txt output2.txt output3.txt

# 将命令输出写入到文件但不显示在终端
command | tee output.txt > /dev/null
```

## 编辑器

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

### lsof - 根据端口查找进程
```bash
# 根据端口查找进程
lsof -i :8080

# 查找所有监听端口的进程
lsof -i

# 查找指定协议的进程
lsof -i tcp:8080

# 查找指定用户的进程
lsof -u username

# 查找指定进程打开的文件
lsof -p 1234
```

### nohup - 在后台执行命令，即使终端关闭
```bash
# 在后台执行命令，即使终端关闭
nohup command &

# 在后台执行命令，即使终端关闭，并将输出写入到指定文件
nohup command > output.log 2>&1 &

# 查看后台执行的命令
jobs

# 将后台执行的命令切换到前台
fg job_number

# 将前台执行的命令切换到后台
Ctrl+z
bg job_number
```

### screen - 多窗口终端管理器
```bash
# 创建新的screen会话
screen

# 创建新的screen会话并指定名称
screen -S session_name

# 列出所有screen会话
screen -ls

# 连接到指定的screen会话
screen -r session_name

# 断开当前screen会话
Ctrl+a d

# 关闭当前screen会话
exit

# 在screen会话中创建新窗口
Ctrl+a c

# 在screen会话中切换窗口
Ctrl+a n
Ctrl+a p

# 在screen会话中查看所有窗口
Ctrl+a "

# 在screen会话中关闭当前窗口
Ctrl+a k
```

### tmux - 终端复用器
```bash
# 创建新的tmux会话
tmux

# 创建新的tmux会话并指定名称
tmux new -s session_name

# 列出所有tmux会话
tmux ls

# 连接到指定的tmux会话
tmux attach -t session_name

# 断开当前tmux会话
Ctrl+b d

# 关闭当前tmux会话
exit

# 在tmux会话中创建新窗口
Ctrl+b c

# 在tmux会话中切换窗口
Ctrl+b n
Ctrl+b p

# 在tmux会话中查看所有窗口
Ctrl+b w

# 在tmux会话中关闭当前窗口
Ctrl+b &

# 在tmux会话中水平分割窗口
Ctrl+b %

# 在tmux会话中垂直分割窗口
Ctrl+b "

# 在tmux会话中切换窗格
Ctrl+b arrow_keys

# 在tmux会话中关闭当前窗格
Ctrl+b x
```

## 系统信息

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
```

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

### date - 查看或设置系统时间
```bash
# 查看当前系统时间
date

# 查看当前系统时间（指定格式）
date +"%Y-%m-%d %H:%M:%S"

# 设置系统时间（需要管理员权限）
date -s "2025-12-30 12:00:00"

# 查看当前系统时间的Unix时间戳
date +%s

# 将Unix时间戳转换为系统时间
date -d @1735689600
```

### cal - 显示日历
```bash
# 显示当前月份的日历
cal

# 显示指定年份的日历
cal 2025

# 显示指定月份和年份的日历
cal 12 2025

# 显示当前月份的日历并突出显示今天
cal -h

# 显示当前月份的日历并显示周数
cal -w
```

### w - 显示当前登录用户和他们正在执行的命令
```bash
# 显示当前登录用户和他们正在执行的命令
w

# 显示当前登录用户（不显示他们正在执行的命令）
w -h

# 显示指定用户的信息
w username
```

### last - 查看用户登录历史
```bash
# 查看用户登录历史
last

# 查看指定用户的登录历史
last username

# 查看用户登录历史（只显示前10条）
last -n 10

# 查看用户登录历史（显示IP地址）
last -i
```

### who - 显示当前登录用户
```bash
# 显示当前登录用户
who

# 显示当前登录用户（包括IP地址）
who -i

# 显示当前登录用户的详细信息
who -a
```

## 压缩与解压

### tar - 归档工具
```bash
# 创建归档文件
 tar -cvf archive.tar file1 file2 directory/

# 查看归档文件内容
 tar -tvf archive.tar

# 提取归档文件
 tar -xvf archive.tar

# 创建gzip压缩的归档文件
 tar -czvf archive.tar.gz file1 file2 directory/

# 提取gzip压缩的归档文件
 tar -xzvf archive.tar.gz

# 创建bzip2压缩的归档文件
 tar -cjvf archive.tar.bz2 file1 file2 directory/

# 提取bzip2压缩的归档文件
 tar -xjvf archive.tar.bz2

# 创建xz压缩的归档文件
 tar -cJvf archive.tar.xz file1 file2 directory/

# 提取xz压缩的归档文件
 tar -xJvf archive.tar.xz
```

### gzip - 压缩工具
```bash
# 压缩文件
 gzip file.txt

# 解压文件
 gzip -d file.txt.gz

# 查看压缩文件内容
 gzip -l file.txt.gz

# 保留原文件并压缩
 gzip -c file.txt > file.txt.gz
```

### bzip2 - 压缩工具（比gzip压缩率更高）
```bash
# 压缩文件
 bzip2 file.txt

# 解压文件
 bzip2 -d file.txt.bz2

# 查看压缩文件内容
 bzip2 -t file.txt.bz2

# 保留原文件并压缩
 bzip2 -c file.txt > file.txt.bz2
```

### zip/unzip - 跨平台压缩工具
```bash
# 创建zip压缩文件
 zip archive.zip file1 file2 directory/

# 查看zip文件内容
 zip -l archive.zip

# 加密zip文件
 zip -e archive.zip file1 file2

# 解压zip文件
 unzip archive.zip

# 解压到指定目录
 unzip archive.zip -d /path/to/directory

# 静默解压
 unzip -q archive.zip
```

## 磁盘管理

### fdisk - 磁盘分区工具
```bash
# 查看所有磁盘和分区
 fdisk -l

# 对指定磁盘进行分区操作
 fdisk /dev/sda

# 在fdisk交互模式中的常用命令：
# n - 创建新分区
# d - 删除分区
# p - 显示分区表
# t - 更改分区类型
# w - 保存更改并退出
# q - 放弃更改并退出
```

### mkfs - 创建文件系统
```bash
# 在分区上创建ext4文件系统
 mkfs.ext4 /dev/sda1

# 在分区上创建xfs文件系统
 mkfs.xfs /dev/sda1

# 在分区上创建fat32文件系统
 mkfs.vfat /dev/sda1

# 快速格式化（不检查坏块）
 mkfs.ext4 -F /dev/sda1
```

### mount - 挂载文件系统
```bash
# 挂载分区到指定目录
 mount /dev/sda1 /mnt

# 挂载ISO文件
 mount -o loop /path/to/image.iso /mnt

# 挂载NFS共享
 mount -t nfs server:/share /mnt

# 挂载Windows共享
 mount -t cifs //server/share /mnt -o username=user,password=pass

# 以只读方式挂载
 mount -o ro /dev/sda1 /mnt
```

### umount - 卸载文件系统
```bash
# 卸载指定挂载点
 umount /mnt

# 卸载指定设备
 umount /dev/sda1

# 强制卸载（谨慎使用）
 umount -f /mnt

# 延迟卸载（当文件系统不再被使用时）
 umount -l /mnt
```

### fsck - 文件系统检查
```bash
# 检查文件系统（未挂载状态）
fsck /dev/sda1

# 自动修复文件系统错误
fsck -y /dev/sda1

# 详细检查并显示进度
fsck -v /dev/sda1

# 检查ext4文件系统
fsck.ext4 /dev/sda1
```

### dd - 转换和复制文件
```bash
# 将文件复制到另一个文件
dd if=input_file of=output_file

# 将文件复制到另一个文件并指定块大小
dd if=input_file of=output_file bs=4k

# 创建一个大小为1GB的空文件
dd if=/dev/zero of=empty_file bs=1M count=1000

# 创建一个大小为1GB的随机文件
dd if=/dev/urandom of=random_file bs=1M count=1000

# 将ISO文件写入到USB设备（需要管理员权限）
dd if=image.iso of=/dev/sdb bs=4k status=progress
```

### rsync - 远程同步文件
```bash
# 同步本地文件到远程服务器
rsync -avz local_file username@remote_host:/path/to/directory/

# 同步远程服务器文件到本地
rsync -avz username@remote_host:/path/to/remote_file /path/to/local_directory/

# 同步本地目录到远程服务器
rsync -avz local_directory/ username@remote_host:/path/to/remote_directory/

# 同步远程服务器目录到本地
rsync -avz username@remote_host:/path/to/remote_directory/ /path/to/local_directory/

# 同步文件并删除目标目录中不存在的文件
rsync -avz --delete local_directory/ username@remote_host:/path/to/remote_directory/
```

### sync - 将内存中的数据写入磁盘
```bash
# 将内存中的数据写入磁盘
sync

# 将内存中的数据写入磁盘并显示进度
sync -f
```

## 包管理

### apt - Debian/Ubuntu包管理工具
```bash
# 更新包索引
 apt update

# 升级所有已安装的包
 apt upgrade

# 升级系统（包括内核）
 apt full-upgrade

# 安装包
 apt install package_name

# 安装多个包
 apt install package1 package2

# 卸载包（保留配置文件）
 apt remove package_name

# 卸载包（删除配置文件）
 apt purge package_name

# 搜索包
 apt search package_name

# 查看包信息
 apt show package_name

# 清理缓存
 apt clean

# 自动移除不需要的依赖
 apt autoremove
```

### yum - CentOS/RHEL 7包管理工具
```bash
# 更新所有包
 yum update

# 安装包
 yum install package_name

# 安装多个包
 yum install package1 package2

# 卸载包
 yum remove package_name

# 搜索包
 yum search package_name

# 查看包信息
 yum info package_name

# 列出已安装的包
 yum list installed

# 清理缓存
 yum clean all

# 自动移除不需要的依赖
 yum autoremove
```

### dnf - CentOS/RHEL 8+包管理工具（yum的替代品）
```bash
# 更新所有包
 dnf update

# 安装包
 dnf install package_name

# 安装多个包
 dnf install package1 package2

# 卸载包
 dnf remove package_name

# 搜索包
 dnf search package_name

# 查看包信息
 dnf info package_name

# 列出已安装的包
 dnf list installed

# 清理缓存
 dnf clean all

# 自动移除不需要的依赖
 dnf autoremove

# 查看包的依赖关系
 dnf deplist package_name
```

### rpm -  RPM包管理工具
```bash
# 安装RPM包
rpm -ivh package.rpm

# 升级RPM包
rpm -Uvh package.rpm

# 卸载RPM包
rpm -e package_name

# 查看已安装的包
rpm -qa

# 查看包信息
rpm -qi package_name

# 查看包包含的文件
rpm -ql package_name

# 检查包的依赖关系
rpm -qR package_name
```

### dpkg - Debian包管理工具
```bash
# 安装Deb包（需要管理员权限）
dpkg -i package.deb

# 卸载Deb包（需要管理员权限）
dpkg -r package_name

# 完全卸载Deb包（需要管理员权限）
dpkg -P package_name

# 查看已安装的包
dpkg -l

# 查看包信息
dpkg -s package_name

# 查看包包含的文件
dpkg -L package_name

# 检查包的依赖关系
dpkg -I package.deb
```

### snap - 跨平台包管理工具
```bash
# 安装Snap包
snap install package_name

# 升级Snap包
snap refresh package_name

# 卸载Snap包
snap remove package_name

# 查看已安装的Snap包
snap list

# 查看Snap包信息
snap info package_name

# 查看Snap包的配置
snap get package_name

# 设置Snap包的配置
snap set package_name key=value
```

### flatpak - 跨平台包管理工具
```bash
# 安装Flatpak包
flatpak install package_name

# 升级Flatpak包
flatpak update package_name

# 卸载Flatpak包
flatpak uninstall package_name

# 查看已安装的Flatpak包
flatpak list

# 查看Flatpak包信息
flatpak info package_name

# 运行Flatpak包
flatpak run package_name

# 添加Flatpak仓库
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
```

## 网络命令

### ping - 测试网络连接
```bash
# 测试网络连接
 ping 192.168.1.1

# 测试域名解析
 ping google.com
```

### netstat - 查看网络状态和端口
```bash
# 查看所有监听端口
netstat -tuln

# 查看所有网络连接
netstat -ant

# 根据端口查找进程
netstat -tuln | grep 8080

# 查看端口对应的进程
netstat -tulnp | grep 8080
```

### ss - 查看网络状态（netstat 的替代工具）
```bash
# 查看所有监听端口
ss -tuln

# 根据端口查找进程
ss -tuln | grep 8080

# 查看详细的网络连接信息
ss -ant

# 查看指定端口的进程
ss -tulnp | grep 8080
```

### curl - 发送HTTP请求
```bash
# 发送HTTP GET请求并显示响应
curl https://example.com

# 发送HTTP GET请求并将响应保存到文件
curl https://example.com > response.html

# 发送HTTP POST请求并发送数据
curl -X POST -d "username=user&password=pass" https://example.com/login

# 发送HTTP请求并设置请求头
curl -H "Content-Type: application/json" -d '{"key": "value"}' https://example.com/api

# 发送HTTP请求并跟随重定向
curl -L https://example.com

# 发送HTTP请求并显示请求和响应头
curl -v https://example.com
```

### wget - 下载文件
```bash
# 下载文件
wget https://example.com/file.txt

# 下载文件并指定保存文件名
wget -O new_filename.txt https://example.com/file.txt

# 断点续传下载文件
wget -c https://example.com/large_file.iso

# 递归下载网站
wget -r https://example.com

# 下载文件并限制下载速度
wget --limit-rate=100k https://example.com/large_file.iso
```

### scp - 远程复制文件
```bash
# 将本地文件复制到远程服务器
scp local_file username@remote_host:/path/to/directory/

# 将远程服务器文件复制到本地
scp username@remote_host:/path/to/remote_file /path/to/local_directory/

# 将本地目录复制到远程服务器
scp -r local_directory/ username@remote_host:/path/to/remote_directory/

# 将远程服务器目录复制到本地
scp -r username@remote_host:/path/to/remote_directory/ /path/to/local_directory/

# 复制文件并指定端口
scp -P 2222 local_file username@remote_host:/path/to/directory/
```

### ssh - 远程登录
```bash
# 远程登录到服务器
ssh username@remote_host

# 远程登录到服务器并指定端口
ssh -p 2222 username@remote_host

# 远程登录到服务器并执行命令
ssh username@remote_host "command"

# 远程登录到服务器并执行多个命令
ssh username@remote_host "command1; command2; command3"

# 远程登录到服务器并转发端口
ssh -L 8080:localhost:80 username@remote_host

# 远程登录到服务器并反向转发端口
ssh -R 8080:localhost:80 username@remote_host
```

### traceroute - 跟踪数据包的传输路径
```bash
# 跟踪数据包的传输路径
traceroute example.com

# 跟踪数据包的传输路径并指定最大跳数
traceroute -m 20 example.com

# 跟踪数据包的传输路径并指定数据包大小
traceroute -s 100 example.com

# 跟踪数据包的传输路径并使用ICMP协议
traceroute -I example.com
```

### mtr - 结合ping和traceroute的工具
```bash
# 跟踪数据包的传输路径并显示每个节点的丢包率
mtr example.com

# 跟踪数据包的传输路径并指定最大跳数
mtr -m 20 example.com

# 跟踪数据包的传输路径并指定数据包大小
mtr -s 100 example.com

# 跟踪数据包的传输路径并使用ICMP协议
mtr --icmp example.com

# 跟踪数据包的传输路径并将结果保存到文件
mtr -r example.com > mtr_result.txt
```

# 指定发送数据包数量
 ping -c 5 192.168.1.1

# 指定数据包大小
 ping -s 1000 192.168.1.1

# 禁用DNS解析
 ping -n 192.168.1.1

# 持续ping直到被中断
 ping 192.168.1.1
```

### traceroute - 跟踪网络路由
```bash
# 跟踪网络路由
 traceroute google.com

# 使用ICMP协议
 traceroute -I google.com

# 使用TCP协议
 traceroute -T -p 80 google.com

# 设置最大跳数
 traceroute -m 20 google.com

# 禁用DNS解析
 traceroute -n google.com
```

### curl - 网络请求工具
```bash
# 发送GET请求
 curl https://api.example.com

# 发送POST请求
 curl -X POST -d "key=value" https://api.example.com

# 发送JSON数据
 curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' https://api.example.com

# 下载文件
 curl -o filename.txt https://example.com/file.txt

# 断点续传
 curl -C - -o filename.txt https://example.com/file.txt

# 跟随重定向
 curl -L https://example.com

# 添加请求头
 curl -H "Authorization: Bearer token" https://api.example.com

# 显示详细信息
 curl -v https://example.com
```

### wget - 网络下载工具
```bash
# 下载文件
 wget https://example.com/file.txt

# 下载并指定文件名
 wget -O filename.txt https://example.com/file.txt

# 断点续传
 wget -c https://example.com/largefile.zip

# 批量下载
 wget -i urls.txt

# 后台下载
 wget -b https://example.com/largefile.zip

# 限速下载
 wget --limit-rate=100k https://example.com/largefile.zip

# 递归下载整个网站
 wget -r -np https://example.com/docs/

# 下载时排除指定文件
 wget --reject=gif https://example.com/
```

### ifconfig - 查看网络接口信息（旧版）
```bash
# 查看所有网络接口
 ifconfig

# 查看指定网络接口
 ifconfig eth0

# 启用网络接口
 ifconfig eth0 up

# 禁用网络接口
 ifconfig eth0 down

# 配置IP地址
 ifconfig eth0 192.168.1.100 netmask 255.255.255.0
```

### ip - 查看网络接口信息（新版）
```bash
# 查看所有网络接口
 ip addr

# 查看指定网络接口
 ip addr show eth0

# 启用网络接口
 ip link set eth0 up

# 禁用网络接口
 ip link set eth0 down

# 配置IP地址
 ip addr add 192.168.1.100/24 dev eth0

# 删除IP地址
 ip addr del 192.168.1.100/24 dev eth0

# 查看路由表
 ip route

# 添加路由
 ip route add 10.0.0.0/24 via 192.168.1.1

# 删除路由
 ip route del 10.0.0.0/24
```

## 用户与权限管理

### useradd - 创建用户
```bash
# 创建新用户
 useradd username

# 创建用户并指定主目录
 useradd -d /home/username username

# 创建用户并指定登录shell
 useradd -s /bin/bash username

# 创建用户并指定用户组
 useradd -g groupname username

# 创建用户并指定多个附加组
 useradd -G group1,group2 username

# 创建系统用户
 useradd -r username
```

### usermod - 修改用户属性
```bash
# 修改用户主目录
 usermod -d /new/home/dir username

# 修改用户登录shell
 usermod -s /bin/zsh username

# 修改用户名
 usermod -l newusername oldusername

# 修改用户所属的主要组
 usermod -g groupname username

# 添加用户到附加组
 usermod -aG groupname username

# 锁定用户账户
 usermod -L username

# 解锁用户账户
 usermod -U username
```

### userdel - 删除用户
```bash
# 删除用户
 userdel username

# 删除用户及其主目录
 userdel -r username
```

### passwd - 修改密码
```bash
# 修改当前用户密码
 passwd

# 修改指定用户密码
 passwd username

# 锁定用户密码
 passwd -l username

# 解锁用户密码
 passwd -u username

# 强制用户下次登录时修改密码
 passwd -e username

# 查看用户密码状态
 passwd -S username
```

### groupadd - 创建用户组
```bash
# 创建新用户组
 groupadd groupname

# 创建系统用户组
 groupadd -r groupname

# 创建用户组并指定GID
 groupadd -g 1000 groupname
```

### groupmod - 修改用户组属性
```bash
# 修改用户组名称
 groupmod -n newgroupname oldgroupname

# 修改用户组GID
 groupmod -g 1001 groupname
```

### groupdel - 删除用户组
```bash
# 删除用户组
 groupdel groupname
```

### chmod - 修改文件权限
```bash
# 使用数字方式修改权限
 chmod 755 filename.txt

# 使用符号方式修改权限
 chmod u+rwx,g+rx,o+rx filename.txt

# 添加执行权限
 chmod +x filename.sh

# 递归修改目录及其内容的权限
 chmod -R 755 directory/

# 设置SUID权限
 chmod u+s filename

# 设置SGID权限
 chmod g+s directory/

# 设置粘性位
 chmod +t directory/
```

### chown - 修改文件所有者和所属组
```bash
# 修改文件所有者
 chown username filename.txt

# 修改文件所有者和所属组
 chown username:groupname filename.txt

# 递归修改目录及其内容的所有者
 chown -R username directory/

# 只修改文件所属组
 chown :groupname filename.txt
```

### chgrp - 修改文件所属组
```bash
# 修改文件所属组
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

# 切换用户并执行指定命令
 su -c "command" username

# 切换用户并加载用户环境变量
 su - username
```

### sudo - 以其他用户身份执行命令
```bash
# 以root身份执行命令
 sudo command

# 以指定用户身份执行命令
 sudo -u username command

# 编辑文件
 sudoedit filename.txt

# 查看sudo权限
 sudo -l
```

## 系统服务管理

### systemctl - 系统服务管理（systemd）
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

# 启用服务（开机自启）
 systemctl enable service_name

# 禁用服务（禁止开机自启）
 systemctl disable service_name

# 查看服务是否启用
 systemctl is-enabled service_name

# 查看所有运行中的服务
 systemctl list-units --type=service --state=running

# 查看所有服务（包括未运行的）
 systemctl list-units --type=service

# 查看服务依赖关系
 systemctl list-dependencies service_name

# 查看服务的启动日志
 journalctl -u service_name
```

### service - 系统服务管理（SysV）
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
```

### systemd-analyze - 系统启动分析
```bash
# 查看系统启动时间
 systemd-analyze

# 查看启动项的详细耗时
 systemd-analyze blame

# 生成启动依赖图
 systemd-analyze plot > boot.svg

# 查看系统启动关键路径
 systemd-analyze critical-chain
```

### init - 系统初始化进程
```bash
# 切换运行级别（已被systemctl替代）
 init 3

# 关机
 init 0

# 重启
 init 6
```

## 时间日期管理

### date - 显示或设置系统时间
```bash
# 显示当前系统时间
 date

# 以指定格式显示时间
 date +"%Y-%m-%d %H:%M:%S"

# 显示UTC时间
 date -u

# 设置系统时间
 date -s "2024-01-30 12:00:00"

# 显示时间戳
 date +%s

# 根据时间戳显示时间
 date -d @1609459200

# 显示明天的日期
 date -d tomorrow

# 显示昨天的日期
 date -d yesterday

# 显示一周后的日期
 date -d "+7 days"
```

### timedatectl - 时间和日期管理
```bash
# 查看系统时间和日期状态
 timedatectl

# 设置系统时区
 timedatectl set-timezone Asia/Shanghai

# 查看所有可用时区
 timedatectl list-timezones

# 启用NTP时间同步
 timedatectl set-ntp true

# 禁用NTP时间同步
 timedatectl set-ntp false

# 设置系统时间
 timedatectl set-time "2024-01-30 12:00:00"

# 设置系统日期
 timedatectl set-time "2024-01-30"

# 设置系统时间（仅时间部分）
 timedatectl set-time "12:00:00"
```

### hwclock - 硬件时钟管理
```bash
# 查看硬件时钟
 hwclock

# 将系统时间同步到硬件时钟
 hwclock --systohc

# 将硬件时钟同步到系统时间
 hwclock --hctosys

# 以UTC格式查看硬件时钟
 hwclock --utc

# 以本地时间格式查看硬件时钟
 hwclock --localtime
```

## 进程调度管理

### cron - 定时任务调度
```bash
# 编辑当前用户的crontab
 crontab -e

# 查看当前用户的crontab
 crontab -l

# 删除当前用户的crontab
 crontab -r

# 查看系统级别的cron文件
 ls /etc/cron.*

# 查看cron服务状态
 systemctl status cron

# 启动cron服务
 systemctl start cron

# 启用cron服务（开机自启）
 systemctl enable cron

# crontab格式：
# 分钟 小时 日 月 星期 命令
# 0-59 0-23 1-31 1-12 0-6 command
# 示例：每天凌晨1点执行备份
# 0 1 * * * /path/to/backup.sh
# 示例：每小时执行一次命令
# 0 * * * * /path/to/command.sh
# 示例：每周日上午10点执行命令
# 0 10 * * 0 /path/to/command.sh
```

### at - 一次性任务调度
```bash
# 创建一次性任务（交互式）
 at 12:00
> /path/to/command.sh
> Ctrl+D

# 创建一次性任务（从文件读取）
 at 12:00 < task.txt

# 创建一次性任务（从标准输入读取）
 echo "/path/to/command.sh" | at 12:00

# 查看待执行的at任务
 atq

# 删除指定的at任务
 atrm 1

# 查看at服务状态
 systemctl status atd

# 启动at服务
 systemctl start atd

# 启用at服务（开机自启）
 systemctl enable atd
```

### anacron - 非连续运行的定时任务
```bash
# 查看anacron配置
 cat /etc/anacrontab

# 查看anacron状态
 systemctl status anacron

# 启动anacron服务
 systemctl start anacron

# 启用anacron服务（开机自启）
 systemctl enable anacron
```

## 日志管理

### journalctl - 系统日志管理
```bash
# 查看所有系统日志
 journalctl

# 查看最近的日志
 journalctl -n 100

# 实时查看日志
 journalctl -f

# 查看指定服务的日志
 journalctl -u service_name

# 查看指定时间段的日志
 journalctl --since "2024-01-30 00:00:00" --until "2024-01-30 23:59:59"

# 查看错误日志
 journalctl -p err

# 查看引导日志
 journalctl -b

# 查看上一次引导的日志
 journalctl -b -1

# 以JSON格式输出日志
 journalctl -o json
```

### tail - 查看文件末尾内容（常用于日志）
```bash
# 查看文件末尾10行
 tail filename.log

# 查看文件末尾50行
 tail -n 50 filename.log

# 实时查看文件内容（日志监控）
 tail -f filename.log

# 实时查看文件内容并显示时间戳
 tail -F --timestamp=iso filename.log

# 查看多个日志文件
 tail -f file1.log file2.log
```

### head - 查看文件开头内容
```bash
# 查看文件开头10行
 head filename.log

# 查看文件开头50行
 head -n 50 filename.log
```

### grep - 搜索日志内容
```bash
# 在日志文件中搜索关键词
 grep "error" filename.log

# 忽略大小写搜索
 grep -i "error" filename.log

# 显示匹配行的前后上下文
 grep -A 5 -B 5 "error" filename.log

# 递归搜索目录中的日志文件
 grep -r "error" /var/log/

# 统计匹配次数
 grep -c "error" filename.log
```

### logrotate - 日志轮转管理
```bash
# 查看logrotate配置
 cat /etc/logrotate.conf

# 查看应用特定的logrotate配置
 ls /etc/logrotate.d/

# 手动执行logrotate
 logrotate /etc/logrotate.conf

# # 强制执行logrotate
 logrotate -f /etc/logrotate.conf

# # 测试logrotate配置
 logrotate -d /etc/logrotate.conf
```

# 安装多个软件包
apt install package1 package2 package3

# 卸载指定软件包
apt remove package_name

# 卸载指定软件包并删除配置文件
apt purge package_name

# 搜索软件包
apt search package_name

# 查看软件包信息
apt show package_name

# 清理缓存
apt clean

# 自动移除不需要的依赖
apt autoremove
```

### yum - CentOS/RHEL 7包管理
```bash
# 安装指定软件包
yum install package_name

# 升级所有已安装的软件包
yum update

# 升级指定软件包
yum update package_name

# 卸载指定软件包
yum remove package_name

# 搜索软件包
yum search package_name

# 查看软件包信息
yum info package_name

# 列出已安装的软件包
yum list installed

# 清理缓存
yum clean all
```

### dnf - CentOS/RHEL 8+包管理
```bash
# 安装指定软件包
dnf install package_name

# 升级所有已安装的软件包
dnf update

# 升级指定软件包
dnf update package_name

# 卸载指定软件包
dnf remove package_name

# 搜索软件包
dnf search package_name

# 查看软件包信息
dnf info package_name

# 列出已安装的软件包
dnf list installed

# 清理缓存
dnf clean all
```

## 其他实用命令

### screen - 终端会话管理
```bash
# 安装screen
sudo apt install screen  # Ubuntu/Debian
sudo yum install screen  # CentOS/RHEL

# 创建新的screen会话
screen -S session_name

# 列出所有screen会话
screen -ls

# 重新连接到指定screen会话
screen -r session_name

# 分离当前screen会话（按Ctrl+a+d）

# 终止screen会话
screen -S session_name -X quit
```

### tmux - 终端复用器
```bash
# 安装tmux
sudo apt install tmux  # Ubuntu/Debian
sudo yum install tmux  # CentOS/RHEL

# 创建新的tmux会话
tmux new -s session_name

# 列出所有tmux会话
tmux ls

# 重新连接到指定tmux会话
tmux attach -t session_name

# 分离当前tmux会话（按Ctrl+b+d）

# 终止tmux会话
tmux kill-session -t session_name

# 垂直分割窗口（按Ctrl+b+%）

# 水平分割窗口（按Ctrl+b+"）

# 在窗口间切换（按Ctrl+b+方向键）
```

### watch - 重复执行命令
```bash
# 每2秒执行一次命令
watch command

# 每1秒执行一次命令
watch -n 1 command

# 高亮显示变化的部分
watch -d command

# 示例：实时查看内存使用情况
watch -n 1 free -h

# 示例：实时查看磁盘使用情况
watch -n 1 df -h
```

### xargs - 命令参数处理
```bash
# 将管道输出作为命令参数
find . -name "*.txt" | xargs ls -l

# 将管道输出作为命令参数（每个参数一行）
find . -name "*.txt" | xargs -L 1 cat

# 并行执行命令
find . -name "*.txt" | xargs -P 4 grep "search_text"

# 示例：批量删除文件
find . -name "*.tmp" | xargs rm

# 示例：批量重命名文件
echo file1.txt file2.txt file3.txt | xargs -n 1 -I {} mv {} {}.bak
```

### find - 高级文件查找
```bash
# 查找指定名称的文件
find . -name "filename.txt"

# 查找指定类型的文件
find . -type f -name "*.txt"  # 普通文件
find . -type d -name "dir*"   # 目录
find . -type l -name "link*"   # 符号链接

# 查找指定大小的文件
find . -type f -size +100M  # 大于100MB
find . -type f -size -10M   # 小于10MB
find . -type f -size 1M     # 等于1MB

# 查找指定时间的文件
find . -type f -mtime -7    # 7天内修改的文件
find . -type f -mtime +30   # 30天前修改的文件
find . -type f -atime -1    # 1天内访问的文件

# 查找指定权限的文件
find . -type f -perm 644    # 权限为644的文件

# 查找并执行命令
find . -name "*.txt" -exec cat {} \;
find . -name "*.txt" -exec grep "search" {} \;

# 查找并删除文件
find . -name "*.tmp" -delete
```

### curl - 高级用法
```bash
# 下载文件
curl -O https://example.com/file.zip

# 下载文件并保存为指定名称
curl -o new_filename.zip https://example.com/file.zip

# 断点续传
curl -C - -O https://example.com/largefile.zip

# 限速下载
curl --limit-rate 100k -O https://example.com/file.zip

# 显示响应头信息
curl -I https://example.com

# 跟随重定向
curl -L https://example.com

# 使用代理
curl -x http://proxy.example.com:8080 https://example.com

# 发送JSON数据
curl -H "Content-Type: application/json" -d '{"key":"value"}' https://example.com/api

# 上传文件
curl -F "file=@/path/to/file.txt" https://example.com/upload
```

### wget - 高级用法
```bash
# 下载文件
wget https://example.com/file.zip

# 下载文件并保存为指定名称
wget -O new_filename.zip https://example.com/file.zip

# 断点续传
wget -c https://example.com/largefile.zip

# 限速下载
wget --limit-rate=100k https://example.com/file.zip

# 递归下载整个网站
wget -r https://example.com/

# 递归下载并排除指定目录
wget -r --exclude-directories=dir1,dir2 https://example.com/

# 下载指定格式的文件
wget -r -A "*.pdf" https://example.com/

# 后台下载
wget -b https://example.com/largefile.zip

# 查看下载进度
wget -q --show-progress https://example.com/file.zip
```
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
