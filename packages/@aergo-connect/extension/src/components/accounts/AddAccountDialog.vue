<template>
  <ModalDialog :visible="visible" title="Add Account" @close="$emit('close')">
    <div class="dialog-options" @click.capture="$emit('close')">
      <router-link :to="{ name: 'account-create' }">
        <span>
          <Icon name="account-create" :size="36" />
          Create Account
        </span>
      </router-link>
      <router-link :to="{ name: 'account-import' }">
        <span>
          <Icon name="account-import" :size="36" />
          Import Account
        </span>
      </router-link>
      <span @click="openConnectHardwareWalletTab" v-if="isHardwareWalletEnabled">
        <span  >
          <Icon name="account-connect" :size="36" />
          Connect Hardware Wallet
        </span>
      </span>
    </div>
  </ModalDialog>
</template>

<script lang="ts">
import extension from 'extensionizer';

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

  get isHardwareWalletEnabled(): boolean {
    return this.$store.getters['ui/getSetting']('features.enableHardwareWallet');
  }

  openConnectHardwareWalletTab() {
    const name = (this.$root as any).name;
    if (name === 'popup') {
      extension.tabs.create({url: "index.html#/accounts/connect-hw"});
    } else {
      this.$router.push({ name: 'account-connect-hw' });
    }
  }
}
</script>
