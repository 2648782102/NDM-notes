<template>
  <div class="app-root">
      <!-- 背景效果 -->
      <div class="app-bg app-bg-1" />
      <div class="app-bg app-bg-2" />
      <div class="app-bg app-bg-3" />

      <!-- 顶部导航栏 -->
      <header class="app-header">
        <div class="app-header-content">
          <!-- 左侧：Logo -->
          <div class="app-header-left">
            <div class="app-logo app-logo-header" @click="onLogoClick">
              <div class="app-logo-icon">
                <FontAwesomeIcon icon="file-text" size="xl" />
              </div>
              <div class="app-logo-text app-logo-text-header">
                <div class="app-logo-title">{{ config.public.appName }}</div>
              </div>
            </div>
          </div>

          <!-- 右侧：主题切换和用户信息 -->
          <div class="app-header-right">
            <!-- 主题切换按钮 -->
            <button
              @click="toggleTheme"
              class="theme-toggle-native"
            >
              <FontAwesomeIcon v-if="currentTheme === 'dark'" icon="sun" size="xl" class="text-yellow-400 transition-colors duration-300" />
              <FontAwesomeIcon v-else icon="moon" size="xl" class="text-indigo-500 transition-colors duration-300" />
            </button>

            <!-- 用户信息区域 - 原生实现 -->
            <div class="user-info-container">
              <!-- 已登录状态 -->
              <template v-if="user">
                <div class="user-info">
                  <!-- 头像 -->
                  <div class="user-avatar" @click="toggleUserMenu">
                    <div class="avatar-inner">
                      {{ userInitial }}
                    </div>
                    <!-- 状态指示器 -->
                    <div class="status-indicator"></div>
                  </div>
                  <!-- 用户名 -->
                  <span class="username">{{ user.username }}</span>
                  <!-- 退出按钮 -->
                  <button class="logout-btn" @click="handleLogout">
                    <FontAwesomeIcon icon="right-from-bracket" size="sm" />
                  </button>
                </div>
              </template>
              <!-- 未登录状态 -->
              <template v-else>
                <NuxtLink to="/login" class="login-link">
                  <button class="login-btn">
                    <FontAwesomeIcon icon="right-to-bracket" size="sm" />
                    <span>登录</span>
                  </button>
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>
      </header>

    <!-- 主要内容 -->
    <main class="app-main">
      <NuxtPage />
    </main>

    <!-- 底部导航栏 - 仅在移动端显示 -->
    <footer class="app-footer-mobile">
    <nav class="app-nav-mobile">
      <button class="nav-item" @click="$router.push('/')">
        <FontAwesomeIcon icon="home" size="xl" />
        <span>首页</span>
      </button>
      <button class="nav-item" @click="handleNewNote">
        <FontAwesomeIcon icon="plus" size="xl" />
        <span>新建</span>
      </button>
      <button class="nav-item" @click="toggleTheme">
        <FontAwesomeIcon v-if="currentTheme === 'dark'" icon="sun" size="xl" />
        <FontAwesomeIcon v-else icon="moon" size="xl" />
        <span>主题</span>
      </button>
      <button class="nav-item" @click="$router.push('/profile')">
        <FontAwesomeIcon icon="user" size="xl" />
        <span>我的</span>
      </button>
    </nav>
  </footer>
    </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

// 主题切换功能
const currentTheme = useCookie<string>('theme', { default: () => 'dark' })

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
  updateTheme()
}

