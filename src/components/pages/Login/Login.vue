<template>
  <b-container fluid>
    <b-navbar toggleable="lg" type="dark" variant="info" class="mb-1">
      <b-navbar-brand>Beni Lunigiana</b-navbar-brand>
    </b-navbar>
    <b-row>
      <b-col>
        <h2>Login</h2>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="12">
        <h5>
          <a :href="shapeFileURL">Scarica i dati per QGIS</a>
        </h5>
      </b-col>
      <b-col cols="8" md="5" lg="4">
        <b-alert :show="showError" variant="danger">{{errorMsg}}</b-alert>
        <b-form @submit="onSubmit" @reset="onReset">
          <b-form-group id="input-group-1" label="Username:" label-for="input-username" label-cols="3">
            <b-form-input id="input-username" v-model="formData.username" type="text"
              required placeholder="" class="col-9 col-xl-8"></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-1" label="Password:" label-for="input-password" label-cols="3">
            <b-form-input
              class="col-9 col-xl-8"
              id="input-password"
              v-model="formData.password"
              type="password"
              required
              placeholder=""
              ></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
          <!-- si passa sempre dal login lato server a ogni lancio dell'applicazione -->
          <b-form-checkbox v-if="true"
            id="checkbox-1"
            v-model="rememberMe"
            name="checkbox-1">
            Remember me
          </b-form-checkbox>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import qs from 'qs'
import axios from 'axios'

// @group Pages
export default {
  name: 'LoginPage',
  data () {
    return {
      errorMsg: '',
      formData: this.getUserModel(),
      rememberMe: false,
      // previus page wich linked to login page
      prevPagePath: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // access to component instance via `vm`
      // controllo che from non sia uguale alla route corrente
      // controllo che from sia una pagina esistente => loop altrimenti
      // se from==to utente ha navigato direttamente a /login => si manda alla home
      // altrimenti sarebbe andato alla pagina precedente al login
      vm.prevPagePath = from.path === to.path || from.name === 'PageNotFound' ? '/home' : from
      // l'utente va sempre alla home
      vm.prevPagePath = '/home'
    })
  },
  computed: {
    showError () {
      return this.errorMsg.trim() !== ''
    },
    shapeFileURL () {
      return this.$store.getters.shapeFileURL
    }
  },
  methods: {
    getUserModel () {
      return {
        username: '',
        password: ''
      }
    },
    onReset (evt) {
      evt.preventDefault()
      this.formData = this.getUserModel()
    },
    onSubmit (evt) {
      evt.preventDefault()
      axios.post(this.$store.getters.loginURL, qs.stringify(this.formData))
        .then(function (resp) {
          // acquisisco ruolo & id
          this.formData.role = resp.data.role
          this.formData.id = resp.data.id
          // inserisco tutti i dati utente dentro options (per i tre puntini cerca online spread operator)
          let options = { ...this.formData }
          // se c'è il flag salviamo un cookie con username e password
          options.rememberUser = this.rememberMe
          this.$store.commit('registerUser', options)
          this.$router.push(this.prevPagePath)
        }.bind(this))
    }
  },
  mounted () {
    // recupero username & password se esistenti, sennò tutto stringa vuota
    this.formData = this.$store.getters.getUserData
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
