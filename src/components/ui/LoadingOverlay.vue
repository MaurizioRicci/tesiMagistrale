<template>
    <div class="myModal" :style="{display: dState}">
        <div class="d-flex h-100 justify-content-center align-items-center mb-3">
            <b-spinner variant="primary" label="Spinning"></b-spinner>
        </div>
    </div>
</template>

<script>
// Renderizza un overlay con un cursore che indica un caricamento
export default {
  name: 'LoadingOverlay',
  props: {
    // quando la prop è settata a true si apre
    open: Boolean
  },
  data () {
    return { dState: 'none' }
  },
  watch: {
    open: function (newVal) {
      this.dState = newVal ? 'block' : 'none'
    }
  },
  methods: {
    show () { this.dState = 'block' },
    hide () { this.dState = 'none' }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.myModal {
  position: fixed; /* Stay in place */
  z-index: 9999; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

.myModal >>> .spinner-border {
    width: 25vmin;
    height: 25vmin;
}
</style>
