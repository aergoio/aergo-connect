<template>
  <ScrollView class="page">
    <div class="content">
      <Heading>Settings</Heading>
      <p class="settings-group">Accounts</p>
      <div class="settings-list">
        <SwitchButton v-model="features.enableHardwareWallet" label="Enable experimental hardware wallet support" />
        <SwitchButton v-model="features.enableSignMessage" label="Enable sign custom message support" />
      </div>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';
import { SwitchButton } from '@aergo-connect/lib-ui/src/forms';
import { PersistInputsMixin } from '../../store/ui';

import Component, { mixins } from 'vue-class-component';

@Component({
  components: {
    ScrollView,
    Heading,
    SwitchButton,
  },
})
export default class Import extends mixins(PersistInputsMixin) {
  features = {
    enableHardwareWallet: false,
    enableSignMessage: false,
  };
  persistFields = ['features'];
  persistFieldsKey = 'settings';
}
</script>

<style lang="scss">
.settings-group {
  font-size: (13/16)*1rem;
  font-weight: 500;
  color: #666;
  margin-bottom: .5em;
}
.settings-list .switch-button {
  margin-bottom: .5em;
}
</style>