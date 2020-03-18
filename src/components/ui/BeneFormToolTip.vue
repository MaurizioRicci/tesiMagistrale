<template>
 <div>
  <b-tooltip :target="prefix + 'checkbox-bozza'" triggers="hover">
    Specifica se il bene è una bozza o se è pronto per essere inviato (su
   richiesta dell'utente)
   </b-tooltip>
  <b-tooltip :target="prefix + 'input-id'" triggers="hover">
    ID del bene
  </b-tooltip>
  <b-tooltip :target="prefix + 'input-identificazione'" triggers="hover">
   Serve a identificare il Bene in modo che ogni schedatore sia in grado di
   riconoscerlo ed evitare così doppie acquisizioni.
  </b-tooltip>
  <b-tooltip :target="prefix + 'input-descrizione'" triggers="hover">
    Descrizione del bene
   </b-tooltip>
  <b-tooltip :target="prefix + 'input-macro-epoca-orig'" triggers="hover">
    Macro epoca originaria. Indica la presunta epoca di origine del
   Bene.
   </b-tooltip>
  <b-tooltip :target="prefix + 'input-macro-epoca-car'" triggers="hover">
    Macro epoca caratteristica. Indica la presunta epoca che più delle altre
   caratterizza il Bene.
   </b-tooltip>
  <b-tooltip :target="prefix + 'input-toponimo'" triggers="hover">
    Toponimo</b-tooltip>
  <b-tooltip :target="prefix + 'input-esistenza'" triggers="hover">
    Specifica lo stato del bene</b-tooltip>
  <b-tooltip :target="prefix + 'input-comune'" triggers="hover">
    Comune attuale di appartenenza</b-tooltip>
  <b-tooltip :target="prefix + 'input-bibliografia'" triggers="hover">
    Bibliografia</b-tooltip>
  <b-tooltip :target="prefix + 'input-note'" triggers="hover">
    Eventuali note</b-tooltip>
  <b-tooltip :target="prefix + 'input-geometria'" triggers="hover">
    Geometria del bene. Sono i vertici di un poligono</b-tooltip>
 </div>
</template>

<script>
// Aggiunge i tooltip con le spiegazioni sulle varie parti dei beni
// i vari attributi target sono id di elementi presenti nella pagina
export default {
  name: 'BeneFormTooltip',
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
