<template functional>
  <button class="icon-btn" :class="data.staticClass" v-on="listeners">
    <i class="material-icons">{{ props.icon }}</i>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>

<style lang="scss" scoped>
.icon-btn {
  background-color: #fff;
  border: solid $l-gray 1px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  line-height: 1;
  text-align: center;
  + .icon-btn {
    margin-left: 10px;
  }
  > .material-icons {
    font-size: 1.8rem;
  }
  @include bgHover(darken(#fff, 5%));
  &.-no-border {
    border: none;
  }
}
</style>
