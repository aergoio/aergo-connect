<template>
  <ScrollView class="page">
    <div class="content">
      <section class="dialog-header">
        <BackButton />
      </section>
      <Heading>Import Keystore</Heading>
      <p>Enter your keystore file and password.</p>
      <TextField label="Keystore file" type="file" @file="setKeystore" :error="errors.keystore" />
      <TextField v-model="password" type="password" label="Keystore password" :error="errors.password" autoComplete="no" />  
    </div>
    <template #footer>
      <div class="content">
        <ContinueButton @click="loadKeystore" :disabled="!canContinue" />
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { BackButton, ContinueButton, Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { TextField } from '@aergo-connect/lib-ui/src/forms';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';

import Component, { mixins } from 'vue-class-component';

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
export default class Keystore extends mixins() {
  keystoreContent = "";
  password = "";
  errors = {
    keystore: "",
    password: "",
  };

  get canContinue(): boolean {
    return Boolean(this.keystoreContent) && Boolean(this.password);
  }

  setKeystore(keystoreContent: string): void {
    this.errors.keystore = '';
    try {
      this.keystoreContent = JSON.parse(keystoreContent);
    } catch(e) {
      this.errors.keystore = 'Invalid file: failed to parse as JSON';
    }
  }
  loadKeystore(): void {
    if (!this.canContinue) return;
    console.log(this.password, this.keystoreContent);
    this.errors.password = 'Invalid password';
  }
}
</script>

<style lang="scss">

</style>