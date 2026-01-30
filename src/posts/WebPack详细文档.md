---
title: WebPack详细文档
icon: laptop-code
# order: 3
date: 2026-01-06
category:
  - 使用指南
tag:
  - Webpack
  - 前端构建
---

<div style="font-weight:700; ">Webpack是一个现代JavaScript应用程序的静态模块打包器(module bundler)。它能够将多个模块及其依赖关系打包成一个或多个静态资源文件，方便在浏览器中加载。Webpack提供了强大的模块化支持，能够处理JavaScript、CSS、图片等多种资源类型。</div>

<!-- more -->

## 1. 核心概念

Webpack 有五个核心概念，理解这些概念是掌握 Webpack 的基础：

### 1.1 Entry（入口）

入口指示 Webpack 应该从哪个模块开始构建其内部依赖图，从而确定哪些模块需要被打包。入口点可以是单个文件、多个文件、动态生成的文件，甚至是一个返回入口配置的函数。

#### 1.1.1 单入口配置

```js
module.exports = {
  entry: "./src/index.js", // 指定从src/index.js文件开始打包
};
```

这是最简单的入口配置，指定了单个入口文件。Webpack 会从`./src/index.js`开始分析依赖关系，并构建出完整的依赖图。

这种配置适用于单页面应用（SPA），所有的 JavaScript 代码都会被打包到一个 bundle 中。

#### 1.1.2 多入口配置

```js
module.exports = {
  entry: {
    main: "./src/index.js", // 主页面入口
    vendor: "./src/vendor.js", // 第三方库入口
    admin: "./src/admin/index.js", // 后台管理页面入口
  },
};
```

多入口配置允许将不同的代码块分离到不同的 bundle 中，每个入口都会生成一个独立的 bundle 文件。这种配置适用于多页面应用（MPA），或者需要将第三方库与业务代码分离的场景。

这种配置适合多页面应用（比如一个网站有首页、登录页、后台管理页等），或者需要把第三方库（如 jQuery、React）和自己的业务代码分开打包的情况。

使用多入口时，需要在 output 配置中用`[name]`这个"占位符"，Webpack 会自动把它替换成入口的名字（比如 main、vendor、admin）。

#### 1.1.3 数组形式的入口配置

```js
module.exports = {
  entry: ["./src/index.js", "./src/init.js"],
};
```

数组形式的入口配置是把多个文件"合并"成一个入口。Webpack 会按照数组的顺序依次加载这些文件，然后把它们打包成一个文件。

这种配置适合需要在主文件之前加载一些初始化代码的场景，比如：

- 加载 polyfill（让旧浏览器支持新特性的代码）
- 设置全局样式
- 初始化全局变量

可以理解为：先穿内衣（init.js），再穿外套（index.js），最后把整套衣服打包起来。

#### 1.1.4 动态入口配置

```js
module.exports = {
  entry: () =>
    new Promise((resolve) => {
      // 这里可以写判断逻辑，比如根据环境变量、用户选择等来决定用哪个入口
      setTimeout(() => {
        resolve("./src/index.js");
      }, 1000);
    }),
};
```

动态入口配置就是"根据条件来决定用哪个入口"。入口配置可以是一个函数，这个函数返回一个 Promise，等异步操作完成后再确定具体的入口文件。

这种配置适合需要根据不同情况选择不同入口的场景：

- 根据环境变量选择（比如开发环境用 dev 入口，生产环境用 prod 入口）
- 根据用户配置选择不同主题的入口
- 从服务器获取最新的入口信息

#### 1.1.5 高级入口配置

```js
module.exports = {
  entry: {
    main: {
      import: "./src/index.js", // 指定入口文件路径
      dependOn: "vendor", // 依赖vendor入口
      filename: "main.[contenthash].js", // 指定输出文件名
    },
    vendor: {
      import: "./src/vendor.js",
      filename: "vendor.[contenthash].js",
    },
    admin: {
      import: "./src/admin/index.js",
      dependOn: ["vendor", "common"], // 依赖多个入口
      filename: "admin/[name].[contenthash].js", // 输出到admin目录
    },
    common: {
      import: "./src/common.js",
      filename: "common.[contenthash].js",
    },
  },
};
```

Webpack 5 支持更高级的入口配置，每个入口都可以设置详细的属性：

- `import`：指定入口文件的路径（这是必须的）
- `dependOn`：指定当前入口依赖的其他入口（比如 main 依赖 vendor，意味着 vendor 会先打包）
- `filename`：指定当前入口打包后的文件名

这种配置适合复杂的多页面应用，可以更精细地控制各个入口之间的关系和输出文件的位置。

举个例子：假设 main 页面需要用到 vendor 里的 jQuery 库，那么设置`dependOn: "vendor"`后，Webpack 会先打包 vendor，再打包 main，确保 jQuery 在 main 之前加载。

### 1.2 Output（输出）

输出配置就是告诉 Webpack："打包后的文件要放到哪里？叫什么名字？"。它控制着所有打包结果的存放位置和命名规则，包括入口打包的文件、代码分割生成的文件，以及各种资源文件（图片、CSS 等）。

可以把 Output 想象成"快递包裹的目的地和标签"：

- `path`是收货地址（文件存放目录）
- `filename`是包裹上的标签（文件名）
- `publicPath`是快递的配送路线（浏览器加载资源的 URL 路径）

#### 1.2.1 基本输出配置

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"), // 打包后的文件放到dist目录
    filename: "bundle.js", // 打包后的文件名叫bundle.js
  },
};
```

这是最基本的输出配置，包含两个核心属性：

- `path`：指定打包文件的存放目录，必须是绝对路径（所以需要用 path.resolve 来生成）
- `filename`：指定打包后的文件名

执行打包后，会在项目根目录下生成一个 dist 文件夹，里面有一个 bundle.js 文件，这就是 Webpack 打包的结果。

#### 1.2.2 多入口输出配置

```js
const path = require("path");

module.exports = {
  entry: {
    main: "./src/index.js", // 主页面入口
    vendor: "./src/vendor.js", // 第三方库入口
    admin: "./src/admin/index.js", // 后台管理页面入口
  },
  output: {
    path: path.resolve(__dirname, "dist"), // 所有打包文件都放到dist目录
    filename: "[name].bundle.js", // 用[name]占位符，会自动替换成入口的名字
  },
};
```

当使用多入口配置时，需要在`filename`中使用`[name]`这个"占位符"。Webpack 会自动把`[name]`替换成各个入口的名字。

这样配置后，会生成以下 3 个文件：

- `main.bundle.js`（来自 main 入口）
- `vendor.bundle.js`（来自 vendor 入口）
- `admin.bundle.js`（来自 admin 入口）

可以理解为："每个入口都要生成一个文件，文件名就用入口的名字加上.bundle.js 后缀"。

#### 1.2.3 输出文件名占位符

Webpack 支持多种"占位符"来动态生成输出文件名，这些占位符会在打包时被替换成实际的值：

| 占位符            | 通俗解释                                               |
| ----------------- | ------------------------------------------------------ |
| `[name]`          | 入口文件的名字（比如 main、vendor）                    |
| `[id]`            | Webpack 给每个模块分配的编号（一个数字）               |
| `[hash]`          | 每次打包都会生成的随机字符串（只要动了任何文件都会变） |
| `[contenthash]`   | 只有当前文件内容变化时才会改变的字符串（常用）         |
| `[fullhash]`      | Webpack 5 中`[hash]`的新名字，作用一样                 |
| `[contenthash:8]` | 只取哈希值的前 8 位（太长了没用，8 位足够区分）        |

```js
const path = require("path");

module.exports = {
  entry: {
    main: "./src/index.js",
    vendor: "./src/vendor.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash:8].js", // 用入口名+8位哈希值作为文件名
  },
};
```

配置后生成的文件名可能是这样的：

- `main.1a2b3c4d.js`
- `vendor.5e6f7g8h.js`

使用`contenthash`的好处是：如果只是修改了 main.js，那么只有 main 的哈希值会变，vendor 的哈希值保持不变，这样浏览器可以继续缓存 vendor.js，提高加载速度。

#### 1.2.4 Chunk 文件名配置

什么是 Chunk？简单来说，Chunk 就是 Webpack 打包后的代码块。除了入口文件打包生成的 chunk，还有一种"动态 chunk"，它是通过代码分割（比如使用`import()`动态导入）生成的。

对于这种动态生成的 chunk，需要用`chunkFilename`来配置它的文件名：

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js", // 入口chunk的文件名
    chunkFilename: "chunks/[name].[contenthash].js", // 动态chunk的文件名
  },
};
```

注意：

- `filename`配置的是入口文件打包后的文件名
- `chunkFilename`配置的是动态生成的 chunk 的文件名
- 这里把动态 chunk 放到了 chunks 目录下，方便管理

举个例子：如果你在代码中写了`import('./lazy.js')`，那么 lazy.js 会被打包成一个动态 chunk，文件名可能是`chunks/lazy.1234abcd.js`。

#### 1.2.5 PublicPath 配置

`publicPath`属性就是告诉浏览器："从哪个 URL 路径来加载我的静态资源？"

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    publicPath: "/assets/", // 浏览器加载资源的URL前缀
  },
};
```

配置了`publicPath`后，Webpack 生成的 HTML 文件中引用资源的路径会自动加上这个前缀：

```html
<!-- 没有publicPath时 -->
<script src="main.12345678.js"></script>

<!-- 有publicPath="/assets/"时 -->
<script src="/assets/main.12345678.js"></script>
```

`publicPath`可以是相对路径或绝对路径，甚至可以是 CDN 地址：

```js
module.exports = {
  output: {
    // 相对路径：适合本地开发
    publicPath: "./",
    // 绝对路径：适合部署在网站根目录
    publicPath: "/assets/",
    // CDN地址：适合生产环境，资源从CDN加载
    publicPath: "https://cdn.example.com/assets/",
  },
};

// 可以根据环境动态设置
publicPath: process.env.NODE_ENV === 'production'
  ? 'https://cdn.example.com/'
  : '/',
```

举个例子：如果你把打包后的文件放在服务器的`/assets/`目录下，那么就需要设置`publicPath: "/assets/"`，这样浏览器才能正确找到资源。

#### 1.2.6 高级输出配置

```js
const path = require("path");

module.exports = {
  entry: {
    main: "./src/index.js",
    vendor: "./src/vendor.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"), // 输出目录
    filename: "[name].[contenthash].js", // 入口文件输出名
    chunkFilename: "chunks/[name].[contenthash].js", // 动态chunk输出名
    publicPath: "/assets/", // 浏览器加载资源的URL前缀
    clean: true, // Webpack 5新特性：打包前自动清空dist目录
    assetModuleFilename: "assets/[name].[hash:8][ext][query]", // 资源文件（图片、字体等）的输出名
    library: {
      name: "MyLibrary", // 库的名称
      type: "umd", // 通用模块格式，支持浏览器、Node.js等多种环境
      export: "default", // 导出默认值
    },
    environment: {
      arrowFunction: false, // 不使用箭头函数，兼容IE11等旧浏览器
      const: false, // 不使用const，用var代替，兼容旧浏览器
    },
  },
};
```

这些是 Webpack 的高级输出配置，让我们一个个解释：

- `clean: true`：Webpack 5 的新特性，每次打包前自动清空输出目录（dist），再也不用手动删除了！
- `assetModuleFilename`：配置资源模块（图片、字体等）的输出文件名和路径
- `library`：如果你的项目是一个库（比如 jQuery、React），可以用这个配置让它支持多种模块格式
- `environment`：配置输出代码的兼容性，比如禁用箭头函数来兼容旧浏览器

这些配置不是必须的，根据项目需要选择性使用即可。

#### 1.2.7 输出目录结构

通过合理配置`filename`和`chunkFilename`，可以创建清晰的输出目录结构：

```js
module.exports = {
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash].js",
    chunkFilename: "js/chunks/[name].[contenthash].js",
    assetModuleFilename: "assets/[name].[hash:8][ext][query]",
  },
};
```

这样会生成以下目录结构：

```
dist/
├── js/
│   ├── main.12345678.js
│   ├── vendor.87654321.js
│   └── chunks/
│       ├── lazy.abcdef12.js
│       └── async.12fedcba.js
└── assets/
    ├── logo.1234abcd.png
    └── styles.5678efgh.css
