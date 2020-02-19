import debounceF from '@/assets/js/asyncDebounceFunction'

const autoResize = el => {
  // fonte https://codepen.io/vsync/pen/czgrf
  el.style.cssText = 'height:auto;'
  // for box-sizing other than "content-box" use:
  // el.style.cssText = '-moz-box-sizing:content-box';
  if (el.scrollHeight > 0) { el.style.cssText = 'height:' + el.scrollHeight + 'px' }
}

export default {
  // imposta l'altezza di una text area in base al contenuto
  bind: function (el, binding, vnode) {
    el.setAttribute('rows', '1')
    if (el.textContent !== '') { autoResize(el) }
  },
  componentUpdated: function (el, binding, vnode) {
    // sembra che ci passi più volte a ogni aggiornamento, quindi aspetto 100ms
    // prima di eseguire auto resize
    debounceF(() => autoResize(el), 100)()
  }
}
