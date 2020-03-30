<template>
  <ScrollView class="page">
    <div class="content">
      <BackButton :to="{ name: 'account-details' }" />
      <Heading tag="h2">Register new name</Heading>
      <p>
        Enter your new name for this account.<br>
        We will then generate a transaction that you need to confirm in the next step
        to register your name on the network.
      </p>
      <TextField v-model="name" variant="main" :error="errors.name" autoComplete="no" />
      <div class="note">Alpha-numeric, 12 characters</div>
    </div>
    <template #footer>
      <ButtonGroup vertical class="content">
        <Button type="primary" @click="gotoSend" :loading="loading">Continue</Button>
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
import { TextField } from '@aergo-connect/lib-ui/src/forms';

import { Address, TxTypes } from '@herajs/common';

@Component({
  components: {
    ScrollView,
    BackButton,
    Button,
    ButtonGroup,
    Heading,
    TextField,
  },
})
export default class AccountNameCreate extends Vue {
  name = "";
  errors = {
    name: "",
  };
  loading = false;

  async gotoSend() {
    this.loading = true;
    this.errors.name = '';
    try {
      if (this.name.length > 12) {
        throw new Error(`name is too long (${this.name.length} characters)`);
      }
      if (this.name.length < 12) {
        throw new Error(`name is too short (${this.name.length} characters)`);
      }
      const address = new Address(this.name);
      if (address.isEmpty() || address.isSystemAddress() || !address.isName) {
        throw new Error('not a valid name');
      }
      // TODO: Check if name exists. if yes and we are the current owner, add to internal db. if no, error
      // TODO: Get current name price instead of hard-coding 20 aergo
      this.$store.dispatch('ui/setTxBody', {
        to: 'aergo.name',
        payload: JSON.stringify({ Name: 'v1createName', Args: [this.name]}),
        amount: '20',
        unit: 'aergo',
        limit: 0,
        type: TxTypes.Governance,
      });
      this.$router.push({ name: 'account-send-confirm' });
    } catch (e) {
      this.errors.name = `${e}`;
      console.error(e);
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss">
</style>