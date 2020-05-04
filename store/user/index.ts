import { Getters, Mutations, Actions } from 'vuex'
import { S, G, M, A } from '@/store/user/type'
import { signOut } from '@/plugins/fireBaseHandler'

export const state = (): S => ({
  user: null
})

export const getters: Getters<S, G> = {
  isAuthenticated(state) {
    return !!state.user
  },
  userId(state) {
    if (!state.user) return null
    return state.user.id
  }
}

export const mutations: Mutations<S, M> = {
  setUser(state, user) {
    state.user = user
  },
  clearUser(state) {
    state.user = null
  }
}

export const actions: Actions<S, A, G, M> = {
  signOut({ dispatch, commit }) {
    signOut()
    commit('clearUser')
    commit('schedules/clearSchedule', null, { root: true })
    dispatch('schedules/unsubscribeSchedule', null, { root: true })
  }
}
