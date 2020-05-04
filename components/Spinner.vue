<template>
  <div class="spinner">
    <svg viewBox="0 0 32 32" :width="size" :height="size">
      <circle
        class="spinner__circle"
        cx="16"
        cy="16"
        r="14"
        fill="none"
        :stroke="stroke"
      ></circle>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    stroke: {
      type: String,
      default: () => '#89a79f'
    },
    size: {
      type: Number,
      default: () => 32
    }
  }
})
</script>

<style lang="scss" scoped>
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(450deg);
  }
}

@keyframes line {
  0% {
    stroke-dasharray: 2, 85.964;
    transform: rotate(0);
  }

  50% {
    stroke-dasharray: 65.973, 21.9911;
    stroke-dashoffset: 0;
  }

  100% {
    stroke-dasharray: 2, 85.964;
    stroke-dashoffset: -65.973;
    transform: rotate(90deg);
  }
}
.spinner {
  &__circle {
    animation: line 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite,
      rotate 1.6s linear infinite;
    box-sizing: border-box;
    stroke-width: 3px;
    transform-origin: 50%;
  }
}
</style>
