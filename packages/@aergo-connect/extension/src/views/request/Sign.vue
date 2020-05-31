<template>
  <ScrollView class="page"> 
    <template #header>
      <div class="content" style="padding-bottom: 0">
        <div class="icon-header">
          <Icon name="title-request" :size="36" />
        </div>
        <Heading>Sign message</Heading>
        <p v-if="request">The website at {{request.origin}} wants to sign a message using your account.</p>
      </div>
    </template>

    <p class="unsupported-error" v-if="ledgerSignHashUnsupported">
      For security reasons, signing hashes is not supported on the Ledger app.
      Use a browser-stored account or request support from the Dapp developer.<br>
      Advice for developer: change the API call to pass the original message as `message`
      instead of a precomputed `hash`.
    </p>

    <div class="sign-message" v-if="request && !ledgerSignHashUnsupported">
      {{msgToSign}}
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
export default class RequestSign extends mixins(RequestMixin) {
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
  get msgToSign() {
    if (!this.request) return '';
    return this.request.data.message || this.request.data.hash;
  }
  get signSource() {
    if (!this.request || this.request.data.message) {
      return 'message';
    }
    return 'hash';
  }
  get ledgerSignHashUnsupported() {
    if (!this.request || !this.account) return false;
    return this.signSource === 'hash' && this.account.data.type === 'ledger';
  }
  async confirmHandler() {
    if (!this.request) return;
    if (!this.account) {
      throw new Error('Could not load account, please reload page and try again.');
    }
    const account = this.accountSpec;
    this.setStatus('loading', 'Calculating signature...');
    const message = this.msgToSign;
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
      const signature = await timedAsync(this.signWithLedger(buf, displayAsHex));
      return {
        account,
        signature,
      };
    }
    const { address, chainId } = this.accountSpec;
    const callData: {
      address: string;
      chainId: string;
      hash?: number[];
      message?: number[];
    } = {
      address,
      chainId,
    };
    if (this.signSource === 'message') {
      callData.message = Array.from(Uint8Array.from(buf));
    } else {
      callData.hash = Array.from(Uint8Array.from(buf));
    }
    const result = await timedAsync(this.$background.signMessage(callData));
    return {
      account,
      signature: result.signedMessage,
    };
  }
}
</script>

<style lang="scss">
.sign-message {
  background-color: #f0f0f0;
  padding: 16px;
  margin: 0 20px;
  font-size: (14/16)*1rem;
  word-wrap: break-word;
  line-height: 1.3;
}
.unsupported-error {
  margin: 0 20px;
  color: red;
  font-size: .85em;
}
</style>