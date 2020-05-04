import { CalendarObj, YearMonth } from '@/plugins/calendar'

export interface S {
  calendar: CalendarObj | null
}

export interface M {
  incMonth: number
  setMonth: YearMonth
}

export interface RM {
  'calendar/incMonth': M['incMonth']
  'calendar/setMonth': M['setMonth']
}

export interface A {
  incMonth: number
  setMonth: YearMonth
}

export interface RA {
  'calendar/incMonth': A['incMonth']
  'calendar/setMonth': A['setMonth']
}
