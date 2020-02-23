<template>
    <span>
        <!-- Lo slot deve essere <my-autocomplete-input> -->
        <slot></slot>
    </span>
</template>

<script>
// Si interpone tra l'utente e my-autocomplete-input. Serve far aspettare un tempo
// waitTime prima di caricare i suggerimenti di my-autocomplete-input
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
