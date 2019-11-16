import {Polygon} from '@/assets/js/Models/multiPolygonModel'

export default () => {
  return {
    id: '',
    id_utente: '', // se è in archivio tmp id&id_utente sono una Primary Key per il bene
    // status del bene: 0 se in revisione, 1 se necessita correzioni,2=in attesa invio,3=incompleto
    status: 2,
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
