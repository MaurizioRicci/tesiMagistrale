export default {
  update: function (el, binding, vnode) {
    let str = binding.value === true ? '' : 'Invalid feedback'
    el.setCustomValidity(str)
  }
}
