import {Polygon} from '@/assets/js/multiPolygonModel'

export default () => {
  return {
    id: '',
    identificazione: '',
    descrizione: '',
    macroEpocaOrig: '',
    macroEpocaCar: '',
    toponimo: '',
    esitenza: '',
    comune: '',
    bibliografia: '',
    schedatori_iniziali: '',
    note: '',
    polygon: new Polygon()
  }
}
