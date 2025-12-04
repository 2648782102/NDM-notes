import { requireUser } from '../../utils/session'
import { getNoteById } from '../../utils/db'
import { createError } from 'h3'

export default defineEventHandler((event) => {
  const user = requireUser(event)
  const id = event.context.params?.id as string
  const note = getNoteById(id, user.id)
  if (!note) {
    throw createError({
      statusCode: 404,
      message: '笔记不存在'
    })
  }
  return note
})


