<template>
  <ScrollView class="page">
    <div class="content">
      <section class="dialog-header">
        <BackButton :to="$store.state.ui.route.previousPath" />
      </section>
      <Heading animated>Create</Heading>
      <p>Please select the network for your new account.</p>
      <SelectField variant="main" :options="options" v-model="chainId" modal-sheet dropdownTitle="Network" />
    </div>
    <template #footer>
      <div class="content">
        <ContinueButton @click="create" />
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
  chainId = 'aergo.io';
  persistFields = ['chainId'];
  options = [['aergo.io', 'Mainnet'], ['testnet.aergo.io', 'Testnet']];

  async create() {
    const account = await this.$background.createAccount({
      chainId: this.chainId,
    });
    console.log(account);
    this.$router.push({ name: 'account-created', params: {
      chainId: account.chainId,
      address: account.address,
    } })
  }
}
</script>

<style lang="scss">

</style>