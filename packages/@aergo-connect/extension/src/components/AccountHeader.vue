<template>
  <InvertedColors>
    <Header class="account-header">
      <BackButton />
      <HeaderLogo />
      <div class="account-identifier">
        <Elide class="address" :text="$route.params.address" mode="middle-fixed-tail" expect-ellipsis />
        <Elide class="network" :text="networkName" mode="head" />
      </div>
      <Button @click="gotoScan" type="icon" class="scan-button"><Icon name="link" :size="36" /></Button>
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
    networkName() {
      return `aergo.io`;
    },
  },
  methods: {
    gotoScan() {
      console.log('TODO: open Aergoscan');
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

    .address, .network {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .elide {
      display: flex;
      max-width: 100%;
      user-select: all;
      .head, .tail {
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 1em;
      }
      .tail {
        direction: rtl;
        text-align: left;
      }
    }

    .address {
      font-weight: 500;
    }
  }
}
</style>
