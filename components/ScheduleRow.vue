<template>
  <div class="schedule-row">
    <div
      v-for="(schedule, i) in schedules"
      :key="i"
      class="schedule-row__item"
      :style="calcStyle(schedule, i)"
      @click="onScheduleClick(schedule.info)"
    >
      <transition appear name="schedule-row__item-inner">
        <div
          class="schedule-row__item-inner"
          :style="{ backgroundColor: schedule.info.color }"
        >
          {{ schedule.info.title }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

// types
import { ScheduleOnWeek, Schedule } from '@/plugins/schedule'

const cellWidth = 14.28
const itemHeight = 24

export default Vue.extend({
  props: {
    schedules: {
      type: Array as PropType<Schedule[]>,
      required: true
    }
  },
  methods: {
    calcStyle({ from, to }: ScheduleOnWeek, index: number) {
      const top = `${itemHeight * index}px`
      const left = `${cellWidth * from}%`
      const width = `${cellWidth * (to - from) + cellWidth}%`
      return { top, left, width }
    },
    onScheduleClick(info: Schedule['info']) {
      this.$emit('schedule-selected', info)
    }
  }
})
</script>

<style lang="scss" scoped>
.schedule-row {
  position: relative;
  z-index: 1;
  &__item {
    cursor: pointer;
    min-width: 14.2%;
    position: absolute;
    left: 0;
    height: 22px;
    padding: 0 8px;
  }
  &__item-inner {
    display: flex;
    align-items: center;
    padding: 4px;
    font-size: 12px;
    line-height: 1;
    color: #fff;
    border-radius: 2px;
    box-shadow: 0px 0px 10px 10px rgab(0, 0, 0, 0.3);
    height: 20px;
    &-enter-active {
      transition: opacity 0.15s cubic-bezier(0.34, 0, 1, 0.98);
    }
    &-leave-active {
      transition: opacity 0.1s cubic-bezier(0.34, 0, 1, 0.98);
    }
    &-enter,
    &-leave-to {
      opacity: 0;
    }
  }
}
</style>
