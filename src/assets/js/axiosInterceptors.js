// Per disabilitare gli interceptors globabali
// axiosInstance.get('/v2/api-endpoint', { handlerEnabled: false })
const isHandlerEnabled = (config = {}) => {
  // Sembra che handlerEnabled non passi poichè axios rimuove ciò che non conosce
  return !(config.hasOwnProperty('handlerEnabled') && !config.handlerEnabled)
}

// quando arriva la risposta
export const errorHandlerResponse = (error, vueApp) => {
  if (isHandlerEnabled(error.config) && error.response) {
    // Handle errors
    switch (error.response.status) {
      case 401:
        vueApp.$vueEventBus.$emit('master-page-show-msg', ['Error', 'Invalid credentials'])
        break
      case 503:
        vueApp.$vueEventBus.$emit('master-page-show-msg', ['Error',
          'Il sistema è offline, si prega di riprovare più tardi.'])
        break
      default:
        vueApp.$vueEventBus.$emit('master-page-show-msg', ['Error', error])
    }
  }
  return Promise.reject(error)
}

export const successHandlerResponse = (response, vueApp) => {
  if (isHandlerEnabled(response.config)) {
    // Handle responses
  }
  return response
}
