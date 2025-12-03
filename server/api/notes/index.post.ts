import { readBody } from 'h3'
import { requireUser } from '../../utils/session'
import { createNote } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const body = await readBody<{
    title?: string
    content?: string
    category?: string | null
    tags?: string[]
  }>(event)

  const note = createNote(user.id, {
    title: body?.title ?? '未命名笔记',
    content: body?.content ?? '',
    category: body?.category ?? null,
    tags: Array.isArray(body?.tags) ? body?.tags : []
  })

  return note
})


