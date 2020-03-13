<template>
  <ScrollView class="page">
    <div class="content">
      <section class="dialog-header">
        <BackButton />
      </section>
      <Heading animated>Create</Heading>
      <p>To get started, please select a network.</p>
      <SelectField variant="main" :options="options" v-model="value" modal-sheet dropdownTitle="Network" />
    </div>
    <template #footer>
      <div class="content">
        <ContinueButton :to="{ name: 'account-created', params: { address: 'Abc' } }" />
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { BackButton, ContinueButton } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import SelectField from '@aergo-connect/lib-ui/src/forms/SelectField.vue';
import { PersistInputsMixin } from '../../store/ui';

import Component, { mixins } from 'vue-class-component'

@Component({
  components: {
    ScrollView,
    BackButton,
    Heading,
    SelectField,
    ContinueButton,
  },
})
export default class Create extends mixins(PersistInputsMixin) {
  value = 'aergo.io';
  persistFields = ['value'];
  options = ['aergo.io', 'testnet.aergo.io'];
}
</script>

<style lang="scss">
.dialog-header {
  margin: 10px 0 20px;
}
</style>