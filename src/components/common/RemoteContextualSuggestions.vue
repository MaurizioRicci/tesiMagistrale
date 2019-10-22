<template>
    <span>
        <!-- Lo slot deve essere <my-autocomplete-input> -->
        <slot></slot>
    </span>
</template>

<script>
export default {
  name: 'RemoteContextualSuggestions',
  props: {
    waitTime: Number,
    suggestionsPromise: Function
  },
  mounted () {
    if (this.waitTime < 0) throw new Error('waitTime < 0')
    const T = this
    let inAttesa = false
    let input = this.$slots.default[0].componentInstance

    input.addEventListener('input', async function (e) {
      if (!inAttesa) {
        // aspetta waitTime prima di fare richiesta di suggerimenti
        await new Promise((resolve, reject) => {
          inAttesa = true
          setTimeout(() => {
            resolve(true)
          }, T.waitTime)
        }).then(async function (ok) {
          inAttesa = false
          // aggiorna valore
          await input.updateSuggestions(null, T.suggestionsPromise)
        })
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
