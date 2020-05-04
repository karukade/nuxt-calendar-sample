<template>
  <div class="calendar-board">
    <ul class="calendar-board__week">
      <li v-for="(day, index) in weeks" :key="index">{{ day }}</li>
    </ul>
    <div class="calendar-board__list">
      <transition-group
        tag="div"
        :name="`carousel-${slideDir}`"
        class="calendar-board__track"
      >
        <div
          v-for="calendarItem in calendarArray"
          :key="
            `${calendarItem.yearmonth.years}-${calendarItem.yearmonth.months}`
          "
          class="calendar-board__item"
        >
          <CalendarItem
            :calendar="calendarItem.items"
            @date-selected="onDateSelected"
            @schedule-selected="onScheduleSelected"
          />
        </div>
      </transition-group>
    </div>
    <button
      class="calendar-board__add-schedule"
      aria-label="スケジュールを追加"
      @click="showCurrentScheduleDialog"
    ></button>
    <Dialog
      v-model="scheduleConfirmShow"
      :transitioning.sync="dialogTransitioning"
      width="500px"
    >
      <ConfirmDialog
        :schedule="selectedSchedule"
        @delete="deleteSchedule"
        @edit="editSchedule"
      />
    </Dialog>
    <Dialog
      v-model="scheduleDialogShow"
      :transitioning.sync="dialogTransitioning"
      width="500px"
    >
      <TheScheduleDialog
        :base-schedule="selectedDateInfo"
        @close="
          () => {
            toggleDialog('schedule')
          }
        "
        @save="onScheduleSave"
        @update="onShceduleUpdate"
      />
    </Dialog>
    <SnackBars :show="saving">
      <template #show>
        <div class="calendar-board__saving-txt">
          <Spiner stroke="#fff" :size="15" />
          <span>保存中です</span>
        </div>
      </template>
      <template #hide>
        <div class="calendar-board__saving-txt">
          <span>保存が完了しました</span>
        </div>
      </template>
    </SnackBars>
    <SnackBars :show="deleting">
      <template #show>
        <div class="calendar-board__saving-txt">
          <Spiner stroke="#fff" :size="15" />
          <span>スケジュールを削除しています</span>
        </div>
      </template>
      <template #hide>
        <div class="calendar-board__saving-txt">
          <span>削除が完了しました</span>
        </div>
      </template>
    </SnackBars>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ExStore } from 'vuex'
import moment from 'moment'
import 'moment/locale/ja'

// component
import Dialog from '@/components/Dialog.vue'
import TheScheduleDialog from '@/components/TheScheduleDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import CalendarItem from '@/components/CalendarItem.vue'
import SnackBars from '@/components/SnackBars.vue'
import Spiner from '@/components/Spinner.vue'

// plugin
import { colorList } from '@/plugins/colors'

// types
import { CalendarObj } from '@/plugins/calendar'
import { Schedule, ScheduleInfo, DateInfo } from '@/plugins/schedule'

const toScheduleFormat = (dateInfo: DateInfo): Schedule => {
  return {
    from: dateInfo,
    to: dateInfo,
    info: {
      title: '',
      guest: '',
      location: '',
      detail: '',
      color: colorList.peacock,
      from: {
        date: 0,
        months: 0,
        years: 0
      },
      to: {
        date: 0,
        months: 0,
        years: 0
      },
      hours: {
        from: '00:00',
        to: '00:00'
      }
    }
  }
}

