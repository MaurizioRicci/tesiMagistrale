<template>
    <b-form-group :label="label" :label-for="inputID"
        label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
      <!-- prop `add-on-change` is needed to enable adding tags vie the `change` event -->
      <b-form-tags :value="value" size="lg" add-on-change no-outer-focus
        class="text-left p-1" @input="e => $emit('input', e)"
        :disabled="disabled">
        <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
        <b-form-select
          class="w-auto"
          style="font-size:1rem;"
          size="sm"
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
        <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-0">
          <li v-for="tag in tags" :key="tag" class="list-inline-item">
            <b-form-tag
              @remove="removeTag(tag)"
              :title="tag"
              :disabled="disabled"
              variant="info"
            >{{ tag }}</b-form-tag>
          </li>
        </ul>
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
  methods: {},
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
