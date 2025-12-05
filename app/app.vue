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
      <button class="nav-item" @click="$router.push('/')">
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

// 使用 useHead 在 SSR 时就应用主题类
useHead({
  htmlAttrs: {
    class: currentTheme.value === 'dark' ? 'dark' : ''
  }
})

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
  
  // 客户端更新主题类
  if (process.client) {
    if (currentTheme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

const onLogoClick = () => {
  // Logo 点击事件，可用于导航到首页
  useRouter().push('/')
}

// 新建笔记功能
const handleNewNote = () => {
  // 导航到首页，首页组件会自动处理新建笔记
  useRouter().push('/?new=true')
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

<style scoped>
/* 本地样式 */
</style>