<template>
  <ModalDialog :visible="visible" @close="$emit('close')">
    <div class="content loading-dialog-content">
      <LoadingIndicator v-if="state === 'loading'" :size="56" />
      <SuccessIcon v-if="state === 'success'" :size="56" />
      <Icon name="failed" v-if="state === 'error'" :size="56" />
      <div class="message"><slot></slot></div>
      <Icon name="downarrow" class="dialog-error-close-btn" v-if="state === 'error'" :size="24" @click.native="$emit('close')" />
    </div>
  </ModalDialog>
</template>

<script lang="ts">
import { ModalDialog } from '@aergo-connect/lib-ui/src/layouts';
import { Icon, LoadingIndicator, SuccessIcon } from '@aergo-connect/lib-ui/src/icons';

import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({
  components: {
    ModalDialog,
    LoadingIndicator,
    SuccessIcon,
    Icon,
  },
})
export default class LoadingDialog extends Vue {
  @Prop(Boolean) readonly visible!: boolean;
  @Prop({ type: String, default: 'loading' }) readonly state!: 'loading' | 'error' | 'success';
}
</script>

<style lang="scss">
.modal-dialog > .loading-dialog-content {
  text-align: center;
  padding: 40px 20px;
  .message {
    margin-top: 20px;
    font-size: (13/16)*1rem;
    color: #222222;
    p {
      margin-bottom: 0;
    }
    .error {
      color: #EE4648;
    }
  }
  .dialog-error-close-btn {
    cursor: pointer;
    margin-top: 30px;
    margin-bottom: -18px;
  }
}
</style>