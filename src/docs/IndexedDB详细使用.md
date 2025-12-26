---
title: IndexedDB 详细使用
icon: laptop-code
date: 2025-12-26
category:
  - 使用指南
tag:
  - IndexedDB
  - 浏览器
---

<div style="font-weight:700; ">IndexedDB 详细使用文档，采用「示例代码+步骤注释」格式，明确区分事务内和事务外操作。</div>

<!-- more -->

## 一、概述

### 1、什么是 IndexedDB

IndexedDB 是浏览器提供的异步、事务性客户端存储 API，用于存储大量结构化数据，替代传统 Web Storage（localStorage/sessionStorage）。

### 2、存储方案对比

| 特性     | IndexedDB        | localStorage   | sessionStorage |
| -------- | ---------------- | -------------- | -------------- |
| 存储容量 | 250MB-1GB        | 5-10MB         | 5-10MB         |
| 数据类型 | 任意 JS 类型     | 仅字符串       | 仅字符串       |
| 操作方式 | 异步             | 同步           | 同步           |
| 事务支持 | 有               | 无             | 无             |
| 索引支持 | 有               | 无             | 无             |
| 查询能力 | 强（索引、游标） | 弱（仅键值对） | 弱（仅键值对） |

## 二、核心概念

### 1、数据库 (Database)

数据库是 IndexedDB 的最高层容器,每个数据库有唯一名称和版本号,同一源下可创建多个数据库 。

```javascript
let dababase = "user" // 数据库名称
let version = 1 // 数据库版本号
const request = indexedDB.open(dababase, version);

// 数据库打开成功事件
request.onsuccess = (event) => {
  const db = event.target.result;
  console.log("数据库打开成功", db);
};

// 数据库升级事件（版本号增加时触发）
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  console.log("数据库升级", db);
};

```

#### 数据库对象的属性：

> 说明：以下表格中的 `db` 对象是通过 `event.target.result` 在数据库打开成功 (`onsuccess`) 或升级 (`onupgradeneeded`) 事件中获取的数据库实例。

| 属性名                | 描述                                   |
| --------------------- | -------------------------------------- |
| `db.name`             | 数据库名称                             |
| `db.version`          | 数据库版本号                           |
| `db.objectStoreNames` | 当前数据库中的所有对象存储空间名称集合 |

#### 数据库对象的方法：

| 方法名                   | 描述             | 可用性                    |
| ------------------------ | ---------------- | ------------------------- |
| `db.transaction()`       | 创建事务         | 所有事件                  |
| `db.close()`             | 关闭数据库连接   | 所有事件                  |
| `db.createObjectStore()` | 创建对象存储空间 | 仅 `onupgradeneeded` 事件 |
| `db.deleteObjectStore()` | 删除对象存储空间 | 仅 `onupgradeneeded` 事件 |

### 2、对象存储空间 (Object Store)

```javascript
// 对象存储空间相当于关系型数据库的表
// 存储同一类相关数据
// 只能在 onupgradeneeded 事件中创建（事务外操作）
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  // 创建 users 对象存储空间，主键为 id
  const userStore = db.createObjectStore("users", { keyPath: "id" });
};
```

#### 对象存储空间的属性：

> 说明：以下表格中的 `userStore` 对象是通过 `db.createObjectStore()`（在 `onupgradeneeded` 事件中创建）或 `transaction.objectStore()`（在事务中获取）得到的对象存储空间实例。

| 属性名                    | 描述                                 |
| ------------------------- | ------------------------------------ |
| `userStore.name`          | 对象存储空间名称                     |
| `userStore.keyPath`       | 主键路径                             |
| `userStore.indexNames`    | 当前对象存储空间中的所有索引名称集合 |
| `userStore.autoIncrement` | 是否自动生成主键                     |

#### 对象存储空间的方法：

| 方法名                    | 描述                     | 可用性                    |
| ------------------------- | ------------------------ | ------------------------- |
| `userStore.add()`         | 添加数据（主键不存在时） | 事务内                    |
| `userStore.put()`         | 更新数据（主键存在时）   | 事务内                    |
| `userStore.delete()`      | 删除数据                 | 事务内                    |
| `userStore.get()`         | 获取单条数据             | 事务内                    |
| `userStore.getAll()`      | 获取所有数据             | 事务内                    |
| `userStore.count()`       | 获取数据数量             | 事务内                    |
| `userStore.clear()`       | 清空数据                 | 事务内                    |
| `userStore.openCursor()`  | 打开游标                 | 事务内                    |
| `userStore.index()`       | 获取索引                 | 事务内                    |
| `userStore.createIndex()` | 创建索引                 | 仅 `onupgradeneeded` 事件 |
| `userStore.deleteIndex()` | 删除索引                 | 仅 `onupgradeneeded` 事件 |

### 3、索引 (Index)

