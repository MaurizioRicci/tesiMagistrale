<template>
    <b-form-group :label="label" :label-for="inputID"
        label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
      <!-- prop `add-on-change` is needed to enable adding tags vie the `change` event -->
      <b-form-tags :value="value" size="lg" add-on-change no-outer-focus
        class="mb-2 text-left" @input="e => $emit('input', this.noneIfEmpty(e))"
        :disabled="disabled">
        <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
        <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
          <li v-for="tag in tags" :key="tag" class="list-inline-item">
            <b-form-tag
              @remove="removeTag(tag)"
              :title="tag"
              :disabled="disableNoneTag(tags) || disabled"
              variant="info"
            >{{ tag }}</b-form-tag>
          </li>
        </ul>
        <b-form-select
          :id="inputID"
          v-bind="inputAttrs"
          v-on="inputHandlers"
          :disabled="disabled || availableOptions.length === 0"
          :options="availableOptions">
          <template v-slot:first>
            <!-- This is required to prevent bugs with Safari -->
            <option disabled value="">Scegli un ruolo...</option>
          </template>
        </b-form-select>
        </template>
      </b-form-tags>
    </b-form-group>
</template>

<script>
import { loadRuolo } from '@/assets/js/loadDict'

export default {
  name: 'RuoliFormTag',
  props: {
    value: [Array],
    label: String,
    inputID: String,
    disabled: Boolean
  },
  data () {
    return {
      allOptions: []
    }
  },
  computed: {
    availableOptions () {
      return this.allOptions.filter(opt => this.value.indexOf(opt) === -1)
    }
  },
  methods: {
    // se non c'è nessun ruolo aggiunge lui il ruolo 'none'
    noneIfEmpty (arr) {
      arr = arr.filter(el => el !== 'none')
      return arr.length === 0 ? ['none'] : arr
    },
    // il tag con none se è l'unico tag deve essere disabilitato per non cancellare
    // se ci sono altri tag, allora il tag 'none' si può cancellare
    disableNoneTag: tags => tags.length === 1 && tags[0] === 'none'
  },
  created () {
    loadRuolo(this).then(resp => { this.allOptions = resp.data.map(el => el.value) })
  }
}
</script>

<style>
.b-form-tag-remove:hover {
  color: red !important;
}
</style>
