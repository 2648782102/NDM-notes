import { destroySession } from '../../utils/session'

export default defineEventHandler((event) => {
  destroySession(event)
  return { success: true }
})


