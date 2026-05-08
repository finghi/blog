---
title: CSS面试题
icon: network-wired
# order: 7
date: 2026-03-24
category:
  - 面试题
tag:
  - CSS
  - 面试题
---

### 1、CSS 中 伪类和伪元素的区别？
伪类：选择元素的状态或行为，如 :hover、:focus、:active 等。
伪元素：选择元素的某个部分，如 ::first-letter、::first-line、::before 等。
伪类是给已存在的元素加“状态滤镜”。
伪元素是凭空创建虚拟元素或区域来添加内容或样式。

### 2、什么是BFC？
BFC（Block Formatting Context）是块级格式化上下文，它是一个独立的渲染区域，内部的元素不会影响到外部的元素。
BFC 有以下几个特点：
- 内部元素垂直排列：在 BFC 中，块级元素会从顶部开始一个接一个地垂直排列。
- 外边距合并（Margin Collapse）：属于同一个 BFC 的相邻块级元素会发生外边距合并（上下 margin 重叠）。但 BFC 本身可以阻止它与子元素的外边距合并。
- 隔离性：BFC 的区域不会与浮动元素（float）重叠，且 BFC 会计算浮动元素的高度（解决父元素高度塌陷）。
- 独立性：BFC 内的元素不会影响外部的布局，外部的元素也不会影响 BFC 内部的布局。

### 3、如何开启 BFC？
只要给元素设置以下任意一个 CSS 属性，即可将其变成一个 BFC 容器：
|触发方式|代码示例|备注|
|----|---------|---------|
|浮动元素|float: left / right;|只要 float不为 none。|
|绝对/固定定位|position: absolute / fixed;|将元素转换为块级元素，开启 BFC|
|行内块元素|display: inline-block;|将元素浮动，开启 BFC|
|表格单元格|display: table-cell;|包括 table、table-row等。|
|弹性/网格布局|display: flex / inline-flex / grid;|现代布局方式。|
|Overflow 非 visible|overflow: hidden / auto / scroll;|最常用且副作用较小的方法。|
|Flow-root|display: flow-root;|专门用于创建 BFC，无副作用，现代浏览器推荐。|

最佳实践建议：在不需要兼容旧版 IE 的情况下，优先使用 display: flow-root;来创建 BFC，因为它不会产生滚动条或剪裁内容，语义最明确。

### 4、CSS 引入方式有哪些？link和@ import的区别是什么？
css引入方式：
- 内联样式：直接在 HTML 元素中使用 style 属性，将样式写在标签内部。
- 内部样式：将样式写在一个 style 元素内
- 外部样式：使用 link 标签引入 css 文件。
link 引用CSS，在页面载入时同时加载，即同步加载。
@import 引用CSS，则需要等到网页完全载入后，再加载CSS文件，即异步加载。 

@import 是css2.1中提出的，不支持低版本的浏览器。 

