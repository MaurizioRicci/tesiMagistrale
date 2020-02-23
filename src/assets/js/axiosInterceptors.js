/* eslint-disable no-unused-vars */
// Per disabilitare gli interceptors globabali
// axiosInstance.get('/v2/api-endpoint', { handlerEnabled: false })
const isHandlerEnabled = (config = {}) => {
  return !(config.hasOwnProperty('handlerEnabled') && !config.handlerEnabled)
}

// quando arriva la risposta
export const errorHandlerResponse = (error, vueApp) => {
  // se gli interceptors globali sono attivi
  if (isHandlerEnabled(error.config)) {
    // Handle errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          vueApp.$vueEventBus.$emit('master-page-show-msg', ['Errore', 'Credenziali invalide'])
          break
        case 422:
          vueApp.$vueEventBus.$emit('master-page-show-msg', ['Errore',
            'Richiesta non processabile dal server.'])
          break
        case 503:
          vueApp.$vueEventBus.$emit('master-page-show-msg', ['Errore',
            'Il sistema è offline, si prega di riprovare più tardi.'])
          break
        default:
          vueApp.$vueEventBus.$emit('master-page-show-msg', ['Errore', error])
      }
    } else vueApp.$vueEventBus.$emit('master-page-show-msg', ['Errore', error])
  }
  return Promise.reject(error)
}

export const successHandlerResponse = (response, vueApp) => {
  if (isHandlerEnabled(response.config)) {
    // Handle responses
  }
  return response
}