export default Vue.extend({
  components: {
    CalendarItem,
    TheScheduleDialog,
    Dialog,
    ConfirmDialog,
    SnackBars,
    Spiner
  },
  data: () => ({
    weeks: ['日', '月', '火', '水', '木', '金', '土'],
    slideDir: 'next',
    scheduleDialogShow: false,
    dialogTransitioning: false,
    scheduleConfirmShow: false,
    deleting: false,
    saving: false,
    selectedDateInfo: {} as Schedule,
    selectedSchedule: {} as ScheduleInfo
  }),
  computed: {
    calendar(): CalendarObj | null {
      return (this.$store as ExStore).state.calendar.calendar
    },
    calendarArray(): CalendarObj[] | null {
      return this.calendar ? [this.calendar] : null
    }
  },
  watch: {
    calendar(newCalendar, oldCalendar) {
      const newMoment = moment(newCalendar.yearmonth)
      const oldMoment = moment(oldCalendar.yearmonth)
      this.slideDir = newMoment.isBefore(oldMoment) ? 'prev' : 'next'
    }
  },
  methods: {
    toggleDialog(type: 'schedule' | 'confirm') {
      if (type === 'schedule') {
        if (this.dialogTransitioning) return
        this.scheduleDialogShow = !this.scheduleDialogShow
      } else {
        if (this.dialogTransitioning) return
        this.scheduleConfirmShow = !this.scheduleConfirmShow
      }
    },

    // スケジュール選択時
    async deleteSchedule(id: string) {
      this.toggleDialog('confirm')
      this.deleting = true
      await (this.$store as ExStore).dispatch('schedules/deleteSchedule', id)
      this.deleting = false
    },
    editSchedule(schedule: Schedule) {
      this.toggleDialog('confirm')
      this.selectedDateInfo = schedule
      this.toggleDialog('schedule')
    },
    onScheduleSelected(scheduleInfo: ScheduleInfo) {
      this.selectedSchedule = scheduleInfo
      this.toggleDialog('confirm')
    },

    // カレンダー選択時
    addSchedules(schedule: Schedule) {
      return (this.$store as ExStore).dispatch(
        'schedules/addSchedules',
        schedule
      )
    },
    onDateSelected(dateInfo: DateInfo) {
      this.selectedDateInfo = toScheduleFormat(dateInfo)
      this.toggleDialog('schedule')
    },
    showCurrentScheduleDialog() {
      const yearmonth = (this.$store as ExStore).state.calendar.calendar
        ?.yearmonth
      if (!yearmonth) return
      const { years, months } = yearmonth
      this.selectedDateInfo = toScheduleFormat({ years, months, date: 1 })
      this.toggleDialog('schedule')
    },
    async onScheduleSave(schedule: Schedule) {
      this.saving = true
      this.toggleDialog('schedule')
      await this.addSchedules(schedule)
      this.saving = false
    },
    async onShceduleUpdate(schedule: Schedule) {
      this.saving = true
      this.toggleDialog('schedule')
      if (!schedule.info.id) return
      await (this.$store as ExStore).dispatch('schedules/updateSchedule', {
        id: schedule.info.id,
        schedule
      })
      this.saving = false
    }
  }
})
</script>

<style lang="scss" scoped>
%flex-column {
  flex-direction: column;
  justify-content: flex-start;
}
.calendar-board {
  position: relative;
  font-size: 1.4rem;
  height: calc(100vh - 70px);
  display: flex;
  @extend %flex-column;
  &__week {
    font-size: 10px;
    margin-bottom: 8px;
    flex-shrink: 1;
    display: flex;
    > * {
      flex: 1 1 0%;
      text-align: center;
      color: $d-gray;
    }
  }
  &__list {
    overflow: hidden;
    flex-grow: 1;
    display: flex;
    @extend %flex-column;
  }
  &__track {
    flex-grow: 1;
    display: flex;
    position: relative;
  }
  &__item {
    display: flex;
    flex: 1 0 auto;
    width: 100%;
    font-size: 1.4rem;
    @extend %flex-column;
    > * {
      flex-grow: 1;
    }
  }
  &__saving-txt {
    display: flex;
    align-items: center;
    > * + * {
      margin-left: 8px;
    }
  }
  &__add-schedule {
    position: absolute;
    top: 50px;
    left: 20px;
    background-color: rgba(255, 255, 255, 0.6);
    display: inline-block;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    margin-right: 16px;
    box-shadow: $shadow;
    transition: background-color 0.2s ease;
    &:hover {
      background-color: lighten($primary-color, 5%);
      &:before,
      &:after {
        background-color: #fff;
      }
    }
    &:before,
    &:after {
      transition: background-color 0.2s ease;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      content: '';
      display: block;
      background-color: $primary-color;
      width: 14px;
      height: 2px;
      border-radius: 2px;
    }
    &:before {
      transform: rotate(90deg);
    }
  }
}

.carousel {
  &-prev,
  &-next {
    &-enter-active {
      transition: transform 0.4s ease, opacity 0.35s ease-out;
    }
    &-leave-active {
      transition: transform 0.4s ease-in, opacity 0.35s ease-out;
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
</style>
