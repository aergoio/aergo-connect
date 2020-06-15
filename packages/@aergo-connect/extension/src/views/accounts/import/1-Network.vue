<template>
  <ScrollView class="page">
    <div class="content">
      <section class="dialog-header">
        <BackButton :to="$store.state.ui.route.previousPath !== '/accounts/import/format' ? $store.state.ui.route.previousPath : '/accounts'" />
      </section>
      <Heading animated>Import Account</Heading>
      <p>Please select the network for which you want to import the account.</p>
      <SelectNetwork v-model="chainId" />
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
import SelectNetwork from '../../../components/accounts/SelectNetwork.vue';
import { PersistInputsMixin } from '../../../store/ui';
import { PublicChainIds, PublicChainData } from '../../../config';

import Component, { mixins } from 'vue-class-component';

const publicChainOptions = PublicChainIds.map(chainId => [chainId, PublicChainData[chainId].label]);

@Component({
  components: {
    ScrollView,
    BackButton,
    Heading,
    SelectNetwork,
    ContinueButton,
  },
})
export default class Import extends mixins(PersistInputsMixin) {
  chainId = 'aergo.io';
  persistFields = ['chainId'];
  persistFieldsKey = 'account-create';
  options = publicChainOptions;
}
</script>

<style lang="scss">

</style>