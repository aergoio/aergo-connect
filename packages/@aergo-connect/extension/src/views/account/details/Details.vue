<template>
  <ScrollView class="page">
    <div class="content">
     <p>Details</p>
     <p><router-link :to="{ name: 'account-export' }" class="text-link">Export</router-link></p>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';

import Vue from 'vue';
import Component from 'vue-class-component'

@Component({
  components: {
    ScrollView,
  },
})
export default class AccountDetails extends Vue {
}
</script>

<style lang="scss">
</style>