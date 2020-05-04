import { Getters, Mutations, Actions } from 'vuex'
import { S, G, M, A } from '@/store/schedules/type'
import { splitSchedulesByWeek, genScheduleObj } from '@/plugins/schedule'
import {
  subscribeSchedule,
  updateSchedule,
  unsubscribeSchedule,
  addSchedule,
  deleteSchedule
} from '@/plugins/fireBaseHandler'

export const state = (): S => ({
  schedules: []
})

export const getters: Getters<S, G> = {
  schedulesRows(state, _getters, rootState) {
    if (state.schedules.length === 0) return []
    const yearmonth = rootState.calendar.calendar?.yearmonth
    if (!yearmonth) return []
    return splitSchedulesByWeek(
      state.schedules,
      yearmonth.months,
      yearmonth.years
    )
  }
}

export const mutations: Mutations<S, M> = {
  setSchedule(state, schedules) {
    state.schedules = schedules
  },
  clearSchedule(state) {
    state.schedules = []
  }
}

export const actions: Actions<S, A, G, M> = {
  async addSchedules({ rootGetters }, schedule) {
    const userId = rootGetters['user/userId']
    if (!userId) return
    const formatted = genScheduleObj(schedule)
    await addSchedule(userId, formatted).catch(() => {
      this.$router.push('/sorry')
    })
  },

  async deleteSchedule({ rootGetters }, id) {
    const userId = rootGetters['user/userId']
    if (!userId) return
    await deleteSchedule(userId, id).catch(() => {
      this.$router.push('/sorry')
    })
  },

  subscribeSchedule({ commit, rootState, rootGetters }) {
    const yearmonth = rootState.calendar.calendar?.yearmonth
    if (!yearmonth) return
    const userId = rootGetters['user/userId']
    if (!userId) return
    const { years } = yearmonth

    subscribeSchedule(
      { userId, years },
      (schedules) => commit('setSchedule', schedules),
      () => {
        this.$router.push('/sorry')
      }
    )
  },

  async updateSchedule({ rootGetters }, { id, schedule }) {
    const userId = rootGetters['user/userId']
    if (!userId) return
    const formatted = genScheduleObj(schedule)
    await updateSchedule(userId, id, formatted).catch(() => {
      this.$router.push('/sorry')
    })
  },

  unsubscribeSchedule() {
    unsubscribeSchedule()
  }
}