```

### 1.3 Loader（加载器）

Loader 是 Webpack 的"翻译官"！它的作用是把 Webpack 不认识的文件类型（比如 CSS、图片、TypeScript、Vue 组件等）转换成它能理解的 JavaScript 模块。

举个例子：Webpack 本身只懂 JavaScript，如果你的代码里写了`import './style.css'`，Webpack 会一脸懵："这是什么？我不认识 CSS！"

这时候就需要 Loader 来帮忙：

- `css-loader` 把 CSS 文件转换成 JavaScript 模块
- `style-loader` 把 CSS 模块注入到 HTML 页面中

#### 1.3.1 Loader 的工作原理

Loader 的工作流程其实很简单：

1. **识别文件**：通过`test`属性（正则表达式）匹配需要处理的文件类型
2. **转换处理**：对文件内容进行编译、压缩、格式化等处理
3. **返回结果**：把处理后的内容交给 Webpack 继续打包
4. **链式调用**：多个 Loader 可以像流水线一样一起工作，每个 Loader 只做一件事

Loader 本质上是一个 JavaScript 函数，它接收文件内容作为输入，返回转换后的内容。

#### 1.3.2 Loader 的配置方式

```js
module.exports = {
  module: {
    rules: [
      {
        // 1. 匹配文件：所有以.css结尾的文件
        test: /\.css$/,

        // 2. 使用哪些Loader：从右往左执行（先postcss-loader，再css-loader，最后style-loader）
        use: [
          "style-loader", // 3. 把CSS注入到HTML中
          {
            loader: "css-loader", // 2. 把CSS转换成JavaScript模块
            options: {
              modules: true, // 启用CSS Modules
              importLoaders: 1, // 处理@import的CSS文件时也要用postcss-loader
            },
          },
          "postcss-loader", // 1. 用PostCSS处理CSS（比如自动加前缀）
        ],

        // 3. 排除node_modules目录：这些文件不需要处理
        exclude: /node_modules/,

        // 4. 只包含src目录：提高构建速度
        include: path.resolve(__dirname, "src"),
      },
    ],
  },
};
```

Loader 配置在`module.rules`数组中，每个规则都是一个对象，包含以下常用属性：

- `test`：用正则表达式匹配需要处理的文件类型
- `use`：指定要使用的 Loader，可以是字符串或对象（带配置项）
- `exclude`：排除不需要处理的目录（比如 node_modules），提高构建速度
- `include`：只处理指定的目录（比如 src），提高构建速度
- `enforce`：指定 Loader 类型（`pre`前置 Loader 或`post`后置 Loader），控制执行顺序

注意：Loader 的执行顺序是**从右往左**（或者说从下往上）的！

#### 1.3.3 Loader 的执行顺序

Loader 的执行顺序是**从右到左（从下到上）**的，就像"剥洋葱"一样，从最外层开始，一层一层往内剥：

```js
use: ["style-loader", "css-loader", "postcss-loader"];
```

上面的配置中，Loader 的执行顺序是：

1. `postcss-loader` 先处理 CSS（比如自动加浏览器前缀）
2. `css-loader` 把处理后的 CSS 转换成 JavaScript 模块
3. `style-loader` 最后把 CSS 模块注入到 HTML 页面中

为什么是从右往左？因为每个 Loader 都需要上一个 Loader 处理的结果作为输入。可以想象成一条流水线，原料（CSS 文件）先经过第一个工人（postcss-loader）处理，然后传给第二个工人（css-loader），最后传给第三个工人（style-loader）完成包装。

如果需要更精确地控制顺序，可以使用`enforce`属性：

- `pre`：前置 Loader，最先执行
- 普通 Loader：按从右往左顺序执行
- `post`：后置 Loader，最后执行

#### 1.3.4 内联 Loader

除了在配置文件中配置 Loader 外，还可以在 import 语句中使用内联 Loader：

```js
// 使用style-loader和css-loader处理styles.css
import "style-loader!css-loader!./styles.css";

// 忽略配置文件中的Loader
import "!style-loader!css-loader!./styles.css";

// 只使用前置Loader
import "-!style-loader!css-loader!./styles.css";

// 只使用普通Loader
import "!!style-loader!css-loader!./styles.css";
```

内联 Loader 的语法：`!`分隔不同的 Loader，特殊前缀控制 Loader 的执行。

#### 1.3.5 Webpack 5 Asset Modules（智能收纳盒）

Webpack 5 引入了 Asset Modules（资源模块），它就像一个"智能收纳盒"，可以自动处理各种资源文件（图片、字体、文本等），无需额外安装旧的 Loader（如 file-loader、url-loader）。

Asset Modules 提供了四种"收纳盒"，每种适合不同类型的资源：

##### 1.3.5.1 asset/resource（大文件收纳盒）

`asset/resource`就像一个"独立文件收纳盒"：
- 把大文件（如大图、视频）单独放到指定目录
- 返回一个指向该文件的 URL 地址

```js
module.exports = {
  module: {
    rules: [
      {
        // 匹配所有图片文件
        test: /\.(png|jpg|jpeg|gif)$/i,
        // 使用asset/resource类型处理图片
        type: "asset/resource",
        // 配置输出选项
        generator: {
          // 指定输出的文件名格式：images目录/原文件名.8位哈希值.原扩展名
          filename: "images/[name].[hash:8][ext][query]",
        },
      },
    ],
  },
};
```

使用场景：大图片、视频、音频等体积较大的资源，单独存放便于浏览器缓存。

##### 1.3.5.2 asset/inline（小文件收纳盒）

`asset/inline`就像一个"随身携带的收纳盒"：
- 把小文件（如小图标）转换成 Data URL 格式
- 直接嵌入到 JavaScript 代码中，不用单独请求文件

```js
module.exports = {
  module: {
    rules: [
      {
        // 匹配所有字体和SVG图标文件
        test: /\.(svg|woff|woff2|eot|ttf|otf)$/i,
        // 使用asset/inline类型处理
        type: "asset/inline",
      },
    ],
  },
};
```

生成的 Data URL 长这样：`data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmci...`

使用场景：小图标、字体文件等，嵌入代码可以减少 HTTP 请求。

##### 1.3.5.3 asset/source（原内容收纳盒）

`asset/source`就像一个"透明收纳盒"：
- 直接将文件内容作为字符串返回
- 不做任何转换，保留原始内容

```js
module.exports = {
  module: {
    rules: [
      {
        // 匹配文本文件和Markdown文件
        test: /\.(txt|md)$/i,
        // 使用asset/source类型处理
        type: "asset/source",
      },
    ],
  },
};
```

使用时直接获取文件内容：
```js
import content from "./file.txt";
console.log(content); // 直接输出file.txt的原始内容
```

使用场景：配置文件、模板文件等需要直接使用内容的场景。

##### 1.3.5.4 asset（智能收纳盒）

`asset`是最聪明的"自动选择收纳盒"：
- 自动根据文件大小决定使用哪种方式
- 默认规则：小于 8KB 用`asset/inline`（嵌入代码），大于等于 8KB 用`asset/resource`（单独文件）

```js
module.exports = {
  module: {
    rules: [
      {
        // 匹配图片文件
        test: /\.(png|jpg|jpeg|gif)$/i,
        // 使用asset智能类型
        type: "asset",
        // 配置智能选择的条件
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 设置小文件的阈值为8KB
          },
        },
        // 配置输出选项（仅对大文件有效）
        generator: {
          filename: "images/[name].[hash:8][ext][query]",
        },
      },
    ],
  },
};
```

使用场景：适合大多数情况，自动平衡性能和请求数量。

#### 1.3.6 Loader 的执行上下文

Loader 在执行时会接收一个上下文对象，包含以下信息：

- `context.resourcePath`：资源文件的绝对路径
- `context.resourceQuery`：资源文件的查询字符串
- `context.target`：构建目标（如 web、node 等）
- `context.mode`：构建模式（如 development、production 等）

Loader 可以使用这些信息进行条件处理：

```js
module.exports = function (source) {
  // 获取资源文件路径
  const resourcePath = this.resourcePath;
  // 获取构建模式
  const mode = this.mode;

  // 根据不同模式处理资源
  if (mode === "production") {
    // 生产模式处理逻辑
  } else {
    // 开发模式处理逻辑
  }

  return source;
};
```

#### 1.3.7 同步与异步 Loader

Loader 可以是同步的或异步的：

**同步 Loader**：

```js
module.exports = function (source) {
  // 同步处理资源
  const result = source.replace(/\s+/g, "");
  return result;
};
```

**异步 Loader**：

```js
module.exports = function (source) {
  const callback = this.async();

  // 异步处理资源
  setTimeout(() => {
    const result = source.replace(/\s+/g, "");
    callback(null, result);
  }, 1000);
};
```

异步 Loader 适用于需要进行异步操作的场景，如网络请求、文件系统操作等。

### 1.4 Plugin（插件）

Plugin 是 Webpack 的另一个核心概念，它用于执行范围更广的任务，如打包优化、资源管理、环境变量注入、文件生成等。与 Loader 不同，Plugin 可以在 Webpack 的整个构建过程中执行各种任务，并且可以访问 Webpack 的完整构建生命周期。

#### 1.4.1 Plugin 的工作原理

Plugin 通过**钩子机制**与 Webpack 进行交互：

1. **实例化插件**：插件通过`new`关键字实例化，可以传递配置参数
2. **注册钩子**：插件在 Webpack 构建过程中注册各种钩子函数
3. **触发钩子**：Webpack 在构建过程的特定阶段触发相应的钩子
4. **执行任务**：插件的钩子函数被调用，执行特定的任务

Webpack 的钩子机制基于 Tapable 库实现，它允许插件在构建过程的各个阶段插入自定义逻辑。

#### 1.4.2 Plugin 的配置方式

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  plugins: [
    // 实例化插件，可以传递配置参数
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      inject: "body",
    }),
    // 实例化多个插件
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*", "!static-files/**"],
    }),
  ],
};
```

插件配置在`plugins`数组中，每个插件都是一个实例化的对象。插件可以接收配置参数，用于自定义插件的行为。

#### 1.4.3 Webpack 的构建生命周期

Webpack 的构建过程包含多个阶段，每个阶段都会触发相应的钩子：

1. **初始化阶段**：

   - `beforeInitialize`：初始化前
   - `initialize`：初始化
   - `afterInitialize`：初始化后

