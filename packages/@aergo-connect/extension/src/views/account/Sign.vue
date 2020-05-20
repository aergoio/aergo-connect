<template>
  <ScrollView class="page"> 
    <template #header>
      <div class="content" style="padding-bottom: 0;">
        <Heading tag="h2">Sign message</Heading>
      </div>
    </template>

    <div class="content">
      <textarea class="user-sign-message" v-model="message"></textarea>
      <p class="sign-message sign-message-result" v-if="signature">{{signature}}</p>
    </div>

    <template #footer>
      <div class="content">
        <ButtonGroup horizontal>
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
import { timedAsync } from 'timed-async/index.js';
import { Account } from '@herajs/wallet';
import { encodeBuffer } from '@herajs/common';
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
  },
})
export default class RequestSign extends mixins() {
  message = '';
  signature = '';
  statusText = '';
  statusDialogVisible = false;
  dialogState: 'loading' | 'success' | 'error' = 'loading';

  setStatus(state: 'loading' | 'success' | 'error', text: string) {
    this.dialogState = state;
    this.statusText = text;
    this.statusDialogVisible = true;
  }

  get accountSpec() {
    return { address: this.$route.params.address, chainId: this.$route.params.chainId };
  }
  get account(): Account {
    return this.$store.getters['accounts/getAccount'](this.accountSpec);
  }
  created() {
    this.$store.dispatch('accounts/updateAccount', this.accountSpec);
  }
  async signWithLedger(message: Buffer, displayAsHex = false) {
    this.setStatus('loading', 'Connecting to Ledger device...');
    const transport = await timedAsync(Transport.create(5000), { fastTime: 1000 });
    const app = new LedgerAppAergo(transport);
    this.setStatus('loading', 'Please confirm message on device!');
    try {
      await app.getWalletAddress(this.account.data.derivationPath);
      const result = await app.signMessage(message, displayAsHex);
      return encodeBuffer(Buffer.from(result.signature, 'base64'), 'hex');
    } catch (e) {
      if (`${e}`.match(/0x6982/)) {
        throw new Error('Message was rejected.');
      } else if (`${e}`.match(/No device selected/)) {
        throw new Error("You didn't select a compatible USB device.");
      } else if (`${e}`.match(/CLA_NOT_SUPPORTED/)) {
        throw new Error('Make sure to activate the Aergo app on your device and try again.');
      } else {
        throw e;
      }
    }
  }
  async confirmHandler() {
    if (!this.account) {
      throw new Error('Could not load account, please reload page and try again.');
    }
    const account = this.accountSpec;
    this.setStatus('loading', 'Calculating signature...');
    const message = this.message;
    let buf = Buffer.from(message);
    let displayAsHex = false;
    if (message.substr(0, 2) === '0x') {
      try {
        buf = Buffer.from(message.substr(2), "hex");
        displayAsHex = true;
      } catch (e) {
        throw new Error(`Failed to parse message: ${e}`);
      }
    }
    if (this.account.data.type === 'ledger') {
      this.signature = await timedAsync(this.signWithLedger(buf, displayAsHex));
      return
    }
    const { address, chainId } = this.accountSpec;
    const result = await timedAsync(this.$background.signMessage({
      address,
      chainId,
      message: Array.from(Uint8Array.from(buf)),
    }));
    this.signature = result.signedMessage;
  }
  async confirm() {
    try {
      await this.confirmHandler();
      this.setStatus('success', 'Done');
      window.setTimeout(() => {
        this.statusDialogVisible = false;
      }, 500);
    } catch (e) {
      this.setStatus('error', `${e}`);
    }
  }
}
</script>

<style lang="scss">
.user-sign-message {
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
  font-size: (14/16)*1rem;
}
.sign-message.sign-message-result {
  margin: 20px 0;
}
</style>