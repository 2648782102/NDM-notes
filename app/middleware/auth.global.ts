export default defineNuxtRouteMiddleware(async (to, from) => {
  const { status, fetchMe } = useAuth()
  
  // 如果是登录页面，允许访问
  if (to.path === '/login') {
    return
  }
  
  // 如果状态是 idle，尝试获取用户信息
  if (status.value === 'idle') {
    await fetchMe()
  }
  
  // 如果未认证，重定向到登录页面
  if (status.value !== 'authenticated') {
    return navigateTo('/login')
  }
})
