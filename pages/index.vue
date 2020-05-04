<template>
  <TheCalendar v-if="isAuthenticated" />
</template>

<script>
import { mapGetters } from 'vuex'
import TheCalendar from '@/components/TheCalendar'
export default {
  components: {
    TheCalendar
  },
  computed: {
    ...mapGetters('user', ['isAuthenticated'])
  },
  middleware: ['auth']
}
</script>
