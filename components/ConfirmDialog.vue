<template>
  <div class="confirm-dialog" role="dialog">
    <div class="confirm-dialog__header">
      <div class="confirm-dialog__ttl">{{ schedule.title }}</div>
      <div class="confirm-dialog__menu">
        <IconBtn icon="create" class="-no-border" @click="edit" />
        <IconBtn icon="delete" class="-no-border" @click="del" />
      </div>
    </div>
    <div class="confirm-dialog__span">{{ span }}</div>
    <div class="confirm-dialog__user">
      <i class="material-icons">account_circle</i>
      <span>{{ userName }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.confirm-dialog {
  padding: 38px 30px 30px;
  &__header {
    display: flex;
    justify-content: space-between;
  }
  &__menu {
    position: absolute;
    top: 7px;
    right: 52px;
    display: flex;
    justify-content: flex-end;
  }
  &__span {
    margin-top: 8px;
  }
  &__ttl {
    font-size: 20px;
    font-weight: bold;
  }
  &__user {
    display: flex;
    align-items: center;
    margin-top: 24px;
    color: $d-gray;
    > * + * {
      margin-left: 6px;
    }
  }
}
</style>

<script lang="ts">
import Vue, { PropType } from 'vue'

// types
import { ExStore } from 'vuex'
import { ScheduleInfo, Schedule } from '@/plugins/schedule'

// components
import IconBtn from '@/components/IconBtn.vue'

export default Vue.extend({
  components: {
    IconBtn
  },
  model: {
    prop: 'show',
    event: 'close'
  },
  props: {
    show: Boolean,
    schedule: {
      type: Object as PropType<ScheduleInfo>,
      required: true
    }
  },
  computed: {
    localShow: {
      get(): boolean {
        return this.show
      },
      set(val: boolean) {
        this.$emit('close', val)
      }
    },
    userName(): string | undefined | null {
      return (this.$store as ExStore).state.user.user?.name
    },
    span(): string {
      const { from, to, hours } = this.schedule
      const fromFormated = `${from.years}年${from.months + 1}月${from.date}日${
        hours.from
      }`
      const toFormated = `${
        to.years === from.years ? '' : `${to.years}年`
      }${to.months + 1}月${to.date}日${hours.to}`
      return `${fromFormated} ~ ${toFormated}`
    }
  },
  methods: {
    edit() {
      const schedule: Schedule = {
        from: { ...this.schedule.from },
        to: { ...this.schedule.to },
        info: { ...this.schedule }
      }
      this.$emit('edit', schedule)
    },
    del() {
      this.$emit('delete', this.schedule.id)
    }
  }
})
</script>
