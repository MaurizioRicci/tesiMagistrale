// Per disabilitare gli interceptors globabali
// axiosInstance.get('/v2/api-endpoint', { handlerEnabled: false })
const isHandlerEnabled = (config = {}) => {
  // Sembra che handlerEnabled non passi poichè axios rimuove ciò che non conosce
  return !(config.hasOwnProperty('handlerEnabled') && !config.handlerEnabled)
}

// quando arriva la risposta
export const errorHandlerResponse = (error, vueApp) => {
  if (isHandlerEnabled(error.config)) {
    vueApp.$vueEventBus.$emit('master-page-show-error', ['Error', error])
  }
  if (isHandlerEnabled(error.config) && error.response) {
    // Handle errors
    if (error.response.status === 401) {
      vueApp.$vueEventBus.$emit('master-page-show-error', ['Error', 'Invalid credentials'])
    } else if (error.response.status === 503) {
      vueApp.$vueEventBus.$emit('master-page-show-error', ['Error', 'System offline'])
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
