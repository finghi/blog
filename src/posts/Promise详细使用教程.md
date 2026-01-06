---
title: Promise详细使用教程
icon: laptop-code
# order: 3
date: 2026-01-06
category:
  - 使用指南
tag:
  - Promise
  - JavaScript
---

<div style="font-weight:700; ">Promise是JavaScript中处理异步操作的对象，它代表了一个异步操作的最终完成或失败，以及其结果值。Promise提供了一种更优雅的方式来处理异步代码，避免了回调地狱（callback hell）的问题。</div>

<!-- more -->

### 基本概念

Promise有三种状态：
- **pending（等待中）**：初始状态，既不是成功，也不是失败状态。
- **fulfilled（已成功）**：操作成功完成。
- **rejected（已失败）**：操作失败。

Promise状态一旦改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。

### 状态转换图

Promise的状态转换可以用以下流程描述：

```
pending (初始状态)
├─ resolve() ──> fulfilled ──> then() 回调
│                              └─ finally() 回调
└─ reject() ───> rejected ───> catch() 回调
                               └─ finally() 回调
```

- 从 **pending** 状态可以转换为 **fulfilled** 或 **rejected** 状态
- 一旦状态转换为 **fulfilled** 或 **rejected**，就无法再改变
- **fulfilled** 状态会触发 **then()** 回调
- **rejected** 状态会触发 **catch()** 回调
- 无论最终状态如何，**finally()** 回调都会执行

### 创建Promise

使用`new Promise()`构造函数创建一个新的Promise对象，构造函数接受一个执行器函数（executor function），该函数有两个参数：`resolve`和`reject`。

::: tabs#promise
@tab 创建Promise

```js
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('操作成功完成！');
    } else {
      reject(new Error('操作失败！'));
    }
  }, 1000);
});
```

@tab 使用Promise

```js
promise
  .then(result => {
    console.log('成功:', result);
  })
  .catch(error => {
    console.error('失败:', error);
  });
```

:::

### Promise的方法

#### then()

`then()`方法返回一个新的Promise实例，用于处理成功的结果。它接受两个参数：一个是成功时的回调函数，另一个是失败时的回调函数（可选）。

```js
promise.then(
  result => {
    console.log('成功:', result);
  },
  error => {
    console.error('失败:', error);
  }
);
```

#### catch()

`catch()`方法返回一个新的Promise实例，用于处理失败的结果。它是`then(null, rejection)`的语法糖。

```js
promise.catch(error => {
  console.error('失败:', error);
});
```

#### finally()

`finally()`方法返回一个新的Promise实例，无论Promise是成功还是失败，都会执行finally中的回调函数。

```js
promise
  .then(result => {
    console.log('成功:', result);
  })
  .catch(error => {
    console.error('失败:', error);
  })
  .finally(() => {
    console.log('无论成功或失败都会执行');
  });
```

### Promise的静态方法

#### Promise.resolve()

创建一个立即解决的Promise。

```js
const resolvedPromise = Promise.resolve('成功结果');
resolvedPromise.then(result => console.log(result)); // 成功结果
```

#### Promise.reject()

创建一个立即拒绝的Promise。

```js
const rejectedPromise = Promise.reject(new Error('失败原因'));
rejectedPromise.catch(error => console.error(error)); // Error: 失败原因
```

#### Promise.all()

等待所有Promise都完成（或第一个失败）。

```js
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve) => setTimeout(resolve, 100, 'foo'));

Promise.all([promise1, promise2, promise3]).then(values => {
  console.log(values); // [3, 42, "foo"]
});
```

#### Promise.race()

等待第一个完成的Promise。

```js
const promise1 = new Promise((resolve) => setTimeout(resolve, 500, 'one'));
const promise2 = new Promise((resolve) => setTimeout(resolve, 100, 'two'));

Promise.race([promise1, promise2]).then(value => {
  console.log(value); // "two"
});
```

#### Promise.allSettled()

等待所有Promise都完成，无论成功或失败。

```js
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));

Promise.allSettled([promise1, promise2]).then(results => {
  console.log(results);
  /*
  [
    { status: "fulfilled", value: 3 },
    { status: "rejected", reason: "foo" }
  ]
  */
});
```

#### Promise.any()

等待第一个成功的Promise，只要有一个成功就会返回成功的结果。

```js
const promise1 = new Promise((resolve, reject) => setTimeout(reject, 100, 'error1'));
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 500, 'error2'));
const promise3 = new Promise((resolve) => setTimeout(resolve, 1000, 'success'));

Promise.any([promise1, promise2, promise3]).then(value => {
  console.log(value); // "success"
});
```

### 链式调用

Promise的一个重要特性是可以链式调用，避免回调地狱。

```js
function fetchUser() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: 1 }), 100);
  });
}

function fetchPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve([{ userId, title: 'Post 1' }]), 100);
  });
}

fetchUser()
  .then(user => fetchPosts(user.id))
  .then(posts => console.log(posts))
  .catch(error => console.error(error));
```

### 错误处理

在Promise链中，可以在任何位置捕获错误，并且错误会沿着链传递，直到被捕获。

```js
fetchUser()
  .then(user => {
    // 可能抛出错误
    if (!user.id) throw new Error('User ID not found');
    return fetchPosts(user.id);
  })
  .then(posts => {
    console.log(posts);
    // 可能抛出错误
    if (posts.length === 0) throw new Error('No posts found');
  })
  .catch(error => {
    console.error('发生错误:', error);
  });
```

### async/await 结合

ES2017引入了async/await，它是基于Promise的语法糖，让异步代码看起来更像同步代码。

```js
async function getUserPosts() {
  try {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    console.log(posts);
    return posts;
  } catch (error) {
    console.error('发生错误:', error);
    throw error;
  }
}

// 调用async函数
getUserPosts();
```

### 实际应用场景

#### 1. API请求

```js
function fetchData(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('API Data:', data);
      return data;
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

// 使用
fetchData('https://api.example.com/data');
```

#### 2. 图片加载

```js
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

// 使用
loadImage('https://example.com/image.jpg')
  .then(img => {
    document.body.appendChild(img);
  })
  .catch(error => {
    console.error('Image loading error:', error);
  });
```

#### 3. 延迟执行

```js
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 使用
delay(2000)
  .then(() => console.log('2秒后执行'));
```

### 最佳实践

1. **始终处理错误**：使用catch()方法捕获Promise链中的错误
2. **不要忽略Promise**：始终处理Promise的返回值，即使你不关心结果
3. **避免嵌套Promise**：使用链式调用代替嵌套Promise
4. **使用async/await**：对于复杂的异步流程，使用async/await可以使代码更清晰
5. **使用Promise.all()**：当需要并行执行多个异步操作时，使用Promise.all()可以提高性能
6. **不要在Promise构造函数中使用return**：应该使用resolve()或reject()来结束Promise
7. **使用Promise.resolve()和Promise.reject()**：当需要创建一个立即解决或拒绝的Promise时，使用这些静态方法更简洁

### 总结

Promise是JavaScript中处理异步操作的重要工具，它提供了一种更优雅的方式来处理异步代码，避免了回调地狱的问题。通过使用Promise的各种方法和特性，可以编写出更清晰、更易于维护的异步代码。

随着ES2017中async/await的引入，异步代码的编写变得更加简单和直观，但async/await的底层仍然是基于Promise实现的，因此深入理解Promise的工作原理和使用方法对于编写高质量的JavaScript代码至关重要。