2. **编译阶段**：

   - `beforeRun`：运行前
   - `run`：运行
   - `watchRun`：监听运行
   - `normalModuleFactory`：普通模块工厂
   - `contextModuleFactory`：上下文模块工厂

3. **模块解析阶段**：

   - `beforeCompile`：编译前
   - `compile`：编译
   - `thisCompilation`：当前编译
   - `compilation`：编译

4. **资源生成阶段**：

   - `make`：模块构建
   - `afterCompile`：编译后

5. **输出阶段**：

   - `shouldEmit`：是否输出
   - `emit`：输出
   - `afterEmit`：输出后

6. **完成阶段**：
   - `done`：完成
   - `failed`：失败
   - `invalid`：无效
   - `watchClose`：监听关闭

#### 1.4.4 内置 Plugin

Webpack 内置了一些常用的 Plugin，无需额外安装：

##### 1.4.4.1 DefinePlugin

定义全局常量：

```js
const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      API_BASE_URL: JSON.stringify("https://api.example.com"),
    }),
  ],
};
```

##### 1.4.4.2 ProvidePlugin

自动加载模块：

```js
const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      _: "lodash",
    }),
  ],
};
```

##### 1.4.4.3 HotModuleReplacementPlugin

实现热模块替换：

```js
const webpack = require("webpack");

module.exports = {
  mode: "development",
  devServer: {
    hot: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};
```

##### 1.4.4.4 BannerPlugin

为输出文件添加版权信息：

```js
const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.BannerPlugin({
      banner: "Copyright © 2026 My Company. All rights reserved.",
      entryOnly: true,
    }),
  ],
};
```

##### 1.4.4.5 ProgressPlugin

显示构建进度：

```js
const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.ProgressPlugin({
      percentBy: "entries",
    }),
  ],
};
```

#### 1.4.5 常用第三方 Plugin

除了内置插件外，Webpack 生态系统中还有许多强大的第三方插件，以下是一些常用的插件：

##### 1.4.5.1 PrerenderSPAPlugin

**PrerenderSPAPlugin** 是一个用于预渲染单页应用（SPA）的插件，它可以在构建时预渲染指定路由，生成对应的静态 HTML 文件。

**主要功能**：

1. **预渲染静态 HTML**：在构建过程中对 SPA 的指定路由进行预渲染
2. **保持 SPA 交互性**：预渲染的页面加载后会被客户端 JavaScript 接管
3. **支持多个路由**：可以同时预渲染多个路由
4. **自定义配置**：支持配置预渲染的路由、输出路径、等待条件等

**核心优势**：

- **改善首屏加载性能**：减少白屏时间，提升用户体验
- **提升 SEO**：解决 SPA 无法被搜索引擎有效索引的问题
- **减少服务器压力**：相比服务端渲染，预渲染是在构建时生成静态文件
- **简化部署**：生成的是静态 HTML 文件，可以直接部署到任何静态文件服务器

**安装**：

```bash
npm install --save-dev prerender-spa-plugin
```

**基本配置**：

```js
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const path = require('path');

module.exports = {
  // 其他配置...
  plugins: [
    new PrerenderSPAPlugin({
      // 静态文件输出目录
      staticDir: path.join(__dirname, 'dist'),
      // 需要预渲染的路由
      routes: ['/', '/about', '/contact'],
      // 配置选项
      renderer: new PrerenderSPAPlugin.PuppeteerRenderer({
        // 等待页面渲染完成的条件
        renderAfterDocumentEvent: 'render-event'
      })
    })
  ]
};
```

**使用场景**：

- 营销页面、博客文章、文档网站等内容相对稳定的页面
- 需要 SEO 优化的 SPA 应用
- 希望提升首屏加载性能的场景

**与服务端渲染（SSR）的区别**：

| 特性 | 预渲染（PrerenderSPAPlugin） | 服务端渲染（SSR） |
|------|------------------------------|-------------------|
| 渲染时机 | 构建时 | 请求时 |
| 服务器压力 | 无 | 有 |
| 适用场景 | 内容相对稳定的页面 | 内容动态变化的页面 |
| 部署复杂度 | 低 | 高 |
| 首屏性能 | 优秀 | 优秀 |
| SEO 效果 | 良好 | 优秀 |

##### 1.4.5.2 HtmlWebpackPlugin

**HtmlWebpackPlugin** 是一个用于生成 HTML 文件并自动注入打包后资源的插件，它可以根据模板生成 HTML 文件，并自动添加 script 和 link 标签。

**主要功能**：

- 生成 HTML 文件
- 自动注入打包后的 CSS 和 JavaScript 资源
- 支持自定义模板
- 支持多页面应用配置

**安装**：

```bash
npm install --save-dev html-webpack-plugin
```

**基本配置**：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 其他配置...
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App', // 页面标题
      template: './src/index.html', // 模板文件
      filename: 'index.html', // 输出文件名
      inject: 'body', // 资源注入位置
      minify: {
        collapseWhitespace: true, // 压缩空白
        removeComments: true, // 移除注释
        removeRedundantAttributes: true // 移除冗余属性
      }
    })
  ]
};
```

**使用场景**：

- 单页面应用和多页面应用
- 需要自动管理资源注入的项目
- 希望自定义 HTML 模板的场景

##### 1.4.5.3 MiniCssExtractPlugin

**MiniCssExtractPlugin** 是一个用于提取 CSS 到单独文件的插件，它可以将 CSS 从 JavaScript 中分离出来，生成单独的 CSS 文件。

**主要功能**：

- 提取 CSS 到单独的文件
- 支持 CSS 按需加载
- 支持 CSS 压缩
- 提升页面加载性能

**安装**：

```bash
npm install --save-dev mini-css-extract-plugin
```

**基本配置**：

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // 其他配置...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 替换 style-loader
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css', // 输出文件名
      chunkFilename: 'css/[id].[contenthash].css' // 动态 chunk 的 CSS 文件名
    })
  ]
};
```

**使用场景**：

- 生产环境构建
- 希望 CSS 单独缓存的项目
- 大型应用需要优化资源加载的场景

##### 1.4.5.4 CleanWebpackPlugin

**CleanWebpackPlugin** 是一个用于构建前清理输出目录的插件，它可以在每次构建前自动删除指定的文件和目录。

**主要功能**：

- 构建前清理输出目录
- 支持自定义清理模式
- 支持排除特定文件

**安装**：

```bash
npm install --save-dev clean-webpack-plugin
```

**基本配置**：

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // 其他配置...
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!static-files/**'], // 清理模式，排除 static-files 目录
      cleanStaleWebpackAssets: false, // 不清理过期的 Webpack 资源
      protectWebpackAssets: true // 保护 Webpack 生成的资源
    })
  ]
};
```

**使用场景**：

- 需要在构建前清理旧文件的项目
- 避免输出目录中累积无用文件的场景
- 确保每次构建都是干净的输出

##### 1.4.5.5 CopyWebpackPlugin

**CopyWebpackPlugin** 是一个用于复制静态资源文件的插件，它可以将指定的文件或目录复制到输出目录。

**主要功能**：

- 复制静态资源文件
- 支持自定义复制模式
- 支持文件转换

**安装**：

```bash
npm install --save-dev copy-webpack-plugin
```

**基本配置**：

```js
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // 其他配置...
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public', // 源目录
          to: 'static', // 目标目录
          globOptions: {
            ignore: ['**/.gitkeep'] // 忽略的文件
          }
        },
        {
          from: 'src/assets/images',
          to: 'images'
        }
      ]
    })
  ]
};
```

**使用场景**：

- 需要复制静态资源的项目
- 包含不需要 Webpack 处理的文件的场景
- 希望保持特定目录结构的项目

##### 1.4.5.6 TerserWebpackPlugin

**TerserWebpackPlugin** 是一个用于压缩 JavaScript 代码的插件，它是 Webpack 5 中的默认 JavaScript 压缩工具。

**主要功能**：

- 压缩 JavaScript 代码
- 支持多线程并行压缩
- 支持删除控制台语句和调试器语句
- 支持自定义压缩选项

**安装**：

```bash
npm install --save-dev terser-webpack-plugin
```

**基本配置**：

```js
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
  // 其他配置...
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true, // 启用多线程并行压缩
        terserOptions: {
          compress: {
            drop_console: true, // 删除控制台语句
            drop_debugger: true, // 删除调试器语句
            dead_code: true // 移除死代码
          },
          mangle: true, // 混淆变量名
          output: {
            comments: false // 移除注释
          }
        }
      })
    ]
  }
};
```

**使用场景**：

- 生产环境构建
- 希望减小 JavaScript 文件体积的项目
- 需要优化加载性能的场景

##### 1.4.5.7 OptimizeCSSAssetsPlugin

**OptimizeCSSAssetsPlugin** 是一个用于压缩 CSS 代码的插件，它可以优化和压缩 CSS 文件。

**主要功能**：

- 压缩 CSS 代码
- 合并重复的 CSS 规则
- 移除无用的 CSS 代码

**安装**：

```bash
npm install --save-dev optimize-css-assets-webpack-plugin
```

**基本配置**：

```js
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  // 其他配置...
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'), // 使用 cssnano 作为 CSS 处理器
        cssProcessorOptions: {
          discardComments: { removeAll: true }, // 移除所有注释
          discardDuplicates: true, // 移除重复的规则
          discardEmpty: true // 移除空规则
        },
        canPrint: true // 启用打印信息
      })
    ]
  }
};
```

**使用场景**：

- 生产环境构建
- 希望减小 CSS 文件体积的项目
- 需要优化 CSS 加载性能的场景

##### 1.4.5.8 ForkTsCheckerWebpackPlugin

**ForkTsCheckerWebpackPlugin** 是一个用于 TypeScript 类型检查的插件，它可以在单独的进程中运行 TypeScript 类型检查，提高构建速度。

**主要功能**：

- 在单独的进程中运行 TypeScript 类型检查
- 提高构建速度
- 提供详细的类型错误信息
- 支持 ESLint 集成

**安装**：

```bash
npm install --save-dev fork-ts-checker-webpack-plugin
```

**基本配置**：

```js
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  // 其他配置...
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: true, // 异步检查，不阻塞构建
      typescript: {
        configFile: './tsconfig.json', // TypeScript 配置文件
        diagnosticOptions: {
          semantic: true, // 启用语义检查
          syntactic: true // 启用语法检查
        }
      },
      eslint: {
        enabled: true, // 启用 ESLint
        files: './src/**/*.{ts,tsx,js,jsx}' // 检查的文件
      }
    })
  ]
};
```

**使用场景**：

- TypeScript 项目
- 希望提高构建速度的场景
- 需要详细类型错误信息的项目

##### 1.4.5.9 ESLintWebpackPlugin

**ESLintWebpackPlugin** 是一个用于 ESLint 代码检查的插件，它可以在构建过程中运行 ESLint 检查代码质量。

**主要功能**：

- 在构建过程中运行 ESLint
- 提供代码质量检查
- 支持自定义 ESLint 配置
- 可以中断构建以阻止错误代码被打包

**安装**：

```bash
npm install --save-dev eslint-webpack-plugin eslint
```

**基本配置**：

```js
const ESLintWebpackPlugin = require('eslint-webpack-plugin');

