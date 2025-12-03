import { readBody } from 'h3'
import { createSession } from '../../utils/session'
import { createUser } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username?: string; password?: string }>(event)

  const username = body?.username?.trim()
  const password = body?.password

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: '请输入用户名和密码'
    })
  }

  if (username.length < 3) {
    throw createError({
      statusCode: 400,
      message: '用户名至少 3 个字符'
    })
  }

  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      message: '密码至少 6 位'
    })
  }

  const user = createUser(username, password)

  const sessionUser = createSession(event, {
    id: user.id,
    username: user.username
  })

  return sessionUser
})


