<template>
  <ScrollView class="page">
    <div class="content">
      <section class="dialog-header">
        <BackButton :to="{ name: 'account-import-format' }" />
      </section>
      <Heading>Import Enc. String</Heading>
      <p>Enter your encrypted private key and password.</p>
      <TextField label="Encrypted private key" v-model="encryptedKey" :error="errors.keystore" />
      <TextField v-model="password" type="password" label="Encryption password" :error="errors.password" autoComplete="no" />  
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
import { decodePrivateKey, decryptPrivateKey, identifyFromPrivateKey } from '@herajs/crypto';
import { waitFor } from '@herajs/common';

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

  encryptedKey = "";
  password = "";
  errors = {
    keystore: "",
    password: "",
  };
  loading = false;

  get canContinue(): boolean {
    return Boolean(this.encryptedKey) && Boolean(this.password);
  }

  async loadKeystore(): Promise<void> {
    if (!this.canContinue) return;
    this.loading = true;
    await waitFor(150);

    try {
      const encryptedBytes = decodePrivateKey(this.encryptedKey);
      const decryptedBytes = await decryptPrivateKey(encryptedBytes, this.password);
      const identity = await identifyFromPrivateKey(decryptedBytes);
      const accountSpec = await this.$background.importAccount({
        privateKey: Array.from(identity.privateKey),
        chainId: this.chainId,
      });
      this.$router.push({ name: 'account-imported', params: accountSpec });
    } catch(e) {
      console.log(e);
      if (`${e}`.match(/invalid mac value/)) {
        this.errors.password = 'Invalid password';
      } else {
        this.errors.password = `${e}`;
      }
      
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss">

</style>