<template>
  <div style="height: 100%;">
    <TabBar>
      <router-link :to="{ name: 'account-details' }"><Icon name="tab-wallet" :size="32" /></router-link>
      <router-link :to="{ name: 'account-send' }"><Icon name="tab-send" :size="32" /></router-link>
      <router-link :to="{ name: 'account-history' }"><Icon name="tab-history" :size="32" /></router-link>
    </TabBar>
    <router-view></router-view>
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
}
</script>

<style lang="scss">
</style>