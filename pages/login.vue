<template>
  <div class="login">
    <div class="login__main">
      <div class="login__main-inner">
        <header class="login__header">
          <div class="login__logo">
            <img src="@/assets/img/logo.svg" alt="ロゴ" />
          </div>
          <p class="login__desc">
            カレンダーアプリのサンプルをつくりました。<br />
            ソーシャルログインは気が引けるという方はテストアカウントで試すことができます。
          </p>
        </header>
        <div class="login__btn-list">
          <button
            v-for="(provider, i) in providers"
            :key="i"
            class="login__btn"
            @click="onClick(provider)"
          >
            <span class="login__btn-logo"><SocialIcons :name="provider"/></span>
            <span class="login__btn-txt">
              <template v-if="provider === 'TestUser'">
                テスト<br />アカウント
              </template>
              <template v-else>
                {{ provider }}
              </template>
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="login__side">
      <div class="login__side-inner">
        <header class="login__side-header">
          <span class="login__side-today">{{ today }}</span>
          <h2 class="login__side-ttl">今日は何の日</h2>
        </header>
        <transition name="login__side-content">
          <ul
            v-if="wikiHtml"
            class="login__side-content"
            v-html="wikiHtml"
          ></ul>
          <Spinner v-else class="login__wiki-spinner" stroke="#fff" />
        </transition>
      </div>
    </div>
    <transition name="login__testuser-loader">
      <div v-if="testUserLoading" class="login__testuser-loader">
        <Spinner class="login__testuser-spinner" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import Vue from 'vue'
import SocialIcons from '@/components/SocialIcons'
import Spinner from '@/components/Spinner.vue'
import { signIn, ProvidersName } from '@/plugins/fireBaseHandler/'

type DataType = {
  providers: ProvidersName[]
  wikiHtml: null | string
  testUserLoading: boolean
}

export default Vue.extend({
  middleware: ['auth'],
  components: {
    SocialIcons,
    Spinner
  },
  layout: 'login',
  data: (): DataType => ({
    providers: ['Google', 'Facebook', 'Github', 'TestUser'],
    wikiHtml: null,
    testUserLoading: false
  }),
  computed: {
    today(): string {
      return moment().format('M月D日(ddd)')
    }
  },
  async created() {
    this.wikiHtml = await this.getWikiToday()
  },
  methods: {
    async onClick(provider: ProvidersName) {
      if (provider === 'TestUser') this.testUserLoading = true
      await signIn(provider)
      if (provider === 'TestUser') this.testUserLoading = false
      this.$router.push('/')
    },
    async getWikiToday() {
      const { data } = await this.$axios({
        baseURL: 'https://ja.wikipedia.org',
        url: '/w/api.php',
        params: {
          format: 'json',
          action: 'parse',
          page: 'Wikipedia:今日は何の日',
          origin: '*'
        }
      })
      const parsed = this.parseWikiHtml(data.parse.text['*'])
      return parsed
        ? parsed.replace(
            /(href=")([^"]+)"/g,
            '$1https://ja.wikipedia.org$2" target="_blank"'
          )
        : parsed
    },
    parseWikiHtml(rowHtml: string): string | null {
      const mathced = rowHtml
        .replace(/\n/g, '')
        .match(
          /<div style="border-width:1px;border-style:solid;padding:0.5em 1em; float:center"><ul>(.+)<\/ul><\/div>/
        )
      return mathced ? mathced[1] : null
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  width: 100%;
  &__main {
    width: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 102px;
    padding-right: 102px;
  }
  &__desc {
    margin-top: 36px;
    margin-bottom: 36px;
    color: $base-color;
    line-height: 2;
    font-weight: bold;
  }
  &__side {
    width: 40%;
    padding-top: 60px;
    padding-left: 20px;
    padding-right: 20px;
    background: linear-gradient(90deg, #34c4a1 0%, #31ded3 100%);
    position: relative;
    overflow: auto;
  }
  &__wiki-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
  &__logo {
    margin-bottom: 36px;
  }
  &__btn-list {
    display: flex;
    > * + * {
      margin-left: 22px;
    }
  }
  &__btn {
    padding: 10px;
    width: 115px;
    min-height: 115px;
    border: 2px solid #f0f0f0;
    border-radius: 10px;
    text-align: center;
    font-size: 13px;
    font-weight: bold;
    display: flex;
    align-items: center;
    flex-direction: column;
    @include bgHover(darken(#fff, 3%));
  }
  &__btn-logo {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__btn-txt {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__side-header {
    color: #ffffff;
    text-align: center;
    margin-bottom: 30px;
  }
  &__side-ttl {
    font-size: 30px;
    letter-spacing: 0.05em;
    font-weight: normal;
  }
  &__testuser-loader {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    &-enter-active,
    &-leave-active {
      transition: opacity 0.2s cubic-bezier(0.34, 0, 1, 0.98);
    }
    &-enter,
    &-leave-to {
      opacity: 0;
    }
  }
  &__side-content {
    list-style: none;
    /deep/ li {
      margin-top: 16px;
      color: #247d69;
      a {
        color: #1a594b;
        font-weight: bold;
      }
    }
    &-enter-active,
    &-leave-active {
      transition: opacity 0.2s cubic-bezier(0.34, 0, 1, 0.98);
    }
    &-enter,
    &-leave-to {
      opacity: 0;
    }
  }
}
</style>
