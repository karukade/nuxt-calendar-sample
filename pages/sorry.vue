<template>
  <div>
    <h1>
      たくさん試してくれてありがとうございます。<br />
      <span
        >ひとりあたりの読み書き上限をオーバーしてしまいました。<br />
        FireBaseのフリープランを利用しているのでこうするしかないのです。<br />
        もしまだ興味があれば明日にはリセットされているので、明日試してみてください。</span
      >
    </h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  middleware: ['auth'],
  layout: 'login'
})
</script>

<style lang="scss" scoped>
span {
  display: inline-block;
  margin-top: 20px;
  font-size: 18px;
}
</style>
