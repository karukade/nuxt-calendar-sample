<template>
  <transition name="toast">
    <div v-if="localShow" class="toast">
      <div class="toast__inner">
        <slot v-if="show" name="show" />
        <slot v-if="!show" name="hide" />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    show: Boolean,
    timeout: {
      type: Number,
      default: () => 3000
    }
  },
  data: () => ({
    timer: null as null | number,
    localShow: false
  }),
  watch: {
    show(val) {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      if (val) {
        this.localShow = val
        return
      }
      this.timer = window.setTimeout(() => {
        this.localShow = false
      }, this.timeout)
    }
  }
})
</script>

<style lang="scss" scoped>
.toast {
  width: 100%;
  z-index: 3;
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  justify-content: center;
  pointer-events: none;
  @include dialogTransition;
  &__inner {
    pointer-events: auto;
    min-width: 110px;
    margin: auto;
    background-color: rgba(50, 50, 50, 1);
    color: #fff;
    font-size: 13px;
    padding: 14px;
    text-align: center;
    @extend %dialog-base;
  }
}
</style>
