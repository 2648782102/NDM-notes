<template>
  <ClientOnly>
    <div class="auth-badge">
      <Transition name="auth-badge" mode="out-in">
        <!-- 加载状态 -->
        <div v-if="status === 'loading'" key="loading" class="auth-badge-skeleton">
          <div class="skeleton-avatar" />
          <div class="skeleton-info">
            <div class="skeleton-line" />
            <div class="skeleton-line small" />
          </div>
        </div>

        <!-- 已登录状态 -->
        <div v-else-if="user" key="user" class="auth-badge-user">
          <div class="auth-badge-avatar-wrapper">
            <div class="auth-badge-avatar" @click="toggleDropdown">
              <span class="avatar-initial">{{ userInitial }}</span>
              <span class="avatar-status online"></span>
            </div>
          </div>
          
          <div class="auth-badge-info">
            <span class="auth-badge-username">
              {{ user.username }}
            </span>
            <span class="auth-badge-status">
              已登录
            </span>
          </div>
          
          <button
            class="btn-ghost auth-badge-logout"
            @click="onLogout"
            @mouseenter="hovered = 'logout'"
            @mouseleave="hovered = null"
          >
            <svg v-if="hovered === 'logout'" class="icon-logout" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>退出</span>
          </button>
        </div>

        <!-- 未登录状态 -->
        <NuxtLink
          v-else
          key="login"
          to="/login"
          class="btn-primary auth-badge-login"
          @mouseenter="hovered = 'login'"
          @mouseleave="hovered = null"
        >
          <svg v-if="hovered === 'login'" class="icon-login" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
          <span>登录</span>
        </NuxtLink>
      </Transition>
    </div>
    <template #fallback>
      <div class="auth-badge">
        <div class="auth-badge-skeleton">
          <div class="skeleton-avatar" />
          <div class="skeleton-info">
            <div class="skeleton-line" />
            <div class="skeleton-line small" />
          </div>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const { status, user, logout } = useAuth()

const router = useRouter()
const hovered = ref<string | null>(null)
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

/* 加载骨架屏 */
.auth-badge-skeleton {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
}

.skeleton-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: linear-gradient(90deg, rgba(30, 41, 59, 0.6), rgba(51, 65, 85, 0.6), rgba(30, 41, 59, 0.6));
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-info {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.skeleton-line {
  width: 5rem;
  height: 0.5rem;
  border-radius: 0.25rem;
  background: linear-gradient(90deg, rgba(30, 41, 59, 0.6), rgba(51, 65, 85, 0.6), rgba(30, 41, 59, 0.6));
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line.small {
  width: 3rem;
  height: 0.375rem;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 已登录用户 */
.auth-badge-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(79, 70, 229, 0.3);
  border-radius: 1rem;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.auth-badge-user:hover {
  background: rgba(30, 41, 59, 0.9);
  border-color: rgba(99, 102, 241, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* 头像 */
.auth-badge-avatar-wrapper {
  position: relative;
}

.auth-badge-avatar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #0ea5e9);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  overflow: hidden;
}

.auth-badge-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.avatar-initial {
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  z-index: 1;
}

.avatar-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  border: 2px solid rgba(15, 23, 42, 0.8);
  z-index: 2;
  animation: pulse 2s infinite;
}

.avatar-status.online {
  background-color: #10b981;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

/* 用户信息 */
.auth-badge-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin-right: 0.25rem;
}

.auth-badge-username {
  font-size: 0.75rem;
  font-weight: 600;
  color: #f1f5f9;
  transition: color 0.2s ease;
}

.auth-badge-user:hover .auth-badge-username {
  color: #c7d2fe;
}

.auth-badge-status {
  font-size: 0.625rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* 退出按钮 */
.auth-badge-logout {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  height: 2rem;
  border: 1px solid rgba(244, 63, 94, 0.3);
  border-radius: 0.75rem;
  padding: 0 0.875rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #fda4af;
  background: rgba(244, 63, 94, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
}

.auth-badge-logout:hover {
  background: rgba(244, 63, 94, 0.15);
  border-color: rgba(244, 63, 94, 0.5);
  color: #fecdd3;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(244, 63, 94, 0.2);
}

/* 登录按钮 */
.auth-badge-login {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  height: 2.25rem;
  padding: 0 1.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 1rem;
  border: 1px solid rgba(79, 70, 229, 0.3);
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  overflow: hidden;
}

.auth-badge-login:hover {
  background: linear-gradient(135deg, #818cf8, #6366f1);
  border-color: rgba(99, 102, 241, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(129, 140, 248, 0.4);
}

/* 图标 */
.icon-logout,
.icon-login {
  width: 14px;
  height: 14px;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.2s ease;
}

.auth-badge-logout:hover .icon-logout,
.auth-badge-login:hover .icon-login {
  opacity: 1;
  transform: translateX(0);
}

/* 过渡动画 */
.auth-badge-enter-active,
.auth-badge-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-badge-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-4px);
}

.auth-badge-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(4px);
}
</style>
