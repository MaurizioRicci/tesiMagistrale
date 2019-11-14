import {Polygon} from '@/assets/js/Models/multiPolygonModel'

export default () => {
  return {
    bozza: false,
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
