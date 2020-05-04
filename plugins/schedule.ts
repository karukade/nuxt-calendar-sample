import moment from 'moment'
import 'moment/locale/ja'

export type Moment = moment.Moment

export type MinSchedule = {
  from: DateInfo
  to: DateInfo
}

export type ScheduleInfo = {
  title: string
  detail: string
  guest: string
  location: string
  from: DateInfo
  to: DateInfo
  id?: string
  color: string
  hours: {
    from: string
    to: string
  }
}

export type Schedule = MinSchedule & {
  info: ScheduleInfo
}

/**
 * スケジュールを週にマッピングするためのオブジェクト
 */
export type WeekSplitParam = {
  /**
   * スケジュールの初めの曜日のインデックス 0 ~ 6
   */
  fromDays: number

  /**
   * スケジュールの終わりの月内の週のインデックス
   */
  fromIndex: number

  /**
   * スケジュールの終わりの曜日のインデックス 0 ~ 6
   */
  toDays: number

  /**
   * スケジュールの終わりの月内の週のインデックス
   */
  toIndex: number

  info: ScheduleInfo
}

export type ScheduleOnWeek = {
  /**
   * スケジュールの初めの曜日のインデックス 0 ~ 6
   */
  from: number
  /**
   * スケジュールの終わりの曜日のインデックス 0 ~ 6
   */
  to: number
  info: ScheduleInfo
}

export type DateInfo = {
  date: number
  months: number
  years: number
}

export type WeekOfSchedules = (ScheduleOnWeek | null)[]

/**
 * 一月分のスケジュールを週ごとの配列に格納
 * スケジュールがない場合はnullをいれる
 */
export type MonthOfWeeks = WeekOfSchedules[]

/**
 * 各月のスケジュール。スケジュールの期間に加えて、カレンダーから参照できるように年と月を格納
 */
export type SplitedSchedule = MinSchedule & {
  years: number
  months: number
}

/**
 * Fire Storeに渡すスケジュールのオブジェクト
 */
export type ScheduleObj = {
  info: ScheduleInfo
  range: { years: number[]; months: { [key: string]: number[] } }
  splited: SplitedSchedule[]
}

export type SchedulesOnWeek = (ScheduleOnWeek[] | null)[]

// ユーザー入力をfirestore用に加工
// ______________________________________________________
//

/**
 * ユーザーが入力したスケジュールを月ごとに分割してfirestoreに格納するオブジェクトの形(ScheduleObj)に変換する
 * @param baseSchedule ユーザーが入力したスケジュール
 */
export const genScheduleObj = (baseSchedule: Schedule): ScheduleObj => {
  const { start, duration } = getDuration(baseSchedule)

  // duration反復して月を加算、各月にスケジュールをマッピングする（その月の始点,終点を取得する）
  return Array(duration)
    .fill(0)
    .reduce(
      (res: ScheduleObj, _empty, index): ScheduleObj => {
        // スケジュールの始点に対して月を加算
        const current = moment(start).add(index, 'month')
        const { years, months } = current.toObject()

        // スケジュールをその月にマッピング始点、終点を取得
        const { from, to } = getScheduleSpan(
          current,
          baseSchedule,
          index,
          duration
        )
        const schedule = { from, to, years, months }

        if (!res.range.years.includes(years)) res.range.years.push(years)
        if (!res.range.months[years]) res.range.months[years] = []
        res.range.months[years].push(months)

        res.splited.push(schedule)

        return res
      },
      { range: { years: [], months: {} }, info: baseSchedule.info, splited: [] }
    )
}

