<template>
    <span>
        <!-- Lo slot deve essere <my-autocomplete-input> -->
        <slot></slot>
    </span>
</template>

<script>
import debounce from '@/assets/js/asyncDebounceFunction'

export default {
  name: 'RemoteContextualSuggestions',
  props: {
    waitTime: Number,
    suggestionsPromise: Function
  },
  mounted () {
    if (this.waitTime < 0) throw new Error('waitTime < 0')
    const T = this
    let input = this.$slots.default[0].componentInstance

    input.addEventListener('input', debounce(async function () {
      await input.updateSuggestions(null, T.suggestionsPromise)
    }, T.waitTime))
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
