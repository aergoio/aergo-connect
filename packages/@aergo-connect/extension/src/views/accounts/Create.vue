<template>
  <ScrollView class="page">
    <div class="content">
      <section class="dialog-header">
        <BackButton />
      </section>
      <Heading animated>Create</Heading>
      <p>To get started, please select a network.</p>
      <SelectField variant="main" :options="options" v-model="value" modal-sheet dropdownTitle="Network" />
    </div>
  </ScrollView>
</template>

<script lang="ts">
import Vue from 'vue';
import { BackButton } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import SelectField from '@aergo-connect/lib-ui/src/forms/SelectField.vue';

export default Vue.extend({
  components: {
    ScrollView,
    BackButton,
    Heading,
    SelectField,
  },
  data() {
    return {
      value: 'aergo.io',
      options: ['aergo.io', 'testnet.aergo.io'],
    };
  }
});
</script>

<style lang="scss">
.dialog-header {
  margin: 10px 0 20px;
}
</style>