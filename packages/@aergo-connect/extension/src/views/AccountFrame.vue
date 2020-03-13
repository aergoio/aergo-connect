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
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import RouteTransition from '@aergo-connect/lib-ui/src/nav/RouteTransition.vue';
import AccountHeader from '../components/AccountHeader.vue';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';

import Vue from 'vue';
import Component from 'vue-class-component'

@Component({
  components: {
    ScrollView,
    Heading,
    AccountHeader,
    RouteTransition,
  },
})
export default class AccountFrame extends Vue {
}
</script>

<style lang="scss">
</style>