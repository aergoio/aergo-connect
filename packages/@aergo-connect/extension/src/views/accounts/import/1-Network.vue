<template>
  <ScrollView class="page">
    <div class="content">
      <section class="dialog-header">
        <BackButton />
      </section>
      <Heading animated>Import</Heading>
      <p>Please select the network for which you want to import the account.</p>
      <SelectField variant="main" :options="options" v-model="value" modal-sheet dropdownTitle="Network" />
    </div>
    <template #footer>
      <div class="content">
        <ContinueButton :to="{ name: 'account-import-format' }" />
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { BackButton, ContinueButton } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import SelectField from '@aergo-connect/lib-ui/src/forms/SelectField.vue';
import { PersistInputsMixin } from '../../../store/ui';
import { PublicChainIds, PublicChainData } from '../../../config';

import Component, { mixins } from 'vue-class-component';

const publicChainOptions = PublicChainIds.map(chainId => [chainId, PublicChainData[chainId].label]);

@Component({
  components: {
    ScrollView,
    BackButton,
    Heading,
    SelectField,
    ContinueButton,
  },
})
export default class Import extends mixins(PersistInputsMixin) {
  value = 'aergo.io';
  persistFields = ['value'];
  persistFieldsKey = 'account-create';
  options = publicChainOptions;
}
</script>

<style lang="scss">

</style>