<template>
  <div class="content">
    Redirecting...
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import { ExternalRequest } from '../../background/request';

@Component
export default class RequestSelect extends Vue {
  mounted() {
   this.redirectToRequest();
  }
  async redirectToRequest() {
    const { action } = await this.$store.dispatch('request/getRequest') as ExternalRequest;
    console.log('redirect to action', action);
    const actionToRouteName: Record<typeof action, string> = {
      'ACTIVE_ACCOUNT': 'request-address',
      'SIGN': 'request-sign',
      'SIGN_TX': 'request-sign-tx',
      'SEND_TX': 'request-send',
    };
    const routeName = actionToRouteName[action];
    this.$router.push({ name: routeName });
  }
}
</script>

<style lang="scss">
</style>