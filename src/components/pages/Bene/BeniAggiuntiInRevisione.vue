<template>
<div>
    <b-tabs pills card align="center">
      <b-tab title="Beni aggiunti" active>
        <BeniUtente/>
        </b-tab>
      <b-tab title="Beni in revisione">
          <BeniUtente cercaInRevisione/>
      </b-tab>
    </b-tabs>
</div>
</template>

<script>
import BeniUtente from '@/components/ui/BeniUtente'
export default {
  name: 'BeniAggiuntiInRevisione',
  components: { BeniUtente }
}
</script>
