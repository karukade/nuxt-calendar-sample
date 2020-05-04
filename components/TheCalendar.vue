<template>
  <div>
    <TheHeader />
    <TheCalendarBoard class="calendar-bord" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

// types
import { ExStore } from 'vuex'

// components
import TheHeader from '@/components/TheHeader.vue'
import TheCalendarBoard from '@/components/TheCalendarBoard.vue'

export default Vue.extend({
  components: {
    TheHeader,
    TheCalendarBoard
  },
  created() {
    this.setMonth()
  },
  methods: {
    setMonth() {
      ;(this.$store as ExStore).dispatch('calendar/setMonth')
    }
  }
})
</script>