const updateTheme = () => {
  // 只在客户端执行，因为服务器端没有 document 对象
  if (process.client) {
    if (currentTheme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

// 初始化主题 - 只在客户端执行
if (process.client) {
  updateTheme()
}

const onLogoClick = () => {
  // Logo 点击事件，可用于导航到首页
  useRouter().push('/')
}

// 新建笔记功能
const handleNewNote = () => {
  // 这里可以添加新建笔记的逻辑
  useRouter().push('/')
}

// 用户认证相关
const { user, logout } = useAuth()
const router = useRouter()
const userMenuOpen = ref(false)

// 计算用户名首字母
const userInitial = computed(() => {
  return user.value?.username ? user.value.username.charAt(0).toUpperCase() : '?'
})

// 切换用户菜单
const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

// 处理用户退出登录
const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<style>
/* 全局 CSS 样式（纯 CSS，不依赖 SCSS） */
*, 
*::before, 
*::after {
  box-sizing: border-box;
}

html, 
body {
  margin: 0;
  padding: 0;
}

/* 主题变量 - 采用CSS变量管理，支持亮色/暗色主题切换 */
:root {
  /* ========== 亮色主题（默认） ========== */
  /* 背景色 */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --bg-card: rgba(255, 255, 255, 0.95);
  --bg-hover: rgba(241, 245, 249, 0.9);
  
  /* 边框色 */
  --border-color: rgba(226, 232, 240, 0.85);
  
  /* 文本色 */
  --text-primary: #1e293b;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  
  /* 强调色 */
  --accent-primary: #6366f1;
  --accent-secondary: #818cf8;
  --accent-tertiary: #a5b4fc;
  
  /* 功能色 */
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-accent: 0 0 0 1px rgba(99, 102, 241, 0.7), 0 4px 12px rgba(99, 102, 241, 0.2);
  
  /* 圆角 */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;
  
  /* 过渡动画 */
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ========== 暗色主题 ========== */
:root.dark {
  /* 背景色 */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --bg-card: rgba(15, 23, 42, 0.95);
  --bg-hover: rgba(30, 41, 59, 0.9);
  
  /* 边框色 */
  --border-color: rgba(71, 85, 105, 0.85);
  
  /* 文本色 */
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  
  /* 强调色 */
  --accent-primary: #818cf8;
  --accent-secondary: #a5b4fc;
  --accent-tertiary: #c7d2fe;
  
  /* 功能色 */
  --success-color: #34d399;
  --warning-color: #fbbf24;
  --error-color: #f87171;
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.4);
  --shadow-accent: 0 0 0 1px rgba(129, 140, 248, 0.7), 0 4px 12px rgba(129, 140, 248, 0.4);
}

/* 基础样式 */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter",
    "Segoe UI", sans-serif;
  line-height: 1.6;
}

/* 应用根容器 */
.app-root {
  height: 100vh;
  width: 100vw;
  background: 
    radial-gradient(circle at top left, rgba(79, 70, 229, 0.08), transparent 55%),
    radial-gradient(circle at bottom right, rgba(56, 189, 248, 0.06), transparent 55%),
    radial-gradient(circle at center, rgba(168, 85, 247, 0.04), transparent 50%),
    var(--bg-primary);
  color: var(--text-primary);
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

/* 背景装饰 */
.app-bg {
  position: fixed;
  pointer-events: none;
  overflow: hidden;
  inset: 0;
  opacity: 0.6;
  animation: float 20s ease-in-out infinite;
  /* 提升动画性能 */
  transform: translateZ(0);
  will-change: transform;
}

/* 确保body和html没有默认边距和滚动 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.app-bg-1 {
  top: -10%;
  left: -10%;
  width: 30rem;
  height: 30rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent 70%);
  filter: blur(60px);
  animation-delay: 0s;
}

.app-bg-2 {
  bottom: -15%;
  right: -15%;
  width: 40rem;
  height: 40rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.2), transparent 70%);
  filter: blur(80px);
  animation-delay: 5s;
}

.app-bg-3 {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50rem;
  height: 50rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent 70%);
  filter: blur(100px);
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
  }
  33% {
    transform: translate3d(2%, 2%, 0) scale3d(1.05, 1.05, 1);
  }
  66% {
    transform: translate3d(-2%, -2%, 0) scale3d(0.95, 0.95, 1);
  }
}

/* 移动端性能优化 */
@media (max-width: 768px) {
  /* 禁用背景动画以提升性能 */
  .app-bg {
    animation: none;
  }
  
  /* 简化背景渐变 */
  .app-root {
    background: 
      radial-gradient(circle at top left, rgba(79, 70, 229, 0.15), transparent 55%),
      radial-gradient(circle at bottom right, rgba(56, 189, 248, 0.1), transparent 55%),
      var(--bg-primary);
  }
  
  /* 减少阴影复杂度 */
  .glass-panel:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .btn-primary {
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
  }
  
  /* 优化滚动性能 */
  .note-editor-content,
  .note-editor-preview,
  .note-editor-textarea,
  .note-list-content {
    will-change: scroll-position;
  }
  
  /* 减少动画复杂度 */
  .page-enter-active,
  .page-leave-active,
  .layout-enter-active,
  .layout-leave-active {
    transition: all 0.2s ease-out;
  }
  
  /* 简化悬停效果 */
  .note-editor:hover,
  .note-list-container:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

/* 折叠菜单样式 */
.app-sidebar {
  position: fixed;
  top: 0;
  left: -280px;
  width: 280px;
  height: 100vh;
  background: var(--bg-card);
  backdrop-filter: blur(32px);
  border-right: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 200;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  /* 优化移动端体验 */
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;
}

.app-sidebar-open {
  left: 0;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 1.5rem;
}

/* Logo 样式 */
.app-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: var(--transition);
}

.app-logo:hover {
  transform: translateY(-1px);
}

.app-logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--accent-primary), #0ea5e9);
  color: white;
  box-shadow: var(--shadow-lg), 0 10px 25px rgba(79, 70, 229, 0.35);
  transition: var(--transition);
}

.app-logo:hover .app-logo-icon {
  transform: scale(1.05);
  box-shadow: var(--shadow-xl), 0 12px 30px rgba(79, 70, 229, 0.4);
}

.app-logo-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.app-logo-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  transition: var(--transition);
}

