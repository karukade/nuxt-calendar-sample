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
    if (!/\/login\/?/.test(route.path)) redirect('/login')
    return
  }

  let hasFireStoreErr = false
  await setReadWriteCounter(userInfo?.id).catch(() => (hasFireStoreErr = true))
  if (hasFireStoreErr && !/\/sorry\/?/.test(route.path)) redirect('/sorry')
  if (!hasFireStoreErr && /\/sorry\/?/.test(route.path)) redirect('/')
  ;(store as ExStore).commit('user/setUser', userInfo)
}
export default auth
