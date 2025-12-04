// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: false // 生产环境禁用 devtools
  },

  // Nitro 配置，解决 Vercel 部署问题
  nitro: {
    // 设置数据目录为 /tmp，这是 Vercel 上唯一可写的目录
    dataDir: '/tmp/.nuxt/data',
    // 使用内存存储作为默认存储
    storage: {
      default: {
        driver: 'memory'
      }
    },
    // 确保在 Vercel 上使用正确的预设
    preset: 'vercel',
    // 禁用文件系统缓存
    cache: {
      storage: 'memory'
    }
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
    authSecret: process.env.AUTH_SECRET || 'dev-secret-change-me',
    public: {
      appName: process.env.APP_NAME || 'NDM Notes'
    }
  },

  // 优化生产构建
  build: {
    // 启用生产模式优化
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  },

  // 错误处理
  errorHandler: (error, { res, redirect }) => {
    console.error('Nuxt error:', error)
    if (res) {
      res.statusCode = 500
      res.end('An error occurred')
    } else if (redirect) {
      redirect('/')
    }
  },

  typescript: {
    strict: true
  }
})