module.exports = {
  // 其他配置...
  plugins: [
    new ESLintWebpackPlugin({
      context: './src', // 检查的目录
      extensions: ['js', 'jsx', 'ts', 'tsx'], // 检查的文件扩展名
      exclude: 'node_modules', // 排除的目录
      failOnError: true, // 有错误时中断构建
      failOnWarning: false, // 有警告时不中断构建
      fix: true // 自动修复一些问题
    })
  ]
};
```

**使用场景**：

- 希望保证代码质量的项目
- 需要团队代码风格一致的场景
- 希望在构建过程中发现代码问题的项目

#### 1.4.6 自定义 Plugin 开发

Plugin 其实就是一个普通的 JavaScript 类，它通过"监听 Webpack 构建过程中的关键点"来执行自定义任务。

我们来写一个简单的 Plugin：给打包后的文件自动添加版权信息（就像给每个文件盖个章）。

```js
// my-copyright-plugin.js
class MyCopyrightPlugin {
  constructor(options) {
    // 保存用户配置
    this.options = options || {};
    // 默认版权信息
    this.copyright = this.options.text || "// Copyright © 2026 My Company\n";
  }

  // Plugin 必须有 apply 方法
  apply(compiler) {
    // 监听 "emit" 钩子：Webpack 即将输出文件时执行
    compiler.hooks.emit.tap("MyCopyrightPlugin", (compilation) => {
      // 获取所有要输出的文件
      const assets = compilation.assets;

      // 遍历每个文件
      for (const filename in assets) {
        // 只处理 JavaScript 文件
        if (filename.endsWith(".js")) {
          // 获取文件内容
          const source = assets[filename].source();
          // 添加版权信息到文件开头
          const newSource = this.copyright + source;
          // 更新文件内容
          assets[filename] = {
            source: () => newSource,
            size: () => newSource.length,
          };
        }
      }
    });
  }
}

module.exports = MyCopyrightPlugin;
```

使用自定义 Plugin：

```js
// webpack.config.js
const MyCopyrightPlugin = require("./my-copyright-plugin");

module.exports = {
  plugins: [
    new MyCopyrightPlugin({
      text: "// 版权所有 © 2026 我的公司 保留所有权利\n",
    }),
  ],
};
```

打包后，所有 JavaScript 文件开头都会加上你的版权信息！

#### 1.4.6 Plugin 的钩子类型

Webpack 提供了不同类型的钩子，用于处理同步和异步任务：

1. **同步钩子**：
   - 最常用的钩子类型
   - 按顺序执行，完成后继续下一步
   - 适合简单的同步操作

   ```js
   // 在编译开始时执行同步任务
   compiler.hooks.compile.tap("MyPlugin", (params) => {
     console.log("编译开始了！");
   });
   ```

2. **异步钩子（回调方式）**：
   - 用于需要异步执行的任务（如文件读写、网络请求）
   - 完成后必须调用 `callback()` 通知 Webpack

   ```js
   // 异步处理文件
   compiler.hooks.emit.tapAsync("MyPlugin", (compilation, callback) => {
     // 模拟异步操作
     setTimeout(() => {
       console.log("异步任务完成！");
       callback(); // 必须调用回调
     }, 1000);
   });
   ```

3. **异步钩子（Promise 方式）**：
   - 现代 JavaScript 更常用的异步处理方式
   - 返回 Promise，resolve 后继续执行

   ```js
   // 使用 Promise 处理异步任务
   compiler.hooks.emit.tapPromise("MyPlugin", (compilation) => {
     return new Promise((resolve) => {
       setTimeout(() => {
         console.log("Promise 异步任务完成！");
         resolve();
       }, 1000);
     });
   });
   ```

4. **瀑布流钩子**：
   - 上一个钩子的返回值会作为下一个钩子的参数
   - 适合需要数据传递的链式操作

   ```js
   // 处理并传递数据
   compiler.hooks.normalModuleFactory.tap("MyPlugin", (factory) => {
     // 对 factory 进行修改
     factory.someOption = true;
     return factory; // 返回修改后的 factory
   });
   ```

#### 1.4.7 访问 Compilation 对象

Compilation 对象包含了当前构建的所有信息，是插件开发中最常用的对象之一：

```js
class MyCustomPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("MyCustomPlugin", (compilation) => {
      // 访问模块
      compilation.modules.forEach((module) => {
        // 处理模块
      });

      // 访问资源
      compilation.assets.forEach((asset) => {
        // 处理资源
      });

      // 注册Compilation钩子
      compilation.hooks.processAssets.tap(
        {
          name: "MyCustomPlugin",
          stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        (assets) => {
          // 处理资源
        }
      );
    });
  }
}
```

Compilation 对象提供了丰富的 API，可以用于获取和修改构建过程中的各种信息。

#### 1.4.8 插件的错误处理

插件在执行过程中可能会遇到错误，需要正确处理：

```js
class MyCustomPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync("MyCustomPlugin", (compilation, callback) => {
      try {
        // 执行任务
        // ...
        callback();
      } catch (error) {
        // 处理错误
        callback(error);
      }
    });
  }
}
```

正确处理错误可以确保 Webpack 构建过程能够正常终止，并显示详细的错误信息。

### 1.5 Mode（模式）

Mode 就像 Webpack 的"工作模式切换开关"，告诉 Webpack 你现在是在开发还是生产环境，让它自动应用合适的优化策略。

#### 1.5.1 三种模式的区别

Webpack 有三种模式，就像手机的"性能模式"、"省电模式"和"自定义模式"：

##### 1.5.1.1 development（开发模式）

**开发模式：为开发人员量身定制**

开发模式就像手机的"性能模式"，追求的是**开发效率**和**调试方便**：

```js
module.exports = {
  mode: "development",
};
```

**开发模式的特点**：

- ✅ 构建速度快（因为不做复杂优化）
- ✅ 代码不压缩，保留换行和注释
- ✅ 变量和函数用有意义的名字（如"main"、"utils"）
- ✅ 提供完整的错误信息（能准确告诉你哪行代码出错了）
- ✅ 支持热模块替换（改代码不用刷新页面）
- ❌ 输出文件比较大（因为包含了调试信息）

适合**开发过程中**使用，让你写代码更顺畅！

##### 1.5.1.2 production（生产模式）

**生产模式：为用户体验优化**

生产模式就像手机的"省电模式"，追求的是**性能**和**体积小**：

```js
module.exports = {
  mode: "production",
};
```

**生产模式的特点**：

- ✅ 代码压缩（把多余的空格、换行都删掉）
- ✅ 移除未使用的代码（tree shaking）
- ✅ 变量和函数用短名字（如"a"、"b"）减少文件大小
- ✅ 优化加载性能（按使用频率排序代码）
- ❌ 构建速度较慢（因为要做很多优化）
- ❌ 调试信息少（代码被压缩了）

适合**发布到线上**时使用，让用户访问更快！

##### 1.5.1.3 none（无模式）

**无模式：完全自定义**

无模式就像手机的"自定义模式"，**什么优化都不做**，让你自己配置所有东西：

```js
module.exports = {
  mode: "none",
};
```

**无模式的特点**：

- 不启用任何内置优化
- 代码不压缩也不优化
- 适合调试 Webpack 本身或者需要完全自定义优化的场景
- 一般开发和生产环境都不用它

**简单总结**：
- 开发时用 `development`：快、方便调试
- 上线时用 `production`：小、性能好
- 调试 Webpack 用 `none`：全手动配置

#### 1.5.2 模式的配置方式

有三种方式可以配置 Mode：

##### 1.5.2.1 在配置文件中配置

```js
// webpack.config.js
module.exports = {
  mode: "development",
};
```

##### 1.5.2.2 通过命令行参数指定

```bash
# 开发模式
npx webpack --mode development

# 生产模式
npx webpack --mode production

# 无模式
npx webpack --mode none
```

##### 1.5.2.3 通过环境变量指定

```bash
# 开发模式
NODE_ENV=development npx webpack

# 生产模式
NODE_ENV=production npx webpack
```

#### 1.5.3 模式对构建结果的影响

不同模式对构建结果的影响可以通过以下示例对比：

**开发模式输出**：

```bash
Asset       Size  Chunks             Chunk Names
main.js   1.2 MiB    main  [emitted]  main
Entrypoint main = main.js
[./src/index.js] 128 bytes {main} [built]
[./src/utils.js]  84 bytes {main} [built]
```

**生产模式输出**：

```bash
Asset       Size  Chunks             Chunk Names
main.js  12.3 KiB    main  [emitted]  main
Entrypoint main = main.js
[./src/index.js] 128 bytes {main} [built]
[./src/utils.js]  84 bytes {main} [built]
```

可以看到，生产模式的输出文件大小比开发模式小很多，这是因为生产模式启用了代码压缩、tree shaking 等优化。

#### 1.5.4 模式与环境变量的关系

Mode 配置会影响`process.env.NODE_ENV`环境变量的值：

| Mode        | process.env.NODE_ENV |
| ----------- | -------------------- |
| development | 'development'        |
| production  | 'production'         |
| none        | undefined            |

可以在代码中使用这个环境变量进行条件处理：

```js
if (process.env.NODE_ENV === "development") {
  console.log("开发模式");
} else if (process.env.NODE_ENV === "production") {
  console.log("生产模式");
}
```

#### 1.5.5 自定义模式配置

虽然 Webpack 为每种模式提供了默认优化，但你仍然可以根据需要自定义配置：

**开发模式自定义配置**：

```js
module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    hot: true,
    open: true,
  },
  optimization: {
    namedModules: true,
    namedChunks: true,
  },
};
```

**生产模式自定义配置**：

```js
module.exports = {
  mode: "production",
  devtool: "source-map",
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: "all",
    },
  },
};
```

#### 1.5.6 多环境配置

在实际项目中，通常需要为不同环境（如开发、测试、生产）配置不同的 Webpack 配置：

```js
// webpack.common.js - 公共配置
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
  },
  module: {
    rules: [
      // 公共Loader配置
    ],
  },
  plugins: [
    // 公共Plugin配置
  ],
};
```

```js
// webpack.dev.js - 开发环境配置
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    hot: true,
    open: true,
  },
});
```

```js
// webpack.prod.js - 生产环境配置
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  optimization: {
    minimizer: [new TerserPlugin()],
  },
});
```

使用不同的配置文件：

```bash
# 开发环境构建
npx webpack --config webpack.dev.js

