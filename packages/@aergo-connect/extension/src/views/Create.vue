<template>
  <ScrollView class="page">
    <div class="content">
      <BackButton />
      <h1>Create</h1>
      <p>To get started, please configure a network.</p>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import ScrollView from '@aergo-connect/lib-ui/src/layouts/ScrollView.vue';
import { BackButton } from '@aergo-connect/lib-ui/src/buttons';

export default Vue.extend({
  components: {
    ScrollView,
    BackButton,
  },
});
</script>