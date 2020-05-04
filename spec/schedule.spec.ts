import moment from 'moment'
import 'moment/locale/ja'
import {
  genScheduleObj,
  getMonthEdge,
  getWeekSplitParams,
  getMonthOfWeeks,
  getScheduleByMonth,
  addScheduleToWeeks,
  splitSchedulesByWeek,
  filterAndSortSchedule,
  DateInfo,
  ScheduleInfo,
  Schedule,
  ScheduleObj,
  MinSchedule,
  WeekOfSchedules,
  ScheduleOnWeek,
  getDuration,
  getScheduleSpan
} from '@/plugins/schedule'

/**
 * helper functions
 */

function genDateInfo(years: number, months: number, date: number) {
  return {
    date,
    months,
    years
  }
}

function genScheduleInfo(from: DateInfo, to: DateInfo): ScheduleInfo {
  return {
    title: 'タイトル',
    detail: '概要',
    guest: 'ゲスト',
    location: 'ロケーション',
    from,
    to,
    id: '12345',
    color: '#000000',
    hours: {
      from: '00:00',
      to: '00:00'
    }
  }
}

describe('plugins/calendar', () => {
  describe('getDuration', () => {
    test('スケジュールの期間と始点の月の1日にセットしたmomentを返す', () => {
      // 4/5
      const from = genDateInfo(2020, 3, 5)
      // 6/7
      const to = genDateInfo(2020, 5, 7)
      const schedule = {
        from,
        to,
        info: genScheduleInfo(from, to)
      }
      const { start, duration } = getDuration(schedule)
      const { years, months, date } = start.toObject()
      expect({ years, months, date }).toEqual({
        years: 2020,
        months: 3,
        date: 1
      })
      expect(duration).toEqual(3)
    })

    test('スケジュールの始点が前月の最終週にまたがる場合は始点を前の月にづらす', () => {
      // 4/1
      const from = genDateInfo(2020, 3, 1)
      // 4/1
      const to = genDateInfo(2020, 3, 1)
      const schedule = {
        from,
        to,
        info: genScheduleInfo(from, to)
      }
      const { start, duration } = getDuration(schedule)
      const { years, months, date } = start.toObject()
      expect({ years, months, date }).toEqual({
        years: 2020,
        months: 2,
        date: 1
      })
      expect(duration).toEqual(2)
    })

    test('スケジュールの終点が次月の最終週にまたがる場合は終点を次月にづらす', () => {
      // 4/30
      const from = genDateInfo(2020, 3, 30)
      // 4/30
      const to = genDateInfo(2020, 3, 30)
      const schedule = {
        from,
        to,
        info: genScheduleInfo(from, to)
      }
      const { start, duration } = getDuration(schedule)
      const { years, months, date } = start.toObject()
      expect({ years, months, date }).toEqual({
        years: 2020,
        months: 3,
        date: 1
      })
      expect(duration).toEqual(2) // スケジュールは4月内だが5月の最初の週にまたがるので、2ヶ月続くということになる
    })
  })

  describe('getScheduleSpan', () => {
    test('その月のスケジュールの始まりと終わりを返す', () => {
      const from = genDateInfo(2020, 3, 1) // 4/1
      const to = genDateInfo(2020, 3, 2) // 4/2
      const baseSchedule = {
        from,
        to,
        info: genScheduleInfo(from, to)
      }
      const currentMoment = moment({ years: 2020, months: 3, date: 1 }) // 4/1
      const index = 0
      const duration = 1
      expect(
        getScheduleSpan(currentMoment, baseSchedule, index, duration)
      ).toEqual({
        from,
        to
      })
    })
    test('スケジュールがその月をまたぐ場合は、fromはその月の最初の週の日曜にあたる日、toはその月の最後の週の土曜にあたる日を返す', () => {
      // スケジュールは3/1〜5/2として4月のスケジュールを取得する
      const from = genDateInfo(2020, 2, 1) // 3/1
      const to = genDateInfo(2020, 4, 3) // 5/3
      const baseSchedule = {
        from,
        to,
        info: genScheduleInfo(from, to)
      }
      const currentMoment = moment({ years: 2020, months: 3, date: 1 }) // 4/1
      const index = 1
      const duration = 3
      expect(
        getScheduleSpan(currentMoment, baseSchedule, index, duration)
      ).toEqual({
        from: genDateInfo(2020, 2, 29), // 3/29(4月最初の週の日曜)
        to: genDateInfo(2020, 4, 2) // 5/2(4月最後の週の土曜)
      })
    })
  })

  describe('genScheduleObj', () => {
    test('スケジュールが含む月と各月のスケジュールを格納したオブジェクトを返す', () => {
      const span: MinSchedule = {
        from: genDateInfo(2020, 10, 29),
        to: genDateInfo(2021, 0, 8)
      }
      const schedule: Schedule = {
        from: span.from,
        to: span.to,
        info: genScheduleInfo(span.from, span.to)
      }
      const output: ScheduleObj = {
        range: {
          years: [2020, 2021],
          months: {
            2020: [10, 11],
            2021: [0]
          }
        },
        info: genScheduleInfo(span.from, span.to),
        splited: [
          {
            years: 2020,
            months: 10,
            from: genDateInfo(2020, 10, 29),
            to: genDateInfo(2020, 11, 5)
          },
          {
            years: 2020,
            months: 11,
            from: genDateInfo(2020, 10, 29),
            to: genDateInfo(2021, 0, 2)
          },
          {
            years: 2021,
            months: 0,
            from: genDateInfo(2020, 11, 27),
            to: genDateInfo(2021, 0, 8)
          }
        ]
      }
      expect(genScheduleObj(schedule)).toEqual(output)
    })
  })

  describe('getMonthEdge', () => {
    test('同じ週の日曜の日付を表すオブジェクトを返す', () => {
      const start = moment()
        .month(3)
        .startOf('month')
      const schedule = { years: 2020, months: 2, date: 30 }
      expect(getMonthEdge('from', start, schedule)).toEqual({
        years: 2020,
        months: 2,
        date: 30
      })
    })

    test('同じ週の日曜の日付を表すオブジェクトを返す', () => {
      const start = moment()
        .month(3)
        .startOf('month')
      const schedule = { years: 2020, months: 2, date: 15 }
      expect(getMonthEdge('from', start, schedule)).toEqual({
        years: 2020,
        months: 2,
        date: 29
      })
    })

    test('同じ週の土曜の日付を表すオブジェクトを返す', () => {
      const end = moment()
        .month(3)
        .endOf('month')
      const schedule = { years: 2020, months: 4, date: 1 }
      expect(getMonthEdge('to', end, schedule)).toEqual({
        years: 2020,
        months: 4,
        date: 1
      })
    })

    test('同じ週の土曜の日付を表すオブジェクトを返す', () => {
      const end = moment()
        .month(3)
        .endOf('month')
      const schedule = { years: 2020, months: 4, date: 10 }
      expect(getMonthEdge('to', end, schedule)).toEqual({
        years: 2020,
        months: 4,
        date: 2
      })
    })
  })

  describe('getMonthOfWeeks', () => {
    test('月内の週の分の配列と月始の週を表すインデックスを返す', () => {
      const year = 2020
      const month = 11
      const output = {
        monthOfWeeks: [...Array(5)].map(() => []),
        startOfWeek: {
          years: 2020,
          months: 10,
          date: 29
        }
      }
      const { monthOfWeeks, startOfWeek } = getMonthOfWeeks(month, year)
      const { years, months, date } = startOfWeek.toObject()
      expect(monthOfWeeks).toEqual(output.monthOfWeeks)
      expect({ years, months, date }).toEqual(output.startOfWeek)
    })
  })

  describe('getWeekSplitParams', () => {
    test('スケジュールを週にマッピングするためのオブジェクトを返す', () => {
      const year = 2020
      const month = 3
      const { startOfWeek } = getMonthOfWeeks(month, year)
      const from = genDateInfo(year, month, 1)
      const to = genDateInfo(year, month, 20)

      const output = {
        fromDays: 3,
        fromIndex: 0,
        toDays: 1,
        toIndex: 3,
        info: genScheduleInfo(from, to)
      }

      const schedule = {
        from,
        to,
        info: genScheduleInfo(from, to)
      }

      expect(getWeekSplitParams(schedule, startOfWeek)).toEqual(output)
    })
  })

  describe('getScheduleByMonth', () => {
    test('月と年を渡してscheduleObjから該当するスケジュールを取得する', () => {
      const span: MinSchedule = {
        from: genDateInfo(2020, 10, 29),
        to: genDateInfo(2021, 0, 8)
      }
      const scheduleObj: ScheduleObj = {
        range: {
          years: [2020, 2021],
          months: {
            2020: [10, 11],
            2012: [0]
          }
        },
        info: genScheduleInfo(span.from, span.to),
        splited: [
          {
            years: 2020,
            months: 10,
            from: genDateInfo(2020, 10, 29),
            to: genDateInfo(2020, 11, 5)
          },
          {
            years: 2020,
            months: 11,
            from: genDateInfo(2020, 10, 29),
            to: genDateInfo(2021, 0, 2)
          },
          {
            years: 2021,
            months: 0,
            from: genDateInfo(2020, 11, 27),
            to: genDateInfo(2021, 0, 8)
          }
        ]
      }
      const output: Schedule = {
        info: genScheduleInfo(span.from, span.to),
        from: genDateInfo(2020, 10, 29),
        to: genDateInfo(2021, 0, 2)
      }
      expect(getScheduleByMonth(scheduleObj, 11, 2020)).toEqual(output)
    })
  })

  describe('addScheduleToWeeks', () => {
    test('月内の週の配列を渡すと各週ごとのスケジュールを配列に追加して返す', () => {
      const { startOfWeek } = getMonthOfWeeks(3, 2020)
      const info = genScheduleInfo(
        genDateInfo(2020, 2, 29),
        genDateInfo(2020, 3, 16)
      )
      const weeks = [
        [{ from: 0, to: 6, info }],
        [{ from: 0, to: 6, info }],
        [{ from: 0, to: 4, info }],
        [null],
        [null]
      ]
      const schedule = {
        from: { years: 2020, months: 2, date: 29 },
        to: { years: 2020, months: 3, date: 16 },
        info
      }
      const output = [
        [
          { from: 0, to: 6, info },
          { from: 0, to: 6, info }
        ],
        [
          { from: 0, to: 6, info },
          { from: 0, to: 6, info }
        ],
        [
          { from: 0, to: 4, info },
          { from: 0, to: 4, info }
        ],
        [null, null],
        [null, null]
      ]
      expect(addScheduleToWeeks(weeks, schedule, startOfWeek)).toEqual(output)
    })
  })

  describe('filterAndSortSchedule', () => {
    test('nullは除外して期間の長さの降順にする', () => {
      const scheduleeA = genScheduleInfo(
        genDateInfo(2020, 2, 29),
        genDateInfo(2020, 3, 16)
      )
      const scheduleB = genScheduleInfo(
        genDateInfo(2020, 2, 29),
        genDateInfo(2020, 3, 21)
      )
      const weekOfSchedules: WeekOfSchedules = [
        null,
        { from: 0, to: 6, info: scheduleeA },
        { from: 0, to: 6, info: scheduleB },
        null
      ]
      const output = [
        { from: 0, to: 6, info: scheduleB },
        { from: 0, to: 6, info: scheduleeA }
      ]
      expect(filterAndSortSchedule(weekOfSchedules)).toEqual(output)
    })
  })

  describe('splitSchedulesByWeek', () => {
    const month = 11
    const year = 2020
    const spanA: MinSchedule = {
      from: genDateInfo(2020, 10, 29),
      to: genDateInfo(2021, 0, 8)
    }
    const scheduleA: Schedule = {
      from: spanA.from,
      to: spanA.to,
      info: genScheduleInfo(spanA.from, spanA.to)
    }
    const spanB: MinSchedule = {
      from: genDateInfo(2020, 10, 23),
      to: genDateInfo(2021, 0, 14)
    }
    const scheduleB: Schedule = {
      from: spanB.from,
      to: spanB.to,
      info: genScheduleInfo(spanB.from, spanB.to)
    }
    const scheduleObjA: ScheduleObj = genScheduleObj(scheduleA)
    const scheduleObjB: ScheduleObj = genScheduleObj(scheduleB)
    const input: ScheduleObj[] = [scheduleObjA, scheduleObjB]
    const output: (ScheduleOnWeek[] | null)[] = [
      [
        { from: 0, to: 6, info: genScheduleInfo(spanB.from, spanB.to) },
        { from: 0, to: 6, info: genScheduleInfo(spanA.from, spanA.to) }
      ],
      [
        { from: 0, to: 6, info: genScheduleInfo(spanB.from, spanB.to) },
        { from: 0, to: 6, info: genScheduleInfo(spanA.from, spanA.to) }
      ],
      [
        { from: 0, to: 6, info: genScheduleInfo(spanB.from, spanB.to) },
        { from: 0, to: 6, info: genScheduleInfo(spanA.from, spanA.to) }
      ],
      [
        { from: 0, to: 6, info: genScheduleInfo(spanB.from, spanB.to) },
        { from: 0, to: 6, info: genScheduleInfo(spanA.from, spanA.to) }
      ],
      [
        { from: 0, to: 6, info: genScheduleInfo(spanB.from, spanB.to) },
        { from: 0, to: 6, info: genScheduleInfo(spanA.from, spanA.to) }
      ]
    ]
    test('scheduleObjと年と月を渡すとその月のスケジュールを週ごとのスケジュールに分割する', () => {
      expect(splitSchedulesByWeek(input, month, year)).toEqual(output)
    })
  })
})
