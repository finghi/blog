import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "文章",
      icon: "book",
      prefix: "posts/",
      children: "structure",
      collapsible: true,
    },   
    {
      text: "博客",
      icon: "fa-solid fa-chart-simple ",
      prefix: "blog/",
      collapsible: true,      
      children: [ {
        text: "Golang",
        icon: "book",
        prefix: "golang/",
        children: "structure",
        collapsible: true,      
      }, 
      "dads","my"
    ],      
    },
   
    "intro",
    
    // {
    //   text: "幻灯片",
    //   icon: "person-chalkboard",
    //   link: "https://plugin-md-enhance.vuejs.press/zh/guide/content/revealjs/demo.html",
    // },
    // {
    //   text: "如何使用",
    //   icon: "laptop-code",
    //   prefix: "demo/",
    //   link: "demo/",
    //   children: "structure",
    // },
  ],
  
});
