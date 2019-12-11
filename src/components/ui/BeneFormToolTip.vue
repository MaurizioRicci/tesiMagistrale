<template functional>
<!-- aggiunge i tooltip con le spiegazioni sulle varie parti dei beni
i vari attributi target sono id di elementi presenti nella pagina -->
    <div>
        <b-tooltip target="checkbox-bozza" triggers="hover">Specifica se il bene è una bozza o se è pronto per essere inviato (su richiesta dell'utente)</b-tooltip>
        <b-tooltip target="input-id" triggers="hover">ID del bene</b-tooltip>
        <b-tooltip target="input-identificazione" triggers="hover">Identificazione del bene</b-tooltip>
        <b-tooltip target="input-descrizione" triggers="hover">Descrizione del bene</b-tooltip>
        <b-tooltip target="input-macro-epoca-orig" triggers="hover">Macro epoca originaria</b-tooltip>
        <b-tooltip target="input-macro-epoca-car" triggers="hover">Macro epoca caratteristica</b-tooltip>
        <b-tooltip target="input-toponimo" triggers="hover">Toponimo</b-tooltip>
        <b-tooltip target="input-esistenza" triggers="hover">Specifica lo stato del bene</b-tooltip>
        <b-tooltip target="input-comune" triggers="hover">Comune attuale di appartenenza</b-tooltip>
        <b-tooltip target="input-bibliografia" triggers="hover">Bibliografia</b-tooltip>
        <b-tooltip target="input-note" triggers="hover">Eventuali note</b-tooltip>
        <b-tooltip target="input-geometria" triggers="hover">Geometria del bene. Sono i vertici di un poligono</b-tooltip>
    </div>
</template>

<style>
/* Workaround per portare l'input sopra il bottone a forma di switch */
  #checkbox-bozza {
    position: relative;
    z-index: 1;
    right: 20px;
    width: 25px;
  }
</style>
