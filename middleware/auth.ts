import { Middleware } from '@nuxt/types'
import { ExStore } from 'vuex'
import {
  authStateChanged,
  setReadWriteCounter
} from '@/plugins/fireBaseHandler'

const auth: Middleware = async ({ store, redirect, route }) => {
  if ((store as ExStore).getters['user/isAuthenticated']) return

  const userInfo = await authStateChanged()
  if (!userInfo) {
    if (route.path !== '/login') redirect('/login')
    return
  }

  let hasFireStoreErr = false
  await setReadWriteCounter(userInfo?.id).catch(() => (hasFireStoreErr = true))
  if (hasFireStoreErr && route.path !== '/sorry') redirect('/sorry')
  if (!hasFireStoreErr && route.path === '/sorry') redirect('/')
  ;(store as ExStore).commit('user/setUser', userInfo)
}
export default auth
