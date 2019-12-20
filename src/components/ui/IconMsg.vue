<template>
  <span v-b-tooltip.hover="icon_msg" @click="$emit('click')">
    <font-awesome-icon :icon="['fas', icon_name]" :size="icon_size"
      :style="{ color: icon_color }"/>
  </span>
</template>

<script>
export default {
  name: 'IconMsg',
  props: {
    icon_name: String,
    icon_msg: String,
    icon_color: {type: String, default: 'royalblue'},
    icon_size: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