.app-logo:hover .app-logo-title {
  color: var(--accent-tertiary);
}

.app-logo-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  border-radius: var(--radius-full);
  background: var(--bg-tertiary);
  padding: 0.25rem 0.75rem;
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid var(--border-color);
}

.app-logo-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted);
  transition: var(--transition);
}

.app-logo:hover .app-logo-subtitle {
  color: var(--accent-tertiary);
}

/* 主题切换按钮 */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  backdrop-filter: blur(12px);
  /* 确保触摸区域足够大 */
  min-width: 2.5rem;
  min-height: 2.5rem;
  touch-action: manipulation;
}

.theme-toggle:hover {
  border-color: var(--accent-primary);
  color: var(--accent-tertiary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 确保深色主题下太阳图标显示黄色，月亮图标显示蓝色 */
.dark .theme-toggle-native .text-yellow-400 {
  color: #facc15 !important;
}

.dark .theme-toggle-native .text-indigo-500 {
  color: #6366f1 !important;
}

/* 原生主题切换按钮样式 */
.theme-toggle-native {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  color: inherit;
  position: relative;
  overflow: hidden;
}

/* 深色主题下的按钮样式 */
.dark .theme-toggle-native {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(71, 85, 105, 0.4);
}

/* 按钮悬停效果 */
.theme-toggle-native:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: var(--accent-primary);
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
}

/* 深色主题下的悬停效果 */
.dark .theme-toggle-native:hover {
  background: rgba(30, 41, 59, 0.9);
  border-color: var(--accent-primary);
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
}

/* 按钮焦点效果 */
.theme-toggle-native:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

/* 按钮:active效果 */
.theme-toggle-native:active {
  transform: scale(0.95);
  transition: all 0.1s ease;
}

/* 确保按钮内的图标能够正确显示 */
.theme-toggle-native svg {
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  position: relative;
  z-index: 10;
}

/* 添加主题相关的光晕效果 */
.theme-toggle-native::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

/* 深色主题下的光晕效果 */
.dark .theme-toggle-native::before {
  background: radial-gradient(circle, rgba(250, 204, 21, 0.3), transparent 70%);
}

/* 浅色主题下的光晕效果 */
.theme-toggle-native:not(.dark *)::before {
  background: radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent 70%);
}

