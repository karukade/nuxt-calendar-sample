<template>
  <div class="HourInput">
    <TextField
      ref="textField"
      v-model="localValue"
      border-type="noline"
      :focus-to-select="true"
      :key-down-to-blur="true"
      @blur="setValue"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TextField from '@/components/TextField.vue'

export default Vue.extend({
  components: {
    TextField
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data: () => ({
    localValue: ''
  }),
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.localValue = value
      }
    }
  },
  methods: {
    isValid(value: string | void) {
      if (!value) return false
      return /^(?:[0-9]|0[0-9]|1[0-9]|2[0-3]):?([0-5][0-9])?$/.test(value)
    },
    format(value: string) {
      if (value.includes(':', 1)) return value
      switch (value.length) {
        case 1:
          return `0${value}:00`
        case 2:
          return `${value}:00`
        case 3:
          return `0${value.substring(0, 1)}:${value.substring(1)}`
        case 4:
          return `${value.substring(0, 2)}:${value.substring(2)}`
      }
    },
    setValue(e: Event) {
      const { target } = e
      if (!(target instanceof HTMLInputElement)) return
      const { value } = target
      if (!this.isValid(value)) {
        this.localValue = this.value
        ;(this.$refs.textField as InstanceType<typeof TextField>).shake()
        return
      }
      const formated = this.format(value)
      if (formated) this.localValue = formated
      this.$emit('input', formated)
    }
  }
})
</script>
