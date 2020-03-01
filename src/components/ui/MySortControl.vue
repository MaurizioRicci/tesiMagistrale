<template>
    <font-awesome-icon v-if="props.sortable" :icon="icon" class="fa-pull-right"/>
</template>

<script>
// Componente per Vue Tables 2 che gestisce le icone per l'ordinamento delle colonne
export default {
  name: 'VtSortControl',
  props: ['props'],
  computed: {
    icon () {
      // sortStatus = { sorted: Boolean, asc: Boolean }
      // if not sorted return base icon
      if (!this.props.sortStatus.sorted) return 'sort'
      // return sort direction icon
      return this.props.sortStatus.asc ? 'sort-up' : 'sort-down'
    }
  }
}
</script>
