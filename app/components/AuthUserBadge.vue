<template>
  <ClientOnly>
    <div class="auth-badge">
      <UTransition name="auth-badge" mode="out-in">
        <!-- 加载状态 -->
        <div v-if="status === 'loading'" key="loading" class="auth-badge-skeleton">
          <USkeleton class="h-10 w-10 rounded-full" />
          <div class="space-y-2">
            <USkeleton class="h-3 w-20" />
            <USkeleton class="h-2 w-16" />
          </div>
        </div>

        <!-- 已登录状态 -->
        <div v-else-if="user" key="user" class="auth-badge-user">
          <div class="flex items-center gap-3">
            <!-- 头像 -->
            <UAvatar
              :src="null"
              :initials="userInitial"
              size="lg"
              class="cursor-pointer"
              @click="toggleDropdown"
            >
              <!-- 状态指示器 -->
              <template #indicator>
                <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background"></div>
              </template>
            </UAvatar>
            
            <!-- 用户信息 -->
            <div class="space-y-0.5">
              <span class="block text-sm font-medium text-foreground">
                {{ user.username }}
              </span>
              <span class="block text-xs text-muted-foreground">
                已登录
              </span>
            </div>
            
            <!-- 退出按钮 -->
            <UButton
              variant="ghost"
              color="danger"
              size="sm"
              @click="onLogout"
              class="ml-auto"
            >
              <template #leading>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </template>
              退出
            </UButton>
          </div>
        </div>

        <!-- 未登录状态 -->
        <div v-else key="login" class="auth-badge-login">
          <NuxtLink to="/login">
            <UButton
              variant="primary"
              size="sm"
            >
              <template #leading>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
              </template>
              登录
            </UButton>
          </NuxtLink>
        </div>
      </UTransition>
    </div>
    <template #fallback>
      <div class="auth-badge">
        <div class="auth-badge-skeleton">
          <USkeleton class="h-10 w-10 rounded-full" />
          <div class="space-y-2">
            <USkeleton class="h-3 w-20" />
            <USkeleton class="h-2 w-16" />
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
}

.auth-badge-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.auth-badge-user:hover {
  background: var(--bg-hover);
  border-color: var(--accent-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
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