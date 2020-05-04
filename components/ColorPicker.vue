<template>
  <div class="color-picker">
    <button
      ref="btn"
      class="color-picker__select"
      @click="pickerShow = !pickerShow"
    >
      <div
        class="color-picker__select-color"
        :style="{ backgroundColor: value }"
      ></div>
      <i class="material-icons">arrow_drop_down</i>
    </button>
    <PopOver v-model="pickerShow" :reference="$refs.btn">
      <ul class="color-picker__list">
        <li v-for="([name, color], i) in colors" :key="i">
          <button
            class="color-picker__btn"
            :class="{ 'is-selected': name === value }"
            :aria-label="name"
            :style="{ backgroundColor: color }"
            @click="onSelect(color)"
          ></button>
        </li>
      </ul>
    </PopOver>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PopOver from '@/components/PopOver.vue'
import { colorList } from '@/plugins/colors'

export default Vue.extend({
  components: {
    PopOver
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data: (): { colors: string[][]; pickerShow: boolean } => ({
    colors: Object.entries(colorList),
    pickerShow: false
  }),
  methods: {
    onSelect(color: string) {
      this.pickerShow = false
      this.$emit('input', color)
    }
  }
})
</script>

<style lang="scss">
.color-picker {
  &__select {
    display: flex;
    min-height: 40px;
    line-height: 40px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 6px;
    &:focus {
      background-color: $primary-color-pale;
      box-shadow: 0px 0px 0px 2px $primary-color;
      border-width: 2px;
    }
    &-color {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      line-height: 1;
      margin-right: 8px;
    }
  }
  &__list {
    width: 64px;
    background-color: #fff;
    padding: 10px;
    @extend %dialog-base;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    > * {
      width: 18px;
      height: 18px;
      position: relative;
      &:nth-child(even) {
        margin-left: 4px;
      }
      &:nth-child(n + 3) {
        margin-top: 8px;
      }
    }
  }
  &__btn {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    line-height: 1;
    &:hover {
      transform: scale(1.01);
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
    }
    &.is-selected {
      &:before {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
        content: '';
        width: 10px;
        height: 3px;
        border-left: 1px solid #fff;
        border-bottom: 1px solid #fff;
        transform: rotate(45deg);
      }
    }
  }
}
</style>
