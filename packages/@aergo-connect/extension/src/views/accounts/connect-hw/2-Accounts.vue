<template>
  <ScrollView class="page">
    <template #header>
      <div class="content">
        <section class="dialog-header">
          <BackButton :to="{ name: 'account-connect-hw' }"/>
        </section>
        <Heading animated>Select Account</Heading>
      </div>
    </template>
    <div class="connect-status">
      <Button type="primary" @click="connect">Connect Ledger Nano S</Button>
      <LoadingIndicator v-if="loading" :size="30" />
      <p v-if="error" class="error">{{error}}</p>
      <p v-else>Please activate the Aergo app on your Ledger Nano S.</p>
      <ul>
        <li v-for="address in addresses" :key="address">
          {{address}}
        </li>
      </ul>
    </div>
    <template #footer>
      <div class="content">
        <ContinueButton  />
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
/*
<ul>
        <li v-for="address in addresses" :key="address">{{address}}</li>
      </ul>
    </div>
    */
import { BackButton, ContinueButton, Button } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { LoadingIndicator } from '@aergo-connect/lib-ui/src/icons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import SelectField from '@aergo-connect/lib-ui/src/forms/SelectField.vue';
import { PersistInputsMixin } from '../../../store/ui';

import Component, { mixins } from 'vue-class-component';

import Transport from '@ledgerhq/hw-transport-webusb';
import LedgerAppAergo from '@herajs/ledger-hw-app-aergo';

@Component({
  components: {
    ScrollView,
    BackButton,
    Heading,
    SelectField,
    ContinueButton,
    LoadingIndicator,
    Button,
  },
})
export default class Import extends mixins(PersistInputsMixin) {
  chainId = 'aergo.io';
  persistFields = ['chainId'];
  persistFieldsKey = 'account-connect-hw';

  addresses: string[] = [];
  loading = false;
  error = '';

  async connect() {
    await Transport.create(10000, 1500);
    //const app = new LedgerAppAergo(transport);
    this.loadAccounts(0, 10);
    
  }

  async loadAccounts(from: number, to: number): Promise<void> {
    this.loading = true;
    try {
      for (let i = from; i < to; i++) {
        const path = 'm/44\'/441\'/0\'/0/' + i;
        const address = await this.$background.getLedgerAddress({ path });
        this.addresses.push(address);
        this.loading = false;
      }
    } catch (e) {
      this.error = `${e}`;
      throw e;
    }
  }
}
</script>

<style lang="scss">
.connect-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  height: 100%;
  .loading-indicator {
    margin-bottom: 15px;
  }
  p {
    font-size: (13/16)*1rem;
    max-width: 220px;
  }
  p.error {
    color: #ee4648;
  }
}
</style>