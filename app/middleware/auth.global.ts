export default defineNuxtRouteMiddleware(async (to, from) => {
  const { status, fetchMe } = useAuth()
  
  // 如果是登录页面，允许访问
  if (to.path === '/login') {
    return
  }
  
  // 在中间件中只在服务端尝试获取用户信息
  // 客户端的 fetchMe 调用由 useAuth 组合式函数在客户端处理
  if (process.server && status.value === 'idle') {
    await fetchMe()
  }
  
  // 如果未认证，重定向到登录页面
  if (status.value !== 'authenticated') {
    return navigateTo('/login')
  }
})
