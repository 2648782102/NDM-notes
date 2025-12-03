## NDM Notes - Nuxt 全栈笔记应用示例

一个使用 **Nuxt 4 + TypeScript + TailwindCSS** 构建的现代化笔记应用示例，包含：

- **身份认证**：支持注册 / 登录 / 退出，基于服务端 session + HTTP-only Cookie
- **笔记管理**：笔记列表、创建、编辑、删除
- **分类与标签**：按分类筛选、支持为笔记添加多个标签
- **现代 UI 和动画**：玻璃拟态风格、细腻过渡和列表动画

> 注意：当前项目使用 **内存数据存储**（Map），仅用于演示。重启 dev 服务器后数据会清空。后续可替换为数据库（如 PostgreSQL / MySQL / MongoDB / Prisma 等）。

### 功能说明

- 内置演示账号：**用户名 `demo` / 密码 `demo123`**
- 登录后可：
  - 新建、编辑、删除笔记
  - 为笔记设置 **分类** 和多个 **标签**
  - 在左侧根据分类快速筛选

### 安装依赖

```bash
# 建议使用 yarn，已提供 yarn.lock
yarn install
```

### 启动开发环境

```bash
yarn dev
```

启动后访问：`http://localhost:3000`

### 生产构建

```bash
yarn build
yarn preview
```

更多部署说明可参考 Nuxt 官方文档（Deployment 部分）。
