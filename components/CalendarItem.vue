<template>
  <div ref="calendar" class="calendar">
    <div
      v-for="(week, weekIndex) in calendar"
      :key="weekIndex"
      class="calendar__week"
    >
      <ScheduleRow
        v-if="schedulesRows[weekIndex]"
        :schedules="schedulesRows[weekIndex]"
        @schedule-selected="onScheduleSelected"
      />
      <div class="calendar__date-row">
        <CalendarDate
          v-for="(date, dateIndex) in week"
          :key="`${weekIndex}-${dateIndex}`"
          class="calendar__date"
          :date-info="date"
          @date-selected="onDateSelected"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

// types
import { ExStore } from 'vuex'
import { CalendarObj } from '@/plugins/calendar'
import { DateInfo, ScheduleInfo, SchedulesOnWeek } from '@/plugins/schedule'

// components
import CalendarDate from '@/components/CalendarDate.vue'
import ScheduleRow from '@/components/ScheduleRow.vue'

export default Vue.extend({
  components: {
    CalendarDate,
    ScheduleRow
  },
  props: {
    calendar: {
      type: Array as PropType<CalendarObj['items']>,
      required: true
    }
  },
  computed: {
    schedulesRows(): SchedulesOnWeek {
      return (this.$store as ExStore).getters['schedules/schedulesRows']
    }
  },
  methods: {
    onDateSelected(dateInfo: DateInfo) {
      this.$emit('date-selected', dateInfo)
    },
    onScheduleSelected(scheduleInfo: ScheduleInfo) {
      this.$emit('schedule-selected', scheduleInfo)
    }
  }
})
</script>

<style lang="scss" scoped>
.calendar {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  &__week {
    position: relative;
    padding-top: calc(2em + 8px);
    flex: 1 1 0%;
  }
  &__date-row {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    flex: 1 1 0%;
    display: flex;
    > * {
      flex: 1 1 0%;
      text-align: center;
    }
  }
  &-date,
  &__week {
    border-top: 1px solid $l-gray;
  }
}
</style>
