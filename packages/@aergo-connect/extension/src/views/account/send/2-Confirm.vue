<template>
  <ScrollView class="page">
    <template #header>
      <div class="content" style="padding-bottom: 0;">
        <BackButton :to="{ name: 'account-send' }" />
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
    console.log('gonna prepare tx', txBody);
    const { tx } = await this.$background.prepareTransaction(txBody, this.$route.params.chainId);
    tx.payload = txBody.payload;
    console.log('received prepared transaction', tx);

    this.setStatus('loading', 'Connecting to Ledger device...');
    const transport = await timedAsync(Transport.create(), { fastTime: 1000 });
    const app = new LedgerAppAergo(transport);
    this.setStatus('loading', 'Confirm transaction on device');
    const { signature } = await app.signTransaction(tx);
    tx.sign = signature;
    return tx;
  }

  async sendTransaction(txBody: any): Promise<string> {
    if (!this.account) {
      throw new Error('Could not load account, please reload page and try again');
    }
    if (this.account.data.type === 'ledger') {
      txBody = await this.signWithLedger(txBody);
    }
    this.setStatus('loading', 'Sending to network...');
    const result = await this.$background.sendTransaction(txBody, this.$route.params.chainId);
    if ('tx' in result) {
      return result.tx.hash;
    } else {
      throw new Error('result is missing transaction information');
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
      console.log(e);
      this.setStatus('error', `${e}`);
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