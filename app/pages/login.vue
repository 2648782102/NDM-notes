<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="login-logo">
          <div class="app-logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h1 class="login-title">{{ config.public.appName }}</h1>
          <p class="login-subtitle">现代化动画笔记应用</p>
        </div>
      </div>

      <div class="login-form-container">
        <h2 class="login-form-title">欢迎回来</h2>
        <p class="login-form-subtitle">登录后即可管理您的笔记</p>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username" class="form-label">用户名</label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="form-input"
              placeholder="请输入用户名"
              required
              autofocus
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="请输入密码"
              required
            />
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="btn-primary login-btn"
              :disabled="loggingIn"
            >
              <span v-if="loggingIn" class="spinner"></span>
              <span>{{ loggingIn ? '登录中...' : '登录' }}</span>
            </button>
          </div>

          <div class="login-demo">
            <h3 class="demo-title">演示账号</h3>
            <div class="demo-credentials">
              <p>用户名: demo</p>
              <p>密码: demo123</p>
            </div>
          </div>

          <div v-if="error" class="login-error">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const router = useRouter()

const username = ref('')
const password = ref('')
const loggingIn = ref(false)
const error = ref('')

const { login } = useAuth()

const handleLogin = async () => {
  loggingIn.value = true
  error.value = ''
  
  try {
    await login({ username: username.value, password: password.value })
    await router.push('/')
  } catch (err: any) {
    error.value = err.message || '登录失败，请检查用户名和密码'
  } finally {
    loggingIn.value = false
  }
}

// 自动填充演示账号
onMounted(() => {
  username.value = 'demo'
  password.value = 'demo123'
})
</script>

<style scoped>
.login-page {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: 
    radial-gradient(circle at top left, rgba(79, 70, 229, 0.08), transparent 55%),
    radial-gradient(circle at bottom right, rgba(56, 189, 248, 0.06), transparent 55%),
    radial-gradient(circle at center, rgba(168, 85, 247, 0.04), transparent 50%),
    var(--bg-primary);
}

.login-container {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(24px);
  box-shadow: var(--shadow-lg), 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  overflow: hidden;
  transition: var(--transition);
}

.login-container:hover {
  border-color: rgba(79, 70, 229, 0.3);
  box-shadow: var(--shadow-xl), 0 20px 40px rgba(0, 0, 0, 0.15);
}

.login-header {
  background: rgba(8, 14, 30, 0.4);
  border-bottom: 1px solid rgba(51, 65, 85, 0.8);
  padding: 2rem;
  text-align: center;
}

.login-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.login-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.login-form-container {
  padding: 2rem;
}

.login-form-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.login-form-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0 0 1.5rem 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-input {
  width: 100%;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  outline: none;
  transition: var(--transition);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  background: var(--bg-hover);
}

.form-actions {
  margin-top: 0.5rem;
}

.login-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
}

.login-demo {
  background: rgba(30, 41, 59, 0.3);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: var(--radius-lg);
  padding: 1rem;
  margin-top: 0.5rem;
}

.demo-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
}

.demo-credentials {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}

.login-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-lg);
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  color: #fca5a5;
  margin-top: 0.5rem;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(199, 210, 254, 0.3);
  border-top-color: #c7d2fe;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-page {
    padding: 0.5rem;
  }
  
  .login-container {
    border-radius: var(--radius-lg);
  }
  
  .login-header {
    padding: 1.5rem 1rem;
  }
  
  .login-form-container {
    padding: 1.5rem 1rem;
  }
  
  .login-title {
    font-size: 1.25rem;
  }
  
  .login-form-title {
    font-size: 1.125rem;
  }
}
</style>