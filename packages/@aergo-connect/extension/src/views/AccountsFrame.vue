<template>
  <ScrollView class="page">
    <template #header>
      <Header>
        <HeaderLogo />
      </Header>
    </template>

    <RouteTransition>
      <router-view></router-view>
    </RouteTransition>
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import { ScrollView, Header } from '@aergo-connect/lib-ui/src/layouts';
import HeaderLogo from '@aergo-connect/lib-ui/src/icons/HeaderLogo.vue';
import RouteTransition from '@aergo-connect/lib-ui/src/nav/RouteTransition.vue';

export default Vue.extend({
  components: {
    ScrollView,
    Header,
    HeaderLogo,
    RouteTransition,
  },
});
</script>

<style lang="scss">

</style>
