<template>
  <ScrollView class="page">
    <div class="content">
     History
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
export default class AccountHistory extends Vue {
}
</script>

<style lang="scss">
</style>