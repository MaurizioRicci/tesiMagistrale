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
            name="checkbox-1"
            value="si"
            unchecked-value="no"
            >
            Remember me
          </b-form-checkbox>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { setCookie, getCookie, existCookie, deleteCookie } from '@/assets/js/cookie'
import qs from 'qs'
import axios from 'axios'

// @group Pages
export default {
  name: 'LoginPage',
  data () {
    return {
      errorMsg: '',
      formData: this.getUserModel(),
      rememberMe: 'no',
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
      axios.post(this.$store.getters.loginURL, qs.stringify(this.formData), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      })
        .then(function (resp) {
          // in ogni caso elimino il vecchio cookie (se presente)
          deleteCookie('userData')
          this.formData.role = resp.data.role
          this.formData.id = resp.data.id
          // se c'è il flag salviamo un cookie con username e password
          if (this.rememberMe === 'si') {
            // imposto un cookie di 6 mesi circa
            setCookie('userData', JSON.stringify(this.formData), 31 * 6)
          }
          this.$store.commit('registerUser', this.formData)
          this.$router.push(this.prevPagePath)
        }.bind(this))
        .catch(function (error) {
          this.errorMsg = (error.response && error.response.data.msg) || error.message
        }.bind(this))
    }
  },
  mounted () {
    // setto username e password vuoti
    this.formData = this.getUserModel()
    // controllo se è stato lasciato un cookie con username e password
    if (existCookie('userData')) {
      this.formData = JSON.parse(getCookie('userData'))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
