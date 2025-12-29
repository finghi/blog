---
title: IndexedDB 简单使用
icon: laptop-code
date: 2025-12-26
category:
  - 使用指南
tag:
  - IndexedDB
  - 浏览器
---

<div style="font-weight:700; ">IndexedDB 简单使用文档，适合初学者快速上手的核心操作指南。</div>

<!-- more -->

## 一、为什么学习 IndexedDB

如果你想在浏览器中保存用户数据（如设置、缓存、离线内容），IndexedDB 是理想选择！它比 localStorage 更强大：

- 📦 存储容量大（最少 250MB，最多可达 1GB）
- 🔄 异步操作，不卡顿页面
- 📊 支持复杂数据结构（对象、数组等）
- 🔍 支持快速查询
- ✅ 数据操作有事务保障

## 二、核心概念（新手只需记住这些）

| 概念                       | 类比       | 说明                                   |
| -------------------------- | ---------- | -------------------------------------- |
| 数据库(Database)           | 文件夹     | 存储所有数据的容器，有唯一名称         |
| 对象存储空间(Object Store) | Excel 表格 | 存储同一类数据的地方                   |
| 事务(Transaction)          | 操作标签   | 包裹所有数据操作，确保安全             |
| 游标(Cursor)               | 鼠标指针   | 遍历数据的工具，可以逐条访问数据       |
| IDBKeyRange                | 筛选条件   | 定义数据查询范围的工具，如"大于 20 岁" |

## 三、快速上手：完整示例

下面是一个完整的学生信息管理示例，涵盖从创建数据库到增删改查的全部流程：

```javascript
// 1. 打开/创建数据库
const dbRequest = indexedDB.open("StudentDB", 1);
// 2. 数据库创建/升级事件（只在版本号变化时触发）
dbRequest.onupgradeneeded = (event) => {
  const db = event.target.result;
  // 创建 "students" 表（对象存储空间），主键为 "id"
  const studentStore = db.createObjectStore("students", { keyPath: "id" });
  // 创建索引：按姓名快速查询
  // unique: false 表示允许索引字段的值重复（多个学生可以有相同姓名）
  // multiEntry: false 表示索引字段为数组时，不单独为每个元素创建索引条目
  studentStore.createIndex("by_name", "name", {
    unique: false,
    multiEntry: false,
  });
  // 创建索引：按班级快速查询
  // unique: false 表示允许索引字段的值重复（多个学生可以在同一个班级）
  studentStore.createIndex("by_class", "class", { unique: false });

  // 示例：如果创建邮箱索引，通常设置为 unique: true
  // studentStore.createIndex("by_email", "email", { unique: true }); // 确保邮箱唯一
};

// 3. 数据库打开成功事件
dbRequest.onsuccess = (event) => {
  const db = event.target.result;
  console.log("数据库已打开");

  // 调用增删改查函数
  addStudent(db);
  getStudentById(db, 1);
  updateStudent(db, 1, { age: 20 });
  deleteStudent(db, 1);

  // 调用游标相关函数
  getAllStudentsWithCursor(db);
  getStudentsSortedByName(db);
};

// 4. 数据库打开失败事件
dbRequest.onerror = (event) => {
  console.error("数据库打开失败:", event.target.error);
};

// 5. 添加学生数据
function addStudent(db) {
  // 创建读写事务
  const transaction = db.transaction(["students"], "readwrite");
  const studentStore = transaction.objectStore("students");

  // 添加数据
  const addRequest = studentStore.add({
    id: 1,
    name: "张三",
    class: "三年二班",
    age: 19,
  });

  addRequest.onsuccess = () => {
    console.log("学生添加成功");
  };
}

// 6. 按 ID 查询学生
function getStudentById(db, id) {
  // 创建只读事务
  const transaction = db.transaction(["students"], "readonly");
  const studentStore = transaction.objectStore("students");

  // 查询数据
  const getRequest = studentStore.get(id);

  getRequest.onsuccess = () => {
    console.log("查询结果:", getRequest.result);
  };
}

// 7. 更新学生信息
function updateStudent(db, id, newData) {
  const transaction = db.transaction(["students"], "readwrite");
  const studentStore = transaction.objectStore("students");

  // 先查询
  const getRequest = studentStore.get(id);

  getRequest.onsuccess = () => {
    const student = getRequest.result;
    // 合并新数据
    Object.assign(student, newData);
    // 更新数据
    const updateRequest = studentStore.put(student);

    updateRequest.onsuccess = () => {
      console.log("学生信息更新成功");
    };
  };
}

// 8. 删除学生
function deleteStudent(db, id) {
  const transaction = db.transaction(["students"], "readwrite");
  const studentStore = transaction.objectStore("students");

  const deleteRequest = studentStore.delete(id);

  deleteRequest.onsuccess = () => {
    console.log("学生删除成功");
  };
}

// 9. 使用游标遍历所有学生
function getAllStudentsWithCursor(db) {
  const transaction = db.transaction(["students"], "readonly");
  const studentStore = transaction.objectStore("students");

  // 打开游标遍历所有学生
  const cursorRequest = studentStore.openCursor();

  cursorRequest.onsuccess = (event) => {
    const cursor = event.target.result;

    if (cursor) {
      console.log("游标遍历学生:", cursor.value);
      cursor.continue(); // 继续下一条记录
    } else {
      console.log("游标遍历完成");
    }
  };
}

// 10. 使用游标和索引按姓名排序查询
function getStudentsSortedByName(db) {
  const transaction = db.transaction(["students"], "readonly");
  const studentStore = transaction.objectStore("students");
  const nameIndex = studentStore.index("by_name");

  // 按姓名升序遍历学生
  // "next" 是游标的遍历方向参数，表示按索引值升序遍历
  const cursorRequest = nameIndex.openCursor(null, "next");

  cursorRequest.onsuccess = (event) => {
    const cursor = event.target.result;

    if (cursor) {
      console.log("按姓名排序:", cursor.value);
      cursor.continue();
    } else {
      console.log("排序查询完成");
    }
  };
}
```

