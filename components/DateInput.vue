<template>
  <div ref="dateInput" class="date-input">
    <div v-if="showHour && prependHour" class="date-input__hour-input">
      <HourInput v-model="localHour" />
    </div>
    <TextField
      ref="textField"
      v-model="localInputValue"
      border-type="noline"
      :focus-to-select="true"
      @focus="!pickerShow && pickerOpen()"
      @key-down-enter="setValue"
      @key-down-tab="setValue"
    />
    <div v-if="showHour && !prependHour" class="date-input__hour-input">
      <HourInput v-model="localHour" />
    </div>
    <PopOver
      v-model="pickerShow"
      :reference="popOverRef"
      :option="{
        strategy: 'fixed'
      }"
    >
      <DatePicker v-model="localDate" />
    </PopOver>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import 'moment/locale/ja'
import Vue, { PropType } from 'vue'

// plugin
import { toString } from '@/plugins/calendar'

// components
import DatePicker from '@/components/DatePicker.vue'
import TextField from '@/components/TextField.vue'
import PopOver from '@/components/PopOver.vue'
import HourInput from '@/components/HourInput.vue'

// tyeps
import { DateInfo } from '@/plugins/schedule'

export default Vue.extend({
  components: {
    DatePicker,
    TextField,
    HourInput,
    PopOver
  },
  props: {
    date: {
      type: Object as PropType<DateInfo>,
      required: true
    },
    from: {
      type: Object as PropType<DateInfo>,
      default: null
    },
    hours: {
      type: String,
      required: true
    },
    prependHour: Boolean,
    showHour: Boolean
  },
  data: () => ({
    pickerShow: false,
    localInputValue: '',
    popOverRef: {}
  }),
  computed: {
    localDate: {
      set(value: DateInfo) {
        const isValid = this.isValideDate(value)
        const innerVal = isValid ? value : this.from
        const localInputValue = toString(innerVal, 'ymd')
        if (!localInputValue) return
        this.localInputValue = localInputValue
        this.$emit('update:date', { ...innerVal })
        if (!isValid) {
          const textField = this.$refs.textField as InstanceType<
            typeof TextField
          >
          textField.shake()
          textField.foucs()
        } else {
          this.pickerClose()
        }
      },
      get(): DateInfo {
        const { years, months, date } = this.date
        return { years, months, date }
      }
    },
    localHour: {
      get(): string {
        return this.hours
      },
      set(hours: string) {
        this.$emit('update:hours', hours)
      }
    }
  },
  watch: {
    date: {
      immediate: true,
      handler(value: DateInfo) {
        const localInputValue = toString(value, 'ymd')
        if (!localInputValue) return
        this.localInputValue = localInputValue
      }
    }
  },
  mounted() {
    this.$nextTick(
      () =>
        (this.popOverRef = (this.$refs.textField as InstanceType<
          typeof TextField
        >).$el)
    )
  },
  methods: {
    setValue(e: Event): void {
      if (!(e.target instanceof HTMLInputElement)) return
      const textField = this.$refs.textField as InstanceType<typeof TextField>
      const value = e.target.value
      const type = e.type
      const dateInfo = this.getDateInfoObj(value)
      if (dateInfo != null) {
        if (type === 'keydown') textField.blur()
        this.$emit('update:date', dateInfo)
        this.pickerClose()
        return
      }
      textField.shake()
      const localInputValue = toString(this.localDate, 'ymd')
      if (!localInputValue) return
      this.localInputValue = localInputValue
      this.$nextTick(textField.select)
    },
    getDateInfoObj(value: string): DateInfo | null {
      const inputMoment = moment(
        value,
        ['YYYY年M月D日', 'YYYY-M-D', 'YYYY/M/D'],
        true
      )
      if (!inputMoment.isValid()) return null
      const { years, months, date } = inputMoment.toObject()
      return { years, months, date }
    },
    pickerClose() {
      this.pickerShow = false
    },
    pickerOpen() {
      this.pickerShow = true
    },
    isValideDate(dateInfo: DateInfo) {
      if (!this.from) return true
      return moment(dateInfo).diff(moment(this.from)) >= 0
    }
  }
})
</script>

<style lang="scss" scoped>
.date-input {
  display: flex;
  &__hour-input {
    width: 40%;
  }
  > * + * {
    margin-left: 8px;
  }
}
</style>
