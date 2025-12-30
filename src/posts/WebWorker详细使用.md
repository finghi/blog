---
title: WebWorker详细使用
icon: laptop-code
# order: 3
date: 2025-12-29
category:
  - 使用指南
tag:
  - WebWorker
  - 多线程
  - 浏览器
---

<div style="font-weight:700; ">WebWorker 是一种在浏览器中运行的后台线程，用于执行耗时的操作，而不会阻塞主线程（即 UI 线程）。它可以在不影响用户体验的情况下，在后台执行任务，如数据处理、计算等。</div>

<!-- more -->

## 一、工作原理

1. **创建 WebWorker** ：在主线程中，通过 `new Worker()` 构造函数创建一个 WebWorker 实例。
2. **加载脚本** ：WebWorker 会加载一个独立的 JavaScript 文件，该文件包含了要在后台执行的代码。
3. **通信** ：主线程和 WebWorker 之间可以通过 `postMessage()` 方法发送消息，也可以通过 `onmessage` 事件接收消息。
4. **终止 WebWorker** ：当任务完成或不再需要 WebWorker 时，主线程可以调用 `worker.terminate()` 方法终止 WebWorker。

## 二、基础概念与核心 API

### 2.1 WebWorker 核心概念

| 概念        | 描述                                                               |
| ----------- | ------------------------------------------------------------------ |
| 主线程      | 浏览器中执行 JavaScript 的主要线程，负责处理 DOM、事件、UI 渲染等  |
| Worker 线程 | 在后台运行的独立线程，负责执行耗时操作，不影响主线程               |
| 消息传递    | 主线程与 Worker 线程之间通过 `postMessage` 和 `onmessage` 进行通信 |
| 脚本文件    | Worker 线程需要一个独立的 JavaScript 文件来执行后台任务            |

### 2.2 核心 API 参考

| API                                  | 所属线程           | 描述                                               |
| ------------------------------------ | ------------------ | -------------------------------------------------- |
| `new Worker(scriptURL)`              | 主线程             | 创建一个新的 Worker 实例，加载并执行指定的脚本文件 |
| `worker.postMessage(data, transfer)` | 主线程/Worker 线程 | 向目标线程发送消息，可以传递数据和可转移对象       |
| `worker.onmessage`                   | 主线程/Worker 线程 | 接收来自目标线程的消息的事件监听器                 |
| `worker.terminate()`                 | 主线程             | 立即终止 Worker 线程，不会有清理过程               |
| `self.close()`                       | Worker 线程        | Worker 线程自身关闭，会执行清理过程                |
| `self.importScripts(urls)`           | Worker 线程        | 在 Worker 线程中同步加载并执行多个脚本文件         |
| `self.onmessage`                     | Worker 线程        | 接收来自主线程的消息的事件监听器                   |
| `self.onerror`                       | Worker 线程        | 监听 Worker 线程内部的错误事件                     |

### 2.3 Worker 线程可访问的全局 API

Worker 线程（包括普通 WebWorker、SharedWorker 和 ServiceWorker）的全局对象是 `self`（等同于 `globalThis`），可访问以下全局方法和对象：

- **数据处理**：`JSON`、`Math`、`Date`、`RegExp`、`ArrayBuffer`、`Blob`、`File`、`FileReader`、`TextEncoder`、`TextDecoder`、`DataView`、`Int8Array`、`Uint8Array`、`Int16Array`、`Uint16Array`、`Int32Array`、`Uint32Array`、`Float32Array`、`Float64Array`、`BigInt64Array`、`BigUint64Array`
- **网络请求**：`fetch`、`XMLHttpRequest`、`FormData`、`Headers`、`Request`、`Response`
- **定时器**：`setTimeout`、`setInterval`、`clearTimeout`、`clearInterval`
- **工具方法**：`console`、`atob`/`btoa`、`URL`、`URLSearchParams`、`URL.createObjectURL`、`URL.revokeObjectURL`
- **加密安全**：`crypto`、`SubtleCrypto`、`CryptoKey`
- **错误处理**：`Error`、`EvalError`、`RangeError`、`ReferenceError`、`SyntaxError`、`TypeError`、`URIError`
- **集合类型**：`Array`、`Object`、`Map`、`Set`、`WeakMap`、`WeakSet`、`ArrayBufferView`
- **结构化克隆**：`structuredClone`
- **其他**：`Proxy`、`Reflect`、`Promise`、`AsyncFunction`、`Generator`、`GeneratorFunction`、`BigInt`、`Symbol`

## 三、创建与使用步骤

### 3.1 创建 普通 WebWorker（DedicatedWorker） 线程

#### 特点

