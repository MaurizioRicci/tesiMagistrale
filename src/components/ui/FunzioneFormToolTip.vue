<template>
<!-- aggiunge i tooltip con le spiegazioni sulle varie parti delle funzioni
i vari attributi target sono id di elementi presenti nella pagina -->
    <div>
        <b-tooltip :target="prefix+'checkbox-bozza'" triggers="hover">Specifica se il bene è una bozza o se è pronto per essere inviato (su richiesta dell'utente)</b-tooltip>
        <b-tooltip :target="prefix+'input-id_bene'" triggers="hover">ID del bene</b-tooltip>
        <b-tooltip :target="prefix+'input-id_bener'" triggers="hover">ID del bene di riferimento</b-tooltip>
        <b-tooltip :target="prefix+'input-denominazione'" triggers="hover">Identificazione del bene</b-tooltip>
        <b-tooltip :target="prefix+'input-denominazioner'" triggers="hover">Identificazione del bene di riferimento</b-tooltip>
        <b-tooltip :target="prefix+'input-data'" triggers="hover">Data della funzione</b-tooltip>
        <b-tooltip :target="prefix+'input-tipodata'" triggers="hover">Tipo data della funzione</b-tooltip>
        <b-tooltip :target="prefix+'input-funzione'" triggers="hover">Funzione che lega due beni</b-tooltip>
        <b-tooltip :target="prefix+'input-bibliografia'" triggers="hover">Bibliografia</b-tooltip>
        <b-tooltip :target="prefix+'input-note'" triggers="hover">Eventuali note</b-tooltip>
    </div>
</template>

<script>
export default {
  name: 'FunzioneFormTooltip',
  props: {prefix: {type: String, default: ''}}
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
