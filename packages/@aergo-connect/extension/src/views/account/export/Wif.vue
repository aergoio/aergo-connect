<template>
  <ScrollView class="page">
    <div class="content">
     <BackButton />
    <Heading tag="h2">Export as Enc. String</Heading>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';

import Vue from 'vue';
import Component from 'vue-class-component'
import { BackButton } from '@aergo-connect/lib-ui/src/buttons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';

@Component({
  components: {
    ScrollView,
    BackButton,
    Heading,
  },
})
export default class AccountExportWif extends Vue {
}
</script>

<style lang="scss">
</style>