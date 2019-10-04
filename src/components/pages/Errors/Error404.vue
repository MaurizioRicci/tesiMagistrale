<template>
    <b-jumbotron header="Page not found" lead="Sorry, the page can't be found"
    fluid container-fluid>
        <p>Go to home page</p>
        <b-button @click="$router.push('/')" variant="primary" size="lg">Home</b-button>
    </b-jumbotron>
</template>

<script>
export default {
  name: 'Error404'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
