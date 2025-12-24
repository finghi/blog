---
title: Ajax动态取消请求
icon: laptop-code
# order: 3
date: 2025-03-21
category:
  - 使用指南
tag:
  - AJAX
---

在使用 AJAX（Asynchronous JavaScript and XML）进行网络请求时，有时可能需要取消正在进行的请求，例如当用户切换页面或取消操作时。

<!-- more -->

## node 后端

::: tabs#fruit
@tab nodejs

```js
const express = require("express");
const { join } = require("path");
const app = express();
const port = 3000;
const data = {
  name: "张三",
  age: 25,
};
app.use(express.static(join(__dirname, "pubilc")));
app.get("/getindex", (req, res) => {
  setTimeout(() => {
    res.json(data);
  }, 15000);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```
:::

## 前端使用

> 1、传统的 XMLHttpRequest，可以通过调用 abort() 方法来取消请求。

> 2、现代的 fetch API，可以通过 AbortController 来取消请求。

::: tabs#fruit
@tab XHR.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <button class="start">开始</button>
    <button class="stop">结束</button>
    <script>
      let xhr;
      function startfunc() {
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            // 请求完成
            if (xhr.status === 200) {
              console.log("请求成功:", xhr.responseText);
            } else {
              console.log("请求失败:", xhr.status);
            }
          }
        };
        xhr.open("GET", "http://localhost:3000/getindex", true); // 打开请求
        xhr.send(); // 发送请求
      }
      document.querySelector(".stop").addEventListener("click", () => {
        xhr.abort();
      });
      document.querySelector(".start").addEventListener("click", () => {
        startfunc();
      });
    </script>
  </body>
</html>
```
@tab fetch.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <button class="start">开始</button>
    <button class="stop">结束</button>
    <script>
      const controller = new AbortController();

      function startFetch() {
        fetch("http://localhost:3000/getindex", { signal: controller.signal })
          .then((res) => res.json())
          .then((res) => {
            console.log("数据加载成功", res);
          })
          .catch((error) => {
            if (error.name === "AbortError") {
              console.log("请求1已取消:", error);
            } else {
              console.error("请求1失败:", error);
            }
          });
      }
      document.querySelector(".stop").addEventListener("click", () => {
        controller.abort();
      });
      document.querySelector(".start").addEventListener("click", () => {
        startFetch();
      });
    </script>
  </body>
</html>
```
:::