```javascript
// 索引用于快速查询数据，提高检索效率
// 可基于对象的任何属性创建
// 只能在 onupgradeneeded 事件中创建（事务外操作）
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const userStore = db.createObjectStore("users", { keyPath: "id" });
  // 为 email 字段创建唯一索引
  userStore.createIndex("by_email", "email", { unique: true });
  // 为 hobbies 字段创建 multiEntry 索引（支持数组查询）
  userStore.createIndex("by_hobbies", "hobbies", {
    unique: false,
    multiEntry: true,
  });
};
```

#### 索引对象的属性：

> 说明：以下表格中的 `index` 对象是通过 `objectStore.createIndex()`（在 `onupgradeneeded` 事件中创建）或 `objectStore.index()`（在事务中获取）得到的索引实例。

| 属性名             | 描述                                   |
| ------------------ | -------------------------------------- |
| `index.name`       | 索引名称                               |
| `index.keyPath`    | 索引字段路径                           |
| `index.unique`     | 是否唯一索引                           |
| `index.multiEntry` | 是否为 multiEntry 索引（支持数组查询） |

#### 索引对象的方法：

| 方法名                  | 描述                     | 可用性 |
| ----------------------- | ------------------------ | ------ |
| `index.get()`           | 根据索引值获取单条数据   | 事务内 |
| `index.getAll()`        | 根据索引值获取所有数据   | 事务内 |
| `index.count()`         | 获取匹配索引值的数据数量 | 事务内 |
| `index.openCursor()`    | 打开索引游标             | 事务内 |
| `index.openKeyCursor()` | 打开索引键游标           | 事务内 |

### 4、事务 (Transaction)

```javascript
// 事务用于包裹数据操作，确保原子性
// 支持 readonly 和 readwrite 模式
// 必须在 onsuccess 事件中创建（事务内操作）
request.onsuccess = (event) => {
  const db = event.target.result;
  // 创建只读事务，操作 users 对象存储空间
  const transaction = db.transaction(["users"], "readonly");
  // 获取 users 对象存储空间的引用
  // 相当于关系型数据库的 USE users（选择表）或 SELECT * FROM users
  // 相当于文档型数据库的 db.collection("users")（选择集合）
  const userStore = transaction.objectStore("users");
};
```

#### 事务对象的属性：

> 说明：以下表格中的 `transaction` 对象是通过 `db.transaction()` 方法创建的事务实例。

| 属性名                         | 描述                               |
| ------------------------------ | ---------------------------------- |
| `transaction.db`               | 所属数据库对象                     |
| `transaction.objectStoreNames` | 当前事务操作的对象存储空间名称集合 |
| `transaction.mode`             | 事务模式 (readonly/readwrite)      |

#### 事务对象的方法：

| 方法名                      | 描述             | 可用性 |
| --------------------------- | ---------------- | ------ |
| `transaction.objectStore()` | 获取对象存储空间 | 事务内 |
| `transaction.abort()`       | 中止事务         | 事务内 |

#### 事务对象的事件：

| 事件名                   | 描述               | 触发时机 |
| ------------------------ | ------------------ | -------- |
| `transaction.oncomplete` | 事务成功完成时触发 | 所有事务 |
| `transaction.onerror`    | 事务失败时触发     | 所有事务 |

### 5、游标 (Cursor)

```javascript
// 游标用于遍历对象存储空间中的数据
// 支持按条件筛选和排序
// 必须在事务内使用
request.onsuccess = (event) => {
  const db = event.target.result;
  const transaction = db.transaction(["users"], "readonly");
  const userStore = transaction.objectStore("users");
  // 打开游标，遍历所有数据
  const request = userStore.openCursor();
};
```

#### 游标对象的属性：

> 说明：以下表格中的 `cursor` 对象是通过 `objectStore.openCursor()` 或 `index.openCursor()` 方法在事务内获取的游标实例。

| 属性名              | 描述                                            |
| ------------------- | ----------------------------------------------- |
| `cursor.value`      | 当前游标指向的数据对象                          |
| `cursor.key`        | 当前游标指向的数据的主键值                      |
| `cursor.primaryKey` | 当前游标指向的数据的主键值（与 index.key 区分） |
| `cursor.source`     | 游标所属的对象存储空间或索引                    |

#### 游标对象的方法：

| 方法名                  | 描述               | 可用性 |
| ----------------------- | ------------------ | ------ |
| `cursor.continue()`     | 移动到下一条记录   | 事务内 |
| `cursor.continue(key)`  | 移动到指定键的记录 | 事务内 |
| `cursor.advance(count)` | 跳过指定数量的记录 | 事务内 |
| `cursor.update()`       | 更新当前记录       | 事务内 |
| `cursor.delete()`       | 删除当前记录       | 事务内 |

### 6、事件 (Event)

IndexedDB 使用事件机制处理异步操作，不同事件适用于不同的操作场景：

