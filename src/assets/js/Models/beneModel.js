import {Polygon} from '@/assets/js/Models/multiPolygonModel'

// piccola scorciatoia
const exist = el => (typeof el !== 'undefined' &&
  typeof el === 'string' && el.trim() !== '') || typeof el === 'number'

// è una funzione perchè cosi è facilmente clonabile il modello
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
    esistenza: '',
    comune: '',
    bibliografia: '',
    schedatori_iniziali: '',
    note: '',
    polygon: new Polygon(),
    // Number() nel caso fosse una stringa
    isRev: function () { return exist(this.status) && Number(this.status) === 0 },
    isIncorrect: function () { return exist(this.status) && Number(this.status) === 1 },
    isReady: function () { return exist(this.status) && Number(this.status) === 2 },
    isIncomplete: function () { return exist(this.status) && Number(this.status) === 3 },
    setRev: function () { this.status = 0 },
    setIncorrect: function () { this.status = 1 },
    setReady: function () { this.status = 2 },
    setIncomplete: function () { this.status = 3 }
  }
}
