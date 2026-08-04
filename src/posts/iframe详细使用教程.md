---
title: iframe详细使用教程
icon: window
# order: 6
date: 2026-01-20
category:
  - 使用指南
tag:
  - iframe
  - 跨域
  - 浏览器
---

<div style="font-weight:700; ">iframe 是浏览器中用于在页面内嵌入另一个 HTML 文档的标签，它为 Web 开发带来了"页面隔离"的能力。借助 iframe 我们可以实现沙箱隔离、跨域通信、微前端、富文本编辑器预览等功能，但同时也伴随着安全、性能、通信等方面的挑战。本文从基础 API 出发，系统梳理 iframe 的工作原理、通信机制、安全策略与常见应用场景。</div>

<!-- more -->

## 一、基础概念

### 1.1 什么是 iframe

`iframe`（inline frame，内联框架）是 HTML 中一种能够把另一个 HTML 页面嵌入到当前页面的标签。浏览器会为 iframe 创建一个独立的 **浏览器上下文（Browsing Context）**，它拥有自己的：

- 独立的 `window` / `document` / `history` / `location`
- 独立的作用域（变量、函数、CSS 相互隔离）
- 独立的加载生命周期

### 1.2 基础语法

```html
<iframe
  src="https://example.com"
  width="800"
  height="400"
  frameborder="0"
  allowfullscreen
  referrerpolicy="no-referrer"
  sandbox
></iframe>
```

### 1.3 常用属性

| 属性               | 类型   | 说明                                       |
| ------------------ | ------ | ------------------------------------------ |
| `src`              | string | 嵌入页面的 URL                             |
| `srcdoc`           | string | 直接嵌入一段 HTML 字符串（优先级高于 src） |
| `name`             | string | iframe 的名字，用于 `target` 跳转          |
| `width` / `height` | string | 宽高（支持 `100%`）                        |
| `frameborder`      | number | 是否显示边框（已废弃，建议用 CSS）         |
| `allow`            | string | 权限策略（全屏、地理位置、摄像头等）       |
| `allowfullscreen`  | -      | 是否允许进入全屏                           |
| `referrerpolicy`   | string | Referer 策略                               |
| `sandbox`          | string | 安全沙箱，限制嵌入页面的权限               |
| `loading`          | string | `lazy` 懒加载，`eager` 立即加载            |

### 1.4 srcdoc 示例

```html
<iframe srcdoc="<h1>Hello from srcdoc</h1><p>当前时间：<span id='t'></span></p>"
        onload="document.getElementById('t').textContent = new Date().toLocaleString()">
</iframe>
```

> 注意：`srcdoc` 内容会被当作独立文档解析，可以包含 `<style>`、`<script>`，但脚本默认不会执行，除非配合 `sandbox` 显式开启。

## 二、父子页面的访问关系

### 2.1 同源下的相互访问

当父页面与 iframe 页面**同源**时，双方可以通过 `contentWindow` / `parent` / `top` 直接访问彼此的 DOM 与变量。

```js
// 父页面访问 iframe
const iframe = document.getElementById('myIframe');
iframe.onload = () => {
  const childDoc = iframe.contentWindow.document;
  childDoc.getElementById('title').innerText = '被父页面修改';
};

// iframe 访问父页面
if (window.parent !== window) {
  window.parent.document.body.style.background = '#f0f0f0';
}
```

### 2.2 `window.top` / `window.parent` / `window.self`

| 引用            | 含义                            |
| --------------- | ------------------------------- |
| `window.self`   | 当前窗口自身（等价于 `window`） |
| `window.parent` | 父窗口（没有父窗口时等于自身）  |
| `window.top`    | 最顶层窗口                      |

判断是否在 iframe 中：

```js
const isInIframe = window.self !== window.top;
const isCrossOriginFrame = (() => {
  try {
    window.top.location.href; // 跨域会抛错
    return false;
  } catch (e) {
    return true;
  }
})();
```

### 2.3 跨域限制

如果父页面与 iframe **不同源**（协议、域名、端口任一不同），直接访问 `contentWindow.document` 会抛出：

```
DOMException: Blocked a frame with origin "https://a.com" from accessing a cross-origin frame.
```

此时必须使用 `postMessage` 进行通信。

## 三、跨域通信：`postMessage`

`window.postMessage` 是浏览器官方推荐的跨窗口通信方案，支持父子窗口、iframe、标签页、甚至 Worker 之间的消息传递。

### 3.1 核心 API

```js
// 发送方
targetWindow.postMessage(message, targetOrigin, [transfer]);

// 接收方
window.addEventListener('message', (event) => {
  // event.source  —— 发送源窗口
  // event.origin  —— 发送源的 origin（重要，用于安全校验）
  // event.data    —— 消息内容
});
```