| 事件名称                    | 触发时机                   | 适用操作                                      |
| --------------------------- | -------------------------- | --------------------------------------------- |
| `request.onupgradeneeded`   | 数据库创建或版本更新时     | 数据库结构修改（创建/删除对象存储空间、索引） |
| `request.onsuccess`         | 数据库打开成功时           | 数据库打开后的所有数据操作                    |
| `request.onerror`           | 数据库操作失败时           | 错误处理和故障恢复                            |
| `request.onblocked`         | 数据库操作被其他连接阻塞时 | 处理版本冲突和连接管理                        |
| `db.onversionchange`        | 其他连接修改数据库版本时   | 优雅地关闭当前连接以允许版本升级              |
| `transaction.oncomplete`    | 事务成功完成时             | 事务完成后的后续处理                          |
| `transaction.onerror`       | 事务失败时                 | 事务级别的错误处理                            |
| `request.onsuccess/onerror` | 单个请求的成功/失败时      | 具体数据操作的结果处理                        |

```javascript
// 事件使用示例
const request = indexedDB.open("myDatabase", 1);

// 数据库结构修改事件
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  // 只能在此事件中修改数据库结构
};

// 数据库打开成功事件
request.onsuccess = (event) => {
  const db = event.target.result;

  // 监听版本变更事件
  db.onversionchange = () => {
    db.close();
    console.log("数据库版本变更，请刷新页面");
  };
};
```

## 三、数据库基础操作

### 1、打开数据库（事务外操作）

打开数据库是使用 IndexedDB 的第一步，包含数据库创建、版本管理和结构初始化。

```javascript
// 1. 打开或创建名为 "myDatabase" 的数据库，版本号为 1
// 版本号必须是正整数，只能递增
const request = indexedDB.open("myDatabase", 1);

// 2. 数据库首次创建或版本号更新时触发
// 唯一可以修改数据库结构的地方（事务外操作）
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  console.log("数据库版本:", db.version);
  console.log("旧版本:", event.oldVersion);
  console.log("新版本:", event.newVersion);

  // 3. 创建 users 对象存储空间（如果不存在）
  if (!db.objectStoreNames.contains("users")) {
    // 创建 users 存储空间，主键为 id
    const userStore = db.createObjectStore("users", { keyPath: "id" });

    // 4. 创建索引
    userStore.createIndex("by_email", "email", { unique: true }); // 唯一索引
    userStore.createIndex("by_name", "name", { unique: false }); // 姓名索引
    userStore.createIndex("by_age", "age", { unique: false }); // 年龄索引
    userStore.createIndex("by_hobbies", "hobbies", {
      unique: false,
      multiEntry: true,
    }); // 爱好索引
  }
};

// 5. 数据库打开成功时触发
// 此事件中可以创建事务，执行数据操作
request.onsuccess = (event) => {
  const db = event.target.result;
  console.log("数据库打开成功");

  // 6. 监听其他连接的版本变更事件
  db.onversionchange = () => {
    console.log("其他连接正在更新数据库版本，关闭当前连接");
    db.close();
  };

  // 7. 执行完整的数据操作流程
  // 只需要调用第一个函数，后续操作通过事务完成事件自动串联
  addDataToDatabase(db);
};

// 7. 数据库打开失败时触发
request.onerror = (event) => {
  const error = event.target.error;
  console.error("数据库打开失败:", error);
};

// 8. 数据库被其他连接阻塞时触发
request.onblocked = () => {
  console.log("数据库被阻塞，请关闭其他标签页后重试");
};
```

### 2、将数据库实例提取到外部使用

在实际应用中，我们通常需要将数据库实例提取到外部，以便在多个函数或组件中共享使用。这样可以避免重复打开数据库连接，提高性能和代码可维护性。

**问题解答：** `/E:/mycode/blog/src/docs/IndexedDB详细使用.md#L44-48` 中的 `db` 对象来自 `event.target.result`，这是 IndexedDB 异步 API 的标准返回方式。我们可以通过以下几种方式将 `db` 提取到外部供其他函数使用：

#### 方式一：使用全局变量

**实现思路：** 声明一个全局变量，在数据库打开成功时将 `db` 实例保存到该变量中，然后在其他函数中直接使用这个全局变量。

