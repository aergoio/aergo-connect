<template>
  <div class="content">
    Redirecting...
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'

@Component
export default class RequestSelectAccount extends Vue {
  mounted() {
   this.redirectToRequest();
  }
  async redirectToRequest() {
    const activeAccount = await this.$background.getActiveAccount();
    if (!activeAccount) {
      return this.$router.push({ name: 'request-accounts-list'});
    }
    this.$router.push({ name: 'request-select-action', params: activeAccount.data.spec });
  }
}
</script>

<style lang="scss">
</style>