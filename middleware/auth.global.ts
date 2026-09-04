import { LOGIN_PATH, isProtectedPath, safeRedirect } from '~/utils/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server || import.meta.prerender) return

  const isLogin = to.path === LOGIN_PATH
  if (!isLogin && !isProtectedPath(to.path)) return

  const { ensureSession } = useAuth()
  const session = await ensureSession()

  if (isLogin) {
    if (session) return navigateTo(safeRedirect(to.query.redirect))
    return
  }

  if (session) return

  return navigateTo({
    path: LOGIN_PATH,
    query: { redirect: to.fullPath },
  })
})