```javascript
// 声明全局变量存储数据库实例 - db 最终来自 event.target.result
let dbInstance = null;

// 打开数据库的函数
function openDatabase() {
  // 创建数据库打开请求
  const request = indexedDB.open("myDatabase", 1);

  // 数据库升级事件 - 只有在此事件中可以修改数据库结构
  request.onupgradeneeded = (event) => {
    // event.target.result 返回数据库实例 (db)
    const db = event.target.result;
    console.log("数据库升级，版本号:", db.version);
    
    // 创建对象存储空间和索引
    if (!db.objectStoreNames.contains("users")) {
      // 创建 users 对象存储空间，主键为 id
      const userStore = db.createObjectStore("users", { keyPath: "id" });
      // 为 email 字段创建唯一索引
      userStore.createIndex("by_email", "email", { unique: true });
    }
  };

  // 数据库打开成功事件 - 关键：保存db实例到全局变量
  request.onsuccess = (event) => {
    // event.target.result 返回数据库实例 (db) - 这就是用户询问的 L44-48 行的 db 来源
    dbInstance = event.target.result;
    console.log("数据库打开成功，db实例已保存到全局变量 dbInstance");
    
    // 监听版本变更事件，确保在其他连接更新版本时能够正确关闭当前连接
    dbInstance.onversionchange = () => {
      console.log("其他连接正在更新数据库版本，关闭当前连接");
      dbInstance.close();
      dbInstance = null; // 重置全局变量
    };
  };

  // 数据库打开失败事件
  request.onerror = (event) => {
    console.error("数据库打开失败:", event.target.error);
  };
}

// 在其他函数中使用全局db实例
function addUser(userData) {
  // 检查数据库实例是否已初始化
  if (!dbInstance) {
    console.error("数据库实例未初始化，请先打开数据库");
    return;
  }

  // 使用全局db实例创建事务
  const transaction = dbInstance.transaction(["users"], "readwrite");
  // 获取对象存储空间 - 相当于关系型数据库的选择表操作
  const userStore = transaction.objectStore("users");
  // 执行添加操作
  const request = userStore.add(userData);

  request.onsuccess = () => {
    console.log("用户添加成功");
  };
  
  request.onerror = () => {
    console.error("用户添加失败:", request.error);
  };
}

// 初始化数据库
openDatabase();

// 后续可以在任何地方调用 addUser 等函数
// 注意：需要确保数据库已经打开成功，这里使用 setTimeout 模拟异步等待
setTimeout(() => {
  addUser({ id: 1, name: "张三", email: "zhangsan@example.com" });
}, 100);
```

**优缺点：**
- ✅ 实现简单，适合小型应用
- ❌ 污染全局作用域，可能导致命名冲突
- ❌ 难以管理数据库连接的生命周期

#### 方式二：使用 Promise 封装

**实现思路：** 使用 Promise 封装数据库打开操作，通过 `resolve` 返回 `db` 实例，然后在其他函数中使用 `async/await` 或 `.then()` 获取和使用这个实例。

```javascript
// 使用 Promise 封装数据库打开操作，使代码更易读、易维护
function openDatabase() {
  return new Promise((resolve, reject) => {
    // 创建数据库打开请求
    const request = indexedDB.open("myDatabase", 1);

    // 数据库升级事件 - 修改数据库结构
    request.onupgradeneeded = (event) => {
      // event.target.result 返回数据库实例 (db)
      const db = event.target.result;
      
      // 创建对象存储空间和索引
      if (!db.objectStoreNames.contains("users")) {
        const userStore = db.createObjectStore("users", { keyPath: "id" });
        userStore.createIndex("by_email", "email", { unique: true });
      }
    };

    // 数据库打开成功事件
    request.onsuccess = (event) => {
      // event.target.result 返回数据库实例 (db)
      const db = event.target.result;
      console.log("数据库打开成功");
      
      // 监听版本变更事件
      db.onversionchange = () => {
        console.log("其他连接正在更新数据库版本，关闭当前连接");
        db.close();
      };
      
      // 返回数据库实例
      resolve(db);
    };

    // 数据库打开失败事件
    request.onerror = (event) => {
      console.error("数据库打开失败:", event.target.error);
      reject(event.target.error);
    };
  });
}

// 使用 async/await 调用数据库操作
async function initApp() {
  try {
    // 获取数据库实例 - 这里的 db 来自 openDatabase 函数返回的 Promise
    const db = await openDatabase();
    
    // 保存数据库实例到全局对象，供其他函数使用
    window.dbInstance = db;
    
    // 执行数据操作示例
    await addUserWithPromise(db, { id: 2, name: "李四", email: "lisi@example.com" });
    
    // 查询数据示例
    const user = await getUserById(db, 2);
    console.log("查询到的用户:", user);
    
  } catch (error) {
    console.error("应用初始化失败:", error);
  }
}

// 使用 Promise 封装添加用户操作
function addUserWithPromise(db, userData) {
  return new Promise((resolve, reject) => {
    // 使用数据库实例创建事务
    const transaction = db.transaction(["users"], "readwrite");
    const userStore = transaction.objectStore("users");
    const request = userStore.add(userData);

    request.onsuccess = () => {
      console.log("用户添加成功");
      resolve();
    };
    
    request.onerror = () => {
      console.error("用户添加失败:", request.error);
      reject(request.error);
    };
  });
}

// 使用 Promise 封装查询用户操作
function getUserById(db, id) {
  return new Promise((resolve, reject) => {
    // 使用数据库实例创建只读事务
    const transaction = db.transaction(["users"], "readonly");
    const userStore = transaction.objectStore("users");
    const request = userStore.get(id);

    request.onsuccess = () => {
      resolve(request.result); // request.result 包含查询到的用户对象
    };
    
    request.onerror = () => {
      console.error("用户查询失败:", request.error);
      reject(request.error);
    };
  });
}

// 初始化应用
initApp();
```

**优缺点：**
- ✅ 避免全局变量污染，代码结构更清晰
- ✅ 支持异步流程控制，便于处理复杂操作
- ✅ 可以方便地在多个函数间共享db实例
- ❌ 实现相对复杂，需要理解Promise和async/await
- ❌ 仍然需要手动管理db实例的生命周期

