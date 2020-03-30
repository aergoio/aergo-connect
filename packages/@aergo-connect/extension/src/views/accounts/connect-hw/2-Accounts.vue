<template>
  <ScrollView class="page">
    <template #header>
      <div class="content">
        <section class="dialog-header">
          <BackButton :to="{ name: 'account-connect-hw' }"/>
        </section>
        <Heading animated>Select Account</Heading>
        <p style="margin-bottom: 0">
          <span v-if="!accounts.length">To view accounts stored on your Ledger device, activate the Aergo app on your device and click Connect.</span>
          <span v-else>Select one account from your device.</span>
        </p>
      </div>
    </template>

    <div class="ledger-account-list-wrap">
      <AccountList v-if="accounts.length" :accounts="accounts" :groupByChain="false" accountRoute="account-imported" @select="selectAccount" />
    </div>

    <template #footer>
      <div class="content" v-if="!accounts.length">
        <ButtonGroup vertical>
          <Button type="primary" @click="connect">Connect Ledger</Button>
        </ButtonGroup>
      </div>
      <LoadingDialog :visible="connectDialogVisible" @close="connectDialogVisible=false" title="Ledger" :state="dialogState">
        <p v-if="dialogState !== 'error'">{{connectStatus}}</p>
        <p v-else class="error">{{error}}</p>
      </LoadingDialog>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { BackButton, ContinueButton, Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView, LoadingDialog } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import SelectField from '@aergo-connect/lib-ui/src/forms/SelectField.vue';
import { PersistInputsMixin } from '../../../store/ui';
import AccountList from '../../../components/accounts/AccountList.vue';

import Component, { mixins } from 'vue-class-component';
import { timedAsync } from 'timed-async/index.js';
import { Account, serializeAccountSpec } from '@herajs/wallet';

import Transport from '@ledgerhq/hw-transport-webusb';
import LedgerAppAergo from '@herajs/ledger-hw-app-aergo';

@Component({
  components: {
    ScrollView,
    BackButton,
    Heading,
    SelectField,
    ContinueButton,
    Button,
    ButtonGroup,
    LoadingDialog,
    AccountList,
  },
})
export default class Import extends mixins(PersistInputsMixin) {
  chainId = 'aergo.io';
  persistFields = ['chainId'];
  persistFieldsKey = 'account-connect-hw';

  accounts: Account[] = [];
  loading = false;
  error = '';
  connectStatus = '';
  connectDialogVisible = false;
  dialogState: 'loading' | 'success' | 'error' = 'loading';

  async connect() {
    this.connectDialogVisible = true;
    this.dialogState = 'loading';
    this.error = '';
    this.connectStatus = 'Connecting to Ledger device...';
    try {
      const transport = await timedAsync(Transport.create(), { fastTime: 1000 });
      const app = new LedgerAppAergo(transport);
      this.connectStatus = 'Loading accounts...';
      const accounts = await this.loadAccounts(app, 0, 5);
      this.accounts.push(...accounts);
      this.dialogState = 'success';
      this.connectStatus = 'Done!';
      setTimeout(() => {
        this.connectDialogVisible = false;
      }, 1000);
    } catch (e) {
      if (`${e}`.match(/No device selected/)) {
        this.error = "You didn't select a compatible USB device.";
      } else if (`${e}`.match(/CLA_NOT_SUPPORTED/)) {
        this.error = `Make sure to activate the Aergo app on your device and try again.`;
      } else {
        this.error = `Make sure the device is connected and the Aergo app is active. ${e}`;
      }
      this.dialogState = 'error';
    }
  }

  async loadAccounts(app: LedgerAppAergo, from: number, to: number): Promise<Account[]> {
    const accounts: Account[] = [];
    const statePromises = [];
    for (let i = from; i < to; i++) {
      const path = 'm/44\'/441\'/0\'/0/' + i;
      const address = await app.getWalletAddress(path);
      const spec = {
        address: `${address}`,
        chainId: this.chainId,
      };
      const account = new Account(serializeAccountSpec(spec), Account.getDefaultData({
        spec,
        type: 'ledger',
        derivationPath: path,
      }));
      accounts.push(account);
      statePromises.push(this.$background.getAccountState(spec).then(state => {
        account.data.balance = `${state.balance}`;
      }));
    }
    // Wait for remaining state promises to resolve
    await Promise.all(statePromises);
    return accounts;
  }

  async selectAccount(account: Account): Promise<void> {
    await this.$background.addAccount(account.data);
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
    max-width: 260px;
  }
  p.error {
    color: #ee4648;
    margin-top: 1em;
  }
}
.ledger-account-list-wrap {
  border-radius: 2px;
  box-shadow: 0 12px 20px 0 rgba(34, 34, 34, 0.08);
  margin: 0 10px 25px 20px;
}
</style>