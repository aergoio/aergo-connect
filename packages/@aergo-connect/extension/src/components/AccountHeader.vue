<template>
  <InvertedColors>
    <Header class="account-header">
      <BackButton :to="{ name: 'accounts-list' }" />
      <HeaderLogo />
      <div class="account-identifier">
        <Elide class="address" :text="$route.params.address" mode="middle-fixed-tail" expect-ellipsis />
        <Elide class="network" :text="$route.params.chainId" mode="head" />
      </div>
      <Button @click="gotoExplorer" type="icon" class="scan-button" v-if="explorerUrl"><Icon name="link" :size="36" /></Button>
    </Header>
  </InvertedColors>
</template>

<script lang="ts">
import Vue from 'vue';
import { Header } from '@aergo-connect/lib-ui/src/layouts';
import HeaderLogo from '@aergo-connect/lib-ui/src/icons/HeaderLogo.vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';
import { BackButton, Button } from '@aergo-connect/lib-ui/src/buttons';
import InvertedColors from '@aergo-connect/lib-ui/src/theme/InvertedColors.vue'; 
import { Elide } from '@aergo-connect/lib-ui/src/content';
import { getExplorerUrl } from '../utils/chain-urls';

export default Vue.extend({
  components: {
    Header,
    HeaderLogo,
    BackButton,
    InvertedColors,
    Elide,
    Icon,
    Button,
  },
  computed: {
    explorerUrl() {
      return getExplorerUrl(this.$route.params.chainId, `account/${this.$route.params.address}`);
    }
  },
  methods: {
    gotoExplorer() {
      window.open(this.explorerUrl);
    },
  },
});
</script>

<style lang="scss">
.account-header {
  background-color: #272727;
  color: #fff;

  .header-logo {
    margin-left: 3px;
  }

  .account-identifier {
    flex: 1;
    overflow: hidden;
    
    display: flex;
    flex-direction: column;
  
    font-size: (13/16)*1rem;
    line-height: 1.3;
    transform: translateY(1px);

    .address {
      font-weight: 500;
    }
  }
}
</style>
