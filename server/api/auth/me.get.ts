import { getSessionUser } from '../../utils/session'

export default defineEventHandler((event) => {
  const user = getSessionUser(event)
  if (!user) {
    return null
  }
  return user
})