export const getDuration = (
  baseSchedule: Schedule
): { start: Moment; duration: number } => {
  const start = moment(baseSchedule.from).startOf('month')
  const end = moment(baseSchedule.to).startOf('month')
  const endOfMonth = moment(baseSchedule.to).endOf('month')

  // スケジュールの始点が前月の最終週にまたがるか
  const isFirstWeekOfMonth =
    // その月の最初の日が日曜以外か（日曜の場合は前月にまたがらない）
    // スケジュールの始点がその月の最初の週にあるか
    start.day() !== 0 && start.week() === moment(baseSchedule.from).week()

  // スケジュールの終点が次月の最初の週にまたがるか
  const isLastWeekOfMonth =
    // その月の最終日が土曜以外(土曜の場合は次月の最初の週にまたがらない)
    endOfMonth.day() !== 6 &&
    // スケジュールの終点がその月の最終週にあるか
    endOfMonth.week() === moment(baseSchedule.to).week()

  // スケジュールの始点が前月の最終週にまたがる場合は始点を前の月にづらす
  if (isFirstWeekOfMonth) {
    start.add(-1, 'month')
  }

  // スケジュールの終点が次月の最終週にまたがる場合は終点を次月にづらす
  if (isLastWeekOfMonth) {
    end.add(1, 'month')
  }

  // スケジュールが何ヶ月つづくのか
  const duration = end.diff(start, 'month') + 1

  return { start, duration }
}

/**
 * その月のスケジュールの始まりと終わりを返す
 * @param currentMoment その月のmoment
 * @param baseSchedule 始点(from)、終点(to)を含んだスケジュールを表すオブジェクト
 * @param index スケジュールを月で分割したときの月のインデックス
 * @param duration スケジュールが何ヶ月続くのか
 */
export const getScheduleSpan = (
  currentMoment: Moment,
  baseSchedule: Schedule,
  index: number,
  duration: number
): MinSchedule => {
  /* indexが0 = 始点の月（始点が前月の最終週にまたがる場合は始点の前の月がindex=0になる）の場合はスケジュールの始点。
   それ以外はその月の最初の週の日曜か、始点がその月の最初の週にかぶる場合はスケジュールの始点を返す
  */
  const from =
    index === 0
      ? baseSchedule.from
      : getMonthEdge(
          'from',
          moment(currentMoment).startOf('month'),
          baseSchedule.from
        )
  /* indexがduration = 終点の月（終点が次月の最初の週にまたがる場合は終点の次の月がindex=durationになる）の場合はスケジュールの終点。
   それ以外はその月の最終週の土曜か、終点がその月の最終週にかぶる場合はスケジュールの終点を返す
  */
  const to =
    index === duration
      ? baseSchedule.to
      : getMonthEdge(
          'to',
          moment(currentMoment).endOf('month'),
          baseSchedule.to
        )
  return { from, to }
}

/**
 * directionに合わせてスケジュールのはじまりか終わりを返す
 * @param direction 始点か終点どちらをもとめるのか
 * @param currentMoment directionがfromなら初日、toなら最終日にセットされたその月のmoment
 * @param scheduleEndOrStart directionがfromならスケジュールの始点、toなら終点のDateInfo
 */
export const getMonthEdge = (
  direction: 'from' | 'to',
  currentMoment: Moment,
  scheduleEndOrStart: DateInfo
) => {
  // スケジュールの(始点 | 終点)にセットしたmoment
  const scheduleMoment = moment(scheduleEndOrStart)

  // 曜日のインデックス(from = 0(日曜) | to = 6(土曜))
  const edge = direction === 'from' ? 0 : 6

  // スケジュールの(始点 | 終点) - その月の(1日 | 最終日) = 日のオフセット
  const dateOffset = scheduleMoment.diff(currentMoment, 'days')

  // 0(日曜) - 1日の曜日 | 6(土曜) - 最終日の曜日 = 曜日のオフセット
  const dayOffset = edge - currentMoment.days()

  // 日のオフセットのほうが小さい場合はスケジュールの(始点 | 終点)を返す
  // それ以外はその月の(1日 | 最終日)に対して曜日のオフセットを足して(日曜 | 土曜)にセット
  const dateIsNear =
    direction === 'from' ? dateOffset > dayOffset : dateOffset < dayOffset
  const { years, months, date } = dateIsNear
    ? scheduleEndOrStart
    : currentMoment.add(dayOffset, 'days').toObject()
  return { years, months, date }
}

// firestoreから取得したScheduleObjをカレンダーに表示するため加工するための関数
// ______________________________________________________
//

export const getScheduleByMonth = (
  scheduleObj: ScheduleObj,
  month: number,
  year: number
): Schedule => {
  const { from, to } = scheduleObj.splited.find(
    (schedule) => schedule.years === year && schedule.months === month
  ) as SplitedSchedule
  return {
    info: scheduleObj.info,
    from,
    to
  }
}

