<template>
  <div class="app-root">
    <!-- 背景效果 -->
    <div class="app-bg app-bg-1" />
    <div class="app-bg app-bg-2" />
    <div class="app-bg app-bg-3" />

    <!-- 折叠菜单 -->
    <div class="app-sidebar" :class="{ 'app-sidebar-open': isMenuOpen }">
      <div class="sidebar-content">
        <!-- Logo -->
        <div class="app-logo" @click="onLogoClick">
          <div class="app-logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div class="app-logo-text">
            <div class="app-logo-title">
              {{ config.public.appName }}
              <span class="app-logo-badge">v1.0</span>
            </div>
            <p class="app-logo-subtitle">
              现代动画笔记应用 · Nuxt 全栈示例
            </p>
          </div>
        </div>

        <!-- 主题切换按钮 -->
        <UButton
          size="icon"
          variant="ghost"
          color="gray"
          @click="toggleTheme"
          class="rounded-full"
        >
          <svg v-if="currentTheme === 'dark'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </UButton>

        <!-- 用户认证徽章 -->
        <AuthUserBadge />
      </div>
    </div>

    <!-- 主要内容 -->
    <main class="app-main" :class="{ 'app-main-expanded': isMenuOpen }">
      <NuxtPage />
    </main>

    <!-- 悬浮菜单按钮 -->
        <UButton
          size="icon"
          variant="primary"
          @click="toggleMenu"
          :class="{ 'floating-menu-btn-open': isMenuOpen }"
          class="floating-menu-btn rounded-full shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu-icon">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="close-icon">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </UButton>
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

// 折叠菜单功能
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
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
  min-height: 100vh;
  background: 
    radial-gradient(circle at top left, rgba(79, 70, 229, 0.08), transparent 55%),
    radial-gradient(circle at bottom right, rgba(56, 189, 248, 0.06), transparent 55%),
    radial-gradient(circle at center, rgba(168, 85, 247, 0.04), transparent 50%),
    var(--bg-primary);
  color: var(--text-primary);
  position: relative;
  overflow: hidden;
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

/* 主要内容区域 */
.app-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  padding: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-main-expanded {
  margin-left: 280px;
}

/* 悬浮菜单按钮 */
.floating-menu-btn {
  position: fixed;
  top: 1rem;
  left: 1rem;
  width: 3rem;
  height: 3rem;
  border: none;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 150;
  box-shadow: var(--shadow-lg), 0 10px 25px rgba(79, 70, 229, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-menu-btn-open {
  left: 290px;
  background: linear-gradient(135deg, var(--error-color), var(--warning-color));
}

/* PC端优化：部分隐藏，鼠标悬浮时滑出 */
@media (min-width: 769px) {
  .floating-menu-btn {
    left: -2rem; /* 默认只露出右侧1rem */
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .floating-menu-btn:hover {
    left: 1rem; /* 鼠标悬浮时完全显示 */
    transform: translateY(-1px);
    box-shadow: var(--shadow-xl), 0 12px 30px rgba(129, 140, 248, 0.4);
  }
  
  /* 菜单打开时保持完全显示 */
  .floating-menu-btn.floating-menu-btn-open {
    left: 290px;
  }
  
  /* 菜单打开时鼠标悬浮效果 */
  .floating-menu-btn.floating-menu-btn-open:hover {
    left: 290px;
    transform: translateY(-1px);
  }
}

/* 移动端优化：将悬浮菜单按钮移到右下角 */
@media (max-width: 768px) {
  .floating-menu-btn {
    top: auto;
    bottom: 1rem;
    left: auto;
    right: 1rem;
    width: 2.75rem;
    height: 2.75rem;
  }
  
  /* 菜单打开时的位置调整 */
  .floating-menu-btn-open {
    left: auto;
    right: 1rem;
    bottom: 1rem;
  }
}

/* 菜单图标动画 */
.menu-icon,
.close-icon {
  transition: all 0.3s ease;
  position: absolute;
}

.menu-icon {
  opacity: 1;
  transform: rotate(0deg);
}

.close-icon {
  opacity: 0;
  transform: rotate(90deg);
}

.floating-menu-btn-open .menu-icon {
  opacity: 0;
  transform: rotate(-90deg);
}

.floating-menu-btn-open .close-icon {
  opacity: 1;
  transform: rotate(0deg);
}

/* 滚动条样式 */
.app-sidebar::-webkit-scrollbar {
  width: 8px;
}

.app-sidebar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.4);
  border-radius: 4px;
}

.app-sidebar::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.4);
  border-radius: 4px;
  transition: background 0.2s ease;
}

.app-sidebar::-webkit-scrollbar-thumb:hover {
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

/* 移动端菜单优化 */
@media (max-width: 768px) {
  .app-sidebar {
    /* 移动端菜单覆盖整个屏幕 */
    width: 85%;
    max-width: 280px;
    /* 优化动画效果 */
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(-100%);
    z-index: 300;
  }
  
  .app-sidebar-open {
    left: 0;
    transform: translateX(0);
  }
  
  .app-main-expanded {
    margin-left: 0;
    /* 添加半透明遮罩 */
    background: rgba(0, 0, 0, 0.5);
    pointer-events: none;
    position: relative;
  }
  
  /* 添加遮罩层 */
  .app-main-expanded::before {
    content: '';
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 200;
    pointer-events: auto;
  }
  
  /* 优化悬浮菜单按钮 */
  .floating-menu-btn-open {
    left: calc(85% + 10px);
    max-left: 290px;
    z-index: 350;
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
