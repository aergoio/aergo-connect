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
      <router-link :to="{ name: 'account-connect' }" v-if="isHardwareWalletEnabled">
        <span>
          <Icon name="account-connect" :size="36" />
          Connect Hardware Wallet
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

  get isHardwareWalletEnabled() {
    return this.$store.getters['ui/getSetting']('features.enableHardwareWallet');
  }
}
</script>

<style lang="scss">
.dialog-options > * > span {
  display: flex;
  align-items: center;
  .icon {
    margin-right: 20px;
  }
}
</style>