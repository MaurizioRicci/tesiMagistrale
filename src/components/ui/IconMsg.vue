<template>
  <span v-b-tooltip.hover="icon_msg" @click="$emit('click')">
    <font-awesome-icon :icon="['fas', icon_name]"
      :style="{ color: 'royalblue' }"/>
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
