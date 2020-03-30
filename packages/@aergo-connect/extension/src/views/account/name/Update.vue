<template>
  <ScrollView class="page">
    <div class="content">
      <BackButton :to="{ name: 'account-details' }" />
      <Heading tag="h2">Update a name</Heading>
      <p>
        Enter the new destination/owner address of <strong>{{$route.params.name}}</strong>.<br>
        We will then generate a transaction that you need to confirm in the next step
        to register the change on the network.
      </p>
      <AddressField v-model="destination" :error="errors.destination" autoComplete="no" />
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
import { AddressField } from '@aergo-connect/lib-ui/src/forms';

import { Address, TxTypes } from '@herajs/common';

@Component({
  components: {
    ScrollView,
    BackButton,
    Button,
    ButtonGroup,
    Heading,
    AddressField,
  },
})
export default class AccountNameUpdate extends Vue {
  destination = "";
  errors = {
    destination: "",
  };
  loading = false;

  mounted() {
    this.destination = this.$route.params.address;
  }

  async gotoSend() {
    this.loading = true;
    this.errors.destination = '';
    try {
      const address = new Address(this.destination);
      if (address.isEmpty() || address.isSystemAddress() || address.isName) {
        throw new Error('cannot use name');
      }
      if (address.equal(this.$route.params.address)) {
        throw new Error('cannot be same as current');
      }
      // TODO: Update name in internal db
      // TODO: Get current name price instead of hard-coding 20 aergo
      this.$store.dispatch('ui/setTxBody', {
        to: 'aergo.name',
        payload: JSON.stringify({ Name: 'v1updateName', Args: [this.$route.params.name, this.destination]}),
        amount: '20',
        unit: 'aergo',
        limit: 0,
        type: TxTypes.Governance,
      });
      this.$router.push({ name: 'account-send-confirm' });
    } catch (e) {
      let msg = `${e}`;
      if (msg.match(/Invalid checksum/)) msg = 'Invalid checksum';
      if (this.destination && this.destination[0] !== 'A') msg = 'Not a valid address (should start with letter A)';
      this.errors.destination = msg;
      console.error(e);
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss">
</style>