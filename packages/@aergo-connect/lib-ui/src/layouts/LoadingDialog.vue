<template>
  <ModalDialog :visible="visible" :title="title" @close="$emit('close')">
    <div class="content loading-dialog-content">
      <LoadingIndicator v-if="state === 'loading'" :size="36" />
      <SuccessIcon v-if="state === 'success'" :size="36" />
      <Icon name="danger-big" v-if="state === 'error'" :size="36" />
      <div class="message"><slot></slot></div>
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
  @Prop({ type: String, default: 'Loading' }) readonly title!: string;
  @Prop({ type: String, default: 'loading' }) readonly state!: 'loading' | 'error' | 'success';
}
</script>

<style lang="scss">
.modal-dialog > .loading-dialog-content {
  text-align: center;
  padding-top: 10px;
  .message {
    margin-top: 16px;
    font-size: (14/16)*1rem;
    p {
      margin-bottom: 0;
    }
    .error {
      color: #EE4648;
    }
  }
}
</style>