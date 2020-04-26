<template>
  <ScrollView class="page"> 
    <template #header>
      <div class="content" style="padding-bottom: 0">
        <div class="icon-header">
          <Icon name="title-request" :size="36" />
        </div>
        <Heading>{{title || 'Send transaction'}}</Heading>
        <p v-if="request">The website at {{request.origin}} wants to {{actionVerb || 'send'}} a transaction using your account.</p>
      </div>
    </template>

    <div class="content" style="padding-top: 0;" v-if="request">
      <TxConfirm :txBody="txDataDisplay" />
    </div>

    <template #footer>
      <div class="content">
        <ButtonGroup horizontal>
          <Button type="secondary" @click="cancel">Cancel</Button>
          <Button type="primary" @click="confirm">Confirm</Button>
        </ButtonGroup>
      </div>
      <LoadingDialog :visible="statusDialogVisible" @close="statusDialogVisible=false" :state="dialogState">
        <p v-if="dialogState !== 'error'">{{statusText}}</p>
        <p v-else class="error">{{statusText}}</p>
      </LoadingDialog>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { ScrollView, LoadingDialog } from '@aergo-connect/lib-ui/src/layouts';
import { Button, ButtonGroup, ContinueButton } from '@aergo-connect/lib-ui/src/buttons';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { RequestMixin } from './mixin';
import TxConfirm from '../../components/account/TxConfirm.vue';
import { timedAsync } from 'timed-async/index.js';
import { Account } from '@herajs/wallet';
import Transport from '@ledgerhq/hw-transport-webusb';
import LedgerAppAergo from '@herajs/ledger-hw-app-aergo';

@Component({
  components: {
    ScrollView,
    LoadingDialog,
    Button,
    ContinueButton,
    ButtonGroup,
    Heading,
    Icon,
    TxConfirm,
  },
})
export default class TxBase extends mixins(RequestMixin) {
  actionVerb = 'send';

  get accountSpec() {
    return { address: this.$route.params.address, chainId: this.$route.params.chainId };
  }
  get account(): Account {
    return this.$store.getters['accounts/getAccount'](this.accountSpec);
  }
  get txDataDisplay() {
    if (!this.request) return {};
    return {
      ...this.request.data,
      payload: this.payloadDisplay,
    };
  }
  get payloadParsed() {
    if (!this.request) return Buffer.from([]);
    const txData = this.request.data;
    if (txData.payload_json) {
        return Buffer.from(JSON.stringify(txData.payload_json));
    }
    return Buffer.from(txData.payload, 'base64')
  }
  get payloadDisplay() {
    if (!this.request) return '';
    const txData = this.request.data;
    if (txData.payload_json) {
      return JSON.stringify(txData.payload_json, null, 2);
    }
    return txData.payload;
  }
  created() {
    this.$store.dispatch('accounts/updateAccount', this.accountSpec);
  }
  async signWithLedger(txBody: any) {
    const { tx } = await this.$background.prepareTransaction(txBody, this.$route.params.chainId);
    tx.payload = txBody.payload;
    this.setStatus('loading', 'Connecting to Ledger device...');
    const transport = await timedAsync(Transport.create(5000), { fastTime: 1000 });
    const app = new LedgerAppAergo(transport);
    this.setStatus('loading', 'Please confirm transaction on device!');
    try {
      const { signature } = await app.signTransaction(tx);
      tx.sign = signature;
      return tx;
    } catch (e) {
      if (`${e}`.match(/0x6982/)) {
        throw new Error('Transaction was rejected.');
      } else {
        throw e;
      }
    }
  }
  async confirmHandler(): Promise<any> {
    console.log('RequestSend confirmHandler');
    if (!this.request) return;
    let txBody = {
      ...this.request.data,
      payload: Array.from(this.payloadParsed),
      from: this.$route.params.address,
    };
    if (!this.account) {
      // This shouldn't happen normally
      throw new Error('Could not load account, please reload page and try again.');
    }
    if (this.account.data.type === 'ledger') {
      txBody = await this.signWithLedger(txBody);
      if (this.actionVerb === 'sign') {
        return {
          account: this.accountSpec,
          signature: txBody.sign,
        };
      }
    }

    if (this.actionVerb === 'sign') {
      this.setStatus('loading', 'Calculating signature...');
      const result = await this.$background.signTransaction(txBody, this.$route.params.chainId);
      if ('tx' in result) {
        return {
          account: this.accountSpec,
          signature: result.tx.signature,
        };
      }
    } else {
      this.setStatus('loading', 'Sending to network...');
      const result = await timedAsync(this.$background.sendTransaction(txBody, this.$route.params.chainId));
      if ('tx' in result) {
        return {
          hash: result.tx.hash,
        };
      }
    }
   
    // This shouldn't happen normally
    throw new Error('Result is missing transaction information.');
  }
}
</script>
