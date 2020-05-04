<template>
  <div class="date-picker" :class="[isTypeDate ? 'is-date' : 'is-month']">
    <div class="date-picker__header">
      <PagerArrow size="s" dir="prev" @click="increment(-1)" />
      <div class="date-picker__select">
        <span class="year-calendar__select-btn">
          {{ headerTxt }}
        </span>
      </div>
      <PagerArrow size="s" dir="next" @click="increment(1)" />
    </div>
    <div class="date-picker__body">
      <transition-group
        tag="div"
        :name="`date-picker__item-${slideDir}`"
        class="date-picker__track"
      >
        <div
          v-for="calendar in calendarForCarousel"
          :key="createCalendarKey(calendar)"
          class="date-picker__item"
        >
          <div
            v-for="(items, itemsIndex) in calendar.items"
            :key="itemsIndex"
            class="date-picker__row"
          >
            <button
              v-for="(item, itemIndex) in items"
              :key="`${itemsIndex}-${itemIndex}`"
              class="date-picker__cell"
              :class="getStateClass(item)"
              @click="onSelected(item)"
            >
              {{ isTypeDate ? item.date : item.txt }}
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import moment from 'moment'
import 'moment/locale/ja'

// types
import { DateInfo } from '@/plugins/schedule'

// plugins
import {
  createCalendarObj,
  incMonth,
  toString,
  CalendarObj,
  YearMonth
} from '@/plugins/calendar'

// components
import PagerArrow from '@/components/PagerArrow.vue'

type Months = {
  yearmonth: { years: number }
  items: { months: number; txt: string }[][]
}

type Calendar = CalendarObj | Months

type PartialDateInfo = Partial<DateInfo>

const createMonths = ({ years }: DateInfo): Months => {
  const items = [...Array(3)].map((_row, rowIndex) => {
    return [...Array(4)].map((_cell, cellIndex) => {
      const months = rowIndex * 4 + cellIndex
      return { months, txt: `${months + 1}月` }
    })
  })
  return {
    yearmonth: { years },
    items
  }
}

export default Vue.extend({
  components: {
    PagerArrow
  },
  model: {
    event: 'selected',
    prop: 'value'
  },
  props: {
    value: {
      type: Object as PropType<DateInfo>,
      required: true
    },
    type: {
      type: String,
      default: () => 'date'
    }
  },
  data: () => ({
    calendar: {} as Calendar,
    slideDir: 'next',
    selected: {} as PartialDateInfo,
    current: moment().toObject()
  }),
  computed: {
    headerTxt(): string | void {
      if (!this.calendar.yearmonth) return
      const formatType = this.isTypeDate ? 'ym' : 'y'
      return toString(this.calendar.yearmonth, formatType)
    },
    isTypeDate(): boolean {
      return this.type === 'date'
    },
    calendarForCarousel(): Calendar[] {
      return [this.calendar]
    }
  },
  watch: {
    calendar(newCalendar, oldCalendar) {
      const newMoment = moment(newCalendar.yearmonth)
      const oldMoment = moment(oldCalendar.yearmonth)
      this.slideDir = newMoment.isBefore(oldMoment) ? 'prev' : 'next'
    }
  },
  created() {
    this.calendar = this.isTypeDate
      ? createCalendarObj(moment(this.value))
      : createMonths(this.value)
    this.selected = this.value
  },
  methods: {
    increment(int: number) {
      if (this.isTypeDate) {
        this.incMonth(int)
        return
      }
      this.incYear(int)
    },
    incMonth(int: number) {
      if (!('months' in this.calendar.yearmonth)) return
      this.calendar = incMonth(this.calendar.yearmonth, int)
    },
    incYear(int: number) {
      const years = this.calendar.yearmonth.years + int
      this.calendar = {
        yearmonth: { years },
        items: [...(this.calendar.items as Months['items'])]
      }
    },
    onSelected(info: PartialDateInfo) {
      const { years, months, date } = info
      this.selected = this.isTypeDate
        ? { years, months, date }
        : { years: this.calendar.yearmonth.years, months }
      this.$emit('selected', this.selected)
    },
    getStateClass(info: PartialDateInfo) {
      return {
        'is-current': this.hasState(info, this.current),
        'is-active': this.hasState(info, this.selected)
      }
    },
    hasState(info: PartialDateInfo, base: PartialDateInfo) {
      const { months, years, date } = base
      if (this.isTypeDate) {
        return (
          info.years === years && info.months === months && info.date === date
        )
      }
      return this.calendar.yearmonth.years === years && info.months === months
    },
    createCalendarKey({ yearmonth }: Calendar) {
      const { years, months } = yearmonth as YearMonth
      return this.isTypeDate ? `${years}-${months}` : `${years}`
    }
  }
})
</script>

<style lang="scss" scoped>
.date-picker {
  padding: 12px 16px 16px;
  background-color: #fff;
  &.is-date {
    min-height: 312px;
  }
  &.is-month {
    min-width: 200px;
  }
  @extend %dialog-base;
  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 10px;
  }
  &__select {
    margin-left: 8px;
    margin-right: 8px;
  }
  &__body {
    overflow: hidden;
  }
  &__track {
    position: relative;
  }
  &__row {
    display: flex;
    justify-content: space-between;
    + .date-picker__row {
      margin-top: 8px;
    }
  }
  &__cell {
    min-width: 34px;
    min-height: 34px;
    border-radius: 50%;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    @include bgHover(darken(#fff, 5%));
    &.is-active {
      color: $primary-color;
      background-color: lighten($primary-color, 55%);
    }
    &.is-current {
      color: #fff;
      background-color: $primary-color;
    }
  }
  &__item {
    width: 100%;
    &-prev,
    &-next {
      &-enter-active {
        transition: transform 0.4s ease, opacity 0.35s ease-out;
      }
      &-leave-active {
        transition: transform 0.4s ease, opacity 0.35s ease-out;
        position: absolute;
        height: 100%;
      }
    }
    &-prev {
      &-leave-to {
        transform: translate3d(0, 100%, 0);
        opacity: 0;
      }
      &-enter {
        transform: translate3d(0, -100%, 0);
        opacity: 0;
      }
    }
    &-next {
      &-leave-to {
        transform: translate3d(0, -100%, 0);
        opacity: 0;
      }
      &-enter {
        transform: translate3d(0, 100%, 0);
        opacity: 0;
      }
    }
  }
}
</style>
