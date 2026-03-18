import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "文档",
      icon: "book",
      prefix: "docs/",      
      collapsible: true,      
      children: "structure",
    },
    {
      text: "博客",
      icon: "hippo",
      prefix: "posts/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "华为学习",
      icon: "hippo",
      prefix: "huawei/",
      collapsible: true,
      children: "structure",
    },
    "intro",
    // {
    //   text: "如何使用",
    //   icon: "poo",
    //   prefix: "demo/",
    //   link: "demo/",
    //   collapsible: true,
    //   children: "structure",
    // },
    // {
    //   text: "幻灯片",
    //   icon: "person-chalkboard",
    //   link: "https://ecosystem.vuejs.press/zh/plugins/markdown/revealjs/demo.html",
    // },
  ],
});
