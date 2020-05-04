import 'vuex'
import * as Schedules from '@/store/schedules/type'
import * as User from '@/store//user/type'
import * as Calendar from '@/store/calendar/type'

declare module 'vuex' {
  type RootState = {
    schedules: Schedules.S
    user: User.S
    calendar: Calendar.S
  }
  type RootGetters = Schedules.RG & User.RG
  type RootMutations = Schedules.RM & User.RM & Calendar.RM
  type RootActions = Schedules.RA & Calendar.RA & User.RA
}
