<template>
  <ScrollView class="page"> 
    <div class="content">
      <div class="icon-header">
        <Icon name="title-request" :size="36" />
      </div>
      <Heading>Access public address</Heading>
      <p v-if="request">The website at {{request.origin}} wants to receive your active account's public address and chain ID.</p>
    </div>

    <template #footer>
      <div class="content">
        <ButtonGroup horizontal>
          <Button type="secondary" @click="cancel">Cancel</Button>
          <Button type="primary" @click="confirm">Confirm</Button>
        </ButtonGroup>
      </div>
    </template>
  </ScrollView>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Button, ButtonGroup, ContinueButton } from '@aergo-connect/lib-ui/src/buttons';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { ExternalRequest } from '../../background/request';

@Component({
  components: {
    ScrollView,
    Button,
    ContinueButton,
    ButtonGroup,
    Heading,
    Icon,
  },
})
export default class Address extends mixins() {
  request: ExternalRequest | null = null;
  
  async mounted() {
    this.request = await this.$store.dispatch('request/getRequest');
  }

  async confirm() {
    const { address, chainId } = this.$route.params;
    const account = { address, chainId };
    await this.$background.respondToPermissionRequest({
      requestId: this.$store.state.request.currentRequestId,
      result: { account, }
    });
    window.close();
  }

  async cancel() {
    await this.$background.denyPermissionRequest(this.$store.state.request.currentRequestId);
    window.close();
  }
}

</script>

<style lang="scss">
.locked-content {
  margin-top: 15px;
  padding: 20px;

  .icon {
    margin-bottom: 15px;
  }
}
</style>