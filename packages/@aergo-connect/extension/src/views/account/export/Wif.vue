<template>
  <ScrollView class="page">
    <div class="content" style="padding-bottom: 0">
      <BackButton :to="{ name: 'account-details' }" />
      <Heading tag="h2">Export as Encrypted String</Heading>
      <div v-if="!wif">
        <p>Choose a passphrase to encrypt your keystore file.</p>
        <PasswordStrengthField variant="main" v-model="password" @submit="createWif" autofocus />
        {{errors.password}}
      </div>
      <div v-else>
        <p>This string contains your private key, encrypted using your chosen passphrase. Please save it in a secure location.</p>
        <div class="wif-output">{{wif}}</div>
      </div>
    </div>
    <template #footer>
      <ButtonGroup vertical class="content">
        <Button v-if="!wif" type="primary" @click="createWif" :loading="loading">Export</Button>
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
export default class AccountExportWif extends Vue {
  password = "";
  errors = {
    password: "",
  };
  loading = false;

  wif = "";

  async createWif() {
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
        format: 'wif',
      });
      this.wif = result.privateKey;
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
.wif-output {
  border: 1px solid #ccc;
  padding: 10px;
  line-height: 1.3;
  word-break: break-all;
}
</style>