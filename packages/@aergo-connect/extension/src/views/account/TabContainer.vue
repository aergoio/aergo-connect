<template>
  <div class="tab-container">
    <TabBar>
      <router-link :to="{ name: 'account-details' }"><Icon name="tab-wallet" :size="32" /></router-link>
      <router-link :to="{ name: 'account-send' }"><Icon name="tab-send" :size="32" /></router-link>
      <router-link :to="{ name: 'account-sign' }" v-if="isSignMessageEnabled"><Icon name="tab-sign" :size="32" /></router-link>
      <router-link :to="{ name: 'account-history' }"><Icon name="tab-history" :size="32" /></router-link>
    </TabBar>
    <RouteTransition defaultTransition="fade">
      <router-view></router-view>
    </RouteTransition>
  </div>
</template>

<script lang="ts">
import RouteTransition from '@aergo-connect/lib-ui/src/nav/RouteTransition.vue';
import TabBar from '@aergo-connect/lib-ui/src/nav/TabBar.vue';
import Icon from '@aergo-connect/lib-ui/src/icons/Icon.vue';

import Vue from 'vue';
import Component from 'vue-class-component'

@Component({
  components: {
    TabBar,
    Icon,
    RouteTransition,
  },
})
export default class TabFrame extends Vue {
  get isSignMessageEnabled(): boolean {
    return this.$store.getters['ui/getSetting']('features.enableSignMessage');
  }
}
</script>

<style lang="scss">
.tab-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  > .scroll-view {
    flex: 1;
    max-height: calc(100% - 48px);
  }
}
</style>