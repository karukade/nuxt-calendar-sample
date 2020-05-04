<template>
  <div class="pager">
    <PagerArrow dir="prev" @click="incMonth(-1)" />
    <div class="pager-select">
      <button ref="btn" class="pager-select-btn" @click="toggleYearCalendar">
        {{ headerTxt }}
      </button>
      <PopOver v-model="showYearCalendar" :reference="$refs.btn">
        <DatePicker v-model="yearmonth" type="month" />
      </PopOver>
    </div>
    <PagerArrow dir="next" @click="incMonth(1)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

// types
import { ExStore } from 'vuex'

// plugins
import { toString, CalendarObj, YearMonth } from '@/plugins/calendar'

// componetns
import DatePicker from '@/components/DatePicker.vue'
import PagerArrow from '@/components/PagerArrow.vue'
import PopOver from '@/components/PopOver.vue'

export default Vue.extend({
  components: {
    DatePicker,
    PagerArrow,
    PopOver
  },
  data: () => ({
    showYearCalendar: false
  }),
  computed: {
    calendar(): CalendarObj | null {
      return (this.$store as ExStore).state.calendar.calendar
    },
    headerTxt(): string | void {
      if (!this.calendar) return
      return toString(this.calendar.yearmonth, 'ym')
    },
    yearmonth: {
      set(yearmonth: YearMonth): void {
        this.setMonth(yearmonth)
      },
      get(): YearMonth | null {
        if (!this.calendar) return null
        return this.calendar.yearmonth
      }
    }
  },
  methods: {
    incMonth(int: number): void {
      ;(this.$store as ExStore).dispatch('calendar/incMonth', int)
    },
    setMonth(yearmonth: YearMonth): void {
      ;(this.$store as ExStore).dispatch('calendar/setMonth', yearmonth)
    },
    toggleYearCalendar() {
      this.showYearCalendar = !this.showYearCalendar
    }
  }
})
</script>

<style lang="scss" scoped>
.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  &-select {
    font-size: 2rem;
    margin-left: 58px;
    margin-right: 48px;
    position: relative;
    @include bgHover(darken(#fff, 5%));
    padding: 14px 24px 14px 14px;
    border-radius: 4px;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 10px;
      width: 0;
      height: 0;
      margin: auto;
      border-style: solid;
      border-width: 5px 4.5px 0 4.5px;
      border-color: #333333 transparent transparent transparent;
    }
  }
  &__month-picker {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate3d(-50%, 100%, 0);
  }
}
</style>
