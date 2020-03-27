<template>
 <div>
  <b-tooltip :target="prefix + 'checkbox-bozza'" triggers="hover"
   >Specifica se il bene è una bozza o se è pronto per essere inviato (su
   richiesta dell'utente)</b-tooltip>
  <b-tooltip :target="prefix + 'input-id_bene'" triggers="hover"
   >ID del bene</b-tooltip>
  <b-tooltip :target="prefix + 'input-id_bener'" triggers="hover"
   >ID del bene di riferimento</b-tooltip>
  <b-tooltip :target="prefix + 'input-denominazione'" triggers="hover"
   >Identificazione del bene. Riporta il nome con cui il Bene è citato nel
   documento.</b-tooltip>
  <b-tooltip :target="prefix + 'input-denominazioner'" triggers="hover"
   >Identificazione del bene di riferimento. Riporta il nome con cui il Bene di
   riferimento è citato nel documento.</b-tooltip>
  <b-tooltip :target="prefix + 'input-data'" triggers="hover"
   >Data della funzione</b-tooltip>
  <b-tooltip :target="prefix + 'input-data_ante'" triggers="hover"
   >Primo estremo della data della funzione</b-tooltip>
  <b-tooltip :target="prefix + 'input-data_post'" triggers="hover"
   >Secondo estremo della data della funzione</b-tooltip>
  <b-tooltip :target="prefix + 'input-tipodata'" triggers="hover">
   <span>Tipo data della funzione può assumere i seguenti valori.</span>
   <ul class="text-left">
    <li>Campo vuoto: non si sa niente circa la validità della relazione al di fuori dell'intervallo specificato</li>
    <li>Niente prima: la relazione vale dalla data specificata in poi</li>
    <li>Niente dopo: la relazione è valida fino ala data specificata</li>
    <li>Niente prima e dopo: la relazione vale solo in quel preciso periodo</li>
   </ul>
   <span
    >Se il campo viene lasciato vuoto si assume che non si conosca nulla circa
    la validità delle informazioni fuori dall’intervallo temporale
    specificato.</span>
  </b-tooltip>
  <b-tooltip :target="prefix + 'input-funzione'" triggers="hover"
   >Funzione che lega uno o due beni</b-tooltip>
  <b-tooltip :target="prefix + 'input-bibliografia'" triggers="hover"
   >Bibliografia</b-tooltip>
  <b-tooltip :target="prefix + 'input-note'" triggers="hover"
   >Eventuali note</b-tooltip>
  <b-tooltip :target="prefix + 'input-ruolo'" triggers="hover"
   >Ruolo del bene nella funzione/relazione</b-tooltip>
  <b-tooltip :target="prefix + 'input-ruolor'" triggers="hover"
   >Ruolo del bene di riferimento nella funzione/relazione</b-tooltip>
 </div>
</template>

<script>
// Aggiunge i tooltip con le spiegazioni sulle varie parti delle funzioni
// i vari attributi target sono id di elementi presenti nella pagina
export default {
  name: 'FunzioneFormTooltip',
  props: { prefix: { type: String, default: '' } }
}
</script>

<style>
/* Workaround per portare l'input sopra il bottone a forma di switch */
  #checkbox-bozza {
    position: relative;
    z-index: 1;
    right: 20px;
    width: 25px;
  }
</style>
