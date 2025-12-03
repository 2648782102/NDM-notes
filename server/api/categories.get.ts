import { requireUser } from '../utils/session'
import { listCategoriesByUser } from '../utils/db'

export default defineEventHandler((event) => {
  const user = requireUser(event)
  const categories = listCategoriesByUser(user.id)
  return categories
})


