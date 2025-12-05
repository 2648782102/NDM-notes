# NDM Notes

现代化动画笔记应用，基于 Nuxt 全栈实现。

## 功能特点

- ✨ **现代化 UI 设计**：采用玻璃态设计风格，支持浅色/暗色主题切换
- 📝 **Markdown 编辑器**：支持丰富的 Markdown 语法，实时预览
- 📋 **笔记管理**：创建、编辑、删除、分类笔记
- 🏷️ **标签系统**：为笔记添加标签，方便分类和搜索
- 🔍 **分类筛选**：按分类快速筛选笔记
- 💾 **自动保存**：编辑内容自动保存，避免数据丢失
- 📱 **响应式设计**：完美适配桌面端和移动端
- 🔐 **用户认证**：安全的用户名密码认证系统
- 🎨 **流畅动画**：精心设计的过渡动画效果

## 技术栈

- **框架**：Nuxt 4
- **前端**：Vue 3, TypeScript, SCSS
- **UI 组件**：Font Awesome 图标
- **Markdown 解析**：marked, highlight.js
- **状态管理**：Vue Composition API
- **构建工具**：Vite
- **包管理器**：Yarn

## 安装步骤

### 环境要求

- Node.js 18.x 或更高版本
- Yarn 4.x

### 安装依赖

```bash
# 安装依赖
yarn install
```

### 开发模式

```bash
# 启动开发服务器
yarn dev
```

应用将在 `http://localhost:3000` 启动。

### 生产构建

```bash
# 构建生产版本
yarn build

# 预览生产构建
yarn preview
```

## 项目结构

```
├── app/                  # 应用代码
│   ├── components/        # Vue 组件
│   ├── composables/       # 组合式函数
│   ├── middleware/        # 中间件
│   ├── pages/            # 页面组件
│   ├── plugins/           # 插件
│   └── app.vue            # 根组件
├── assets/               # 静态资源
│   └── styles/           # 样式文件
├── public/               # 公共静态文件
├── server/               # 服务端代码
│   ├── api/              # API 路由
│   └── utils/            # 工具函数
├── nuxt.config.ts        # Nuxt 配置
├── package.json          # 项目配置
└── tsconfig.json         # TypeScript 配置
```

## 核心组件

### NoteEditor

Markdown 编辑器组件，支持：
- 实时预览
- 工具栏快捷操作
- 代码高亮
- 表格、列表、引用等 Markdown 语法
- 标签和分类管理

### NoteList

笔记列表组件，支持：
- 笔记卡片展示
- 分类筛选
- 新建笔记
- 笔记选择

### AuthUserBadge

用户认证徽章，显示当前登录用户信息。

## 组合式函数

### useNotes

管理笔记数据，提供：
- 笔记列表获取
- 分类获取
- 笔记创建、更新、删除
- 错误处理

### useEditor

编辑器状态管理，提供：
- 编辑器状态同步
- 自动保存
- 编辑模式切换
- 标签管理

### useAuth

用户认证管理，提供：
- 登录/登出
- 用户信息获取

## API 接口

### 认证相关

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

### 笔记相关

- `GET /api/notes` - 获取笔记列表
- `POST /api/notes` - 创建笔记
- `GET /api/notes/:id` - 获取单个笔记
- `PUT /api/notes/:id` - 更新笔记
- `DELETE /api/notes/:id` - 删除笔记
- `GET /api/categories` - 获取分类列表

## 主题配置

应用支持浅色/暗色主题切换，主题配置位于 `assets/styles/app.scss`。

## 部署

### Netlify 部署

项目已配置 Netlify 部署，使用 Nitro 预设。

### 环境变量

- `AUTH_SECRET` - 认证密钥
- `APP_NAME` - 应用名称

## 开发规范

- 使用 TypeScript 编写代码
- 组件采用 Composition API
- 样式使用 SCSS
- 遵循 ESLint 和 Prettier 规范

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 演示账号

- 用户名: demo
- 密码: demo123

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 更新日志

### v1.0.0

- 初始版本发布
- 实现基本的笔记管理功能
- 支持 Markdown 编辑
- 实现用户认证
- 响应式设计

## 作者

NDM Notes 团队