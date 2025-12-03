import { requireUser } from '../../utils/session'
import { deleteNote } from '../../utils/db'

export default defineEventHandler((event) => {
  const user = requireUser(event)
  const id = event.context.params?.id as string
  deleteNote(id, user.id)
  return { success: true }
})


