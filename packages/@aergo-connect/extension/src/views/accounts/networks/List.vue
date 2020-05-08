<template>
  <div class="account-list-view">
    <ScrollView>
      <template #header>
        <div class="account-list-header">
          <BackButton />
          <Heading tag="h2">
            Custom networks
            <Button :to="{ name: 'networks-create' }" type="icon"><Icon name="add" :size="24" /></Button>
          </Heading>
        </div>
      </template>
      <div class="account-list-wrap">
        <ul class="networks-list">
          <router-link tag="li" :to="{name: 'networks-update', params: { chainId: network.chainId }}"
            class="network-list-item" v-for="network in networks" :key="network.chainId">
            <span class="chain-id-icon">
              <Icon :name="isPublicChainId(network.chainId) ? 'logo' : 'network-other'" :size="36" />
            </span>
            <div class="network-info">
              <span class="chain-id">{{network.chainId}}</span>
              <span class="network-actions">
                <span class="node-url">{{network.nodeUrl}}</span>
                <span class="delete-button" @click.prevent.stop="removeNetwork(network.chainId)"><Icon name="trash" :size="10" /></span>
              </span>
            </div>
          </router-link>
        </ul>
      </div>
      <div class="content note" v-if="!networks.length">No custom networks configured yet.</div>
    </ScrollView>
  </div>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { Icon } from '@aergo-connect/lib-ui/src/icons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { Button, BackButton } from '@aergo-connect/lib-ui/src/buttons';

import Vue from 'vue';
import Component from 'vue-class-component';
import { ChainConfig, isPublicChainId } from '../../../config';

@Component({
  components: {
    ScrollView,
    Heading,
    Button,
    BackButton,
    Icon,
  },
})
export default class AccountsList extends Vue {
  networks: ChainConfig[] = [];
  created() {
    this.fetchNetworks();
  }
  async fetchNetworks() {
    const chains = await this.$background.getNetworks();
    this.networks = Object.values(chains) as any;
  }
  isPublicChainId(chainId: string) {
    return isPublicChainId(chainId);
  }
  async removeNetwork(chainId: string) {
    if (!confirm(`Are you sure you want to remove the custom network ${chainId}?`)) {
      return;
    }
    await this.$background.removeNetwork({ chainId });
    this.fetchNetworks();
  }
}
</script>

<style lang="scss">
.networks-list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: (13/16)*1rem;

  .network-list-item {
    padding: 20px 20px 0 16px;
    display: flex;
    cursor: pointer
  }
  .chain-id {
    font-weight: 500;
  }
  .chainid-group {
    line-height: 36px;
    border-bottom: 1px solid #f0f0f0;
  }
  .chain-id-icon {
    width: 36px;
    height: 36px;
    margin-right: 14px;
    border: 1px solid #f0f0f0;
    border-radius: 18px;
  }
  .network-info {
    flex: 1;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    padding: 2px 0 20px;
    line-height: 1.4;
  }
  .network-list-item:last-child .network-info {
    border-bottom: 0;
  }
  .node-url {
    font-size: (12/16)*1rem;
    color: #666;
  }

  .network-actions {
    display: flex;
    align-items: center;
    .node-url {
      flex: 1;
    }
  }
  .delete-button {
    opacity: 0;
  }
  .network-list-item:hover .delete-button {
    opacity: 1;
  }
  .delete-button .icon {
    border-radius: 100%;
    width: 24px !important;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background-color: #d9d9d9;
    }
  }
  
}

</style>