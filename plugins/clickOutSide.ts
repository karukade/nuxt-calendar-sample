import { DirectiveOptions } from 'vue'
import { DirectiveBinding } from 'vue/types/options'

interface ExBindings extends DirectiveBinding {
  value: {
    include?: [HTMLElement]
    callback: (e: Event) => any
  }
}

interface ExElement extends HTMLElement {
  _clickOutside: (e: Event) => any
}

const handler = (e: Event, el: HTMLElement, { value }: ExBindings) => {
  const elements = value.include || [el]
  if (value.include) elements.push(el)
  if (elements.some((elm) => elm?.contains(e.target as HTMLElement))) return
  value.callback(e)
}

export default {
  inserted(el, binding: ExBindings) {
    const onClick = (e: Event) => {
      handler(e, el, binding)
    }
    const app = document.body
    /*
      clickイベント以外で要素が追加された際bodyのイベントがトリガーされないように、
      要素が追加されるきっかけとなるイベントが完全にbubblingしたあとに
      bodyのclickイベントを追加する
    */
    setTimeout(() => app.addEventListener('click', onClick, true))
    ;(el as ExElement)._clickOutside = onClick
  },

  unbind(el) {
    const _el = el as ExElement
    if (!_el._clickOutside) return

    const app = document.body
    app && app.removeEventListener('click', _el._clickOutside, true)
    delete _el._clickOutside
  }
} as DirectiveOptions
