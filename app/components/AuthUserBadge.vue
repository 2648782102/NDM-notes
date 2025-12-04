<template>
  <ClientOnly>
    <div class="auth-badge">
      <Transition name="auth-badge" mode="out-in">
        <!-- 加载状态 -->
        <div v-if="status === 'loading'" key="loading" class="auth-badge-skeleton">
          <div class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
          <div class="space-y-2">
            <div class="h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-2 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

        <!-- 已登录状态 -->
        <div v-else-if="user" key="user" class="auth-badge-user">
          <div class="flex items-center gap-3">
            <!-- 自定义头像 - 替代UAvatar组件 -->
            <div
              class="relative cursor-pointer"
              @click="toggleDropdown"
            >
              <!-- 头像容器 -->
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-semibold text-sm transition-all duration-300 hover:scale-110 hover:shadow-md">
                <!-- 默认头像图标 -->
                <FontAwesomeIcon v-if="!user.avatar && userInitial === '?'" icon="user" size="md" />
                <!-- 用户名首字母 -->
                <span v-else>{{ userInitial }}</span>
              </div>
              <!-- 状态指示器 -->
              <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 transition-all duration-300 hover:scale-125"></div>
            </div>
            
            <!-- 用户信息 -->
            <div class="space-y-0.5">
              <span class="block text-sm font-semibold text-primary transition-colors duration-300 hover:text-primary">
                {{ user.username }}
              </span>
              <span class="block text-xs text-gray-500 dark:text-gray-400">
                已登录
              </span>
            </div>
            
            <!-- 退出按钮 - 原生button -->
            <button
              @click="onLogout"
              class="logout-button"
            >
              <FontAwesomeIcon icon="right-from-bracket" size="sm" />
              <span class="ml-1">退出</span>
            </button>
          </div>
        </div>

        <!-- 未登录状态 -->
        <div v-else key="login" class="auth-badge-login">
          <NuxtLink to="/login" class="login-link">
            <button class="login-button">
              <FontAwesomeIcon icon="right-to-bracket" size="sm" />
              <span class="ml-1">登录</span>
            </button>
          </NuxtLink>
        </div>
      </Transition>
    </div>
    <template #fallback>
      <div class="auth-badge">
        <div class="auth-badge-skeleton">
          <div class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
          <div class="space-y-2">
            <div class="h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-2 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const { status, user, logout } = useAuth()

const router = useRouter()
const dropdownOpen = ref(false)

const userInitial = computed(() =>
  user.value?.username ? user.value.username.charAt(0).toUpperCase() : '?'
)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const onLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<style scoped>
.auth-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.auth-badge-skeleton {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
}

.auth-badge-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: transparent;
  border: none;
  border-radius: 1rem;
  padding: 0.5rem 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: none;
  backdrop-filter: none;
}

.auth-badge-user:hover {
  background: transparent;
  border-color: transparent;
  transform: translateY(0);
  box-shadow: none;
}

.auth-badge-login {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* 退出按钮样式 */
.logout-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 9999px;
  color: rgba(239, 68, 68, 0.8);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  margin-left: auto;
}

.logout-button:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
  color: rgba(239, 68, 68, 1);
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
}

.logout-button:focus-visible {
  outline: 2px solid rgba(239, 68, 68, 0.5);
  outline-offset: 2px;
}

.logout-button:active {
  transform: scale(0.98);
  transition: all 0.1s ease;
}

/* 登录按钮样式 */
.login-link {
  text-decoration: none;
  display: inline-block;
}

.login-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  border: none;
  border-radius: 9999px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.login-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
}

.login-button:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

.login-button:active {
  transform: scale(0.98);
  transition: all 0.1s ease;
}

/* 头像样式优化 */
.auth-badge-user .w-10.h-10 {
  position: relative;
  overflow: hidden;
}

/* 状态指示器优化 */
.auth-badge-user .absolute.bottom-0.right-0 {
  z-index: 10;
}

/* 用户信息优化 */
.auth-badge-user .text-sm.font-semibold {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.auth-badge-user .text-xs.text-muted-foreground {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* 过渡动画 */
.auth-badge-enter-active,
.auth-badge-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-badge-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-8px);
}

.auth-badge-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(8px);
}
</style>