# 生产环境构建
npx webpack --config webpack.prod.js
```

#### 1.5.7 Mode 配置的最佳实践

- 在开发环境使用`development`模式，注重构建速度和调试体验
- 在生产环境使用`production`模式，注重输出质量和性能
- 不要在配置文件中硬编码`process.env.NODE_ENV`，而是使用 Mode 配置
- 为不同环境创建不同的配置文件，提高配置的可维护性
- 在开发环境使用热模块替换和自动刷新，提高开发效率
- 在生产环境启用代码压缩和 tree shaking，减少输出文件大小

### 1.6 Webpack 运行流程

理解 Webpack 的运行流程对于掌握其工作原理至关重要。Webpack 的构建过程是一个复杂的流水线，从读取配置到生成最终的静态资源文件，涉及多个阶段和步骤。

#### 1.6.1 运行流程概述

Webpack 的运行流程可以分为以下几个主要阶段：

1. **初始化阶段**：读取配置文件，解析配置参数，创建编译器实例
2. **编译阶段**：从入口文件开始，分析模块依赖，构建依赖图
3. **模块处理阶段**：使用 Loader 处理不同类型的模块
4. **代码生成阶段**：将处理后的模块打包成最终的静态资源文件
5. **输出阶段**：将生成的文件写入到指定的输出目录

#### 1.6.2 详细运行流程

让我们详细了解 Webpack 的每一个运行步骤：

##### 1.6.2.1 初始化阶段

1. **读取配置**：
   - 首先，Webpack 会读取项目根目录下的 `webpack.config.js` 文件（或通过 `--config` 参数指定的配置文件）
   - 解析配置对象，包括入口、输出、Loader、Plugin 等配置
   - 合并默认配置和用户配置，生成最终的配置对象

2. **创建编译器**：
   - 根据最终的配置对象创建 `Compiler` 实例
   - 注册所有配置的 Plugin，触发 `beforeInitialize`、`initialize`、`afterInitialize` 等钩子

##### 1.6.2.2 编译阶段

1. **开始编译**：
   - 调用 `Compiler.run()` 方法开始构建过程
   - 触发 `beforeRun`、`run` 等钩子

2. **创建编译实例**：
   - 创建 `Compilation` 实例，负责具体的构建过程
   - 触发 `beforeCompile`、`compile`、`thisCompilation`、`compilation` 等钩子

3. **构建依赖图**：
   - 从配置的入口文件开始，递归分析模块依赖
   - 对于每个模块，解析其 `import`、`require` 等语句，找到依赖的模块
   - 构建一个完整的依赖图（Dependency Graph），记录所有模块之间的依赖关系

##### 1.6.2.3 模块处理阶段

1. **加载模块**：
   - 根据模块的路径，使用相应的 Loader 加载模块
   - 对于 JavaScript 文件，直接解析；对于其他类型的文件（如 CSS、图片等），使用配置的 Loader 进行转换

2. **转换模块**：
   - 按顺序执行 Loader 链，对模块内容进行转换
   - 例如，对于 CSS 文件，会使用 `css-loader` 转换为 JavaScript 模块，再使用 `style-loader` 注入到 HTML 中

3. **解析模块**：
   - 解析转换后的模块内容，提取其中的依赖
   - 对于动态导入（如 `import()`），会创建新的代码块（Chunk）

##### 1.6.2.4 代码生成阶段

1. **创建 Chunk**：
   - 根据依赖图，将模块组合成不同的 Chunk
   - 入口文件会生成一个主 Chunk，动态导入的模块会生成新的 Chunk
   - 应用代码分割策略，优化 Chunk 的大小和数量

2. **优化 Chunk**：
   - 执行各种优化策略，如 Tree Shaking（移除未使用的代码）、代码压缩、作用域提升等
   - 对于生产模式，还会进行更深度的优化，如变量名缩短、死代码消除等

3. **生成代码**：
   - 将每个 Chunk 转换为最终的代码形式
   - 生成的代码会包含模块加载器（如 `__webpack_require__`），用于在浏览器中加载和执行模块

##### 1.6.2.5 输出阶段

1. **准备输出**：
   - 确定输出文件的路径和文件名
   - 应用占位符（如 `[name]`、`[contenthash]` 等）生成最终的文件名

2. **写入文件**：
   - 将生成的代码写入到指定的输出目录
   - 触发 `emit`、`afterEmit` 等钩子

3. **完成构建**：
   - 构建过程完成，触发 `done` 钩子
   - 输出构建结果的统计信息，如构建时间、文件大小等

#### 1.6.3 运行流程图解

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  初始化阶段     │     │  编译阶段       │     │  模块处理阶段   │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ 1. 读取配置文件  │────>│ 3. 开始编译     │────>│ 5. 加载模块     │
│ 2. 创建编译器   │     │ 4. 构建依赖图   │     │ 6. 转换模块     │
└─────────────────┘     └─────────────────┘     │ 7. 解析模块     │
                                                └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  完成构建       │<────│  输出阶段       │<────│  代码生成阶段   │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ 12. 输出统计信息│     │10. 写入文件     │     │ 8. 创建 Chunk   │
│ 13. 触发 done  │     │11. 触发 afterEmit│     │ 9. 优化和生成代码│
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

#### 1.6.4 关键环节解析

##### 1.6.4.1 依赖图构建

依赖图是 Webpack 构建过程的核心，它是一个有向无环图（DAG），记录了所有模块之间的依赖关系：

- **入口模块**：从配置的入口文件开始，作为依赖图的根节点
- **直接依赖**：入口模块直接导入的模块
- **间接依赖**：被直接依赖的模块所导入的模块
- **循环依赖**：模块之间相互依赖的情况，Webpack 会通过模块缓存来处理

依赖图的构建过程是递归的，Webpack 会不断解析模块的依赖，直到所有依赖都被分析完毕。

##### 1.6.4.2 Loader 执行机制

Loader 是 Webpack 处理非 JavaScript 文件的核心机制：

- **执行顺序**：Loader 按照从右到左（或从下到上）的顺序执行
- **链式调用**：每个 Loader 接收上一个 Loader 的输出作为输入
- **同步与异步**：Loader 可以是同步的，也可以是异步的
- **上下文信息**：Loader 执行时会接收一个上下文对象，包含当前模块的信息

例如，对于 `use: ["style-loader", "css-loader", "postcss-loader"]`，执行顺序是：
1. `postcss-loader` 处理 CSS 文件
2. `css-loader` 将 CSS 转换为 JavaScript 模块
3. `style-loader` 将 CSS 注入到 HTML 中

##### 1.6.4.3 Plugin 工作机制

Plugin 是 Webpack 扩展功能的核心机制，它通过钩子系统介入构建过程的各个阶段：

- **钩子注册**：Plugin 在初始化时注册各种钩子函数
- **钩子触发**：Webpack 在构建过程的特定阶段触发相应的钩子
- **自定义逻辑**：Plugin 的钩子函数执行自定义的逻辑，如修改输出、添加资源等

Plugin 可以访问 Webpack 的完整构建生命周期，因此可以实现各种复杂的功能，如代码分割、热模块替换、资源优化等。

##### 1.6.4.4 Chunk 生成与优化

Chunk 是 Webpack 打包后的代码块，它的生成和优化是影响构建结果性能的关键因素：

- **Chunk 类型**：
  - 入口 Chunk：由入口文件生成的 Chunk
  - 动态 Chunk：由动态导入（如 `import()`）生成的 Chunk
  - vendor Chunk：包含第三方库的 Chunk

- **Chunk 优化策略**：
  - **代码分割**：将代码分割成多个 Chunk，减少初始加载时间
  - **Tree Shaking**：移除未使用的代码，减少 Chunk 大小
  - **作用域提升**：将多个模块的代码合并到一个函数中，减少函数调用开销
  - **代码压缩**：压缩代码，减少文件大小

#### 1.6.5 运行流程的影响因素

Webpack 的运行流程会受到多种因素的影响，包括：

1. **配置文件**：不同的配置会导致不同的构建流程和结果
2. **模块数量**：模块越多，依赖图越大，构建时间越长
3. **Loader 复杂度**：复杂的 Loader 会增加构建时间
4. **Plugin 数量**：插件越多，构建过程越复杂
5. **构建模式**：开发模式和生产模式的构建流程有所不同

#### 1.6.6 性能优化建议

了解 Webpack 的运行流程后，可以采取以下措施优化构建性能：

1. **减少模块数量**：合并小模块，减少依赖
2. **优化 Loader 配置**：使用 `include` 和 `exclude` 减少 Loader 的处理范围
3. **合理使用 Plugin**：只使用必要的 Plugin，避免过度使用
4. **启用缓存**：使用 `cache` 配置缓存构建结果
5. **并行构建**：使用 `thread-loader` 等工具并行处理模块
6. **代码分割**：合理分割代码，减少初始加载时间
7. **使用持久化缓存**：使用 `contenthash` 等机制，利用浏览器缓存

### 安装与初始化

::: tabs#webpack
@tab 安装

```bash
# 全局安装
npm install -g webpack webpack-cli

# 项目本地安装
npm install --save-dev webpack webpack-cli
```

@tab 初始化

```bash
# 初始化项目
npm init -y

# 创建基本目录结构
mkdir src dist

# 创建入口文件
touch src/index.js
```

:::

### 基本配置

创建`webpack.config.js`文件，这是 Webpack 的默认配置文件：

```js
const path = require("path");

module.exports = {
  // 入口文件
  entry: "./src/index.js",
  // 输出配置
  output: {
    // 输出路径
    path: path.resolve(__dirname, "dist"),
    // 输出文件名
    filename: "bundle.js",
  },
  // 模式（development/production/none）
  mode: "development",
};
```

## 常用 Loader

Loader 用于处理非 JavaScript 文件，Webpack 本身只能处理 JavaScript。下面是一些常用 Loader 的详细配置和使用示例：

### 1. JavaScript 相关 Loader

#### 1.1 Babel Loader

Babel Loader 用于将 ES6+代码转换为 ES5 代码，确保浏览器兼容性。

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: ["last 2 versions", "> 1%", "not dead"],
                  },
                  useBuiltIns: "usage",
                  corejs: 3,
                },
              ],
            ],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-object-rest-spread",
            ],
          },
        },
      },
    ],
  },
};
```

#### 1.2 TypeScript Loader

TypeScript Loader 用于处理 TypeScript 文件，将其转换为 JavaScript。

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
```

### 2. 样式相关 Loader

#### 2.1 CSS Loader

CSS Loader 用于处理 CSS 文件，将 CSS 转换为 JavaScript 模块。

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader", // 将CSS注入到DOM中
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
              importLoaders: 1,
            },
          },
          "postcss-loader", // 使用PostCSS处理CSS
        ],
      },
    ],
  },
};
```

#### 2.2 SCSS Loader

SCSS Loader 用于处理 SCSS/SASS 文件，将其转换为 CSS。

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          "sass-loader", // 将SCSS转换为CSS
        ],
      },
    ],
  },
};
```

#### 2.3 Less Loader

Less Loader 用于处理 Less 文件，将其转换为 CSS。

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          "style-loader",
          "css-loader",
          "less-loader", // 将Less转换为CSS
        ],
      },
    ],
  },
};
```

### 3. 图片和资源相关 Loader

#### 3.1 File Loader

File Loader 用于处理图片、字体等静态资源文件。

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]",
              outputPath: "images/",
              publicPath: "/images/",
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
    ],
  },
};
```

#### 3.2 Url Loader

Url Loader 与 File Loader 类似，但可以将小文件转换为 DataURL，减少 HTTP 请求。

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192, // 小于8KB的文件转换为DataURL
              name: "[name].[hash].[ext]",
              outputPath: "images/",
              fallback: "file-loader", // 大于limit的文件使用file-loader
            },
          },
        ],
      },
    ],
  },
};
```

### 4. 框架相关 Loader

#### 4.1 Vue Loader

Vue Loader 用于处理 Vue 单文件组件（.vue 文件）。

```js
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(), // Vue Loader必须配合这个插件使用
  ],
};
```

#### 4.2 React 相关 Loader

