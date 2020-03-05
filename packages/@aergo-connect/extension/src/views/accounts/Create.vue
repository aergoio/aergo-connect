<template>
  <ScrollView class="page">
    <div class="content">
      <section class="dialog-header">
        <BackButton />
      </section>
      <h1>Create</h1>
      <p>To get started, please configure a network.</p>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import { BackButton } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';

export default Vue.extend({
  components: {
    ScrollView,
    BackButton,
  },
});
</script>

<style lang="scss">
.dialog-header {
  margin: 10px 0 20px;
}
</style>