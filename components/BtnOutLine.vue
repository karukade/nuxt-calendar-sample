<template>
  <button class="btn-outline" :class="classes" @click="onClick">
    <slot />
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    size: {
      type: String,
      default: () => 'm',
      validator(value) {
        return ['m', 's', 'l', 'auto', 'full'].includes(value)
      }
    }
  },
  computed: {
    classes(): string[] {
      return [`-${this.size}`]
    }
  },
  methods: {
    onClick(e: MouseEvent) {
      this.$emit('click', e)
    }
  }
})
</script>

<style lang="scss" scoped>
.btn-outline {
  display: inline-block;
  border: solid $l-gray 1px;
  text-align: center;
  font-weight: bold;
  background-color: #fff;
  @include bgHover(darken(#fff, 3%));
  &.-m {
    font-size: 1.4rem;
    padding: 12px 10px 10px;
    border-radius: 40px;
    min-width: 100px;
  }
  &.-s {
    padding: 10px 10px 6px;
    min-width: 90px;
    font-size: 13px;
    border-radius: 40px;
  }
  &.-full {
    font-size: 1.4rem;
    padding: 12px 16px 10px;
    border-radius: 40px;
    width: 100%;
  }
}
</style>
