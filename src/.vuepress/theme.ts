import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";
let pagelist: string[] = ["/demo", "/m"];

export default hopeTheme({
  hostname: "https://mister-hope.github.io",

  author: {
    name: "Mr.lujhua",
    url: "https://blog.vipjoker.cn/blog/",
  },

  logo: "https://pinia.vuejs.org/logo.svg",

  // repo: "vuepress-theme-hope/vuepress-theme-hope",

  docsDir: "src",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页脚
  footer: "默认页脚",
  displayFooter: true,
  

  // 博客相关
  blog: {
    description: "一个前端开发者",
    intro: "/intro.html",
    medias: {     
      //   Zhihu: "https://example.com",
      VuePressThemeHope: {
        icon: "https://theme-hope-assets.vuejs.press/logo.svg",
        link: "https://theme-hope.vuejs.press",
      },
    },
  },

  // 加密配置
  encrypt: {
    config: {
      "/demo/encrypt.html": {
        hint: "输入密码",
        password: "1234",
      },
    },
  },

  // 多语言配置
  // metaLocales: {
  //   editLink: "在 GitHub 上编辑此页",
  // },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 此处开启了很多功能用于演示，你应仅保留用到的功能。
  markdown: {
    alert: true,
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    demo: true,
    figure: true,
    gfm: true,
    imgLazyload: true,
    imgSize: true,
    include: true,
    mark: true,
    plantuml: true,
    spoiler: true,
    stylize: [
      {
        matcher: "Recommended",
        replacer: ({ tag }) => {
          if (tag === "em")
            return {
              tag: "Badge",
              attrs: { type: "tip" },
              content: "Recommended",
            };
        },
      },
    ],
    sub: true,
    sup: true,
    tabs: true,
    tasklist: true,
    vPre: true,
    

    // 取消注释它们如果你需要 TeX 支持
    // math: {
    //   // 启用前安装 katex
    //   type: "katex",
    //   // 或者安装 mathjax-full
    //   type: "mathjax",
    // },

    // 如果你需要幻灯片，安装 @vuepress/plugin-revealjs 并取消下方注释
    // revealjs: {
    //   plugins: ["highlight", "math", "search", "notes", "zoom"],
    // },

    // 在启用之前安装 chart.js
    // chartjs: true,

    // insert component easily

    // 在启用之前安装 echarts
    // echarts: true,

    // 在启用之前安装 flowchart.ts
    // flowchart: true,

    // 在启用之前安装 mermaid
    // mermaid: true,

    // playground: {
    //   presets: ["ts", "vue"],
    // },

    // 在启用之前安装 @vue/repl
    // vuePlayground: true,

    // 在启用之前安装 sandpack-vue3
    // sandpack: true,
  },
  editLink: false,

  // 在这里配置主题提供的插件
  plugins: {
    
    blog: {
      filter(page) {
        let path: string = page.path;
        return !pagelist.some((item) => path.startsWith(item));
      },
    },
    // 启用 Giscus 评论系统
    comment: {
      provider: "Giscus",
      repo: "finghi/blog", // 替换为你的 GitHub 仓库
      repoId: "R_kgDOMzaG-w", // 替换为你的仓库 ID
      category: "General", // 讨论分类
      categoryId: "DIC_kwDOMzaG-84CiofU", // 替换为你的分类 ID
      mapping: "pathname", // 页面与讨论的映射方式
      strict: true, // 严格匹配映射
      reactionsEnabled: true, // 启用反应表情
      inputPosition: "bottom", // 输入框位置
    },    
  },
});
