<template>
  <div class="my-autocomplete" v-on-clickaway="closeSuggestions">
    <!-- Non cancellare il ref, serve per ritrovare l'input text al suo interno -->
    <span ref="input_container">
      <b-input-group>
        <slot></slot>
        <template v-slot:append>
          <!-- Mentre carica i suggerimenti -->
          <span  v-if="loading && !error" class="input-group-text">
            <b-spinner class="m-1" small
              variant="primary" label="Loading">
            </b-spinner>
          </span>
          <!-- Dopo aver caricato i suggerimenti -->
          <icon-msg v-if="!loading && !error && icon_name"
            class="input-group-text"
            :icon_name="icon_name"
            :icon_msg="icon_msg"></icon-msg>
          <!-- In caso di errore durante il caricamento -->
          <icon-msg v-if="error"
            class="input-group-text"
            icon_name="exclamation-circle"
            icon_msg="Impossibile ottenere i suggerimenti"></icon-msg>
        </template>
      </b-input-group>
      <!-- Feedback invalido -->
      <p class="invalid-feedback" style="display:initial"
        v-if="!this.state.validFeedback">{{invalidFeedback}}</p>

      <b-list-group class="my-list border border-primary"
        v-if="!state.listClosed && arr.length > 0">
        <b-list-group-item button v-for="sugg in arr"
          v-bind:key="sugg.id" class="suggestion-row"
          v-on:click="updateValue(sugg); onSuggestionPicked(); hide();">
          <slot name="suggestion-row" :curr-suggestion="sugg">
            {{sugg.value}}
          </slot>
        </b-list-group-item>
      </b-list-group>
    </span>
  </div>
</template>

<script>
import IconMsg from '@/components/ui/IconMsg'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'MyAutocompleteInput',
  mixins: [ clickaway ],
  components: { 'icon-msg': IconMsg },
  props: {
    // è possibile passare dei suggerimenti come array
    suggestions: Array,
    // è possibile ricevere suggerimenti come una funzione, una volta
    // eseguita restituisce una promessa, essa una volta risolta rende un array di suggerimenti
    suggestionsPromise: Function,
    // l'utente può scegliere di inserire liberamente se closedDictionary=false
    closedDictionary: Boolean,
    icon_name: String,
    icon_msg: String,
    invalidFeedback: String
  },
  data () {
    return {
      // currVal memorizza sia gli attributi del suggerimento scelto (es: ID) sia
      // il suggerimento come testo. Esso è l'output di v-model
      currVal: {},
      bs_input: null,
      loading: false,
      error: false,
      arr: [],
      listeners: {
        'click': null,
        'keydonw': null,
        'input': null
      },
      state: {
        listClosed: true,
        validFeedback: true
      }
    }
  },
  methods: {
    hide: function () {
      this.state.listClosed = true
    },
    show: function () {
      this.state.listClosed = false
    },
    // @vuese
    // Si possono registrare listener sull'input gestito da questo componente.
    // Gli input supportati sono click, keydown, input
    addEventListener: function (event, func) {
      this.listeners[event] = func
    },
    updateValue: function (value) {
      this.currVal = value
      this.bs_input.value = value.value
      this.validate()
      this.$emit('input', value.value)
    },
    onSuggestionPicked: function () {
      // evento lanciato quando l'utente seleziona dalla lista un suggerimento
      this.$emit('suggestion-picked', this.currVal)
    },
    // valore scelto dall'utente cliccando sul suggerimento
    getCurrentValue: function () { return this.currVal },
    validate: function () {
      // se non è un dizionario chiuso la validazione è lasciata all'input
      // passato nello slot principale
      // se è un dizionario chiuso
      if (this.closedDictionary) {
        // se si accetta un dizionario controllato occorre controllare
        // che l'input sia nel dizionario
        if ((this.arr.map(el => el.value)
          .includes(this.bs_input.value) && !this.error) ||
          this.bs_input.value === '') {
          this.state.validFeedback = true
          this.bs_input.setCustomValidity('')
        } else {
          this.state.validFeedback = false
          this.bs_input.setCustomValidity('Invalid choice')
        }
      }
    },
    updateSuggestions: function (suggestions, suggestionsPromise) {
      const T = this
      // in presenza di errori metto lista vuota
      return T.resolveSuggestions(suggestions, suggestionsPromise)
        .then((ok) => { T.arr = ok }, fail => { T.arr = [] })
    },
    resolveSuggestions: function (suggestions, suggestionsPromise) {
      return new Promise((resolve, reject) => {
        if (!suggestions && suggestionsPromise) {
          this.loading = true
          suggestionsPromise(this).then(ret => {
            this.loading = false
            resolve(ret.data)
          }, onRejected => {
            // se non trova suggerimenti segno che c'è stato
            // un errore di caricamento e metto lista vuota
            this.error = true
            reject(new Error())
          })
        } else if (suggestions) {
          resolve(suggestions)
        } else { reject(new Error('Nessun tipo di suggerimento specificato.')) }
      })
    },
    onInputClick: function (evt) {
      this.state.listClosed = false
      this.listeners['click'] && this.listeners['click'](evt)
    },
    onInputKeyDown: function (evt) {
      // esc key pressed
      if (evt.keyCode === 27) { this.closeSuggestions() } else if (evt.keyCode === 13) {
        /* If the ENTER key is pressed, prevent the form from being submitted, */
        evt.preventDefault()
      }
      this.listeners['keydown'] && this.listeners['keydown'](evt)
    },
    onInput: function (evt) {
      this.show()
      this.validate()
      this.listeners['input'] && this.listeners['input'](evt)
    },
    closeSuggestions () {
      this.state.listClosed = true
    }
  },
  mounted () {
    this.bs_input = this.$slots.default[0].componentInstance.$el
    this.bs_input.addEventListener('input', this.onInput)
    this.bs_input.addEventListener('click', this.onInputClick)
    this.bs_input.addEventListener('keydown', this.onInputKeyDown)
    this.updateSuggestions(this.suggestions, this.suggestionsPromise)
  }
}
</script>
<style scoped>
.my-list {
  max-height: 30vh;
  overflow: auto;
  position: absolute;
  z-index: 99;
  /*position the autocomplete items to be the same width as the container:*/
  top: 100%;
  left: 0;
  right: 0;
  -webkit-box-shadow: 3px 3px 5px 0px rgba(133,131,133,1);
  -moz-box-shadow: 3px 3px 5px 0px rgba(133,131,133,1);
  box-shadow: 3px 3px 5px 0px rgba(133,131,133,1);
}
.my-list >>> button {
  padding: 7px;
}
</style>
