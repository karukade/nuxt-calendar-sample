<template>
  <div class="avater">
    <button
      ref="avater"
      class="avater__btn"
      :style="avater"
      aria-label="アカウント情報"
      @click="avaterShow = !avaterShow"
    ></button>
    <PopOver
      v-model="avaterShow"
      :reference="$refs.avater"
      :option="{
        strategy: 'fixed'
      }"
    >
      <div class="dialog">
        <div class="dialog__avater" :style="avater"></div>
        <div class="dialog__name">{{ user.name }}</div>
        <div class="dialog__email">{{ user.email }}</div>
        <div class="dialog__btn">
          <BtnOutLine @click="signOut">ログアウト</BtnOutLine>
        </div>
      </div>
    </PopOver>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ExStore } from 'vuex'
import { UserInfo } from '@/plugins/fireBaseHandler/'
import BtnOutLine from '@/components/BtnOutLine.vue'
import PopOver from '@/components/PopOver.vue'

export default Vue.extend({
  components: {
    BtnOutLine,
    PopOver
  },
  props: {
    path: {
      type: String,
      default: () => ''
    }
  },
  data: () => ({
    avaterShow: false
  }),
  computed: {
    user(): UserInfo | null {
      return (this.$store as ExStore).state.user.user
    },
    avater(): { backgroundImage: string } | void {
      if (!this.user) return
      return {
        backgroundImage: `url(${this.user.picture})`
      }
    }
  },
  methods: {
    signOut() {
      ;(this.$store as ExStore).dispatch('user/signOut')
      this.$router.push('/login')
    }
  }
})
</script>

<style lang="scss" scoped>
.avater {
  position: relative;
  &__btn {
    width: 32px;
    height: 32px;
    overflow: hidden;
    background-color: rgb(196, 196, 196);
    border-radius: 50%;
    background: rgb(196, 196, 196) no-repeat center/ cover;
  }
  &__dialog {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate3d(0, 100%, 0);
  }
}
.dialog {
  @extend %dialog-base;
  padding: 32px 26px 26px;
  text-align: center;
  background-color: #fff;
  min-width: 300px;
  &__avater {
    display: inline-block;
    width: 80px;
    height: 80px;
    background: rgb(196, 196, 196) no-repeat center/ cover;
    margin-bottom: 16px;
    border-radius: 50%;
  }
  &__name {
    font-weight: bold;
    font-size: 18px;
  }
  &__email {
    font-size: 14px;
  }
  &__btn {
    margin-top: 16px;
  }
}
</style>
