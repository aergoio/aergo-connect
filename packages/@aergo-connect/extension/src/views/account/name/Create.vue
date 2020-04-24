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

import { Address } from '@herajs/common';
import { timedAsync } from 'timed-async';

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

  get accountSpec() {
    return {
      address: this.$route.params.address,
      chainId: this.$route.params.chainId,
    };
  }

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
      // Check if name already exists
      const name = await timedAsync(this.$background.addName(this.accountSpec, this.name));
      if (name.data.destination) {
        // If we are the owner, add it and go back to the detail page.
        if (name.data.destination === this.$route.params.address) {
          alert('You have already registered this name. It has now been added.');
          this.$router.push({ name: 'account-details' });
          return;
        }
        throw new Error(`Name is already registered to account ${name.data.destination}`);
      }

      const txBody = await timedAsync(this.$background.getCreateNameTransaction(this.accountSpec, this.name));
      this.$store.dispatch('ui/setTxBody', txBody );
      this.$router.push({ name: 'account-send-confirm' });
      // TODO: Add name to internal db, AFTER confirm
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