React 相关 Loader 用于处理 JSX 和 TSX 文件。

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
};
```

### 5. 其他常用 Loader

#### 5.1 HTML Loader

HTML Loader 用于处理 HTML 文件，将 HTML 转换为 JavaScript 模块。

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
    ],
  },
};
```

#### 5.2 CSV Loader

CSV Loader 用于处理 CSV 文件，将 CSV 转换为 JavaScript 对象。

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(csv|tsv)$/,
        use: ["csv-loader"],
      },
    ],
  },
};
```

#### 5.3 XML Loader

XML Loader 用于处理 XML 文件，将 XML 转换为 JavaScript 对象。

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.xml$/,
        use: ["xml-loader"],
      },
    ],
  },
};
```

### 6. Loader 的执行顺序

Loader 的执行顺序是从右到左（从下到上）的，例如：

```js
use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"];
```

执行顺序：sass-loader → postcss-loader → css-loader → style-loader

- sass-loader：将 SCSS 转换为 CSS
- postcss-loader：使用 PostCSS 处理 CSS
- css-loader：将 CSS 转换为 JavaScript 模块
- style-loader：将 CSS 注入到 DOM 中

## 常用 Plugin

如果说 Loader 是 Webpack 的"翻译官"，那么 Plugin 就是 Webpack 的"功能扩展包"！它可以为 Webpack 增加各种强大的功能，比如自动生成 HTML、清理输出目录、压缩代码、优化资源等。

可以把 Plugin 想象成手机上的各种 App：手机（Webpack）本身有基本功能，但装上不同的 App（Plugin）后，就能实现各种高级功能，比如拍照、导航、购物等。

下面是一些最常用的 Plugin，让我们来看看它们都能做什么：

### 1. 基础插件

#### 1.1 HtmlWebpackPlugin

HtmlWebpackPlugin 就像一个"自动生成网页的模板机"，它可以帮你自动创建 HTML 文件，并把打包好的 JavaScript 和 CSS 文件自动注入到 HTML 中。

不用再手动修改 HTML 中的脚本引用了，这个插件会帮你搞定一切！

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      title: "Webpack App",
      favicon: "./src/favicon.ico",
      meta: {
        viewport: "width=device-width, initial-scale=1.0",
        description: "Webpack App Description",
      },
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    // 多HTML页面配置
    new HtmlWebpackPlugin({
      template: "./src/about.html",
      filename: "about.html",
      chunks: ["about"], // 只包含about chunk
    }),
  ],
};
```

#### 1.2 CleanWebpackPlugin

CleanWebpackPlugin 就像一个"自动清洁工"，它会在每次打包前自动清理输出目录（比如 dist 目录），确保你每次得到的都是全新的打包结果。

再也不用手动删除旧文件了，这个插件会帮你保持输出目录的整洁！

```js
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  // ...
  plugins: [
    new CleanWebpackPlugin({
      // 清理选项
      cleanOnceBeforeBuildPatterns: ["**/*", "!static-files/**"], // 保留static-files目录
      verbose: true, // 输出清理信息
      dry: false, // 是否模拟清理
    }),
  ],
};
```

#### 1.3 CopyWebpackPlugin

CopyWebpackPlugin 就像一个"自动搬运工"，它可以帮你把指定的文件或目录自动复制到输出目录中。

比如，你有一些不需要处理的静态资源（如图片、字体文件、配置文件等），这个插件可以帮你自动把它们复制到 dist 目录，省去手动复制的麻烦！

```js
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  // ...
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/assets",
          to: "assets",
          globOptions: {
            ignore: ["**/.gitkeep"], // 忽略.gitkeep文件
          },
        },
        {
          from: "./src/favicon.ico",
          to: "favicon.ico",
        },
      ],
    }),
  ],
};
```

### 2. 样式相关插件

#### 2.1 MiniCssExtractPlugin

MiniCssExtractPlugin 就像一个"CSS 分离专家"，它可以把原本嵌入在 JavaScript 文件中的 CSS 代码提取出来，生成单独的 CSS 文件。

这样做的好处是：

- 可以让浏览器并行加载 JavaScript 和 CSS，提高页面加载速度
- 便于 CSS 文件的缓存管理
- 避免 CSS 代码重复打包到多个 JavaScript 文件中

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css",
      ignoreOrder: true, // 忽略CSS顺序警告
    }),
  ],
};
```

#### 2.2 OptimizeCssAssetsPlugin

OptimizeCssAssetsPlugin 用于优化和压缩 CSS 文件。

```js
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  // ...
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require("cssnano"),
        cssProcessorOptions: {
          discardComments: { removeAll: true },
          safe: true,
        },
        canPrint: true,
      }),
    ],
  },
};
```

#### 2.3 PurgeCssPlugin

PurgeCssPlugin 用于移除未使用的 CSS，减少 CSS 文件大小。

```js
const PurgecssPlugin = require("purgecss-webpack-plugin");
const glob = require("glob");

module.exports = {
  // ...
  plugins: [
    new PurgecssPlugin({
      paths: glob.sync(`${path.join(__dirname, "src")}/**/*`, { nodir: true }),
      extractors: [
        {
          extractor: class Extractor {
            static extract(content) {
              return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
            }
          },
          extensions: ["html", "js", "ts", "vue"],
        },
      ],
      whitelist: ["html", "body"], // 保留的CSS类
    }),
  ],
};
```

### 3. 开发相关插件

#### 3.1 HotModuleReplacementPlugin

HotModuleReplacementPlugin 用于实现热模块替换，无需刷新页面即可更新代码。

```js
const webpack = require("webpack");

module.exports = {
  // ...
  devServer: {
    hot: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // 显示模块名称
  ],
};
```

#### 3.2 FriendlyErrorsWebpackPlugin

FriendlyErrorsWebpackPlugin 用于美化 Webpack 的输出信息，提供更友好的错误和警告信息。

```js
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

module.exports = {
  // ...
  plugins: [
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ["Your application is running here: http://localhost:3000"],
        notes: [
          "Some additionnal notes to be displayed unpon successful compilation",
        ],
      },
      onErrors: function (severity, errors) {
        // 处理错误
      },
      clearConsole: true,
      additionalFormatters: [],
      additionalTransformers: [],
    }),
  ],
};
```

#### 3.3 WebpackBundleAnalyzer

WebpackBundleAnalyzer 用于分析 bundle 的组成和大小，帮助优化打包结果。

```js
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  // ...
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "server", // 分析器模式：server, static, disabled
      analyzerHost: "127.0.0.1", // 分析服务器地址
      analyzerPort: 8888, // 分析服务器端口
      reportFilename: "report.html", // 静态分析报告文件名
      defaultSizes: "parsed", // 默认显示的大小：parsed, gzip, stat
      openAnalyzer: true, // 自动打开分析报告
      generateStatsFile: false, // 是否生成stats.json文件
      statsFilename: "stats.json", // stats.json文件名
      statsOptions: null, // 自定义stats输出选项
      excludeAssets: null, // 排除特定资源
      logLevel: "info", // 日志级别：info, warn, error, silent
    }),
  ],
};

// 生成静态分析报告（不启动服务器）
new BundleAnalyzerPlugin({
  analyzerMode: "static",
  openAnalyzer: false,
  reportFilename: "bundle-report.html",
});

// 仅生成stats.json文件
new BundleAnalyzerPlugin({
  analyzerMode: "disabled",
  generateStatsFile: true,
  statsFilename: "webpack-stats.json",
});

// 使用stats.json文件生成分析报告
// npx webpack-bundle-analyzer webpack-stats.json
```

### 4. 优化相关插件

#### 4.1 TerserWebpackPlugin

TerserWebpackPlugin 用于压缩 JavaScript 文件，是 Webpack 5 默认的 JavaScript 压缩工具，替代了之前的 UglifyJSPlugin。

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  // ...
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // 多进程并行压缩
        parallel: true,
        // 启用缓存
        cache: true,
        cacheKeys: (defaultCacheKeys) => {
          return {
            ...defaultCacheKeys,
            customKey: 'custom-value'
          };
        },
        // 压缩选项
        terserOptions: {
          parse: {
            // 支持ES2017语法
            ecma: 2017
          },
          compress: {
            // 移除console
            drop_console: true,
            // 移除debugger
            drop_debugger: true,
            // 移除未使用的变量
            unused: true,
            // 移除死代码
            dead_code: true,
            // 合并变量
            collapse_vars: true,
            // 优化if-else和逻辑表达式
            conditionals: true,
            // 优化循环
            loops: true,
            // 优化switch语句
            switches: true,
            // 移除console
            // 兼容旧浏览器
            ecma: 5,
            // 安全模式
            safe: true
          },
          mangle: {
            // 启用变量名混淆
            toplevel: false,
            // 保留类名
            keep_classnames: false,
            // 保留函数名
            keep_fnames: false,
            // 混淆属性名
            properties: false
          },
          output: {
            // 美化输出（生产环境通常为false）
            beautify: false,
            // 保留注释
            comments: false,
            // 支持ES2017语法
            ecma: 5
          }
        },
        // 输出详细信息
        extractComments: false,
        // 允许失败
        parallel: true,
        // 禁用源映射
        sourceMap: false
      })
    ]
  }
};

// 开发环境配置（禁用压缩）
module.exports = {
  // ...
  optimization: {
    minimize: false
  }
};

// 自定义输出注释
new TerserPlugin({
  extractComments: {
    condition: /^!/,
    filename: (fileData) => {
      return `${fileData.filename}.LICENSE.txt`;
    },
    banner: (commentsFile) => {
      return `License information can be found in ${commentsFile}`;
    }
  }
});
    ]
  }
};
```

#### 4.2 SplitChunksPlugin

SplitChunksPlugin 用于代码分割，将公共代码提取到单独的 bundle 中，是 Webpack 优化构建结果的核心插件之一。

```js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      // 选择哪些chunk进行分割
      chunks: 'all', // async(默认), initial, all

      // 分割的最小大小(以bytes为单位)
      minSize: 30000, // 默认30KB

      // 生成chunk的最大大小
      maxSize: 0, // 0表示不限制

      // 一个模块被引用的最小次数
      minChunks: 1,

      // 异步加载时的最大并发请求数
      maxAsyncRequests: 5,

      // 入口文件的最大并发请求数
      maxInitialRequests: 3,

      // chunk名称的分隔符
      automaticNameDelimiter: '~',

      // 是否允许自定义chunk名称
      name: true, // true或function

      // 缓存组配置
      cacheGroups: {
        // 默认缓存组配置
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
          name: 'common'
        },

        // 第三方库缓存组
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendors',
          chunks: 'all'
        },

        // React相关库单独提取
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-redux)[\\/]/,
          priority: -5, // 比vendors更高的优先级
          name: 'react-vendors',
          chunks: 'all'
        },

        // 工具库缓存组
        utilities: {
          test: /[\\/]node_modules[\\/](lodash|moment|axios)[\\/]/,
          priority: -15,
          name: 'utilities',
          chunks: 'all'
        },

        // 业务组件缓存组
        components: {
          test: /[\\/]src[\\/](components|containers)[\\/]/,
          minChunks: 2,
          priority: -25,
          name: 'components',
          chunks: 'all',
          enforce: true // 强制分割，忽略其他配置
        }
      }
    }
  }
};

