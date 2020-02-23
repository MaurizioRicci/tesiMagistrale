<template>
    <b-popover
      :target="target"
      triggers="hover"
      :show.sync="popoverShow">

      <template v-slot:title>
        <span class="pr-2" style="vertical-align: middle;">
          Formato date supportate
        </span>
        <b-button @click="close" class="close" aria-label="Close" title="Chiudi">
          <span aria-hidden="true">&times;</span>
        </b-button>
      </template>

    <b-list-group>
      <b-list-group-item>1500</b-list-group-item>
      <b-list-group-item>XV inizio</b-list-group-item>
      <b-list-group-item>XV metà</b-list-group-item>
      <b-list-group-item>XV prima metà</b-list-group-item>
      <b-list-group-item>XV seconda metà</b-list-group-item>
      <b-list-group-item>XV fine</b-list-group-item>
    </b-list-group>

    </b-popover>
</template>

<script>
// Mostra una finestra con il formato supportato per scrivere date.
export default {
  name: 'HelpDate',
  props: {
    target: { type: String }
  },
  data () {
    return {
      popoverShow: false
    }
  },
  // @vuese
  // chiude la finestra
  methods: {
    close () {
      this.popoverShow = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* >>> .popover-header {
  padding: .3rem;
}
</style>
