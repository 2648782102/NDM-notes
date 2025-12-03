import { readBody } from 'h3'
import { requireUser } from '../../utils/session'
import { updateNote } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const id = event.context.params?.id as string
  const body = await readBody<{
    title?: string
    content?: string
    category?: string | null
    tags?: string[]
  }>(event)

  const note = updateNote(id, user.id, {
    title: body?.title,
    content: body?.content,
    category: body?.category,
    tags: body?.tags
  })

  return note
})


