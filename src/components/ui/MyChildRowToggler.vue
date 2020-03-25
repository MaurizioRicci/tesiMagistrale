<template>
    <td :tabindex="props.tabIndex" @keypress.enter="props.toggle" @click="props.toggle">
        <span :class="`VueTables__child-row-toggler ${props.class()}`"
          title="Click per maggiori dettagli"></span>
    </td>
</template>

<script>
// Componente Child Row Toggler per Vue tables 2
export default {
  name: 'MyChildRowToggler',
  props: ['props']
}
</script>
