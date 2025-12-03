## NDM Notes - 现代化全栈笔记应用

一个使用 **Nuxt 4 + TypeScript + TailwindCSS** 构建的现代化、高性能笔记应用，提供流畅的跨平台体验。

### 🎯 项目优势

- **全栈一体化**：基于 Nuxt 4 构建，前后端代码统一管理，开发效率提升
- **现代化 UI**：采用玻璃拟态设计风格，搭配流畅的动画效果，视觉体验出色
- **移动端优化**：针对移动设备进行了深度优化，包括性能、布局和交互
- **Markdown 支持**：内置功能丰富的 Markdown 编辑器，支持实时预览
- **响应式设计**：完美适配各种屏幕尺寸，从手机到桌面设备
- **类型安全**：使用 TypeScript 确保代码质量和可维护性
- **高性能**：优化的渲染和动画，确保流畅的用户体验

### 📱 移动端特性

- 底部操作栏，便于单手操作
- 优化的触摸区域，提升交互体验
- 流畅的滚动和动画效果
- 键盘遮挡自动处理
- 响应式布局，适配各种屏幕尺寸

### 📸 应用截图

<!-- 预留图片位置 -->
| 桌面端 | 移动端 |
|--------|--------|
| ![桌面端截图](https://example.com/desktop-screenshot.png) | ![移动端截图](https://example.com/mobile-screenshot.png) |
| ![编辑器截图](https://example.com/editor-screenshot.png) | ![笔记列表截图](https://example.com/notes-list-screenshot.png) |

### ✨ 核心功能

- **身份认证**：支持注册 / 登录 / 退出，基于服务端 session + HTTP-only Cookie
- **笔记管理**：笔记列表、创建、编辑、删除
- **分类与标签**：按分类筛选、支持为笔记添加多个标签
- **Markdown 编辑器**：支持实时预览、分屏编辑、工具栏快捷操作
- **现代化 UI**：玻璃拟态风格、细腻过渡和列表动画
- **主题切换**：支持明暗主题切换

> 注意：当前项目使用 **内存数据存储**（Map），仅用于演示。重启 dev 服务器后数据会清空。后续可替换为数据库（如 PostgreSQL / MySQL / MongoDB / Prisma 等）。

### 🚀 快速开始

#### 内置演示账号
**用户名 `demo` / 密码 `demo123`**

#### 安装依赖

```bash
# 建议使用 yarn，已提供 yarn.lock
yarn install
```

#### 启动开发环境

```bash
yarn dev
```

启动后访问：`http://localhost:3000`

#### 生产构建

```bash
yarn build
yarn preview
```

更多部署说明可参考 Nuxt 官方文档（Deployment 部分）。

### 🛠️ 技术栈

- **前端框架**：Vue 3 + Nuxt 4
- **开发语言**：TypeScript
- **样式框架**：TailwindCSS + SCSS
- **Markdown 解析**：marked + highlight.js
- **构建工具**：Vite
- **部署方案**：Nitro

### 📁 项目结构

```
├── app/                  # 应用源码
│   ├── components/       # Vue 组件
│   ├── composables/      # 组合式 API
│   ├── middleware/       # 中间件
│   ├── pages/            # 页面组件
│   └── app.vue           # 根组件
├── assets/               # 静态资源
├── locales/              # 国际化文件
├── public/               # 公共资源
├── server/               # 服务端代码
│   ├── api/              # API 路由
│   └── utils/            # 工具函数
├── nuxt.config.ts        # Nuxt 配置
├── tailwind.config.mjs   # Tailwind 配置
└── tsconfig.json         # TypeScript 配置
```

### 🎨 设计特点

- **玻璃拟态风格**：半透明背景 + 模糊效果
- **流畅动画**：元素过渡、悬停效果、列表动画
- **响应式设计**：移动端优先，适配各种屏幕
- **深色主题**：支持明暗主题切换
- **直观交互**：清晰的视觉层次和操作反馈

### 📝 开发说明

- 本项目使用 **Nuxt 4**，请确保 Node.js 版本 >= 20
- 建议使用 **VS Code** 作为开发工具，并安装推荐插件
- 代码遵循 ESLint 和 Prettier 规范

### 🔗 相关链接

- [Nuxt 官方文档](https://nuxt.com/docs)
- [Vue 3 官方文档](https://vuejs.org/guide/introduction.html)
- [TailwindCSS 官方文档](https://tailwindcss.com/docs)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)

### 📄 许可证

MIT License

### 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**NDM Notes** - 现代化全栈笔记应用，为您提供流畅的笔记体验！ 🚀