const filterScheduleByYearMonth = (
  scheduleRecords: ScheduleObj[],
  month: number,
  year: number
): ScheduleObj[] => {
  return scheduleRecords
    .filter((scheduleObj) => scheduleObj.range.years.includes(year))
    .filter((scheduleObj) => scheduleObj.range.months[year].includes(month))
}

export const filterAndSortSchedule = (week: WeekOfSchedules) => {
  return week
    .filter((schedule): schedule is ScheduleOnWeek => schedule !== null)
    .sort((a, b) => {
      const adiff = moment(a.info.to).diff(moment(a.info.from), 'day')
      const bDiff = moment(b.info.to).diff(moment(b.info.from), 'day')
      return bDiff - adiff
    })
}

export const getMonthOfWeeks = (months: number, years: number) => {
  // 1日をセット
  const startOfMonth = moment({ months, years }).startOf('month')

  // 曜日のインデックス = 日曜からのオフセット
  const weekOffset = startOfMonth.day()

  // 1日週の日曜（1日が日曜でなければ先月になる）にセット
  const startOfWeek = moment(startOfMonth).subtract(weekOffset, 'day')

  // その月の最後の日をセット
  const endOfMonth = moment(startOfMonth).endOf('month')

  // その月が何週あるか
  const weekLength = endOfMonth.diff(startOfWeek, 'week') + 1
  // その月の週分配列を格納した配列
  const monthOfWeeks: MonthOfWeeks = [...Array(weekLength)].map(() => [])
  return { monthOfWeeks, startOfWeek }
}

export const addScheduleToWeeks = (
  weeks: MonthOfWeeks,
  schedule: Schedule,
  startOfWeek: Moment
) => {
  const weekSplitParam = getWeekSplitParams(schedule, startOfWeek)
  return weeks.map((week, weekIndex) => {
    const weekSchedule = getWeekSchedule(weekSplitParam, weekIndex)
    week.push(weekSchedule)
    return week
  })
}

export const getWeekSplitParams = (
  schedule: Schedule,
  startOfWeek: Moment
): WeekSplitParam => {
  const fromMoment = moment(schedule.from)
  const toMoment = moment(schedule.to)

  // スケジュールの初めがその月の何週目にあるか 0 ~
  const fromIndex = fromMoment.diff(startOfWeek, 'week')

  // スケジュールの終わりががその月の何週目にあるか 0 ~
  const toIndex = toMoment.diff(startOfWeek, 'week')

  const { info } = schedule
  return {
    fromDays: fromMoment.days(),
    fromIndex,
    toDays: toMoment.days(),
    toIndex,
    info
  }
}

export const getWeekSchedule = (
  { fromDays, fromIndex, toDays, toIndex, info }: WeekSplitParam,
  targetWeekIndex: number
): ScheduleOnWeek | null => {
  // targetWeekがスケジュールの期間に含まれるか
  const targetWeekHasSchedule =
    fromIndex <= targetWeekIndex && targetWeekIndex <= toIndex

  if (!targetWeekHasSchedule) return null

  // targetWeekがスケジュールの期間に含まれるか
  const from = targetWeekIndex === fromIndex ? fromDays : 0
  const to = targetWeekIndex === toIndex ? toDays : 6
  return {
    from,
    to,
    info
  }
}

export const splitSchedulesByWeek = (
  scheduleRecords: ScheduleObj[],
  month: number,
  year: number
): SchedulesOnWeek => {
  const { monthOfWeeks, startOfWeek } = getMonthOfWeeks(month, year)
  const filtered = filterScheduleByYearMonth(scheduleRecords, month, year)
  return filtered
    .reduce((monthOfWeeks, scheduleObj) => {
      const schedule = getScheduleByMonth(scheduleObj, month, year)
      return addScheduleToWeeks(monthOfWeeks, schedule, startOfWeek)
    }, monthOfWeeks)
    .map((week) =>
      week.every((schedule) => !schedule) ? null : filterAndSortSchedule(week)
    )
}