#### 方式三：使用单例模式

**实现思路：** 创建一个数据库管理类，确保全局只有一个实例，负责管理数据库的生命周期、初始化和实例获取。

```javascript
// 数据库管理单例 - 确保全局只有一个数据库管理器实例
class DatabaseManager {
  constructor() {
    // 单例模式：如果实例已存在，直接返回
    if (DatabaseManager.instance) {
      return DatabaseManager.instance;
    }

    this.db = null; // 存储数据库实例
    this.isInitialized = false;
    DatabaseManager.instance = this;
  }

  // 打开数据库方法
  open(name, version, upgradeCallback) {
    return new Promise((resolve, reject) => {
      // 如果数据库已初始化，直接返回实例
      if (this.isInitialized) {
        resolve(this.db);
        return;
      }
      
      // 创建数据库打开请求
      const request = indexedDB.open(name, version);

      // 数据库升级事件
      request.onupgradeneeded = (event) => {
        // event.target.result 返回数据库实例 (db)
        const db = event.target.result;
        console.log("数据库升级，版本号:", db.version);
        
        // 调用升级回调函数，执行结构修改操作
        if (upgradeCallback) {
          upgradeCallback(db);
        }
      };

      // 数据库打开成功事件
      request.onsuccess = (event) => {
        // 保存数据库实例
        this.db = event.target.result;
        this.isInitialized = true;
        console.log("数据库打开成功");
        
        // 监听版本变更事件
        this.db.onversionchange = () => {
          console.log("其他连接正在更新数据库版本，关闭当前连接");
          this.close();
        };
        
        resolve(this.db);
      };

      // 数据库打开失败事件
      request.onerror = (event) => {
        console.error("数据库打开失败:", event.target.error);
        reject(event.target.error);
      };
    });
  }

  // 获取数据库实例方法
  getInstance() {
    if (!this.isInitialized) {
      throw new Error("数据库未初始化，请先调用 open 方法");
    }
    return this.db;
  }

  // 关闭数据库方法
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
      console.log("数据库已关闭");
    }
  }
}

// 创建数据库管理器实例
const dbManager = new DatabaseManager();

// 初始化数据库
function initDatabase() {
  return dbManager.open("myDatabase", 1, (db) => {
    // 创建对象存储空间和索引
    if (!db.objectStoreNames.contains("users")) {
      const userStore = db.createObjectStore("users", { keyPath: "id" });
      userStore.createIndex("by_email", "email", { unique: true });
    }
  });
}

// 使用数据库管理器的函数
function addUserUsingManager(userData) {
  try {
    // 获取数据库实例 - 这里的 db 来自单例的 getInstance 方法
    const db = dbManager.getInstance();
    
    // 创建事务和执行操作
    const transaction = db.transaction(["users"], "readwrite");
    const userStore = transaction.objectStore("users");
    const request = userStore.add(userData);

    request.onsuccess = () => {
      console.log("用户添加成功");
    };
    
    request.onerror = () => {
      console.error("用户添加失败:", request.error);
    };
  } catch (error) {
    console.error("操作失败:", error);
  }
}

// 初始化数据库并执行操作
initDatabase().then(() => {
  console.log("数据库初始化完成");
  
  // 数据库初始化成功后，可以在任何地方获取实例并执行操作
  addUserUsingManager({ id: 3, name: "王五", email: "wangwu@example.com" });
});
```

**优缺点：**
- ✅ 全局唯一实例，避免重复打开数据库连接
- ✅ 集中管理数据库生命周期，便于维护
- ✅ 可以在任何地方获取db实例，使用方便
- ✅ 内置初始化检查和错误处理
- ❌ 实现最复杂，需要理解单例模式和类的概念
- ❌ 对于简单应用可能显得过于复杂

**注意事项：**
1. **对象属性来源**：`db` 对象始终来自 `event.target.result`，在 `onsuccess` 和 `onupgradeneeded` 事件中获取
2. **初始化检查**：在使用数据库实例之前，必须确保数据库已经成功打开
3. **版本变更处理**：妥善处理 `onversionchange` 事件，确保在其他连接更新版本时能够正确关闭当前连接
4. **资源管理**：避免在数据库关闭后继续使用实例，使用后及时关闭连接
5. **错误处理**：所有数据库操作都应包含错误处理逻辑
6. **全局变量注意事项**：使用全局变量时要注意作用域问题，避免命名冲突
7. **单例模式优势**：单例模式可以更好地管理数据库实例的生命周期，避免重复打开数据库连接

### 3、版本管理（事务外操作）

