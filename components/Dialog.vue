<template>
  <transition
    name="dialog"
    @after-enter="toggleAnimating"
    @after-leave="toggleAnimating"
  >
    <div v-if="show" v-clickoutside="{ callback: close }" class="dialog">
      <div class="dialog__inner" :style="{ width }">
        <button class="dialog__close" aria-label="閉じる" @click="close">
          <i class="material-icons">close</i>
        </button>
        <slot />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import clickOutSide from '@/plugins/clickOutSide'

export default Vue.extend({
  directives: {
    clickoutside: clickOutSide
  },
  model: {
    event: 'close',
    prop: 'show'
  },
  props: {
    show: {
      type: Boolean,
      default: () => false
    },
    width: {
      type: String,
      default: () => '60%'
    },
    transitioning: {
      type: Boolean
    }
  },
  watch: {
    show() {
      this.$emit('update:transitioning', true)
    }
  },
  methods: {
    close() {
      this.$emit('close', false)
    },
    toggleAnimating() {
      this.$emit('update:transitioning', false)
    }
  }
})
</script>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  pointer-events: none;
  &__inner {
    max-height: 90%;
    position: relative;
    background-color: #fff;
    pointer-events: auto;
    @extend %dialog-base;
  }
  &-enter-active,
  &-leave-active {
    transition: transform 0.15s cubic-bezier(0.44, 0, 0.67, 0.8),
      opacity 0.15s cubic-bezier(0.44, 0, 0.67, 0.8);
  }
  &-enter,
  &-leave-to {
    opacity: 0;
    transform: translate3d(0, 5px, 0);
  }
  &__close {
    font-size: 12px;
    color: $d-gray;
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
