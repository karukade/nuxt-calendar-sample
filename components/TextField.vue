<template>
  <div ref="textField" class="textField">
    <i v-if="icon && !innerIcon" class="textField__icon material-icons">{{
      icon
    }}</i>
    <div class="textField__inner" :class="modifiers">
      <i v-if="icon && innerIcon" class="textField__icon material-icons">{{
        icon
      }}</i>
      <input
        ref="input"
        type="text"
        class="textField__input"
        :value="value"
        :placeholder="placeholder"
        @input="oninput"
        @focus="onfocus"
        @blur="onblur"
        @keydown.enter="onKeyDownEnter"
        @keydown.tab="onKeyUpTab"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type Modifiers = (string | { [key: string]: boolean })[]

export default Vue.extend({
  props: {
    value: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: () => null
    },
    innerIcon: Boolean,
    placeholder: {
      type: String,
      default: () => ''
    },
    onApperFocus: {
      type: Boolean,
      default: () => false
    },
    size: {
      type: String,
      default: () => 'm',
      validator(val) {
        return ['s', 'm', 'l'].includes(val)
      }
    },
    borderType: {
      type: String,
      default: () => 'outline',
      validator(val) {
        return ['outline', 'underline', 'noline'].includes(val)
      }
    },
    keyDownToBlur: {
      type: Boolean,
      default: () => false
    },
    focusToSelect: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    isFocused: false,
    shaking: false
  }),
  computed: {
    modifiers(): Modifiers {
      return [
        { '-icon': !!this.icon },
        { 'is-focused': this.isFocused },
        { 'is-shaking': this.shaking },
        `-${this.borderType}`,
        `-${this.size}`
      ]
    }
  },
  watch: {
    onApperFocus: {
      immediate: true,
      handler() {
        if (this.onApperFocus) this.foucs()
      }
    }
  },
  methods: {
    oninput(e: Event): void {
      if (!(e.target instanceof HTMLInputElement)) return
      this.$emit('input', e.target.value)
    },
    onfocus(e: Event): void {
      this.isFocused = true
      if (this.focusToSelect) (this.$refs.input as HTMLInputElement).select()
      this.$emit('focus', e)
    },
    onblur(e: Event) {
      this.isFocused = false
      this.$emit('blur', e)
    },
    onKeyDownEnter(e: KeyboardEvent) {
      if (!(e.target instanceof HTMLInputElement)) return
      if (e.keyCode !== 13) return
      if (this.keyDownToBlur) (this.$refs.input as HTMLInputElement).blur()
      this.$emit('key-down-enter', e)
    },
    onKeyUpTab(e: Event) {
      this.$emit('key-down-tab', e)
    },
    blur() {
      ;(this.$refs.input as HTMLInputElement).blur()
    },
    shake() {
      const onAnimEnd = (e: AnimationEvent) => {
        if (!(e.target instanceof HTMLElement)) return
        if (e.animationName && e.animationName.startsWith('shake')) {
          this.shaking = false
          ;(this.$refs.textField as HTMLElement).removeEventListener(
            'animationend',
            onAnimEnd
          )
        }
      }
      ;(this.$refs.textField as HTMLElement).addEventListener(
        'animationend',
        onAnimEnd
      )
      this.shaking = true
    },
    select() {
      ;(this.$refs.input as HTMLInputElement).select()
    },
    foucs() {
      ;(this.$refs.input as HTMLInputElement).focus()
    }
  }
})
</script>

<style lang="scss" scoped>
%input-base {
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 6px;
  transition: background-color 0.2s ease-out, box-shadow 0.2s ease-out;
  &.is-focused {
    background-color: $primary-color-pale;
    box-shadow: 0px 0px 0px 2px $primary-color;
    border-width: 2px;
  }
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }

  40% {
    transform: translateX(-5px);
  }

  80% {
    transform: translateX(5px);
  }

  100% {
    transform: translateX(0);
  }
}

.textField {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  &__inner {
    display: flex;
    align-items: center;
    flex-grow: 1;
    &.-outline {
      @extend %input-base;
      box-shadow: 0px 0px 0px 1px $l-gray;
    }
    &.-underline {
      &:before,
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        margin-left: auto;
        margin-right: auto;
      }
      &:before {
        background-color: $l-gray;
      }
      &:after {
        transform: scale(0, 1);
        background-color: $primary-color;
        transition: transform 0.2s cubic-bezier(0.25, 0.8, 0.5, 1);
      }
      &.is-focused {
        &:after {
          transform: scale(1, 1);
        }
      }
    }
    &.-noline {
      @extend %input-base;
    }
    &.-s {
      font-size: 1.2rem;
    }
    &.-m {
      font-size: 1.4rem;
    }
    &.-l {
      font-size: 2rem;
      .textField__input {
        min-height: 54px;
        line-height: 54px;
      }
    }
    &.is-shaking {
      animation: shake 0.15s linear 2 both;
    }
  }
  &__input {
    min-height: 40px;
    line-height: 40px;
    width: 100%;
    &:focus {
      outline: none;
    }
  }
  &__icon {
    flex-shrink: 0;
    margin-right: 8px;
  }
}
</style>
