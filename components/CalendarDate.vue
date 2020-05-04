<template>
  <div class="date" :class="styleModifiiers" @click="onDateSelected">
    <span class="date__txt">
      {{ dateTxt }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { CalendarDate } from '@/plugins/calendar'

export default Vue.extend({
  props: {
    dateInfo: {
      type: Object as PropType<CalendarDate>,
      required: true
    }
  },
  computed: {
    styleModifiiers(): { [key: string]: boolean } {
      return {
        'is-overflow': this.dateInfo.isOverFlow,
        'is-today': this.dateInfo.isToday
      }
    },
    dateTxt(): string | number {
      const { isFirstOfMonth, date, months } = this.dateInfo
      return isFirstOfMonth ? `${months + 1}月${date}日` : date
    }
  },
  methods: {
    onDateSelected() {
      const { date, months, years } = this.dateInfo
      this.$emit('date-selected', {
        date,
        months,
        years
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.date {
  padding: 8px;
  cursor: pointer;
  border-left: 1px solid $l-gray;
  text-align: center;
  &.is-overflow {
    color: $d-gray;
  }
  &.is-today {
    > .date__txt {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 1;
      background-color: $primary-color;
      color: #fff;
      width: 1.6em;
      height: 1.6em;
      border-radius: 50%;
    }
  }
  @include bgHover(#f7f7f7);
}
</style>
