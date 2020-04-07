<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" v-if="!noMenu">
        <Menu/>
      </b-col>
      <b-col>
        <h2 v-if="!noTitle">{{title || 'Aiuto'}}</h2>
      </b-col>
    </b-row>
    <b-row>
    <b-col>
      <b-tabs pills card align="center">
        <!-- aiuto beni -->
        <b-tab title="Beni" active>
          <b-row>
            <!-- d-flex perchè con flexbox hanno la stessa altezza tutti -->
            <b-col cols="12" md="6" xl class="d-flex">
              <b-card title="Aggiungi bene" tag="article" class="mb-2">
               In questa pagina è possibile aggiungere un bene. Tale entità potrà
               essere collegata a un'altra per mezzo di una funzione (a tal proposito vedi aiuto funzioni).
               Il bene aggiunto deve essere prima approvato da un revisore. Nel caso un revisore aggiunga un bene, esso
               verrà aggiunto subito alla lista dei beni comuni a tutti gli utenti (detti beni definitivi).
                <div slot="footer"><b-button to="/bene/aggiungi" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
            <b-col cols="12" md="6" xl class="d-flex">
              <b-card title="Visualizza un bene" tag="article" class="mb-2">
              Questa pagina permette di visualizzare un bene specifico dato un identificativo (un numero intero detto ID).
                <div slot="footer"><b-button to="/bene/dettagli_bene" variant="primary" class="">Visita pagina</b-button></div>
              </b-card>
            </b-col>
            <b-col cols="12" md="6" xl class="d-flex">
              <b-card title="Ricerca un bene" tag="article" class="mb-2">
                Puoi ricercare, visualizzare e modificare un bene approvato per mezzo di questa pagina. Utilizza i filtri della tabella per ricercare.
                Nella tabella premendo il pulsante + è possibile anche aprire la mappa e vedere l'ubicazione del bene.
                <div slot="footer"><b-button to="/bene/ricerca" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
        <!-- aiuto Funzioni -->
        <b-tab title="Funzioni">
            <b-row align-h="center">
            <b-col cols="12" md="6" xl class="d-flex">
              <b-card title="Aggiungi una funzione" tag="article" class="mb-2">
              In questa pagina è possibile aggiungere una funzione, ovvero una relazione tra uno o due beni. Essa permette di specificare informazioni
              come: il Bene nr. 1 nel 1600 possiede il ruolo di chiesa, il Bene nr. 1 nel 1600 possiede il ruolo di chiesa e dipende dal Bene nr. 2.
              La funzione aggiunta deve essere prima approvata da un revisore. Nel caso un revisore aggiunga una funzione, essa
               verrà aggiunto subito alla lista di tutte le funzioni comuni a tutti gli utenti (dette funzioni definitive, vedi ricerca una funzione).
                <div slot="footer"><b-button to="funzione/aggiungi" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
            <b-col cols="12" md="6" xl class="d-flex">
              <b-card title="Ricerca una funzione" tag="article" class="mb-2">
                Puoi ricercare, visualizzare e modificare una funzione approvata per mezzo di questa pagina. Utilizza i filtri della tabella per ricercare.
                <div slot="footer"><b-button to="/funzione/ricerca" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
            <b-col cols="12" md="6" xl class="d-flex">
              <b-card title="Aiuto date" tag="article" class="mb-2">
                <p>DataP non indica la fine di un’azione o di una proprietà, ma solo il limite più
                recente di un periodo. Cioè “nel XV sec inizio A paga un tributo a B” vuol dire che si ha notizia che
                in un certo anno tra 1401 e 1425 A pagava un tributo a B. NON vuol dire che nel 1401 A inizia a
                pagare un tributo a B e che nel 1425 finisce. Questo si presta a ambiguità: la frase “nel XV secolo A
                paga un tributo a B” è ambigua e ancora più ambigua è la frase “tra il 1289 e il 1332 A paga un
                tributo a B”. Quest’ultima frase in particolare (se così compare in un documento) va interpretata
                dall’operatore: se vuol dire “ho notizia che in un certo anno tra il 1289 e il 1332 A paga B” è una
                cosa; se vuol dire che “dal 1289 A inizia a pagare B e finisce nel 1332” la cosa è diversa e sono
                necessari due record distinti.</p>
                <p>In conclusione i 2 parametri DataA e DataP a servono a definire un anno o un periodo in cui vale una
                proprietà (Ruolo, Paga un tributo, ecc.) e il parametro Tipo specifica cosa accade prima e dopo
                DataA e DataB.</p>
                <p>Se si tratta di un anno si acquisisce solo DataA e se DataTipo = ‘niente prima’, prima di DataA la
                proprietà è zero; se DataTipo = ‘niente dopo’, dopo DataA la proprietà è zero.
                Se si tratta di un periodo di acquisiscono DataA e DataP e se DataTipo = ‘niente prima’, prima di
                DataA la proprietà è zero; se DataTipo = ‘niente dopo’, dopo DataP la proprietà è zero. Se il periodo
                è espresso in formato Latino è come se si acquisissero i due anni che indicano il periodo.</p>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
        <!-- aiuto mio lavoro -->
        <b-tab title="Il lavoro">
            <b-row align-h="center">
            <b-col cols="12" md="6" xl="4" class="d-flex">
              <b-card title="Beni" tag="article" class="mb-2">
                Qua puoi vedere i tuoi beni approvati o quelli ancora incompleti, in fase di attesa o da rivedere.
                I revisori vedranno i beni di altri utenti da approvare.
                <div slot="footer"><b-button to="bene/mio_lavoro" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
            <b-col cols="12" md="6" xl="4" class="d-flex">
              <b-card title="Funzioni" tag="article" class="mb-2">
              Qua puoi vedere le tue funzioni approvate o quelle ancora incomplete, in fase di attesa o da rivedere.
                I revisori vedranno le funzioni di altri utenti da approvare.
                <div slot="footer"><b-button to="funzione/mio_lavoro" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
    </b-col>
    </b-row>
  </b-container>
</template>

<script>
import commonPageMixin from '@/components/mixins/CommonPage'
import Menu from '@/components/ui/Menu'

// Mostra una pagina di aiuto suddivisa per beni, funzioni, il lavoro
export default {
  name: 'AiutoPage',
  components: { Menu },
  mixins: [commonPageMixin]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-footer {
  padding: 7px;
}
</style>
