<template>
  <ScrollView class="page">
    <div class="content">
      <section class="dialog-header">
        <BackButton :to="{ name: 'account-import-format' }" />
      </section>
      <Heading>Import Mnemonic Seedphrase</Heading>
      <p>Enter your mnemonic seed phrase.</p>
      <TextField label="Seed phrase" v-model="seedPhrase" :error="errors.seedPhrase" />
      <TextField v-model="derivationPath" label="Derivation path" disabled :error="errors.derivationPath" />
    </div>
    <template #footer>
      <div class="content">
        <ContinueButton @click="loadKeystore" :disabled="!canContinue || loading" :loading="loading" />
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { BackButton, ContinueButton, Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { TextField } from '@aergo-connect/lib-ui/src/forms';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { PersistInputsMixin } from '../../../store/ui';

import Component, { mixins } from 'vue-class-component';
import { privateKeyFromMnemonic, identityFromPrivateKey } from '@herajs/crypto';
import { waitFor, constants } from '@herajs/common';

@Component({
  components: {
    ScrollView,
    BackButton,
    ContinueButton,
    Heading,
    Button,
    ButtonGroup,
    TextField,
  },
})
export default class Keystore extends mixins(PersistInputsMixin) {
  chainId = '';
  persistFields = ['chainId']; // Data from 1-Network
  persistFieldsKey = 'account-create';

  derivationPath = constants.WALLET_HDPATH;
  seedPhrase = "";
  errors = {
    seedPhrae: "",
    derivationPath: "",
  };
  loading = false;

  get canContinue(): boolean {
    return Boolean(this.derivationPath) && Boolean(this.seedPhrase);
  }

  async loadKeystore(): Promise<void> {
    if (!this.canContinue) return;
    this.loading = true;
    await waitFor(150);

    try {
      const opts = { hdpath: this.derivationPath };
      const privateKey = await privateKeyFromMnemonic(this.seedPhrase, opts);
      const identity = identityFromPrivateKey(privateKey);
      const accountSpec = await this.$background.importAccount({
        privateKey: Array.from(identity.privateKey),
        chainId: this.chainId,
      });
      this.$router.push({ name: 'account-imported', params: {...accountSpec} });
    } catch(e) {
      console.log(e);
      this.errors.derivationPath = `${e}`;
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss">

</style>