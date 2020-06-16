<template>
  <ScrollView class="page">
    <div class="content" style="padding-bottom: 0">
      <BackButton :to="{ name: 'account-details' }" />
      <Heading tag="h2">Export as Keystore</Heading>
      <div v-if="!keystore">
        <p>Choose a passphrase to encrypt your keystore file.</p>
        <PasswordStrengthField variant="main" v-model="password" @submit="createKeystore" autofocus />
        {{errors.password}}
      </div>
      <div v-else>
        <p>Your encrypted keystore file is ready to download. A download should have been started automatically by your browser. If not, click the button below.</p>
      </div>
    </div>
    <template #footer>
      <ButtonGroup vertical class="content">
        <Button v-if="!keystore" type="primary" @click="createKeystore" :loading="loading">Export</Button>
        <a v-else class="button button-type-primary button-size-default inverted-colors" :href="encodedKeystoreUrl" target="_blank" :download="fileName" ref="downloadButton">Download</a>
      </ButtonGroup>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';

import Vue from 'vue';
import Component from 'vue-class-component'
import { BackButton, Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { TextField, PasswordStrengthField } from '@aergo-connect/lib-ui/src/forms';

@Component({
  components: {
    ScrollView,
    BackButton,
    Button,
    ButtonGroup,
    Heading,
    TextField,
    PasswordStrengthField,
  },
})
export default class AccountExportKeystore extends Vue {
  password = "";
  errors = {
    password: "",
  };
  loading = false;

  keystore = "";

  get encodedKeystoreUrl(): string {
    return 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.keystore);
  }
  get fileName(): string {
    const address = this.$route.params.address;
    return `${address}__keystore.txt`;
  }

  async createKeystore() {
    if (!this.password) {
      this.errors.password = 'Cannot be empty';
      return;
    }
    this.loading = true;
    try {
      const result = await this.$background.exportAccount({
        address: this.$route.params.address,
        chainId: this.$route.params.chainId,
        password: this.password,
        format: 'keystore',
      });
      this.keystore = result.privateKey;
      setTimeout(() => {
        (this.$refs.downloadButton as HTMLElement).click();
      }, 150);
    } catch (e) {
      this.errors.password = `${e}`;
      console.error(e);
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss">
</style>