import moment from 'moment'
import 'moment/locale/ja'
import { Mutations, Actions } from 'vuex'
import { S, M, A } from '@/store/calendar/type'

import { createCalendarObj, incMonth } from '@/plugins/calendar'

export const state = (): S => ({
  calendar: null
})

export const mutations: Mutations<S, M> = {
  incMonth(state, increments) {
    const yearmonth = state.calendar?.yearmonth
    if (!yearmonth) return
    const calendar = incMonth(yearmonth, increments)
    state.calendar = calendar
  },
  setMonth(state, yearmonth) {
    const calendar = createCalendarObj(yearmonth ? moment(yearmonth) : moment())
    state.calendar = calendar
  }
}

export const actions: Actions<S, A, {}, M> = {
  incMonth({ commit, dispatch }, increments) {
    commit('incMonth', increments)
    dispatch('schedules/subscribeSchedule', null, { root: true })
  },
  setMonth({ commit, dispatch }, yearmonth) {
    commit('setMonth', yearmonth)
    dispatch('schedules/subscribeSchedule', null, { root: true })
  }
}
