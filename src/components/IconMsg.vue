<template>
  <span v-b-popover.hover="icon_msg">
    <unicon :name="icon_name" fill="royalblue" />
  </span>
</template>

<script>
export default {
  name: 'IconMsg',
  props: {
    icon_name: String,
    icon_msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