- **单页面使用**：每个普通 WebWorker 只能与创建它的主线程通信
- **简单易用**：API 简洁，学习成本低
- **后台执行**：在独立线程中运行，不阻塞主线程
- **资源隔离**：拥有独立的内存空间和全局对象

#### 生命周期管理

- **创建**：通过 `new Worker()` 创建并加载脚本
- **运行**：脚本加载完成后自动开始执行
- **终止**：
  - 主线程调用 `worker.terminate()` 立即终止（不会执行清理）
  - Worker 线程内部调用 `self.close()` 正常终止（会执行清理）

#### 在主线程中创建 Worker 线程的基本步骤：

::: tabs#fruit
@tab 主页面

```javascript
// 1. 创建 Worker 实例，指定要加载的脚本文件
const worker = new Worker("worker.js");
// 2. 设置消息接收处理函数
worker.onmessage = (event) => {
  console.log("主线程收到消息:", event.data);
};
// 3. 发送消息给 Worker 线程
worker.postMessage("开始执行任务");
```

@tab worker.js

```javascript
// 接收主线程发送的消息
self.onmessage = (event) => {
  console.log("Worker 收到消息:", event.data);
  // 执行耗时操作
  const result = doHeavyWork(event.data);
  // 发送结果回主线程
  self.postMessage(result);
};

// 耗时操作函数
function doHeavyWork(data) {
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += i;
  }
  return { input: data, output: result };
}
```

:::

### 3.2 运行与终止 Worker

::: tabs#fruit
@tab 主页面

```javascript
// 运行 Worker
const worker = new Worker("worker.js");
worker.terminate(); // 使用完毕后终止 Worker
```

@tab worker.js

```javascript
// 在 Worker 线程内部关闭
self.close();
```

:::

### 3.3 错误监听处理

::: tabs#fruit
@tab 主页面

```javascript
// 主线程
const worker = new Worker("worker.js");

worker.onerror = (event) => {
  console.error("Worker 错误:", event.message);
  console.error("错误文件名:", event.filename);
  console.error("错误行号:", event.lineno);

  // 阻止默认错误处理
  event.preventDefault();
};
```

@tab worker.js

```javascript
self.onerror = (errorEvent) => {
  console.error("Worker 内部错误:", errorEvent.message);
  return true; // 阻止错误冒泡到主线程
};
// 或者使用 try-catch 处理特定操作
self.onmessage = (e) => {
  try {
    // 执行可能出错的操作
    const result = JSON.parse(e.data);
    self.postMessage(result);
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
```

:::

## 四、应用场景

1. **数据处理**：处理大量数据、计算密集型任务
2. **图像处理**：图像滤镜、裁剪、缩放等
3. **实时更新**：实时数据处理、图表更新
4. **后台任务**：定时任务、文件上传下载
5. **复杂计算**：数学运算、加密解密、数据压缩

## 五、限制与注意事项

1. **同源限制**：Worker 脚本必须与主线程脚本同源
2. **无 DOM 访问**：Worker 线程不能直接访问 DOM 元素
3. **单线程**：每个 Worker 线程本身是单线程的
4. **全局对象**：Worker 线程的全局对象是 `self`，不是 `window`
5. **通信开销**：频繁的消息传递会带来性能开销
6. **文件限制**：Worker 脚本不能是本地文件（`file://` 协议），必须通过 HTTP/HTTPS 协议加载

## 六、高级功能

### 6.1 SharedWorker（共享线程）

SharedWorker 可以被多个页面共享使用，适用于需要跨页面通信的场景。

#### 6.1.1 核心特点

- **多页面共享**：可以被同一域名下的多个页面共享使用
- **端口通信**：通过 `MessagePort` 进行通信，需要调用 `port.start()` 方法
- **持久运行**：即使没有页面连接，只要有引用就会继续运行
- **独立上下文**：拥有独立的全局上下文和内存空间
- **同源限制**：只能在同一域名下共享

#### 6.1.2 消息通信

SharedWorker 通过端口（port）进行消息通信：

::: tabs#fruit
@tab 主线程 - 页面 1

```javascript
const sharedWorker = new SharedWorker("shared-worker.js");

sharedWorker.port.onmessage = (e) => {
  console.log("页面1收到消息:", e.data);
};

// 发送消息
sharedWorker.port.postMessage("来自页面1的消息");
```

@tab 主线程 - 页面 2

```javascript
const sharedWorker = new SharedWorker("shared-worker.js");

sharedWorker.port.onmessage = (e) => {
  console.log("页面2收到消息:", e.data);
};

// 发送消息
sharedWorker.port.postMessage("来自页面2的消息");
```