// 自定义chunk名称
module.exports = {
  optimization: {
    splitChunks: {
      name: (module, chunks, cacheGroupKey) => {
        const moduleFileName = module.identifier().replace(/[\\/]|\\./g, '_');
        const allChunksNames = chunks.map(chunk => chunk.name).join('_');
        return `${cacheGroupKey}_${allChunksNames}_${moduleFileName}`;
      }
    }
  }
};

// 禁用默认缓存组
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false
      }
    }
  }
};

// 为异步chunk单独配置
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        asyncVendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'async',
          name: 'async-vendors',
          priority: -10
        }
      }
    }
  }
};
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendors'
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

### 5. 其他常用插件

**说明**：以下插件与内置插件功能相同，只是在不同的章节中进行了介绍。详情请参考 [1.4.4 内置 Plugin](#144-内置-plugin) 部分。

- DefinePlugin：定义全局常量
- ProvidePlugin：自动加载模块，无需手动 import
- ProgressPlugin：显示打包进度

### 6. Plugin 的执行顺序

Plugin 的执行顺序通常是按照在配置文件中定义的顺序执行的，但有些插件可能会在特定的生命周期阶段执行。

1. 首先执行所有插件的`apply`方法
2. 然后按照 Webpack 的构建生命周期顺序执行插件注册的钩子函数

### 7. 自定义 Plugin

如果现成的插件满足不了你的需求，你也可以自己动手写一个专属插件。就像给手机装一个自定义的小工具一样，Webpack 插件可以让你在打包过程中做任何你想做的事情。

```js
// 创建一个自定义插件类
class MyCustomPlugin {
  // 构造函数：接收插件配置（相当于给工具设置参数）
  constructor(options) {
    // 保存配置选项
    this.options = options;
  }

  // apply方法：Webpack会自动调用这个方法，并传入compiler对象
  // compiler是Webpack的核心引擎，包含了所有打包的信息和钩子
  apply(compiler) {
    // 注册一个"emit"阶段的钩子（emit阶段是指准备输出文件的时候）
    // tapAsync表示异步钩子，需要手动调用callback
    compiler.hooks.emit.tapAsync("MyCustomPlugin", (compilation, callback) => {
      // compilation包含了当前打包的所有资源信息
      // 这里我们打印出所有将要输出的文件名称
      console.log("即将输出的文件有:", Object.keys(compilation.assets));
      // 告诉Webpack钩子处理完成，可以继续打包
      callback();
    });

    // 注册一个"done"阶段的钩子（打包完成时触发）
    // tap表示同步钩子，不需要callback
    compiler.hooks.done.tap("MyCustomPlugin", (stats) => {
      // stats包含了打包的统计信息
      console.log("恭喜！打包成功完成！");
    });
  }
}

// 在Webpack配置中使用自定义插件
module.exports = {
  // ...其他配置
  plugins: [
    // 创建插件实例并传入配置选项
    new MyCustomPlugin({
      option1: "value1",
      option2: "value2",
    }),
  ],
};
```

## 配置选项详解

Webpack 的配置文件是一个 JavaScript 模块，它导出一个包含配置选项的对象。下面是 Webpack 主要配置选项的详细解释和示例：

### 1. resolve

`resolve`选项用于配置 Webpack 如何解析模块路径。

```js
module.exports = {
  resolve: {
    // 自动解析扩展名
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".vue"],
    // 别名配置
    alias: {
      "@": path.resolve(__dirname, "src"),
      components: path.resolve(__dirname, "src/components"),
      utils: path.resolve(__dirname, "src/utils"),
    },
    // 模块查找路径
    modules: ["node_modules", path.resolve(__dirname, "src")],
    // 主文件设置
    mainFields: ["main", "module", "browser"],
    // 条件导入解析
    conditionNames: ["require", "import"],
    // symlinks解析
    symlinks: true,
  },
};
```

### 2. plugins

`plugins`选项用于配置 Webpack 插件，插件可以执行更广泛的任务。

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  plugins: [
    // 清理输出目录
    new CleanWebpackPlugin(),
    // 生成HTML文件
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    // 环境变量定义
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
  ],
};
```

### 3. optimization

`optimization`选项用于配置 Webpack 的优化策略。

```js
module.exports = {
  optimization: {
    // 代码分割（详细配置请参考前面的优化章节）
    splitChunks: {
      chunks: "all",
    },
    // 其他优化配置请参考前面的优化章节
  },
};
```

### 4. devServer

`devServer`选项用于配置开发服务器，提供实时重新加载、热模块替换等功能。

```js
module.exports = {
  devServer: {
    // 内容根目录
    static: {
      directory: path.join(__dirname, "public"),
      publicPath: "/static/",
      watch: true,
      serveIndex: true,
      redirect: true,
    },
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: {
      target: ["http://localhost:3000", "http://localhost:3000/about"],
      app: { name: "chrome" },
    },
    // 热模块替换
    hot: true,
    // 只热更新不刷新
    hotOnly: true,
    // 代理配置
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
        secure: false,
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept.indexOf("html") !== -1) {
            return "/index.html";
          }
        },
      },
      "/images": {
        target: "http://localhost:8080",
        pathRewrite: {
          "^/images": "/assets/images",
        },
      },
    },
    // 压缩
    compress: true,
    // 错误叠加
    overlay: {
      warnings: true,
      errors: true,
      runtimeErrors: true,
    },
    // 历史API回退
    historyApiFallback: {
      disableDotRule: true,
      index: "/index.html",
      rewrites: [
        {
          from: /^\/about/,
          to: "/about.html",
        },
      ],
    },
    // 客户端配置
    client: {
      progress: true,
      logging: "info",
      overlay: true,
      reconnect: 5,
      webSocketURL: "ws://localhost:3000/ws",
    },
    // 自定义响应头
    headers: {
      "X-Custom-Header": "value",
      "Access-Control-Allow-Origin": "*",
    },
    // 实时重载
    liveReload: true,
    // 魔术HTML
    magicHtml: true,
    // 配置中间件
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error("webpack-dev-server is not defined");
      }

      // 自定义中间件
      devServer.app.get("/custom-endpoint", (req, res) => {
        res.json({ data: "custom data" });
      });

      return middlewares;
    },
    // 监听文件
    watchFiles: {
      paths: ["src/**/*", "public/**/*"],
      options: {
        usePolling: false,
      },
    },
    // 开发中间件
    devMiddleware: {
      writeToDisk: true,
      stats: "minimal",
    },
    // 服务器配置
    server: {
      type: "https",
      options: {
        key: fs.readFileSync("./server.key"),
        cert: fs.readFileSync("./server.cert"),
      },
    },
    // 不打印日志
    quiet: false,
    // 静默编译
    noInfo: false,
  },
};
```

#### 4.1 核心配置选项

##### static

配置静态资源目录和相关选项：

- `directory`: 静态资源目录路径
- `publicPath`: 静态资源的公共路径
- `watch`: 是否监听静态资源变化
- `serveIndex`: 是否显示目录列表
- `redirect`: 是否重定向到 publicPath

##### hot / hotOnly

- `hot`: 启用热模块替换，当模块更新时自动刷新页面
- `hotOnly`: 只启用热模块替换，不自动刷新页面

##### proxy

配置代理解决跨域问题：

- `target`: 代理目标地址
- `changeOrigin`: 是否修改请求头的 Origin 字段
- `pathRewrite`: 路径重写规则
- `secure`: 是否验证 SSL 证书
- `bypass`: 绕过代理的条件函数

##### historyApiFallback

配置单页应用的路由回退：

- `disableDotRule`: 是否禁用点规则
- `index`: 回退的首页
- `rewrites`: 自定义路径重写规则

##### client

配置客户端相关选项：

- `progress`: 是否显示进度条
- `logging`: 日志级别 ('none' | 'error' | 'warn' | 'info' | 'log' | 'verbose')
- `overlay`: 是否显示错误叠加层
- `reconnect`: 重连次数
- `webSocketURL`: WebSocket 连接 URL

##### watchFiles

配置要监听的文件：

- `paths`: 要监听的文件路径或目录
- `options`: 监听选项

#### 4.2 HTTPS 配置

开发环境也可以配置 HTTPS：

```js
const fs = require("fs");