### 3.2 参数说明

| 参数           | 说明                                                    |
| -------------- | ------------------------------------------------------- |
| `message`      | 任意可序列化对象（结构化克隆算法）                      |
| `targetOrigin` | 目标 origin，`*` 表示不限制（**不推荐**）               |
| `transfer`     | 可选，Transferable 对象（`ArrayBuffer` 等）的所有权转移 |

### 3.3 父页面 → iframe

```js
// 父页面
const iframeRef = document.getElementById('childFrame');
iframeRef.contentWindow.postMessage(
  { type: 'init', payload: { user: 'Alice' } },
  'https://child.example.com'
);

// iframe 页面
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://parent.example.com') return; // 关键：校验 origin
  if (event.data?.type === 'init') {
    console.log('收到初始化消息', event.data.payload);
    // 回执
    event.source.postMessage({ type: 'ready' }, event.origin);
  }
});
```

### 3.4 iframe → 父页面

```js
// iframe 内部
window.parent.postMessage(
  { type: 'data', value: 42 },
  'https://parent.example.com'
);

// 父页面
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://child.example.com') return;
  console.log('收到子页面消息', event.data);
});
```

### 3.5 多层嵌套：指定 targetOrigin 的重要性

```
top  →  parentA  →  parentB  →  iframe
```

- `iframe.contentWindow.postMessage(data, origin)` → 只能进入 iframe 的 `window`
- `parent.postMessage(data, origin)` → 进入上一层
- `top.postMessage(data, origin)` → 直达最顶层
- 使用 `event.source.postMessage` 回执是最安全的做法

### 3.6 安全要点

> [!danger]
> **永远校验 `event.origin`**：生产环境切勿使用 `*` 作为 targetOrigin，也切勿忽略 origin 校验。恶意网站可以通过 iframe 嵌入你的页面并发送虚假消息。

> [!danger]
> **校验消息结构**：使用 `JSON.parse` 或白名单字段校验，防止脚本注入。

> [!danger]
> **不要信任 `message` 的内容**：`postMessage` 的数据只是字符串/对象，不能替代后端鉴权。

安全接收模板：

```js
const ALLOWED_ORIGINS = ['https://trusted.example.com'];

window.addEventListener('message', (event) => {
  if (!ALLOWED_ORIGINS.includes(event.origin)) return;
  if (!event.data || typeof event.data !== 'object') return;

  const { type, payload } = event.data;
  switch (type) {
    case 'ping':
      event.source.postMessage({ type: 'pong' }, event.origin);
      break;
    case 'updateTheme':
      applyTheme(payload.theme);
      break;
    default:
      console.warn('未知消息类型', type);
  }
});
```

## 四、安全沙箱：`sandbox` 与 `allow`

### 4.1 `sandbox` 属性

`sandbox` 为 iframe 创建一个受限的沙箱环境，禁用嵌入页面的危险能力。

| sandbox 取值                     | 效果                                                      |
| -------------------------------- | --------------------------------------------------------- |
| （空字符串）                     | 启用所有限制（最严格）                                    |
| `allow-scripts`                  | 允许执行 JS                                               |
| `allow-same-origin`              | 允许保持源身份（取消跨域限制，但仍不能访问父页面 cookie） |
| `allow-forms`                    | 允许提交表单                                              |
| `allow-popups`                   | 允许弹出窗口                                              |
| `allow-modals`                   | 允许 `alert` / `confirm` / `prompt`                       |
| `allow-top-navigation`           | 允许 iframe 导航最顶层窗口                                |
| `allow-popups-to-escape-sandbox` | 允许弹出的窗口脱离沙箱                                    |
| `allow-presentation`             | 允许进入演示模式                                          |
| `allow-downloads`                | 允许下载文件                                              |
| `allow-modals`                   | 允许模态对话框                                            |

示例：

```html
<!-- 最严格：禁止脚本、禁止同源、禁止弹窗 -->
<iframe src="untrusted.html" sandbox></iframe>

<!-- 允许执行脚本但仍视为不同源 -->
<iframe src="untrusted.html" sandbox="allow-scripts"></iframe>

<!-- 常见：允许脚本 + 同源 -->
<iframe src="trusted.html" sandbox="allow-scripts allow-same-origin"></iframe>
```

### 4.2 沙箱的实际影响

- **没有 `allow-same-origin`**：iframe 内的页面会被视为唯一的匿名 origin，所有 cookie / localStorage / Service Worker 均独立。
- **没有 `allow-scripts`**：`<script>` 标签不会执行，`onxxx` 属性事件也不会触发。
- **没有 `allow-forms`**：`<form>` 无法提交。
- **没有 `allow-popups`**：`window.open`、`target="_blank"` 会失败。

