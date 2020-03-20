<template>
  <ScrollView class="page">
    <div class="content">
     <BackButton />
    <Heading tag="h2">Confirm</Heading>
    <p>Recipient: {{txBody.to}}</p>
    <p>Amount: {{txBody.amount}} {{txBody.unit}}</p>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { BackButton } from '@aergo-connect/lib-ui/src/buttons';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';

import { PersistInputsMixin } from '../../../store/ui';

import Component, { mixins } from 'vue-class-component';
@Component({
  components: {
    ScrollView,
    BackButton,
    Heading,
  },
})
export default class AccountSendConfirm extends mixins(PersistInputsMixin) {
  persistFields = ['txBody'];
  persistFieldsKey = 'send';
  persistInitialValues = false;

  txBody = {};
}
</script>

<style lang="scss">
</style>