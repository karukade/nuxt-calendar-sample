import { ScheduleObj, SchedulesOnWeek, Schedule } from '@/plugins/schedule'

export interface S {
  schedules: ScheduleObj[]
}

export interface G {
  schedulesRows: SchedulesOnWeek
}

export interface RG {
  'schedules/schedulesRows': G['schedulesRows']
}

export interface M {
  setSchedule: ScheduleObj[]
  clearSchedule: null
}

export interface RM {
  'schedules/setSchedule': M['setSchedule']
  'schedules/clearSchedule': M['clearSchedule']
}

export interface A {
  addSchedules: Schedule
  subscribeSchedule: null
  deleteSchedule: string
  updateSchedule: { id: string; schedule: Schedule }
  unsubscribeSchedule: null
}

export interface RA {
  'schedules/addSchedules': A['addSchedules']
  'schedules/subscribeSchedule': A['subscribeSchedule']
  'schedules/deleteSchedule': A['deleteSchedule']
  'schedules/updateSchedule': A['updateSchedule']
  'schedules/unsubscribeSchedule': A['unsubscribeSchedule']
}
