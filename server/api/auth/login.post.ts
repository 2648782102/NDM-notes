import { readBody } from 'h3'
import { createSession } from '../../utils/session'
import { verifyUser } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username?: string; password?: string }>(event)

  if (!body?.username || !body?.password) {
    throw createError({
      statusCode: 400,
      message: '请输入用户名和密码'
    })
  }

  const user = verifyUser(body.username.trim(), body.password)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: '用户名或密码错误'
    })
  }

  const sessionUser = createSession(event, {
    id: user.id,
    username: user.username
  })

  return sessionUser
})