### 4.3 `allow` 属性（Permissions Policy）

`allow` 用于控制 iframe 可以使用的浏览器特性（摄像头、麦克风、全屏、地理位置等）：

```html
<iframe
  src="camera-app.html"
  allow="camera; microphone; geolocation https://trusted.example.com"
></iframe>
```

常用特性：`camera`、`microphone`、`geolocation`、`fullscreen`、`autoplay`、`clipboard-read`、`clipboard-write`、`payment`、`usb`、`xr-spatial-tracking`。

### 4.4 响应头 `X-Frame-Options` 与 `Content-Security-Policy`

服务端通过响应头控制自己的页面能否被 iframe 嵌入：

| 响应头                                                          | 说明               |
| --------------------------------------------------------------- | ------------------ |
| `X-Frame-Options: DENY`                                         | 完全禁止被嵌入     |
| `X-Frame-Options: SAMEORIGIN`                                   | 只允许同源页面嵌入 |
| `Content-Security-Policy: frame-ancestors 'self' https://a.com` | 更灵活的白名单控制 |

## 五、样式与布局

### 5.1 自适应高度

iframe 高度不会自动随内容变化，常见解决方案：

::: tabs#height
@tab 方案1：postMessage 回传高度

```js
// iframe 内部
function reportHeight() {
  const h = document.documentElement.scrollHeight;
  window.parent.postMessage({ type: 'iframe-height', height: h }, '*');
}
window.addEventListener('load', reportHeight);
new ResizeObserver(reportHeight).observe(document.body);

// 父页面
window.addEventListener('message', (e) => {
  if (e.data?.type === 'iframe-height') {
    document.getElementById('myIframe').style.height = e.data.height + 'px';
  }
});
```

@tab 方案2：CSS 100% 高度

```html
<div style="position:relative;width:100%;height:0;padding-bottom:56.25%;">
  <iframe src="..." style="position:absolute;inset:0;width:100%;height:100%;border:0;"></iframe>
</div>
```

@tab 方案3：`scaling` 缩放

```js
function scaleIframe(iframe) {
  const baseW = 1920, baseH = 1080;
  const scale = Math.min(
    window.innerWidth / baseW,
    window.innerHeight / baseH
  );
  iframe.style.transform = `scale(${scale})`;
  iframe.style.transformOrigin = '0 0';
  iframe.style.width = baseW + 'px';
  iframe.style.height = baseH + 'px';
}
```

:::

### 5.2 去除默认样式

```css
iframe {
  border: 0;
  margin: 0;
  padding: 0;
  display: block;
  background: transparent;
}
```

## 六、性能优化

### 6.1 懒加载

```html
<iframe src="..." loading="lazy"></iframe>
```

### 6.2 延迟挂载

```js
// 滚动到可视区时才加载
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const iframe = entry.target;
      iframe.src = iframe.dataset.src;
      io.unobserve(iframe);
    }
  });
});
document.querySelectorAll('iframe[data-src]').forEach((el) => io.observe(el));
```

### 6.3 资源加载策略

- iframe 会阻塞父页面的 `load` 事件（可使用 `async` 脚本或动态创建 iframe 避免）。
- 每个 iframe 都会启动独立的渲染进程（Chrome 下最多共享一个进程），过多 iframe 会显著增加内存占用。
- 对非首屏 iframe 建议使用 `display: none` + 按需切换 `src`。

### 6.4 预加载与连接优化

```html
<link rel="preconnect" href="https://child.example.com">
<link rel="dns-prefetch" href="https://child.example.com">
<iframe src="https://child.example.com/app"></iframe>
```

## 七、常见应用场景

### 7.1 广告嵌入

广告代码通常不可信，iframe 是天然的隔离容器，配合 `sandbox` 可以防止广告脚本影响主站。

```html
<iframe
  src="https://ad.example.com/show?adid=123"
  sandbox="allow-scripts allow-forms allow-popups"
  allow="autoplay; fullscreen"
  style="width:300px;height:250px;border:0;"
></iframe>
```

### 7.2 富文本编辑器预览

```html
<!-- 沙箱中执行用户编写的 HTML/CSS/JS -->
<iframe
  ref={previewRef}
  sandbox="allow-scripts"
  srcDoc={`<style>${css}</style><script>${js}<\/script>${html}`}
></iframe>
```

### 7.3 微前端（iframe 方案）

利用 iframe 的天然隔离性实现微前端：