/* 悬停时光晕效果显示 */
.theme-toggle-native:hover::before {
  opacity: 1;
}

/* 主要内容区域 */
.app-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 3.5rem); /* 减去顶部导航栏高度 */
  overflow: hidden;
  padding: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 0;
  margin-top: 3.5rem; /* 适配顶部导航栏高度 */
  box-sizing: border-box;
}

.app-main-expanded {
  margin-left: 0;
}

/* 悬浮菜单按钮 - 已移除PC端侧边栏，所以不再需要此按钮 */
.floating-menu-btn {
  display: none;
}

/* 移动端适配 - 确保主内容区域不超出视口 */
@media (max-width: 768px) {
  /* 调整主内容区域，适配底部导航栏 */
  .app-main {
    margin-top: 0;
    margin-bottom: 4rem;
    height: calc(100vh - 4rem); /* 减去底部导航栏高度 */
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.4);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.4);
  border-radius: 4px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(79, 70, 229, 0.6);
}

/* 组件样式 */
.glass-panel {
  background-color: var(--bg-card);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(24px);
  transition: var(--transition);
}

.glass-panel:hover {
  border-color: rgba(79, 70, 229, 0.3);
  box-shadow: var(--shadow-lg);
}

/* 按钮样式 */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  box-shadow: var(--shadow-lg), 0 10px 25px rgba(79, 70, 229, 0.35);
  transition: var(--transition);
  border: none;
  cursor: pointer;
  text-decoration: none;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--accent-secondary), var(--accent-tertiary));
  box-shadow: var(--shadow-xl), 0 12px 30px rgba(129, 140, 248, 0.4);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: var(--transition);
  cursor: pointer;
  text-decoration: none;
}

.btn-ghost:hover {
  background: var(--bg-hover);
  border-color: var(--accent-primary);
  color: var(--accent-tertiary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 输入框样式 */
.input {
  width: 100%;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  outline: none;
  transition: var(--transition);
}

.input::placeholder {
  color: var(--text-muted);
}

.input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  background: var(--bg-hover);
}

/* 标签样式 */
.tag-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  border-radius: var(--radius-full);
  background: var(--bg-tertiary);
  padding: 0.375rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.tag-pill:hover {
  background: var(--bg-hover);
  border-color: var(--accent-primary);
  color: var(--accent-tertiary);
}

/* 页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
  filter: blur(4px);
}

/* 布局过渡动画 */
.layout-enter-active,
.layout-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  transform: translateY(15px) scale(0.97);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .app-container {
    padding: 0 1rem;
  }
  
  .app-main {
    padding: 1rem 0;
    gap: 0.75rem;
  }
}

/* 顶部导航栏样式 */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3.5rem;
  background: var(--bg-card);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border-color);
  z-index: 190;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.app-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 1rem;
  max-width: 1280px;
  margin: 0 auto;
  gap: 1rem;
}

.app-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border-radius: 1.5rem;
  padding: 0.25rem;
  border: none;
  backdrop-filter: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: none;
  position: relative;
  overflow: visible;
}

/* 深色主题下的特殊样式 */
.dark .app-header-right {
  background: transparent;
  border: none;
}

.app-header-right:hover {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
  transform: translateY(0);
}

/* 深色主题下的悬停样式 */
.dark .app-header-right:hover {
  background: transparent;
}

/* 用户信息区域样式 */
.user-info-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: visible;
}

/* 用户信息样式（已登录状态） */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 深色主题下的用户信息样式 */
.dark .user-info {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(71, 85, 105, 0.4);
}

/* 头像样式 */
.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid var(--bg-card);
}

.user-avatar:hover .avatar-inner {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

/* 状态指示器样式 */
.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid var(--bg-card);
  box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.5);
}

/* 用户名样式 */
.username {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

/* 退出按钮样式 */
.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 50%;
  color: var(--text-danger);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
  margin: 0;
  outline: none;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
  color: #ef4444;
  transform: scale(1.1);
}