## 四、常用操作详解

### 1. 创建数据库和表格

```javascript
// 语法：indexedDB.open(数据库名称, 版本号)
const request = indexedDB.open("MyDB", 1);
```

> 注意：版本号必须是正整数，只能递增不能递减。

### 2. 添加数据

```javascript
// 步骤：事务 → 表格 → 添加
db.transaction(["students"], "readwrite").objectStore("students").add({
  id: 2,
  name: "李四",
  class: "三年一班",
});
```

### 3. 查询数据

#### 按主键查询

```javascript
// 查询 ID 为 2 的学生
db
  .transaction(["students"], "readonly")
  .objectStore("students")
  .get(2).onsuccess = (event) => {
  console.log(event.target.result);
};
```

#### 按索引查询

```javascript
// 按姓名查询学生
db
  .transaction(["students"], "readonly")
  .objectStore("students")
  .index("by_name") // 使用姓名索引 查询名为张三的学生
  .get("张三").onsuccess = (event) => {
  console.log(event.target.result);
};
```

### 4. 更新数据

```javascript
// 更新数据使用 put 方法，会根据主键自动匹配
db.transaction(["students"], "readwrite").objectStore("students").put({
  id: 1, // 必须包含主键
  name: "张三", // 保持不变
  class: "三年二班", // 保持不变
  age: 21, // 新值
});
```

### 5. 删除数据

```javascript
// 按主键删除
db.transaction(["students"], "readwrite").objectStore("students").delete(1);
```

### 6. 使用游标遍历数据

游标是遍历大量数据的最佳方式，它允许你逐条访问数据，支持排序和筛选。

#### 遍历所有数据