module.exports = {
  devServer: {
    server: {
      type: "https",
      options: {
        key: fs.readFileSync("./ssl/server.key"),
        cert: fs.readFileSync("./ssl/server.cert"),
        ca: fs.readFileSync("./ssl/ca.pem"),
      },
    },
  },
};
```

#### 4.3 自定义中间件

可以通过 setupMiddlewares 添加自定义中间件：

```js
module.exports = {
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      // 记录请求日志
      devServer.app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
        next();
      });

      // 自定义API端点
      devServer.app.get("/api/version", (req, res) => {
        res.json({ version: "1.0.0" });
      });

      return middlewares;
    },
  },
};
```

### 5. performance

`performance`选项用于配置性能相关的警告和错误。

```js
module.exports = {
  performance: {
    // 性能提示开关
    hints: "warning",
    // 入口文件最大体积
    maxEntrypointSize: 500000,
    // 单个资源最大体积
    maxAssetSize: 500000,
    // 资源过滤
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith(".js") || assetFilename.endsWith(".css");
    },
  },
};
```

### 6. stats

`stats`选项用于配置构建输出信息的详细程度。

```js
module.exports = {
  stats: {
    // 输出颜色
    colors: true,
    // 输出模块信息
    modules: true,
    // 输出原因
    reasons: true,
    // 输出chunk信息
    chunks: true,
    // 输出chunk模块
    chunkModules: true,
    // 输出入口点
    entrypoints: true,
    // 输出错误
    errors: true,
    // 输出警告
    warnings: true,
    // 输出构建时间
    timings: true,
  },
};
```

### 7. target

`target`选项用于指定 Webpack 构建的目标环境。

```js
module.exports = {
  // 浏览器环境
  target: "web",
  // Node.js环境
  target: "node",
  // WebWorker环境
  target: "webworker",
  // 多目标
  target: ["web", "es5"],
};
```

### 8. externals

`externals`选项用于排除某些模块，不将其打包到 bundle 中。

```js
module.exports = {
  externals: {
    // 不打包jQuery
    jquery: "jQuery",
    // 使用CDN的React
    react: "React",
    "react-dom": "ReactDOM",
    // 正则表达式
    "^[a-z\\-]+$": "commonjs $&",
  },
};
```

### 9. watch

`watch`选项用于启用文件监听，当文件变化时自动重新构建。

```js
module.exports = {
  watch: true,
  watchOptions: {
    // 忽略目录
    ignored: /node_modules/,
    // 防抖时间
    aggregateTimeout: 300,
    // 轮询时间
    poll: 1000,
  },
};
```

### 10. devtool

`devtool`选项用于配置 Source Map 的生成方式。

```js
module.exports = {
  // 开发环境推荐
  devtool: "cheap-module-eval-source-map",
  // 生产环境推荐
  devtool: "source-map",
  // 更详细的开发环境配置
  devtool: "eval-cheap-module-source-map",
};
```

#### 10.1 devtool 选项说明

- `eval`: 最快，使用 eval 包裹模块代码
- `cheap`: 不包含列信息
- `module`: 包含 loader 的 source map
- `source-map`: 生成独立的 source map 文件
- `inline`: 将 source map 内联到 bundle 中
- `hidden`: 生成 source map 但不引用

### 11. context

`context`选项用于设置解析入口和 loader 的基础目录。

```js
module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: "./index.js", // 相对于context
};
```

### 12. resolveLoader

`resolveLoader`选项用于配置 Webpack 如何解析 loader。

```js
module.exports = {
  resolveLoader: {
    // 查找路径
    modules: ["node_modules", path.resolve(__dirname, "loaders")],
    // 自动解析扩展名
    extensions: [".js", ".json"],
    // 别名
    alias: {
      "my-loader": path.resolve(__dirname, "loaders/my-loader.js"),
    },
  },
};
```

## 完整配置示例

下面是一个包含大部分配置选项的完整示例：

```js
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  // 基础目录
  context: path.resolve(__dirname, "src"),
  // 入口文件
  entry: {
    main: "./index.js",
    vendor: "./vendor.js",
  },
  // 输出配置
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].chunk.js",
    publicPath: "/",
    clean: true,
  },
  // 模式
  mode: "production",
  // 模块配置
  module: {
    rules: [
      // JavaScript处理
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: ["last 2 versions"],
                  },
                  useBuiltIns: "usage",
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },
      // CSS处理
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: false,
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
      // SCSS处理
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      // 图片处理
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8192,
          },
        },
        generator: {
          filename: "images/[name].[hash][ext][query]",
        },
      },
      // 字体处理
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[hash][ext][query]",
        },
      },
    ],
  },
  // 解析配置
  resolve: {
    extensions: [".js", ".json", ".jsx", ".ts", ".tsx"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      components: path.resolve(__dirname, "src/components"),
      utils: path.resolve(__dirname, "src/utils"),
    },
    modules: ["node_modules", path.resolve(__dirname, "src")],
  },
  // 插件配置
  plugins: [
    // 清理输出目录
    new CleanWebpackPlugin(),
    // 生成HTML文件
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
      title: "Webpack App",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    // 提取CSS
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css",
    }),
    // 定义环境变量
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.env.API_URL": JSON.stringify("https://api.example.com"),
    }),
    // 自动加载模块
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    // 进度条
    new webpack.ProgressPlugin(),
  ],
  // 优化配置
  optimization: {
    // 代码分割
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: -10,
        },
        common: {
          name: "common",
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    // 运行时代码
    runtimeChunk: {
      name: "runtime",
    },
    // 压缩
    minimizer: [
      // 压缩JavaScript
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
          output: {
            comments: false,
          },
        },
      }),
      // 压缩CSS
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require("cssnano"),
        cssProcessorOptions: {
          discardComments: { removeAll: true },
          safe: true,
        },
      }),
    ],
    // 模块合并
    concatenateModules: true,
    // 移除未使用的导出
    usedExports: true,
    // 侧输出优化
    sideEffects: true,
  },
  // 性能配置
  performance: {
    hints: "warning",
    maxEntrypointSize: 500000,
    maxAssetSize: 500000,
  },
  // 统计信息
  stats: {
    colors: true,
    modules: false,
    reasons: false,
    chunks: false,
    chunkModules: false,
  },
  // 目标环境
  target: "web",
  // 外部依赖
  externals: {
    jquery: "jQuery",
  },
};
```

### 生产环境配置

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].chunk.js",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]",
              outputPath: "images/",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      // 压缩HTML
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],
  // 优化配置
  optimization: {
    // 代码分割
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
    // 压缩配置
    minimizer: [
      // 压缩CSS
      new OptimizeCssAssetsPlugin(),
      // 压缩JavaScript
      new TerserPlugin(),
    ],
  },
};
```

## 代码分割与懒加载

代码分割是 Webpack 中一个重要的优化策略，可以将代码拆分成多个 bundle，实现按需加载，减少初始加载时间。

### 1. 代码分割策略

代码分割主要有三种策略：

1. **入口点分割**：通过配置多个入口点将代码分割
2. **动态导入分割**：通过动态导入(`import()`)实现按需加载
3. **SplitChunksPlugin 分割**：自动将公共模块和第三方库分割

### 2. 入口点分割

通过配置多个入口点，可以将不同页面或功能的代码分割到不同的 bundle 中：

```js
module.exports = {
  entry: {
    main: "./src/index.js",
    admin: "./src/admin.js",
    checkout: "./src/checkout.js",
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

**注意事项**：入口点分割会导致重复代码，需要使用 SplitChunksPlugin 来提取公共模块。

### 3. SplitChunksPlugin 详细配置

SplitChunksPlugin 是 Webpack 内置的代码分割插件，提供了丰富的配置选项：

```js
module.exports = {
  optimization: {
    splitChunks: {
      // 选择要分割的chunk类型：all, async, initial
      chunks: "all",
      // 最小chunk大小（以字节为单位）
      minSize: 20000,
      // 生成chunk的最小请求次数
      minChunks: 1,
      // 按需加载时的最大并行请求数
      maxAsyncRequests: 30,
      // 初始加载时的最大并行请求数
      maxInitialRequests: 30,
      // 自动命名时的分隔符
      automaticNameDelimiter: "~",
      // 是否允许自动命名
      name: true,
      // 缓存组配置
      cacheGroups: {
        // 第三方库缓存组
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: -10,
          // 是否继承splitChunks的配置
          enforce: true,
        },
        // 公共模块缓存组
        common: {
          name: "common",
          minChunks: 2,
          priority: -20,
          // 重用已存在的chunk
          reuseExistingChunk: true,
          // 自定义命名函数
          name(module, chunks, cacheGroupKey) {
            const moduleFileName = module
              .identifier()
              .split("/")
              .reduceRight((item) => item);
            const allChunksNames = chunks.map((item) => item.name).join("~");
            return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
          },
        },
        // React相关库缓存组
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: "react-vendors",
          priority: -5,
        },
        // Lodash库缓存组
        lodash: {
          test: /[\\/]node_modules[\\/](lodash)[\\/]/,
          name: "lodash-vendor",
          priority: -5,
        },
      },
    },
  },
};
```

### 4. 动态导入与懒加载

动态导入是实现按需加载的核心技术，使用`import()`语法可以在运行时动态加载模块：

#### 4.1 基本用法

```js
// 按钮点击时加载模块
button.addEventListener("click", async () => {
  try {
    const module = await import("./lazy-module.js");
    module.default();
  } catch (error) {
    console.error("模块加载失败:", error);
  }
});
```

#### 4.2 命名动态导入

```js
// 使用webpackChunkName注释指定生成的chunk名称
async function loadComponent() {
  const { default: Component } = await import(
    /* webpackChunkName: "lazy-component" */
    "./components/LazyComponent.js"
  );
  return Component;
}
```

#### 4.3 预加载与预取

- **预加载(preload)**：立即加载关键资源，用于当前页面
- **预取(prefetch)**：空闲时加载非关键资源，用于未来页面

```js
// 预加载当前页面需要的资源
const criticalModule = await import(
  /* webpackPreload: true */
  "./critical-module.js"
);

// 预取未来页面可能需要的资源
button.addEventListener("mouseenter", () => {
  import(
    /* webpackPrefetch: true */
    "./modal.js"
  );
});
```

#### 4.4 条件加载

```js
// 根据条件加载不同模块
async function loadFeature(featureName) {
  let featureModule;

  switch (featureName) {
    case "analytics":
      featureModule = await import("./analytics.js");
      break;
    case "chat":
      featureModule = await import("./chat.js");
      break;
    case "payment":
      featureModule = await import("./payment.js");
      break;
    default:
      throw new Error("未知功能");
  }

  return featureModule;
}
```

### 5. 与框架结合的懒加载

#### 5.1 React 路由懒加载

```js
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// 懒加载路由组件
const Home = lazy(() => import("./routes/Home"));
const About = lazy(() => import("./routes/About"));
const Dashboard = lazy(() => import("./routes/Dashboard"));
const Profile = lazy(() => import("./routes/Profile"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </Suspense>
    </Router>
  );
}
```

#### 5.2 Vue 路由懒加载

```js
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
```

### 6. 动态导入的高级用法

#### 6.1 动态导入表达式

```js
// 使用表达式动态加载模块
async function loadModule(moduleName) {
  const module = await import(`./modules/${moduleName}.js`);
  return module;
}

// 调用示例
loadModule("user").then((module) => {
  module.init();
});
```

#### 6.2 并行加载多个模块

```js
// 并行加载多个模块
async function loadMultipleModules() {
  const [moduleA, moduleB, moduleC] = await Promise.all([
    import("./moduleA.js"),
    import("./moduleB.js"),
    import("./moduleC.js"),
  ]);

  return { moduleA, moduleB, moduleC };
}
```

### 7. 代码分割的最佳实践

1. **分割第三方库**：将 React、Vue 等第三方库分割到单独的 bundle
2. **分割公共模块**：将被多个页面或组件使用的公共模块分割
3. **按路由分割**：将不同路由对应的组件分割到不同的 bundle
4. **按需加载**：对非首屏内容和用户触发的功能使用懒加载
5. **合理设置缓存组**：根据项目需求配置不同的缓存组策略
6. **避免过度分割**：过多的 small bundle 会增加 HTTP 请求次数
7. **使用预加载/预取**：根据资源的重要性和使用时机合理使用

### 8. 代码分割的监控与分析

使用 WebpackBundleAnalyzer 可以分析代码分割的效果：

```js
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "bundle-analysis.html",
      openAnalyzer: false,
    }),
  ],
};
```

运行构建后，会生成一个 HTML 报告，展示各个 bundle 的大小和依赖关系。

### 环境变量

使用环境变量可以在不同环境下使用不同的配置。

```js
// webpack.config.js
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    // 环境变量插件
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.API_URL": JSON.stringify(process.env.API_URL),
    }),
  ],
};
```

### 常用命令

```bash
# 开发模式构建
npx webpack --mode development

# 生产模式构建
npx webpack --mode production

# 使用开发服务器
npx webpack serve --mode development

# 使用指定配置文件
npx webpack --config webpack.custom.config.js
```

### 最佳实践

1. **使用不同的配置文件**：为开发环境和生产环境使用不同的配置文件
2. **代码分割**：将第三方库和公共模块分割到不同的 bundle 中
3. **懒加载**：对非关键模块使用懒加载
4. **优化图片**：使用适当的 loader 处理和优化图片
5. **使用缓存**：利用 contenthash 实现缓存策略
6. **减少 bundle 大小**：使用 tree shaking 等技术减少 bundle 大小
7. **使用 ESLint**：在构建过程中检查代码质量

### 常见问题

#### Module not found

**问题**：无法找到模块

**解决方案**：

- 检查模块是否已安装
- 检查模块路径是否正确
- 检查 webpack 配置是否正确

#### CSS 样式不生效

**问题**：CSS 样式没有应用到页面上

**解决方案**：

- 检查是否正确配置了 style-loader 和 css-loader
- 检查 CSS 文件路径是否正确
- 检查是否有语法错误

#### 图片无法显示

**问题**：图片无法在页面上显示

**解决方案**：

- 检查是否正确配置了 file-loader 或 url-loader
- 检查图片路径是否正确
- 检查 outputPath 配置是否正确

### 总结

Webpack 是一个功能强大的前端构建工具，通过合理的配置和使用，可以大大提高前端开发效率和应用性能。Webpack 的核心是模块化和打包，可以处理多种资源类型，并提供了丰富的插件和 loader 生态系统。通过学习和掌握 Webpack 的使用，可以更好地管理和优化前端项目。