@tab shared-worker.js

```javascript
const connections = [];

self.onconnect = (event) => {
  const port = event.ports[0];
  connections.push(port);

  port.onmessage = (e) => {
    // 向所有连接的页面广播消息
    connections.forEach((connection) => {
      connection.postMessage(e.data);
    });
  };
};
```

:::

#### 6.1.3 生命周期管理

- **创建**：通过 `new SharedWorker()` 创建实例
- **连接**：页面通过 `onconnect` 事件建立连接
- **运行**：只要有页面连接就会持续运行
- **终止**：当所有连接都关闭时，SharedWorker 会被自动终止

#### 6.1.4 公共功能

- 支持普通 WebWorker 的所有方法（`postMessage`、`close`、`importScripts`、`onerror`）
- 可访问相同的全局 API（`fetch`、`XMLHttpRequest`、定时器等）

### 6.2 ServiceWorker（服务线程）

ServiceWorker 主要用于离线缓存、后台同步和推送通知：

::: tabs#fruit
@tab 主线程

```javascript
// 主线程
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker 注册成功:", registration.scope);
      })
      .catch((error) => {
        console.log("ServiceWorker 注册失败:", error);
      });
  });
}
```

@tab sw.js

```javascript
self.addEventListener("install", (event) => {
  // 安装阶段缓存静态资源
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll(["/", "/index.html", "/styles.css", "/script.js"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  // 拦截网络请求，优先使用缓存
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

:::

#### 6.2.1 核心 API

- **缓存管理**：`caches.open()`、`caches.match()`、`caches.delete()`、`caches.keys()`
- **客户端管理**：`clients.matchAll()`、`clients.openWindow()`、`clients.claim()`
- **注册管理**：`self.registration`、`self.registration.showNotification()`、`self.registration.pushManager`
- **网络控制**：`self.addEventListener('fetch', callback)`（拦截网络请求）
- **生命周期控制**：`self.addEventListener('install', callback)`、`self.addEventListener('activate', callback)`、`skipWaiting()`（跳过等待直接激活）
- **后台功能**：`self.addEventListener('sync', callback)`（后台同步）、`self.addEventListener('push', callback)`（推送通知）

#### 6.2.2 公共功能

- 支持普通 WebWorker 的基础方法（`postMessage`、`close`、`importScripts`、`onerror`）
- 可访问核心全局 API（`fetch`、`XMLHttpRequest`、定时器等）

### 6.3 方法对比表

| 功能                   | 普通 WebWorker | SharedWorker | ServiceWorker |
| ---------------------- | -------------- | ------------ | ------------- |
| `self.postMessage()`   | ✅             | ✅           | ✅            |
| `self.onmessage`       | ✅             | ✅           | ✅            |
| `self.close()`         | ✅             | ✅           | ✅            |
| `self.importScripts()` | ✅             | ✅           | ✅            |
| `self.onerror`         | ✅             | ✅           | ✅            |
| `self.onconnect`       | ❌             | ✅           | ❌            |
| `fetch` API            | ✅             | ✅           | ✅            |
| `caches` API           | ❌             | ❌           | ✅            |
| `clients` API          | ❌             | ❌           | ✅            |
| `install` 事件         | ❌             | ❌           | ✅            |
| `activate` 事件        | ❌             | ❌           | ✅            |
| `fetch` 事件           | ❌             | ❌           | ✅            |
| `push` 事件            | ❌             | ❌           | ✅            |
| `sync` 事件            | ❌             | ❌           | ✅            |

## 七、总结与最佳实践

### 7.1 总结

WebWorker 是浏览器提供的一种多线程解决方案，可以在后台执行耗时任务，避免阻塞主线程，提高用户体验。它通过消息传递机制与主线程通信，支持传输复杂数据和零拷贝传输。

### 7.2 最佳实践

1. **合理使用 Worker**：只将真正耗时的任务放在 Worker 中执行
2. **减少通信开销**：避免频繁的消息传递，尽量批量处理数据
3. **错误处理**：始终为 Worker 添加错误监听，确保错误能够被及时捕获
4. **资源管理**：使用完毕后及时终止 Worker 线程，释放资源
5. **代码组织**：将 Worker 相关代码与主线程代码分离，保持代码结构清晰
6. **测试与调试**：使用浏览器开发者工具的 "Sources" 面板调试 Worker 代码
7. **考虑兼容性**：在使用高级功能前，检查浏览器兼容性

### 7.3 浏览器兼容性

WebWorker 兼容所有现代浏览器，包括 Chrome、Firefox、Safari、Edge 等。IE10+ 也支持基本的 WebWorker 功能。
