<template>
  <transition
    name="popper"
    @before-enter="beforeEnter"
    @after-leave="afterLeave"
  >
    <div
      v-if="value"
      ref="popper"
      v-clickoutside="{ callback: close, include: [reference] }"
      class="popper"
    >
      <slot />
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import { createPopper, Instance } from '@popperjs/core'
import clickOutSide from '@/plugins/clickOutSide'

const popperModifiers = [
  {
    name: 'computeStyles',
    options: {
      adaptive: false,
      gpuAcceleration: false
    }
  },
  {
    name: 'flip',
    options: {
      padding: 40
    }
  }
]

const initPopper = (
  ref: HTMLElement,
  popper: HTMLElement,
  popperOptions = {}
) => {
  const options = {
    ...popperOptions,
    placement: 'bottom' as 'bottom', // 言うこと聞いてくれない。。
    modifiers: popperModifiers
  }
  return createPopper(ref, popper, options)
}

export default Vue.extend({
  directives: {
    clickoutside: clickOutSide
  },
  props: {
    value: Boolean,
    reference: {
      type: [HTMLElement, Object],
      default: () => ({})
    },
    option: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    popperInstance: null as null | Instance
  }),
  methods: {
    close() {
      this.$emit('input', false)
    },
    beforeEnter() {
      this.$nextTick(() => {
        if (!(this.reference instanceof HTMLElement)) return
        this.popperInstance = initPopper(
          this.reference,
          this.$refs.popper as HTMLElement,
          this.option
        )
      })
    },
    afterLeave() {
      if (this.popperInstance) {
        this.popperInstance.destroy()
        this.popperInstance = null
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.popper {
  z-index: 3;
  @include dialogTransition;
}
</style>
