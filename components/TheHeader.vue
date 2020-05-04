<template>
  <header class="header">
    <div class="header-left">
      <div class="header-icon">
        <img src="@/assets/img/ico-calendar.svg" alt="" />
      </div>
      <div class="header-today-btn">
        <BtnOutLine size="s" @click="setToday">今月</BtnOutLine>
      </div>
    </div>
    <div class="header-center">
      <TheMonthPager />
    </div>
    <div class="header-right">
      <Avater />
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import { ExStore } from 'vuex'
import moment from 'moment'
import 'moment/locale/ja'
import TheMonthPager from '@/components/TheMonthPager.vue'
import BtnOutLine from '@/components/BtnOutLine.vue'
import Avater from '@/components/Avater.vue'

export default Vue.extend({
  components: {
    TheMonthPager,
    Avater,
    BtnOutLine
  },
  methods: {
    setToday() {
      const { years, months } = moment().toObject()
      ;(this.$store as ExStore).dispatch('calendar/setMonth', { years, months })
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 32px;
  background-color: #fff;
  position: relative;
  z-index: 2;
  &-left,
  &-right {
    display: flex;
    align-items: center;
  }
  &-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  &-icon {
    width: 32px;
    margin-right: 28px;
    @media screen and (max-width: 767px) {
      display: none;
    }
  }
}
</style>
