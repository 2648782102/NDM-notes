import { requireUser } from '../../utils/session'
import { listNotesByUser } from '../../utils/db'

export default defineEventHandler((event) => {
  const user = requireUser(event)
  const notes = listNotesByUser(user.id)
  return notes
})


