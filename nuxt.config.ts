// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // 添加 Nuxt UI 模块
  modules: ['@nuxt/ui'],

  // Nuxt UI 配置
  ui: {
    // 主题配置
    theme: {
      extend: {
        colors: {
          // 可以在这里扩展或覆盖默认颜色
          primary: '#6366f1',
          secondary: '#818cf8',
          accent: '#a5b4fc',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        }
      }
    },
    // 禁用字体功能，避免连接Google Fonts超时
    fonts: false
  },

  app: {
    head: {
      title: 'NDM Notes',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: '现代化动画笔记应用，基于 Nuxt 全栈实现'
        }
      ]
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    },
    layoutTransition: {
      name: 'layout',
      mode: 'out-in'
    }
  },

  runtimeConfig: {
    // 简化为固定默认值，生产环境可在 Nuxt 的 runtimeConfig 中通过环境变量覆盖
    authSecret: 'dev-secret-change-me',
    public: {
      appName: 'NDM Notes'
    }
  },

  typescript: {
    strict: true
  }
})
