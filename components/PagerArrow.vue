<template>
  <button
    class="pager-arrow"
    :class="modifiers"
    :aria-label="label"
    @click="$emit('click')"
  >
    <i class="material-icons">
      {{ dir === 'next' ? 'keyboard_arrow_right' : 'keyboard_arrow_left' }}
    </i>
  </button>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    dir: {
      type: String,
      default: () => 'next',
      validator(value) {
        return ['prev', 'next'].includes(value)
      }
    },
    size: {
      type: String,
      default: () => 'm',
      validator(value) {
        return ['s', 'm', 'l'].includes(value)
      }
    }
  },
  computed: {
    label(): string {
      return this.dir === 'next' ? '次の月へ' : '前の月へ'
    },
    modifiers(): string[] {
      return [`-${this.size}`]
    }
  }
})
</script>
<style lang="scss" scoped>
.pager-arrow {
  display: flex;
  align-items: center;
  border-radius: 50%;
  justify-content: center;
  text-align: center;
  @include bgHover(darken(#fff, 5%));
  &.-m {
    width: 40px;
    height: 40px;
  }
  &.-s {
    width: 30px;
    height: 30px;
  }
}
</style>
