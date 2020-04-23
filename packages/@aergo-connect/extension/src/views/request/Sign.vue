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

    <div class="sign-message" v-if="request">
      {{request.data.hash}}
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
  async confirmHandler() {
    if (!this.request) return;
    const { address, chainId } = this.$route.params;
    const account = { address, chainId };
    this.setStatus('loading', 'Calculating signature...');
    const message = this.request.data.hash;
    let buf = Buffer.from(message);
    if (message.substr(0, 2) === '0x') {
      try {
        buf = Buffer.from(message.substr(2), "hex");
      } catch (e) {
        throw new Error(`Failed to parse message: ${e}`);
      }
    }
    const result = await timedAsync(this.$background.signMessage({
      address,
      chainId,
      message: Array.from(Uint8Array.from(buf)),
    }));
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
</style>