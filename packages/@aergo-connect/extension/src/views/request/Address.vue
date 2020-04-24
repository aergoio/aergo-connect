<template>
  <ScrollView class="page"> 
    <div class="content">
      <div class="icon-header">
        <Icon name="title-request" :size="36" />
      </div>
      <Heading style="white-space: nowrap">Access public address</Heading>
      <p v-if="request">The website at {{request.origin}} wants to receive your active account's public address and chain ID.</p>
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
export default class RequestAddress extends mixins(RequestMixin) {
  async confirmHandler() {
    const { address, chainId } = this.$route.params;
    return {
      account: {
        address,
        chainId,
      },
    };
  }
}
</script>