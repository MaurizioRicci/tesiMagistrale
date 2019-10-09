<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <h2>Login</h2>
      </b-col>
    </b-row>
        <b-row align-h="center">
      <b-col cols="6">
        <b-alert :show="showError" variant="danger">{{errorMsg}}</b-alert>
        <b-form @submit="onSubmit" @reset="onReset">
          <b-form-group id="input-group-1" label="Username:" label-for="input-username" label-cols="2">
            <b-col cols="12">
              <b-form-input id="input-username" v-model="formData.username" type="text" required placeholder=""></b-form-input>
            </b-col>
          </b-form-group>
          <b-form-group id="input-group-1" label="Password:" label-for="input-password" label-cols="2">
            <b-col cols="12">
              <b-form-input
                id="input-password"
                v-model="formData.password"
                type="password"
                required
                placeholder=""
              ></b-form-input>
            </b-col>
          </b-form-group>
            <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
          <b-form-checkbox
            id="checkbox-1"
            v-model="rememberMe"
            name="checkbox-1"
            value="true"
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
import { setCookie, getCookie, existCookie } from '@/assets/js/cookie'
const qs = require('qs')
const axios = require('axios')

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
  computed: {
    showError () {
      return this.errorMsg.trim() !== ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
    // access to component instance via `vm`
    // controllo che from non sia uguale alla route corrente
      vm.prevPagePath = from === this.$route.path ? 'bene' : from
    })
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
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      })
        .then(function (resp) {
          // se c'è il flag salviamo un cookie con username e password
          if (this.rememberMe !== 'no') {
            setCookie('userData', JSON.stringify(this.formData), 2)
          }
          this.formData.role = resp.data.role
          this.$store.commit('registerUser', this.formData)
          this.$router.push(this.prevPagePath.path)
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