```javascript
// 版本管理最佳实践：使用常量管理版本号
const DB_NAME = "myDatabase";
const DB_VERSION = 3;

const request = indexedDB.open(DB_NAME, DB_VERSION);

// 版本升级时触发（事务外操作）
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const oldVersion = event.oldVersion;

  console.log(`数据库升级：从版本 ${oldVersion} 到版本 ${db.version}`);

  // 版本 1：创建初始结构
  if (oldVersion < 1) {
    const userStore = db.createObjectStore("users", { keyPath: "id" });
    userStore.createIndex("by_email", "email", { unique: true });
  }

  // 版本 2：添加新产品对象存储空间
  if (oldVersion < 2) {
    const productStore = db.createObjectStore("products", { keyPath: "id" });
    productStore.createIndex("by_name", "name", { unique: false });
  }

  // 版本 3：为用户添加年龄索引
  if (oldVersion < 3) {
    const userStore = event.target.transaction.objectStore("users");
    userStore.createIndex("by_age", "age", { unique: false });
  }
};
```

### 4、关闭数据库（事务外操作）

```javascript
request.onsuccess = (event) => {
  const db = event.target.result;

  // 执行完操作后关闭数据库连接
  // 这是事务外操作，不需要事务包裹
  db.close();
  console.log("数据库连接已关闭");
};
```

### 5、删除数据库（事务外操作）

```javascript
// 删除名为 "myDatabase" 的数据库
// 这是事务外操作，不需要事务包裹
const deleteRequest = indexedDB.deleteDatabase("myDatabase");

deleteRequest.onsuccess = () => {
  console.log("数据库删除成功");
};

deleteRequest.onerror = () => {
  console.error("数据库删除失败:", deleteRequest.error);
};
```

## 四、事务内数据操作

### 1、事务的创建与使用

事务是 IndexedDB 数据操作的基本单位，分为只读和读写两种模式：

| 事务模式    | 用途       | 特点                   |
| ----------- | ---------- | ---------------------- |
| `readonly`  | 查询操作   | 并发安全，性能更好     |
| `readwrite` | 增删改操作 | 支持数据修改，有锁机制 |

```javascript
request.onsuccess = (event) => {
  const db = event.target.result;

  // 示例1：只读事务（用于查询操作）
  const readTransaction = db.transaction(["users"], "readonly");
  const userStore = readTransaction.objectStore("users");

  // 监听事务完成事件
  readTransaction.oncomplete = () => {
    console.log("查询事务执行完成");
  };

  // 示例2：读写事务（用于增删改操作）
  const writeTransaction = db.transaction(["users"], "readwrite");
  const writeStore = writeTransaction.objectStore("users");

  // 监听事务错误事件
  writeTransaction.onerror = () => {
    console.error("写事务执行失败");
  };
};
```

### 2、添加数据（事务内操作）

```javascript
function addDataToDatabase(db) {
  // 创建读写事务（所有增删改操作必须在读写事务内）
  const transaction = db.transaction(["users"], "readwrite");
  const userStore = transaction.objectStore("users");

  // 示例：添加单个用户数据
  const addRequest = userStore.add({
    id: 1, // 主键，必须唯一
    name: "张三", // 用户名称
    email: "zhangsan@example.com", // 邮箱
    age: 30, // 年龄
    hobbies: ["读书", "跑步"], // 爱好数组
  });

  addRequest.onsuccess = () => {
    console.log("用户添加成功");
  };

  addRequest.onerror = () => {
    console.error("用户添加失败:", addRequest.error);
  };

  // 事务完成回调 - 自动执行查询操作
  transaction.oncomplete = () => {
    console.log("添加事务执行完成，开始查询数据");
    queryDataFromDatabase(db);
  };
}
```

### 3、查询数据（事务内操作）

```javascript
function queryDataFromDatabase(db) {
  // 创建只读事务（所有查询操作应在只读事务内）
  const transaction = db.transaction(["users"], "readonly");
  const userStore = transaction.objectStore("users");

  // 示例1：按主键查询
  const getRequest = userStore.get(1);
  getRequest.onsuccess = () => {
    console.log("按主键查询结果:", getRequest.result); // getRequest.result 包含完整用户对象
  };

  // 示例2：按索引查询（使用 by_email 索引）
  const emailIndex = userStore.index("by_email"); // by_email 索引在 onupgradeneeded 中创建
  const indexRequest = emailIndex.get("zhangsan@example.com");
  indexRequest.onsuccess = () => {
    console.log("按索引查询结果:", indexRequest.result);
  };

  // 示例3：获取所有数据
  const getAllRequest = userStore.getAll();
  getAllRequest.onsuccess = () => {
    console.log("所有用户:", getAllRequest.result);
  };

  // 事务完成回调 - 自动执行更新操作
  transaction.oncomplete = () => {
    console.log("查询事务执行完成，开始更新数据");
    updateDataInDatabase(db);
  };
}
```

### 4、更新数据（事务内操作）

