<template>
  <ModalDialog :visible="visible" title="Export Account" @close="$emit('close')">
    <div class="dialog-options" @click.capture="$emit('close')">
      <router-link :to="{ name: 'account-export-keystore' }">
        <span>
          <Icon name="account-export" :size="36" />
          Export as Keystore File
        </span>
      </router-link>
      <router-link :to="{ name: 'account-export-wif' }">
        <span>
          <Icon name="account-export" :size="36" />
          Export as Encrypted String
        </span>
      </router-link>
    </div>
  </ModalDialog>
</template>

<script lang="ts">
import { ModalDialog } from '@aergo-connect/lib-ui/src/layouts';
import { Icon } from '@aergo-connect/lib-ui/src/icons';

import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({
  components: {
    Icon,
    ModalDialog,
  },
})
export default class AddAccountDialog extends Vue {
  @Prop(Boolean) readonly visible = false;
}
</script>
