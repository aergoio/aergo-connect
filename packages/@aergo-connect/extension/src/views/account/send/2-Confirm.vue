<template>
  <ScrollView class="page">
    <template #header>
      <div class="content" style="padding-bottom: 0;">
        <BackButton />
        <Heading tag="h2">Confirmation</Heading>
      </div>
    </template>
    <div class="content" style="padding-top: 0;">
      <TxConfirm :txBody="txBody" />
    </div>
    <template #footer>
      <div class="content">
        <ButtonGroup vertical>
          <Button type="primary" @click="confirm">Confirm</Button>
        </ButtonGroup>
      </div>
      <LoadingDialog :visible="statusDialogVisible" @close="statusDialogVisible=false" :title="statusDialogTitle" :state="dialogState">
        <p v-if="dialogState !== 'error'">{{statusText}}</p>
        <p v-else class="error">{{statusText}}</p>
      </LoadingDialog>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import { ScrollView, LoadingDialog } from '@aergo-connect/lib-ui/src/layouts';
import { BackButton, Button, ButtonGroup } from '@aergo-connect/lib-ui/src/buttons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';

import { PersistInputsMixin } from '../../../store/ui';
import TxConfirm from '../../../components/account/TxConfirm.vue';
import Component, { mixins } from 'vue-class-component';

import { timedAsync } from 'timed-async/index.js';

import Transport from '@ledgerhq/hw-transport-webusb';
import LedgerAppAergo from '@herajs/ledger-hw-app-aergo';
import { Account } from '@herajs/wallet';

@Component({
  components: {
    ScrollView,
    LoadingDialog,
    BackButton,
    Heading,
    Button,
    ButtonGroup,
    TxConfirm,
  },
})
export default class AccountSendConfirm extends mixins(PersistInputsMixin) {
  persistFields = ['txBody'];
  persistFieldsKey = 'send';
  persistInitialValues = false;

  txBody: any = {};

  statusDialogVisible = false;
  dialogState: 'loading' | 'success' | 'error' = 'loading';
  statusDialogTitle = 'Sending';
  statusText = '';

  get accountSpec() {
    return { address: this.$route.params.address, chainId: this.$route.params.chainId };
  }
  get account(): Account {
    return this.$store.getters['accounts/getAccount'](this.accountSpec);
  }
  mounted() {
    this.$store.dispatch('accounts/updateAccount', this.accountSpec);
  }

  setStatus(state: 'loading' | 'success' | 'error', text: string) {
    this.dialogState = state;
    this.statusText = text;
    this.statusDialogVisible = true;
  }

  async signWithLedger(txBody: any) {
    const { tx } = await this.$background.prepareTransaction(txBody, this.$route.params.chainId);
    tx.payload = txBody.payload;
    this.setStatus('loading', 'Connecting to Ledger device...');
    const transport = await timedAsync(Transport.create(5000), { fastTime: 1000 });
    const app = new LedgerAppAergo(transport);
    this.setStatus('loading', 'Please confirm transaction on device!');
    try {
      await app.getWalletAddress(this.account.data.derivationPath);
      const { signature } = await app.signTransaction(tx);
      tx.sign = signature;
      return tx;
    } catch (e) {
      if (`${e}`.match(/0x6982/)) {
        throw new Error('Transaction was rejected.');
      } else if (`${e}`.match(/No device selected/)) {
        throw new Error("You didn't select a compatible USB device.");
      } else if (`${e}`.match(/CLA_NOT_SUPPORTED/)) {
        throw new Error('Make sure to activate the Aergo app on your device and try again.');
      } else {
        throw e;
      }
    }
  }

  async sendTransaction(txBody: any): Promise<string> {
    if (!this.account) {
      // This shouldn't happen normally
      throw new Error('Could not load account, please reload page and try again.');
    }
    if (this.account.data.type === 'ledger') {
      txBody = await this.signWithLedger(txBody);
    }
    this.setStatus('loading', 'Sending to network...');
    try {
      const result = await this.$background.sendTransaction(txBody, this.$route.params.chainId);
      if ('tx' in result) {
        return result.tx.hash;
      } else {
        // This shouldn't happen normally
        throw new Error('Result is missing transaction information.');
      }
    } catch (e) {
      throw new Error(`Node response: ${e.message || e}`);
    }
  }

  async confirm() {
    const txBody = {
      ...this.txBody,
      amount: `${this.txBody.amount} ${this.txBody.unit}`,
      from: this.$route.params.address,
    };
    try {
      const hash = await timedAsync(this.sendTransaction(txBody), { fastTime: 1000 });
      this.setStatus('success', 'Done');
      setTimeout(() => {
        this.$router.push({ name: 'account-send-success', params: { hash }});
      }, 1000);
    } catch(e) {
      const errorMsg = `${e}`.replace("UNDEFINED_ERROR:", "");
      this.setStatus('error', errorMsg);
    }
  }
}
</script>

<style lang="scss">
.data-box {
  border-radius: 2px;
  box-shadow: 0 12px 20px 0 rgba(34, 34, 34, 0.08);
  padding: 20px;
}
</style>