```javascript
function updateDataInDatabase(db) {
  // 创建读写事务
  const transaction = db.transaction(["users"], "readwrite");
  const userStore = transaction.objectStore("users");

  // 示例：先查询再更新
  const getRequest = userStore.get(1);
  getRequest.onsuccess = () => {
    const user = getRequest.result; // 获取到完整的用户对象
    if (user) {
      // 更新用户信息
      user.age = 31;
      user.email = "new_zhangsan@example.com";

      // 使用 put 方法更新（存在则更新，不存在则添加）
      const putRequest = userStore.put(user);
      putRequest.onsuccess = () => {
        console.log("用户更新成功");
      };
    }
  };

  // 事务完成回调 - 自动执行游标遍历
  transaction.oncomplete = () => {
    console.log("更新事务执行完成，开始游标遍历");
    traverseDataWithCursor(db);
  };
}
```

### 5、删除数据（事务内操作）

```javascript
function deleteDataFromDatabase(db) {
  // 创建读写事务
  const transaction = db.transaction(["users"], "readwrite");
  const userStore = transaction.objectStore("users");

  // 示例1：按主键删除
  const deleteRequest = userStore.delete(1);
  deleteRequest.onsuccess = () => {
    console.log("用户删除成功");
  };

  // 示例2：按条件删除（使用游标）
  const cursorRequest = userStore.openCursor();
  cursorRequest.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      // cursor.value 包含完整用户对象
      console.log("准备删除记录:", cursor.value.name);
      cursor.delete(); // 删除当前记录
      cursor.continue(); // 继续下一条记录
    } else {
      console.log("条件删除完成");
    }
  };

  // 事务完成回调 - 整个工作流程结束
  transaction.oncomplete = () => {
    console.log("删除事务执行完成");
    console.log("=== 完整 IndexedDB 工作流程结束 ===");
  };
}
```

### 6、使用游标（事务内操作）

```javascript
function traverseDataWithCursor(db) {
  // 创建只读事务
  const transaction = db.transaction(["users"], "readonly");
  const userStore = transaction.objectStore("users");

  // 示例：基本游标遍历
  const basicCursor = userStore.openCursor();
  basicCursor.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      console.log("游标遍历:", cursor.value); // cursor.value 包含完整用户对象
      cursor.continue(); // 继续下一条记录
    } else {
      console.log("游标遍历完成");
    }
  };

  // 事务完成回调 - 自动执行键范围查询
  transaction.oncomplete = () => {
    console.log("游标遍历事务执行完成，开始键范围查询");
    useKeyRange(db);
  };
}
```

## 五、高级功能

### 1、使用键范围（事务内操作）

```javascript
function useKeyRange(db) {
  const transaction = db.transaction(["users"], "readonly");
  const userStore = transaction.objectStore("users");
  const ageIndex = userStore.index("by_age"); // by_age 索引在 onupgradeneeded 中创建

  // 示例1：查询年龄 >= 30 的用户
  const lowerRange = IDBKeyRange.lowerBound(30);
  ageIndex.getAll(lowerRange).onsuccess = (e) => {
    console.log("年龄 >= 30:", e.target.result);
  };

  // 示例2：查询年龄 <= 30 的用户
  const upperRange = IDBKeyRange.upperBound(30);
  ageIndex.getAll(upperRange).onsuccess = (e) => {
    console.log("年龄 <= 30:", e.target.result);
  };

  // 示例3：查询年龄在 25-35 之间的用户 [25, 35)
  const boundRange = IDBKeyRange.bound(25, 35, false, true);
  ageIndex.getAll(boundRange).onsuccess = (e) => {
    console.log("年龄 25-35:", e.target.result);
  };

  // 示例4：查询年龄等于 30 的用户
  const onlyRange = IDBKeyRange.only(30);
  ageIndex.getAll(onlyRange).onsuccess = (e) => {
    console.log("年龄 = 30:", e.target.result);
  };

  // 事务完成回调 - 自动执行 multiEntry 索引查询
  transaction.oncomplete = () => {
    console.log("键范围查询事务执行完成，开始 multiEntry 索引查询");
    useMultiEntryIndex(db);
  };
}
```

### 2、使用 multiEntry 索引（事务内操作）

```javascript
function useMultiEntryIndex(db) {
  // 创建读写事务添加测试数据
  const writeTransaction = db.transaction(["users"], "readwrite");
  const userStore = writeTransaction.objectStore("users");

  // 添加具有多个爱好的用户数据
  userStore.add({
    id: 2,
    name: "李四",
    email: "lisi@example.com",
    age: 28,
    hobbies: ["游泳", "篮球", "音乐"], // 爱好数组
  });

  writeTransaction.oncomplete = () => {
    // 数据添加完成后，创建只读事务进行查询
    const readTransaction = db.transaction(["users"], "readonly");
    const readStore = readTransaction.objectStore("users");

    // 使用 by_hobbies 索引（multiEntry 类型）查询爱好为篮球的用户
    const hobbyIndex = readStore.index("by_hobbies"); // by_hobbies 索引在 onupgradeneeded 中创建
    hobbyIndex.getAll("篮球").onsuccess = (e) => {
      console.log("爱好篮球的用户:", e.target.result);
    };

    // 读取事务完成后执行删除操作
    readTransaction.oncomplete = () => {
      console.log("multiEntry 索引查询完成，开始删除数据");
      deleteDataFromDatabase(db);
    };
  };
}
```

