<template>
  <ScrollView class="page">
    <div class="content">
      <section class="dialog-header">
        <BackButton :to="$store.state.ui.route.previousPath" />
      </section>
      <Heading animated>Create Account</Heading>
      <p>Please select the network for your new account.</p>
      <SelectNetwork v-model="chainId" />
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
import SelectNetwork from '../../components/accounts/SelectNetwork.vue';

import Component, { mixins } from 'vue-class-component'

@Component({
  components: {
    ScrollView,
    BackButton,
    Heading,
    SelectField,
    ContinueButton,
    SelectNetwork,
  },
})
export default class Create extends mixins(PersistInputsMixin) {
  chainId = 'aergo.io';
  persistFields = ['chainId'];
  options = [['aergo.io', 'Mainnet'], ['testnet.aergo.io', 'Testnet']];

  async create() {
    const { account, mnemonic } = await this.$background.createAccountWithMnemonic({
      chainId: this.chainId,
    });
    this.$store.commit('accounts/setSeedPhrase', mnemonic);
    this.$router.push({ name: 'account-created', params: {
      chainId: account.chainId,
      address: account.address,
    } })
  }
}
</script>

<style lang="scss">

</style>