```javascript
// 遍历所有学生
db
  .transaction(["students"], "readonly")
  .objectStore("students")
  .openCursor().onsuccess = (event) => {
  // 打开游标
  const cursor = event.target.result;

  if (cursor) {
    console.log("学生:", cursor.value);
    cursor.continue(); // 继续下一条
  } else {
    console.log("遍历完成");
  }
};
```

#### 遍历特定范围数据

**关于 IDBKeyRange**：IDBKeyRange 是浏览器环境提供的全局对象，无需导入即可直接使用。它用于定义数据查询的范围条件。

常用的 IDBKeyRange 方法：

- `IDBKeyRange.only(value)` - 精确匹配
- `IDBKeyRange.lowerBound(value, isOpen)` - 大于等于（isOpen=true 表示大于）
- `IDBKeyRange.upperBound(value, isOpen)` - 小于等于（isOpen=true 表示小于）
- `IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen)` - 在范围内

```javascript
// 遍历 ID 大于 1 的学生（使用键范围）
const keyRange = IDBKeyRange.lowerBound(2); // ID >= 2

db
  .transaction(["students"], "readonly")
  .objectStore("students") // 传入键范围
  .openCursor(keyRange).onsuccess = (event) => {
  const cursor = event.target.result;

  if (cursor) {
    console.log("学生:", cursor.value);
    cursor.continue();
  } else {
    console.log("遍历完成");
  }
};
```

#### 游标配合索引使用（按姓名排序）

**openCursor 方法的遍历方向参数**：openCursor 的第二个参数用于指定游标的遍历方向，决定了数据的排序方式。

常用的方向值：

- `"next"`：（默认值）按索引值**升序**遍历所有数据
- `"prev"`：按索引值**降序**遍历所有数据
- `"nextunique"`：按索引值**升序**遍历，跳过重复值
- `"prevunique"`：按索引值**降序**遍历，跳过重复值

```javascript
// 按姓名升序遍历学生
db
  .transaction(["students"], "readonly")
  .objectStore("students")
  .index("by_name") // 使用姓名索引  next 表示升序
  .openCursor(null, "next").onsuccess = (event) => {
  const cursor = event.target.result;

  if (cursor) {
    console.log("学生:", cursor.value);
    cursor.continue();
  } else {
    console.log("遍历完成");
  }
};
```

## 五、实际应用场景

### 1. 保存用户偏好设置

```javascript
// 保存用户主题设置
function saveUserSettings(db, settings) {
  db.transaction(["settings"], "readwrite")
    .objectStore("settings")
    .put(settings, "user_preferences");
}
```

### 2. 离线数据缓存

```javascript
// 缓存文章内容，支持离线阅读
function cacheArticle(db, article) {
  db.transaction(["articles"], "readwrite")
    .objectStore("articles")
    .put(article);
}
```

### 3. 表单数据临时保存

```javascript
// 保存用户填写的表单草稿
function saveFormDraft(db, formData) {
  db.transaction(["drafts"], "readwrite")
    .objectStore("drafts")
    .put(formData, "current_form");
}
```

## 六、新手常见问题

### ❓ 为什么操作数据库要放在事件里？

因为 IndexedDB 是异步的，需要等数据库准备好才能操作。

### ❓ 什么是主键？

主键是每条数据的唯一标识，类似身份证号。创建表格时需要指定主键字段。

### ❓ 为什么要创建索引？

索引可以让查询更快，比如按姓名查询时不需要遍历所有数据。

### ❓ 如何关闭数据库？

```javascript
db.close(); // 用完记得关闭，释放资源
```

### ❓ 如何删除整个数据库？

```javascript
// 谨慎使用！会删除所有数据
indexedDB.deleteDatabase("MyDB");
```

### ❓ IDBKeyRange 在哪里获取？

IDBKeyRange 是**浏览器内置的全局对象**，与 indexedDB 一样，无需任何导入或安装，直接在 JavaScript 代码中使用即可。

