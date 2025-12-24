---
title: JSONP详细使用 展示
icon: laptop-code
# order: 3
date: 2025-03-20
category:
  - 使用指南
tag:
  - JSONP
---

<div style="font-weight:700; ">JSONP（JSON with Padding）是一种跨域请求数据的方法，常用于前端开发中从不同域获取数据。它利用了 script  标签可以跨域加载资源的特点，绕过浏览器的同源策略限制。</div>

<!-- more -->

### 工作原理

1. 在 **script** 标签，请求 url 中指定一个回调函数，服务器会将数据作为该函数的参数返回。
2. 当脚本加载完成后，浏览器会执行返回的 JavaScript 代码，即回调函数并处理传入的数据

### node 后端服务一

::: tabs#fruit
@tab nodejs

```js
const express = require("express");
const app = express();
const port = 3050;
const { join } = require("path");

app.use(express.static(join(__dirname, "pubilc")));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

@tab index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script>
      function datafunc(data) {
        console.log("收到消息", data);
      }
    </script>
    <script src="http://localhost:3000/index?callback=datafunc"></script>
  </body>
</html>
```

:::

### node 后端服务二

::: tabs#fruit
@tab nodejs

```js
const express = require("express");
const app = express();
const port = 3000;

const data = {
  name: "张三",
  age: 25,
};
app.get("/index", (req, res) => {
  const callback = req.query.callback;
  console.log(req.query);
  if (callback) {
    res.send(`${callback}(${JSON.stringify(data)})`);
  } else {
    res.json(data);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```
:::

### 优缺点

- 优点
  1、 **简单易用** : 实现非常简单，只需要 \<script\> 标签
  2、 **兼容性好** ：支持所有现代浏览器和旧版浏览器。
  3、 **可以跨域** ：能够绕过浏览器的同源策略，实现跨域请求。

- 缺点
  1、 **只能发送 GET 请求** ：无法使用其他的 HTTP 方法 （如 POST、PUT、DELETE 等）。
  2、 **安全性问题** ：由于 JSONP 需要执行服务器返回的函数，存在一定的安全风险（如注入攻击）
  3、 **错误处理困难** ：无法捕获请求过程中发生的错误。

### 注意事项

1、 安全性：确保只从可信的服务器请求数据，避免安全风险。
2、 错误处理：由于 JSONP 无法捕获错误，建议在回调函数中添加一些错误处理逻辑。
3、 替代方案：在现代开发中，通常推荐使用 CORS（跨域资源共享）来实现跨域请求，因为它更灵活且安全。
