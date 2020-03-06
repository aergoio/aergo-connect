<template>
  <ScrollView class="page">
    <template #header>
      <AccountHeader></AccountHeader>
    </template>

    <RouteTransition>
      <router-view></router-view>
    </RouteTransition>
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import RouteTransition from '@aergo-connect/lib-ui/src/nav/RouteTransition.vue';
import AccountHeader from '../components/AccountHeader.vue';

export default Vue.extend({
  components: {
    ScrollView,
    AccountHeader,
    RouteTransition,
  },
});
</script>

<style lang="scss">

</style>
