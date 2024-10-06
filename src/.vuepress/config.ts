import { defineUserConfig } from 'vuepress'

import theme from './theme.js'

export default defineUserConfig({
  base: '/blog/',

  lang: 'zh-CN',
  title: '博客演示',
  description: 'vuepress-theme-hope 的博客演示',

  theme,

  extendsPageOptions: (extendable, app) => {
    if (extendable.path === '/404.html') {
      console.log(app)
      console.log(extendable)

      extendable.frontmatter.layout = 'NotFound'
    }
  },

  // 和 PWA 一起启用
  shouldPrefetch: false
})