```javascript
// 直接使用，无需导入
const range = IDBKeyRange.lowerBound(10);
const range2 = IDBKeyRange.bound(10, 20);
```

它是浏览器 Web API 的一部分，所有现代浏览器都支持。

### ❓ `createIndex` 的 `options` 参数有哪些属性？

`createIndex` 方法的 `options` 参数用于配置索引的行为，常用属性包括：

1. **`unique`**：控制索引字段的值是否允许重复

   - `unique: false`（默认值）：允许索引字段的值重复，适合姓名、班级等可能有重复值的字段
   - `unique: true`：不允许索引字段的值重复，适合邮箱、身份证号等需要唯一标识的字段

   ```javascript
   // 允许重复姓名
   studentStore.createIndex("by_name", "name", { unique: false });
   // 邮箱必须唯一
   studentStore.createIndex("by_email", "email", { unique: true });
   ```

2. **`multiEntry`**：控制数组类型字段的索引行为（仅当索引字段是数组时生效）

   - `multiEntry: false`（默认值）：将**整个数组作为一个索引条目**，只有完整匹配整个数组的查询才会生效
   - `multiEntry: true`：为**数组中的每个元素创建一个单独的索引条目**，可以通过数组中的任何一个元素查询到包含该元素的数组

   ```javascript
   // 假设学生对象有 courses: ["数学", "英语"] 字段

   // 1. 创建 multiEntry: false 的索引
   // 索引条目会是：courses -> ["数学", "英语"]
   // 查询时必须完整匹配整个数组
   studentStore.createIndex("by_courses", "courses", { multiEntry: false });

   // 2. 创建 multiEntry: true 的索引
   // 索引条目会是："数学" -> 对应学生对象
   //              "英语" -> 对应学生对象
   // 查询时可以通过任何一个课程名称匹配
   studentStore.createIndex("by_single_course", "courses", {
     multiEntry: true,
   });
   ```

   **查询行为对比**：

   ```javascript
   // 使用 multiEntry: false 的索引查询
   // 只会匹配 courses 字段严格等于 ["数学", "英语"] 的学生
   db
     .transaction(["students"], "readonly")
     .objectStore("students")
     .index("by_courses")
     .get(["数学", "英语"]).onsuccess = (event) => {
     // 可能匹配到包含 ["数学", "英语"] 课程的学生
   };

   // 使用 multiEntry: true 的索引查询
   // 会匹配所有包含 "数学" 课程的学生，不管他们还有什么其他课程
   db
     .transaction(["students"], "readonly")
     .objectStore("students")
     .index("by_single_course")
     .get("数学").onsuccess = (event) => {
     // 会匹配到所有 courses 字段包含 "数学" 的学生
   };
   ```

3. **`locale`**：指定字符串排序的语言环境（部分现代浏览器支持）

   - 例如 `{ locale: "zh-CN" }` 表示使用中文排序规则

   ```javascript
   // 使用中文排序规则创建姓名索引
   studentStore.createIndex("by_name_zh", "name", { locale: "zh-CN" });
   ```

## 七、下一步学习建议

如果你想深入学习，可以查看：

1. **IndexedDB 详细使用文档** - 了解高级功能
2. **浏览器兼容性** - 目前所有现代浏览器都支持
3. **错误处理** - 完善你的代码健壮性

## 八、总结

IndexedDB 不难！记住这些核心步骤：

1. `indexedDB.open()` - 打开数据库
2. `onupgradeneeded` - 创建表格和索引
3. `db.transaction()` - 开始数据操作
4. `openCursor()` - 使用游标遍历数据

游标是 IndexedDB 中处理大量数据的强大工具，支持排序、筛选和高效遍历。掌握了这些基础操作，你就可以开始使用 IndexedDB 构建功能丰富的 Web 应用了！

现在就动手试试吧！
