export default {
  // imposta la validità su un certo elemento in base a un booleano
  update: function (el, binding, vnode) {
    let str = binding.value ? '' : 'Invalid feedback'
    el.setCustomValidity(str)
  }
}
