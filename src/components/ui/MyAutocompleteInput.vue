<template>
  <div class="my-autocomplete">
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
            :icon_msg="icon_msg"
            ></icon-msg>
            <!-- In caso di errore durante il caricamento -->
            <icon-msg v-if="error"
            class="input-group-text"
            icon_name="fa-exclamation-circle"
            icon_msg="Impossibile ottenere i suggerimenti"
            ></icon-msg>
        </template>
      </b-input-group>
      <div class="autocomplete" v-if="!state.listClosed && arr.length > 0">
          <div class="autocomplete-items">
            <div class="suggestions-header">
              <slot name="suggestions-header" :all-suggestions="arr"></slot>
            </div>
            <div v-for="sugg in arr"
             v-bind:key="sugg.id" class="suggestion-row"
             v-on:click="updateValue(sugg) || onSuggestionPicked() || hide()">
              <slot name="suggestion-row" :curr-suggestion="sugg">
                <span>{{sugg.value}}</span>
                <input type="hidden"
                :value="sugg.value">
              </slot>
            </div>
          </div>
      </div>
    </span>
  </div>
</template>

<script>
import IconMsg from '@/components/ui/IconMsg'

export default {
  name: 'MyAutocompleteInput',
  components: { 'icon-msg': IconMsg },
  props: {
    suggestions: Array,
    suggestionsPromise: Function,
    closedDictionary: Boolean,
    icon_name: String,
    icon_msg: String
  },
  data () {
    return {
      currVal: {},
      bs_input: null,
      loading: false,
      error: false,
      arr: [],
      listeners: {},
      state: {
        listClosed: true,
        activeInput: false
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
    addEventListener: function (event, func) {
      this.listeners[event] = func
    },
    updateValue: function (value) {
      this.currVal = value
      this.$emit('input', value.value)
    },
    onSuggestionPicked: function () {
      // evento lanciato quando l'utente seleziona dalla lista un suggerimento
      this.$emit('suggestion-picked', this.currVal)
    },
    // valore scelto dall'utente cliccando sul suggerimento
    getCurrentValue: function () { return this.currVal },
    validate: function () {
      if (this.closedDictionary) {
        // se si accetta un dizionario controllato occorre controllare
        // che sia stato scaricato correttamente prima di validare l'input
        if (this.arr.map(el => el.value)
          .includes(this.bs_input.value) && !this.error) {
          this.bs_input.setCustomValidity('')
        } else {
          this.bs_input.setCustomValidity('Invalid choice')
        }
      }
    },
    updateSuggestions: function (suggestions, suggestionsPromise) {
      const T = this
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
            // se non trova suggerimenti metto lista vuota
            // l'utente può scegliere di inserire liberamente se closedDictionary=false
            this.error = true
            reject(new Error())
          })
        } else if (suggestions) {
          resolve(suggestions)
        } else { reject(new Error()) }
      })
    },
    onInputClick: function (evt) {
      this.state.listClosed = false
      this.listeners['click'] && this.listeners['click'](evt)
    },
    onInputKeyDown: function (evt) {
      // esc key pressed
      if (evt.keyCode === 27) { this.state.listClosed = true } else if (evt.keyCode === 13) {
        /* If the ENTER key is pressed, prevent the form from being submitted, */
        evt.preventDefault()
        /* and simulate a click on the "active" item: */
        // if (x) x[this.state.currentFocus].click()
      }
      this.listeners['keydown'] && this.listeners['keydown'](evt)
    },
    onInput: function (evt) {
      this.show()
      this.validate()
      this.listeners['input'] && this.listeners['input'](evt)
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
.autocomplete {
  /*the container must be positioned relative:*/
  position: relative;
  width: 100%;
}
.autocomplete >>> .autocomplete-items {
  position: absolute;
  border: 1px solid #d4d4d4;
  border-bottom: none;
  border-top: none;
  z-index: 99;
  /*position the autocomplete items to be the same width as the container:*/
  top: 100%;
  left: 0;
  right: 0;
  max-height: 30vh;
  overflow: auto;
  border: 2px steelblue solid;
  -webkit-box-shadow: 3px 3px 5px 0px rgba(133,131,133,1);
  -moz-box-shadow: 3px 3px 5px 0px rgba(133,131,133,1);
  box-shadow: 3px 3px 5px 0px rgba(133,131,133,1);
}
.autocomplete >>> .autocomplete-items div {
  padding: 10px;
  cursor: pointer;
  background-color: #fff;
  border-bottom: 1px solid #d4d4d4;
}
.autocomplete >>> .autocomplete-items .suggestions-header {
  padding-top: 0px;
  padding-bottom: 0px;
}
.autocomplete >>> .autocomplete-items div:hover {
  /*when hovering an item:*/
  background-color: #e9e9e9;
}
</style>
