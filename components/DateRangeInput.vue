<template>
  <div class="date-range">
    <div class="date-range__row">
      <span class="date-range__icon"
        ><i class="material-icons">schedule</i></span
      >
      <div class="date-range__input">
        <DateInput
          :date.sync="localFrom"
          :hours.sync="localHoursFrom"
          :show-hour="showHour"
        />
      </div>
      <span class="date-range__hyphen">-</span>
      <div class="date-range__input">
        <DateInput
          ref="toInput"
          :date.sync="localTo"
          :hours.sync="localHoursTo"
          :prepend-hour="true"
          :show-hour="showHour"
          :from="localFrom"
        />
      </div>
      <BtnOutLine v-if="!showHour" size="s" @click="showHour = !showHour">
        時間を追加
      </BtnOutLine>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

// components
import DateInput from '@/components/DateInput.vue'
import BtnOutLine from '@/components/BtnOutLine.vue'

// tyeps
import { DateInfo } from '@/plugins/schedule'

type Hours = { from: string; to: string }

export default Vue.extend({
  components: {
    DateInput,
    BtnOutLine
  },
  props: {
    from: {
      type: Object as PropType<DateInfo>,
      required: true
    },
    to: {
      type: Object as PropType<DateInfo>,
      required: true
    },
    hours: {
      type: Object as PropType<Hours>,
      required: true
    }
  },
  data: () => ({
    showHour: false
  }),
  computed: {
    localFrom: {
      set(value: DateInfo): void {
        this.$emit('update:from', value)
      },
      get(): DateInfo {
        return { ...this.from }
      }
    },
    localTo: {
      set(value: DateInfo): void {
        // const isBeforeFrom = moment(value).diff(moment(this.localFrom)) < 0
        // const innerVal = isBeforeFrom ? this.localFrom : value
        // if (isBeforeFrom)
        //   (this.$refs.toInput as InstanceType<typeof DateInput>).err()
        this.$emit('update:to', value)
      },
      get(): DateInfo {
        return { ...this.to }
      }
    },
    localHoursFrom: {
      set(value: string) {
        this.$emit('update:hours', { from: value, to: this.localHoursTo })
      },
      get(): string {
        return this.hours.from
      }
    },
    localHoursTo: {
      set(value: string) {
        this.$emit('update:hours', { to: value, from: this.localHoursFrom })
      },
      get(): string {
        return this.hours.to
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.date-range {
  &__row {
    padding-left: 32px;
    position: relative;
    display: flex;
    align-items: center;
  }
  &__hyphen {
    padding-left: 14px;
    padding-right: 14px;
  }
  &__input {
    flex-basis: 50%;
    position: relative;
    z-index: 1;
  }
  &__icon {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 24px;
    height: 24px;
    margin-top: auto;
    margin-bottom: auto;
  }
  &__picker {
    position: fixed;
    &-enter-active,
    &-leave-active {
      transition: transform 0.1s ease-in, opacity 0.1s ease-in;
    }
    &-enter,
    &-leave-to {
      opacity: 0;
      transform: translate3d(0, -10px, 0);
    }
  }
}
</style>
