import getModelloFunzione from '@/assets/js/Models/funzioneModel'
import lodashclonedeep from 'lodash.clonedeep'
const axios = require('axios')
const qs = require('qs')

export default function fetchFunzione (This, URLdata) {
  let URL = This.$store.getters.dettagliFunzioneURL
  let data = { form: getModelloFunzione(),
    formRetrived: getModelloFunzione(),
    mapCenter: This.$store.getters.getDefaultMapCenter }
  return axios.post(URL, qs.stringify(URLdata))
    .then(ok => {
      if (ok.data.length <= 0) {
        return null
        // this.$vueEventBus.$emit('master-page-show-msg', ['Info', 'No result found'])
      } else {
        let centroid = ok.data.centroid
        if (centroid) {
          data.mapCenter = centroid.coordinates
          // geoJSON usa [longitude, latitude] mentre leaflet usa [latitude, longitude]
          // occorre fare lo scambio
          data.mapCenter = [data.mapCenter[1], data.mapCenter[0]]
        }
        for (let k in data.form) {
          if (typeof ok.data[k] !== 'undefined' &&
                ok.data[k] !== '') {
            data.form[k] = ok.data[k]
          }
        }
        // i due ruoli sono in JSON devo parsarli
        data.form.ruolo = ok.data.ruolo ? JSON.parse(ok.data.ruolo) : data.form.ruolo
        // se non ci sono ruoli il primo vale stringa vuota
        // serve per Vue per mostrare il campo dove scrivere
        data.form.ruolo = data.form.ruolo.length === 0 ? [''] : data.form.ruolo
        data.form.ruolor = ok.data.ruolor ? JSON.parse(ok.data.ruolor) : data.form.ruolor
        data.form.ruolor = data.form.ruolor.length === 0 ? [''] : data.form.ruolor
        // faccio una deep copy dei valori resi dal server
        // salvo cosi due copie: originale e versione modificabile da utente
        data.formRetrived = lodashclonedeep(data.form)
        return data
      }
    })
}
