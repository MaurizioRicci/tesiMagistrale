<template>
  <div class="autocomplete">
    <span ref="input_container">
      <b-input-group>
        <slot></slot>
        <template v-slot:append v-if="icon_name">
            <!-- Mentre carica i suggerimenti -->
            <b-spinner v-if="loading && !error" class="mt-2 ml-1"
            variant="primary" label="Loading">
            </b-spinner>
            <!-- Dopo aver caricato i suggerimenti -->
            <icon-msg v-if="!loading && !error"
            class="input-group-text"
            :icon_name="icon_name"
            :icon_msg="icon_msg"
            ></icon-msg>
            <!-- In caso di errore durante il caricamento -->
            <icon-msg v-if="error"
            class="input-group-text"
            icon_name="exclamation-octagon"
            icon_msg="Impossibile ottenere i suggerimenti"
            ></icon-msg>
        </template>
      </b-input-group>
    </span>
  </div>
</template>

<script>
import IconMsg from '@/components/IconMsg'

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
      currentFocus: -1,
      bs_input: null,
      loading: false,
      error: false
    }
  },
  methods: {
    updateValue: function (value) {
      this.$emit('input', value)
    },
    autocomplete: function (arr) {
      var T = this
      /* the autocomplete function takes two arguments,
      the text field element and an array of possible autocompleted values: */
      /* execute a function when someone writes in the text field: */
      T.bs_input.addEventListener('input', function (e) {
        var val = this.value
        /* close any already open lists of autocompleted values */
        T.closeAllLists()
        T.updateValue(val)
        if (!val) { return false }
        // Valida l'input
        T.validate(arr)
        T.currentFocus = -1
        T.queryForSuggestions(arr, val)
      })
      /* execute a function presses a key on the keyboard: */
      T.bs_input.addEventListener('keydown', function (e) {
        var x = document.getElementById(this.id + 'autocomplete-list')
        if (x) x = x.getElementsByTagName('div')
        if (e.keyCode === 40) {
        /* If the arrow DOWN key is pressed,
        increase the currentFocus variable: */
          T.currentFocus++
          /* and and make the current item more visible: */
          T.addActive(x)
        } else if (e.keyCode === 38) { // up
        /* If the arrow UP key is pressed,
        decrease the currentFocus variable: */
          T.currentFocus--
          /* and and make the current item more visible: */
          T.addActive(x)
        } else if (e.keyCode === 13) {
        /* If the ENTER key is pressed, prevent the form from being submitted, */
          e.preventDefault()
          if (T.currentFocus > -1) {
          /* and simulate a click on the "active" item: */
            if (x) x[T.currentFocus].click()
          }
        } else if (e.keyCode === 27) {
          // esc key
          T.closeAllLists()
        }
      })
      T.bs_input.addEventListener('click', function (e) {
        if (this.value === '') { T.queryForSuggestions(arr) }
      })
    },
    queryForSuggestions: function (arr, val) {
      const T = this
      /* create a DIV element that will contain the items (values): */
      let a = document.createElement('DIV')
      a.setAttribute('id', this.id + 'autocomplete-list')
      a.setAttribute('class', 'autocomplete-items')
      let b, i
      /* for each item in the array... */
      let matchNumber = 0
      for (i = 0; i < arr.length; i++) {
        /* check if the item starts with the same letters as the text field value: */
        // if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
        if (!val || arr[i].toUpperCase().includes(val.toUpperCase())) {
          matchNumber++
          /* create a DIV element for each matching element: */
          b = document.createElement('DIV')
          b.innerHTML += arr[i]
          /* insert a input field that will hold the current array item's value: */
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>"
          /* execute a function when someone clicks on the item value (DIV element): */
          b.addEventListener('click', function (e) {
            /* insert the value for the autocomplete text field: */
            T.bs_input.value = this.getElementsByTagName('input')[0].value
            T.updateValue(this.getElementsByTagName('input')[0].value)
            T.validate(arr)
            /* close the list of autocompleted values,
              (or any other open lists of autocompleted values: */
            T.closeAllLists()
          })
          a.appendChild(b)
        }
      }
      /* append the DIV element as a child of the autocomplete container: */
      if (matchNumber) { T.bs_input.parentNode.appendChild(a) }
    },
    addActive: function (x) {
      const T = this
      /* a function to classify an item as "active": */
      if (!x) return false
      /* start by removing the "active" class on all items: */
      T.removeActive(x)
      if (T.currentFocus >= x.length) T.currentFocus = 0
      if (T.currentFocus < 0) T.currentFocus = (x.length - 1)
      /* add class "autocomplete-active": */
      x[T.currentFocus].classList.add('autocomplete-active')
    },
    removeActive: function (x) {
    /* a function to remove the "active" class from all autocomplete items: */
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove('autocomplete-active')
      }
    },
    closeAllLists: function (elmnt) {
    /* close all autocomplete lists in the document,
    except the one passed as an argument: */
      var x = document.getElementsByClassName('autocomplete-items')
      for (var i = 0; i < x.length; i++) {
        if (elmnt !== x[i] && elmnt !== this.bs_input) {
          x[i].parentNode.removeChild(x[i])
        }
      }
    },
    validate: function (arr) {
      if (this.closedDictionary) {
        // se si accetta un dizionario controllato occorre controllare
        // che sia stato scaricato correttamente prima di validare l'input
        if (arr.includes(this.bs_input.value) && !this.error) {
          this.bs_input.setCustomValidity('')
        } else {
          this.bs_input.setCustomValidity('Invalid choice')
        }
      }
    }
  },
  mounted () {
    this.bs_input = this.$refs.input_container.querySelector('input')
    if (!this.suggestions && this.suggestionsPromise) {
      this.loading = true
      this.suggestionsPromise(this).then(ret => {
        this.loading = false
        return this.autocomplete(ret.data)
      }, onRejected => {
        // se non trova suggerimenti metto lista vuota
        // l'utente può scegliere di inserire liberamente se closedDictionary=false
        this.error = true
        return this.autocomplete([])
      })
    } else { this.autocomplete(this.suggestions || []) }
  }
}
</script>
<style scoped>
.autocomplete {
  /*the container must be positioned relative:*/
  position: relative;
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
  max-height: 20vh;
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
.autocomplete >>> .autocomplete-items div:hover {
  /*when hovering an item:*/
  background-color: #e9e9e9;
}
</style>