```js
// 主应用
function loadMicroApp(name, url) {
  const container = document.getElementById('micro-container');
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.name = name;
  iframe.style.cssText = 'width:100%;height:100%;border:0;';
  container.appendChild(iframe);

  // 与子应用建立通道
  const channel = new MessageChannel();
  iframe.contentWindow.postMessage(
    { type: 'init', port: channel.port2 },
    '*',
    [channel.port2]
  );
  channel.port1.onmessage = onMicroAppMessage;
}
```

### 7.4 单点登录（SSO）

父页面通过 iframe 访问认证域的 cookie，实现跨系统登录态共享。

### 7.5 文件上传下载

跨域场景下通过 iframe 提交表单或下载文件，避免刷新主页面。

### 7.6 评论 / 第三方组件

Disqus、Giscus 等评论系统都基于 iframe 实现与主站的隔离。

## 八、常见问题与陷阱

### 8.1 点击 iframe 内部元素导致父页面失焦

某些浏览器在点击 iframe 内部时，父页面会触发 `blur`，影响全局快捷键、输入框聚焦等。可通过 `window.focus` / `blur` 监听恢复。

### 8.2 iframe 中的 `document.domain`

旧方案中通过设置 `document.domain = 'parent.com'` 实现子域之间的访问，此方案已被废弃（HTML5 规范已移除），请使用 `postMessage`。

### 8.3 iframe 内 `localStorage` 不共享

不同源的 iframe 拥有独立的 storage。父页面无法直接读取 iframe 内的 cookie / localStorage，需要 `postMessage` 协作。

### 8.4 第三方 cookie 被拦截

Chrome 的第三方分区存储（Partitioned）和 Safari 的 ITP 会限制 iframe 内的第三方 cookie。解决方案：

1. 使用 `Partitioned` 属性标记 Cookie；
2. 使用 `postMessage` 代替 Cookie 传递身份；
3. 使用 `SameSite=None; Secure` 让浏览器允许第三方 Cookie。

### 8.5 内存泄漏

动态创建的 iframe 在被移除时，内部 `setInterval`、事件监听、Worker 不会自动清理，导致内存泄漏。

```js
function removeIframe(iframe) {
  try {
    iframe.contentWindow.stop?.(); // 停止加载
    iframe.src = 'about:blank';  // 让浏览器释放资源
  } finally {
    iframe.remove();
  }
}
```

### 8.6 父子窗口循环引用

```js
// 错误示例
// 子页面
window.parent.postMessage('hello', '*');
window.addEventListener('message', () => {
  // 接收到自己发出的消息
});

// 父页面
iframe.contentWindow.postMessage('hello', '*');
window.addEventListener('message', () => {
  // 接收到子页面转发来的消息
});
```

使用 `event.source === iframe.contentWindow` 区分消息来源，避免自接收。

## 九、与其他通信方案对比

| 方案                            | 适用场景               | 跨域   | 复杂度 |
| ------------------------------- | ---------------------- | ------ | ------ |
| iframe + `postMessage`          | 父子窗口、跨域通信     | 支持   | 中     |
| `BroadcastChannel`              | 同源多标签页广播       | 不支持 | 低     |
| `localStorage` + `storage` 事件 | 同源状态同步           | 不支持 | 低     |
| `MessageChannel`                | Worker 间、iframe 内部 | 不支持 | 中     |
| `WebSocket`                     | 服务端双向实时通信     | 支持   | 高     |
| `EventSource`（SSE）            | 服务端单向推送         | 支持   | 中     |

## 十、最佳实践清单

> [!tip]
> 1. **始终校验 `event.origin`**，不要用 `*` 作为 targetOrigin。
> 2. **不信任任何消息内容**，对 `data` 做结构校验。
> 3. **嵌入不可信内容时务必加 `sandbox`**，必要时配合 `allow` 精细控制权限。
> 4. **高度自适应使用 `postMessage` + `ResizeObserver`**，兼容性与体验最佳。
> 5. **非首屏 iframe 用 `loading="lazy"` 或 IntersectionObserver 懒加载**。
> 6. **不要用 `document.domain` 破解同源策略**，改用 `postMessage`。
> 7. **移除 iframe 前先将 `src` 置为 `about:blank`**，防止内存泄漏。
> 8. **敏感功能使用 `Permissions-Policy` / `X-Frame-Options` 保护**。
> 9. **监听 `message` 时始终判断 `event.source`**，区分不同来源的消息。
> 10. **分层应用建议使用 `MessageChannel`**，为每个 iframe 创建独立通道，避免消息串扰。

## 参考链接

- [MDN iframe 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe)
- [MDN postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)
- [MDN Permissions Policy](https://developer.mozilla.org/en-US/docs/Web/Privacy/Permissions_Policy)
- [Chrome 第三方 Cookie 限制](https://developer.chrome.com/docs/privacy-sandbox/third-party-cookie-phase-out/)