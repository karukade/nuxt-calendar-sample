import moment from 'moment'
import 'moment/locale/ja'
import { toNonReactive } from '@/plugins/utils'

import { DateInfo } from '@/plugins/schedule'

export type Moment = moment.Moment
export type YearMonth = {
  years: number
  months: number
}

export type CalendarDate = {
  date: number
  months: number
  years: number
  isFirstOfMonth: boolean
  isOverFlow: boolean
  isToday: boolean
}

export type CalendarObj = {
  yearmonth: YearMonth
  items: CalendarDate[][]
}

const today = moment().toObject()

const getOverFlow = (currentMoment: Moment, dateIndex: number): DateInfo => {
  const overFlowMoment = moment(currentMoment)
    .startOf('month')
    .add(dateIndex, 'days')
  const { months, years, date } = overFlowMoment.toObject()

  return {
    date,
    months,
    years
  }
}

const isToday = (dateInfo: DateInfo): boolean => {
  return (
    today.years === dateInfo.years &&
    today.months === dateInfo.months &&
    today.date === dateInfo.date
  )
}

export const createCalendarObj = (currentMoment: Moment): CalendarObj => {
  const { years, months } = currentMoment.toObject()
  const numOfMonth = currentMoment.endOf('month').date()
  const daysOfMonth = [...Array(numOfMonth)].map((_empty, i) => ++i)
  const firstWeekDay = currentMoment.startOf('month').weekday()
  const numOfWeek = [...Array(Math.ceil((numOfMonth + firstWeekDay) / 7))]

  const items = numOfWeek.map((_empty, weekIndex) =>
    [...Array(7)].map((_empty, dayIndex) => {
      const dateIndex = 7 * weekIndex + dayIndex - firstWeekDay
      const isOverFlow = dateIndex < 0 || daysOfMonth[dateIndex] === undefined

      const dateInfo = isOverFlow
        ? getOverFlow(currentMoment, dateIndex)
        : { date: daysOfMonth[dateIndex], months, years }

      return {
        isToday: isToday(dateInfo),
        isFirstOfMonth: dateInfo.date === 1,
        isOverFlow,
        ...dateInfo
      }
    })
  )

  // このオブジェクトを変更することはないので、configurable: falseにしてvueの監視対象からはずす
  return toNonReactive({ yearmonth: { years, months }, items })
}

export const incMonth = (baseYearMonth: YearMonth, increments: number) => {
  const incremented = moment(baseYearMonth).add(increments, 'months')
  const calendar = createCalendarObj(incremented)
  return calendar
}

const isNumber = (...args: (number | void)[]): boolean => {
  return args.every((arg) => typeof arg === 'number' && isFinite(arg))
}

export const toString = (
  yearmonthObj: Partial<DateInfo>,
  format: 'y' | 'ym' | 'ymd' | 'md'
): string | void => {
  const { years, months, date } = yearmonthObj
  switch (format) {
    case 'y':
      if (!isNumber(years)) return
      return `${years}年`
    case 'ym':
      if (!isNumber(years, months)) return
      return `${years}年${(months as number) + 1}月`
    case 'ymd':
      if (!isNumber(years, months, date)) return
      return `${years}年${(months as number) + 1}月${date}日`
    case 'md':
      if (!isNumber(months, date)) return
      return `${(months as number) + 1}月${date}日`
  }
}