## 六、事务内与事务外操作对比

IndexedDB 严格区分事务内和事务外操作，以下是核心区别与适用场景：

| 操作类型   | 适用范围                              | 允许的操作                                                          |
| ---------- | ------------------------------------- | ------------------------------------------------------------------- |
| 事务外操作 | `onupgradeneeded` 事件或直接 API 调用 | 数据库结构修改（创建/删除对象存储空间、索引）、数据库打开/关闭/删除 |
| 事务内操作 | 事务上下文                            | 数据增删改查、游标操作、索引查询                                    |

### 1、事务外操作示例

```javascript
// 1. 数据库结构修改操作（必须在 onupgradeneeded 事件中）
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  // 创建对象存储空间（事务外操作）
  const userStore = db.createObjectStore("users", { keyPath: "id" });
  // 创建索引（事务外操作）
  userStore.createIndex("by_email", "email", { unique: true });
};

// 2. 数据库删除（直接调用 API）
indexedDB.deleteDatabase("myDatabase"); // 事务外操作
```

### 2、事务内操作示例

```javascript
request.onsuccess = (event) => {
  const db = event.target.result;

  // 创建事务（事务内操作的开始）
  const transaction = db.transaction(["users"], "readwrite");
  const userStore = transaction.objectStore("users");

  // 以下所有操作都在事务内执行：

  // 添加数据
  userStore.add({ id: 1, name: "张三" });

  // 查询数据
  userStore.get(1);

  // 更新数据
  userStore.put({ id: 1, name: "张三（更新）" });

  // 删除数据
  userStore.delete(1);

  // 游标操作
  userStore.openCursor();

  // 索引操作
  const index = userStore.index("by_email");
  index.get("zhangsan@example.com");
};
```

## 七、性能优化

### 1、事务优化

```javascript
request.onsuccess = (event) => {
  const db = event.target.result;

  // 优化：合并操作到一个事务
  const transaction = db.transaction(["users"], "readwrite");
  const userStore = transaction.objectStore("users");

  // 批量操作在一个事务中完成，减少磁盘写入次数
  userStore.add({ id: 3, name: "王五" });
  userStore.add({ id: 4, name: "赵六" });
  userStore.put({ id: 1, name: "张三（更新）" });

  transaction.oncomplete = () => {
    console.log("所有操作完成，只触发一次磁盘写入");
  };
};
```

### 2、索引优化

```javascript
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const userStore = db.createObjectStore("users", { keyPath: "id" });

  // 优化：为频繁查询的字段创建索引
  userStore.createIndex("by_email", "email", { unique: true }); // 登录查询
  userStore.createIndex("by_name", "name", { unique: false }); // 姓名搜索

  // 注意：避免创建过多索引，会影响写入性能
};
```

## 八、常见问题

### 1、浏览器兼容性检查

```javascript
// 检查浏览器是否支持 IndexedDB
if (!window.indexedDB) {
  console.log("您的浏览器不支持 IndexedDB");
}
```

### 2、存储空间限制

- 通常限制为浏览器可用空间的 50%
- 超过限制会触发 QuotaExceededError
- 可通过 StorageManager API 申请更多空间

### 3、错误处理

```javascript
request.onerror = (event) => {
  const error = event.target.error;
  switch (error.name) {
    case "QuotaExceededError":
      console.error("存储空间不足");
      break;
    case "ConstraintError":
      console.error("违反唯一约束（主键或唯一索引重复）");
      break;
    case "NotFoundError":
      console.error("未找到请求的资源");
      break;
    default:
      console.error("未知错误:", error);
  }
};
```

### 4、版本冲突处理

- 确保所有连接在版本变更时关闭
- 使用 onblocked 和 onversionchange 事件处理
- 版本号只能递增，不能递减

## 九、关键规则总结

1. **事务外操作**：仅能在 `onupgradeneeded` 事件中进行数据库结构修改（创建/删除对象存储空间、索引），以及直接调用 `indexedDB.deleteDatabase()` 和 `db.close()`。

2. **事务内操作**：所有数据操作（增删改查、游标遍历、索引查询）必须在事务中执行，不能在事务外直接操作对象存储空间。

3. **事务生命周期**：每个事务都是独立的，不能跨事务操作；事务完成或出错后自动关闭。

4. **索引使用**：索引必须在 `onupgradeneeded` 事件中创建，使用时需通过对象存储空间的 `index()` 方法获取。

5. **对象属性**：示例中的对象属性（如 `id`、`name`、`email`、`age`、`hobbies`）均为自定义字段，根据实际业务需求设计。

6. **事件使用**：
   - `onupgradeneeded`：唯一可修改数据库结构的事件
   - `onsuccess`：数据库打开成功后执行数据操作
   - `onerror`：全局错误处理
   - `onblocked`：处理版本冲突
   - `onversionchange`：优雅处理数据库升级
   - `transaction.oncomplete/onerror`：事务级别的结果处理
