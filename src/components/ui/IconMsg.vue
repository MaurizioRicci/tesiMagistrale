<template>
  <span v-b-tooltip.hover="icon_msg" @click="$emit('click')">
    <font-awesome-icon :icon="['fas', icon_name]" :size="icon_size"
      :style="{ color: icon_color }"/>
  </span>
</template>

<script>
// Mostra una icona di Vue FontAwesome con un tooltip al mouse hover.
export default {
  name: 'IconMsg',
  props: {
    // il nome dell'icon di FontAwesome da mostrare
    icon_name: {type: String, required: true},
    // un testo per un eventuale tooltip per l'icona
    icon_msg: String,
    // un colore (opzionale) per l'icona
    icon_color: {type: String, default: 'royalblue'},
    // regola la grandezza dell'icona. I valori ammessi sono quelli di Font Awesome
    icon_size: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
