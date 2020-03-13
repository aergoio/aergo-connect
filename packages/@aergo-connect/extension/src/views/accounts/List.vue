<template>
  <ScrollView class="page">
    <div class="content">
      <Heading>Accounts</Heading>
      <p><router-link :to="{ name: 'account-details', params: { address: 'Abcdefg' } }" class="text-link">Example</router-link></p>
      <p><router-link :to="{ name: 'account-create' }" class="text-link">Create</router-link></p>
      <p><router-link :to="{ name: 'welcome' }" class="text-link">Welcome view</router-link></p>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';

import Vue from 'vue';
import Component from 'vue-class-component'

@Component({
  components: {
    ScrollView,
    Heading,
  },
})
export default class AccountsList extends Vue {
}
</script>

<style lang="scss">
</style>