.logout-btn:focus-visible {
  outline: 2px solid rgba(239, 68, 68, 0.5);
  outline-offset: 2px;
}

/* 登录按钮样式 */
.login-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border: none;
  border-radius: 9999px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  outline: none;
}

.login-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
}

.login-btn:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

/* 登录链接样式 */
.login-link {
  text-decoration: none;
  display: inline-block;
}

/* 确保深色主题下的文本颜色正确 */
.dark .username {
  color: var(--text-primary);
}

/* 确保浅色主题下的元素颜色正确 */
.user-info {
  color: var(--text-primary);
}

/* 调整图标大小 */
.user-info .i-lucide-log-out,
.login-btn .i-lucide-log-in {
  width: 1rem;
  height: 1rem;
}

/* 顶部导航栏Logo样式 */
.app-logo-header {
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.app-logo-text-header {
  gap: 0.125rem;
}

/* 底部导航栏 - 仅在移动端显示 */
.app-footer-mobile {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rem;
  background: var(--bg-card);
  backdrop-filter: blur(24px);
  border-top: 1px solid var(--border-color);
  z-index: 190;
  display: none;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* 移动端显示底部导航栏 */
@media (max-width: 768px) {
  /* 隐藏顶部导航栏，显示底部导航栏 */
  .app-header {
    display: none;
  }
  
  /* 调整主内容区域，适配底部导航栏 */
  .app-main {
    margin-top: 0;
    margin-bottom: 4rem;
  }
  
  /* 显示底部导航栏 */
  .app-footer-mobile {
    display: block;
  }
  
  /* 优化Logo样式 */
  .app-logo {
    gap: 0.75rem;
  }
  
  .app-logo-icon {
    width: 2rem;
    height: 2rem;
  }
  
  .app-logo-title {
    font-size: 1rem;
  }
  
  .app-logo-subtitle {
    font-size: 0.6875rem;
  }
}

/* 底部导航栏内容 */
.app-nav-mobile {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  padding: 0 1rem;
}

/* 底部导航项样式 */
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.5rem;
  border-radius: 0.5rem;
  flex: 1;
}

.nav-item:hover {
  background: var(--bg-hover);
  color: var(--accent-primary);
}

.nav-item svg {
  width: 1.25rem;
  height: 1.25rem;
}

.nav-item span {
  font-size: 0.75rem;
  font-weight: 500;
}

/* 导航菜单样式 */
.app-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .app-container {
    padding: 0 0.5rem;
  }
  
  .app-header-content {
    padding: 0.625rem 0;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  .app-logo {
    gap: 0.75rem;
    flex: 1 1 auto;
  }
  
  .app-logo-icon {
    width: 2rem;
    height: 2rem;
  }
  
  .app-logo-title {
    font-size: 1rem;
  }
  
  .app-logo-subtitle {
    font-size: 0.6875rem;
  }
  
  .theme-toggle {
    width: 2rem;
    height: 2rem;
  }
  
  .app-main {
    padding: 0.5rem 0;
    gap: 0.5rem;
  }
  
  .app-footer {
    padding: 1rem 0 0.75rem 0;
  }
  
  .app-footer-content {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    text-align: center;
  }
  
  .app-footer-links {
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
  }
  
  .app-footer-text {
    font-size: 0.75rem;
  }
  
  .footer-link {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .app-container {
    padding: 0 0.375rem;
  }
  
  .app-header-content {
    padding: 0.5rem 0;
    gap: 0.5rem;
  }
  
  .app-logo {
    gap: 0.625rem;
  }
  
  .app-logo-title {
    font-size: 0.9375rem;
  }
  
  .app-logo-badge {
    padding: 0.2rem 0.625rem;
    font-size: 0.5625rem;
  }
  
  .app-main {
    padding: 0.375rem 0;
    gap: 0.375rem;
  }
  
  .app-footer {
    padding: 0.75rem 0 0.5rem 0;
  }
}
</style>
