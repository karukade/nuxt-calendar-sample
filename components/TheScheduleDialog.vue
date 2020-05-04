<template>
  <div class="shcedule-dialog" role="dialog">
    <div class="shcedule-dialog__header">
      <button
        class="shcedule-dialog__close"
        aria-label="閉じる"
        @click="$emit('close')"
      >
        <i class="material-icons">close</i>
      </button>
    </div>
    <div class="shcedule-dialog__body">
      <TextField
        v-model="schedule.info.title"
        placeholder="タイトルを入力"
        border-type="underline"
        :on-apper-focus="titleFocus"
        size="l"
      />
      <DateRangeInput
        :from.sync="schedule.from"
        :to.sync="schedule.to"
        :hours.sync="schedule.info.hours"
      />
      <TextField
        v-model="schedule.info.guest"
        border-type="noline"
        placeholder="ゲストを追加"
        icon="person_outline"
      />
      <TextField
        v-model="schedule.info.location"
        border-type="noline"
        placeholder="場所を追加"
        icon="place"
      />
      <TextField
        v-model="schedule.info.detail"
        border-type="noline"
        placeholder="詳細を追加"
        icon="subject"
      />
      <ColorPicker v-model="schedule.info.color" />
      <div class="shcedule-dialog__btn-row">
        <button class="btn-cancel" @click="$emit('close')">
          キャンセル
        </button>
        <button class="btn" @click="onSave">
          {{ btnText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import cloneDeep from 'lodash/cloneDeep.js'

// components
import TextField from '@/components/TextField.vue'
import DateRangeInput from '@/components/DateRangeInput.vue'
import ColorPicker from '@/components/ColorPicker.vue'

// types
import { Schedule, DateInfo, ScheduleInfo } from '@/plugins/schedule'

type DataType = {
  schedule: Schedule
  titleFocus: boolean
}

export default Vue.extend({
  components: {
    TextField,
    DateRangeInput,
    ColorPicker
  },
  props: {
    baseSchedule: {
      type: Object as PropType<Schedule>,
      required: true
    }
  },
  data: (): DataType => ({
    // todo: 初期値をpropから受け取りたいがこの段階ではpropが初期化されずudefinedとなってしまう、、、どうしたらいいのか。現状createdで初期化している
    schedule: {
      from: {} as DateInfo,
      to: {} as DateInfo,
      info: {} as ScheduleInfo
    },
    titleFocus: false
  }),
  computed: {
    btnText(): string {
      return this.schedule.info.id ? '更新する' : '保存する'
    }
  },
  created() {
    this.schedule.from = { ...this.baseSchedule.from }
    this.schedule.to = { ...this.baseSchedule.to }
    this.schedule.info = { ...this.baseSchedule.info }
  },
  mounted() {
    setTimeout(() => (this.titleFocus = true), 100)
  },
  methods: {
    onSave() {
      const cloned = cloneDeep(this.schedule)
      const action = cloned.info.id ? 'update' : 'save'
      cloned.info.from = { ...cloned.from }
      cloned.info.to = { ...cloned.to }
      this.$emit(action, cloned)
    }
  }
})
</script>

<style lang="scss" scoped>
.shcedule-dialog {
  &__header-txt {
    font-size: 1.6rem;
    font-weight: bold;
  }
  &__close {
    font-size: 12px;
    color: $base-color;
    position: absolute;
    top: 10px;
    right: 10px;
  }
  &__body {
    padding: 35px 24px 24px;
    > * + * {
      margin-top: 14px;
    }
  }
  &__btn-row {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    > * + * {
      margin-left: 14px;
    }
  }
}

%btn-base {
  min-width: 113px;
  font-size: 1.5rem;
  text-align: center;
  padding: 12px 10px 10px;
}

.btn {
  border-radius: 4px;
  color: #fff;
  background: $primary-color;
  @extend %btn-base;
  @include bgHover($primary-color-l);
  &-cancel {
    @extend %btn-base;
    color: $d-gray;
  }
}
</style>
